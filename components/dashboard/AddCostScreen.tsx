
import React, { useState, useEffect } from 'react';
import { Cost } from '../../App';

interface AddCostScreenProps {
    onCancel: () => void;
    onSave: (cost: Cost | Cost[]) => void;
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
    
    // Installment States
    const [isInstallment, setIsInstallment] = useState(false);
    const [installmentsCount, setInstallmentsCount] = useState<string>('2');

    const [error, setError] = useState('');
    
    useEffect(() => {
        if (costToEdit) {
            setType(costToEdit.type);
            setValue(String(costToEdit.value));
            setPaidValue(String(costToEdit.paidValue));
            setInvestor(costToEdit.investor);
            setDate(costToEdit.date);
            setIsPaid(costToEdit.isPaid);
            setObservations(costToEdit.observations || '');
            setIsInstallment(false); // Edição de parcelas individuais não suporta transformar em parcelado aqui
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

        if (isNaN(numericValue) || (paidValue && isNaN(numericPaidValue))) {
             setError('Valores devem ser números válidos.');
             return;
        }

        // Lógica de Parcelamento (Apenas para novos registros)
        if (!isEditMode && isInstallment) {
            const count = parseInt(installmentsCount);
            if (isNaN(count) || count < 2) {
                setError('O número de parcelas deve ser maior que 1.');
                return;
            }

            const installmentValue = numericValue / count;
            // Se o valor pago for informado, assumimos que é o pagamento da PRIMEIRA parcela (ou entrada), 
            // ou deixamos 0 para as demais se não estiver "Pago".
            // Para simplificar: Se isPaid=true, todas ficam pagas. Se false, todas pendentes.
            // Se houver paidValue manual, ele será aplicado proporcionalmente ou apenas na primeira?
            // Decisão: Dividir o valor total igualmente. O status Pago aplica-se a todas ou nenhuma. 
            // Ajuste manual posterior possível na lista.

            const newCosts: Cost[] = [];
            const baseDate = new Date(date);

            for (let i = 0; i < count; i++) {
                // Calcular data da parcela (Mês + i)
                const installmentDate = new Date(baseDate);
                installmentDate.setUTCMonth(baseDate.getUTCMonth() + i); // Use UTC to avoid timezone shifts
                
                // Formatar YYYY-MM-DD
                const dateStr = installmentDate.toISOString().split('T')[0];

                newCosts.push({
                    id: Date.now() + i, // ID temporário único
                    type: `${type} (${i + 1}/${count})`,
                    value: parseFloat(installmentValue.toFixed(2)),
                    // Se estiver marcado como pago, assume valor total da parcela pago. Se não, 0.
                    // Ignora o campo 'paidValue' manual para parcelados para evitar confusão matemática complexa no frontend
                    paidValue: isPaid ? parseFloat(installmentValue.toFixed(2)) : 0, 
                    investor,
                    date: dateStr,
                    isPaid: isPaid,
                    observations: observations ? `${observations} [Parcela ${i+1}/${count}]` : `Parcela ${i+1}/${count}`
                });
            }
            
            onSave(newCosts);

        } else {
            // Salvamento Simples (Único)
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
        }
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
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="date">{isInstallment ? 'Data da 1ª Parcela' : 'Data de Compra'}</label>
                                    <input value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="date" type="date" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="value">Valor Total (R$)</label>
                                    <input value={value} onChange={e => setValue(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="value" placeholder="Ex: 1200.00" type="number" />
                                </div>
                                
                                {!isInstallment && (
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="paidValue">Valor Pago (R$)</label>
                                        <input value={paidValue} onChange={e => setPaidValue(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="paidValue" placeholder="Ex: 1200.00" type="number" />
                                    </div>
                                )}

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
                                
                                {/* Lógica de Parcelamento (Apenas modo Criação) */}
                                {!isEditMode && (
                                    <div className="col-span-2 md:col-span-1">
                                        <div className="flex flex-col gap-2 h-full justify-center">
                                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors w-fit">
                                                <div className={`w-10 h-5 rounded-full relative transition-colors ${isInstallment ? 'bg-primary' : 'bg-gray-300'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isInstallment} 
                                                        onChange={e => setIsInstallment(e.target.checked)} 
                                                        className="sr-only"
                                                    />
                                                    <div className={`size-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${isInstallment ? 'left-5' : 'left-0.5'}`}></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">Parcelar Custo?</span>
                                            </label>
                                            
                                            {isInstallment && (
                                                <div className="animate-[fade-in-up_0.2s_ease-out] flex items-center gap-2 mt-1">
                                                    <input 
                                                        type="number" 
                                                        min="2" 
                                                        max="60" 
                                                        value={installmentsCount} 
                                                        onChange={e => setInstallmentsCount(e.target.value)} 
                                                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                                    />
                                                    <span className="text-sm text-gray-500">Parcelas Mensais</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-2 md:col-span-1 flex items-center">
                                    <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors w-full">
                                        <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="size-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-sm font-bold text-gray-700">
                                            {isInstallment ? 'Todas as parcelas já foram pagas?' : 'Marcar como Pago'}
                                        </span>
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
