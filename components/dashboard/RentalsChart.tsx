
import React, { useMemo } from 'react';

const RentalsChart: React.FC<{ year: string; month: string; unit: string; }> = ({ year, month, unit }) => {
    
    const { dailyPercentage, halfDayPercentage, totalRentals } = useMemo(() => {
        const hash = (year + month + unit).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseDaily = 2497;
        const baseHalfDay = 1345;

        const daily = Math.round(baseDaily * (1 - (hash % 15) / 100));
        const halfDay = Math.round(baseHalfDay * (1 - (hash % 20) / 100));
        
        const total = daily + halfDay;
        
        return {
            dailyPercentage: Math.round((daily / total) * 100),
            halfDayPercentage: Math.round((halfDay / total) * 100),
            totalRentals: total,
            dailyRentals: daily,
            halfDayRentals: halfDay
        };
    }, [year, month, unit]);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const dailyOffset = circumference * (1 - (dailyPercentage / 100));

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Locações por Tipo</h3>
                <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative size-48">
                    <svg width="192" height="192" viewBox="0 0 192 192" className="-rotate-90 transform">
                        <circle
                            r={radius} cx="96" cy="96" fill="transparent"
                            stroke="var(--tw-colors-secondary)"
                            strokeWidth="32"
                            strokeDasharray={circumference}
                            strokeDashoffset="0"
                            className="opacity-20"
                        />
                        <circle
                            r={radius} cx="96" cy="96" fill="transparent"
                            stroke="var(--tw-colors-primary)"
                            strokeWidth="32"
                            strokeDasharray={circumference}
                            strokeDashoffset={dailyOffset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute inset-0 m-auto size-28 bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                        <span className="text-2xl font-bold text-primary">{(totalRentals/1000).toFixed(1)}k</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</span>
                    </div>
                </div>
                <div className="w-full flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-primary"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Diária ({dailyPercentage}%)</span>
                            <span className="text-[10px] text-gray-400">{totalRentals} locações</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-secondary/20"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Meia ({halfDayPercentage}%)</span>
                            <span className="text-[10px] text-gray-400">{totalRentals} locações</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalsChart;
