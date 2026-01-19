
import React, { useState, useMemo, useRef } from 'react';
import { Cost } from '../../App';

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface FinancialDashboardScreenProps {
    costs: Cost[];
}

const FinancialDashboardScreen: React.FC<FinancialDashboardScreenProps> = ({ costs }) => {
    // Definindo padrão como 'Todos'
    const [selectedYear, setSelectedYear] = useState('Todos');
    const [selectedInvestor, setSelectedInvestor] = useState('Todos');
    const [selectedStatus, setSelectedStatus] = useState('Todos');
    const [isExporting, setIsExporting] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const availableYears = useMemo(() => {
        const years = new Set(costs.map(c => c.date.substring(0, 4)));
        // FIX: Explicitly type sort arguments 'a' and 'b' as strings to resolve TypeScript inference issue.
        return ['Todos', ...[...years].filter(Boolean).sort((a: string, b: string) => parseInt(b) - parseInt(a))];
    }, [costs]);

    const availableInvestors = useMemo(() => {
        const investors = new Set(costs.map(c => c.investor));
        return ['Todos', ...[...investors].sort()];
    }, [costs]);

    const filteredCosts = useMemo(() => {
        return costs.filter(cost => {
            const costYear = cost.date.substring(0, 4);
            const yearMatch = selectedYear === 'Todos' || costYear === selectedYear;
            const investorMatch = selectedInvestor === 'Todos' || cost.investor === selectedInvestor;
            
            let statusMatch = true;
            if (selectedStatus === 'Pago') statusMatch = cost.isPaid;
            if (selectedStatus === 'Pendente') statusMatch = !cost.isPaid;

            return yearMatch && investorMatch && statusMatch;
        });
    }, [costs, selectedYear, selectedInvestor, selectedStatus]);

    const kpiData = useMemo(() => {
        let totalCost = 0;
        let totalPaid = 0;
        let pendingBalance = 0;

        filteredCosts.forEach(cost => {
            totalCost += cost.value;
            totalPaid += cost.paidValue;

            // Se NÃO está pago, a diferença é considerada pendência
            if (!cost.isPaid) {
                pendingBalance += (cost.value - cost.paidValue);
            }
        });

        // Conforme solicitado: Descontos = Total de Custos - Total Pago
        const totalDiscounts = totalCost - totalPaid;

        return { totalCost, totalPaid, pendingBalance, totalDiscounts };
    }, [filteredCosts]);
    
    const monthlyCostsData = useMemo(() => {
        const monthlyTotals: { [key: number]: number } = {};
        for(let i=0; i < 12; i++) monthlyTotals[i] = 0;

        filteredCosts.forEach(cost => {
            if (cost.date) {
                const month = new Date(cost.date).getUTCMonth();
                monthlyTotals[month] += cost.value;
            }
        });
        
        const maxMonthValue = Math.max(...Object.values(monthlyTotals));
        
        let topY = 1000;
        if (maxMonthValue > 0) {
            const magnitude = Math.pow(10, Math.floor(Math.log10(maxMonthValue)));
            const step = magnitude / 2 > 1000 ? magnitude / 2 : 1000;
            topY = Math.ceil((maxMonthValue * 1.05) / step) * step;
        }

        const yAxisLabels = [
            formatCurrency(topY),
            formatCurrency(topY * 0.75),
            formatCurrency(topY * 0.5),
            formatCurrency(topY * 0.25),
            formatCurrency(0)
        ];
        
        return {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            values: Object.values(monthlyTotals),
            topY: topY > 0 ? topY : 1,
            yAxisLabels,
        }
    }, [filteredCosts]);

    const investorContributionData = useMemo(() => {
        const contributions: { [key: string]: number } = {};
        const individualInvestors = availableInvestors.filter(inv => inv !== 'Todos' && inv !== 'Grupo');

        individualInvestors.forEach(inv => contributions[inv] = 0);

        filteredCosts.forEach(cost => {
            if (individualInvestors.includes(cost.investor)) {
                contributions[cost.investor] += cost.paidValue;
            }
        });
        
        const sortedContributions = Object.entries(contributions).sort((a, b) => b[1] - a[1]);
        const maxValue = sortedContributions.length > 0 ? sortedContributions[0][1] : 1;

        return {
            data: sortedContributions,
            maxValue: maxValue > 0 ? maxValue : 1
        };
    }, [filteredCosts, availableInvestors]);

    const expenseByCategoryData = useMemo(() => {
        const categories: { [key: string]: number } = {};
        filteredCosts.forEach(cost => {
            categories[cost.type] = (categories[cost.type] || 0) + cost.value;
        });

        const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const top5 = sorted.slice(0, 5);
        const others = sorted.slice(5).reduce((sum, item) => sum + item[1], 0);

        if (others > 0) {
            top5.push(['Outros', others]);
        }
        
        const total = filteredCosts.reduce((sum, c) => sum + c.value, 0) || 1;

        return top5.map(([name, value]) => ({
            name,
            value,
            percentage: ((value / total) * 100).toFixed(1)
        }));
    }, [filteredCosts]);

    const handleExportPDF = async () => {
        if (!dashboardRef.current || isExporting) return;

        setIsExporting(true);
        try {
            // @ts-ignore
            const { jsPDF } = window.jspdf;
            // @ts-ignore
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fafafa',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('relatorio-painel-financeiro-jms.pdf');
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGA5h3rDjnuG9JSQ1G7Ne5TGrU8UKvOyYRo5_K-TXLaaDQu61aEeSfXrPLtnTwI2D1BEs8NG-ImZcCGDQzHZ3spjgUp6qtElmY-hR3h6iGwANWLwvdsNp3QZiyehR9qIIjbNtuETQrwlxaL-XgtHynYOgcx3S1oS3h0NZSjg-EXtsjJUDEhb1kDaRwXk9_1R0fNHjovDewRDPLP2B5vkNp_xLsimz4f7kunXKqY6S5hVFaI7pAT5LWqFWdbJ77R-jK-6z1Dp3Yjw";
    const selectedPeriodText = selectedYear === 'Todos' ? 'Geral' : selectedYear;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div ref={dashboardRef} className="flex flex-col gap-6 bg-background-light">
                <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-end w-full gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-secondary">
                                <span className="material-symbols-outlined text-sm">insights</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Análise Financeira</span>
                            </div>
                            <h2 className="text-white text-3xl font-bold leading-tight">Painel Financeiro</h2>
                            <p className="text-gray-200 text-sm font-medium mt-1">Análise detalhada de custos e investimentos.</p>
                        </div>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] justify-center ml-auto md:ml-4"
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

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <span className="material-symbols-outlined">filter_alt</span>
                        Filtros:
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                            {availableYears.map(year => <option key={year} value={year}>{year === 'Todos' ? 'Ano: Todos' : `Ano: ${year}`}</option>)}
                        </select>
                        <select value={selectedInvestor} onChange={e => setSelectedInvestor(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                            {availableInvestors.map(inv => <option key={inv} value={inv}>{inv === 'Todos' ? 'Investidor: Todos' : inv}</option>)}
                        </select>
                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                            <option value="Todos">Status: Todos</option>
                            <option value="Pago">Pago</option>
                            <option value="Pendente">Pendente</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-primary"><span className="material-symbols-outlined text-3xl">account_balance_wallet</span></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Custo Total ({selectedPeriodText})</p>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(kpiData.totalCost)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600"><span className="material-symbols-outlined text-3xl">check_circle</span></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Pago ({selectedPeriodText})</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(kpiData.totalPaid)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><span className="material-symbols-outlined text-3xl">pending_actions</span></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Saldo Pendente ({selectedPeriodText})</p>
                            <p className="text-2xl font-bold text-amber-600">{formatCurrency(kpiData.pendingBalance)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="bg-teal-50 p-3 rounded-lg text-teal-600"><span className="material-symbols-outlined text-3xl">savings</span></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Descontos / Economia</p>
                            <p className="text-2xl font-bold text-teal-600">{formatCurrency(kpiData.totalDiscounts)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-4">Custos Mensais ({selectedPeriodText})</h3>
                    <div className="flex gap-4 h-64">
                        <div className="flex flex-col justify-between text-xs text-gray-400 font-medium text-right pb-6 w-16">
                            {monthlyCostsData.yAxisLabels.map(label => <span key={label}>{label}</span>)}
                        </div>
                        <div className="flex-1 flex flex-col border-l border-b border-gray-100">
                            <div className="flex-1 flex items-end w-full gap-2 md:gap-3 px-2">
                                 {monthlyCostsData.labels.map((label, index) => (
                                    <div key={label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                        <div className="relative w-full h-full flex items-end">
                                            <div 
                                                className="w-full bg-primary/20 rounded-t-md group-hover:bg-primary/40 transition-all duration-300 relative"
                                                style={{ height: `${(monthlyCostsData.values[index] / monthlyCostsData.topY) * 100}%` }}
                                            >
                                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {formatCurrency(monthlyCostsData.values[index])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full gap-2 md:gap-3 px-2 border-t border-gray-100 pt-1">
                                 {monthlyCostsData.labels.map(label => (
                                    <span key={label} className="flex-1 text-xs font-medium text-gray-500 text-center">{label}</span>
                                 ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-4">Contribuição por Sócio ({selectedPeriodText})</h3>
                        <div className="space-y-4">
                            {investorContributionData.data.map(([name, value]) => (
                                <div key={name}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-gray-700">{name}</span>
                                        <span className="text-sm font-medium text-primary">{formatCurrency(value)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-secondary h-2.5 rounded-full" 
                                            style={{ width: `${(value / investorContributionData.maxValue) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-4">Top Despesas ({selectedPeriodText})</h3>
                        <div className="space-y-3">
                            {expenseByCategoryData.map(item => (
                                 <div key={item.name} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className="text-sm font-medium text-gray-700 truncate" title={item.name}>{item.name}</p>
                                            <p className="text-xs font-bold text-gray-500">{item.percentage}%</p>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboardScreen;
