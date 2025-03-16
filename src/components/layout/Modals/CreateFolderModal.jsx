import { useState } from 'react';

// Import de icono
import { XMarkIcon } from '@heroicons/react/24/outline';

// modal a la hora de crear carpetas
export const CreateFolderModal = ({ isOpen, onClose, onCreateFolder }) => {
    // recibe por props isOpen, onClose y onCreateFolder
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    // submit del form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar nombre de carpeta
        if (!folderName.trim()) {
            setError('El nombre de la carpeta es obligatorio');
            return;
        }

        onCreateFolder(folderName.trim());
        setFolderName('');
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
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>

                    {/* Título */}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 dark:text-white">
                        Crear nueva carpeta
                    </h3>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="folderName"
                                className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200"
                            >
                                Nombre de la carpeta
                            </label>
                            <input
                                type="text"
                                id="folderName"
                                value={folderName}
                                onChange={(e) => {
                                    setFolderName(e.target.value);
                                    setError('');
                                }}
                                className="w-full rounded-md border border-gray-300 dark:bg-[#3d3d3d] dark:border-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Mi carpeta"
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
                                className="bg-inherit px-4 py-2 text-sm font-medium text-gray-700 dark:text-white focus:outline-none"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-[#00B4D8] hover:bg-[#0096B4] px-4 py-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
