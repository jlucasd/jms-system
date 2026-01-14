
import React from 'react';
import ImagePanel from './ImagePanel';
import LoginForm from './LoginForm';
import { User } from '../App';

interface LoginScreenProps {
  onNavigateToForgotPassword: () => void;
  onNavigateToSignUp: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToForgotPassword, onNavigateToSignUp, onLoginSuccess, users }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="O mar é seu escritório."
        subtitle="Gerencie sua frota de jet skis, reservas e equipe operacional com a eficiência que seu negócio merece."
      />
      <LoginForm onNavigateToForgotPassword={onNavigateToForgotPassword} onNavigateToSignUp={onNavigateToSignUp} onLoginSuccess={onLoginSuccess} users={users} />
    </div>
  );
};

export default LoginScreen;
