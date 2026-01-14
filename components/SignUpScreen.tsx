
import React from 'react';
import ImagePanel from './ImagePanel';
import SignUpForm from './SignUpForm';
import { User } from '../App';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  onAddNewUser: (newUser: User) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin, onAddNewUser }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <ImagePanel 
        title="Prepare-se para navegar."
        subtitle="Cadastre-se para gerenciar sua frota, equipe e reservas com total controle e segurança."
      />
      <SignUpForm onNavigateToLogin={onNavigateToLogin} onAddNewUser={onAddNewUser} />
    </div>
  );
};

export default SignUpScreen;
