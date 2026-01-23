
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import SignUpScreen from './components/SignUpScreen';
import DashboardScreen from './components/DashboardScreen';
import { supabase } from './lib/supabase';

type Page = 'login' | 'forgotPassword' | 'resetPassword' | 'signUp';
export type DashboardPage = 'dashboard' | 'financialDashboard' | 'users' | 'rentals' | 'checklists' | 'clients' | 'financial' | 'settings' | 'captainJMS';
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
  password?: string; // Adicionado para gerenciar criação
};

export type RentalStatus = 'Pendente' | 'Confirmado' | 'Concluído' | 'Concluído com Pendências';
export type RentalType = 'Meia Diária' | 'Diária' | 'Diária/Meia';

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
    value: number;
}

export interface Cost {
    id: number;
    type: string;
    value: number;
    paidValue: number;
    investor: string;
    date: string; // YYYY-MM-DD or empty string
    isPaid: boolean;
    observations?: string;
}

// Novos tipos para Configurações
export interface CompanyProfile {
    id?: number;
    businessName: string;
    cnpj: string;
    phone: string;
    address: string;
}

export interface FleetItem {
    id: number;
    name: string;
    color: string;
    plate: string;
    status: 'Disponível' | 'Manutenção' | 'Indisponível'; // Status Operacional
    type: 'Jet Ski' | 'Carreta Rodoviária' | 'Outro'; // Tipo do bem
    isActive: boolean; // Status Administrativo (Ativo/Inativo)
}

export interface PriceTable {
    id?: number;
    halfDay: number;
    fullDay: number;
    extraHour: number;
}

export interface RentalLocation {
    id: number;
    name: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // States para dados do banco
  const [loginUsers, setLoginUsers] = useState<User[]>([]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [locations, setLocations] = useState<RentalLocation[]>([]);
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('dashboard');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State para fluxo de recuperação de senha
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  // --- Helpers de Mapeamento (Banco snake_case <-> App camelCase) ---

  const mapUserFromDB = (u: any): DashboardUser => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role || 'Colaborador',
    status: u.status as 'Ativo' | 'Inativo',
    imageUrl: u.image_url,
    password: u.password // Apenas para validação interna, idealmente não exposto
  });

  const mapRentalFromDB = (r: any): Rental => ({
    id: r.id,
    clientName: r.client_name,
    clientCpf: r.client_cpf || '',
    clientInitial: r.client_initial || r.client_name.slice(0, 2).toUpperCase(),
    clientPhone: r.client_phone || '',
    date: r.rental_date,
    rentalType: r.rental_type as RentalType,
    startTime: r.start_time || '',
    endTime: r.end_time || '',
    status: r.status as RentalStatus,
    location: (r.location || '').trim(), // Trim para evitar duplicatas no filtro
    observations: r.observations || '',
    paymentMethod: r.payment_method as any,
    value: Number(r.value) || 0
  });

  const mapCostFromDB = (c: any): Cost => ({
    id: c.id,
    type: c.cost_type,
    value: Number(c.total_value),
    paidValue: Number(c.paid_value),
    investor: c.investor,
    date: c.purchase_date || '',
    isPaid: c.is_paid,
    observations: c.observations || ''
  });

  // --- Fetch Data ---

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Users
      const { data: usersData, error: usersError } = await supabase.from('app_users').select('*');
      if (usersError) throw usersError;
      const formattedUsers = (usersData || []).map(mapUserFromDB);
      setDashboardUsers(formattedUsers);
      // Mapeia para o formato simples de login
      setLoginUsers(formattedUsers.map(u => ({ 
        email: u.email, 
        password: u.password, 
        fullName: u.name, 
        role: u.role, 
        imageUrl: u.imageUrl 
      })));

      // 2. Rentals
      const { data: rentalsData, error: rentalsError } = await supabase.from('rentals').select('*').order('rental_date', { ascending: false });
      if (rentalsError) throw rentalsError;
      setRentals((rentalsData || []).map(mapRentalFromDB));

      // 3. Costs
      const { data: costsData, error: costsError } = await supabase.from('costs').select('*').order('purchase_date', { ascending: false });
      if (costsError) throw costsError;
      setCosts((costsData || []).map(mapCostFromDB));

      // 4. Locations
      const { data: locationsData, error: locationsError } = await supabase.from('rental_locations').select('*').order('name');
      if (locationsError && locationsError.code !== '42P01') { // Ignore if table doesn't exist yet
          console.error(locationsError);
      }
      if (locationsData) {
          setLocations(locationsData.map((l: any) => ({ id: l.id, name: l.name })));
      }

      // 5. Fleet
      const { data: fleetData, error: fleetError } = await supabase.from('fleet').select('*').order('id', { ascending: true });
      if (!fleetError && fleetData) {
          setFleet(fleetData.map((item: any) => ({
              id: item.id,
              name: item.name,
              color: item.color,
              plate: item.plate,
              status: item.status,
              type: item.type || 'Jet Ski',
              isActive: item.is_active !== false // Default true if null/undefined
          })));
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar dados do sistema.');
    } finally {
      setIsLoading(false);
    }
  };

  // Busca inicial (apenas usuários para permitir login)
  useEffect(() => {
    const fetchInitialUsers = async () => {
      const { data, error } = await supabase.from('app_users').select('*');
      if (!error && data) {
         const formatted = data.map(mapUserFromDB);
         setDashboardUsers(formatted);
         setLoginUsers(formatted.map(u => ({ 
           email: u.email, 
           password: u.password, 
           fullName: u.name,
           role: u.role,
           imageUrl: u.imageUrl
         })));
      }
    };
    fetchInitialUsers();
  }, []);

  // Busca completa após login
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // --- Navigation ---

  const navigateToForgotPassword = () => setCurrentPage('forgotPassword');
  
  const navigateToResetPassword = (email: string) => {
    setResetEmail(email);
    setCurrentPage('resetPassword');
  };

  const navigateToLogin = () => {
    setResetEmail(null);
    setCurrentPage('login');
  };
  
  const navigateToSignUp = () => setCurrentPage('signUp');

  const handleLoginSuccess = (user: User) => {
    const dashboardUser = dashboardUsers.find(du => du.email === user.email);
    const fullUser: User = {
        ...user,
        role: dashboardUser?.role || 'Colaborador',
        imageUrl: dashboardUser?.imageUrl,
        fullName: dashboardUser?.name || user.fullName,
    };
    
    setIsAuthenticated(true);
    setCurrentUser(fullUser);

    // Redirecionamento baseado no perfil
    const userRole = fullUser.role || '';
    // Se for Gerente ou Financeiro, vai para o Dashboard. Caso contrário (Colaborador), vai para Locações.
    if (userRole.includes('Gerente') || userRole.includes('Financeiro')) {
        setDashboardPage('dashboard');
    } else {
        setDashboardPage('rentals');
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setDashboardPage('dashboard');
  };

  const handleDashboardNavigation = (page: DashboardPage) => {
    setDashboardPage(page);
  }

  // --- Handlers de Manipulação de Dados (Supabase) ---

  // ... (User handlers omitidos para brevidade, mantidos iguais) ...
    // 1. Usuários
  const handleAddNewLoginUser = async (newUser: User) => {
    // Cadastro público (SignUp screen)
    const { error } = await supabase.from('app_users').insert([{
      full_name: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      role: 'Colaborador', 
      status: 'Ativo'
    }]);

    if (error) {
      alert('Erro ao criar usuário: ' + error.message);
    } else {
      setSuccessMessage('Usuário cadastrado com sucesso!');
      navigateToLogin();
      const { data } = await supabase.from('app_users').select('*');
      if(data) {
         const formatted = data.map(mapUserFromDB);
         setDashboardUsers(formatted);
         setLoginUsers(formatted.map(u => ({ email: u.email, password: u.password, fullName: u.name, role: u.role, imageUrl: u.imageUrl })));
      }
    }
  }

  const handleAddNewDashboardUser = async (newUser: DashboardUser) => {
    const { data, error } = await supabase.from('app_users').insert([{
      full_name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      password: '123' 
    }]).select();

    if (error) {
      console.error(error);
      alert('Erro ao salvar usuário.');
    } else if (data) {
      setDashboardUsers(prev => [mapUserFromDB(data[0]), ...prev]);
      setSuccessMessage('Usuário salvo com sucesso!');
    }
  };
  
  const handleUpdateDashboardUser = async (updatedUser: DashboardUser) => {
    const { error } = await supabase.from('app_users').update({
      full_name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    }).eq('id', updatedUser.id);

    if (error) {
      console.error(error);
      alert('Erro ao atualizar usuário.');
    } else {
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
    }
  };

  const handleDeleteDashboardUser = async (userId: string) => {
    const { error } = await supabase.from('app_users').delete().eq('id', userId);
    if (error) {
      console.error(error);
      alert('Erro ao excluir usuário.');
    } else {
      setDashboardUsers(prev => prev.filter(user => user.id !== userId));
      setSuccessMessage('Usuário excluído com sucesso!');
    }
  };

  // 2. Locações (Rentals)
  const handleAddNewRental = async (newRental: Rental) => {
    const payload = {
      client_name: newRental.clientName,
      client_cpf: newRental.clientCpf,
      client_initial: newRental.clientInitial,
      client_phone: newRental.clientPhone,
      rental_date: newRental.date,
      rental_type: newRental.rentalType,
      start_time: newRental.startTime,
      end_time: newRental.endTime,
      status: newRental.status,
      location: newRental.location,
      observations: newRental.observations,
      payment_method: newRental.paymentMethod,
      value: newRental.value
    };

    const { data, error } = await supabase.from('rentals').insert([payload]).select();

    if (error) {
      console.error(error);
      alert('Erro ao criar locação.');
    } else if (data) {
      setRentals(prev => [mapRentalFromDB(data[0]), ...prev]);
      setSuccessMessage('Locação salva com sucesso!');
    }
  }

  const handleUpdateRental = async (updatedRental: Rental) => {
    const payload = {
      client_name: updatedRental.clientName,
      client_cpf: updatedRental.clientCpf,
      client_initial: updatedRental.clientInitial,
      client_phone: updatedRental.clientPhone,
      rental_date: updatedRental.date,
      rental_type: updatedRental.rentalType,
      start_time: updatedRental.startTime,
      end_time: updatedRental.endTime,
      status: updatedRental.status,
      location: updatedRental.location,
      observations: updatedRental.observations,
      payment_method: updatedRental.paymentMethod,
      value: updatedRental.value
    };

    const { error } = await supabase.from('rentals').update(payload).eq('id', updatedRental.id);

    if (error) {
      console.error(error);
      alert('Erro ao atualizar locação.');
    } else {
      setRentals(prev => prev.map(r => r.id === updatedRental.id ? updatedRental : r));
      setSuccessMessage('Locação salva com sucesso!');
    }
  }
  
  const handleDeleteRental = async (rentalId: number) => {
    const { error } = await supabase.from('rentals').delete().eq('id', rentalId);
    if (error) {
      console.error(error);
      alert('Erro ao excluir locação.');
    } else {
      setRentals(prev => prev.filter(rental => rental.id !== rentalId));
      setSuccessMessage('Locação excluída com sucesso!');
    }
  };

  // 3. Custos (Costs)
  const handleAddNewCost = async (newCost: Cost) => {
    const payload = {
      cost_type: newCost.type,
      total_value: newCost.value,
      paid_value: newCost.paidValue,
      investor: newCost.investor,
      purchase_date: newCost.date || null,
      is_paid: newCost.isPaid,
      observations: newCost.observations
    };

    const { data, error } = await supabase.from('costs').insert([payload]).select();

    if (error) {
      console.error(error);
      alert('Erro ao adicionar custo.');
    } else if (data) {
      const addedCost = mapCostFromDB(data[0]);
      setCosts(prev => [addedCost, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setSuccessMessage('Custo adicionado com sucesso!');
    }
  };

  const handleUpdateCost = async (updatedCost: Cost) => {
    const payload = {
      cost_type: updatedCost.type,
      total_value: updatedCost.value,
      paid_value: updatedCost.paidValue,
      investor: updatedCost.investor,
      purchase_date: updatedCost.date || null,
      is_paid: updatedCost.isPaid,
      observations: updatedCost.observations
    };

    const { error } = await supabase.from('costs').update(payload).eq('id', updatedCost.id);

    if (error) {
      console.error(error);
      alert('Erro ao atualizar custo.');
    } else {
      setCosts(prev => prev.map(c => c.id === updatedCost.id ? updatedCost : c));
      setSuccessMessage('Custo atualizado com sucesso!');
    }
  };

  const handleDeleteCost = async (costId: number) => {
    const { error } = await supabase.from('costs').delete().eq('id', costId);
    if (error) {
      console.error(error);
      alert('Erro ao excluir custo.');
    } else {
      setCosts(prev => prev.filter(c => c.id !== costId));
      setSuccessMessage('Custo excluído com sucesso!');
    }
  };

  // 4. Locations Handlers
  const handleAddNewLocation = async (name: string) => {
      const { data, error } = await supabase.from('rental_locations').insert([{ name }]).select();
      if(error) {
          alert('Erro ao adicionar local: ' + error.message);
      } else if (data) {
          setLocations(prev => [...prev, { id: data[0].id, name: data[0].name }].sort((a,b) => a.name.localeCompare(b.name)));
          setSuccessMessage('Local adicionado com sucesso!');
      }
  };

  const handleUpdateLocation = async (id: number, name: string) => {
      const { error } = await supabase.from('rental_locations').update({ name }).eq('id', id);
      if (error) {
          alert('Erro ao atualizar local: ' + error.message);
      } else {
          setLocations(prev => prev.map(l => l.id === id ? { ...l, name } : l).sort((a,b) => a.name.localeCompare(b.name)));
          setSuccessMessage('Local atualizado com sucesso!');
      }
  };

  const handleDeleteLocation = async (id: number) => {
      const { error } = await supabase.from('rental_locations').delete().eq('id', id);
      if(error) {
          alert('Erro ao excluir local.');
      } else {
          setLocations(prev => prev.filter(l => l.id !== id));
          setSuccessMessage('Local removido com sucesso!');
      }
  };
  
  // Handler para redefinição de senha
  const handlePasswordReset = async () => {
     const { data } = await supabase.from('app_users').select('*');
      if(data) {
         const formatted = data.map(mapUserFromDB);
         setDashboardUsers(formatted);
         setLoginUsers(formatted.map(u => ({ email: u.email, password: u.password, fullName: u.name, role: u.role, imageUrl: u.imageUrl })));
      }
      setSuccessMessage('Senha redefinida com sucesso! Faça login.');
      navigateToLogin();
  }

  // --- Render ---

  if (isAuthenticated) {
    if (isLoading && rentals.length === 0 && costs.length === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-primary font-bold">Carregando dados...</p>
                </div>
            </div>
        )
    }

    return <DashboardScreen 
      currentUser={currentUser} 
      users={dashboardUsers}
      rentals={rentals}
      costs={costs}
      locations={locations} 
      fleet={fleet} // Pass fleet info
      activePage={dashboardPage}
      onNavigate={handleDashboardNavigation}
      onAddNewUser={handleAddNewDashboardUser}
      onUpdateUser={handleUpdateDashboardUser}
      onDeleteUser={handleDeleteDashboardUser}
      onAddNewRental={handleAddNewRental}
      onUpdateRental={handleUpdateRental}
      onDeleteRental={handleDeleteRental}
      onAddNewCost={handleAddNewCost}
      onUpdateCost={handleUpdateCost}
      onDeleteCost={handleDeleteCost}
      onAddNewLocation={handleAddNewLocation} 
      onUpdateLocation={handleUpdateLocation} 
      onDeleteLocation={handleDeleteLocation} 
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
      onLogout={handleLogout}
    />;
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && (
        <LoginScreen 
            users={loginUsers} 
            onNavigateToForgotPassword={navigateToForgotPassword} 
            onNavigateToSignUp={navigateToSignUp} 
            onLoginSuccess={handleLoginSuccess}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
        />
      )}
      {currentPage === 'forgotPassword' && (
        <ForgotPasswordScreen 
            onNavigateToLogin={navigateToLogin} 
            onNavigateToResetPassword={navigateToResetPassword} 
        />
      )}
      {currentPage === 'resetPassword' && (
        <ResetPasswordScreen
            email={resetEmail || ''}
            onNavigateToLogin={navigateToLogin}
            onPasswordResetSuccess={handlePasswordReset}
        />
      )}
      {currentPage === 'signUp' && <SignUpScreen onNavigateToLogin={navigateToLogin} onAddNewUser={handleAddNewLoginUser} />}
    </div>
  );
};

export default App;
