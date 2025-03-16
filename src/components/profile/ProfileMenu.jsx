import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import de hook
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Imports de iconos
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Importamos el nuevo icono

// Import de componente
import { ProfileOptions } from './ProfileOptions.jsx';

// Función de el menu al loguear un usuario
export const ProfileMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { onLogout, currentUser, isAdmin } = useAuthHook();
    const [showMenu, setShowMenu] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
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

    // Actualizar el avatarUrl cuando cambia currentUser
    useEffect(() => {
        console.log('ProfileMenu: currentUser cambió', currentUser);
        if (currentUser?.avatar) {
            const newAvatarUrl = `/uploads/${currentUser.id}/avatars/${currentUser.avatar}`;
            console.log('ProfileMenu: nuevo avatarUrl', newAvatarUrl);
            setAvatarUrl(newAvatarUrl);
            setAvatarError(false);
        } else {
            setAvatarUrl(null);
        }
    }, [currentUser]);

    // Resetear el error cuando cambia la URL
    useEffect(() => {
        setAvatarError(false);
    }, [avatarUrl]);

    const menuItems = [
        ...(location.pathname !== '/storage'
            ? [
                  {
                      label: 'Inicio',
                      onClick: () => {
                          navigate('/storage');
                          setShowMenu(false);
                      },
                  },
              ]
            : []),
        {
            label: 'Perfil',
            onClick: () => {
                navigate('/profile');
                setShowMenu(false);
            },
        },
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
            label: 'About',
            onClick: () => {
                navigate('/aboutUs');
                setShowMenu(false);
            },
        },
        {
            label: 'Cerrar sesión',
            onClick: () => {
                navigate('/aboutUs');
                onLogout();
                setShowMenu(false);
            },
        },
    ];

    if (!currentUser) {
        return (
            <div className="relative z-40">
                <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-40 " ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center space-x-2 rounded-full`}
            >
                {avatarUrl && !avatarError ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar del usuario"
                        className={`h-8 w-8 rounded-full object-cover ${
                            isAdmin
                                ? 'ring-2 ring-red-500'
                                : 'ring-2 ring-blue-400'
                        }`}
                        onError={(e) => {
                            console.error(
                                e.message ||
                                    'Error al cargar el avatar en ProfileMenu'
                            );
                            setAvatarError(true);
                        }}
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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
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
