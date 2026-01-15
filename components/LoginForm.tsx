
import React, { useState, useEffect } from 'react';
import { User } from '../App';

interface LoginFormProps {
  onNavigateToForgotPassword: () => void;
  onNavigateToSignUp: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToForgotPassword, onNavigateToSignUp, onLoginSuccess, users, successMessage, setSuccessMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mobileHeaderImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuALIhoMq7jrCC11GuUIer1GD9-GsdpiYk3xqRbYMk5LMnFtZcolrLZ1-WXDps-pC8Nv_JzBbkWu0pEyrDQA4Zh5RQKpj4aFabFkMa3eXaXa3a9AEJ43N2r3Skn5IewnxBNvrY-3Zryq8lQrwCQUXc5qtg9UBG8oFhB-bA1X0ey64qtrVayw66pEhb7iA6zjLbgvw-VFX1ExfWjoI0xGLh3lDwJpVi2h5PGSA433fY94ebmFtAtASimbUpcSb2CVh41ho0ESFLGjfw";

  useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 4000);
        return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex w-full md:w-1/2 lg:w-5/12 flex-col justify-center items-center bg-background-light dark:bg-background-dark p-6 sm:p-12 relative">
      <div className="absolute top-0 left-0 w-full h-32 md:hidden bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url("${mobileHeaderImageUrl}")` }}
          aria-label="Abstract blue ocean waves pattern"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark"></div>
      </div>

      <div className="w-full max-w-[440px] flex flex-col gap-8 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">waves</span>
            </div>
            <span className="text-2xl font-bold text-primary dark:text-white tracking-tight">JMS</span>
          </div>
          
          {successMessage && (
            <div 
                className="bg-emerald-50 border-emerald-500 text-emerald-800 border-l-4 p-4 rounded-lg flex items-center justify-between shadow-md mb-2"
                role="alert"
                style={{ animation: 'fade-in-up 0.5s ease-out' }}
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">check_circle</span>
                    <p className="font-bold text-sm">{successMessage}</p>
                </div>
                <button onClick={() => setSuccessMessage(null)} className="text-emerald-800/70 hover:text-emerald-800">
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>
          )}

          <div>
            <h1 className="text-text-light dark:text-white tracking-tight text-[32px] font-bold leading-tight">Bem-vindo de volta</h1>
            <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal mt-2">Entre para gerenciar sua frota.</p>
          </div>
        </div>

        <form className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
              <p className="font-bold text-sm">{error}</p>
            </div>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">E-mail ou Usuário</span>
            <div className="relative group">
              <input
                className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-14 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500"
                placeholder="ex: gerente@jms.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-gray-500 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
              </div>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">Senha</span>
            <div className="relative group">
              <input
                className="flex w-full rounded-lg border border-[#d3dbe4] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-14 pr-12 text-base text-text-light dark:text-white placeholder:text-[#94a3b8] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 shadow-sm group-hover:border-gray-400 dark:group-hover:border-gray-500"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-subtext-light dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors cursor-pointer outline-none focus:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-accent transition-colors cursor-pointer" type="checkbox" />
              <span className="text-sm text-subtext-light dark:text-subtext-dark group-hover:text-primary dark:group-hover:text-white transition-colors">Lembrar de mim</span>
            </label>
            <a 
              className="text-sm font-medium text-primary dark:text-accent hover:underline decoration-2 underline-offset-4 decoration-accent/50 cursor-pointer" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToForgotPassword();
              }}
            >
              Esqueceu a senha?
            </a>
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary text-white hover:bg-[#132d4a] active:scale-[0.98] transition-all duration-200 h-14 text-base font-bold tracking-wide shadow-md hover:shadow-lg shadow-primary/20"
          >
            ENTRAR
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Suporte</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="text-center">
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Primeiro acesso?{' '}
            <a 
              className="font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors cursor-pointer" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSignUp();
              }}
            >
              Criar usuário
            </a>
          </p>
        </div>
        <div className="mt-auto pt-8 text-center md:text-left">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © 2024 JMS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
