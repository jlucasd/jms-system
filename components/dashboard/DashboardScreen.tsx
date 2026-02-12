
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './DashboardFilters';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import RentalsChart from './RentalsChart';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import UsersScreen from './UsersScreen';
import AddUserScreen from './AddUserScreen';
import RentalsScreen from './RentalsScreen';
import AddRentalScreen from './AddRentalScreen';
import FinancialScreen from './FinancialScreen';
import AddCostScreen from './AddCostScreen';
import FinancialDashboardScreen from './FinancialDashboardScreen';
import CaptainJMSScreen from './CaptainJMSScreen';
import ChecklistsScreen from './ChecklistsScreen';
import SettingsScreen from './SettingsScreen';
import UserMenu from './UserMenu';
import ClientsScreen from './ClientsScreen';
import AddClientScreen from './AddClientScreen';
import BackupModal from './BackupModal';
import RentalTextScreen from './RentalTextScreen';
import ImportantLinksScreen from './ImportantLinksScreen';
import AppDownloadScreen from './AppDownloadScreen';
import WeatherScreen from './WeatherScreen';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { User, DashboardPage, DashboardUser, Rental, Cost, RentalLocation, FleetItem, PriceTable, Client } from '../../App';

interface DashboardScreenProps {
    currentUser: User | null;
    users: DashboardUser[];
    rentals: Rental[];
    costs: Cost[];
    locations: RentalLocation[];
    fleet: FleetItem[];
    prices: PriceTable;
    clients: Client[];
    rentalStandardText: string;
    onUpdateRentalText: (text: string) => void;
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
    onAddNewUser: (user: DashboardUser) => void;
    onUpdateUser: (user: DashboardUser) => void;
    onDeleteUser: (userId: string) => void;
    onAddNewRental: (rental: Rental) => void;
    onUpdateRental: (rental: Rental) => void;
    onDeleteRental: (rentalId: number) => void;
    onAddNewCost: (cost: Cost) => void;
    onUpdateCost: (cost: Cost) => void;
    onDeleteCost: (costId: number) => void;
    onAddNewLocation: (name: string) => void;
    onUpdateLocation: (id: number, name: string) => void;
    onDeleteLocation: (id: number) => void;
    onUpdatePriceTable: (prices: PriceTable) => void;
    onAddNewClient: (client: Client) => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: number) => void;
    onGenerateRentalsBackup: () => void;
    backupSql: string | null;
    onCloseBackupModal: () => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
    currentUser, users, rentals, costs, locations, fleet, prices, clients, rentalStandardText, onUpdateRentalText, activePage, onNavigate, 
    onAddNewUser, onUpdateUser, onDeleteUser, 
    onAddNewRental, onUpdateRental, onDeleteRental, 
    onAddNewCost, onUpdateCost, onDeleteCost,
    onAddNewLocation, onUpdateLocation, onDeleteLocation, onUpdatePriceTable,
    onAddNewClient, onUpdateClient, onDeleteClient, onGenerateRentalsBackup,
    backupSql, onCloseBackupModal,
    successMessage, setSuccessMessage, onLogout 
}) => {
    const [userPageView, setUserPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);
    const [rentalPageView, setRentalPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [rentalToEdit, setRentalToEdit] = useState<Rental | null>(null);
    const [financialPageView, setFinancialPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [costToEdit, setCostToEdit] = useState<Cost | null>(null);
    const [clientPageView, setClientPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const [isExporting, setIsExporting] = useState(false);
    
    // Mobile Sidebar State
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Captain JMS State
    const [isCaptainChatOpen, setIsCaptainChatOpen] = useState(false);
    
    const dashboardContentRef = useRef<HTMLDivElement>(null);

    // State for filters
    const [selectedYear, setSelectedYear] = useState('Todos');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [selectedLocation, setSelectedLocation] = useState('Todos os Locais');

    // --- URL Sync Helper ---
    const updateUrl = (view?: string, id?: string | number) => {
        const url = new URL(window.location.href);
        // Ensure page is set correctly based on active prop, or keep current if valid
        url.searchParams.set('page', activePage);
        
        if (view && view !== 'list') {
            url.searchParams.set('view', view);
        } else {
            url.searchParams.delete('view');
        }

        if (id) {
            url.searchParams.set('id', String(id));
        } else {
            url.searchParams.delete('id');
        }

        window.history.pushState({}, '', url.toString());
    };

    // --- Sync State from URL on Mount/Update ---
    useEffect(() => {
        const syncStateFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const view = params.get('view');
            const id = params.get('id');

            // Logic to sync internal state based on activePage and params
            if (activePage === 'users') {
                if (view === 'add') {
                    setUserPageView('add');
                    setUserToEdit(null);
                } else if (view === 'edit' && id && users.length > 0) {
                    const user = users.find(u => u.id === id);
                    if (user) {
                        setUserToEdit(user);
                        setUserPageView('edit');
                    } else {
                        setUserPageView('list'); // ID invalid/not loaded yet
                    }
                } else {
                    setUserPageView('list');
                    setUserToEdit(null);
                }
            } 
            else if (activePage === 'rentals') {
                if (view === 'add') {
                    setRentalPageView('add');
                    setRentalToEdit(null);
                } else if (view === 'edit' && id && rentals.length > 0) {
                    const rental = rentals.find(r => r.id === Number(id));
                    if (rental) {
                        setRentalToEdit(rental);
                        setRentalPageView('edit');
                    } else {
                        setRentalPageView('list');
                    }
                } else {
                    setRentalPageView('list');
                    setRentalToEdit(null);
                }
            }
            else if (activePage === 'clients') {
                if (view === 'add') {
                    setClientPageView('add');
                    setClientToEdit(null);
                } else if (view === 'edit' && id && clients.length > 0) {
                    const client = clients.find(c => c.id === Number(id));
                    if (client) {
                        setClientToEdit(client);
                        setClientPageView('edit');
                    } else {
                        setClientPageView('list');
                    }
                } else {
                    setClientPageView('list');
                    setClientToEdit(null);
                }
            }
            else if (activePage === 'financial') {
                if (view === 'add') {
                    setFinancialPageView('add');
                    setCostToEdit(null);
                } else if (view === 'edit' && id && costs.length > 0) {
                    const cost = costs.find(c => c.id === Number(id));
                    if (cost) {
                        setCostToEdit(cost);
                        setFinancialPageView('edit');
                    } else {
                        setFinancialPageView('list');
                    }
                } else {
                    setFinancialPageView('list');
                    setCostToEdit(null);
                }
            }
        };

        syncStateFromUrl();
        
        // Add listener for back/forward browser buttons
        window.addEventListener('popstate', syncStateFromUrl);
        return () => window.removeEventListener('popstate', syncStateFromUrl);

    }, [activePage, users, rentals, clients, costs]); // Re-run when data loads/changes or page changes

    const monthMap: { [key: string]: number } = { 'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3, 'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7, 'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11 };

    const availableLocations = useMemo(() => {
        const rentalLocations = new Set(rentals.map(r => r.location).filter(Boolean));
        // Also include configured locations
        locations.forEach(l => rentalLocations.add(l.name));
        return ['Todos os Locais', ...Array.from(rentalLocations).sort()];
    }, [rentals, locations]);

    const dashboardStats = useMemo(() => {
        const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Função auxiliar para calcular valor líquido (Valor - Comissão se houver)
        const getNetValue = (r: Rental) => {
            const gross = r.value || 0;
            const commission = (r.commissionCheck && r.commissionValue) ? r.commissionValue : 0;
            return gross - commission;
        };

        const locationFilteredRentals = rentals.filter(r => selectedLocation === 'Todos os Locais' || r.location === selectedLocation);

        const yearFilteredRentals = selectedYear === 'Todos'
            ? locationFilteredRentals
            : locationFilteredRentals.filter(r => r.date.startsWith(selectedYear));

        // Cálculo Anual Líquido
        const annualRevenue = yearFilteredRentals.reduce((sum, r) => sum + getNetValue(r), 0);
        const totalRentals = yearFilteredRentals.length;

        let annualTrend = 0;
        if (selectedYear !== 'Todos') {
            const prevYear = (parseInt(selectedYear, 10) - 1).toString();
            const prevYearRevenue = locationFilteredRentals
                .filter(r => r.date.startsWith(prevYear))
                .reduce((sum, r) => sum + getNetValue(r), 0);
            annualTrend = prevYearRevenue > 0 ? ((annualRevenue - prevYearRevenue) / prevYearRevenue) * 100 : (annualRevenue > 0 ? 100 : 0);
        }

        // Lógica do Mês: Só calcula se um mês estiver selecionado
        let monthlyRevenue = 0;
        let monthlyTrend = 0;
        
        if (selectedMonth !== 'Todos') {
            const targetMonthIndex = monthMap[selectedMonth];
            const monthlyRentals = yearFilteredRentals.filter(r => new Date(r.date).getUTCMonth() === targetMonthIndex);
            
            // Cálculo Mensal Líquido
            monthlyRevenue = monthlyRentals.reduce((sum, r) => sum + getNetValue(r), 0);

            if (selectedYear !== 'Todos') {
                const prevMonthDate = new Date(parseInt(selectedYear, 10), targetMonthIndex - 1, 1);
                const prevMonthRentals = locationFilteredRentals.filter(r => {
                    const rentalDate = new Date(r.date);
                    return rentalDate.getUTCFullYear() === prevMonthDate.getFullYear() && rentalDate.getUTCMonth() === prevMonthDate.getMonth();
                });
                const prevMonthRevenue = prevMonthRentals.reduce((sum, r) => sum + getNetValue(r), 0);
                monthlyTrend = prevMonthRevenue > 0 ? ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : (monthlyRevenue > 0 ? 100 : 0);
            }
        }

        const getTrendString = (trend: number) => {
            if (trend === 0) return `+0.0%`;
            return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
        };

        const monthlyTrendDirection: 'neutral' | 'up' | 'down' = selectedMonth === 'Todos' ? 'neutral' : (monthlyTrend >= 0 ? 'up' : 'down');
        const annualTrendDirection: 'neutral' | 'up' | 'down' = selectedYear === 'Todos' ? 'neutral' : (annualTrend >= 0 ? 'up' : 'down');

        return {
            monthRevenue: selectedMonth === 'Todos' ? '-' : formatCurrency(monthlyRevenue),
            yearRevenue: formatCurrency(annualRevenue),
            totalRentals: totalRentals.toLocaleString('pt-BR'),
            monthlyTrend: selectedMonth === 'Todos' ? '-' : getTrendString(monthlyTrend),
            annualTrend: selectedYear === 'Todos' ? 'Todos os períodos' : getTrendString(annualTrend),
            yearTitle: selectedYear === 'Todos' ? 'Faturamento Líquido Total' : `Faturamento Líquido de ${selectedYear}`,
            totalRentalsTitle: selectedYear === 'Todos' ? 'Total de Locações (Geral)' : `Total de Locações (${selectedYear})`,
            monthlyTrendDirection,
            annualTrendDirection,
        };
    }, [rentals, selectedYear, selectedMonth, selectedLocation]);


    const handleExportPDF = async () => {
        if (!dashboardContentRef.current || isExporting) return;

        setIsExporting(true);
        try {
            // @ts-ignore
            const { jsPDF } = window.jspdf;
            // @ts-ignore
            const canvas = await html2canvas(dashboardContentRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fafafa',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('relatorio-jms-dashboard.pdf');
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    // --- Users Handlers ---
    const handleSaveNewUser = (newUser: DashboardUser) => {
        onAddNewUser(newUser);
        setUserPageView('list');
        updateUrl('list');
    };

    const handleUpdateUser = (updatedUser: DashboardUser) => {
        onUpdateUser(updatedUser);
        setUserPageView('list');
        setUserToEdit(null);
        updateUrl('list');
    };

    const handleNavigateToAddUser = () => {
        setUserToEdit(null);
        setUserPageView('add');
        updateUrl('add');
    };

    const handleNavigateToEditUser = (user: DashboardUser) => {
        setUserToEdit(user);
        setUserPageView('edit');
        updateUrl('edit', user.id);
    };
    
    const handleCancelUserForm = () => {
        setUserPageView('list');
        setUserToEdit(null);
        updateUrl('list');
    };

    // --- Rentals Handlers ---
    const handleNavigateToAddRental = () => {
        setRentalToEdit(null);
        setRentalPageView('add');
        updateUrl('add');
    };

    const handleNavigateToEditRental = (rental: Rental) => {
        setRentalToEdit(rental);
        setRentalPageView('edit');
        updateUrl('edit', rental.id);
    };

    const handleCancelRentalForm = () => {
        setRentalPageView('list');
        setRentalToEdit(null);
        updateUrl('list');
    };

    const handleSaveRental = (rental: Rental) => {
        if(rentalToEdit){
            onUpdateRental(rental);
        } else {
            onAddNewRental(rental);
        }
        setRentalPageView('list');
        setRentalToEdit(null);
        updateUrl('list');
    }

    // --- Financial Handlers ---
    const handleNavigateToAddCost = () => {
        setCostToEdit(null);
        setFinancialPageView('add');
        updateUrl('add');
    };
    
    const handleNavigateToEditCost = (cost: Cost) => {
        setCostToEdit(cost);
        setFinancialPageView('edit');
        updateUrl('edit', cost.id);
    };

    const handleCancelCostForm = () => {
        setFinancialPageView('list');
        setCostToEdit(null);
        updateUrl('list');
    };

    const handleSaveCost = (costOrCosts: Cost | Cost[]) => {
        if (Array.isArray(costOrCosts)) {
            costOrCosts.forEach(cost => onAddNewCost(cost));
        } else {
            if (costToEdit) {
                onUpdateCost(costOrCosts);
            } else {
                onAddNewCost(costOrCosts);
            }
        }
        setFinancialPageView('list');
        setCostToEdit(null);
        updateUrl('list');
    };

    // --- Clients Handlers ---
    const handleNavigateToAddClient = () => {
        setClientToEdit(null);
        setClientPageView('add');
        updateUrl('add');
    };

    const handleRedirectToAddClient = () => {
        onNavigate('clients');
        setClientPageView('add');
        setClientToEdit(null);
        // Force URL update manually since activePage changes
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'clients');
        url.searchParams.set('view', 'add');
        window.history.pushState({}, '', url.toString());
    };

    const handleNavigateToEditClient = (client: Client) => {
        setClientToEdit(client);
        setClientPageView('edit');
        updateUrl('edit', client.id);
    };

    const handleCancelClientForm = () => {
        setClientPageView('list');
        setClientToEdit(null);
        updateUrl('list');
    };

    const handleSaveClient = (client: Client) => {
        if (clientToEdit) {
            onUpdateClient(client);
        } else {
            onAddNewClient(client);
        }
        setClientPageView('list');
        setClientToEdit(null);
        updateUrl('list');
    };

    // Updated resetViews to properly clear sub-view logic
    const resetViews = (page: DashboardPage) => {
        onNavigate(page);
        setUserPageView('list');
        setRentalPageView('list');
        setFinancialPageView('list');
        setClientPageView('list');
        setIsMobileSidebarOpen(false); // Close sidebar on navigation
        
        // Explicitly clear view/id params from URL when navigating via breadcrumbs/sidebar
        // Note: App.tsx's handleDashboardNavigation does this, but we duplicate here for breadcrumb safety if called directly
    }

    // --- Breadcrumbs Calculation Logic ---
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        // Base item: Home
        const items: BreadcrumbItem[] = [
            { label: 'Home', onClick: () => resetViews('dashboard') }
        ];

        switch (activePage) {
            case 'dashboard':
                // Already at home, no extra items needed unless we want "Dashboard" explicitly
                break;
            case 'financialDashboard':
                items.push({ label: 'Financial' });
                break;
            case 'users':
                items.push({ label: 'Team', onClick: () => { setUserPageView('list'); updateUrl('list'); } });
                if (userPageView === 'add') items.push({ label: 'New User' });
                if (userPageView === 'edit') items.push({ label: 'Edit User' });
                break;
            case 'rentals':
                items.push({ label: 'Rentals', onClick: () => { setRentalPageView('list'); updateUrl('list'); } });
                if (rentalPageView === 'add') items.push({ label: 'New Rental' });
                if (rentalPageView === 'edit') items.push({ label: 'Edit Rental' });
                break;
            case 'clients':
                items.push({ label: 'Clients', onClick: () => { setClientPageView('list'); updateUrl('list'); } });
                if (clientPageView === 'add') items.push({ label: 'New Client' });
                if (clientPageView === 'edit') items.push({ label: 'Edit Client' });
                break;
            case 'financial':
                items.push({ label: 'Costs', onClick: () => { setFinancialPageView('list'); updateUrl('list'); } });
                if (financialPageView === 'add') items.push({ label: 'New Cost' });
                if (financialPageView === 'edit') items.push({ label: 'Edit Cost' });
                break;
            case 'checklists':
                items.push({ label: 'Checklists' });
                break;
            case 'weather':
                items.push({ label: 'Weather Forecast' });
                break;
            case 'rentalText':
                items.push({ label: 'Standard Text' });
                break;
            case 'importantLinks':
                items.push({ label: 'Useful Links' });
                break;
            case 'apps':
                items.push({ label: 'Mobile App' });
                break;
            case 'settings':
                items.push({ label: 'Settings' });
                break;
            case 'captainJMS':
                items.push({ label: 'Captain JMS' });
                break;
        }
        return items;
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                        <div ref={dashboardContentRef} className='bg-background-light flex flex-col gap-6'>
                            <DashboardHeader 
                                onExportPDF={handleExportPDF} 
                                isExporting={isExporting} 
                                year={selectedYear}
                                location={selectedLocation === 'Todos os Locais' ? 'Todos' : selectedLocation}
                            />
                            <DashboardFilters 
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                                selectedMonth={selectedMonth}
                                onMonthChange={setSelectedMonth}
                                selectedLocation={selectedLocation}
                                onLocationChange={setSelectedLocation}
                                availableLocations={availableLocations}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard title={dashboardStats.yearTitle} value={dashboardStats.yearRevenue} trend={dashboardStats.annualTrend} trendDirection={dashboardStats.annualTrendDirection} icon="stacked_line_chart" />
                                <StatCard title={`Faturamento ${selectedMonth !== 'Todos' ? `de ${selectedMonth}` : 'do Mês'}`} value={dashboardStats.monthRevenue} trend={dashboardStats.monthlyTrend} trendDirection={dashboardStats.monthlyTrendDirection} icon="calendar_month" />
                                <StatCard title={dashboardStats.totalRentalsTitle} value={dashboardStats.totalRentals} trend="Realizadas" trendDirection="neutral" icon="sailing" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2"><RevenueChart year={selectedYear} location={selectedLocation} rentals={rentals} /></div>
                                <div><RentalsChart year={selectedYear} month={selectedMonth} location={selectedLocation} rentals={rentals} /></div>
                            </div>
                            <div className="lg:col-span-3"><MonthlyRevenueChart year={selectedYear} month={selectedMonth} location={selectedLocation} rentals={rentals} /></div>
                        </div>
                    </div>
                );
            case 'financialDashboard':
                return <FinancialDashboardScreen costs={costs} />;
            case 'captainJMS':
                return <CaptainJMSScreen currentUser={currentUser} onClose={() => onNavigate('dashboard')} dataContext={{ rentals, costs }} />;
            case 'users':
                if (userPageView === 'list') {
                    return <UsersScreen 
                        users={users} 
                        onNavigateToAddUser={handleNavigateToAddUser} 
                        onNavigateToEditUser={handleNavigateToEditUser} 
                        onDeleteUser={onDeleteUser} 
                        successMessage={successMessage} 
                        setSuccessMessage={setSuccessMessage}
                        currentUser={currentUser}
                    />;
                }
                return <AddUserScreen onCancel={handleCancelUserForm} onSave={userPageView === 'add' ? handleSaveNewUser : handleUpdateUser} userToEdit={userToEdit} />;
            case 'rentals':
                if (rentalPageView === 'list') {
                    return <RentalsScreen 
                        rentals={rentals} 
                        locations={locations}
                        onNavigateToAddRental={handleNavigateToAddRental} 
                        onNavigateToEditRental={handleNavigateToEditRental} 
                        onDeleteRental={onDeleteRental} 
                        successMessage={successMessage} 
                        setSuccessMessage={setSuccessMessage}
                        currentUser={currentUser}
                    />;
                }
                return <AddRentalScreen 
                    onCancel={handleCancelRentalForm} 
                    onSave={handleSaveRental} 
                    rentalToEdit={rentalToEdit} 
                    locations={locations} 
                    priceTable={prices} 
                    clients={clients}
                    onAddClientClick={handleRedirectToAddClient} 
                />;
            case 'clients':
                if (clientPageView === 'list') {
                    return <ClientsScreen 
                        clients={clients}
                        onNavigateToAddClient={handleNavigateToAddClient}
                        onNavigateToEditClient={handleNavigateToEditClient}
                        onDeleteClient={onDeleteClient}
                        successMessage={successMessage}
                        setSuccessMessage={setSuccessMessage}
                        currentUser={currentUser}
                    />
                }
                return <AddClientScreen onCancel={handleCancelClientForm} onSave={handleSaveClient} clientToEdit={clientToEdit} />;
            case 'rentalText':
                return <RentalTextScreen text={rentalStandardText} onSave={onUpdateRentalText} />;
            case 'importantLinks':
                return <ImportantLinksScreen />;
            case 'apps':
                return <AppDownloadScreen />;
            case 'weather':
                return <WeatherScreen locations={locations} />;
            case 'financial':
                 if (financialPageView === 'list') {
                    return <FinancialScreen 
                        costs={costs} 
                        onNavigateToAddCost={handleNavigateToAddCost}
                        onNavigateToEditCost={handleNavigateToEditCost}
                        onDeleteCost={onDeleteCost}
                        successMessage={successMessage} 
                        setSuccessMessage={setSuccessMessage}
                        currentUser={currentUser}
                    />;
                }
                return <AddCostScreen onCancel={handleCancelCostForm} onSave={handleSaveCost} costToEdit={costToEdit} />;
            case 'checklists':
                return <ChecklistsScreen fleet={fleet} clients={clients} />;
            case 'settings':
                return <SettingsScreen 
                    locations={locations}
                    onAddLocation={onAddNewLocation}
                    onUpdateLocation={onUpdateLocation}
                    onDeleteLocation={onDeleteLocation}
                    currentUser={currentUser}
                    prices={prices}
                    onUpdatePriceTable={onUpdatePriceTable}
                    onGenerateRentalsBackup={onGenerateRentalsBackup} 
                />;
            default:
                return null;
        }
    }

    return (
        <div className="relative flex h-screen w-full flex-row overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar with mobile toggle logic passed */}
            <Sidebar 
                activePage={activePage} 
                onNavigate={resetViews} 
                currentUser={currentUser} 
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0 relative z-30">
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                    <UserMenu currentUser={currentUser} onLogout={onLogout} />
                </header>
                
                {/* Breadcrumbs Section */}
                <div className="w-full">
                    <Breadcrumbs items={getBreadcrumbs()} />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
                    {renderContent()}
                </div>
            </main>

            {/* Modal de Backup SQL */}
            {backupSql && (
                <BackupModal 
                    isOpen={!!backupSql} 
                    sql={backupSql} 
                    onClose={onCloseBackupModal} 
                />
            )}

            {/* Captain JMS Floating Action Button */}
            <button 
                onClick={() => setIsCaptainChatOpen(!isCaptainChatOpen)}
                className={`
                    fixed bottom-6 right-6 z-50 
                    h-14 rounded-full shadow-xl 
                    flex items-center justify-center gap-2 px-5
                    transition-all duration-300 hover:scale-105 active:scale-95
                    ${isCaptainChatOpen ? 'bg-red-500' : 'bg-primary'}
                `}
                title={isCaptainChatOpen ? "Fechar Chat" : "Falar com Capitão JMS"}
            >
                 <span className={`material-symbols-outlined text-white text-2xl transition-transform duration-300 ${isCaptainChatOpen ? 'rotate-90' : ''}`}>
                    {isCaptainChatOpen ? 'close' : 'smart_toy'}
                 </span>
                 <span className="text-white font-bold whitespace-nowrap">
                    {isCaptainChatOpen ? 'Fechar' : 'Capitão JMS'}
                 </span>
            </button>

            {/* Captain JMS Chat Widget */}
            {isCaptainChatOpen && (
                <div 
                    className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-96 h-[600px] max-h-[70vh] z-40 animate-[fade-in-up_0.3s_ease-out]"
                >
                    <CaptainJMSScreen 
                        currentUser={currentUser} 
                        onClose={() => setIsCaptainChatOpen(false)}
                        dataContext={{
                            rentals: rentals,
                            costs: costs
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DashboardScreen;
