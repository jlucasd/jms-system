
import React, { useState, useMemo, useEffect } from 'react';
import { Cost, User } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface FinancialScreenProps {
    costs: Cost[];
    onNavigateToAddCost: () => void;
    onNavigateToEditCost: (cost: Cost) => void;
    onDeleteCost: (costId: number) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    currentUser: User | null;
}

const months = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const FinancialScreen: React.FC<FinancialScreenProps> = ({ costs, onNavigateToAddCost, onNavigateToEditCost, onDeleteCost, successMessage, setSuccessMessage, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [selectedStatus, setSelectedStatus] = useState('Status: Todos');
    const [selectedYear, setSelectedYear] = useState('Todos');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [costToDelete, setCostToDelete] = useState<Cost | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Estado de Ordenação
    const [sortConfig, setSortConfig] = useState<{ key: keyof Cost; direction: 'asc' | 'desc' } | null>(null);

    const itemsPerPage = 10;

    // Permissões
    const isPrivilegedUser = currentUser?.role?.includes('Gerente') || currentUser?.role?.includes('Financeiro');
    const canEdit = isPrivilegedUser;
    const canViewSummary = isPrivilegedUser;

     useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedMonth, selectedStatus, selectedYear]);

    // Extrai anos disponíveis dos custos
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        costs.forEach(cost => {
            if (cost.date && cost.date.length >= 4) {
                years.add(cost.date.substring(0, 4));
            }
        });
        // Ordena decrescente
        return ['Todos', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
    }, [costs]);

    const handleSort = (key: keyof Cost) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 1. Base Filter (Ano, Mês, Busca) - Usado tanto para os Cards quanto para a Tabela
    const baseCosts = useMemo(() => {
        return costs.filter(cost => {
            // Filtro de Mês
            let monthMatch = true;
            if (selectedMonth !== 'Todos') {
                if (cost.date) {
                    const costMonth = parseInt(cost.date.split('-')[1], 10);
                    const targetMonthIndex = months.indexOf(selectedMonth);
                    monthMatch = costMonth === targetMonthIndex;
                } else {
                    monthMatch = false;
                }
            }

            // Filtro de Ano
            let yearMatch = true;
            if (selectedYear !== 'Todos') {
                yearMatch = cost.date?.startsWith(selectedYear) || false;
            }

            // Filtro de Busca
            const searchMatch = searchTerm === '' || 
                                cost.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                cost.investor.toLowerCase().includes(searchTerm.toLowerCase());
            
            return monthMatch && yearMatch && searchMatch;
        });
    }, [costs, searchTerm, selectedMonth, selectedYear]);

    // 2. Summary Data (Baseado no contexto do período/busca, ignorando o filtro de status da tabela)
    const summaryData = useMemo(() => {
        let total = 0;
        let paid = 0;
        let pending = 0;

        baseCosts.forEach(cost => {
            total += cost.value;
            paid += cost.paidValue;

            // Pendente: Soma dos valores não pagos de itens marcados como pendentes
            if (!cost.isPaid) {
                pending += (cost.value - cost.paidValue);
            }
        });
        
        // Descontos: Custo Total - Valor Pago Total
        const discounts = total - paid;
        
        return { total, paid, pending, discounts };
    }, [baseCosts]);

    // 3. Filtered Costs (Baseado no baseCosts + Filtro de Status + Ordenação) - Usado para a Tabela
    const filteredCosts = useMemo(() => {
        let result = baseCosts.filter(cost => {
            // Filtro de Status
            let statusMatch = true;
            if (selectedStatus === 'Pago') {
                statusMatch = cost.isPaid;
            } else if (selectedStatus === 'Pendente') {
                statusMatch = !cost.isPaid;
            }
            return statusMatch;
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
    }, [baseCosts, selectedStatus, sortConfig]);

    const totalPages = Math.ceil(filteredCosts.length / itemsPerPage);
    const paginatedCosts = useMemo(() => {
        return filteredCosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredCosts, currentPage, itemsPerPage]);
    
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredCosts.length);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const handleDeleteClick = (cost: Cost) => {
        setCostToDelete(cost);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (costToDelete) {
            onDeleteCost(costToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setCostToDelete(null);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGA5h3rDjnuG9JSQ1G7Ne5TGrU8UKvOyYRo5_K-TXLaaDQu61aEeSfXrPLtnTwI2D1BEs8NG-ImZcCGDQzHZ3spjgUp6qtElmY-hR3h6iGwANWLwvdsNp3QZiyehR9qIIjbNtuETQrwlxaL-XgtHynYOgcx3S1oS3h0NZSjg-EXtsjJUDEhb1kDaRwXk9_1R0fNHjovDewRDPLP2B5vkNp_xLsimz4f7kunXKqY6S5hVFaI7pAT5LWqFWdbJ77R-jK-6z1Dp3Yjw";

    const investorColors: { [key: string]: string } = {
        'Grupo': 'bg-gray-100 text-gray-700',
        'João': 'bg-blue-50 text-blue-700',
        'Mayck': 'bg-green-50 text-green-700',
        'Ramon': 'bg-teal-50 text-teal-700',
        'Stivison': 'bg-indigo-50 text-indigo-700'
    };
    
    const isDeleteMessage = successMessage?.toLowerCase().includes('excluído');

    const renderSortIcon = (key: keyof Cost) => {
        if (sortConfig?.key !== key) return <span className="material-symbols-outlined text-[16px] text-gray-300 opacity-0 group-hover:opacity-50">unfold_more</span>;
        return <span className="material-symbols-outlined text-[16px] text-primary">{sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>;
    };

    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                <div className='bg-background-light flex flex-col gap-6'>
                    <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-end w-full gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-secondary">
                                    <span className="material-symbols-outlined text-sm">payments</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Gestão de Custos</span>
                                </div>
                                <h2 className="text-white text-3xl font-bold leading-tight">Gestão Financeira JMS</h2>
                                <p className="text-gray-200 text-sm font-medium mt-1">Controle de custos e investimentos para a frota de jet skis</p>
                            </div>
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
                    {/* Cards de resumo apenas para usuários privilegiados */}
                    {canViewSummary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total de Custos</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(summaryData.total)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="bg-green-50 p-3 rounded-lg text-green-600">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Pago</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryData.paid)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                                    <span className="material-symbols-outlined text-3xl">pending_actions</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Custos Pendentes</p>
                                    <p className="text-2xl font-bold text-amber-600">{formatCurrency(summaryData.pending)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="bg-teal-50 p-3 rounded-lg text-teal-600">
                                    <span className="material-symbols-outlined text-3xl">savings</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Descontos / Economia</p>
                                    <p className="text-2xl font-bold text-teal-600">{formatCurrency(summaryData.discounts)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" placeholder="Buscar custo..." type="text" />
                                </div>
                                
                                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year === 'Todos' ? 'Ano: Todos' : `Ano: ${year}`}</option>
                                    ))}
                                </select>

                                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    {months.map(month => (
                                        <option key={month} value={month}>{month === 'Todos' ? 'Mês: Todos' : `Mês: ${month}`}</option>
                                    ))}
                                </select>
                                
                                <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    <option>Status: Todos</option>
                                    <option>Pago</option>
                                    <option>Pendente</option>
                                </select>
                            </div>
                            <button onClick={onNavigateToAddCost} className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">add</span>
                                Novo Custo
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th onClick={() => handleSort('type')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center gap-1">Tipo Investimento/Custo {renderSortIcon('type')}</div>
                                        </th>
                                        <th onClick={() => handleSort('value')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center gap-1">Valor (R$) {renderSortIcon('value')}</div>
                                        </th>
                                        <th onClick={() => handleSort('paidValue')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center gap-1">Valor Pago (R$) {renderSortIcon('paidValue')}</div>
                                        </th>
                                        <th onClick={() => handleSort('investor')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center gap-1">Investidor/Responsável {renderSortIcon('investor')}</div>
                                        </th>
                                        <th onClick={() => handleSort('date')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center gap-1">Data de Compra {renderSortIcon('date')}</div>
                                        </th>
                                        <th onClick={() => handleSort('isPaid')} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-50 group transition-colors">
                                            <div className="flex items-center justify-center gap-1">Pago {renderSortIcon('isPaid')}</div>
                                        </th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedCosts.length > 0 ? paginatedCosts.map((cost) => (
                                        <tr key={cost.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4 text-sm font-bold text-primary">{cost.type}</td>
                                            <td className="p-4 text-sm text-gray-600">{formatCurrency(cost.value)}</td>
                                            <td className="p-4 text-sm text-gray-600">{formatCurrency(cost.paidValue)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded ${investorColors[cost.investor] || 'bg-gray-50 text-gray-700'} text-xs font-bold`}>{cost.investor}</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{cost.date ? new Date(cost.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</td>
                                            <td className="p-4 text-center">
                                                {cost.isPaid ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                                        <span className="material-symbols-outlined text-xs">check_circle</span> Sim
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                                                        <span className="material-symbols-outlined text-xs">schedule</span> Não
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {canEdit && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => onNavigateToEditCost(cost)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(cost)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                Nenhum custo encontrado com os filtros selecionados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Mostrando <span className="font-bold text-gray-700">{filteredCosts.length > 0 ? startIndex : 0}-{endIndex}</span> de <span className="font-bold text-gray-700">{filteredCosts.length}</span> custos
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
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o custo "${costToDelete?.type}"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default FinancialScreen;
