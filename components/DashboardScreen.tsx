
import React, { useState } from 'react';
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
import { User, DashboardPage, DashboardUser, Rental } from '../App';

interface DashboardScreenProps {
    currentUser: User | null;
    users: DashboardUser[];
    rentals: Rental[];
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
    onAddNewUser: (user: DashboardUser) => void;
    onUpdateUser: (user: DashboardUser) => void;
    onDeleteUser: (userId: string) => void;
    onAddNewRental: (rental: Rental) => void;
    onUpdateRental: (rental: Rental) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
    currentUser, users, rentals, activePage, onNavigate, onAddNewUser, onUpdateUser, onDeleteUser, 
    onAddNewRental, onUpdateRental, successMessage, setSuccessMessage 
}) => {
    const [userPageView, setUserPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);
    const [rentalPageView, setRentalPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [rentalToEdit, setRentalToEdit] = useState<Rental | null>(null);

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

    const resetViews = (page: DashboardPage) => {
        onNavigate(page);
        setUserPageView('list');
        setRentalPageView('list');
    }

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                        <DashboardHeader />
                        <DashboardFilters />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Faturamento do Mês" value="R$ 128.500,00" trend="+12%" trendDirection="up" icon="calendar_month" />
                            <StatCard title="Faturamento do Ano" value="R$ 1.450.200" trend="+8%" trendDirection="up" icon="stacked_line_chart" />
                            <StatCard title="Total de Locações" value="3.842" trend="Realizadas" trendDirection="neutral" icon="sailing" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2"><RevenueChart /></div>
                            <div><RentalsChart /></div>
                        </div>
                        <div className="lg:col-span-3"><MonthlyRevenueChart /></div>
                    </div>
                );
            case 'users':
                if (userPageView === 'list') {
                    return <UsersScreen users={users} onNavigateToAddUser={handleNavigateToAddUser} onNavigateToEditUser={handleNavigateToEditUser} onDeleteUser={onDeleteUser} successMessage={successMessage} setSuccessMessage={setSuccessMessage} />;
                }
                return <AddUserScreen onCancel={handleCancelUserForm} onSave={userPageView === 'add' ? handleSaveNewUser : handleUpdateUser} userToEdit={userToEdit} />;
            case 'rentals':
                if (rentalPageView === 'list') {
                    return <RentalsScreen rentals={rentals} onNavigateToAddRental={handleNavigateToAddRental} onNavigateToEditRental={handleNavigateToEditRental} successMessage={successMessage} setSuccessMessage={setSuccessMessage} />;
                }
                return <AddRentalScreen onCancel={handleCancelRentalForm} onSave={handleSaveRental} rentalToEdit={rentalToEdit} />;
            default:
                return null;
        }
    }

    return (
        <div className="relative flex h-screen w-full flex-row overflow-hidden">
            <Sidebar currentUser={currentUser} activePage={activePage} onNavigate={resetViews} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light">
                <div className="h-full overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
