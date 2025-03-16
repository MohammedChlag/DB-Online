import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Import de iconos
import { ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Función de modal de url compartida
export const ShareModal = ({ isOpen, onClose, urls, type, title }) => {
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Resetear estados cuando se abre el modal
        if (isOpen) {
            setLoading(true);
            setCopied(false);

            // Simular carga de 2 segundos
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleCopyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                toast.success('Enlace copiado al portapapeles');
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Error al copiar:', err);
                toast.error('No se pudo copiar el enlace');
            });
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
                        Compartir {type === 'file' ? 'archivo' : 'carpeta'}:{' '}
                        {title}
                    </h3>

                    {/* Contenido */}
                    <div className="mt-2 space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B4D8]"></div>
                                <p className="mt-3 text-gray-600">
                                    Generando enlace...
                                </p>
                            </div>
                        ) : urls ? (
                            <>
                                {type === 'folder' && urls.url && (
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Enlace para ver:
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                readOnly
                                                value={urls.url}
                                                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 bg-gray-50 dark:bg-[#3d3d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-none"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleCopyToClipboard(
                                                        urls.url
                                                    )
                                                }
                                                className="rounded-r-md bg-[#00B4D8] hover:bg-[#0096B4] px-3 py-2 text-white"
                                            >
                                                <ClipboardDocumentIcon className="h-7 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {urls.download && (
                                    <>
                                        <label className="block text-sm font-medium mt-4 text-gray-700 dark:text-gray-200 mb-2">
                                            Enlace para descargar:
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                readOnly
                                                value={urls.download}
                                                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 bg-gray-50 dark:bg-[#3d3d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-none"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleCopyToClipboard(
                                                        urls.download
                                                    )
                                                }
                                                className="rounded-r-md bg-[#00B4D8] hover:bg-[#0096B4] px-3 py-2 text-white"
                                            >
                                                <ClipboardDocumentIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </>
                                )}

                                <p className="text-sm text-gray-500 mt-4">
                                    Este enlace permite{' '}
                                    {type === 'file'
                                        ? 'descargar el archivo'
                                        : 'acceder a la carpeta'}{' '}
                                    sin necesidad de iniciar sesión.
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-4 text-red-600">
                                No se pudo generar el enlace. Inténtalo de
                                nuevo.
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-[#00B4D8] hover:bg-[#0096B4] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
