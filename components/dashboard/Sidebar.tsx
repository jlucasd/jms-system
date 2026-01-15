
import React, { useState, useEffect } from 'react';
import { User, DashboardPage } from '../../App';

interface NavLinkProps {
    icon: string;
    label: string;
    page: DashboardPage;
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, page, activePage, onNavigate }) => {
    const isActive = page === activePage;
    const activeClasses = "bg-primary/10 text-primary border-l-4 border-primary font-bold";
    const inactiveClasses = "hover:bg-gray-50 text-[#58738d] font-medium";
    const iconClasses = isActive ? "material-symbols-outlined filled" : "material-symbols-outlined";

    return (
        <a 
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate(page);
            }}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            <span className={iconClasses}>{icon}</span>
            <span className="text-sm">{label}</span>
        </a>
    );
};

interface SidebarProps {
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
    currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, currentUser }) => {
    const [locationInfo, setLocationInfo] = useState('Localizando...');

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Utiliza API gratuita para obter cidade e estado baseada na lat/long
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
                    const data = await response.json();
                    
                    const city = data.city || data.locality || 'Laguna';
                    let state = data.principalSubdivisionCode || 'SC';
                    
                    // A API pode retornar "BR-SC", então removemos o prefixo se existir
                    if (state.includes('-')) {
                        state = state.split('-')[1];
                    }

                    setLocationInfo(`${city}/${state}`);
                } catch (error) {
                    console.error("Erro ao obter localização:", error);
                    setLocationInfo('Laguna/SC'); // Fallback em caso de erro na API
                }
            }, (error) => {
                console.warn("Permissão de localização negada:", error);
                setLocationInfo('Laguna/SC'); // Fallback se permissão negada
            });
        } else {
            setLocationInfo('Laguna/SC');
        }
    }, []);

    // Verifica se tem permissão privilegiada (Gerente ou Financeiro)
    // Se tiver um desses, vê tudo. Se for apenas Colaborador, não vê Dashboards e Usuários.
    const hasFullAccess = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');

    const navItems: { icon: string, label: string, page: DashboardPage }[] = [
        // Dashboard e Painel Financeiro apenas para Gerente/Financeiro
        ...(hasFullAccess ? [
            { icon: "dashboard", label: "Dashboard", page: 'dashboard' as DashboardPage },
            { icon: "insights", label: "Painel Financeiro", page: 'financialDashboard' as DashboardPage }
        ] : []),
        
        // Novo Menu Capitão JMS (IA)
        { icon: "smart_toy", label: "Capitão JMS", page: 'captainJMS' as DashboardPage },

        { icon: "anchor", label: "Locações", page: 'rentals' },
        { icon: "groups", label: "Clientes", page: 'clients' },
        
        // Item Usuários apenas para Gerente/Financeiro
        ...(hasFullAccess ? [{ icon: "manage_accounts", label: "Usuários", page: 'users' as DashboardPage }] : []),
        
        { icon: "payments", label: "Financeiro", page: 'financial' },
        { icon: "settings", label: "Configurações", page: 'settings' },
    ];

    return (
        <aside className="hidden md:flex w-64 flex-col border-r border-[#d3dbe4] bg-white shrink-0 z-20">
            <div className="flex h-full flex-col justify-between p-4">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-primary flex items-center justify-center rounded-lg size-10 text-white shadow-md">
                            <span className="material-symbols-outlined text-[24px]">sailing</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-primary text-lg font-bold leading-tight">JMS Admin</h1>
                            <p className="text-[#58738d] text-xs font-medium uppercase tracking-wider">{locationInfo}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map(item => (
                            <NavLink 
                                key={item.page}
                                {...item}
                                activePage={activePage}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
