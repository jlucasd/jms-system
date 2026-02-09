
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import SignUpScreen from './components/SignUpScreen';
import DashboardScreen from './components/dashboard/DashboardScreen';
import { supabase } from './lib/supabase';

type Page = 'login' | 'forgotPassword' | 'resetPassword' | 'signUp';
export type DashboardPage = 'dashboard' | 'financialDashboard' | 'users' | 'rentals' | 'checklists' | 'clients' | 'financial' | 'settings' | 'captainJMS' | 'rentalText' | 'importantLinks' | 'apps' | 'weather';
export type User = { 
  email: string; 
  password?: string;
  fullName?: string;
  role?: string;
  imageUrl?: string | null;
  status?: 'Ativo' | 'Inativo';
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  imageUrl: string | null;
  password?: string;
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
    paymentDate1?: string;
    paymentDate2?: string;
    commissionCheck?: boolean;
    commissionValue?: number;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    cpf: string;
    address: string;
    cep: string;
    chaNumber: string;
}

export interface Cost {
    id: number;
    type: string;
    value: number;
    paidValue: number;
    investor: string;
    date: string;
    isPaid: boolean;
    observations?: string;
}

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
    status: 'Disponível' | 'Manutenção' | 'Indisponível';
    type: 'Jet Ski' | 'Carreta Rodoviária' | 'Outro';
    isActive: boolean;
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
  
  const [loginUsers, setLoginUsers] = useState<User[]>([]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [locations, setLocations] = useState<RentalLocation[]>([]);
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [prices, setPrices] = useState<PriceTable>({ halfDay: 0, fullDay: 0, extraHour: 0 });
  const [rentalStandardText, setRentalStandardText] = useState('');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('dashboard');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backupSql, setBackupSql] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  const mapUserFromDB = (u: any): DashboardUser => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role || 'Colaborador',
    status: u.status as 'Ativo' | 'Inativo',
    imageUrl: u.image_url,
    password: u.password
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
    location: (r.location || '').trim(),
    observations: r.observations || '',
    paymentMethod: r.payment_method as any,
    value: Number(r.value) || 0,
    paymentDate1: r.payment_date_1 || '',
    paymentDate2: r.payment_date_2 || '',
    commissionCheck: r.commission_check || false,
    commissionValue: Number(r.commission_value) || 0
  });

  const mapClientFromDB = (c: any): Client => ({
      id: c.id,
      name: c.name,
      phone: c.phone || '',
      cpf: c.cpf || '',
      address: c.address || '',
      cep: c.cep || '',
      chaNumber: c.cha_number || ''
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

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase.from('app_users').select('*');
      if (usersError) throw usersError;
      const formattedUsers = (usersData || []).map(mapUserFromDB);
      setDashboardUsers(formattedUsers);
      setLoginUsers(formattedUsers.map(u => ({ 
        email: u.email, 
        password: u.password, 
        fullName: u.name, 
        role: u.role, 
        imageUrl: u.imageUrl,
        status: u.status
      })));

      const { data: rentalsData, error: rentalsError } = await supabase.from('rentals').select('*').order('rental_date', { ascending: false });
      if (rentalsError) throw rentalsError;
      setRentals((rentalsData || []).map(mapRentalFromDB));

      const { data: costsData, error: costsError } = await supabase.from('costs').select('*').order('purchase_date', { ascending: false });
      if (costsError) throw costsError;
      setCosts((costsData || []).map(mapCostFromDB));

      const { data: locationsData } = await supabase.from('rental_locations').select('*').order('name');
      if (locationsData) setLocations(locationsData.map((l: any) => ({ id: l.id, name: l.name })));

      const { data: fleetData } = await supabase.from('fleet').select('*').order('id', { ascending: true });
      if (fleetData) setFleet(fleetData.map((item: any) => ({
          id: item.id,
          name: item.name,
          color: item.color,
          plate: item.plate,
          status: item.status,
          type: item.type || 'Jet Ski',
          isActive: item.is_active !== false
      })));

      const { data: priceData } = await supabase.from('price_table').select('*').eq('id', 1).single();
      if (priceData) setPrices({
          id: priceData.id,
          halfDay: Number(priceData.half_day),
          fullDay: Number(priceData.full_day),
          extraHour: Number(priceData.extra_hour)
      });

      const { data: clientsData } = await supabase.from('clients').select('*').order('name', { ascending: true });
      if (clientsData) setClients(clientsData.map(mapClientFromDB));

      const { data: textData } = await supabase.from('system_settings').select('value').eq('key', 'rental_contract_text').single();
      if (textData) setRentalStandardText(textData.value);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialUsers = async () => {
      const { data } = await supabase.from('app_users').select('*');
      if (data) {
         const formatted = data.map(mapUserFromDB);
         setDashboardUsers(formatted);
         setLoginUsers(formatted.map(u => ({ 
           email: u.email, 
           password: u.password, 
           fullName: u.name, 
           role: u.role, 
           imageUrl: u.imageUrl,
           status: u.status
         })));
      }
    };
    fetchInitialUsers();
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated]);

  const navigateToForgotPassword = () => setCurrentPage('forgotPassword');
  const navigateToResetPassword = (email: string) => { setResetEmail(email); setCurrentPage('resetPassword'); };
  const navigateToLogin = () => { setResetEmail(null); setCurrentPage('login'); };
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
    setSuccessMessage(`Bem-vindo(a), ${fullUser.fullName || 'Tripulante'}!`);
    if (fullUser.role?.includes('Gerente') || fullUser.role?.includes('Financeiro')) {
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
    setSuccessMessage(null);
  };

  const handleDashboardNavigation = (page: DashboardPage) => setDashboardPage(page);

  const handleGenerateRentalsBackup = () => {
      if (rentals.length === 0) return;
      const safeString = (str: string | undefined | null) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
      const safeNumber = (num: number | undefined | null) => (num !== undefined && num !== null) ? num : 'NULL';
      const safeBool = (val: boolean | undefined) => val === true ? 'TRUE' : 'FALSE';
      let sql = "BEGIN;\n";
      rentals.forEach(r => {
          sql += `INSERT INTO rentals (client_name, client_cpf, client_phone, rental_date, rental_type, start_time, end_time, status, location, observations, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value) VALUES (${safeString(r.clientName)}, ${safeString(r.clientCpf)}, ${safeString(r.clientPhone)}, ${safeString(r.date)}, ${safeString(r.rentalType)}, ${safeString(r.startTime)}, ${safeString(r.endTime)}, ${safeString(r.status)}, ${safeString(r.location)}, ${safeString(r.observations)}, ${safeString(r.paymentMethod)}, ${safeNumber(r.value)}, ${safeString(r.paymentDate1)}, ${safeString(r.paymentDate2)}, ${safeBool(r.commissionCheck)}, ${safeNumber(r.commissionValue)});\n`;
      });
      sql += "COMMIT;";
      setBackupSql(sql);
  };

  const handleAddNewLoginUser = async (newUser: User) => {
    const { error } = await supabase.from('app_users').insert([{
      full_name: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      role: 'Colaborador', 
      status: 'Inativo'
    }]);
    if (error) alert('Erro: ' + error.message);
    else {
      setSuccessMessage('Cadastro realizado! Aguarde aprovação.');
      navigateToLogin();
    }
  }

  const handleAddNewDashboardUser = async (u: DashboardUser) => {
    const { data, error } = await supabase.from('app_users').insert([{ 
        full_name: u.name, 
        email: u.email, 
        role: u.role, 
        status: u.status, 
        password: u.password || '123', // Usa a senha fornecida ou padrão '123'
        image_url: u.imageUrl // Salva a imagem (Base64 string)
    }]).select();
    
    if (!error && data) { 
        setDashboardUsers(prev => [mapUserFromDB(data[0]), ...prev]); 
        setSuccessMessage('Usuário salvo!'); 
    } else if (error) {
        console.error(error);
        alert('Erro ao salvar usuário: ' + error.message);
    }
  };
  
  const handleUpdateDashboardUser = async (u: DashboardUser) => {
    const payload: any = { 
        full_name: u.name, 
        email: u.email, 
        role: u.role, 
        status: u.status,
        image_url: u.imageUrl // Atualiza a imagem
    };
    
    if (u.password) {
        payload.password = u.password;
    }

    const { error } = await supabase.from('app_users').update(payload).eq('id', u.id);
    
    if (!error) { 
        setDashboardUsers(prev => prev.map(user => user.id === u.id ? u : user)); 
        setSuccessMessage('Usuário atualizado!'); 
        
        // Se o usuário atualizou o próprio perfil, atualize o estado local
        if (currentUser && currentUser.email === u.email) {
            setCurrentUser(prev => prev ? { ...prev, imageUrl: u.imageUrl, fullName: u.name } : null);
        }
    } else {
        console.error(error);
        alert('Erro ao atualizar usuário: ' + error.message);
    }
  };

  const handleDeleteDashboardUser = async (id: string) => {
    const { error } = await supabase.from('app_users').delete().eq('id', id);
    if (!error) { setDashboardUsers(prev => prev.filter(user => user.id !== id)); setSuccessMessage('Usuário excluído!'); }
  };

  const handleAddNewRental = async (r: Rental) => {
    const payload = { client_name: r.clientName, client_cpf: r.clientCpf, client_initial: r.clientInitial, client_phone: r.clientPhone, rental_date: r.date, rental_type: r.rentalType, start_time: r.startTime, end_time: r.endTime, status: r.status, location: r.location, observations: r.observations, payment_method: r.paymentMethod, value: r.value, payment_date_1: r.paymentDate1 || null, payment_date_2: r.paymentDate2 || null, commission_check: r.commissionCheck, commission_value: r.commissionValue };
    const { data, error } = await supabase.from('rentals').insert([payload]).select();
    if (!error && data) { setRentals(prev => [mapRentalFromDB(data[0]), ...prev]); setSuccessMessage('Locação salva!'); }
  }

  const handleUpdateRental = async (r: Rental) => {
    const payload = { client_name: r.clientName, client_cpf: r.clientCpf, client_initial: r.clientInitial, client_phone: r.clientPhone, rental_date: r.date, rental_type: r.rentalType, start_time: r.startTime, end_time: r.endTime, status: r.status, location: r.location, observations: r.observations, payment_method: r.paymentMethod, value: r.value, payment_date_1: r.paymentDate1 || null, payment_date_2: r.paymentDate2 || null, commission_check: r.commissionCheck, commission_value: r.commissionValue };
    const { error } = await supabase.from('rentals').update(payload).eq('id', r.id);
    if (!error) { setRentals(prev => prev.map(item => item.id === r.id ? r : item)); setSuccessMessage('Locação atualizada!'); }
  }
  
  const handleDeleteRental = async (id: number) => {
    const { error } = await supabase.from('rentals').delete().eq('id', id);
    if (!error) { setRentals(prev => prev.filter(r => r.id !== id)); setSuccessMessage('Locação excluída!'); }
  };

  const handleAddNewCost = async (c: Cost) => {
    const payload = { cost_type: c.type, total_value: c.value, paid_value: c.paidValue, investor: c.investor, purchase_date: c.date || null, is_paid: c.isPaid, observations: c.observations };
    const { data, error } = await supabase.from('costs').insert([payload]).select();
    if (!error && data) { setCosts(prev => [mapCostFromDB(data[0]), ...prev]); setSuccessMessage('Custo salvo!'); }
  };

  const handleUpdateCost = async (c: Cost) => {
    const payload = { cost_type: c.type, total_value: c.value, paid_value: c.paidValue, investor: c.investor, purchase_date: c.date || null, is_paid: c.isPaid, observations: c.observations };
    const { error } = await supabase.from('costs').update(payload).eq('id', c.id);
    if (!error) { setCosts(prev => prev.map(item => item.id === c.id ? c : item)); setSuccessMessage('Custo atualizado!'); }
  };

  const handleDeleteCost = async (id: number) => {
    const { error } = await supabase.from('costs').delete().eq('id', id);
    if (!error) { setCosts(prev => prev.filter(c => c.id !== id)); setSuccessMessage('Custo excluído!'); }
  };

  const handleAddNewLocation = async (name: string) => {
      const { data, error } = await supabase.from('rental_locations').insert([{ name }]).select();
      if (!error && data) { setLocations(prev => [...prev, { id: data[0].id, name: data[0].name }]); setSuccessMessage('Local salvo!'); }
  };

  const handleUpdateLocation = async (id: number, name: string) => {
      const { error } = await supabase.from('rental_locations').update({ name }).eq('id', id);
      if (!error) { setLocations(prev => prev.map(l => l.id === id ? { ...l, name } : l)); setSuccessMessage('Local atualizado!'); }
  };

  const handleDeleteLocation = async (id: number) => {
      const { error } = await supabase.from('rental_locations').delete().eq('id', id);
      if (!error) { setLocations(prev => prev.filter(l => l.id !== id)); setSuccessMessage('Local excluído!'); }
  };

  const handleAddNewClient = async (c: Client) => {
    const payload = { name: c.name, phone: c.phone, cpf: c.cpf, address: c.address, cep: c.cep, cha_number: c.chaNumber };
    const { data, error } = await supabase.from('clients').insert([payload]).select();
    if (!error && data) { setClients(prev => [...prev, mapClientFromDB(data[0])]); setSuccessMessage('Cliente salvo!'); }
  };

  const handleUpdateClient = async (c: Client) => {
    const payload = { name: c.name, phone: c.phone, cpf: c.cpf, address: c.address, cep: c.cep, cha_number: c.chaNumber };
    const { error } = await supabase.from('clients').update(payload).eq('id', c.id);
    if (!error) { setClients(prev => prev.map(item => item.id === c.id ? c : item)); setSuccessMessage('Cliente atualizado!'); }
  };

  const handleDeleteClient = async (id: number) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (!error) { setClients(prev => prev.filter(c => c.id !== id)); setSuccessMessage('Cliente excluído!'); }
  };

  const handleUpdateRentalText = async (text: string) => {
      const { error } = await supabase.from('system_settings').upsert({ key: 'rental_contract_text', value: text }, { onConflict: 'key' });
      if (!error) {
          setRentalStandardText(text);
          setSuccessMessage('Texto padrão atualizado com sucesso!');
      } else {
          alert('Erro ao atualizar texto: ' + error.message);
      }
  };

  if (isAuthenticated) {
    return <DashboardScreen currentUser={currentUser} users={dashboardUsers} rentals={rentals} costs={costs} locations={locations} fleet={fleet} prices={prices} clients={clients} rentalStandardText={rentalStandardText} onUpdateRentalText={handleUpdateRentalText} activePage={dashboardPage} onNavigate={handleDashboardNavigation} onAddNewUser={handleAddNewDashboardUser} onUpdateUser={handleUpdateDashboardUser} onDeleteUser={handleDeleteDashboardUser} onAddNewRental={handleAddNewRental} onUpdateRental={handleUpdateRental} onDeleteRental={handleDeleteRental} onAddNewCost={handleAddNewCost} onUpdateCost={handleUpdateCost} onDeleteCost={handleDeleteCost} onAddNewLocation={handleAddNewLocation} onUpdateLocation={handleUpdateLocation} onDeleteLocation={handleDeleteLocation} onUpdatePriceTable={setPrices} onAddNewClient={handleAddNewClient} onUpdateClient={handleUpdateClient} onDeleteClient={handleDeleteClient} onGenerateRentalsBackup={handleGenerateRentalsBackup} backupSql={backupSql} onCloseBackupModal={() => setBackupSql(null)} successMessage={successMessage} setSuccessMessage={setSuccessMessage} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && <LoginScreen users={loginUsers} onNavigateToForgotPassword={navigateToForgotPassword} onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLoginSuccess} successMessage={successMessage} setSuccessMessage={setSuccessMessage} />}
      {currentPage === 'forgotPassword' && <ForgotPasswordScreen onNavigateToLogin={navigateToLogin} onNavigateToResetPassword={navigateToResetPassword} />}
      {currentPage === 'resetPassword' && <ResetPasswordScreen email={resetEmail || ''} onNavigateToLogin={navigateToLogin} onPasswordResetSuccess={navigateToLogin} />}
      {currentPage === 'signUp' && <SignUpScreen onNavigateToLogin={navigateToLogin} onAddNewUser={handleAddNewLoginUser} />}
    </div>
  );
};

export default App;
