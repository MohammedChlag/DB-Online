// Import de el logo para el footer
import { Logofooter } from './LogoFooter.jsx';

// Función de footer
export const Footer = () => {
    return (
        <footer className="flex flex-col gap-2 items-center justify-center w-full bg-black p-2 sm:p-4 text-white text-xs sm:text-sm md:text-base">
            {/* Logo ajustable según el tamaño de la pantalla */}
            <Logofooter className="w-16 sm:w-20 md:w-24 mb-2" />
            <p className="text-center">Copyright© Hackloud</p>
        </footer>
    );
};
