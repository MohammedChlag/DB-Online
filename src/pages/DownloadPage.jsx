import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { downloadSharedFileService } from '../services/fetchStorageApi.js';

// Imports de iconos
import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Página de descarga de archivo
export const DownloadPage = () => {
    const { shareToken } = useParams();
    const [downloading, setDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Iniciar la descarga automáticamente cuando se carga la página
        const startDownload = async () => {
            if (!shareToken) return;

            try {
                setDownloading(true);

                // Pequeño retraso para que el usuario vea la página antes de la descarga
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Llamar al servicio de descarga
                await downloadSharedFileService(shareToken);

                setDownloadComplete(true);
            } catch (err) {
                console.error('Error al descargar el archivo:', err);
                setError(err.message || 'Error al descargar el archivo');
            } finally {
                setDownloading(false);
            }
        };

        // Pequeño retraso antes de iniciar la descarga para que la página se renderice
        const timer = setTimeout(() => {
            startDownload();
        }, 1000);

        return () => clearTimeout(timer);
    }, [shareToken]);

    const handleManualDownload = async () => {
        if (downloading) return;

        try {
            setDownloading(true);
            await downloadSharedFileService(shareToken);
            setDownloadComplete(true);
        } catch (err) {
            console.error('Error al descargar el archivo:', err);
            setError(err.message || 'Error al descargar el archivo');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <section className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden">
                    {/* Cabecera con estado de descarga */}
                    <header className="bg-gradient-to-r from-[#009EB5] to-[#009ec3] dark:from-[#00798a] dark:to-[#00808f] p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            {downloadComplete
                                ? '¡Descarga completada!'
                                : error
                                ? 'Error en la descarga'
                                : 'Descargando archivo'}
                        </h1>
                        <p className="opacity-90">
                            {downloadComplete
                                ? 'Tu archivo ha sido descargado correctamente.'
                                : error
                                ? error
                                : 'Estamos preparando tu archivo para descargar...'}
                        </p>
                    </header>

                    {/* Contenido principal */}
                    <div className="p-6">
                        {/* Botón de descarga manual */}
                        {(downloadComplete || error) && (
                            <button
                                onClick={handleManualDownload}
                                disabled={downloading}
                                className="flex items-center justify-center gap-2 bg-[#009EB5] hover:bg-[#009ec3] dark:bg-[#00798a] dark:hover:bg-[#00808f] text-white font-medium py-3 px-4 rounded-lg w-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                {downloading
                                    ? 'Descargando...'
                                    : 'Descargar de nuevo'}
                            </button>
                        )}

                        {/* Mensaje promocional */}
                        <section className="mt-4 p-5 bg-[#e6f7f9] dark:bg-[#2a2a2a] rounded-lg border border-[#c5edf2] dark:border-[#3c3c3c]">
                            <h2 className="text-lg font-semibold text-[#00798a] dark:text-[#66c2d2] mb-2">
                                ¿Necesitas compartir tus propios archivos?
                            </h2>
                            <p className="text-[#009EB5] dark:text-[#66c2d2] mb-4">
                                Únete a Hackloud y disfruta de almacenamiento
                                seguro, compartición de archivos y mucho más.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    to="/users/register"
                                    className="bg-[#009EB5] hover:bg-[#009ec3] dark:bg-[#00798a] dark:hover:bg-[#00808f] text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm flex-1 text-center"
                                >
                                    Registrarse gratis
                                </Link>
                                <Link
                                    to="/users/login"
                                    className="bg-white border border-[#009EB5] hover:bg-[#e6f7f9] dark:bg-[#1e1e1e] dark:border-[#66c2d2] dark:hover:bg-[#2a2a2a] text-[#009EB5] dark:text-[#66c2d2] font-medium py-2 px-4 rounded-lg transition-colors flex-1 text-center"
                                >
                                    Iniciar sesión
                                </Link>
                            </div>
                        </section>

                        {/* Enlace para volver */}
                        <footer className="mt-6 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-1 text-gray-600 hover:text-[#009EB5] dark:text-gray-300 dark:hover:text-[#66c2d2] transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Volver a la página principal
                            </Link>
                        </footer>
                    </div>
                </div>
            </section>
        </div>
    );
};
