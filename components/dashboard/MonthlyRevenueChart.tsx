
import React, { useMemo } from 'react';

const MonthlyBar: React.FC<{ height: string; value: string; isSelected?: boolean }> = ({ height, value, isSelected }) => {
    const bgClass = isSelected 
        ? "bg-gradient-to-t from-secondary to-[#79eadd] shadow-[0_0_10px_rgba(78,205,196,0.4)]"
        : "bg-gradient-to-t from-primary to-[#4a7596]";
    return (
        <div className="flex flex-col items-center gap-2 w-10 group h-full">
            <div className={`w-full ${bgClass} rounded-t-sm hover:brightness-110 transition-all duration-300 relative h-full`} style={{ transform: `scaleY(${height})`, transformOrigin: 'bottom' }}>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity">
                    {value}
                </div>
            </div>
        </div>
    );
};

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
            <div className="flex-1 flex items-end gap-4 h-80 w-full">
                <div className="flex flex-col justify-between h-full text-xs text-gray-400 font-medium pb-8 w-14 text-right">
                     {yAxisLabels.map(label => <span key={label}>{label}</span>)}
                </div>
                <div className="flex-1 h-full overflow-x-auto custom-scrollbar">
                    <div className="relative h-full min-w-[700px] pr-4">
                        <div className="flex items-end justify-between gap-4 h-[calc(100%-24px)] border-b border-gray-200">
                           {monthlyData.map((data) => <MonthlyBar key={data.month} height={data.height} value={data.value} isSelected={data.isSelected} />)}
                        </div>
                        <div className="flex justify-between gap-4 h-[24px] items-center">
                            {monthlyData.map(data => (
                                 <span key={data.month} className={`text-[10px] font-bold text-center w-10 ${data.isSelected ? 'text-secondary' : 'text-gray-500'} uppercase`}>{data.month}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenueChart;
