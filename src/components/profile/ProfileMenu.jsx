import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import de hook
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Imports de iconos
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Import de componente
import { ProfileOptions } from './ProfileOptions.jsx';

// Función del menú al loguear un usuario
export const ProfileMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { onLogout, currentUser, isAdmin } = useAuthHook();
    const [showMenu, setShowMenu] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const avatarUrl = currentUser?.avatar
        ? `${import.meta.env.VITE_BACKEND_STATIC}/${currentUser.avatar}`
        : null;

    const menuItems = [
        ...(location.pathname !== '/storage'
            ? [{ label: 'Inicio', path: '/storage' }]
            : []),
        { label: 'Perfil', path: '/profile' },
        ...(isAdmin
            ? [
                  {
                      label: 'Listar Usuarios',
                      onClick: () => {
                          navigate('/admin/users');
                          setShowMenu(false);
                      },
                  },
              ]
            : []),
        {
            label: 'Valoraciones',
            onClick: () => {
                navigate('/assessments');
                setShowMenu(false);
            },
        },
        {
            label: 'Cerrar sesión',
            onClick: () => {
                onLogout();
                navigate('/aboutUs');
                setShowMenu(false);
            },
        },
    ];

    return (
        <div className="relative z-40">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 rounded-full"
            >
                {avatarUrl && !avatarError ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar del usuario"
                        className={`h-8 w-8 rounded-full object-cover ${
                            isAdmin ? 'ring-2 ring-red-500' : ''
                        }`}
                        onError={() => setAvatarError(true)}
                    />
                ) : (
                    <UserCircleIcon
                        className={`h-8 w-8 ${
                            isAdmin ? 'text-red-500' : 'text-gray-400'
                        }`}
                    />
                )}
                {isAdmin && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                    </span>
                )}
                <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-white" />
            </button>

            {showMenu && (
                <ProfileOptions
                    items={menuItems}
                    userAvatar={avatarUrl}
                    userName={currentUser?.username || 'Usuario'}
                    isAdmin={isAdmin}
                />
            )}
        </div>
    );
};
