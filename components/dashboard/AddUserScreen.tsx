
import React, { useState, useEffect } from 'react';
import { DashboardUser } from '../../App';

interface AddUserScreenProps {
    onCancel: () => void;
    onSave: (user: DashboardUser) => void;
    userToEdit: DashboardUser | null;
}

const AddUserScreen: React.FC<AddUserScreenProps> = ({ onCancel, onSave, userToEdit }) => {
    const isEditMode = !!userToEdit;

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Role is now managed as an array of strings internally
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const availableRoles = ['Gerente', 'Colaborador', 'Financeiro'];

    useEffect(() => {
        if (isEditMode && userToEdit) {
            setFullName(userToEdit.name);
            setEmail(userToEdit.email);
            setStatus(userToEdit.status);
            // Split the role string into array, trim to ensure clean matches
            setSelectedRoles(userToEdit.role.split(',').map(r => r.trim()).filter(Boolean));
            setPassword('');
            setConfirmPassword('');
        }
    }, [isEditMode, userToEdit]);

    const handleRoleToggle = (role: string) => {
        setSelectedRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role) 
                : [...prev, role]
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName || !email) {
            setError("Os campos Nome e E-mail são obrigatórios.");
            return;
        }

        if (selectedRoles.length === 0) {
            setError("Selecione pelo menos um perfil de acesso.");
            return;
        }

        if (!isEditMode && (!password || !confirmPassword)) {
            setError("Os campos de senha são obrigatórios para novos usuários.");
            return;
        }

        if (password && password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        
        const userData: DashboardUser = {
            id: isEditMode && userToEdit ? userToEdit.id : `#${Math.floor(Math.random() * 900) + 100}`,
            name: fullName,
            email,
            status,
            role: selectedRoles.join(', '), // Join back to string
            imageUrl: isEditMode && userToEdit ? userToEdit.imageUrl : null,
        };
        
        onSave(userData);
    };

    const headerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3vRg9di2UIacwy7mm9xO2UHXHU8DEIbPIjW_QkUDJdfwFW-hgZpmGy691nw1lqSXqekfPEl_sMHmtmBpfkp8ucMIfnc2DWlKfNsd1ZCN56JSJhlUmcciNAnv58vtESNnLhdLG1_gxp5FwEMaGsdq6frmu3WbWZXCtwR403yMri8wWVQNvolLkmBpzxHm2KfaPbfvAKu7DnsWQFD9pHtTnpxm-vWtkiYPvU3Q4bdB7Bqq0lgK0Hvw4-7dYz8T3CV4Lnm_oVWZF_g";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="w-full rounded-2xl overflow-hidden relative min-h-[160px] shadow-lg flex items-end">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${headerImageUrl}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Administração</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold leading-tight">{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
                    <p className="text-gray-200 text-sm font-medium mt-1">{isEditMode ? 'Atualize os dados do membro da equipe' : 'Preencha os dados abaixo para cadastrar um novo membro da equipe'}</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="bg-white w-full max-w-4xl rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-primary">Informações do Usuário</h3>
                        <p className="text-sm text-gray-500">Detalhes pessoais e configurações de acesso ao sistema.</p>
                    </div>
                    <form className="p-6 md:p-8 flex flex-col gap-8" onSubmit={handleSave}>
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg -mb-4" role="alert">
                                <p className="font-bold text-sm">{error}</p>
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="shrink-0">
                                <div className="size-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 relative group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                                    <span className="material-symbols-outlined text-[40px] group-hover:scale-110 transition-transform">add_a_photo</span>
                                    <input accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2 font-medium">Foto de Perfil</p>
                            </div>
                            <div className="flex-1 w-full space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="fullName">Nome Completo</label>
                                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="fullName" placeholder="Ex: Maria Souza" type="text" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">E-mail</label>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="email" placeholder="usuario@jetski.com" type="email" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="status">Status Inicial</label>
                                        <div className="relative">
                                            <select value={status} onChange={(e) => setStatus(e.target.value as 'Ativo' | 'Inativo')} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-primary font-medium appearance-none cursor-pointer" id="status">
                                                <option value="Ativo">Ativo</option>
                                                <option value="Inativo">Inativo</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 w-full"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="password">Senha {isEditMode && <span className="text-xs font-normal text-gray-500">(Deixe em branco para não alterar)</span>}</label>
                                <div className="relative">
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="password" placeholder="••••••••" type="password" />
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="confirmPassword">Confirmação de Senha</label>
                                <div className="relative">
                                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-primary font-medium" id="confirmPassword" placeholder="••••••••" type="password" />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="role">Perfis de Acesso (Selecione um ou mais)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {availableRoles.map((role) => {
                                        const isSelected = selectedRoles.includes(role);
                                        return (
                                            <div 
                                                key={role}
                                                onClick={() => handleRoleToggle(role)}
                                                className={`
                                                    relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                                                    ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className={`
                                                    size-5 rounded border flex items-center justify-center mr-3 transition-colors
                                                    ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}
                                                `}>
                                                    {isSelected && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                                </div>
                                                <span className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-gray-600'}`}>{role}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 ml-1">O usuário terá permissões acumuladas dos perfis selecionados.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                            <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors" type="button">
                                Cancelar
                            </button>
                            <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2" type="submit">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isEditMode ? 'Salvar Alterações' : 'Salvar Usuário'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserScreen;
