
import React from 'react';

interface DashboardFiltersProps {
    selectedYear: string;
    onYearChange: (year: string) => void;
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    selectedLocation: string;
    onLocationChange: (location: string) => void;
    availableLocations: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    selectedYear, onYearChange,
    selectedMonth, onMonthChange,
    selectedLocation, onLocationChange,
    availableLocations
}) => {
    const months = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Gera lista de anos dinamicamente: Ano atual + 3 anos anteriores + 2022
    const currentYear = new Date().getFullYear();
    const generatedYears = [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString(), (currentYear - 3).toString()];
    
    // Garante que 2022 esteja na lista, evitando duplicatas se já estiver incluído no range dinâmico
    const uniqueYears = Array.from(new Set([...generatedYears, '2022'])).sort((a, b) => parseInt(b) - parseInt(a));
    const years = ['Todos', ...uniqueYears];

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined">filter_alt</span>
                Filtros Globais:
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative group">
                    <select 
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-gray-100"
                    >
                        {years.map(year => (
                           <option key={year} value={year}>{year === 'Todos' ? 'Ano: Todos' : `Ano: ${year}`}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
                <div className="relative group">
                    <select 
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-gray-100"
                    >
                        {months.map(month => (
                            <option key={month} value={month}>{month === 'Todos' ? 'Mês: Todos' : month}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
                <div className="relative group">
                    <select 
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-gray-100"
                    >
                        {availableLocations.map(location => (
                            <option key={location} value={location}>
                                {location === 'Todos os Locais' ? 'Local: Todos' : location}
                            </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;
