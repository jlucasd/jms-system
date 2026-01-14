
import React from 'react';
import ImagePanel from './ImagePanel';
import ForgotPasswordForm from './ForgotPasswordForm';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="O mar é seu escritório."
        subtitle="Gerencie sua frota de jet skis, reservas e equipe operacional com a eficiência que seu negócio merece."
      />
      <ForgotPasswordForm onNavigateToLogin={onNavigateToLogin} />
    </div>
  );
};

export default ForgotPasswordScreen;
