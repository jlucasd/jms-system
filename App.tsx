
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

  const handleDashboardNavigation = (page: DashboardPage) => {
    setDashboardPage(page);
  }

  if (isAuthenticated) {
    return <DashboardScreen 
      currentUser={currentUser} 
      users={dashboardUsers}
      activePage={dashboardPage}
      onNavigate={handleDashboardNavigation}
      onAddNewUser={handleAddNewDashboardUser}
      onUpdateUser={handleUpdateDashboardUser}
      onDeleteUser={handleDeleteDashboardUser}
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
