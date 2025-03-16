import React from 'react';

// Import de el modal de confirmación de borrado
export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, type }) => {
    if (!isOpen) return null;

    // Función para determinar el mensaje según el tipo
    const getMessage = () => {
        switch (type) {
            case 'folder':
                return 'esta carpeta';
            case 'file':
                return 'este archivo';
            case 'avatar':
                return 'tu avatar';
            case 'assessment':
                return 'esta valoración';
            default:
                return 'este elemento';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay oscuro */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <section className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all animate-popIn">
                    {/* Título */}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Confirmar eliminación
                    </h3>

                    {/* Contenido */}
                    <p className="mt-2 text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar {getMessage()}?
                        Esta acción no se puede deshacer.
                    </p>

                    {/* Botones */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="bg-white dark:bg-[#323232] px-4 py-2 text-sm font-medium text-gray-700 dark:text-white dark:bg-inherit"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Eliminar
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};
