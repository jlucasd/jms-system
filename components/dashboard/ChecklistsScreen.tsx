
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FleetItem, Client } from '../../App';
import ConfirmationModal from './ConfirmationModal';
import { supabase } from '../../lib/supabase';

interface ChecklistsScreenProps {
    fleet?: FleetItem[];
    clients?: Client[];
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
    // Itens de Mídia e Doc (Checkboxes)
    checkinVideo?: boolean;
    cha?: boolean;
    signedContract?: boolean;
    checkoutVideo?: boolean;
}

// Status unificado
type ChecklistStatus = 'Não Iniciado' | 'Em Aberto' | 'Concluído';

interface ChecklistItem {
    id: number | string; // Suporta ID do banco (number) ou temp (string)
    clientName: string;
    clientPhone: string;
    jetSki: string;
    date: string;
    statusCheckIn: ChecklistStatus;
    statusCheckOut: ChecklistStatus;
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
    freshwaterFlush: false,
    checkinVideo: false,
    cha: false,
    signedContract: false,
    checkoutVideo: false
};

// Mapa de nomes legíveis para os itens para exibição no Modal
const itemLabels: Record<string, string> = {
    tiem: 'Documento (TIEM)',
    fuelFull: 'Tanque Cheio',
    key: 'Chave do Jet Ski',
    insurance: 'Seguro Obrigatório',
    trailerDoc: 'Doc. Carreta Rodoviária',
    anchor: 'Âncora',
    rope: 'Cabo de Atracação',
    wash: 'Lavar Jet Ski',
    freshwaterFlush: 'Adoçar Motor',
    checkinVideo: 'Vídeo de Check-in',
    cha: 'CHA (Habilitação)',
    signedContract: 'Contrato Assinado',
    checkoutVideo: 'Vídeo de Check-out',
    'vests.any': 'Pelo menos 1 Colete Salva-Vidas'
};

const ChecklistsScreen: React.FC<ChecklistsScreenProps> = ({ fleet = [], clients = [] }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado de Ordenação
    const [sortConfig, setSortConfig] = useState<{ key: keyof ChecklistItem; direction: 'asc' | 'desc' } | null>(null);

    const itemsPerPage = 10;

    // Modal de Exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ChecklistItem | null>(null);

    // Modal de Validação / Pendências
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [checkinPendencies, setCheckinPendencies] = useState<string[]>([]);
    const [checkoutPendencies, setCheckoutPendencies] = useState<string[]>([]);

    // Estados para o Dropdown de Clientes
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Estado dos Dados
    const [checklists, setChecklists] = useState<ChecklistItem[]>([]);

    // Estados do Formulário
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState<Omit<ChecklistItem, 'id'>>({
        clientName: '',
        clientPhone: '',
        jetSki: '',
        date: '',
        statusCheckIn: 'Não Iniciado',
        statusCheckOut: 'Não Iniciado',
        observations: '',
        checkinItems: JSON.parse(JSON.stringify(initialContractItems)),
        checkoutItems: JSON.parse(JSON.stringify(initialContractItems))
    });

    useEffect(() => {
        fetchChecklists();
    }, []);

    const fetchChecklists = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('checklists')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedData: ChecklistItem[] = data.map((item: any) => ({
                    id: item.id,
                    clientName: item.client_name,
                    clientPhone: item.client_phone || '',
                    jetSki: item.jet_ski,
                    date: item.date,
                    statusCheckIn: item.status_checkin,
                    statusCheckOut: item.status_checkout,
                    observations: item.observations || '',
                    // Garante merge com initialContractItems para evitar erros de undefined em campos novos
                    checkinItems: { 
                        ...initialContractItems, 
                        ...item.checkin_items, 
                        vests: { ...initialContractItems.vests, ...(item.checkin_items?.vests || {}) } 
                    },
                    checkoutItems: { 
                        ...initialContractItems, 
                        ...item.checkout_items, 
                        vests: { ...initialContractItems.vests, ...(item.checkout_items?.vests || {}) } 
                    }
                }));
                setChecklists(mappedData);
            }
        } catch (error) {
            console.error('Erro ao buscar checklists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Resetar paginação ao filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDate]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsClientDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- LÓGICA DE SELEÇÃO DE CLIENTE ---
    const handleSelectClient = (client: Client) => {
        setFormData(prev => ({
            ...prev,
            clientName: client.name,
            clientPhone: client.phone || ''
        }));
        setIsClientDropdownOpen(false);
    };

    // Filtro seguro para clientes
    const filteredClients = useMemo(() => {
        if (!clients) return [];
        return clients.filter(c => 
            c.name.toLowerCase().includes((formData.clientName || '').toLowerCase())
        );
    }, [clients, formData.clientName]);

    // --- MÁSCARA DE TELEFONE ---
    const maskPhone = (value: string) => {
        if (!value) return '';
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    // --- LÓGICA DE CÁLCULO DE STATUS ---
    const calculateStatus = (items: ContractItems, context: 'checkin' | 'checkout'): ChecklistStatus => {
        if (!items || !items.vests) return 'Não Iniciado';

        const mainKeys = context === 'checkin'
            ? ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope', 'checkinVideo', 'cha', 'signedContract']
            : ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope', 'wash', 'freshwaterFlush', 'checkoutVideo', 'signedContract'];
        
        // Contagem de itens principais marcados
        let mainCheckedCount = 0;
        mainKeys.forEach(k => {
            if ((items as any)[k] === true) mainCheckedCount++;
        });

        // Verificação de Coletes (Pelo menos 1)
        const vestKeys = ['eg', 'gg', 'g1', 'm'];
        let vestCheckedCount = 0;
        vestKeys.forEach(k => {
            if ((items.vests as any)[k] === true) vestCheckedCount++;
        });
        const hasAtLeastOneVest = vestCheckedCount > 0;

        const totalExpectedMain = mainKeys.length;

        // Se nada estiver marcado (nem itens principais, nem coletes)
        if (mainCheckedCount === 0 && vestCheckedCount === 0) return 'Não Iniciado';

        // Se TODOS os principais estão marcados E tem pelo menos um colete
        if (mainCheckedCount === totalExpectedMain && hasAtLeastOneVest) return 'Concluído';

        // Caso contrário
        return 'Em Aberto';
    };

    // --- AUTO-UPDATE STATUS LOGIC ---
    useEffect(() => {
        if (view !== 'form') return;

        const newCheckInStatus = calculateStatus(formData.checkinItems, 'checkin');
        const newCheckOutStatus = calculateStatus(formData.checkoutItems, 'checkout');

        if (newCheckInStatus !== formData.statusCheckIn) {
            setFormData(prev => ({ ...prev, statusCheckIn: newCheckInStatus }));
        }

        if (newCheckOutStatus !== formData.statusCheckOut) {
            setFormData(prev => ({ ...prev, statusCheckOut: newCheckOutStatus }));
        }
    }, [formData.checkinItems, formData.checkoutItems, view]); 

    // Lógica de Ordenação
    const handleSort = (key: keyof ChecklistItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key: keyof ChecklistItem) => {
        if (sortConfig?.key !== key) return <span className="material-symbols-outlined text-[16px] text-gray-300 opacity-0 group-hover:opacity-50">unfold_more</span>;
        return <span className="material-symbols-outlined text-[16px] text-primary">{sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>;
    };

    // Lógica de Filtro e Ordenação
    const filteredChecklists = useMemo(() => {
        let result = checklists.filter(item => {
            const searchMatch = item.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            const dateMatch = !selectedDate || item.date === selectedDate;
            return searchMatch && dateMatch;
        });

        if (sortConfig !== null) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' 
                        ? aValue.localeCompare(bValue) 
                        : bValue.localeCompare(aValue);
                }
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [searchTerm, selectedDate, checklists, sortConfig]);

    // Paginação
    const totalPages = Math.ceil(filteredChecklists.length / itemsPerPage);
    const paginatedChecklists = useMemo(() => {
        return filteredChecklists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredChecklists, currentPage, itemsPerPage]);

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredChecklists.length);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Lógica de Exportação
    const handleExport = () => {
        const headers = ["ID", "Cliente", "Telefone", "Jet Ski", "Data", "Status Check-in", "Status Check-out", "Observações"];
        const csvContent = [
            headers.join(','),
            ...filteredChecklists.map(item => [
                item.id,
                `"${item.clientName}"`,
                item.clientPhone,
                `"${item.jetSki}"`,
                item.date,
                item.statusCheckIn,
                item.statusCheckOut,
                `"${item.observations.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'checklists_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Concluído':
                return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
            case 'Em Aberto':
                return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
            case 'Não Iniciado':
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
            clientPhone: '',
            jetSki: fleet.length > 0 ? fleet[0].name : '',
            date: new Date().toISOString().split('T')[0],
            statusCheckIn: 'Não Iniciado',
            statusCheckOut: 'Não Iniciado',
            observations: '',
            checkinItems: JSON.parse(JSON.stringify(initialContractItems)),
            checkoutItems: JSON.parse(JSON.stringify(initialContractItems))
        });
        setView('form');
    };

    const handleEdit = (item: ChecklistItem) => {
        setEditingId(item.id);
        const mergedCheckinItems = { 
            ...initialContractItems, 
            ...item.checkinItems,
            vests: { ...initialContractItems.vests, ...(item.checkinItems?.vests || {}) } 
        };
        const mergedCheckoutItems = { 
            ...initialContractItems, 
            ...item.checkoutItems,
            vests: { ...initialContractItems.vests, ...(item.checkoutItems?.vests || {}) }
        };

        setFormData({
            clientName: item.clientName,
            clientPhone: item.clientPhone,
            jetSki: item.jetSki,
            date: item.date,
            statusCheckIn: item.statusCheckIn,
            statusCheckOut: item.statusCheckOut,
            observations: item.observations,
            checkinItems: mergedCheckinItems,
            checkoutItems: mergedCheckoutItems
        });
        setView('form');
    };

    const handleDeleteClick = (item: ChecklistItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            setIsLoading(true);
            try {
                const { error } = await supabase.from('checklists').delete().eq('id', itemToDelete.id);
                if (error) throw error;
                setSuccessMessage('Checklist excluído com sucesso!');
                fetchChecklists();
            } catch (err) {
                console.error("Erro ao excluir", err);
                alert("Erro ao excluir checklist.");
            } finally {
                setIsLoading(false);
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            }
        }
    };

    // Função que verifica pendências antes de salvar
    const validateAndSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (!formData.clientName || !formData.jetSki || !formData.date) {
                alert("Preencha os campos obrigatórios");
                return;
            }

            const currentCheckinPendencies: string[] = [];
            const currentCheckoutPendencies: string[] = [];
            
            // --- VALIDAÇÃO CHECK-IN ---
            const checkinKeys = ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope', 'checkinVideo', 'cha', 'signedContract'];
            checkinKeys.forEach(key => {
                const k = key as keyof ContractItems;
                // Verifica se item é falso ou undefined
                if (!formData.checkinItems || formData.checkinItems[k] !== true) {
                    currentCheckinPendencies.push(itemLabels[key] || key);
                }
            });
            // Coletes Check-in
            const checkinVests = ['eg', 'gg', 'g1', 'm'];
            const hasCheckinVest = formData.checkinItems?.vests 
                ? checkinVests.some(size => formData.checkinItems.vests[size as keyof ContractItems['vests']])
                : false;
                
            if (!hasCheckinVest) {
                currentCheckinPendencies.push(itemLabels['vests.any']);
            }

            // --- VALIDAÇÃO CHECK-OUT ---
            const checkoutKeys = ['tiem', 'fuelFull', 'key', 'insurance', 'trailerDoc', 'anchor', 'rope', 'wash', 'freshwaterFlush', 'checkoutVideo', 'signedContract'];
            checkoutKeys.forEach(key => {
                const k = key as keyof ContractItems;
                if (!formData.checkoutItems || formData.checkoutItems[k] !== true) {
                    currentCheckoutPendencies.push(itemLabels[key] || key);
                }
            });
            // Coletes Check-out
            const hasCheckoutVest = formData.checkoutItems?.vests 
                ? checkinVests.some(size => formData.checkoutItems.vests[size as keyof ContractItems['vests']])
                : false;

            if (!hasCheckoutVest) {
                currentCheckoutPendencies.push(itemLabels['vests.any']);
            }

            // Lógica para exibir modal:
            // Mostra modal se houver pendências
            if (currentCheckinPendencies.length > 0 || currentCheckoutPendencies.length > 0) {
                setCheckinPendencies(currentCheckinPendencies);
                setCheckoutPendencies(currentCheckoutPendencies);
                setIsValidationModalOpen(true);
            } else {
                performSave();
            }
        } catch (error) {
            console.error("Erro na validação do checklist:", error);
            alert("Ocorreu um erro ao validar os dados. Tente novamente.");
        }
    };

    const performSave = async () => {
        setIsLoading(true);
        try {
            const payload = {
                client_name: formData.clientName,
                client_phone: formData.clientPhone,
                jet_ski: formData.jetSki,
                date: formData.date,
                status_checkin: formData.statusCheckIn,
                status_checkout: formData.statusCheckOut,
                observations: formData.observations,
                checkin_items: formData.checkinItems,
                checkout_items: formData.checkoutItems
            };

            let error;
            if (editingId && typeof editingId === 'number') {
                // Update
                const res = await supabase.from('checklists').update(payload).eq('id', editingId);
                error = res.error;
            } else {
                // Insert (ignore if editingId is a temp string, it's treated as new)
                const res = await supabase.from('checklists').insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            setSuccessMessage(editingId ? 'Checklist atualizado com sucesso!' : 'Checklist salvo com sucesso!');
            setIsValidationModalOpen(false);
            setCheckinPendencies([]);
            setCheckoutPendencies([]);
            await fetchChecklists();
            setView('list');

        } catch (error: any) {
            console.error("Erro ao salvar checklist:", error);
            alert("Erro ao salvar os dados no banco: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

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
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].tiem} 
                        onChange={e => updateItem(stage, 'tiem', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Documento (TIEM)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].fuelFull} 
                        onChange={e => updateItem(stage, 'fuelFull', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Tanque Cheio?</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].key} 
                        onChange={e => updateItem(stage, 'key', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Chave do Jet Ski</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].insurance} 
                        onChange={e => updateItem(stage, 'insurance', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Seguro Obrigatório</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].trailerDoc} 
                        onChange={e => updateItem(stage, 'trailerDoc', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Doc. Carreta Rodoviária</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData[stage].anchor} 
                        onChange={e => updateItem(stage, 'anchor', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Âncora</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
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
                        <label className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
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
                        <label className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
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
                <span className="text-xs font-bold text-gray-500 uppercase">Coletes Salva-Vidas (Selecione pelo menos um)</span>
                <div className="flex flex-wrap gap-4 mt-2">
                    {['EG', 'GG', 'G1', 'M'].map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">
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
                                <div className="relative" ref={dropdownRef}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">badge</span>
                                        <input 
                                            value={formData.clientName} 
                                            onChange={(e) => {
                                                setFormData({...formData, clientName: e.target.value});
                                                setIsClientDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsClientDropdownOpen(true)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" 
                                            placeholder="Busque ou digite o nome..." 
                                            required
                                            autoComplete="off"
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">search</span>
                                    </div>
                                    
                                    {/* Dropdown de Clientes */}
                                    {isClientDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-[fade-in-up_0.1s_ease-out]">
                                            {filteredClients.map(client => (
                                                <div 
                                                    key={client.id}
                                                    onClick={() => handleSelectClient(client)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-sm text-gray-800">{client.name}</span>
                                                        <span className="text-xs text-gray-400 font-mono">{client.cpf}</span>
                                                    </div>
                                                    {client.phone && <div className="text-xs text-gray-500 mt-0.5">{client.phone}</div>}
                                                </div>
                                            ))}
                                            {filteredClients.length === 0 && (
                                                <div className="p-4 text-center text-gray-500 text-sm italic">
                                                    Nenhum cliente encontrado.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone / WhatsApp</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">smartphone</span>
                                        <input 
                                            value={formData.clientPhone} 
                                            onChange={e => setFormData({...formData, clientPhone: maskPhone(e.target.value)})}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" 
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
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
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(formData.statusCheckIn).bg} ${getStatusStyle(formData.statusCheckIn).text}`}>
                                                <span className={`size-1.5 rounded-full ${getStatusStyle(formData.statusCheckIn).dot} mr-1.5`}></span>
                                                {formData.statusCheckIn}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Conferência dos itens na entrega ao cliente.</p>
                                </div>
                                
                                <div className="p-6 md:p-8 bg-gray-50/10">
                                    {/* Subseção: Documentação e Mídia */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Registro Visual e Documentos - Check-in</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <div className="space-y-4">
                                                
                                                {/* Checkin Video */}
                                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-primary/30 transition-colors group">
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.checkinItems.checkinVideo} 
                                                            onChange={e => updateItem('checkinItems', 'checkinVideo', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Vídeo de check-in</span>
                                                    </label>
                                                    <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-1" title="Upload Vídeo">
                                                        <span className="material-symbols-outlined text-[24px]">videocam</span>
                                                        <input accept="video/*" className="hidden" type="file"/>
                                                    </label>
                                                </div>

                                                {/* CHA */}
                                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-primary/30 transition-colors group">
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.checkinItems.cha} 
                                                            onChange={e => updateItem('checkinItems', 'cha', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">CHA (Habilitação)</span>
                                                    </label>
                                                    <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-1" title="Upload Foto">
                                                        <span className="material-symbols-outlined text-[24px]">file_upload</span>
                                                        <input accept="image/*" className="hidden" type="file"/>
                                                    </label>
                                                </div>

                                                {/* Contrato */}
                                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-primary/30 transition-colors group">
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.checkinItems.signedContract} 
                                                            onChange={e => updateItem('checkinItems', 'signedContract', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Contrato Assinado</span>
                                                    </label>
                                                    <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-1" title="Upload Contrato Assinado">
                                                        <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                                                        <input accept="application/pdf" className="hidden" type="file"/>
                                                    </label>
                                                </div>

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
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(formData.statusCheckOut).bg} ${getStatusStyle(formData.statusCheckOut).text}`}>
                                                <span className={`size-1.5 rounded-full ${getStatusStyle(formData.statusCheckOut).dot} mr-1.5`}></span>
                                                {formData.statusCheckOut}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Vistoria no retorno para verificação de danos e itens.</p>
                                </div>
                                
                                <div className="p-6 md:p-8 bg-gray-50/10">
                                    {/* Subseção: Registro Visual */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Registro Visual e Documentos - Check-out</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <div className="space-y-4">
                                                {/* Check-out Video */}
                                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-secondary/30 transition-colors group">
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.checkoutItems.checkoutVideo} 
                                                            onChange={e => updateItem('checkoutItems', 'checkoutVideo', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Vídeo de check-out</span>
                                                    </label>
                                                    <label className="cursor-pointer text-gray-400 hover:text-secondary transition-colors p-1" title="Upload Vídeo de Retorno">
                                                        <span className="material-symbols-outlined text-[24px]">videocam</span>
                                                        <input accept="video/*" className="hidden" type="file"/>
                                                    </label>
                                                </div>

                                                {/* Contrato Assinado (Check-out) */}
                                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-secondary/30 transition-colors group">
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.checkoutItems.signedContract} 
                                                            onChange={e => updateItem('checkoutItems', 'signedContract', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Contrato Assinado</span>
                                                    </label>
                                                    <label className="cursor-pointer text-gray-400 hover:text-secondary transition-colors p-1" title="Upload Contrato Assinado">
                                                        <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                                                        <input accept="application/pdf" className="hidden" type="file"/>
                                                    </label>
                                                </div>
                                            </div>
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

                {/* Modal de Validação - Renderizado DENTRO da visualização de formulário para ser visível */}
                {isValidationModalOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        aria-modal="true"
                        role="dialog"
                    >
                        <div 
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-[fade-in-up_0.3s_ease-out] flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 overflow-y-auto">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-amber-600">assignment_late</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Itens Pendentes</h3>
                                        <p className="text-sm text-gray-600 mt-1">Alguns itens ainda não foram marcados. Deseja salvar como "Em Aberto"?</p>
                                    </div>
                                </div>

                                {/* Lista de Check-in */}
                                {checkinPendencies.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 border-b border-primary/10 pb-1">Check-in (Saída)</h4>
                                        <ul className="space-y-1 pl-1">
                                            {checkinPendencies.map((item, index) => (
                                                <li key={index} className="text-sm font-medium text-red-600 flex items-center gap-2">
                                                    <span className="size-1.5 rounded-full bg-red-500"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Lista de Check-out */}
                                {checkoutPendencies.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 border-b border-primary/10 pb-1">Check-out (Retorno)</h4>
                                        <ul className="space-y-1 pl-1">
                                            {checkoutPendencies.map((item, index) => (
                                                <li key={index} className="text-sm font-medium text-red-600 flex items-center gap-2">
                                                    <span className="size-1.5 rounded-full bg-red-500"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-xl border-t border-gray-100">
                                <button 
                                    onClick={() => setIsValidationModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Voltar e Conferir
                                </button>
                                <button 
                                    onClick={performSave}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold shadow-md shadow-amber-500/20 hover:bg-amber-700 transition-all active:scale-95 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                                    Salvar com Pendências
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input 
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                placeholder="Buscar por cliente..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <input 
                                className="pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-600 cursor-pointer" 
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
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
                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading && checklists.length === 0 ? (
                        <div className="flex items-center justify-center h-full py-12">
                            <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th onClick={() => handleSort('clientName')} className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-1">Cliente {renderSortIcon('clientName')}</div>
                                    </th>
                                    <th onClick={() => handleSort('jetSki')} className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-1">Jet Ski {renderSortIcon('jetSki')}</div>
                                    </th>
                                    <th onClick={() => handleSort('date')} className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-1">Data {renderSortIcon('date')}</div>
                                    </th>
                                    <th onClick={() => handleSort('statusCheckIn')} className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-1">Status Check-in {renderSortIcon('statusCheckIn')}</div>
                                    </th>
                                    <th onClick={() => handleSort('statusCheckOut')} className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-1">Status Check-out {renderSortIcon('statusCheckOut')}</div>
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#58738d] uppercase tracking-wider border-b border-gray-100 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedChecklists.map((item, index) => {
                                    const checkInStyle = getStatusStyle(item.statusCheckIn);
                                    const checkOutStyle = getStatusStyle(item.statusCheckOut);
                                    
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#101419]">{item.clientName}</span>
                                                    <span className="text-xs text-gray-500">{item.clientPhone}</span>
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
                                {paginatedChecklists.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            Nenhum checklist encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-4 md:p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Mostrando <span className="font-bold text-gray-700">{filteredChecklists.length > 0 ? startIndex : 0}-{endIndex}</span> de <span className="font-bold text-gray-700">{filteredChecklists.length}</span> checklists
                    </span>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <span className="px-2 text-sm text-gray-600 font-medium">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Checklist"
                message={`Tem certeza que deseja excluir o checklist de ${itemToDelete?.clientName}? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

export default ChecklistsScreen;
