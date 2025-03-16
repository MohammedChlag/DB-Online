import { Link } from 'react-router-dom';

// Import de hook
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Imports de logos
import logoLight from '../../assets/img/logo-hackloud-solo.png';
import logoDark from '../../assets/img/logo-hackloud-solo-blanco.png';

// Función para cambios de logo y redirección
export const Logo = () => {
    const { currentUser } = useAuthHook();
    const redirectPath = currentUser ? '/storage' : '/';

    return (
        <Link to={redirectPath}>
            <img
                src={logoLight}
                alt="Hackloud Logo Light"
                className="h-4 w-auto hover:opacity-80 transition-opacity md:h-6 dark:hidden"
            />

            <img
                src={logoDark}
                alt="Hackloud Logo Dark"
                className="h-4 w-auto hover:opacity-80 transition-opacity md:h-6 hidden dark:block"
            />
        </Link>
    );
};
