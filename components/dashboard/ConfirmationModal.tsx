
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all"
                style={{ animation: 'fade-in-up 0.3s ease-out' }}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                         <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-red-600">warning</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Não, cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Sim, excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
