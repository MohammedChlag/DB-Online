import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Imports de services
import { getSharedLinkService } from '../services/fetchStorageApi.js';
import { downloadSharedFileService } from '../services/fetchStorageApi.js';

// Imports de iconos
import { FolderIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getFileIcon } from '../utils/helpers.js';

// Función de página de link compartido
export const SharedLinkPage = () => {
    const { shareToken } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resource, setResource] = useState(null);
    const [files, setFiles] = useState([]);
    console.log(resource);

    useEffect(() => {
        const fetchSharedData = async () => {
            try {
                setLoading(true);
                const responseData = await getSharedLinkService(shareToken);
                console.log('Datos recibidos:', responseData);

                // La estructura es { data: {...}, files: [...] }
                if (responseData && responseData.data) {
                    setResource(responseData.data);
                } else {
                    console.warn(
                        'No se encontró la estructura de resource esperada'
                    );
                    setResource(null);
                }

                if (responseData && responseData.files) {
                    setFiles(responseData.files);
                } else {
                    console.warn('No se encontraron archivos en la respuesta');
                    setFiles([]);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching shared data:', err);
                setError(
                    err.message || 'Error al cargar la carpeta compartida'
                );
                setLoading(false);
                toast.error('No se pudo cargar la carpeta compartida');
            }
        };

        if (shareToken) {
            fetchSharedData();
        }
    }, [shareToken]);

    const handleDownload = async (file) => {
        // Verificar si el archivo tiene shareToken
        if (!file.shareToken) {
            // Mostrar una serie de mensajes informativos con diferentes colores
            toast.info(
                'Este archivo no está habilitado para descarga pública.',
                {
                    position: 'top-right',
                    autoClose: 5000,
                }
            );

            setTimeout(() => {
                toast.warning(
                    'El propietario debe compartir este archivo específicamente.',
                    {
                        position: 'top-right',
                        autoClose: 5000,
                    }
                );
            }, 1000);

            setTimeout(() => {
                toast.error(
                    'Por favor, contacta al propietario para solicitar acceso.',
                    {
                        position: 'top-right',
                        autoClose: 5000,
                    }
                );
            }, 2000);

            return;
        }

        try {
            // Usamos el shareToken específico del archivo
            await downloadSharedFileService(file.shareToken);
            toast.success('Descarga iniciada');
        } catch (error) {
            console.error('Error al descargar:', error);

            // Si el error es 404, mostrar mensaje específico
            if (error.message && error.message.includes('404')) {
                toast.error('El archivo ya no está disponible para descarga');
            } else {
                toast.error('Error al descargar el archivo');
            }
        }
    };

    if (loading) {
        return (
            <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B4D8]"></div>
                <p className="mt-3 text-gray-600">
                    Cargando carpeta compartida...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <section className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full bg-[#00B4D8] hover:bg-[#0096B4] text-white py-2 px-4 rounded-md"
                    >
                        Volver al inicio
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {resource && (
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {/* Encabezado de la carpeta */}
                        <article className="bg-[#00B4D8] bg-opacity-10 p-4 border-b border-[#00B4D8] border-opacity-20">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                                <FolderIcon className="h-6 w-6 mr-4 text-[#00B4D8]" />
                                {resource.name}
                            </h1>
                        </article>

                        {/* Contenido de la carpeta (archivos) */}
                        <section className="p-6">
                            {files && files.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {files.map((file) => (
                                        <li
                                            key={file.id}
                                            className="border border-gray-200 dark:border-none rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-500"
                                        >
                                            <section className="flex items-start justify-between">
                                                <article className="flex items-start flex-1 min-w-0 mr-2">
                                                    {getFileIcon(file.name)}
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate w-full">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-white">
                                                            {file.size
                                                                ? `${(
                                                                      file.size /
                                                                      1024
                                                                  ).toFixed(
                                                                      2
                                                                  )} KB`
                                                                : 'Desconocido'}
                                                        </p>
                                                    </div>
                                                </article>
                                                <button
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                    className={`ml-2 p-1 ${
                                                        file.shareToken
                                                            ? 'text-gray-400 dark:text-white hover:text-[#00B4D8]'
                                                            : 'text-gray-300 dark:text-white hover:text-yellow-500'
                                                    } flex-shrink-0`}
                                                    title={
                                                        file.shareToken
                                                            ? 'Descargar'
                                                            : 'Solicitar acceso para descarga'
                                                    }
                                                >
                                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                                </button>
                                            </section>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">
                                        Esta carpeta está vacía
                                    </p>
                                </div>
                            )}
                        </section>
                    </section>
                )}
            </div>
        </div>
    );
};
