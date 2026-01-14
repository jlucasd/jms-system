
import React, { useMemo } from 'react';

const RevenueChart: React.FC<{ year: string; unit: string; }> = ({ year, unit }) => {
    const { chartData, yAxisLabels } = useMemo(() => {
        const selectedYear = parseInt(year);
        const years = Array.from({ length: 5 }, (_, i) => selectedYear - 4 + i);
        
        const unitHash = unit.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        const revenues = years.map((y, index) => {
            const baseRevenue = 850000 + (index * 300000);
            const variation = (y + unitHash) % 250000 - 125000;
            return baseRevenue + variation;
        });

        const maxRevenue = Math.max(...revenues);
        const bgColors = ['bg-[#8ba1b6]', 'bg-[#65829d]', 'bg-[#3f6385]', 'bg-[#1a3d61]', 'bg-secondary'];

        const topY = Math.ceil(maxRevenue * 1.05 / 200000) * 200000;

        const chartDataResult = years.map((y, index) => ({
            label: y.toString(),
            value: `R$ ${(revenues[index] / 1000).toFixed(0)}k`,
            height: `${(revenues[index] / topY) * 100}%`,
            bgColor: bgColors[index],
            isCurrent: y === selectedYear,
        }));
        
        const yAxisLabelsResult = [
            `R$ ${(topY / 1000)}k`,
            `R$ ${((topY * 0.75) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.5) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.25) / 1000).toFixed(0)}k`,
            'R$ 0k'
        ];

        return { chartData: chartDataResult, yAxisLabels: yAxisLabelsResult };
    }, [year, unit]);
    
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Faturamento por Ano</h3>
                <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="flex-1 flex gap-4 h-64 w-full">
                <div className="flex flex-col justify-between h-full text-xs text-gray-400 font-medium pb-6 w-16 text-right">
                    {yAxisLabels.map(label => <span key={label}>{label}</span>)}
                </div>
                <div className="flex-1 flex flex-col border-l border-b border-gray-100">
                    <div className="flex-1 flex items-end w-full gap-2 md:gap-3 px-2">
                        {chartData.map((bar, index) => (
                            <div key={index} className="flex-1 group h-full relative flex items-end justify-center">
                                <div
                                    className={`w-10/12 max-w-[50px] ${bar.bgColor} rounded-t-md group-hover:brightness-110 transition-all duration-300 relative ${bar.isCurrent ? 'shadow-[0_0_10px_rgba(78,205,196,0.3)]' : ''}`}
                                    style={{ height: bar.height }}
                                >
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {bar.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex w-full gap-2 md:gap-3 px-2 border-t border-gray-100 pt-1 h-6 flex-shrink-0">
                        {chartData.map(bar => (
                            <span key={bar.label} className={`flex-1 text-xs font-bold text-center ${bar.isCurrent ? 'text-secondary' : 'text-gray-500'}`}>{bar.label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
