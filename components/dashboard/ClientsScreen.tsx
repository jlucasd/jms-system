
import React, { useState, useMemo, useEffect } from 'react';
import { Client, User } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface ClientsScreenProps {
    clients: Client[];
    onNavigateToAddClient: () => void;
    onNavigateToEditClient: (client: Client) => void;
    onDeleteClient: (clientId: number) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    currentUser: User | null;
}

const ClientsScreen: React.FC<ClientsScreenProps> = ({ clients, onNavigateToAddClient, onNavigateToEditClient, onDeleteClient, successMessage, setSuccessMessage, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const itemsPerPage = 10;
    const canEdit = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);

    const handleSort = (key: keyof Client) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredClients = useMemo(() => {
        let result = clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            client.cpf.includes(searchTerm) ||
            client.phone.includes(searchTerm)
        );

        if (sortConfig !== null) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [clients, searchTerm, sortConfig]);

    const paginatedClients = useMemo(() => {
        return filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredClients, currentPage]);

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredClients.length);

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (clientToDelete) {
            onDeleteClient(clientToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
    };

    const renderSortIcon = (key: keyof Client) => {
        if (sortConfig?.key !== key) return <span className="material-symbols-outlined text-[16px] text-gray-300 opacity-0 group-hover:opacity-50">unfold_more</span>;
        return <span className="material-symbols-outlined text-[16px] text-primary">{sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>;
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">groups</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Clientes</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Gerencie a base de clientes cadastrados.</p>
                </div>
            </div>

            {successMessage && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-lg flex items-center justify-between shadow-md" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold text-sm">{successMessage}</p>
                    </div>
                    <button onClick={() => setSuccessMessage(null)} className="text-emerald-800/70 hover:text-emerald-800"><span className="material-symbols-outlined text-xl">close</span></button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" 
                            placeholder="Buscar por nome, CPF ou telefone..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={onNavigateToAddClient} className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">person_add</span>
                        Novo Cliente
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th onClick={() => handleSort('name')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                    <div className="flex items-center gap-1">Nome {renderSortIcon('name')}</div>
                                </th>
                                <th onClick={() => handleSort('phone')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                    <div className="flex items-center gap-1">Telefone {renderSortIcon('phone')}</div>
                                </th>
                                <th onClick={() => handleSort('cpf')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                    <div className="flex items-center gap-1">CPF {renderSortIcon('cpf')}</div>
                                </th>
                                <th onClick={() => handleSort('chaNumber')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                    <div className="flex items-center gap-1">Nº CHA {renderSortIcon('chaNumber')}</div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedClients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                {client.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-primary">{client.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{client.phone}</td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">{client.cpf}</td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">{client.chaNumber || '-'}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {canEdit && (
                                                <>
                                                    <button onClick={() => onNavigateToEditClient(client)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(client)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedClients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Mostrando <span className="font-bold text-gray-700">{filteredClients.length > 0 ? startIndex : 0}-{endIndex}</span> de <span className="font-bold text-gray-700">{filteredClients.length}</span> clientes
                    </span>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <span className="px-2 text-sm text-gray-600 font-medium">Página {currentPage} de {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Cliente"
                message={`Tem certeza que deseja excluir o cliente "${clientToDelete?.name}"?`}
            />
        </div>
    );
};

export default ClientsScreen;
