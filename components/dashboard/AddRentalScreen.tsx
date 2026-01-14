
import React, { useState, useEffect } from 'react';
import { Rental, RentalType, RentalStatus } from '../../App';

interface AddRentalScreenProps {
    onCancel: () => void;
    onSave: (rental: Rental) => void;
    rentalToEdit: Rental | null;
}

const rentalTypes: RentalType[] = ['30 Min', '1 Hora', 'Tour', 'Diária'];
const paymentMethods: ('Pix' | 'Cartão' | 'Dinheiro')[] = ['Pix', 'Cartão', 'Dinheiro'];
const statuses: RentalStatus[] = ['Pendente', 'Confirmado', 'Concluído'];

const AddRentalScreen: React.FC<AddRentalScreenProps> = ({ onCancel, onSave, rentalToEdit }) => {
    const isEditMode = !!rentalToEdit;

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientDoc, setClientDoc] = useState('');
    const [selectedRentalType, setSelectedRentalType] = useState<RentalType>('1 Hora');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('Doca Principal - Marina Azul');
    const [observations, setObservations] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
    const [selectedStatus, setSelectedStatus] = useState<RentalStatus>('Pendente');

    useEffect(() => {
        if (isEditMode && rentalToEdit) {
            setClientName(rentalToEdit.clientName);
            setClientPhone(rentalToEdit.clientPhone);
            setClientDoc(rentalToEdit.clientDoc);
            setSelectedRentalType(rentalToEdit.rentalType);
            setDate(rentalToEdit.date);
            setStartTime(rentalToEdit.startTime);
            setEndTime(rentalToEdit.endTime);
            setLocation(rentalToEdit.location);
            setObservations(rentalToEdit.observations || '');
            setSelectedPaymentMethod(rentalToEdit.paymentMethod || 'Pix');
            setSelectedStatus(rentalToEdit.status);
        }
    }, [isEditMode, rentalToEdit]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const rentalData: Rental = {
            id: isEditMode && rentalToEdit ? rentalToEdit.id : Date.now(),
            clientName,
            clientPhone,
            clientDoc,
            clientInitial: clientName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(),
            rentalType: selectedRentalType,
            date,
            startTime,
            endTime,
            location,
            observations,
            paymentMethod: selectedPaymentMethod,
            status: selectedStatus,
        };
        onSave(rentalData);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Agendamento</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">{isEditMode ? 'Editar Locação' : 'Nova Locação'}</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">{isEditMode ? 'Atualize os dados da locação' : 'Preencha os dados abaixo para agendar um novo jet ski'}</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="bg-white w-full max-w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <form className="p-6 md:p-8" onSubmit={handleSave}>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 flex flex-col gap-8">
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary">Dados do Cliente</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="clientName">Nome Completo</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">badge</span>
                                                <input value={clientName} onChange={e => setClientName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="clientName" placeholder="Ex: João da Silva" type="text"/>
                                            </div>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="clientPhone">Telefone / WhatsApp</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">smartphone</span>
                                                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="clientPhone" placeholder="(00) 00000-0000" type="tel"/>
                                            </div>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="clientDoc">Documento (RG/CPF)</label>
                                            <input value={clientDoc} onChange={e => setClientDoc(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="clientDoc" placeholder="Apenas números" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <span className="material-symbols-outlined">sailing</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary">Detalhes da Locação</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de Locação</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {rentalTypes.map(type => (
                                                    <button type="button" key={type} onClick={() => setSelectedRentalType(type)} className={`border p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selectedRentalType === type ? 'border-2 border-secondary bg-secondary/5 shadow-sm' : 'border-gray-200 hover:border-secondary bg-white hover:shadow-md group'}`}>
                                                        <span className={`material-symbols-outlined ${selectedRentalType === type ? 'text-secondary' : 'text-gray-400 group-hover:text-secondary'}`}>{type === 'Diária' ? 'event_available' : 'schedule'}</span>
                                                        <span className={`text-sm font-bold ${selectedRentalType === type ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>{type}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Data</label>
                                                <input value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" type="date"/>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Início</label>
                                                <input value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" type="time"/>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Fim</label>
                                                <input value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium" type="time"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="observations">Observações</label>
                                            <textarea value={observations} onChange={e => setObservations(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary resize-none h-24" id="observations" placeholder="Solicitações especiais, coletes extras, experiência prévia..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-1 flex flex-col gap-8 h-full">
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary">Pagamento</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm font-bold text-gray-700 mb-3">Método de Pagamento</p>
                                            <div className="flex flex-wrap gap-2">
                                                {paymentMethods.map(method => (
                                                    <button key={method} type="button" onClick={() => setSelectedPaymentMethod(method)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedPaymentMethod === method ? 'bg-secondary text-white shadow-sm' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                                        <span className="material-symbols-outlined text-[18px]">{method === 'Pix' ? 'qr_code_2' : method === 'Cartão' ? 'credit_card' : 'attach_money'}</span>
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <span className="material-symbols-outlined">toggle_on</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary">Status da Locação</h3>
                                    </div>
                                    <div className="bg-gray-200 p-1 rounded-lg flex mb-8">
                                        {statuses.map(status => {
                                            const statusColors: {[key in RentalStatus]: string} = { Pendente: 'bg-[#F59E0B]', Confirmado: 'bg-emerald-500', Concluído: 'bg-blue-500'};
                                            return(
                                                <button key={status} type="button" onClick={() => setSelectedStatus(status)} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${selectedStatus === status ? `${statusColors[status]} text-white shadow-sm` : 'text-gray-500 hover:bg-gray-300/50'}`}>
                                                    {status}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-auto flex flex-col gap-3">
                                        <button className="w-full py-3.5 bg-secondary text-white rounded-lg text-sm font-bold shadow-md shadow-secondary/20 hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-2" type="submit">
                                            <span className="material-symbols-outlined">save</span>
                                            {isEditMode ? 'Salvar Alterações' : 'Salvar Locação'}
                                        </button>
                                        <button onClick={onCancel} className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors" type="button">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRentalScreen;
