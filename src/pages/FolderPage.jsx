import { useMemo } from 'react';

// Import de icono
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Imports de componentes
import { DocumentsSection } from '../components/storage/DocumentsSection.jsx';
import { ActionButton } from '../components/profile/ActionButton.jsx';

// Función de sección de archivos de la página Homepage
export const FolderPage = ({
    folderId,
    storage,
    loading,
    error,
    onBack,
    onUpload,
    onRename,
    onDelete,
    onRefetchStorage,
}) => {
    const folderContent = useMemo(() => {
        if (!storage) return { documents: [] };

        return {
            documents: storage.filter(
                (item) => item.type === 'file' && item.folderId === folderId
            ),
        };
    }, [storage, folderId]);

    // Determinar si la carpeta actual tiene shareToken
    const currentFolder = useMemo(() => {
        return storage?.find((item) => item.id === folderId);
    }, [storage, folderId]);

    const isSharedFolder = !!currentFolder?.shareToken;

    return (
        <section className="flex flex-col gap-4 mt-2 max-w-[90vw] px-4 sm:px-6 lg:px-8">
            {/* Navegación */}
            <nav className="flex items-center gap-4 my-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    <ArrowLeftIcon className="size-6" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                    {currentFolder?.name || 'Carpeta'}
                </h1>
            </nav>

            {/* Sección de Documentos */}
            <DocumentsSection
                documents={folderContent.documents}
                loading={loading}
                error={error}
                onRename={onRename}
                onDelete={onDelete}
                onRefetchStorage={onRefetchStorage}
                isSharedFolder={isSharedFolder}
            />

            {/* Botón flotante para subir archivos */}
            <ActionButton
                onClick={onUpload}
                className="fixed bottom-16 right-4 sm:bottom-28 sm:right-8 z-50"
            />
        </section>
    );
};
