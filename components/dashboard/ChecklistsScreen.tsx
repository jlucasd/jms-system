
import React, { useState, useMemo, useEffect } from 'react';
import { FleetItem } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface ChecklistsScreenProps {
    fleet?: FleetItem[];
}

interface ContractItems {
    tiem: boolean;
    fuelFull: boolean;
    key: boolean;
    insurance: boolean;
    trailerDoc: boolean;
    anchor: boolean;
    rope: boolean;
    vests: {
        eg: boolean;
        gg: boolean;
        g1: boolean;
        m: boolean;
    };
    // Novos itens de manutenção pós-uso
    wash?: boolean;
    freshwaterFlush?: boolean;
}

interface ChecklistItem {
    id: string;
    clientName: string;
    clientEmail: string;
    jetSki: string;
    date: string;
    statusCheckIn: 'Pendente' | 'Concluído';
    statusCheckOut: 'Não Iniciado' | 'Em Aberto' | 'Concluído';
    observations: string;
    checkinItems: ContractItems;
    checkoutItems: ContractItems;
}

const initialContractItems: ContractItems = {
    tiem: false,
    fuelFull: false,
    key: false,
    insurance: false,
    trailerDoc: false,
    anchor: false,
    rope: false,
    vests: { eg: false, gg: false, g1: false, m: false },
    wash: false,
    freshwaterFlush: false
};

// Mapa de nomes legíveis para os itens
const itemLabels: Record<string, string> = {
    tiem: 'Documento (TIEM)',
    fuelFull: 'Tanque Cheio',
    key: 'Chave do Jet Ski',
    insurance: 'Seguro Obrigatório',
    trailerDoc: 'Doc. Carreta Rodoviária',
    anchor: 'Âncora',
    rope: 'Cabo de Atracação',
    wash: 'Lavar Jet Ski',
    freshwaterFlush: 'Adoçar Motor'
};

const ChecklistsScreen: React.FC<ChecklistsScreenProps> = ({ fleet = [] }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Modal de Exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ChecklistItem | null>(null);

    // Modal de Validação
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [missingItems, setMissingItems] = useState<string[]>([]);

    // Estado dos Dados
    const [checklists, setChecklists] = useState<ChecklistItem[]>([
        {
            id: '#LOC-2024-001',
            clientName: 'Ricardo Mendes',
            clientEmail: 'ricardo.m@email.com',
            jetSki: 'Sea-Doo Spark (AZ-04)',
            date: '2024-05-24',
            statusCheckIn: 'Concluído',
            statusCheckOut: 'Em Aberto',
            observations: '',
            checkinItems: { ...initialContractItems, fuelFull: true, key: true },
            checkoutItems: { ...initialContractItems }
        },
        {
            id: '#LOC-2024-002',
            clientName: 'Juliana Alencar',
            clientEmail: 'ju.alencar@email.com',
            jetSki: 'Yamaha FX (BR-12)',
            date: '2024-05-24',
            statusCheckIn: 'Concluído',
            statusCheckOut: 'Concluído',
            observations: '',
            checkinItems: { ...initialContractItems, fuelFull: true },
            checkoutItems: { ...initialContractItems, fuelFull: true, wash: true, freshwaterFlush: true }
        },
        {
            id: '#LOC-2024-003',
            clientName: 'Bruno Henrique',
            clientEmail: 'bruno.h@email.com',
            jetSki: 'Sea-Doo GTX (PT-09)',
            date: '2024-05-23',
            statusCheckIn: 'Pendente',
            statusCheckOut: 'Não Iniciado',
            observations: '',
            checkinItems: { ...initialContractItems },
            checkoutItems: { ...initialContractItems }
        },
    ]);

    // Estados do Formulário
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<ChecklistItem, 'id'>>({
        clientName: '',
        clientEmail: '',
        jetSki: '',
        date: '',
        statusCheckIn: 'Pendente',
        statusCheckOut: 'Não Iniciado',
        observations: '',
        checkinItems: JSON.parse(JSON.stringify(initialContractItems)),
        checkoutItems: JSON.parse(JSON.stringify(initialContractItems))
    });

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // --- AUTO-UPDATE STATUS LOGIC ---
    useEffect(() => {
        if (view !== 'form') return;

        // Check-in Auto-Update
        const checkinKeys = ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope'];
        const allCheckinChecked = checkinKeys.every(key => formData.checkinItems[key as keyof ContractItems] === true);
        
        if (allCheckinChecked && formData.statusCheckIn !== 'Concluído') {
            setFormData(prev => ({ ...prev, statusCheckIn: 'Concluído' }));
        }

        // Check-out Auto-Update
        // Só tenta atualizar check-out se já tiver iniciado
        if (formData.statusCheckOut !== 'Não Iniciado') {
            const checkoutKeys = ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope', 'wash', 'freshwaterFlush'];
            const allCheckoutChecked = checkoutKeys.every(key => formData.checkoutItems[key as keyof ContractItems] === true);
            
            if (allCheckoutChecked && formData.statusCheckOut !== 'Concluído') {
                setFormData(prev => ({ ...prev, statusCheckOut: 'Concluído' }));
            }
        }
    }, [formData.checkinItems, formData.checkoutItems, view]); 
    // Removido statusCheckIn/Out das dependências para evitar loops, mas adicionado view para garantir execução no form

    // Lógica de Filtro
    const filteredChecklists = useMemo(() => {
        return checklists.filter(item => 
            item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jetSki.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, checklists]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Concluído':
                return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
            case 'Pendente':
                return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
            case 'Em Aberto':
                return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
            case 'Não Iniciado':
                return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // Ações do CRUD
    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            clientName: '',
            clientEmail: '',
            jetSki: fleet.length > 0 ? fleet[0].name : '',
            date: new Date().toISOString().split('T')[0],
            statusCheckIn: 'Pendente',
            statusCheckOut: 'Não Iniciado',
            observations: '',
            checkinItems: JSON.parse(JSON.stringify(initialContractItems)),
            checkoutItems: JSON.parse(JSON.stringify(initialContractItems))
        });
        setView('form');
    };

    const handleEdit = (item: ChecklistItem) => {
        setEditingId(item.id);
        setFormData({
            clientName: item.clientName,
            clientEmail: item.clientEmail,
            jetSki: item.jetSki,
            date: item.date,
            statusCheckIn: item.statusCheckIn,
            statusCheckOut: item.statusCheckOut,
            observations: item.observations,
            checkinItems: item.checkinItems || JSON.parse(JSON.stringify(initialContractItems)),
            checkoutItems: item.checkoutItems || JSON.parse(JSON.stringify(initialContractItems))
        });
        setView('form');
    };

    const handleDeleteClick = (item: ChecklistItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setChecklists(prev => prev.filter(i => i.id !== itemToDelete.id));
            setSuccessMessage('Checklist excluído com sucesso!');
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    // Função que verifica pendências antes de salvar
    const validateAndSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.clientName || !formData.jetSki || !formData.date) {
            alert("Preencha os campos obrigatórios");
            return;
        }

        const missing: string[] = [];
        const checkinKeys = ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope'];
        
        // Valida Check-in
        checkinKeys.forEach(key => {
            if (!formData.checkinItems[key as keyof ContractItems]) {
                missing.push(`(Check-in) ${itemLabels[key]}`);
            }
        });

        // Valida Check-out (apenas se tiver iniciado)
        if (formData.statusCheckOut !== 'Não Iniciado') {
            const checkoutKeys = [...checkinKeys, 'wash', 'freshwaterFlush'];
            checkoutKeys.forEach(key => {
                if (!formData.checkoutItems[key as keyof ContractItems]) {
                    missing.push(`(Check-out) ${itemLabels[key]}`);
                }
            });
        }

        if (missing.length > 0) {
            setMissingItems(missing);
            setIsValidationModalOpen(true);
        } else {
            performSave();
        }
    };

    const performSave = () => {
        if (editingId) {
            // Atualizar existente
            setChecklists(prev => prev.map(item => 
                item.id === editingId 
                ? { ...item, ...formData } as ChecklistItem
                : item
            ));
            setSuccessMessage('Checklist atualizado com sucesso!');
        } else {
            // Criar novo
            const newItem: ChecklistItem = {
                id: `#LOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                ...formData
            } as ChecklistItem;
            setChecklists(prev => [newItem, ...prev]);
            setSuccessMessage('Checklist salvo com sucesso!');
        }
        
        setIsValidationModalOpen(false);
        setView('list');
    };

    // Helper para atualizar itens aninhados
    const updateItem = (stage: 'checkinItems' | 'checkoutItems', field: keyof ContractItems, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [stage]: {
                ...prev[stage],
                [field]: value
            }
        }));
    };

    const updateVest = (stage: 'checkinItems' | 'checkoutItems', size: keyof ContractItems['vests'], value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [stage]: {
                ...prev[stage],
                vests: {
                    ...prev[stage].vests,
                    [size]: value
                }
            }
        }));
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";
    const isDeleteMessage = successMessage?.toLowerCase().includes('excluído');

    // --- Componente de Itens do Contrato ---
    const ContractItemsGrid = ({ stage, title }: { stage: 'checkinItems' | 'checkoutItems', title: string }) => (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].tiem} 
                        onChange={e => updateItem(stage, 'tiem', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Documento (TIEM)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].fuelFull} 
                        onChange={e => updateItem(stage, 'fuelFull', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Tanque Cheio?</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].key} 
                        onChange={e => updateItem(stage, 'key', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Chave do Jet Ski</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].insurance} 
                        onChange={e => updateItem(stage, 'insurance', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Seguro Obrigatório</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].trailerDoc} 
                        onChange={e => updateItem(stage, 'trailerDoc', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Doc. Carreta Rodoviária</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].anchor} 
                        onChange={e => updateItem(stage, 'anchor', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Âncora</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].rope} 
                        onChange={e => updateItem(stage, 'rope', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Cabo de Atracação</span>
                </label>

                {/* Itens extras apenas para Checkout */}
                {stage === 'checkoutItems' && (
                    <>
                        <label className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-100 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData[stage].wash} 
                                onChange={e => updateItem(stage, 'wash', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-700">Lavar Jet Ski</span>
                                <span className="text-[10px] text-gray-500 font-medium">Procedimento Padrão</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-100 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData[stage].freshwaterFlush} 
                                onChange={e => updateItem(stage, 'freshwaterFlush', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-700">Adoçar Motor</span>
                                <span className="text-[10px] text-gray-500 font-medium">Remoção de Sal</span>
                            </div>
                        </label>
                    </>
                )}
            </div>
            
            <div className="mt-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Coletes Salva-Vidas</span>
                <div className="flex flex-wrap gap-4 mt-2">
                    {['EG', 'GG', 'G1', 'M'].map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={formData[stage].vests[size.toLowerCase() as keyof ContractItems['vests']]}
                                onChange={e => updateVest(stage, size.toLowerCase() as keyof ContractItems['vests'], e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 font-bold">{size}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    // --- RENDERIZAR FORMULÁRIO ---
    if (view === 'form') {
        return (
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Operação Segura</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">{editingId ? 'Editar Checklist' : 'Novo Checklist'}</h2>
                        <p className="text-gray-200 text-sm font-medium mt-1">Realize a conferência técnica antes e depois da navegação</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="bg-white w-full max-w-5xl rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                        <form className="flex flex-col" onSubmit={validateAndSave}>
                            {/* Seção de Dados Principais */}
                            <div className="p-6 md:p-8 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
                                    <input 
                                        value={formData.clientName} 
                                        onChange={e => setFormData({...formData, clientName: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                        placeholder="Nome do Cliente"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email / Contato</label>
                                    <input 
                                        value={formData.clientEmail} 
                                        onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                        placeholder="Email ou Telefone"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Jet Ski</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.jetSki} 
                                            onChange={e => setFormData({...formData, jetSki: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {fleet.length > 0 ? (
                                                fleet.map(item => <option key={item.id} value={item.name}>{item.name} - {item.plate}</option>)
                                            ) : (
                                                <option value="Jet Ski Padrão">Jet Ski Padrão</option>
                                            )}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Data</label>
                                    <input 
                                        type="date"
                                        value={formData.date} 
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                        required
                                    />
                                </div>
                            </div>

                            {/* 1. CHECK-IN */}
                            <div className="border-l-4 border-primary">
                                <div className="p-6 md:p-8 border-y border-gray-100 bg-primary/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-2xl">login</span>
                                            <h3 className="text-xl font-bold text-primary">1. Check-in (Retirada)</h3>
                                        </div>
                                        <select 
                                            value={formData.statusCheckIn}
                                            onChange={e => setFormData({...formData, statusCheckIn: e.target.value as any})}
                                            className="bg-white border border-gray-200 text-sm font-bold text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-primary shadow-sm"
                                        >
                                            <option value="Pendente">Pendente</option>
                                            <option value="Concluído">Concluído</option>
                                        </select>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Conferência dos itens na entrega ao cliente.</p>
                                </div>
                                
                                <div className="p-6 md:p-8 bg-gray-50/10">
                                    {/* Subseção: Documentação e Mídia */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Registro Visual e Documentos</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <div className="space-y-4">
                                                <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors group bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-700">Vídeo de check-in</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="cursor-pointer text-primary hover:text-secondary transition-colors" title="Upload Vídeo">
                                                            <span className="material-symbols-outlined text-[24px]">videocam</span>
                                                            <input accept="video/*" className="hidden" type="file"/>
                                                        </label>
                                                    </div>
                                                </label>
                                                <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-700">CHA (Habilitação)</span>
                                                    </div>
                                                    <label className="cursor-pointer text-primary hover:text-secondary" title="Upload Foto">
                                                        <span className="material-symbols-outlined text-[24px]">file_upload</span>
                                                        <input accept="image/*" className="hidden" type="file"/>
                                                    </label>
                                                </label>
                                                <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-700">Contrato Assinado</span>
                                                    </div>
                                                    <label className="cursor-pointer text-primary hover:text-secondary" title="Upload Contrato Assinado">
                                                        <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                                                        <input accept="application/pdf" className="hidden" type="file"/>
                                                    </label>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subseção: Conferência Contratual */}
                                    <ContractItemsGrid stage="checkinItems" title="Conferência de Itens do Contrato" />
                                </div>
                            </div>

                            {/* 2. CHECK-OUT */}
                            <div className="border-l-4 border-secondary mt-2">
                                <div className="p-6 md:p-8 border-y border-gray-100 bg-secondary/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-secondary text-2xl">logout</span>
                                            <h3 className="text-xl font-bold text-primary">2. Check-out (Devolução)</h3>
                                        </div>
                                        <select 
                                            value={formData.statusCheckOut}
                                            onChange={e => setFormData({...formData, statusCheckOut: e.target.value as any})}
                                            className="bg-white border border-gray-200 text-sm font-bold text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-secondary shadow-sm"
                                        >
                                            <option value="Não Iniciado">Não Iniciado</option>
                                            <option value="Em Aberto">Em Aberto</option>
                                            <option value="Concluído">Concluído</option>
                                        </select>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Vistoria no retorno para verificação de danos e itens.</p>
                                </div>
                                
                                <div className="p-6 md:p-8 bg-gray-50/10">
                                    {/* Subseção: Registro Visual */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Registro Visual de Retorno</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-teal-50/30 cursor-pointer transition-colors bg-white">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-gray-700">Vídeo de check-out</span>
                                                </div>
                                                <label className="cursor-pointer text-secondary hover:text-primary transition-colors" title="Upload Vídeo de Retorno">
                                                    <span className="material-symbols-outlined text-[24px]">videocam</span>
                                                    <input accept="video/*" className="hidden" type="file"/>
                                                </label>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Subseção: Conferência Contratual de Retorno */}
                                    <ContractItemsGrid stage="checkoutItems" title="Conferência de Devolução" />
                                </div>
                            </div>

                            <div className="px-6 md:px-8 py-8 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="notes">Observações Adicionais</label>
                                <textarea 
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" 
                                    id="notes" 
                                    placeholder="Relate qualquer detalhe, avaria encontrada ou observação sobre o contrato..." 
                                    rows={3}
                                    value={formData.observations}
                                    onChange={e => setFormData({...formData, observations: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                                <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors" type="button" onClick={() => setView('list')}>
                                    Cancelar
                                </button>
                                <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2" type="submit">
                                    <span className="material-symbols-outlined text-[18px]">verified</span>
                                    Salvar Checklist
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDERIZAR LISTA ---
    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[140px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">fact_check</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">Listagem de Checklists</h2>
                        <p className="text-gray-200 text-sm font-medium mt-1">Gerencie as vistorias de entrada e saída dos Jet Skis.</p>
                    </div>
                </div>
            </div>

            {/* Mensagem de Sucesso */}
            {successMessage && (
                <div 
                    className={`${isDeleteMessage ? 'bg-red-50 border-red-500 text-red-800' : 'bg-emerald-50 border-emerald-500 text-emerald-800'} border-l-4 p-4 rounded-lg flex items-center justify-between shadow-md`}
                    role="alert"
                    style={{ animation: 'fade-in-up 0.5s ease-out' }}
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">{isDeleteMessage ? 'delete' : 'check_circle'}</span>
                        <p className="font-bold text-sm">{successMessage}</p>
                    </div>
                    <button onClick={() => setSuccessMessage(null)} className={`${isDeleteMessage ? 'text-red-800/70 hover:text-red-800' : 'text-emerald-800/70 hover:text-emerald-800'}`}>
                            <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                            placeholder="Buscar por cliente ou ID..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Exportar
                        </button>
                        <button 
                            onClick={handleAddNew}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap text-sm"
                        >
                            <span className="material-symbols-outlined font-bold text-[20px]">add_circle</span>
                            Iniciar Checklist
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100">Cliente</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100">Jet Ski</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100">Data</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100">Status Check-in</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100">Status Check-out</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredChecklists.map((item, index) => {
                                const checkInStyle = getStatusStyle(item.statusCheckIn);
                                const checkOutStyle = getStatusStyle(item.statusCheckOut);
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#101419]">{item.clientName}</span>
                                                <span className="text-xs text-gray-500">{item.clientEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">directions_boat</span>
                                                <span className="text-sm font-medium text-gray-700">{item.jetSki}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.date)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${checkInStyle.bg} ${checkInStyle.text}`}>
                                                <span className={`size-1.5 rounded-full ${checkInStyle.dot} mr-1.5`}></span>
                                                {item.statusCheckIn}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${checkOutStyle.bg} ${checkOutStyle.text}`}>
                                                <span className={`size-1.5 rounded-full ${checkOutStyle.dot} mr-1.5`}></span>
                                                {item.statusCheckOut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteClick(item)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredChecklists.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        Nenhum checklist encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 md:p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mostrando {filteredChecklists.length > 0 ? 1 : 0}-{Math.min(3, filteredChecklists.length)} de {filteredChecklists.length} checklists</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="p-2 border border-primary bg-primary text-white rounded-lg text-sm font-bold w-10">1</button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium w-10">2</button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Checklist"
                message={`Tem certeza que deseja excluir o checklist de ${itemToDelete?.clientName}? Esta ação não pode ser desfeita.`}
            />

            {/* Modal de Validação de Itens Faltantes */}
            {isValidationModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-[fade-in-up_0.3s_ease-out]"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-amber-600">assignment_late</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Itens Pendentes</h3>
                                    <p className="text-sm text-gray-600 mt-1">Os seguintes itens ainda não foram conferidos:</p>
                                    <ul className="mt-3 space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                        {missingItems.map((item, index) => (
                                            <li key={index} className="text-sm font-medium text-red-600 flex items-center gap-2">
                                                <span className="size-1.5 rounded-full bg-red-500"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-xl">
                            <button 
                                onClick={() => setIsValidationModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Voltar e Conferir
                            </button>
                            <button 
                                onClick={performSave}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold shadow-md shadow-amber-500/20 hover:bg-amber-700 transition-all active:scale-95"
                            >
                                Salvar mesmo assim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChecklistsScreen;
