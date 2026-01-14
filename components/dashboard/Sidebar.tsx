
import React from 'react';
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
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {

    const navItems: { icon: string, label: string, page: DashboardPage }[] = [
        { icon: "dashboard", label: "Dashboard", page: 'dashboard' },
        { icon: "insights", label: "Painel Financeiro", page: 'financialDashboard' },
        { icon: "anchor", label: "Locações", page: 'rentals' },
        { icon: "groups", label: "Clientes", page: 'clients' },
        { icon: "manage_accounts", label: "Usuários", page: 'users' },
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
                            <h1 className="text-primary text-lg font-bold leading-tight">JetSki Admin</h1>
                            <p className="text-[#58738d] text-xs font-medium uppercase tracking-wider">Doca Principal</p>
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
