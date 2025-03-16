import React from 'react';

// Import de modal de borrado de usuario
export const DeleteUserModal = ({ isOpen, onClose, onConfirm, username }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay oscuro */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-[#000000] p-6 text-left shadow-xl transition-all">
                    {/* Título */}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Eliminar Usuario
                    </h3>

                    {/* Contenido */}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        ¿Estás seguro de que deseas eliminar al usuario{' '}
                        <span className="font-medium text-gray-700 dark:text-white">
                            {username}
                        </span>
                        ? Esta acción no se puede deshacer y el usuario perderá
                        todo acceso al sistema.
                    </p>

                    {/* Botones */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="bg-white dark:bg-[#323232] px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 rounded-md border border-gray-300 dark:border-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
