
import React from 'react';

const ChartBar: React.FC<{ height: string; value: string; label: string; bgColor: string; isCurrent?: boolean }> = ({ height, value, label, bgColor, isCurrent }) => (
    <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
        <div 
            className={`w-full max-w-[60px] ${bgColor} rounded-t-sm relative hover:brightness-110 transition-all duration-300 ${isCurrent ? 'shadow-[0_0_10px_rgba(15,35,56,0.2)]' : ''}`}
            style={{ height }}
        >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {value}
            </div>
        </div>
        <span className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
    </div>
);

const RevenueChart: React.FC = () => {
    const chartData = [
        { label: '2020', value: 'R$ 850k', height: '40%', bgColor: 'bg-[#8ba1b6]' },
        { label: '2021', value: 'R$ 1.1M', height: '55%', bgColor: 'bg-[#65829d]' },
        { label: '2022', value: 'R$ 1.4M', height: '70%', bgColor: 'bg-[#3f6385]' },
        { label: '2023', value: 'R$ 1.7M', height: '85%', bgColor: 'bg-[#1a3d61]' },
        { label: '2024', value: 'R$ 1.45M (Parcial)', height: '68%', bgColor: 'bg-[#0f2338]', isCurrent: true },
    ];
    
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Faturamento por Ano</h3>
                <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="flex-1 flex items-end gap-4 md:gap-8 h-64 w-full px-2">
                <div className="hidden md:flex flex-col justify-between h-full text-xs text-gray-400 font-medium pb-8 w-12 text-right">
                    <span>2M</span>
                    <span>1.5M</span>
                    <span>1M</span>
                    <span>500k</span>
                    <span>0</span>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 h-full pb-6 border-b border-gray-200">
                    {chartData.map(bar => <ChartBar key={bar.label} {...bar} />)}
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
