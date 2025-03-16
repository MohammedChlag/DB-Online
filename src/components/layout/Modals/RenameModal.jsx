import { useState } from 'react';

// Import de icono
import { XMarkIcon } from '@heroicons/react/24/outline';

// funcion auxiliar para recortar el nombre
const truncateName = (name, type, maxLength = 25) => {
    if (name.length <= maxLength) return name;

    if (type === 'folder') {
        return name.slice(0, maxLength - 3) + '...';
    }

    // Para archivos
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExt.slice(0, maxLength - 3) + '...';
    return `${truncatedName}.${extension}`;
};

// modal de renombrado
export const RenameModal = ({
    isOpen,
    onClose,
    onSubmit,
    currentName = '',
    type = '',
}) => {
    // recibe por props el nombre actual y el tipo de archivo/folder
    const [newName, setNewName] = useState(currentName || '');
    const [error, setError] = useState('');

    // submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }
        onSubmit(newName.trim());
        setError('');
    };

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
                <div
                    className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all animate-popIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                        type="button"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>

                    {/* Título */}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Renombrar {type === 'folder' ? 'carpeta' : 'archivo'}:{' '}
                        {truncateName(currentName, type)}
                    </h3>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="newName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2"
                            >
                                Nuevo nombre
                            </label>
                            <input
                                type="text"
                                id="newName"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    setError('');
                                }}
                                className="w-full rounded-md border border-gray-300 dark:bg-[#3d3d3d] dark:border-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nuevo nombre"
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white focus:outline-none focus:ring-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-[#00B4D8] hover:bg-[#0096B4] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
