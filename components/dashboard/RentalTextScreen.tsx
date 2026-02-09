
import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface RentalTextScreenProps {
    text: string;
    onSave: (text: string) => void;
}

const RentalTextScreen: React.FC<RentalTextScreenProps> = ({ text, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(text);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setCurrentText(text);
    }, [text]);

    const handleSave = () => {
        onSave(currentText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentText(text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        onSave('');
        setCurrentText('');
        setIsDeleteModalOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">description</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Texto Padrão de Locação</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Gerencie o texto utilizado para envio de informações aos clientes.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">text_snippet</span>
                        Conteúdo do Texto
                    </h3>
                    <div className="flex gap-3 w-full md:w-auto">
                        {!isEditing ? (
                            <>
                                <button 
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold transition-all ${copySuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{copySuccess ? 'check' : 'content_copy'}</span>
                                    {copySuccess ? 'Copiado!' : 'Copiar'}
                                </button>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                    Editar
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Salvar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8 flex-1">
                    {isEditing ? (
                        <textarea 
                            className="w-full h-[60vh] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none font-sans text-sm md:text-base leading-relaxed"
                            value={currentText}
                            onChange={(e) => setCurrentText(e.target.value)}
                            placeholder="Digite o texto padrão aqui..."
                        />
                    ) : (
                        <div className="w-full min-h-[60vh] p-6 bg-gray-50 rounded-lg border border-gray-100 font-sans text-sm md:text-base leading-relaxed whitespace-pre-wrap text-gray-800 shadow-inner">
                            {currentText || <span className="text-gray-400 italic">Nenhum texto definido. Clique em editar para adicionar.</span>}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Texto Padrão"
                message="Tem certeza que deseja limpar o texto padrão? Esta ação não pode ser desfeita facilmente."
            />
        </div>
    );
};

export default RentalTextScreen;
