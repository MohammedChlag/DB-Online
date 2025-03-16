import { useEffect, useState, useRef } from 'react';

// Import de hook
import { useAuthHook } from '../../../hooks/useAuthHook';

// Import de icono
import { XMarkIcon } from '@heroicons/react/24/outline';

// Import del service de previsualización
import { getFilePreviewService } from '../../../services/fetchStorageApi.js';

// El modal más chulo para ver archivos
export const FilePreviewModal = ({ isOpen, onClose, file }) => {
    // Hooks y estados - mantén esto ordenado o te arrepentirás después
    const { token } = useAuthHook();
    const [preview, setPreview] = useState(null); // Aquí guardamos la vista previa
    const [loading, setLoading] = useState(true); // Para mostrar el spinner mientras carga
    const [error, setError] = useState(null); // Si algo sale mal, lo guardamos aquí
    const modalRef = useRef(null); // Referencia para detectar clics fuera del modal

    // Este efecto se ejecuta cuando se abre el modal o cambia el archivo
    useEffect(() => {
        if (isOpen && file) {
            loadPreview();

            // Cambiamos el título para el SEO (los bots de Google nos amarán)
            document.title = `Vista previa: ${file.name} | Mi Disco Duro`;

            // Detector de la tecla Escape para cerrar el modal como un pro
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);

            // Función de limpieza - siempre limpia tu desorden
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.title = 'Mi Disco Duro'; // Restauramos el título

                // Liberamos memoria revocando las URLs de objeto
                // (Memoria feliz = navegador feliz)
                if (
                    preview &&
                    (preview.type === 'image' ||
                        preview.type === 'pdf' ||
                        preview.type === 'video')
                ) {
                    URL.revokeObjectURL(preview.content);
                }
            };
        }
    }, [isOpen, file]); // Dependencias del efecto - quitamos preview para evitar bucle infinito

    // Función para detectar clics fuera del modal y cerrarlo
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // La función que hace la magia de cargar la vista previa
    const loadPreview = async () => {
        setLoading(true); // Activamos el spinner
        setError(null); // Reseteamos errores anteriores

        try {
            const previewData = await getFilePreviewService(
                file.id,
                token,
                file
            );
            setPreview(previewData);
        } catch (err) {
            // Algo salió mal - mostramos el error
            console.error(' ❌ Error al cargar la vista previa:', err);
            setError(err.message || 'Error al cargar la vista previa');
        } finally {
            // Pase lo que pase, quitamos el spinner
            setLoading(false);
        }
    };

    // Si el modal está cerrado, no renderizamos nada
    if (!isOpen) return null;

    // Aquí empieza la parte visual del componente
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={handleOutsideClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera con título y botón de cerrar */}
                <header className="flex justify-between items-center p-3 sm:p-4 border-b dark:border-gray-700">
                    <h2
                        id="preview-title"
                        className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 pr-2"
                    >
                        {file?.name || 'Vista previa'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Cerrar vista previa"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </header>

                {/* Contenido principal - aquí va la vista previa */}
                <main className="flex-1 overflow-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
                    {loading ? (
                        // Spinner mientras carga
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        </div>
                    ) : error ? (
                        // Mensaje de error si algo falló
                        <div className="text-center text-red-500 p-4">
                            <p role="alert">{error}</p>
                        </div>
                    ) : (
                        // Vista previa del archivo
                        <div className="flex justify-center items-center min-h-[200px]">
                            {renderPreview(preview, file)}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Función para renderizar diferentes tipos de contenido
// Esta función es la estrella del show - maneja todos los tipos de archivos
const renderPreview = (preview, file) => {
    // Si no hay vista previa, mostramos un mensaje
    if (!preview) return <p>No hay vista previa disponible</p>;

    // Según el tipo de archivo, renderizamos diferente contenido
    switch (preview.type) {
        case 'image':
            // Para imágenes - las mostramos con un <img>
            return (
                <figure className="max-w-full max-h-[70vh]">
                    <img
                        src={preview.content}
                        alt={`Vista previa de ${file?.name || 'imagen'}`}
                        className="max-w-full max-h-[70vh] object-contain"
                        loading="lazy"
                    />
                    {file?.name && (
                        <figcaption className="sr-only">{file.name}</figcaption>
                    )}
                </figure>
            );

        case 'pdf':
            // Para PDFs - usamos object con iframe como respaldo
            return (
                <div className="w-full h-[70vh] flex flex-col items-center justify-center">
                    <object
                        data={preview.content}
                        type="application/pdf"
                        className="w-full h-full border-0"
                    >
                        <iframe
                            src={preview.content}
                            title={`Vista previa de ${file?.name || 'PDF'}`}
                            className="w-full h-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                        >
                            Tu navegador no puede mostrar este PDF.
                        </iframe>
                    </object>

                    {/* Mensaje de respaldo por si falla la carga */}
                    <p className="text-xs text-gray-500 mt-2">
                        Si el PDF no se visualiza correctamente,{' '}
                        <a
                            href={preview.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            abrir en una nueva pestaña
                        </a>
                    </p>
                </div>
            );

        case 'video':
            // Para videos - usamos un elemento video
            return (
                <figure className="max-w-full max-h-[70vh]">
                    <video
                        src={preview.content}
                        controls
                        autoPlay={false}
                        className="max-w-full max-h-[70vh]"
                        preload="metadata"
                    >
                        {/* No ponemos src vacío en el track para evitar errores */}
                        <track kind="captions" label="Español" />
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                    {file?.name && (
                        <figcaption className="sr-only">{file.name}</figcaption>
                    )}
                </figure>
            );

        case 'text':
            // Para archivos de texto - los mostramos en un <pre>
            return (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto w-full max-h-[70vh] text-xs sm:text-sm font-mono dark:text-gray-200">
                    {preview.content}
                </pre>
            );

        case 'unsupported':
            // Para archivos no soportados - mostramos un mensaje
            return (
                <div className="text-center p-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {preview.message ||
                            'No hay vista previa disponible para este tipo de archivo'}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Tipo de archivo: {preview.contentType || 'desconocido'}
                    </p>
                </div>
            );

        default:
            // Por si acaso - nunca confíes en los datos que recibes
            return <p>No hay vista previa disponible</p>;
    }
};
