
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Rental, RentalStatus, RentalType } from '../../App';
import ConfirmationModal from './ConfirmationModal';

interface RentalsScreenProps {
    rentals: Rental[];
    onNavigateToAddRental: () => void;
    onNavigateToEditRental: (rental: Rental) => void;
    onDeleteRental: (rentalId: number) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
}

const StatusBadge: React.FC<{ status: RentalStatus }> = ({ status }) => {
    const styles = {
        Pendente: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        Confirmado: 'bg-green-50 text-green-700 border-green-100',
        Concluído: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    const dotStyles = {
        Pendente: 'bg-yellow-500',
        Confirmado: 'bg-green-500',
        Concluído: 'bg-blue-500',
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
            <span className={`size-1.5 rounded-full ${dotStyles[status]}`}></span>
            {status}
        </span>
    );
};

const TypeBadge: React.FC<{ type: RentalType }> = ({ type }) => {
    const styles: { [key in RentalType]: string } = {
        'Diária': 'bg-rose-50 text-rose-700 border-rose-100',
        'Meia Diária': 'bg-purple-50 text-purple-700 border-purple-100'
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${styles[type]}`}>
            {type}
        </span>
    );
}

const ClientAvatar: React.FC<{ initial: string }> = ({ initial }) => {
    const colors = ['blue', 'teal', 'indigo', 'pink', 'emerald'];
    const colorIndex = (initial.charCodeAt(0) % colors.length);
    const color = colors[colorIndex];
    
    return (
        <div className={`size-9 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-700 font-bold text-xs`}>
            {initial}
        </div>
    )
}

const RentalsScreen: React.FC<RentalsScreenProps> = ({ rentals, onNavigateToAddRental, onNavigateToEditRental, onDeleteRental, successMessage, setSuccessMessage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Todos Status');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState<Rental | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const statusDropdownRef = useRef<HTMLDivElement>(null);

    const statuses = ['Todos Status', 'Pendente', 'Confirmado', 'Concluído'];
    
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
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDate, selectedStatus]);

    const maskDate = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})\d+?$/, '$1');
    };

    const filteredRentals = useMemo(() => {
        const filterDateValue = selectedDate.length === 10
            ? selectedDate.split('/').reverse().join('-')
            : null;

        return rentals.filter(rental => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = rental.clientName.toLowerCase().includes(term) || rental.clientCpf.includes(term);
            const matchesDate = !filterDateValue || rental.date === filterDateValue;
            const matchesStatus = selectedStatus === 'Todos Status' || rental.status === selectedStatus;
            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [searchTerm, rentals, selectedDate, selectedStatus]);

    const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
    const paginatedRentals = useMemo(() => {
        return filteredRentals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredRentals, currentPage, itemsPerPage]);

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredRentals.length);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
    }
    
    const handleDeleteClick = (rental: Rental) => {
        setRentalToDelete(rental);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (rentalToDelete) {
            onDeleteRental(rentalToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setRentalToDelete(null);
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
        setRentalToDelete(null);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined text-sm">view_list</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Gerenciamento</span>
                        </div>
                        <h2 className="text-white text-3xl font-bold leading-tight">Listagem de Locações</h2>
                        <p className="text-gray-200 text-sm font-medium mt-1">Visualize e gerencie todos os agendamentos de jet ski ativos e passados</p>
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
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                         <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input 
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" 
                                    placeholder="Buscar por cliente, CPF..." 
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">calendar_today</span>
                                <input 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" 
                                    type="text"
                                    placeholder="dd/MM/yyyy"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(maskDate(e.target.value))}
                                />
                            </div>
                            <div className="relative w-full sm:w-auto" ref={statusDropdownRef}>
                                <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap w-full justify-between sm:w-48">
                                    <span className="material-symbols-outlined text-[20px] text-gray-500">receipt_long</span>
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
                        <button onClick={onNavigateToAddRental} className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shrink-0">
                            <span className="material-symbols-outlined">add</span>
                            Nova Locação
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Horário</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedRentals.map((rental) => (
                                    <tr key={rental.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <ClientAvatar initial={rental.clientInitial} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-primary">{rental.clientName}</span>
                                                    <span className="text-xs text-gray-400">CPF: {rental.clientCpf}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <span className="material-symbols-outlined text-[18px] text-green-500">smartphone</span>
                                                {rental.clientPhone}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 font-medium">{formatDate(rental.date)}</td>
                                        <td className="p-4"><TypeBadge type={rental.rentalType} /></td>
                                        <td className="p-4 text-sm text-gray-600">{rental.startTime} - {rental.endTime}</td>
                                        <td className="p-4"><StatusBadge status={rental.status} /></td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => onNavigateToEditRental(rental)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteClick(rental)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
                        <span className="text-sm text-gray-500">
                           Mostrando <span className="font-bold text-gray-700">{filteredRentals.length > 0 ? startIndex : 0}-{endIndex}</span> de <span className="font-bold text-gray-700">{filteredRentals.length}</span> resultados
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
                message={`Tem certeza de que deseja excluir a locação para "${rentalToDelete?.clientName}"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default RentalsScreen;
