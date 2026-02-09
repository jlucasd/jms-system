
import React, { useState, useEffect, useMemo } from 'react';
import { RentalLocation } from '../../App';
import { GoogleGenAI } from "@google/genai";

// Declaração para evitar erro de TS2580
declare const process: {
  env: {
    API_KEY: string;
  };
};

interface WeatherScreenProps {
    locations: RentalLocation[];
}

interface WeatherData {
    current: {
        temperature: number;
        windSpeed: number;
        windDirection: number;
        weatherCode: number;
        isDay: number;
    };
    daily: {
        time: string[];
        weatherCode: number[];
        temperatureMax: number[];
        temperatureMin: number[];
        windSpeedMax: number[];
        precipitationProb: number[];
    }
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ locations }) => {
    const [selectedLocationName, setSelectedLocationName] = useState('Minha Localização');
    const [displayCityName, setDisplayCityName] = useState('Minha Localização'); 
    const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [geminiAnalysis, setGeminiAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mapeamento de códigos WMO
    const getWeatherInfo = (code: number, isDay: number = 1) => {
        const map: {[key: number]: {icon: string, label: string}} = {
            0: { icon: 'sunny', label: 'Céu Limpo' },
            1: { icon: 'partly_cloudy_day', label: 'Principalmente Limpo' },
            2: { icon: 'partly_cloudy_day', label: 'Parcialmente Nublado' },
            3: { icon: 'cloud', label: 'Nublado' },
            45: { icon: 'foggy', label: 'Nevoeiro' },
            48: { icon: 'foggy', label: 'Nevoeiro com Geada' },
            51: { icon: 'rainy_light', label: 'Garoa Leve' },
            53: { icon: 'rainy', label: 'Garoa Moderada' },
            55: { icon: 'rainy_heavy', label: 'Garoa Densa' },
            61: { icon: 'rainy', label: 'Chuva Fraca' },
            63: { icon: 'rainy', label: 'Chuva Moderada' },
            65: { icon: 'rainy_heavy', label: 'Chuva Forte' },
            80: { icon: 'rainy', label: 'Pancadas Leves' },
            81: { icon: 'rainy', label: 'Pancadas Moderadas' },
            82: { icon: 'rainy_heavy', label: 'Pancadas Fortes' },
            95: { icon: 'thunderstorm', label: 'Tempestade' },
            96: { icon: 'thunderstorm', label: 'Tempestade com Granizo' },
            99: { icon: 'thunderstorm', label: 'Tempestade Forte' },
        };
        return map[code] || { icon: 'question_mark', label: 'Desconhecido' };
    };

    useEffect(() => {
        const fetchLocation = async () => {
            setIsLoading(true);
            setError(null);
            setWeatherData(null);
            setGeminiAnalysis('');

            if (selectedLocationName === 'Minha Localização') {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            setCoords({ lat, lon });
                            try {
                                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                                const data = await response.json();
                                const city = data.address.city || data.address.town || data.address.village || 'Localização Detectada';
                                setDisplayCityName(city);
                            } catch (e) {
                                console.warn("Erro ao obter nome da cidade", e);
                                setDisplayCityName("Localização Atual");
                            }
                        },
                        (err) => {
                            console.error(err);
                            setError("Permissão de localização negada.");
                            setIsLoading(false);
                        }
                    );
                } else {
                    setError("Geolocalização não suportada.");
                    setIsLoading(false);
                }
            } else {
                setDisplayCityName(selectedLocationName);
                try {
                    const query = encodeURIComponent(`${selectedLocationName}, Santa Catarina, Brazil`);
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setCoords({
                            lat: parseFloat(data[0].lat),
                            lon: parseFloat(data[0].lon)
                        });
                    } else {
                        setError("Local não encontrado.");
                        setIsLoading(false);
                    }
                } catch (err) {
                    console.error(err);
                    setError("Erro ao buscar coordenadas.");
                    setIsLoading(false);
                }
            }
        };
        fetchLocation();
    }, [selectedLocationName]);

    useEffect(() => {
        if (!coords) return;
        const fetchWeather = async () => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=5`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.error) throw new Error(data.reason);

                const mappedData: WeatherData = {
                    current: {
                        temperature: data.current.temperature_2m,
                        windSpeed: data.current.wind_speed_10m,
                        windDirection: data.current.wind_direction_10m,
                        weatherCode: data.current.weather_code,
                        isDay: data.current.is_day
                    },
                    daily: {
                        time: data.daily.time,
                        weatherCode: data.daily.weather_code,
                        temperatureMax: data.daily.temperature_2m_max,
                        temperatureMin: data.daily.temperature_2m_min,
                        windSpeedMax: data.daily.wind_speed_10m_max,
                        precipitationProb: data.daily.precipitation_probability_max
                    }
                };
                setWeatherData(mappedData);
                generateGeminiAnalysis(mappedData);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar previsão.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchWeather();
    }, [coords]);

    const generateGeminiAnalysis = async (data: WeatherData) => {
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
            Atue como um Capitão especialista em Jet Skis da empresa JMS.
            Analise os dados meteorológicos para **${displayCityName}**.
            
            DADOS ATUAIS:
            - Temp: ${data.current.temperature}°C, Vento: ${data.current.windSpeed} km/h, Condição: Código ${data.current.weatherCode}.
            
            PREVISÃO FUTURA:
            ${data.daily.time.map((t, i) => `- ${t}: Vento ${data.daily.windSpeedMax[i]} km/h, Chuva ${data.daily.precipitationProb[i]}%`).join('\n')}

            REGRAS: Vento < 15km/h (Bom), 15-25km/h (Atenção), > 25km/h (Ruim).

            TAREFA:
            Dê um Veredito de Navegação com STATUS (Excelente, Atenção ou Ruim), explicação técnica breve e recomendação.
            NÃO use formatação Markdown pesada (como # headers). Use texto limpo e direto.
            `;

            const result = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt
            });
            
            setGeminiAnalysis(result.text || "Sem análise.");
        } catch (err) {
            console.error(err);
            setGeminiAnalysis("Análise indisponível.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Função para limpar e renderizar o texto do Gemini sem caracteres Markdown
    const renderCleanAnalysis = (text: string) => {
        if (!text) return null;
        
        return text.split('\n').map((line, index) => {
            const cleanLine = line
                .replace(/\*\*/g, '') // Remove negrito
                .replace(/#/g, '')    // Remove headers
                .replace(/^\*\s*/, '') // Remove bulletpoints de asterisco
                .replace(/^-\s*/, '')  // Remove bulletpoints de traço
                .trim();

            if (!cleanLine) return <br key={index} className="block content-[''] mb-2" />;

            // Se a linha parecia um item de lista, adiciona um bullet visual
            if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                return (
                    <div key={index} className="flex gap-2 ml-2 mb-1">
                        <span className="text-secondary font-bold">•</span>
                        <span className="text-gray-100">{cleanLine}</span>
                    </div>
                );
            }

            return <p key={index} className="mb-1 text-gray-100">{cleanLine}</p>;
        });
    };

    const getWindDirection = (degrees: number) => {
        const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
        return directions[Math.round(degrees / 45) % 8];
    };

    const getWindColor = (speed: number) => {
        if (speed < 15) return 'text-emerald-500';
        if (speed < 25) return 'text-amber-500';
        return 'text-red-500';
    };

    const getWindLabel = (speed: number) => {
        if (speed < 15) return 'Calmo';
        if (speed < 25) return 'Moderado';
        return 'Forte';
    };

    // Nova lógica para o status do dia na lista
    const getDailyStatus = (windSpeed: number, rainProb: number) => {
        if (windSpeed > 25) return { label: 'Ruim 🔴', color: 'bg-red-100 text-red-700 border-red-200' };
        if (windSpeed >= 15 || rainProb >= 60) return { label: 'Atenção 🟡', color: 'bg-amber-100 text-amber-800 border-amber-200' };
        return { label: 'Bom 🟢', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">weather_mix</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Previsão do Tempo</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Monitoramento meteorológico para segurança da navegação.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined">pin_drop</span>
                    Localização:
                </div>
                <div className="relative w-full md:w-auto min-w-[250px]">
                    <select 
                        value={selectedLocationName}
                        onChange={(e) => setSelectedLocationName(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-gray-100 transition-all"
                    >
                        <option value="Minha Localização">Minha Localização Atual</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
            ) : weatherData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fade-in-up_0.3s_ease-out]">
                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-[150px]">
                                {getWeatherInfo(weatherData.current.weatherCode, weatherData.current.isDay).icon}
                            </span>
                        </div>
                        
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6">
                            Agora em <span className="text-primary">{displayCityName}</span>
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-6xl text-primary">
                                {getWeatherInfo(weatherData.current.weatherCode, weatherData.current.isDay).icon}
                            </span>
                            <div>
                                <div className="text-5xl font-bold text-gray-800">{Math.round(weatherData.current.temperature)}°C</div>
                                <div className="text-gray-500 font-medium">{getWeatherInfo(weatherData.current.weatherCode).label}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Vento</div>
                                <div className={`text-xl font-bold flex items-center gap-1 ${getWindColor(weatherData.current.windSpeed)}`}>
                                    <span className="material-symbols-outlined text-lg" style={{ transform: `rotate(${weatherData.current.windDirection}deg)` }}>navigation</span>
                                    {Math.round(weatherData.current.windSpeed)} km/h
                                </div>
                                <div className="text-xs text-gray-500">{getWindLabel(weatherData.current.windSpeed)} • {getWindDirection(weatherData.current.windDirection)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Chuva (Hoje)</div>
                                <div className="text-xl font-bold text-blue-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">water_drop</span>
                                    {weatherData.daily.precipitationProb[0]}%
                                </div>
                                <div className="text-xs text-gray-500">Probabilidade Máx.</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Card Análise do Capitão */}
                        <div className="bg-gradient-to-br from-primary to-[#132d4a] rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl">smart_toy</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="flex items-center gap-2 text-lg font-bold mb-3 text-secondary">
                                    <span className="material-symbols-outlined">sailing</span>
                                    RELATÓRIO DE NAVEGAÇÃO JMS
                                </h3>
                                {isAnalyzing ? (
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="size-4 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
                                        <p className="text-sm text-gray-300">Consultando condições de mar e vento...</p>
                                    </div>
                                ) : (
                                    <div className="text-sm md:text-base leading-relaxed">
                                        {renderCleanAnalysis(geminiAnalysis)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lista de Previsão 5 Dias */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-sm font-bold text-gray-700 uppercase">Previsão para os próximos 5 Dias</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {weatherData.daily.time.map((date, index) => {
                                    const dateObj = new Date(date);
                                    const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' });
                                    const dayMonth = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                                    const windSpeed = weatherData.daily.windSpeedMax[index];
                                    const rainProb = weatherData.daily.precipitationProb[index];
                                    const status = getDailyStatus(windSpeed, rainProb);
                                    
                                    return (
                                        <div key={date} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col w-16">
                                                    <span className="text-sm font-bold text-gray-800 capitalize">{weekday}</span>
                                                    <span className="text-xs text-gray-500">{dayMonth}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-2xl text-gray-400">
                                                        {getWeatherInfo(weatherData.daily.weatherCode[index]).icon}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {getWeatherInfo(weatherData.daily.weatherCode[index]).label}
                                                        </span>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="text-red-400 font-bold">{Math.round(weatherData.daily.temperatureMax[index])}°</span>
                                                            <span className="text-blue-400 font-bold">{Math.round(weatherData.daily.temperatureMin[index])}°</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 justify-between sm:justify-end flex-1">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Chuva</span>
                                                    <span className="text-sm font-bold text-blue-600">{rainProb}%</span>
                                                </div>
                                                <div className="flex flex-col items-end w-20">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Vento Max</span>
                                                    <span className={`text-sm font-bold ${getWindColor(windSpeed)}`}>
                                                        {Math.round(windSpeed)} km/h
                                                    </span>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color} min-w-[80px] text-center`}>
                                                    {status.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default WeatherScreen;
