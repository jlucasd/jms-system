
import React, { useState, useEffect } from 'react';
import { Cost } from '../../App';

interface AddCostScreenProps {
    onCancel: () => void;
    onSave: (cost: Cost) => void;
    costToEdit: Cost | null;
}

const AddCostScreen: React.FC<AddCostScreenProps> = ({ onCancel, onSave, costToEdit }) => {
    const isEditMode = !!costToEdit;
    
    const [type, setType] = useState('');
    const [value, setValue] = useState('');
    const [paidValue, setPaidValue] = useState('');
    const [investor, setInvestor] = useState('');
    const [date, setDate] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [observations, setObservations] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (costToEdit) {
            setType(costToEdit.type);
            setValue(String(costToEdit.value));
            setPaidValue(String(costToEdit.paidValue));
            setInvestor(costToEdit.investor);
            setDate(costToEdit.date); // Date is already in YYYY-MM-DD
            setIsPaid(costToEdit.isPaid);
            setObservations(costToEdit.observations || '');
        } else {
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
        }
    }, [costToEdit]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!type || !value || !date || !investor) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const numericValue = parseFloat(value);
        const numericPaidValue = paidValue ? parseFloat(paidValue) : 0;

        if (isNaN(numericValue) || isNaN(numericPaidValue)) {
             setError('Valores devem ser números válidos.');
             return;
        }
        
        const newCost: Cost = {
            id: isEditMode && costToEdit ? costToEdit.id : Date.now(),
            type,
            value: numericValue,
            paidValue: numericPaidValue,
            investor,
            date: date,
            isPaid,
            observations
        };
        onSave(newCost);
    };
    
    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGA5h3rDjnuG9JSQ1G7Ne5TGrU8UKvOyYRo5_K-TXLaaDQu61aEeSfXrPLtnTwI2D1BEs8NG-ImZcCGDQzHZ3spjgUp6qtElmY-hR3h6iGwANWLwvdsNp3QZiyehR9qIIjbNtuETQrwlxaL-XgtHynYOgcx3S1oS3h0NZSjg-EXtsjJUDEhb1kDaRwXk9_1R0fNHjovDewRDPLP2B5vkNp_xLsimz4f7kunXKqY6S5hVFaI7pAT5LWqFWdbJ77R-jK-6z1Dp3Yjw";
    
    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">edit_document</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Financeiro</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">{isEditMode ? 'Editar Custo' : 'Adicionar Novo Custo'}</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">{isEditMode ? 'Atualize os dados do custo ou investimento' : 'Preencha os dados abaixo para registrar um novo custo'}</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="bg-white w-full max-w-4xl rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <form className="p-6 md:p-8" onSubmit={handleSave}>
                         {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                                <p className="font-bold text-sm">{error}</p>
                            </div>
                        )}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="type">Tipo de Custo/Investimento</label>
                                    <input value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="type" placeholder="Ex: Manutenção Preventiva" type="text" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="date">Data de Compra</label>
                                    <input value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="date" type="date" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="value">Valor Total (R$)</label>
                                    <input value={value} onChange={e => setValue(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="value" placeholder="Ex: 1200.00" type="number" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="paidValue">Valor Pago (R$)</label>
                                    <input value={paidValue} onChange={e => setPaidValue(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="paidValue" placeholder="Ex: 1200.00" type="number" />
                                </div>
                                 <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="investor">Investidor/Responsável</label>
                                    <div className="relative">
                                        <select value={investor} onChange={e => setInvestor(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium appearance-none cursor-pointer" id="investor">
                                            <option value="" disabled>Selecione um investidor</option>
                                            <option>Grupo</option>
                                            <option>João</option>
                                            <option>Mayck</option>
                                            <option>Ramon</option>
                                            <option>Stivison</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer p-2">
                                        <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-sm font-bold text-gray-700">Marcar como Pago</span>
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="observations">Observações</label>
                                    <textarea value={observations} onChange={e => setObservations(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary resize-none h-24" id="observations" placeholder="Detalhes sobre a compra, forma de pagamento, etc."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                            <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors" type="button">
                                Cancelar
                            </button>
                            <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2" type="submit">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isEditMode ? 'Salvar Alterações' : 'Salvar Custo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCostScreen;
