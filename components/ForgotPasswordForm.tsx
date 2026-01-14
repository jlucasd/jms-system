
import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onNavigateToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');

  const mobileHeaderImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDmM-svEzcAu0Er8yYv8ZAsCUVy5oYUa2GoSrfpkweX-8_B_nU5bOFKhrbjQ6PCn5Sx1sa6DhbM-UcmYHrfsntJdIcQTXmV5lpAvMFHz2Aj9ubfKsbNiR1hmuzHhVzOOThvjCkpGagjfk2A2VAloiMBlb4Zi5XCrXLWXs90JzZipI7JdLGDq6-HeoqyMmwB13rCD08bGrKHbh8T8wts2Zn2j0_nKQma_oXUsC_dNW2SyzX0sBzO9geglxUduIYlOHwqlx1rpeDhQQ";

  const handleRecovery = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Sending recovery link to:', email);
    // Here you would typically make an API call
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
          <div>
            <h1 className="text-text-light dark:text-white tracking-tight text-[32px] font-bold leading-tight">Recuperar Senha</h1>
            <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal mt-2">Insira o e-mail cadastrado para receber instruções de recuperação.</p>
          </div>
        </div>

        <form className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-text-light dark:text-gray-200 text-sm font-semibold leading-normal">E-mail</span>
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
          <button
            type="submit"
            onClick={handleRecovery}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary text-white hover:bg-[#132d4a] active:scale-[0.98] transition-all duration-200 h-14 text-base font-bold tracking-wide shadow-md hover:shadow-lg shadow-primary/20"
          >
            Enviar link de recuperação
          </button>
        </form>

        <div className="text-center pt-2">
            <a 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onNavigateToLogin();
                }}
                className="inline-flex items-center gap-2 font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors group text-sm cursor-pointer"
            >
                <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                Voltar ao Login
            </a>
        </div>
        
        <div className="mt-auto pt-6 text-center md:text-left">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © 2024 JMS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
