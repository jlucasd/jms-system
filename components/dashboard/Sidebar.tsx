
import React, { useState, useEffect } from 'react';
import { User, DashboardPage } from '../../App';

interface SidebarProps {
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
    currentUser: User | null;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, currentUser, isOpen = false, onClose }) => {
    const [locationInfo, setLocationInfo] = useState('Localizando...');
    const [isDashboardsOpen, setIsDashboardsOpen] = useState(true);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
                    const data = await response.json();
                    
                    const city = data.city || data.locality || 'Laguna';
                    let state = data.principalSubdivisionCode || 'SC';
                    if (state.includes('-')) {
                        state = state.split('-')[1];
                    }

                    setLocationInfo(`${city}/${state}`);
                } catch (error) {
                    console.error("Erro ao obter localização:", error);
                    setLocationInfo('Laguna/SC');
                }
            }, (error) => {
                console.warn("Permissão de localização negada:", error);
                setLocationInfo('Laguna/SC');
            });
        } else {
            setLocationInfo('Laguna/SC');
        }
    }, []);

    const hasFullAccess = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');

    const activeClasses = "bg-primary/10 text-primary border-r-4 border-primary font-bold";
    const inactiveClasses = "hover:bg-gray-50 text-[#58738d] font-medium border-r-4 border-transparent";
    const iconClasses = (isActive: boolean) => isActive ? "material-symbols-outlined filled" : "material-symbols-outlined";

    return (
        <aside 
            className={`
                fixed md:static inset-y-0 left-0 z-30
                w-64 flex flex-col border-r border-[#d3dbe4] bg-white 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
        >
            <div className="flex flex-col h-full shadow-xl md:shadow-none">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary flex items-center justify-center rounded-xl size-10 text-white shadow-md shadow-primary/20">
                            <span className="material-symbols-outlined text-[24px]">sailing</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-primary text-lg font-bold leading-tight">JMS Admin</h1>
                            <p className="text-[#58738d] text-xs font-medium uppercase tracking-wider">{locationInfo}</p>
                        </div>
                    </div>
                    {/* Close button - Mobile only */}
                    <button 
                        onClick={onClose}
                        className="md:hidden p-1 text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    
                    {/* Grupo Painéis - Apenas Gerente/Financeiro */}
                    {hasFullAccess && (
                        <div className="mb-2">
                            <button 
                                onClick={() => setIsDashboardsOpen(!isDashboardsOpen)}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-primary transition-colors mb-1"
                            >
                                <span>Painéis</span>
                                <span className={`material-symbols-outlined text-[16px] transition-transform ${isDashboardsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            
                            {isDashboardsOpen && (
                                <div className="space-y-1 ml-2 border-l border-gray-100 pl-2">
                                    <a 
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${activePage === 'dashboard' ? activeClasses : inactiveClasses}`}
                                    >
                                        <span className={iconClasses(activePage === 'dashboard')}>dashboard</span>
                                        Visão Geral
                                    </a>
                                    <a 
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); onNavigate('financialDashboard'); }}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${activePage === 'financialDashboard' ? activeClasses : inactiveClasses}`}
                                    >
                                        <span className={iconClasses(activePage === 'financialDashboard')}>insights</span>
                                        Financeiro
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2">
                        <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Operacional</span>
                        
                        <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate('rentals'); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm mb-1 ${activePage === 'rentals' ? activeClasses : inactiveClasses}`}
                        >
                            <span className={iconClasses(activePage === 'rentals')}>anchor</span>
                            Locações
                        </a>

                        <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate('checklists'); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm mb-1 ${activePage === 'checklists' ? activeClasses : inactiveClasses}`}
                        >
                            <span className={iconClasses(activePage === 'checklists')}>checklist</span>
                            Checklists
                        </a>

                        <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate('financial'); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm mb-1 ${activePage === 'financial' ? activeClasses : inactiveClasses}`}
                        >
                            <span className={iconClasses(activePage === 'financial')}>payments</span>
                            Caixa / Custos
                        </a>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Sistema</span>
                        
                        {hasFullAccess && (
                            <a 
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate('users'); }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm mb-1 ${activePage === 'users' ? activeClasses : inactiveClasses}`}
                            >
                                <span className={iconClasses(activePage === 'users')}>manage_accounts</span>
                                Usuários
                            </a>
                        )}

                        <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${activePage === 'settings' ? activeClasses : inactiveClasses}`}
                        >
                            <span className={iconClasses(activePage === 'settings')}>settings</span>
                            Configurações
                        </a>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                    &copy; {new Date().getFullYear()} JMS Admin
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
