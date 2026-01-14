
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../App';

interface UserMenuProps {
    currentUser: User | null;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const userProfilePicFallback = "https://lh3.googleusercontent.com/aida-public/AB6AXuD5KV1c8iepweSrUE0mKWR4HNex6iAskIblPrIoDeAtHBkI0pepVeO3IsvT8A5O-EiaD1YLLeQJ7qZj8kY7bLq2qwMu5TVDWJ6Am5XVNLol3RJiTpU7R7JlFs6L7CXd7bUwfv3SmWRQdEGA6a_EThmdMtEKNcQmECNv7947DFxzjG6zReoS_U90ly3wXSL1uYSzDtIxv7yKs3LjKWxneOv4reF-JBcmgXi7IEOm3CKyl_ZDBt0ktqKWOkJ4HXQSc91OWAeZaNebHg";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(false);
        onLogout();
    }

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white shadow-sm" 
                    style={{ backgroundImage: `url("${currentUser?.imageUrl || userProfilePicFallback}")` }} 
                    aria-label="User profile picture"
                ></div>
                <div className="hidden md:flex flex-col text-left overflow-hidden">
                    <p className="text-primary text-sm font-bold truncate">{currentUser?.fullName || 'Usuário'}</p>
                    <p className="text-subtext-light text-xs truncate">{currentUser?.role || 'Visitante'}</p>
                </div>
                <span className={`material-symbols-outlined text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                    style={{ animation: 'fade-in-up 0.2s ease-out' }}
                >
                    <a 
                        href="#" 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Sair
                    </a>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
