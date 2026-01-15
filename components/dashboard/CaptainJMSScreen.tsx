
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

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
            text: `Olá ${currentUser?.fullName?.split(' ')[0] || 'tripulante'}! Eu sou o Capitão JMS. Estou aqui para ajudar com dúvidas sobre a frota, manutenção ou qualquer outra questão sobre o mar. O que manda hoje?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial System Prompt to give context to the AI
    const systemInstruction = `
        Você é o "Capitão JMS", um assistente de inteligência artificial especializado em gestão de frotas de Jet Skis para a empresa JMS.
        Seu tom deve ser profissional, porém amigável e com algumas analogias náuticas sutis.
        Você ajuda o usuário a entender melhor sobre gestão, manutenção de jet skis, atendimento ao cliente e finanças básicas de uma empresa de locação.
        O usuário atual se chama ${currentUser?.fullName || 'Usuário'}.
        Responda sempre em português do Brasil de forma concisa e útil.
    `;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            // Using the new @google/genai SDK format
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Construct history for the chat context
            // Note: The SDK manages history in ai.chats.create if we use that, 
            // but here we are doing a single turn or re-building context manually for simplicity in this UI component pattern,
            // or we can use the chat helper. Let's use the chat helper for better context.
            
            // Filter previous messages to build history (excluding the very last one we just added locally for optimistic UI)
            // Ideally, we'd persist the chat session object, but for this stateless component re-render, we'll re-init.
            // For a production app, store the `chat` instance in a ref or context.
            
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
            
            // Create a placeholder message for the AI response
            const aiMessageId = Date.now() + 1;
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
                text: "Desculpe, marujo. Tivemos uma interferência no rádio. Tente novamente mais tarde.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col h-full max-h-screen">
             {/* Header Section */}
             <div className="w-full shrink-0 relative min-h-[160px] shadow-md flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Inteligência Artificial</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Capitão JMS</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Seu assistente virtual para navegar pelos negócios</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm relative
                            ${msg.sender === 'user' 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }
                        `}>
                            {msg.sender === 'ai' && (
                                <div className="absolute -left-3 -top-3 size-8 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {msg.text}
                            </div>
                            <div className={`text-[10px] mt-2 text-right opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex w-full justify-start">
                         <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                             <div className="flex space-x-1">
                                <div className="size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="size-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form 
                    onSubmit={handleSendMessage}
                    className="max-w-[1400px] mx-auto relative flex items-center gap-2"
                >
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pergunte algo ao Capitão..."
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-4 pr-12 outline-none transition-all shadow-sm"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined filled">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CaptainJMSScreen;
