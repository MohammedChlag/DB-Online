import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

// Función para los botones de accion del perfil
export const ActionButton = ({
    onClick,
    icon: Icon = CloudArrowUpIcon,
    label = 'Subir archivo',
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                p-3 sm:p-4 bg-[#009EB5] text-white
                rounded-full shadow-lg
                hover:bg-[#009ec3] dark:hover:bg-[#00b4d8]
                active:scale-95
                transition-all
                focus:outline-none focus:ring-2 focus:ring-[#67e8f9] dark:focus:ring-[#0891b2] focus:ring-offset-2 dark:focus:ring-offset-gray-800
                z-90
                ${className}
            `}
            title={label}
        >
            <Icon className="h-6 sm:h-7 w-6 sm:w-7" />
        </button>
    );
};
