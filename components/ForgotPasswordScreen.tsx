
import React from 'react';
import ImagePanel from './ImagePanel';
import ForgotPasswordForm from './ForgotPasswordForm';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToResetPassword: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigateToLogin, onNavigateToResetPassword }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="O mar é seu escritório."
        subtitle="Gerencie sua frota de jet skis, reservas e equipe operacional com a eficiência que seu negócio merece."
      />
      <ForgotPasswordForm 
        onNavigateToLogin={onNavigateToLogin} 
        onNavigateToResetPassword={onNavigateToResetPassword} 
      />
    </div>
  );
};

export default ForgotPasswordScreen;
