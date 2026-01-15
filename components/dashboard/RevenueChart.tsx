import React, { useMemo } from 'react';
import { Rental } from '../../App';

const RevenueChart: React.FC<{ year: string; location: string; rentals: Rental[] }> = ({ year, location, rentals }) => {
    const { chartData, yAxisLabels } = useMemo(() => {
        const filteredRentals = rentals.filter(r => location === 'Todos os Locais' || r.location === location);

        // FIX: Replaced 'Array.from' with the spread syntax for better type inference to resolve an 'unknown[]' type error.
        const allYears: string[] = [...new Set(filteredRentals.map(r => r.date.substring(0, 4)))].sort();
        const lastFiveYears = allYears.slice(-5);
        
        const revenueByYear: { [key: string]: number } = {};
        lastFiveYears.forEach(y => revenueByYear[y] = 0);

        filteredRentals.forEach(rental => {
            const rentalYear = rental.date.substring(0, 4);
            if (revenueByYear.hasOwnProperty(rentalYear)) {
                revenueByYear[rentalYear] += rental.value;
            }
        });

        const revenues = lastFiveYears.map(y => revenueByYear[y]);
        const maxRevenue = Math.max(...revenues, 1);

        // Dynamic step calculation for a "nice" Y-axis
        const numTicks = 4;
        const roughStep = maxRevenue / numTicks;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const residual = roughStep / magnitude;
        let niceStep;
        if (residual > 5) niceStep = 10 * magnitude;
        else if (residual > 2) niceStep = 5 * magnitude;
        else if (residual > 1) niceStep = 2 * magnitude;
        else niceStep = magnitude;

        const topY = Math.ceil((maxRevenue * 1.05) / niceStep) * niceStep;

        const bgColors = ['bg-[#8ba1b6]', 'bg-[#65829d]', 'bg-[#3f6385]', 'bg-[#1a3d61]', 'bg-secondary'];

        const chartDataResult = lastFiveYears.map((y, index) => ({
            label: y,
            value: `R$ ${(revenues[index] / 1000).toFixed(0)}k`,
            height: `${(revenues[index] / (topY || 1)) * 100}%`,
            bgColor: bgColors[index % bgColors.length],
            isCurrent: y === year,
        }));
        
        const yAxisLabelsResult = [
            `R$ ${(topY / 1000)}k`,
            `R$ ${((topY * 0.75) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.5) / 1000).toFixed(0)}k`,
            `R$ ${((topY * 0.25) / 1000).toFixed(0)}k`,
            'R$ 0k'
        ];

        return { chartData: chartDataResult, yAxisLabels: yAxisLabelsResult };
    }, [year, location, rentals]);
    
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