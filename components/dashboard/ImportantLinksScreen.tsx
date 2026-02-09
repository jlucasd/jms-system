
import React from 'react';

interface LinkItem {
    id: number;
    title: string;
    url: string;
    icon: string;
    description: string;
    category: 'Localizações' | 'Operacional' | 'Documentação';
    color: string;
}

const ImportantLinksScreen: React.FC = () => {
    const links: LinkItem[] = [
        {
            id: 1,
            title: 'Localização Ramon',
            url: 'https://maps.google.com/?q=-28.487417,-48.772289',
            icon: 'location_on',
            description: 'Ponto de encontro ou referência principal.',
            category: 'Localizações',
            color: 'bg-red-50 text-red-600',
        },
        {
            id: 2,
            title: 'Localização Lixão',
            url: 'https://maps.app.goo.gl/jtRh9L4TTTDFfyY16',
            icon: 'ramp_right',
            description: 'Local para descida dos Jet Skis.',
            category: 'Localizações',
            color: 'bg-orange-50 text-orange-600',
        },
        {
            id: 3,
            title: 'Localização Seu Tomé',
            url: 'https://maps.app.goo.gl/tLsmxjGMA2H521Si9',
            icon: 'store',
            description: 'Ponto de referência adicional.',
            category: 'Localizações',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            id: 4,
            title: 'Reservas JMS',
            url: 'https://api.whatsapp.com/send?phone=5548996344407&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20site%20e%20gostaria%20de%20alugar%20o%20Jet%20Ski%20para%20me%20divertir.',
            icon: 'calendar_month',
            description: 'Link direto para agendamento e contato via WhatsApp.',
            category: 'Operacional',
            color: 'bg-green-50 text-green-600',
        },
        {
            id: 5,
            title: 'Doc. Digital do Jet',
            url: 'https://drive.google.com/file/d/17itsDD4o-ChCoNxSL8Wo7zxtJFKlm0Op/view?usp=drive_link',
            icon: 'description',
            description: 'Documento oficial da embarcação.',
            category: 'Documentação',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            id: 6,
            title: 'Doc. Carreta Rodoviária',
            url: 'https://drive.google.com/file/d/1qW7vDbRw37CeDtsyW9wvXfCOqFQdzeSB/view?usp=drive_link',
            icon: 'directions_car',
            description: 'Documento do reboque para transporte.',
            category: 'Documentação',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            id: 7,
            title: 'Seguro DPEM Obrigatório',
            url: 'https://drive.google.com/file/d/1u59UdRVUN5iFbEXyaSBhG1Fvr4gqJnqb/view?usp=drive_link',
            icon: 'verified_user',
            description: 'Comprovante de seguro obrigatório vigente.',
            category: 'Documentação',
            color: 'bg-teal-50 text-teal-600',
        },
    ];

    const groupedLinks = {
        'Localizações': links.filter(l => l.category === 'Localizações'),
        'Operacional': links.filter(l => l.category === 'Operacional'),
        'Documentação': links.filter(l => l.category === 'Documentação'),
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">link</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Operacional</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">Links e Acessos Importantes</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Acesso rápido a localizações, documentos e sistemas.</p>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {Object.entries(groupedLinks).map(([category, items]) => (
                    <div key={category} className="animate-[fade-in-up_0.5s_ease-out]">
                        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-secondary rounded-full"></span>
                            {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {items.map((link) => (
                                <a 
                                    key={link.id} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-secondary/50 transition-all group flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`size-12 rounded-lg flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined text-[28px]">{link.icon}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-300 group-hover:text-secondary transition-colors">open_in_new</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary transition-colors">{link.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4 flex-1">{link.description}</p>
                                    <div className="mt-auto pt-3 border-t border-gray-50">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Acessar <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImportantLinksScreen;
