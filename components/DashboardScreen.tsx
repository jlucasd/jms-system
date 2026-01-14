
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
import UserMenu from './dashboard/UserMenu';
import { User, DashboardPage, DashboardUser, Rental, Cost } from '../App';

interface DashboardScreenProps {
    currentUser: User | null;
    users: DashboardUser[];
    rentals: Rental[];
    costs: Cost[];
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
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
    currentUser, users, rentals, costs, activePage, onNavigate, onAddNewUser, onUpdateUser, onDeleteUser, 
    onAddNewRental, onUpdateRental, onDeleteRental, onAddNewCost, onUpdateCost, onDeleteCost,
    successMessage, setSuccessMessage, onLogout 
}) => {
    const [userPageView, setUserPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);
    const [rentalPageView, setRentalPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [rentalToEdit, setRentalToEdit] = useState<Rental | null>(null);
    const [financialPageView, setFinancialPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [costToEdit, setCostToEdit] = useState<Cost | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const dashboardContentRef = useRef<HTMLDivElement>(null);

    // State for filters
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [selectedUnit, setSelectedUnit] = useState('Todas');


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
    
    // Simulate data filtering
    const filteredStats = useMemo(() => {
        const hash = `${selectedYear}-${selectedMonth}-${selectedUnit}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        const baseMonthRevenue = selectedMonth === 'Todos' ? 128500 : 128500 / (hash % 12 + 1) * 1.5;
        const baseAnnualRevenue = 1450200;
        const baseRentals = 3842;

        const monthRevenue = baseMonthRevenue * (1 - (hash % 15) / 100);
        const yearRevenue = baseAnnualRevenue * (1 - (hash % 10) / 100);
        const totalRentals = baseRentals * (1 - (hash % 20) / 100);

        return {
            monthRevenue: `R$ ${monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            yearRevenue: `R$ ${yearRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalRentals: Math.round(totalRentals).toLocaleString('pt-BR'),
            trend: `+${hash % 15}%`
        };
    }, [selectedYear, selectedMonth, selectedUnit]);

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
                                unit={selectedUnit}
                            />
                            <DashboardFilters 
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                                selectedMonth={selectedMonth}
                                onMonthChange={setSelectedMonth}
                                selectedUnit={selectedUnit}
                                onUnitChange={setSelectedUnit}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard title={`Faturamento ${selectedMonth !== 'Todos' ? `de ${selectedMonth}` : 'do Mês'}`} value={filteredStats.monthRevenue} trend={filteredStats.trend} trendDirection="up" icon="calendar_month" />
                                <StatCard title={`Faturamento de ${selectedYear}`} value={filteredStats.yearRevenue} trend="+8%" trendDirection="up" icon="stacked_line_chart" />
                                <StatCard title="Total de Locações" value={filteredStats.totalRentals} trend="Realizadas" trendDirection="neutral" icon="sailing" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2"><RevenueChart year={selectedYear} unit={selectedUnit} /></div>
                                <div><RentalsChart year={selectedYear} month={selectedMonth} unit={selectedUnit} /></div>
                            </div>
                            <div className="lg:col-span-3"><MonthlyRevenueChart year={selectedYear} month={selectedMonth} unit={selectedUnit} /></div>
                        </div>
                    </div>
                );
            case 'financialDashboard':
                return <FinancialDashboardScreen costs={costs} />;
            case 'users':
                if (userPageView === 'list') {
                    return <UsersScreen users={users} onNavigateToAddUser={handleNavigateToAddUser} onNavigateToEditUser={handleNavigateToEditUser} onDeleteUser={onDeleteUser} successMessage={successMessage} setSuccessMessage={setSuccessMessage} />;
                }
                return <AddUserScreen onCancel={handleCancelUserForm} onSave={userPageView === 'add' ? handleSaveNewUser : handleUpdateUser} userToEdit={userToEdit} />;
            case 'rentals':
                if (rentalPageView === 'list') {
                    return <RentalsScreen rentals={rentals} onNavigateToAddRental={handleNavigateToAddRental} onNavigateToEditRental={handleNavigateToEditRental} onDeleteRental={onDeleteRental} successMessage={successMessage} setSuccessMessage={setSuccessMessage} />;
                }
                return <AddRentalScreen onCancel={handleCancelRentalForm} onSave={handleSaveRental} rentalToEdit={rentalToEdit} />;
            case 'financial':
                 if (financialPageView === 'list') {
                    return <FinancialScreen 
                        costs={costs} 
                        onNavigateToAddCost={handleNavigateToAddCost}
                        onNavigateToEditCost={handleNavigateToEditCost}
                        onDeleteCost={onDeleteCost}
                        successMessage={successMessage}
                        setSuccessMessage={setSuccessMessage}
                    />;
                }
                return <AddCostScreen onCancel={handleCancelCostForm} onSave={handleSaveCost} costToEdit={costToEdit} />;
            default:
                return null;
        }
    }

    return (
        <div className="relative flex h-screen w-full flex-row overflow-hidden">
            <Sidebar activePage={activePage} onNavigate={resetViews} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
                    <div>
                        {/* Mobile Menu Button can go here */}
                    </div>
                    <UserMenu currentUser={currentUser} onLogout={onLogout} />
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
