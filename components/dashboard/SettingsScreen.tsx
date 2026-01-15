
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CompanyProfile, FleetItem, PriceTable } from '../../App';

const SettingsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'fleet' | 'prices'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // States for Data
    const [profile, setProfile] = useState<CompanyProfile>({
        businessName: '',
        cnpj: '',
        phone: '',
        address: ''
    });
    
    const [fleet, setFleet] = useState<FleetItem[]>([]);
    
    const [prices, setPrices] = useState<PriceTable>({
        halfDay: 0,
        fullDay: 0,
        extraHour: 0
    });

    // States for Fleet Modal
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
    const [fleetItemToEdit, setFleetItemToEdit] = useState<FleetItem | null>(null);
    // Form Fleet States
    const [fleetName, setFleetName] = useState('');
    const [fleetColor, setFleetColor] = useState('');
    const [fleetPlate, setFleetPlate] = useState('');
    const [fleetStatus, setFleetStatus] = useState<'Disponível' | 'Manutenção' | 'Indisponível'>('Disponível');


    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    // --- Data Fetching ---
    useEffect(() => {
        fetchSettingsData();
    }, []);

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
                    status: item.status
                })));
            }

            // 3. Prices (Assumes ID 1)
            const { data: priceData } = await supabase.from('price_table').select('*').eq('id', 1).single();
            if (priceData) {
                setPrices({
                    id: priceData.id,
                    halfDay: Number(priceData.half_day),
                    fullDay: Number(priceData.full_day),
                    extraHour: Number(priceData.extra_hour)
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers ---

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
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
            alert('Erro ao salvar perfil: ' + error.message);
        } else {
            showSuccess('Perfil da empresa atualizado com sucesso!');
        }
    };

    const handleSavePrices = async () => {
        setIsLoading(true);
        const payload = {
            id: 1, // Force ID 1
            half_day: prices.halfDay,
            full_day: prices.fullDay,
            extra_hour: prices.extraHour
        };

        const { error } = await supabase.from('price_table').upsert(payload);
        setIsLoading(false);

        if (error) {
            alert('Erro ao salvar tabela de preços: ' + error.message);
        } else {
            showSuccess('Tabela de preços atualizada com sucesso!');
        }
    };

    // Fleet Modal Handlers
    const openAddFleetModal = () => {
        setFleetItemToEdit(null);
        setFleetName('');
        setFleetColor('');
        setFleetPlate('');
        setFleetStatus('Disponível');
        setIsFleetModalOpen(true);
    };

    const openEditFleetModal = (item: FleetItem) => {
        setFleetItemToEdit(item);
        setFleetName(item.name);
        setFleetColor(item.color);
        setFleetPlate(item.plate);
        setFleetStatus(item.status);
        setIsFleetModalOpen(true);
    };

    const handleSaveFleetItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: fleetName,
            color: fleetColor,
            plate: fleetPlate,
            status: fleetStatus
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
            alert('Erro ao salvar Jet Ski: ' + error.message);
        } else {
            showSuccess(fleetItemToEdit ? 'Jet Ski atualizado!' : 'Jet Ski adicionado!');
            setIsFleetModalOpen(false);
            fetchSettingsData(); // Refresh list
        }
        setIsLoading(false);
    };

    const handleDeleteFleetItem = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;
        
        setIsLoading(true);
        const { error } = await supabase.from('fleet').delete().eq('id', id);
        setIsLoading(false);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            showSuccess('Equipamento removido.');
            fetchSettingsData();
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full relative">
            {/* Success Toast */}
            {successMsg && (
                 <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold animate-[fade-in-up_0.3s_ease-out]">
                    {successMsg}
                 </div>
            )}

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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-gray-100 p-2 flex overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Perfil da Empresa
                    </button>
                    <button 
                        onClick={() => setActiveTab('fleet')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'fleet' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Frota de Jet Skis
                    </button>
                    <button 
                        onClick={() => setActiveTab('prices')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'prices' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Tabela de Preços
                    </button>
                </div>

                <div className="p-6 md:p-8 min-h-[400px]">
                    {isLoading && !isFleetModalOpen && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                            <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-2xl animate-[fade-in-up_0.3s_ease-out]">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">business</span>
                                Dados Cadastrais
                            </h3>
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
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fleet' && (
                        <div className="animate-[fade-in-up_0.3s_ease-out]">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined">directions_boat</span>
                                    Equipamentos Cadastrados
                                </h3>
                                {/* Updated Button Style */}
                                <button 
                                    onClick={openAddFleetModal}
                                    className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Adicionar Jet Ski
                                </button>
                             </div>
                             <div className="overflow-hidden border border-gray-200 rounded-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 text-xs font-bold text-gray-500 uppercase">Modelo</th>
                                            <th className="p-3 text-xs font-bold text-gray-500 uppercase">Cor</th>
                                            <th className="p-3 text-xs font-bold text-gray-500 uppercase">Placa/ID</th>
                                            <th className="p-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                            <th className="p-3 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {fleet.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50/50">
                                                <td className="p-3 text-sm font-bold text-primary">{item.name}</td>
                                                <td className="p-3 text-sm text-gray-600">{item.color}</td>
                                                <td className="p-3 text-sm text-gray-600 font-mono">{item.plate}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Disponível' ? 'bg-green-50 text-green-700' : (item.status === 'Manutenção' ? 'bg-red-50 text-red-700' : 'bg-gray-200 text-gray-600')}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => openEditFleetModal(item)} className="text-gray-400 hover:text-primary mr-2"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                                    <button onClick={() => handleDeleteFleetItem(item.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {fleet.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-6 text-center text-gray-500 text-sm">Nenhum equipamento cadastrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    )}

                    {activeTab === 'prices' && (
                        <div className="max-w-xl animate-[fade-in-up_0.3s_ease-out]">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">price_change</span>
                                Valores Padrão
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Defina os valores sugeridos para o preenchimento automático de novas locações.</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30">
                                    <label className="text-sm font-bold text-gray-700">Meia Diária (4h)</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={prices.halfDay} onChange={(e) => setPrices({...prices, halfDay: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30">
                                    <label className="text-sm font-bold text-gray-700">Diária Completa (8h)</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={prices.fullDay} onChange={(e) => setPrices({...prices, fullDay: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30">
                                    <label className="text-sm font-bold text-gray-700">Hora Extra</label>
                                    <div className="relative w-40">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                        <input type="number" value={prices.extraHour} onChange={(e) => setPrices({...prices, extraHour: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-primary font-bold text-right" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleSavePrices} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Atualizar Preços
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fleet Modal */}
            {isFleetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsFleetModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-primary">{fleetItemToEdit ? 'Editar Jet Ski' : 'Adicionar Jet Ski'}</h3>
                        </div>
                        <form onSubmit={handleSaveFleetItem} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Modelo</label>
                                <input value={fleetName} onChange={e => setFleetName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" placeholder="Ex: Sea-Doo GTI 130" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Cor</label>
                                <input value={fleetColor} onChange={e => setFleetColor(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" placeholder="Ex: Azul/Branco" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Placa/Identificação</label>
                                <input value={fleetPlate} onChange={e => setFleetPlate(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" placeholder="Ex: JMS-01" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select value={fleetStatus} onChange={e => setFleetStatus(e.target.value as any)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                                    <option value="Disponível">Disponível</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Indisponível">Indisponível</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsFleetModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-primary/90">
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsScreen;
