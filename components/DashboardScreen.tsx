
import React, { useState, useRef, useMemo } from 'react';
import Sidebar from './dashboard/Sidebar';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardFilters from './dashboard/DashboardFilters';
import StatCard from './dashboard/StatCard';
import RevenueChart from './dashboard/RevenueChart';
import RentalsChart from './dashboard/RentalsChart';
import MonthlyRevenueChart from './dashboard/MonthlyRevenueChart';
import UsersScreen from './dashboard/UsersScreen';
import AddUserScreen from './dashboard/AddUserScreen';
import RentalsScreen from './dashboard/RentalsScreen';
import AddRentalScreen from './dashboard/AddRentalScreen';
import FinancialScreen from './dashboard/FinancialScreen';
import AddCostScreen from './dashboard/AddCostScreen';
import FinancialDashboardScreen from './dashboard/FinancialDashboardScreen';
import CaptainJMSScreen from './dashboard/CaptainJMSScreen';
import SettingsScreen from './dashboard/SettingsScreen';
import UserMenu from './dashboard/UserMenu';
import { User, DashboardPage, DashboardUser, Rental, Cost, RentalLocation } from '../App';

interface DashboardScreenProps {
    currentUser: User | null;
    users: DashboardUser[];
    rentals: Rental[];
    costs: Cost[];
    locations: RentalLocation[];
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
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
    currentUser, users, rentals, costs, locations, activePage, onNavigate, onAddNewUser, onUpdateUser, onDeleteUser, 
    onAddNewRental, onUpdateRental, onDeleteRental, onAddNewCost, onUpdateCost, onDeleteCost,
    onAddNewLocation, onUpdateLocation, onDeleteLocation,
    successMessage, setSuccessMessage, onLogout 
}) => {
    const [userPageView, setUserPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);
    const [rentalPageView, setRentalPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [rentalToEdit, setRentalToEdit] = useState<Rental | null>(null);
    const [financialPageView, setFinancialPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [costToEdit, setCostToEdit] = useState<Cost | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    
    // AI Chat State
    const [isCaptainChatOpen, setIsCaptainChatOpen] = useState(false);
    
    // Mobile Sidebar State
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    const dashboardContentRef = useRef<HTMLDivElement>(null);

    // State for filters
    const [selectedYear, setSelectedYear] = useState('Todos');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [selectedLocation, setSelectedLocation] = useState('Todos os Locais');

    const monthMap: { [key: string]: number } = { 'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3, 'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7, 'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11 };

    // Use locations from prop for filter options instead of raw rental strings
    const availableLocations = useMemo(() => {
        // Fallback to rental strings if locations prop is empty (to avoid empty filter)
        if (locations.length > 0) {
             return ['Todos os Locais', ...locations.map(l => l.name)];
        }
        const locationSet = new Set(rentals.map(r => r.location).filter(Boolean));
        return ['Todos os Locais', ...Array.from(locationSet).sort()];
    }, [locations, rentals]);

    const dashboardStats = useMemo(() => {
        const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const locationFilteredRentals = rentals.filter(r => selectedLocation === 'Todos os Locais' || r.location === selectedLocation);

        const yearFilteredRentals = selectedYear === 'Todos'
            ? locationFilteredRentals
            : locationFilteredRentals.filter(r => r.date.startsWith(selectedYear));

        const annualRevenue = yearFilteredRentals.reduce((sum, r) => sum + r.value, 0);
        const totalRentals = yearFilteredRentals.length;

        let annualTrend = 0;
        if (selectedYear !== 'Todos') {
            const prevYear = (parseInt(selectedYear, 10) - 1).toString();
            const prevYearRevenue = locationFilteredRentals
                .filter(r => r.date.startsWith(prevYear))
                .reduce((sum, r) => sum + r.value, 0);
            annualTrend = prevYearRevenue > 0 ? ((annualRevenue - prevYearRevenue) / prevYearRevenue) * 100 : (annualRevenue > 0 ? 100 : 0);
        }

        // Lógica do Mês: Só calcula se um mês estiver selecionado
        let monthlyRevenue = 0;
        let monthlyTrend = 0;
        
        if (selectedMonth !== 'Todos') {
            const targetMonthIndex = monthMap[selectedMonth];
            const monthlyRentals = yearFilteredRentals.filter(r => new Date(r.date).getUTCMonth() === targetMonthIndex);
            monthlyRevenue = monthlyRentals.reduce((sum, r) => sum + r.value, 0);

            if (selectedYear !== 'Todos') {
                const prevMonthDate = new Date(parseInt(selectedYear, 10), targetMonthIndex - 1, 1);
                const prevMonthRentals = locationFilteredRentals.filter(r => {
                    const rentalDate = new Date(r.date);
                    return rentalDate.getUTCFullYear() === prevMonthDate.getFullYear() && rentalDate.getUTCMonth() === prevMonthDate.getMonth();
                });
                const prevMonthRevenue = prevMonthRentals.reduce((sum, r) => sum + r.value, 0);
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
            yearTitle: selectedYear === 'Todos' ? 'Faturamento Total' : `Faturamento de ${selectedYear}`,
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

    const handleSaveNewUser = (newUser: DashboardUser) => {
        onAddNewUser(newUser);
        setUserPageView('list');
    };

    const handleUpdateUser = (updatedUser: DashboardUser) => {
        onUpdateUser(updatedUser);
        setUserPageView('list');
        setUserToEdit(null);
    };

    const handleNavigateToAddUser = () => {
        setUserToEdit(null);
        setUserPageView('add');
    };

    const handleNavigateToEditUser = (user: DashboardUser) => {
        setUserToEdit(user);
        setUserPageView('edit');
    };
    
    const handleCancelUserForm = () => {
        setUserPageView('list');
        setUserToEdit(null);
    };

    const handleNavigateToAddRental = () => {
        setRentalToEdit(null);
        setRentalPageView('add');
    };

    const handleNavigateToEditRental = (rental: Rental) => {
        setRentalToEdit(rental);
        setRentalPageView('edit');
    };

    const handleCancelRentalForm = () => {
        setRentalPageView('list');
        setRentalToEdit(null);
    };

    const handleSaveRental = (rental: Rental) => {
        if(rentalToEdit){
            onUpdateRental(rental);
        } else {
            onAddNewRental(rental);
        }
        setRentalPageView('list');
        setRentalToEdit(null);
    }

    const handleNavigateToAddCost = () => {
        setCostToEdit(null);
        setFinancialPageView('add');
    };
    
    const handleNavigateToEditCost = (cost: Cost) => {
        setCostToEdit(cost);
        setFinancialPageView('edit');
    };

    const handleCancelCostForm = () => {
        setFinancialPageView('list');
        setCostToEdit(null);
    };

    const handleSaveCost = (cost: Cost) => {
        if (costToEdit) {
            onUpdateCost(cost);
        } else {
            onAddNewCost(cost);
        }
        setFinancialPageView('list');
        setCostToEdit(null);
    };

    const resetViews = (page: DashboardPage) => {
        onNavigate(page);
        setUserPageView('list');
        setRentalPageView('list');
        setFinancialPageView('list');
        setIsMobileSidebarOpen(false); // Close sidebar on navigation
    }

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
                return (
                    <CaptainJMSScreen 
                        currentUser={currentUser} 
                        onClose={() => onNavigate('dashboard')} 
                        dataContext={{ rentals, costs }} 
                    />
                );
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
                return <AddRentalScreen locations={locations} onCancel={handleCancelRentalForm} onSave={handleSaveRental} rentalToEdit={rentalToEdit} />;
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
            case 'settings':
                return <SettingsScreen locations={locations} onAddLocation={onAddNewLocation} onUpdateLocation={onUpdateLocation} onDeleteLocation={onDeleteLocation} currentUser={currentUser} />;
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
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
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
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </main>

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
