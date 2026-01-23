
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { CompanyProfile, FleetItem, PriceTable, RentalLocation, User } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface SettingsScreenProps {
    locations?: RentalLocation[];
    onAddLocation?: (name: string) => void;
    onUpdateLocation?: (id: number, name: string) => void;
    onDeleteLocation?: (id: number) => void;
    currentUser: User | null;
    prices?: PriceTable;
    onUpdatePriceTable?: (prices: PriceTable) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ locations = [], onAddLocation, onUpdateLocation, onDeleteLocation, currentUser, prices, onUpdatePriceTable }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'fleet' | 'prices' | 'locations'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    
    // Feedback States
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // States for Data
    const [profile, setProfile] = useState<CompanyProfile>({
        businessName: '',
        cnpj: '',
        phone: '',
        address: ''
    });
    
    const [fleet, setFleet] = useState<FleetItem[]>([]);
    
    // Local state for prices, synced with props
    const [localPrices, setLocalPrices] = useState<PriceTable>({
        halfDay: 0,
        fullDay: 0,
        extraHour: 0
    });
    
    // Location States
    const [newLocationName, setNewLocationName] = useState('');
    const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
    const [editingLocationName, setEditingLocationName] = useState('');

    // States for Fleet Modal
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
    const [fleetItemToEdit, setFleetItemToEdit] = useState<FleetItem | null>(null);
    // Form Fleet States
    const [fleetName, setFleetName] = useState('');
    const [fleetColor, setFleetColor] = useState('');
    const [fleetPlate, setFleetPlate] = useState('');
    const [fleetStatus, setFleetStatus] = useState<'Disponível' | 'Manutenção' | 'Indisponível'>('Disponível');
    const [fleetType, setFleetType] = useState<'Jet Ski' | 'Carreta Rodoviária' | 'Outro'>('Jet Ski');
    const [fleetIsActive, setFleetIsActive] = useState<boolean>(true);

    // Fleet Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fleetItemToDelete, setFleetItemToDelete] = useState<FleetItem | null>(null);

    // Fleet Filters
    const [filterOpStatus, setFilterOpStatus] = useState('Todos');
    const [filterAdminStatus, setFilterAdminStatus] = useState('Todos');

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    // Permission Check
    const canEdit = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');

    // --- Data Fetching ---
    useEffect(() => {
        fetchSettingsData();
    }, []);

    // Sync prices from props to local state
    useEffect(() => {
        if (prices) {
            setLocalPrices(prices);
        }
    }, [prices]);

    // Auto-dismiss alerts
    useEffect(() => {
        if (successMsg || errorMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg(null);
                setErrorMsg(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMsg, errorMsg]);

    const fetchSettingsData = async () => {
        setIsLoading(true);
        try {
            // 1. Profile (Assumes ID 1 is the main company profile)
            const { data: profileData } = await supabase.from('company_profile').select('*').eq('id', 1).single();
            if (profileData) {
                setProfile({
                    id: profileData.id,
                    businessName: profileData.business_name,
                    cnpj: profileData.cnpj,
                    phone: profileData.phone,
                    address: profileData.address
                });
            }

            // 2. Fleet
            const { data: fleetData } = await supabase.from('fleet').select('*').order('id', { ascending: true });
            if (fleetData) {
                setFleet(fleetData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    plate: item.plate,
                    status: item.status,
                    type: item.type || 'Jet Ski',
                    isActive: item.is_active !== false // Default to true if null/undefined
                })));
            }
            
            // Prices are now passed via props, no need to fetch here individually to avoid double fetching logic
            // The App component handles the initial fetch of prices.

        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers ---

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setErrorMsg(null);
    };

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setSuccessMsg(null);
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        const payload = {
            id: 1, // Force ID 1
            business_name: profile.businessName,
            cnpj: profile.cnpj,
            phone: profile.phone,
            address: profile.address
        };

        const { error } = await supabase.from('company_profile').upsert(payload);
        setIsLoading(false);

        if (error) {
            showError('Erro ao salvar perfil: ' + error.message);
        } else {
            showSuccess('Perfil da empresa atualizado com sucesso!');
        }
    };

    const handleSavePrices = async () => {
        setIsLoading(true);
        const payload = {
            id: 1, // Force ID 1
            half_day: localPrices.halfDay,
            full_day: localPrices.fullDay,
            extra_hour: localPrices.extraHour
        };

        const { error } = await supabase.from('price_table').upsert(payload);
        setIsLoading(false);

        if (error) {
            showError('Erro ao salvar tabela de preços: ' + error.message);
        } else {
            showSuccess('Tabela de preços atualizada com sucesso!');
            if (onUpdatePriceTable) {
                onUpdatePriceTable(localPrices);
            }
        }
    };

    // Location Handlers
    const handleAddLocationClick = () => {
        if (!newLocationName.trim()) {
            showError('Digite o nome do local.');
            return;
        }
        if (onAddLocation) {
             onAddLocation(newLocationName);
             setNewLocationName('');
        }
    };

    const startEditingLocation = (loc: RentalLocation) => {
        setEditingLocationId(loc.id);
        setEditingLocationName(loc.name);
    };

    const cancelEditingLocation = () => {
        setEditingLocationId(null);
        setEditingLocationName('');
    };

    const saveEditingLocation = () => {
        if (editingLocationName.trim() && editingLocationId !== null && onUpdateLocation) {
            onUpdateLocation(editingLocationId, editingLocationName);
            cancelEditingLocation();
        } else {
            showError('Nome do local não pode ser vazio.');
        }
    };

    // Fleet Modal Handlers
    const openAddFleetModal = () => {
        setFleetItemToEdit(null);
        setFleetName('');
        setFleetColor('');
        setFleetPlate('');
        setFleetStatus('Disponível');
        setFleetType('Jet Ski');
        setFleetIsActive(true);
        setIsFleetModalOpen(true);
    };

    const openEditFleetModal = (item: FleetItem) => {
        setFleetItemToEdit(item);
        setFleetName(item.name);
        setFleetColor(item.color);
        setFleetPlate(item.plate);
        setFleetStatus(item.status);
        setFleetType(item.type);
        setFleetIsActive(item.isActive);
        setIsFleetModalOpen(true);
    };

    const handleSaveFleetItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: fleetName,
            color: fleetColor,
            plate: fleetPlate,
            status: fleetStatus,
            type: fleetType,
            is_active: fleetIsActive
        };

        let error;
        if (fleetItemToEdit) {
            // Update
            const res = await supabase.from('fleet').update(payload).eq('id', fleetItemToEdit.id);
            error = res.error;
        } else {
            // Insert
            const res = await supabase.from('fleet').insert([payload]);
            error = res.error;
        }

        if (error) {
            showError('Erro ao salvar item da frota: ' + error.message);
        } else {
            showSuccess(fleetItemToEdit ? 'Equipamento atualizado!' : 'Equipamento adicionado!');
            setIsFleetModalOpen(false);
            fetchSettingsData(); // Refresh list
        }
        setIsLoading(false);
    };

    const handleDeleteFleetClick = (item: FleetItem) => {
        setFleetItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!fleetItemToDelete) return;
        
        setIsLoading(true);
        const { error } = await supabase.from('fleet').delete().eq('id', fleetItemToDelete.id);
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setFleetItemToDelete(null);

        if (error) {
            showError('Erro ao excluir: ' + error.message);
        } else {
            showSuccess('Equipamento removido com sucesso.');
            fetchSettingsData();
        }
    };

    // Filtra a frota baseada nos selects
    const filteredFleet = useMemo(() => {
        return fleet.filter(item => {
            const opMatch = filterOpStatus === 'Todos' || item.status === filterOpStatus;
            const adminMatch = filterAdminStatus === 'Todos' || (filterAdminStatus === 'Ativo' ? item.isActive : !item.isActive);
            return opMatch && adminMatch;
        });
    }, [fleet, filterOpStatus, filterAdminStatus]);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full relative">
            
            {/* Header */}
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">settings</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Sistema</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Configurações</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Gerencie dados da empresa, frota e tabela de preços</p>
                </div>
            </div>

            {/* Notifications Banner (Standardized) */}
            {(successMsg || errorMsg) && (
                <div 
                    className={`${errorMsg ? 'bg-red-50 border-red-500 text-red-800' : 'bg-emerald-50 border-emerald-500 text-emerald-800'} border-l-4 p-4 rounded-lg flex items-center justify-between shadow-md`}
                    role="alert"
                    style={{ animation: 'fade-in-up 0.5s ease-out' }}
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">{errorMsg ? 'error' : 'check_circle'}</span>
                        <p className="font-bold text-sm">{successMsg || errorMsg}</p>
                    </div>
                    <button onClick={() => { setSuccessMsg(null); setErrorMsg(null); }} className={`${errorMsg ? 'text-red-800/70 hover:text-red-800' : 'text-emerald-800/70 hover:text-emerald-800'}`}>
                         <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            )}

            {/* Tabs Navigation Bar */}
            <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-2">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">business</span>
                    Perfil da Empresa
                </button>
                <button 
                    onClick={() => setActiveTab('fleet')}
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'fleet' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">directions_boat</span>
                    Frota
                </button>
                <button 
                    onClick={() => setActiveTab('prices')}
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'prices' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">price_change</span>
                    Tabela de Preços
                </button>
                <button 
                    onClick={() => setActiveTab('locations')}
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'locations' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                    Locais
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-6 md:p-8 relative">
                     {isLoading && !isFleetModalOpen && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-3xl animate-[fade-in-up_0.3s_ease-out]">
                             <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-bold text-primary">Dados Cadastrais</h3>
                                <p className="text-sm text-gray-500">Informações utilizadas em contratos e recibos.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Razão Social</label>
                                    <input type="text" value={profile.businessName} onChange={e => setProfile({...profile, businessName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
                                    <input type="text" value={profile.cnpj} onChange={e => setProfile({...profile, cnpj: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone Comercial</label>
                                    <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Endereço da Base</label>
                                    <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                                <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fleet' && (
                        <div className="animate-[fade-in-up_0.3s_ease-out] w-full">
                             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-primary">Equipamentos Cadastrados</h3>
                                    <p className="text-sm text-gray-500">Gerencie a frota ativa disponível para locação.</p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <div className="relative">
                                        <select 
                                            value={filterOpStatus} 
                                            onChange={e => setFilterOpStatus(e.target.value)} 
                                            className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2.5 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                                        >
                                            <option value="Todos">Estado Operacional: Todos</option>
                                            <option value="Disponível">Disponível</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Indisponível">Indisponível</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <select 
                                            value={filterAdminStatus} 
                                            onChange={e => setFilterAdminStatus(e.target.value)} 
                                            className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2.5 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                                        >
                                            <option value="Todos">Status: Todos</option>
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={openAddFleetModal}
                                        className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 justify-center"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                        Adicionar
                                    </button>
                                </div>
                             </div>
                             
                             <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-white border-b border-gray-200">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Modelo/Nome</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Tipo</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Cor</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Placa/ID</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Estado Operacional</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap">Status</th>
                                            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredFleet.map(item => (
                                            <tr key={item.id} className={`hover:bg-blue-50/30 transition-colors ${!item.isActive ? 'opacity-60' : ''}`}>
                                                <td className="py-4 px-6 whitespace-nowrap text-sm font-bold text-gray-800">{item.name}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">{item.color}</td>
                                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50 rounded px-2 w-fit">{item.plate || '-'}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.status === 'Disponível' ? 'bg-blue-50 text-blue-700 border-blue-100' : (item.status === 'Manutenção' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100')}`}>
                                                        <span className={`size-1.5 rounded-full ${item.status === 'Disponível' ? 'bg-blue-500' : (item.status === 'Manutenção' ? 'bg-amber-500' : 'bg-red-500')}`}></span>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${item.isActive ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-gray-600 bg-gray-100 border border-gray-200'}`}>
                                                        <span className={`size-2 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                        {item.isActive ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditFleetModal(item)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDeleteFleetClick(item)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredFleet.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                                                    {fleet.length === 0 ? 'Nenhum equipamento cadastrado.' : 'Nenhum equipamento encontrado com os filtros selecionados.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    )}

                    {activeTab === 'prices' && (
                        <div className="max-w-2xl animate-[fade-in-up_0.3s_ease-out]">
                             <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-bold text-primary">Valores Padrão</h3>
                                <p className="text-sm text-gray-500">Defina os valores sugeridos para o preenchimento automático de novas locações.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30 hover:bg-white hover:border-primary/30 transition-all">
                                    <label className="text-sm font-bold text-gray-700">Meia Diária</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={localPrices.halfDay} onChange={(e) => setLocalPrices({...localPrices, halfDay: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30 hover:bg-white hover:border-primary/30 transition-all">
                                    <label className="text-sm font-bold text-gray-700">Diária Completa</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={localPrices.fullDay} onChange={(e) => setLocalPrices({...localPrices, fullDay: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30 hover:bg-white hover:border-primary/30 transition-all">
                                    <label className="text-sm font-bold text-gray-700">Hora Extra</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={localPrices.extraHour} onChange={(e) => setLocalPrices({...localPrices, extraHour: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                                <button onClick={handleSavePrices} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Atualizar Preços
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'locations' && (
                        <div className="max-w-2xl animate-[fade-in-up_0.3s_ease-out]">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-bold text-primary">Locais de Saída</h3>
                                <p className="text-sm text-gray-500">Defina os locais de partida disponíveis para as locações.</p>
                            </div>

                            {canEdit && (
                                <div className="flex gap-2 mb-6">
                                    <input 
                                        type="text" 
                                        value={newLocationName} 
                                        onChange={(e) => setNewLocationName(e.target.value)} 
                                        placeholder="Nome do local (ex: Marina Azul)" 
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                    <button 
                                        onClick={handleAddLocationClick}
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2">
                                {locations.length === 0 && <p className="text-gray-500 text-sm italic">Nenhum local cadastrado.</p>}
                                {locations.map(loc => (
                                    <div key={loc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all group">
                                        {editingLocationId === loc.id ? (
                                            <div className="flex items-center gap-2 flex-1">
                                                <input 
                                                    type="text" 
                                                    value={editingLocationName}
                                                    onChange={(e) => setEditingLocationName(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 bg-white border border-secondary rounded-lg text-sm focus:outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={saveEditingLocation} className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors" title="Salvar">
                                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                                </button>
                                                <button onClick={cancelEditingLocation} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded transition-colors" title="Cancelar">
                                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-gray-400">pin_drop</span>
                                                    <span className="text-sm font-medium text-gray-700">{loc.name}</span>
                                                </div>
                                                {canEdit && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => startEditingLocation(loc)}
                                                            className="text-gray-400 hover:text-primary p-1.5 rounded-lg transition-colors"
                                                            title="Editar local"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => onDeleteLocation && onDeleteLocation(loc.id)}
                                                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                                                            title="Remover local"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fleet Modal */}
            {isFleetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsFleetModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fade-in-up_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-primary">{fleetItemToEdit ? 'Editar Equipamento' : 'Adicionar Equipamento'}</h3>
                            <button onClick={() => setIsFleetModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveFleetItem} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Equipamento</label>
                                <div className="relative">
                                    <select value={fleetType} onChange={e => setFleetType(e.target.value as any)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                        <option value="Jet Ski">Jet Ski</option>
                                        <option value="Carreta Rodoviária">Carreta Rodoviária</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Modelo/Nome</label>
                                <input value={fleetName} onChange={e => setFleetName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Ex: Sea-Doo GTI 130" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Cor</label>
                                <input value={fleetColor} onChange={e => setFleetColor(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Ex: Azul/Branco" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Placa/Identificação <span className="font-normal text-xs text-gray-500">(Opcional)</span></label>
                                <input value={fleetPlate} onChange={e => setFleetPlate(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Ex: JMS-01" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Situação (Cadastro)</label>
                                    <div className="relative">
                                        <select value={fleetIsActive ? 'Ativo' : 'Inativo'} onChange={e => setFleetIsActive(e.target.value === 'Ativo')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Estado Operacional</label>
                                    <div className="relative">
                                        <select value={fleetStatus} onChange={e => setFleetStatus(e.target.value as any)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                            <option value="Disponível">Disponível</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Indisponível">Indisponível</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsFleetModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-primary/90 flex items-center gap-2">
                                    {isLoading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Equipamento"
                message={`Tem certeza de que deseja excluir o item "${fleetItemToDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

export default SettingsScreen;
