
import React, { useState, useMemo, useEffect } from 'react';
import { Rental, RentalStatus, RentalType } from '../../App';

interface RentalsScreenProps {
    rentals: Rental[];
    onNavigateToAddRental: () => void;
    onNavigateToEditRental: (rental: Rental) => void;
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

const TypeBadge: React.FC<{ type: RentalType | 'Meia Diária' }> = ({ type }) => {
    const styles: { [key: string]: string } = {
        '30 Min': 'bg-purple-50 text-purple-700 border-purple-100',
        '1 Hora': 'bg-purple-50 text-purple-700 border-purple-100',
        'Tour': 'bg-rose-50 text-rose-700 border-rose-100',
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

const RentalsScreen: React.FC<RentalsScreenProps> = ({ rentals, onNavigateToAddRental, onNavigateToEditRental, successMessage, setSuccessMessage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
     useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);

    const filteredRentals = useMemo(() => {
        return rentals.filter(rental => {
            const term = searchTerm.toLowerCase();
            return rental.clientName.toLowerCase().includes(term) || rental.clientDoc.includes(term);
        });
    }, [searchTerm, rentals]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
    }

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
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
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary" 
                            placeholder="Buscar por cliente, documento..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={onNavigateToAddRental} className="w-full md:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
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
                            {filteredRentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <ClientAvatar initial={rental.clientInitial} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-primary">{rental.clientName}</span>
                                                <span className="text-xs text-gray-400">CPF: {rental.clientDoc}</span>
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
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onNavigateToEditRental(rental)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
                    <span className="text-sm text-gray-500">Mostrando <span className="font-bold text-gray-700">1-5</span> de <span className="font-bold text-gray-700">42</span> resultados</span>
                    <div className="flex items-center gap-1">
                        <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-sm">1</button>
                        <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">2</button>
                        <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">3</button>
                        <span className="text-gray-400 px-1">...</span>
                        <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">8</button>
                        <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalsScreen;
