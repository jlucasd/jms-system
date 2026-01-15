
import React from 'react';
import ImagePanel from './ImagePanel';
import LoginForm from './LoginForm';
import { User } from '../App';

interface LoginScreenProps {
  onNavigateToForgotPassword: () => void;
  onNavigateToSignUp: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToForgotPassword, onNavigateToSignUp, onLoginSuccess, users, successMessage, setSuccessMessage }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="O mar é nosso escritório."
        subtitle="Sistema para gerenciamento de negócio da empresa JMS"
      />
      <LoginForm 
        onNavigateToForgotPassword={onNavigateToForgotPassword} 
        onNavigateToSignUp={onNavigateToSignUp} 
        onLoginSuccess={onLoginSuccess} 
        users={users} 
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </div>
  );
};

export default LoginScreen;
