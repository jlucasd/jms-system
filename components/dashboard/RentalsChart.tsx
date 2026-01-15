
import React, { useMemo } from 'react';
import { Rental } from '../../App';

const RentalsChart: React.FC<{ year: string; month: string; location: string; rentals: Rental[] }> = ({ year, month, location, rentals }) => {
    
    const { dailyPercentage, halfDayPercentage, totalRentals, dailyRentals, halfDayRentals } = useMemo(() => {
        const monthMap: { [key: string]: number } = { 'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3, 'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7, 'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11 };

        const filteredRentals = rentals.filter(r => {
            const rentalYear = r.date.substring(0, 4);
            const rentalMonth = new Date(r.date).getUTCMonth();
            
            const yearMatch = year === 'Todos' || rentalYear === year;
            const monthMatch = month === 'Todos' || rentalMonth === monthMap[month];
            const locationMatch = location === 'Todos os Locais' || r.location === location;

            return yearMatch && monthMatch && locationMatch;
        });

        let dailyCount = 0;
        let halfDayCount = 0;

        filteredRentals.forEach(r => {
            if (r.rentalType === 'Meia Diária') {
                halfDayCount++;
            } else { // 'Diária' and 'Diária/Meia'
                dailyCount++;
            }
        });
        
        const total = dailyCount + halfDayCount;
        
        return {
            dailyPercentage: total > 0 ? Math.round((dailyCount / total) * 100) : 0,
            halfDayPercentage: total > 0 ? Math.round((halfDayCount / total) * 100) : 0,
            totalRentals: total,
            dailyRentals: dailyCount,
            halfDayRentals: halfDayCount
        };
    }, [year, month, location, rentals]);

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
                        <span className="text-2xl font-bold text-primary">{totalRentals}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</span>
                    </div>
                </div>
                <div className="w-full flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-primary"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Diária ({dailyPercentage}%)</span>
                            <span className="text-[10px] text-gray-400">{dailyRentals} locações</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-secondary/20"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">Meia Diária ({halfDayPercentage}%)</span>
                            <span className="text-[10px] text-gray-400">{halfDayRentals} locações</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalsChart;
