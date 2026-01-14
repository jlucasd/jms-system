
import React, { useMemo } from 'react';

const MonthlyRevenueChart: React.FC<{ year: string; month: string; unit: string; }> = ({ year, month, unit }) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const { monthlyData, yAxisLabels } = useMemo(() => {
        const hash = (year + unit).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        const revenues = months.map((m, index) => {
            const seasonalFactor = Math.sin((index - 1) * (Math.PI / 6)) * 0.4 + 0.8;
            const baseRevenue = 80000;
            const variation = (hash + index * 10) % 25000;
            return Math.max(20000, (baseRevenue + variation) * seasonalFactor);
        });

        const maxRevenue = Math.max(...revenues);
        const topY = Math.ceil(maxRevenue * 1.1 / 20000) * 20000;

        const monthlyDataResult = months.map((m, index) => ({
            month: m,
            height: `${(revenues[index] / topY) * 100}%`,
            value: `R$ ${revenues[index].toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            isSelected: month !== 'Todos' && months[index].toLowerCase() === month.substring(0, 3).toLowerCase(),
        }));
        
        const yAxisLabelsResult = [
            `R$ ${(topY / 1000)}k`,
            `R$ ${((topY * 0.75) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.5) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.25) / 1000).toFixed(0)}k`,
            'R$ 0k'
        ];
        
        return { monthlyData: monthlyDataResult, yAxisLabels: yAxisLabelsResult };

    }, [year, month, unit]);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Faturamento por Mês ({year})</h3>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="size-2 rounded-full bg-primary"></span> Mês
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="size-2 rounded-full bg-secondary"></span> Selecionado
                    </span>
                </div>
            </div>
            <div className="flex-1 flex gap-4 h-80 w-full">
                <div className="flex flex-col justify-between h-full text-xs text-gray-400 font-medium pb-6 w-14 text-right flex-shrink-0">
                     {yAxisLabels.map(label => <span key={label}>{label}</span>)}
                </div>
                <div className="flex-1 flex flex-col border-l border-gray-100 overflow-hidden">
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px] h-full flex flex-col">
                             <div className="flex-1 flex items-end w-full gap-2 md:gap-3 px-2 border-b border-gray-100">
                                {monthlyData.map((bar, index) => (
                                    <div key={index} className="flex-1 group h-full relative flex items-end justify-center">
                                        <div
                                            className={`w-10/12 max-w-[40px] ${bar.isSelected ? 'bg-secondary' : 'bg-primary'} rounded-t-md group-hover:brightness-110 transition-all duration-300 relative ${bar.isSelected ? 'shadow-[0_0_10px_rgba(78,205,196,0.3)]' : ''}`}
                                            style={{ height: bar.height }}
                                        >
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {bar.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full gap-2 md:gap-3 px-2 pt-1 h-6 flex-shrink-0">
                                {monthlyData.map(bar => (
                                    <span key={bar.month} className={`flex-1 text-xs font-bold text-center ${bar.isSelected ? 'text-secondary' : 'text-gray-500'}`}>{bar.month}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenueChart;
