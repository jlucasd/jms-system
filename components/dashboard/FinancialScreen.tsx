
import React, { useState, useMemo, useEffect } from 'react';
import { Cost } from '../../App';
import ConfirmationModal from './ConfirmationModal';
import AddCostModal from './AddCostModal';

interface FinancialScreenProps {
    costs: Cost[];
    onAddNewCost: (cost: Cost) => void;
    onUpdateCost: (cost: Cost) => void;
    onDeleteCost: (costId: number) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
}


const FinancialScreen: React.FC<FinancialScreenProps> = ({ costs, onAddNewCost, onUpdateCost, onDeleteCost, successMessage, setSuccessMessage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('Todos os Períodos');
    const [selectedStatus, setSelectedStatus] = useState('Status: Todos');
    
    const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [costToEdit, setCostToEdit] = useState<Cost | null>(null);
    const [costToDelete, setCostToDelete] = useState<Cost | null>(null);

     useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);

    const filteredCosts = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return costs.filter(cost => {
            const costDate = new Date(cost.date);
            
            // Period filter
            let periodMatch = true;
            if (selectedPeriod === 'Este Mês') {
                periodMatch = costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
            } else if (selectedPeriod === 'Mês Passado') {
                const lastMonth = new Date(currentYear, currentMonth - 1, 1);
                periodMatch = costDate.getMonth() === lastMonth.getMonth() && costDate.getFullYear() === lastMonth.getFullYear();
            }

            // Status filter
            let statusMatch = true;
            if (selectedStatus === 'Pago') {
                statusMatch = cost.isPaid;
            } else if (selectedStatus === 'Pendente') {
                statusMatch = !cost.isPaid;
            }

            // Search term filter
            const searchMatch = searchTerm === '' || 
                                cost.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                cost.investor.toLowerCase().includes(searchTerm.toLowerCase());
            
            return periodMatch && statusMatch && searchMatch;
        });
    }, [costs, searchTerm, selectedPeriod, selectedStatus]);

    const summaryData = useMemo(() => {
        const total = filteredCosts.reduce((acc, cost) => acc + cost.value, 0);
        const paid = filteredCosts.reduce((acc, cost) => acc + cost.paidValue, 0);
        const pending = total - paid;
        return { total, paid, pending };
    }, [filteredCosts]);

    const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const handleOpenAddModal = () => {
        setCostToEdit(null);
        setIsAddCostModalOpen(true);
    };
    
    const handleOpenEditModal = (cost: Cost) => {
        setCostToEdit(cost);
        setIsAddCostModalOpen(true);
    };

    const handleSaveCost = (cost: Cost) => {
        if(costToEdit) {
            onUpdateCost(cost);
        } else {
            onAddNewCost(cost);
        }
        setIsAddCostModalOpen(false);
        setCostToEdit(null);
    };
    
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
        'Grupo': 'bg-blue-50 text-blue-700',
        'Mayck': 'bg-teal-50 text-teal-700'
    };
    
    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                 <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Gestão de Custos</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">Gestão Financeira JMS</h2>
                        <p className="text-gray-200 text-sm font-medium mt-1">Controle de custos e investimentos para a frota de jet skis</p>
                    </div>
                </div>
                 {successMessage && (
                    <div 
                        className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-lg flex items-center justify-between shadow-md" 
                        role="alert"
                        style={{ animation: 'fade-in-up 0.5s ease-out' }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined">check_circle</span>
                            <p className="font-bold text-sm">{successMessage}</p>
                        </div>
                        <button onClick={() => setSuccessMessage(null)} className="text-emerald-800/70 hover:text-emerald-800">
                                <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" placeholder="Buscar custo..." type="text" />
                            </div>
                            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                <option>Todos os Períodos</option>
                                <option>Este Mês</option>
                                <option>Mês Passado</option>
                            </select>
                            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                <option>Status: Todos</option>
                                <option>Pago</option>
                                <option>Pendente</option>
                            </select>
                        </div>
                        <button onClick={handleOpenAddModal} className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">add</span>
                            Novo Custo
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo Investimento/Custo</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Pago (R$)</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Investidor/Responsável</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Compra</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Pago</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCosts.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 text-sm font-bold text-primary">{cost.type}</td>
                                        <td className="p-4 text-sm text-gray-600">{formatCurrency(cost.value)}</td>
                                        <td className="p-4 text-sm text-gray-600">{formatCurrency(cost.paidValue)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded ${investorColors[cost.investor] || 'bg-gray-50 text-gray-700'} text-xs font-bold`}>{cost.investor}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{new Date(cost.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
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
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenEditModal(cost)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteClick(cost)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Mostrando <span className="font-bold text-gray-700">{filteredCosts.length}</span> de <span className="font-bold text-gray-700">{costs.length}</span> custos</span>
                        <div className="flex items-center gap-1">
                            <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-sm">1</button>
                            <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AddCostModal
                isOpen={isAddCostModalOpen}
                onClose={() => setIsAddCostModalOpen(false)}
                onSave={handleSaveCost}
                costToEdit={costToEdit}
            />
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
