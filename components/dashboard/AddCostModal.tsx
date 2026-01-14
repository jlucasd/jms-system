
import React, { useState, useEffect } from 'react';
import { Cost } from '../../App';

interface AddCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (cost: Cost) => void;
    costToEdit: Cost | null;
}

const AddCostModal: React.FC<AddCostModalProps> = ({ isOpen, onClose, onSave, costToEdit }) => {
    const [type, setType] = useState('');
    const [value, setValue] = useState('');
    const [paidValue, setPaidValue] = useState('');
    const [investor, setInvestor] = useState('Grupo');
    const [date, setDate] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState('');
    
    const isEditMode = !!costToEdit;

    const formatDateForDisplay = (isoDate: string) => {
        if (!isoDate || !isoDate.includes('-')) return '';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const parseDateForStorage = (displayDate: string) => {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(displayDate)) {
           return null;
        }
        const [day, month, year] = displayDate.split('/');
        return `${year}-${month}-${day}`;
    }

     const maskDate = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})\d+?$/, '$1');
    };

    useEffect(() => {
        if (isOpen) {
            setError('');
            if (costToEdit) {
                setType(costToEdit.type);
                setValue(String(costToEdit.value));
                setPaidValue(String(costToEdit.paidValue));
                setInvestor(costToEdit.investor);
                setDate(formatDateForDisplay(costToEdit.date));
                setIsPaid(costToEdit.isPaid);
            } else {
                // Reset form for new entry
                setType('');
                setValue('');
                setPaidValue('');
                setInvestor('Grupo');
                const today = new Date().toISOString().split('T')[0];
                setDate(formatDateForDisplay(today));
                setIsPaid(false);
            }
        }
    }, [isOpen, costToEdit]);

    const handleSave = () => {
        if (!type || !value || !date) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const storageDate = parseDateForStorage(date);
        if (!storageDate) {
            setError('Data inválida. Use o formato dd/mm/aaaa.');
            return;
        }

        const numericValue = parseFloat(value);
        const numericPaidValue = paidValue ? parseFloat(paidValue) : 0;

        if (isNaN(numericValue) || isNaN(numericPaidValue)) {
             setError('Valores devem ser números válidos.');
             return;
        }

        const newCost: Cost = {
            id: isEditMode ? costToEdit.id : Date.now(),
            type,
            value: numericValue,
            paidValue: numericPaidValue,
            investor,
            date: storageDate,
            isPaid,
        };
        onSave(newCost);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{isEditMode ? 'Editar Custo' : 'Adicionar Novo Custo'}</h3>
                </div>
                <div className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-md">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Custo/Investimento</label>
                            <input type="text" value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Compra</label>
                            <input 
                                type="text" 
                                placeholder="dd/mm/aaaa"
                                value={date} 
                                onChange={e => setDate(maskDate(e.target.value))} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Total (R$)</label>
                            <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" placeholder="Ex: 450.00"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Pago (R$)</label>
                            <input type="number" value={paidValue} onChange={e => setPaidValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" placeholder="Ex: 450.00"/>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Investidor/Responsável</label>
                            <select value={investor} onChange={e => setInvestor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary">
                                <option>Grupo</option>
                                <option>Mayck</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-sm font-bold text-gray-700">Marcar como Pago</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                        {isEditMode ? 'Salvar Alterações' : 'Adicionar Custo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCostModal;
