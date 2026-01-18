
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DashboardUser, User } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface UsersScreenProps {
    users: DashboardUser[];
    onNavigateToAddUser: () => void;
    onNavigateToEditUser: (user: DashboardUser) => void;
    onDeleteUser: (userId: string) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    currentUser: User | null;
}

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    // Splits role string into array, trims whitespace, and filters empty strings
    const roles = role.split(',').map(r => r.trim()).filter(Boolean);

    return (
        <div className="flex flex-wrap gap-1.5">
            {roles.map((r, index) => {
                let classes = 'bg-gray-100 text-gray-600 border-gray-200';
                let icon = 'badge';
                switch (r) {
                    case 'Gerente':
                        classes = 'bg-primary/10 text-primary border-primary/20';
                        icon = 'shield_person';
                        break;
                    case 'Colaborador':
                        classes = 'bg-secondary/10 text-teal-700 border-secondary/20';
                        icon = 'group';
                        break;
                    case 'Financeiro':
                        classes = 'bg-purple-50 text-purple-700 border-purple-100';
                        icon = 'account_balance';
                        break;
                    // Legacy roles fallback
                    case 'Atendimento':
                        classes = 'bg-blue-50 text-blue-700 border-blue-200';
                        icon = 'support_agent';
                        break;
                    case 'Instrutor':
                        classes = 'bg-orange-50 text-orange-700 border-orange-200';
                        icon = 'sailing';
                        break;
                }
                return (
                    <span key={index} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${classes}`}>
                        <span className="material-symbols-outlined text-[14px]">{icon}</span>
                        {r}
                    </span>
                );
            })}
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let classes = '';
    let dotClasses = '';
    switch (status) {
        case 'Ativo':
            classes = 'text-emerald-700 bg-emerald-50 border-emerald-100';
            dotClasses = 'bg-emerald-500';
            break;
        case 'Inativo':
            classes = 'text-gray-600 bg-gray-100 border-gray-200';
            dotClasses = 'bg-gray-400';
            break;
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${classes}`}>
            <span className={`size-2 rounded-full ${dotClasses}`}></span>
            {status}
        </span>
    );
};

const UsersScreen: React.FC<UsersScreenProps> = ({ users, onNavigateToAddUser, onNavigateToEditUser, onDeleteUser, successMessage, setSuccessMessage, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('Todos Perfis');
    const [selectedStatus, setSelectedStatus] = useState('Todos Status');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<DashboardUser | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Estado de Ordenação
    const [sortConfig, setSortConfig] = useState<{ key: keyof DashboardUser; direction: 'asc' | 'desc' } | null>(null);

    const itemsPerPage = 10;

    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    const roles = ['Todos Perfis', 'Gerente', 'Colaborador', 'Financeiro'];
    const statuses = ['Todos Status', 'Ativo', 'Inativo'];
    
    // Permissão de Edição/Exclusão: Gerente ou Financeiro
    const canEdit = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
                setIsRoleDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole, selectedStatus]);

    const handleSort = (key: keyof DashboardUser) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = useMemo(() => {
        let result = users.filter(user => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(searchTermLower) || user.email.toLowerCase().includes(searchTermLower);
            // Matches if the user role STRING contains the selected role (for multi-role support)
            const matchesRole = selectedRole === 'Todos Perfis' || user.role.includes(selectedRole);
            const matchesStatus = selectedStatus === 'Todos Status' || user.status === selectedStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });

        if (sortConfig !== null) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [users, searchTerm, selectedRole, selectedStatus, sortConfig]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteClick = (user: DashboardUser) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    const isDeleteMessage = successMessage?.toLowerCase().includes('excluído');

    const renderSortIcon = (key: keyof DashboardUser) => {
        if (sortConfig?.key !== key) return <span className="material-symbols-outlined text-[16px] text-gray-300 opacity-0 group-hover:opacity-50">unfold_more</span>;
        return <span className="material-symbols-outlined text-[16px] text-primary">{sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>;
    };

    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Administração</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">Gerenciamento de Usuários</h2>
                        <p className="text-gray-200 text-sm font-medium mt-1">Controle de acesso e perfis da equipe</p>
                    </div>
                </div>

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
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative group min-w-[280px] flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input 
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" 
                                placeholder="Buscar por nome ou e-mail..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative" ref={roleDropdownRef}>
                            <button onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap w-full justify-center">
                                <span className="material-symbols-outlined text-[20px] text-gray-500">badge</span>
                                {selectedRole}
                                <span className="material-symbols-outlined text-[16px] text-gray-400 ml-1">expand_more</span>
                            </button>
                            {isRoleDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {roles.map(role => (
                                        <a href="#" key={role} onClick={(e) => { e.preventDefault(); setSelectedRole(role); setIsRoleDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{role}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={statusDropdownRef}>
                            <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap w-full justify-center">
                                <span className="material-symbols-outlined text-[20px] text-gray-500">toggle_on</span>
                                {selectedStatus}
                                <span className="material-symbols-outlined text-[16px] text-gray-400 ml-1">expand_more</span>
                            </button>
                            {isStatusDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {statuses.map(status => (
                                        <a href="#" key={status} onClick={(e) => { e.preventDefault(); setSelectedStatus(status); setIsStatusDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{status}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Botão de adicionar também controlado por permissão */}
                    {canEdit && (
                        <button onClick={onNavigateToAddUser} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95 w-full lg:w-auto justify-center">
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            Adicionar Novo Usuário
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[500px]">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-200">
                                    <th onClick={() => handleSort('name')} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap cursor-pointer hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-1">Usuário {renderSortIcon('name')}</div>
                                    </th>
                                    <th onClick={() => handleSort('email')} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap cursor-pointer hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-1">E-mail {renderSortIcon('email')}</div>
                                    </th>
                                    <th onClick={() => handleSort('role')} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap cursor-pointer hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-1">Perfis de Acesso {renderSortIcon('role')}</div>
                                    </th>
                                    <th onClick={() => handleSort('status')} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap cursor-pointer hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
                                    </th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary/80 whitespace-nowrap text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                                    <tr key={user.id} className={`hover:bg-blue-50/30 transition-colors group ${user.status === 'Inativo' ? 'opacity-60' : ''}`}>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {user.imageUrl ? (
                                                    <div className={`size-10 rounded-full bg-cover bg-center border border-gray-100 ${user.status === 'Inativo' ? 'grayscale' : ''}`} style={{ backgroundImage: `url("${user.imageUrl}")` }}></div>
                                                ) : (
                                                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-100 font-bold">{user.name.slice(0, 2)}</div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-[#101419] font-bold text-sm">{user.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="text-[#101419] font-medium text-sm">{user.email}</span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-normal max-w-xs"><RoleBadge role={user.role} /></td>
                                        <td className="py-4 px-6 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            {canEdit && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => onNavigateToEditUser(user)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(user)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-gray-500">
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 mt-auto">
                         <span className="text-sm text-gray-500 mb-2 sm:mb-0">
                            Mostrando <span className="font-bold text-gray-700">{filteredUsers.length > 0 ? startIndex : 0}-{endIndex}</span> de <span className="font-bold text-gray-700">{filteredUsers.length}</span> usuários
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
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default UsersScreen;
