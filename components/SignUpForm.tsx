
import React, { useState } from 'react';
import { User } from '../App';

interface SignUpFormProps {
  onNavigateToLogin: () => void;
  onAddNewUser: (newUser: User) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onNavigateToLogin, onAddNewUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mobileHeaderImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDmM-svEzcAu0Er8yYv8ZAsCUVy5oYUa2GoSrfpkweX-8_B_nU5bOFKhrbjQ6PCn5Sx1sa6DhbM-UcmYHrfsntJdIcQTXmV5lpAvMFHz2Aj9ubfKsbNiR1hmuzHhVzOOThvjCkpGagjfk2A2VAloiMBlb4Zi5XCrXLWXs90JzZipI7JdLGDq6-HeoqyMmwB13rCD08bGrKHbh8T8wts2Zn2j0_nKQma_oXUsC_dNW2SyzX0sBzO9geglxUduIYlOHwqlx1rpeDhQQ";

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    onAddNewUser({ fullName, email, password });
  };

  return (
    <div className="flex w-full md:w-1/2 lg:w-5/12 flex-col justify-center items-center bg-background-light dark:bg-background-dark p-6 sm:p-12 relative overflow-y-auto max-h-screen">
      <div className="absolute top-0 left-0 w-full h-32 md:hidden bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url("${mobileHeaderImageUrl}")` }}
          aria-label="Abstract blue ocean waves pattern"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark"></div>
      </div>
      <div className="w-full max-w-[440px] flex flex-col gap-6 relative z-10 py-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">waves</span>
            </div>
            <span className="text-2xl font-bold text-primary dark:text-white tracking-tight">JMS</span>
          </div>
          <div>
            <h1 className="text-text-light dark:text-white tracking-tight text-[32px] font-bold leading-tight">Criar nova conta</h1>
            <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal mt-2">Preencha os dados abaixo para começar.</p>
          </div>
        </div>
        <form className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
              <p className="font-bold text-sm">{error}</p>
            </div>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">Nome Completo</span>
            <div className="relative group">
              <input className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-12 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="Seu nome completo" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-gray-500 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
              </div>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">E-mail</span>
            <div className="relative group">
              <input className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-12 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="ex: seu.email@jms.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-gray-500 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
              </div>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">Senha</span>
            <div className="relative group">
              <input className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-12 pr-12 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="********" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-subtext-light dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors cursor-pointer outline-none focus:text-primary" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">Confirmar Senha</span>
            <div className="relative group">
              <input className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-12 pr-12 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="********" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-subtext-light dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors cursor-pointer outline-none focus:text-primary" aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </label>
          <button onClick={handleSignUp} className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary text-white hover:bg-[#132d4a] active:scale-[0.98] transition-all duration-200 h-14 text-base font-bold tracking-wide shadow-md hover:shadow-lg shadow-primary/20" type="button">
            CADASTRAR
          </button>
        </form>
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Já tem conta?</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="inline-flex items-center gap-2 font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Voltar ao Login
          </a>
        </div>
        <div className="mt-4 pt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © 2024 JMS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
