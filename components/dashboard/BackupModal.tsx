
import React from 'react';

interface BackupModalProps {
    isOpen: boolean;
    onClose: () => void;
    sql: string;
}

const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, sql }) => {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sql);
        alert('SQL copiado para a área de transferência!');
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-[fade-in-up_0.3s_ease-out]"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined">database</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Backup de Dados Recuperados</h3>
                            <p className="text-sm text-gray-600">Execute este script no Editor SQL do Supabase.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-0 flex-1 overflow-hidden relative group">
                    <textarea 
                        readOnly 
                        value={sql} 
                        className="w-full h-[60vh] p-6 font-mono text-xs md:text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none"
                    />
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-xl">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Fechar
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        Copiar SQL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackupModal;
