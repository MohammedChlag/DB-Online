import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Import de hook
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Import de logo para el Header
import { Logo } from './Logo.jsx';

// Imports de componentes
import { ProfileMenu } from '../profile/ProfileMenu.jsx';
import { ThemeUserMode } from '../ThemeUserMode.jsx';

// Función de Header
export const Header = () => {
    const { currentUser } = useAuthHook();
    const location = useLocation();

    // Determinar si estamos en una ruta de storage para ajustar el ancho
    const isStoragePage = location.pathname.startsWith('/storage');

    // Clases del header según la ruta
    const headerClasses = `flex items-center justify-between w-[95vw] lg:w-full ${
        isStoragePage ? 'lg:max-w-screen-xl' : 'lg:max-w-screen-lg'
    } mx-auto ${
        isStoragePage ? 'lg:px-8' : 'sm:px-6 lg:px-8'
    } border-b-2 border-black dark:border-white py-3 transition-all duration-300 ease-in-out`;

    return (
        <header className={headerClasses}>
            {/* Ajustamos el tamaño del logo */}
            <div className="flex items-center justify-between w-[95vw]">
                <Logo className="w-14 sm:w-20 md:w-24" />
                <ThemeUserMode />
                {currentUser ? (
                    <ProfileMenu />
                ) : (
                    <nav className="flex sm:space-x-4 text-xs sm:text-sm md:text-base ml-auto">
                        <Link
                            className=" dark:text-white w-fit border-b-2 border-transparent hover:border-[#009EB5] p-1 rounded-md"
                            to="/users/register"
                        >
                            Registrarse
                        </Link>
                        <Link
                            to="/users/login"
                            className=" dark:text-white w-fit border-b-2 border-transparent hover:border-[#009EB5] p-1 rounded-md"
                        >
                            Iniciar Sesión
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};
