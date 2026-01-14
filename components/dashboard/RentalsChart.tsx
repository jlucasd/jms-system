
import React from 'react';

const RentalsChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Locações por Tipo</h3>
                <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative size-48 rounded-full shadow-inner" style={{ background: 'conic-gradient(var(--tw-colors-primary) 0% 65%, var(--tw-colors-secondary) 65% 100%)' }}>
                    <div className="absolute inset-0 m-auto size-28 bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                        <span className="text-2xl font-bold text-primary">3.8k</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</span>
                    </div>
                </div>
                <div className="w-full flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-primary"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Diária (65%)</span>
                            <span className="text-[10px] text-gray-400">2.497 locações</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-secondary"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Meia (35%)</span>
                            <span className="text-[10px] text-gray-400">1.345 locações</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalsChart;
