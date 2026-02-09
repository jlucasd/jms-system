
import React, { useState } from 'react';

const AppDownloadScreen: React.FC = () => {
    const [copiedUser, setCopiedUser] = useState(false);
    const [copiedPass, setCopiedPass] = useState(false);

    const appInfo = {
        iosUrl: "https://apps.apple.com/br/app/gconnect/id1051885508?l=en-GB",
        androidUrl: "https://play.google.com/store/apps/details?id=br.com.getrak.gconnect&hl=pt_BR",
        user: "mayck@gruposetup",
        pass: "Admmms23"
    };

    const copyToClipboard = (text: string, type: 'user' | 'pass') => {
        navigator.clipboard.writeText(text);
        if (type === 'user') {
            setCopiedUser(true);
            setTimeout(() => setCopiedUser(false), 2000);
        } else {
            setCopiedPass(true);
            setTimeout(() => setCopiedPass(false), 2000);
        }
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">smartphone</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Aplicativo</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Rastreamento e monitoramento da frota em tempo real.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Card */}
                <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6 animate-[fade-in-up_0.3s_ease-out]">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-[28px]">info</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Sobre o Aplicativo</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            Este aplicativo de rastreamento serve para monitorar em tempo real a locação que está ocorrendo e, 
                            em caso de contato do cliente por conta de alguma ocorrência, será possível identificar a localização 
                            exata do jet ski.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Credenciais de Acesso
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs text-gray-500 uppercase font-bold">Usuário</span>
                                        <span className="text-primary font-bold font-mono truncate">{appInfo.user}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard(appInfo.user, 'user')}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"
                                    title="Copiar usuário"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{copiedUser ? 'check' : 'content_copy'}</span>
                                </button>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="material-symbols-outlined text-gray-400">key</span>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs text-gray-500 uppercase font-bold">Senha</span>
                                        <span className="text-primary font-bold font-mono truncate">{appInfo.pass}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard(appInfo.pass, 'pass')}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"
                                    title="Copiar senha"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{copiedPass ? 'check' : 'content_copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Links */}
                <div className="flex flex-col gap-6 animate-[fade-in-up_0.4s_ease-out]">
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center gap-6 h-full text-center">
                        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[36px]">download</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">Baixe o GConnect</h3>
                            <p className="text-gray-500 text-sm">Disponível para Android e iOS</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <a 
                                href={appInfo.iosUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition-all shadow-md group"
                            >
                                <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">apple</span>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-gray-400">Download on the</span>
                                    <span className="block text-lg font-bold leading-none">App Store</span>
                                </div>
                            </a>

                            <a 
                                href={appInfo.androidUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition-all shadow-md group"
                            >
                                <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">android</span>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-gray-400">GET IT ON</span>
                                    <span className="block text-lg font-bold leading-none">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppDownloadScreen;
