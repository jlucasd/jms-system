
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'neutral';
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendDirection, icon }) => {
    
    const trendClasses = trendDirection === 'up' 
        ? "text-emerald-600 bg-emerald-50"
        : "text-gray-500 bg-gray-50";

    return (
        <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary">{icon}</span>
            </div>
            <p className="text-[#58738d] text-sm font-medium">{title}</p>
            <div className="flex items-end gap-3">
                <p className="text-primary text-3xl font-bold tracking-tight">{value}</p>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full mb-1 ${trendClasses}`}>
                    {trendDirection === 'up' && <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>}
                     {trend}
                </span>
            </div>
        </div>
    );
};

export default StatCard;
