
import React from 'react';

interface DashboardHeaderProps {
    onExportPDF: () => void;
    isExporting: boolean;
    year: string;
    location: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onExportPDF, isExporting, year, location }) => {
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
                    <h2 className="text-white text-3xl font-bold leading-tight">Visão Geral - {year === 'Todos' ? 'Geral' : year}</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">
                        Análise de performance para Local: <span className="font-bold">{location}</span>
                    </p>
                </div>
                <button
                    onClick={onExportPDF}
                    disabled={isExporting}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] justify-center"
                >
                    {isExporting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exportando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Exportar Relatório
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
