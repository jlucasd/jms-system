
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Rental, Cost } from '../../App';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Declaração para evitar erro de TS2580 se @types/node não estiver instalado
declare const process: {
  env: {
    API_KEY: string;
  };
};

interface CaptainJMSScreenProps {
    currentUser: User | null;
    onClose: () => void;
    dataContext: {
        rentals: Rental[];
        costs: Cost[];
    }
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const CaptainJMSScreen: React.FC<CaptainJMSScreenProps> = ({ currentUser, onClose, dataContext }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Olá **${currentUser?.fullName?.split(' ')[0] || 'tripulante'}**! ⚓\n\nEu sou o **Capitão JMS**. Tenho acesso aos dados atuais da frota. Como posso ajudar com os Jets ou finanças hoje?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Preparar resumo dos dados para o contexto da IA
    const contextSummary = useMemo(() => {
        const totalRentals = dataContext.rentals.length;
        const totalRevenue = dataContext.rentals.reduce((acc, r) => acc + r.value, 0);
        const totalCosts = dataContext.costs.reduce((acc, c) => acc + c.value, 0);
        const pendingRentals = dataContext.rentals.filter(r => r.status === 'Pendente').length;
        
        // Pegar as 5 últimas locações para contexto recente
        const recentRentals = dataContext.rentals.slice(0, 5).map(r => 
            `- ${r.date}: ${r.clientName} (${r.rentalType}) - Status: ${r.status}`
        ).join('\n');

        return `
        DADOS ATUAIS DO SISTEMA:
        - Total de Locações Registradas: ${totalRentals}
        - Faturamento Total Acumulado: R$ ${totalRevenue.toFixed(2)}
        - Custos Totais Acumulados: R$ ${totalCosts.toFixed(2)}
        - Locações com Status 'Pendente': ${pendingRentals}
        
        ÚLTIMAS 5 LOCAÇÕES:
        ${recentRentals}
        `;
    }, [dataContext]);

    // Prompt do sistema aprimorado com dados reais
    const systemInstruction = `
        Você é o "Capitão JMS", um assistente de inteligência artificial especializado na gestão da empresa JMS (Aluguel de Jet Skis).
        
        **SEU CONTEXTO DE DADOS (Use isso para responder perguntas):**
        ${contextSummary}

        **Diretrizes de Personalidade:**
        *   Seu tom deve ser profissional, prestativo e com leves toques náuticos (ex: "capitão", "navegar", "mar calmo").
        *   Você fala estritamente sobre: Gestão de Jet Skis, Locações, Clientes, Manutenção e Finanças da JMS.
        *   Se o usuário perguntar sobre algo fora desse escopo (ex: política, futebol, receitas de bolo), responda educadamente que você só cuida da frota da JMS.
        *   O usuário atual é ${currentUser?.fullName || 'um membro da equipe'}.

        **Diretrizes de Formatação:**
        *   Use **Markdown** para formatar. Negrito em valores e nomes.
        *   Seja conciso. Você está em uma janela de chat pequena. Evite textos longos desnecessários.
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

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Header Compacto */}
            <div className="bg-primary p-4 flex items-center justify-between shrink-0 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base leading-tight">Capitão JMS</h3>
                        <p className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[#e5ddd5] relative">
                 <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
                     style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} z-0`}
                    >
                        <div className={`
                            max-w-[85%] rounded-lg p-2.5 shadow-sm relative text-sm
                            ${msg.sender === 'user' 
                                ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none'
                            }
                        `}>
                            <div className="markdown-body text-xs leading-relaxed break-words">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                            <div className="flex items-center justify-end gap-1 mt-1 select-none opacity-60">
                                <span className="text-[9px]">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex justify-start w-full z-0">
                        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                            <div className="flex space-x-1 items-center h-2">
                                <div className="size-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                                <div className="size-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                                <div className="size-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite]"></div>
                            </div>
                        </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 z-10 shrink-0 border-t border-gray-200">
                <form 
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2"
                >
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pergunte ao Capitão..."
                        className="flex-1 bg-gray-100 text-gray-800 text-sm placeholder:text-gray-500 py-2.5 px-4 rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className={`size-10 rounded-full flex items-center justify-center transition-all shadow-sm ${!inputValue.trim() || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 active:scale-95'}`}
                    >
                        <span className="material-symbols-outlined filled text-lg translate-x-0.5 translate-y-0.5">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CaptainJMSScreen;
