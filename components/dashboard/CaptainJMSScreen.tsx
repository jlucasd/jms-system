
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface CaptainJMSScreenProps {
    currentUser: User | null;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const CaptainJMSScreen: React.FC<CaptainJMSScreenProps> = ({ currentUser }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Olá **${currentUser?.fullName?.split(' ')[0] || 'tripulante'}**! ⚓\n\nEu sou o **Capitão JMS**. Estou aqui para ajudar com:\n\n*   Gestão da frota\n*   Dicas de manutenção\n*   Resumo financeiro\n\nO que manda hoje?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Prompt do sistema aprimorado para formatação
    const systemInstruction = `
        Você é o "Capitão JMS", um assistente de inteligência artificial especializado em gestão de frotas de Jet Skis para a empresa JMS.
        
        **Diretrizes de Personalidade:**
        *   Seu tom deve ser profissional, experiente, porém amigável.
        *   Use analogias náuticas sutis (ex: "navegar pelos dados", "mar calmo nas finanças").
        *   O usuário atual se chama ${currentUser?.fullName || 'Usuário'}.

        **Diretrizes de Formatação (MUITO IMPORTANTE):**
        *   Use **Markdown** para formatar suas respostas.
        *   Use **negrito** para destacar valores, nomes importantes ou conclusões.
        *   Use listas (bullet points) para listar passos, itens ou sugestões.
        *   Pule linhas para separar parágrafos e facilitar a leitura.
        *   Se for apresentar números, organize-os de forma clara.

        **Objetivo:**
        Ajude com gestão, manutenção de jet skis, atendimento ao cliente e finanças. Responda sempre em português do Brasil.
    `;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const chat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: systemInstruction,
                },
                history: messages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }))
            });

            const result = await chat.sendMessageStream({ message: userMessage.text });
            
            let fullResponseText = '';
            const aiMessageId = Date.now() + 1;
            
            // Adiciona mensagem vazia para começar o streaming
            setMessages(prev => [...prev, {
                id: aiMessageId,
                text: '',
                sender: 'ai',
                timestamp: new Date()
            }]);

            for await (const chunk of result) {
                const c = chunk as GenerateContentResponse;
                if (c.text) {
                    fullResponseText += c.text;
                    setMessages(prev => prev.map(msg => 
                        msg.id === aiMessageId ? { ...msg, text: fullResponseText } : msg
                    ));
                }
            }

        } catch (error) {
            console.error("Erro ao comunicar com o Capitão JMS:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Desculpe, marujo. Ocorreu uma tempestade nos meus circuitos. Tente novamente mais tarde.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col h-full bg-[#e5ddd5] relative">
            {/* Background Pattern Style */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
                 style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
            </div>

             {/* Standard Header Section */}
            <div className="shrink-0 p-4 md:p-8 pb-2 z-10">
                <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                            <span className="text-xs font-bold uppercase tracking-wider">IA - Assistente Virtual</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">Capitão JMS</h2>
                        <div className="flex items-center gap-2 mt-1">
                             <p className="text-gray-200 text-sm font-medium">Seu copiloto para gestão de frota e insights.</p>
                             {isLoading && <span className="text-white/70 text-xs animate-pulse bg-white/10 px-2 py-0.5 rounded-full">• Digitando...</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 custom-scrollbar z-0 pb-4">
                {/* Data divider example */}
                <div className="flex justify-center my-2">
                    <span className="bg-white/60 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                        Hoje
                    </span>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] md:max-w-[70%] rounded-xl p-3 shadow-sm relative text-sm
                            ${msg.sender === 'user' 
                                ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none'
                            }
                        `}>
                            {/* Nome do remetente */}
                            {msg.sender === 'ai' && (
                                <p className="text-xs font-bold text-primary mb-1">Capitão JMS</p>
                            )}

                            {/* Conteúdo da Mensagem com Markdown */}
                            <div className="markdown-body leading-relaxed break-words">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>

                            {/* Timestamp e Status */}
                            <div className="flex items-center justify-end gap-1 mt-1 select-none">
                                <span className="text-[10px] text-gray-500">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.sender === 'user' && (
                                    <span className="material-symbols-outlined text-[14px] text-[#53bdeb]">done_all</span>
                                )}
                            </div>
                            
                            {/* Triângulo do balão */}
                            <div className={`absolute top-0 w-0 h-0 border-[8px] border-transparent 
                                ${msg.sender === 'user' 
                                    ? 'right-[-8px] border-t-[#d9fdd3] border-r-0 rounded-tr-sm' 
                                    : 'left-[-8px] border-t-white border-l-0 rounded-tl-sm'
                                }`}>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex justify-start w-full animate-fade-in-up">
                        <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm relative">
                            <div className="flex space-x-1.5 items-center h-4">
                                <div className="size-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                                <div className="size-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                                <div className="size-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite]"></div>
                            </div>
                            <div className="absolute top-0 left-[-8px] w-0 h-0 border-[8px] border-transparent border-t-white border-l-0"></div>
                        </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] px-4 py-3 z-10 shrink-0">
                <form 
                    onSubmit={handleSendMessage}
                    className="max-w-[1400px] mx-auto relative flex items-end gap-2"
                >
                    <div className="bg-white flex-1 rounded-2xl flex items-center border border-transparent focus-within:border-primary/30 transition-colors shadow-sm">
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                        </button>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Digite uma mensagem"
                            className="flex-1 bg-transparent border-none text-gray-800 text-sm placeholder:text-gray-500 py-3 px-1 outline-none h-full"
                            disabled={isLoading}
                        />
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="material-symbols-outlined text-2xl">attach_file</span>
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className={`size-12 rounded-full flex items-center justify-center transition-all shadow-sm ${!inputValue.trim() || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 active:scale-95'}`}
                    >
                        <span className="material-symbols-outlined filled text-xl translate-x-0.5 translate-y-0.5">send</span>
                    </button>
                </form>
                <div className="text-center mt-2">
                     <p className="text-[10px] text-gray-400">O Capitão JMS pode cometer erros. Verifique informações importantes.</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainJMSScreen;
