
import React from 'react';

const MonthlyBar: React.FC<{ height: string, isCurrent?: boolean }> = ({ height, isCurrent }) => {
    const bgClass = isCurrent 
        ? "bg-gradient-to-t from-secondary to-[#79eadd] shadow-[0_0_10px_rgba(78,205,196,0.3)]"
        : "bg-gradient-to-t from-primary to-[#4a7596]";
    return (
        <div className="flex flex-col items-center gap-2 flex-1 group h-full">
            <div className={`w-full ${bgClass} rounded-t-sm hover:brightness-110 transition relative h-full`} style={{ transform: `scaleY(${height})`, transformOrigin: 'bottom' }}>
                {isCurrent && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-100 whitespace-nowrap z-10">
                        Atual
                    </div>
                )}
            </div>
        </div>
    );
};


const MonthlyRevenueChart: React.FC = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const heights = ['0.85', '0.75', '0.60', '0.45', '0.40', '0.35', '0.30', '0.35', '0.50', '0.65', '0.80', '0.95'];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Faturamento por Mês (2024)</h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="size-2 rounded-full bg-primary"></span> Realizado
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="size-2 rounded-full bg-gray-200"></span> Projeção
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 h-56 w-full px-2">
                <div className="flex-1 flex items-end justify-between gap-1 md:gap-3 h-full border-b border-gray-200">
                   {heights.map((h, i) => <MonthlyBar key={months[i]} height={h} isCurrent={i === 11} />)}
                </div>
                <div className="flex justify-between gap-1 md:gap-3 -mx-1">
                    {months.map(month => (
                         <span key={month} className={`text-[10px] font-bold text-center flex-1 ${month === 'Dez' ? 'text-secondary' : 'text-gray-500'} uppercase`}>{month}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenueChart;
