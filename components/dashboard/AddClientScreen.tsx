
import React, { useState, useEffect } from 'react';
import { Client } from '../../App';

interface AddClientScreenProps {
    onCancel: () => void;
    onSave: (client: Client) => void;
    clientToEdit: Client | null;
}

const AddClientScreen: React.FC<AddClientScreenProps> = ({ onCancel, onSave, clientToEdit }) => {
    const isEditMode = !!clientToEdit;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [address, setAddress] = useState('');
    const [cep, setCep] = useState('');
    const [chaNumber, setChaNumber] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && clientToEdit) {
            setName(clientToEdit.name);
            setPhone(clientToEdit.phone);
            setCpf(clientToEdit.cpf);
            setAddress(clientToEdit.address);
            setCep(clientToEdit.cep);
            setChaNumber(clientToEdit.chaNumber);
        }
    }, [isEditMode, clientToEdit]);

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const maskCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskCEP = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name) {
            setError("O nome do cliente é obrigatório.");
            return;
        }

        const clientData: Client = {
            id: isEditMode && clientToEdit ? clientToEdit.id : Date.now(),
            name,
            phone,
            cpf,
            address,
            cep,
            chaNumber
        };
        onSave(clientData);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Clientes</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">{isEditMode ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">Preencha os dados completos para cadastro.</p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full">
                <div className="bg-white w-full max-w-4xl rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <form className="p-6 md:p-8" onSubmit={handleSave}>
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                                <p className="font-bold text-sm">{error}</p>
                            </div>
                        )}
                        
                        <div className="space-y-6">
                            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-primary mb-6">Dados Pessoais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Ex: João da Silva" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                                        <input value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="000.000.000-00" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                                        <input value={phone} onChange={e => setPhone(maskPhone(e.target.value))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="(00) 00000-0000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nº do CHA</label>
                                        <input value={chaNumber} onChange={e => setChaNumber(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Número da Habilitação" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-primary mb-6">Endereço</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">CEP</label>
                                        <input value={cep} onChange={e => setCep(maskCEP(e.target.value))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="00000-000" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
                                        <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Rua, Número, Bairro, Cidade - UF" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                            <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors" type="button">Cancelar</button>
                            <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2" type="submit">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Salvar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddClientScreen;
