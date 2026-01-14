
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
import { User, DashboardPage, DashboardUser } from '../App';

interface DashboardScreenProps {
    currentUser: User | null;
    users: DashboardUser[];
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
    onAddNewUser: (user: DashboardUser) => void;
    onUpdateUser: (user: DashboardUser) => void;
    onDeleteUser: (userId: string) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, users, activePage, onNavigate, onAddNewUser, onUpdateUser, onDeleteUser, successMessage, setSuccessMessage }) => {
    const [userPageView, setUserPageView] = useState<'list' | 'add' | 'edit'>('list');
    const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);

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
    
    const handleCancelForm = () => {
        setUserPageView('list');
        setUserToEdit(null);
    };

    return (
        <div className="relative flex h-screen w-full flex-row overflow-hidden">
            <Sidebar 
                currentUser={currentUser} 
                activePage={activePage}
                onNavigate={(page) => {
                    onNavigate(page);
                    setUserPageView('list'); // Reset to list view when changing main pages
                }}
            />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light">
                <div className="h-full overflow-y-auto custom-scrollbar">
                    {activePage === 'dashboard' && (
                        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                            <DashboardHeader />
                            <DashboardFilters />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard 
                                    title="Faturamento do Mês"
                                    value="R$ 128.500,00"
                                    trend="+12%"
                                    trendDirection="up"
                                    icon="calendar_month"
                                />
                                <StatCard 
                                    title="Faturamento do Ano"
                                    value="R$ 1.450.200"
                                    trend="+8%"
                                    trendDirection="up"
                                    icon="stacked_line_chart"
                                />
                                 <StatCard 
                                    title="Total de Locações"
                                    value="3.842"
                                    trend="Realizadas"
                                    trendDirection="neutral"
                                    icon="sailing"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <RevenueChart />
                                </div>
                                <div>
                                    <RentalsChart />
                                </div>
                            </div>
                            
                            <div className="lg:col-span-3">
                                <MonthlyRevenueChart />
                            </div>
                        </div>
                    )}
                    {activePage === 'users' && (
                        <>
                            {userPageView === 'list' && (
                                <UsersScreen 
                                    users={users} 
                                    onNavigateToAddUser={handleNavigateToAddUser}
                                    onNavigateToEditUser={handleNavigateToEditUser}
                                    onDeleteUser={onDeleteUser}
                                    successMessage={successMessage}
                                    setSuccessMessage={setSuccessMessage}
                                />
                            )}
                            {(userPageView === 'add' || userPageView === 'edit') && (
                                <AddUserScreen 
                                    onCancel={handleCancelForm} 
                                    onSave={userPageView === 'add' ? handleSaveNewUser : handleUpdateUser}
                                    userToEdit={userToEdit} 
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
