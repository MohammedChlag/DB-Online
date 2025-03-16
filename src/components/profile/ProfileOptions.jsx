import { UserCircleIcon } from '@heroicons/react/24/solid';

// Función para opciones y efectos en el menu de perfil
export const ProfileOptions = ({ items, userAvatar, userName, isAdmin }) => {
    return (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-elegant bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 animate-elegantRise origin-top-right overflow-hidden">
            {/* Cabecera del usuario */}
            <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center space-x-3">
                    {userAvatar ? (
                        <img
                            src={userAvatar}
                            alt="Avatar del usuario"
                            className={`h-10 w-10 rounded-full object-cover ring-2 ${
                                isAdmin ? 'ring-red-500' : 'ring-cyan-400'
                            } shadow-md`}
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                    ) : (
                        <UserCircleIcon
                            className={`h-10 w-10 ${
                                isAdmin
                                    ? 'text-red-500'
                                    : 'text-gray-400 dark:text-gray-300'
                            } drop-shadow-sm`}
                        />
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {userName}
                        </p>
                        {isAdmin && (
                            <p className="text-xs font-semibold text-red-500">
                                Administrador
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Menú de opciones */}
            <div className="py-1">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
