
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SignUpScreen from './components/SignUpScreen';
import DashboardScreen from './components/DashboardScreen';

type Page = 'login' | 'forgotPassword' | 'signUp';
export type DashboardPage = 'dashboard' | 'users' | 'rentals' | 'clients' | 'financial' | 'settings';
export type User = { 
  email: string; 
  password?: string;
  fullName?: string;
  role?: string;
  imageUrl?: string | null;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  imageUrl: string | null;
};

export type RentalStatus = 'Pendente' | 'Confirmado' | 'Concluído';
export type RentalType = 'Meia Diária' | 'Diária';

export interface Rental {
    id: number;
    clientName: string;
    clientCpf: string;
    clientInitial: string;
    clientPhone: string;
    date: string;
    rentalType: RentalType;
    startTime: string;
    endTime: string;
    status: RentalStatus;
    location: string;
    observations?: string;
    paymentMethod?: 'Pix' | 'Cartão' | 'Dinheiro';
}

const initialRentals: Rental[] = [
    { id: 1, clientName: 'Roberto Souza', clientCpf: '123.456.789-10', clientInitial: 'RS', clientPhone: '(11) 98765-4321', date: '2023-11-15', rentalType: 'Meia Diária', startTime: '09:00', endTime: '10:00', status: 'Pendente', location: 'Doca Principal - Marina Azul' },
    { id: 2, clientName: 'Ana Lima', clientCpf: '234.567.890-12', clientInitial: 'AL', clientPhone: '(21) 99887-6655', date: '2023-11-15', rentalType: 'Meia Diária', startTime: '10:30', endTime: '11:00', status: 'Confirmado', location: 'Doca Principal - Marina Azul' },
    { id: 3, clientName: 'Marcos Ferreira', clientCpf: '345.678.901-23', clientInitial: 'MF', clientPhone: '(47) 99111-2222', date: '2023-11-16', rentalType: 'Meia Diária', startTime: '14:00', endTime: '16:00', status: 'Concluído', location: 'Doca Principal - Marina Azul' },
    { id: 4, clientName: 'Julia Pereira', clientCpf: '456.789.012-34', clientInitial: 'JP', clientPhone: '(48) 98888-7777', date: '2023-11-17', rentalType: 'Diária', startTime: '08:00', endTime: '18:00', status: 'Pendente', location: 'Doca Principal - Marina Azul' },
    { id: 5, clientName: 'Thiago Costa', clientCpf: '567.890.123-45', clientInitial: 'TC', clientPhone: '(11) 97777-1111', date: '2023-11-18', rentalType: 'Meia Diária', startTime: '15:00', endTime: '16:00', status: 'Confirmado', location: 'Doca Principal - Marina Azul' },
];

const initialDashboardUsers: DashboardUser[] = [
  {
    id: '#001',
    name: 'Carlos Silva',
    email: 'jmsjetski@gmail.com',
    role: 'Gerente',
    status: 'Ativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5KV1c8iepweSrUE0mKWR4HNex6iAskIblPrIoDeAtHBkI0pepVeO3IsvT8A5O-EiaD1YLLeQJ7qZj8kY7bLq2qwMu5TVDWJ6Am5XVNLol3RJiTpU7R7JlFs6L7CXd7bUwfv3SmWRQdEGA6a_EThmdMtEKNcQmECNv7947DFxzjG6zReoS_U90ly3wXSL1uYSzDtIxv7yKs3LjKWxneOv4reF-JBcmgXi7IEOm3CKyl_ZDBt0ktqKWOkJ4HXQSc91OWAeZaNebHg',
  },
  {
    id: '#042',
    name: 'Ana Júlia',
    email: 'ana.julia@jetski.com',
    role: 'Atendimento',
    status: 'Ativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUmnYqSvK5VEO6PNROe3EX9yyUeRYUfRHr-BHhlMMx9OVWlaDUw93wzkv2ikGkrc6xDHVhH1dIEE-QK0YOZfVJNhhTd-67xPwR7Mr_urbN7Iyvv9IPMexhap_Pe7qZ-akNWsEHaFma0wSLfOBMUGCurq9yoqKj_qtitMhfkLDxyJemY7stzorfj7wBbaGFMTBmFuLNVX5R6DIpGhI1WFFIfAj4NnNLtjaEAuhlLwbTXuyu1zOTwqOjDM0aAjAA_mfWnbA38_lNpQ',
  },
  {
    id: '#012',
    name: 'Roberto Mendes',
    email: 'beto.mendes@jetski.com',
    role: 'Instrutor',
    status: 'Inativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhW1tx5acNETNS6U9kEenIFm0aJqDB0wtHYQJ7_D18VZJ2PR-O1srAz3StILdjwiUDeunV621X66Eu_i59HnMOwfLHGMWejsSSDNpYlfqclUfCWT71RoTZmXNfHQCNbqx4i_ubnOdranmGUybwUuXDtAsWLuHTMXofGLseJomJuXz1zdfV0QcmN1uzjIRYjpOKghxwmjpGRhhVBckQHGC-g9l6DKvUcOlqymtFd1oq31xMOX1cA7HJIFJJl7ID1eOc2PYY2ubsug',
  },
];


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsers, setLoginUsers] = useState<User[]>([
    { email: 'jmsjetski@gmail.com', password: '123', fullName: 'Carlos Silva' }
  ]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>(initialDashboardUsers);
  const [rentals, setRentals] = useState<Rental[]>(initialRentals);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('dashboard');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigateToForgotPassword = () => {
    setCurrentPage('forgotPassword');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignUp = () => {
    setCurrentPage('signUp');
  }

  const handleLoginSuccess = (user: User) => {
    const dashboardUser = dashboardUsers.find(du => du.email === user.email);

    const fullUser: User = {
        ...user,
        role: dashboardUser?.role || 'Visitante',
        imageUrl: dashboardUser?.imageUrl,
        fullName: dashboardUser?.name || user.fullName,
    };
    
    setIsAuthenticated(true);
    setCurrentUser(fullUser);
  }

  const handleAddNewLoginUser = (newUser: User) => {
    setLoginUsers(prevUsers => [...prevUsers, newUser]);
    navigateToLogin(); // Navigate to login after successful sign-up
  }

  const handleAddNewDashboardUser = (newUser: DashboardUser) => {
    setDashboardUsers(prev => [newUser, ...prev]);
    setSuccessMessage('Usuário salvo com sucesso!');
  };
  
  const handleUpdateDashboardUser = (updatedUser: DashboardUser) => {
    setDashboardUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser && updatedUser.email === currentUser.email) {
      setCurrentUser(prev => ({
        ...prev!,
        fullName: updatedUser.name,
        role: updatedUser.role,
        imageUrl: updatedUser.imageUrl,
      }));
    }
    setSuccessMessage('Usuário salvo com sucesso!');
  };

  const handleDeleteDashboardUser = (userId: string) => {
    setDashboardUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleAddNewRental = (newRental: Rental) => {
    setRentals(prev => [newRental, ...prev]);
    setSuccessMessage('Locação salva com sucesso!');
  }

  const handleUpdateRental = (updatedRental: Rental) => {
    setRentals(prev => prev.map(r => r.id === updatedRental.id ? updatedRental : r));
    setSuccessMessage('Locação salva com sucesso!');
  }
  
  const handleDeleteRental = (rentalId: number) => {
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
    setSuccessMessage('Locação excluída com sucesso!');
  };

  const handleDashboardNavigation = (page: DashboardPage) => {
    setDashboardPage(page);
  }

  if (isAuthenticated) {
    return <DashboardScreen 
      currentUser={currentUser} 
      users={dashboardUsers}
      rentals={rentals}
      activePage={dashboardPage}
      onNavigate={handleDashboardNavigation}
      onAddNewUser={handleAddNewDashboardUser}
      onUpdateUser={handleUpdateDashboardUser}
      onDeleteUser={handleDeleteDashboardUser}
      onAddNewRental={handleAddNewRental}
      onUpdateRental={handleUpdateRental}
      onDeleteRental={handleDeleteRental}
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
    />;
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && <LoginScreen users={loginUsers} onNavigateToForgotPassword={navigateToForgotPassword} onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'forgotPassword' && <ForgotPasswordScreen onNavigateToLogin={navigateToLogin} />}
      {currentPage === 'signUp' && <SignUpScreen onNavigateToLogin={navigateToLogin} onAddNewUser={handleAddNewLoginUser} />}
    </div>
  );
};

export default App;
