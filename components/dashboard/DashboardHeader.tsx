
import React from 'react';

const DashboardHeader: React.FC = () => {
    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="w-full rounded-2xl overflow-hidden relative min-h-[180px] shadow-lg flex items-end">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-end w-full gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-secondary">
                        <span className="material-symbols-outlined text-sm">bar_chart</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Dashboard Analítico JMS</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Visão Geral</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Análise de performance e resultados</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Exportar Relatório
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
