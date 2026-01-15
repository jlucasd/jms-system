
import React from 'react';
import ImagePanel from './ImagePanel';
import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordScreenProps {
  email: string;
  onNavigateToLogin: () => void;
  onPasswordResetSuccess: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ email, onNavigateToLogin, onPasswordResetSuccess }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="Navegue com segurança."
        subtitle="Mantenha suas credenciais seguras para garantir a integridade dos dados da sua frota."
      />
      <ResetPasswordForm 
        email={email} 
        onNavigateToLogin={onNavigateToLogin} 
        onPasswordResetSuccess={onPasswordResetSuccess}
      />
    </div>
  );
};

export default ResetPasswordScreen;
