
import React from 'react';

const DashboardFilters: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined">filter_alt</span>
                Filtros Globais:
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative group">
                    <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-gray-100">
                        <option value="2024">Ano: 2024</option>
                        <option value="2023">Ano: 2023</option>
                        <option value="2022">Ano: 2022</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
                <div className="relative group">
                    <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-gray-100">
                        <option value="all">Unidade: Todas</option>
                        <option value="doca">Doca Principal</option>
                        <option value="praia">Praia do Forte</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardFilters;
