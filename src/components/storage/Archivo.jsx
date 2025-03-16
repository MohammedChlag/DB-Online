import { useState } from 'react';
import { toast } from 'react-toastify';

import { useAuthHook } from '../../hooks/useAuthHook.js';
import { useItemsHook } from '../../hooks/useItemsHook.js';

// Imports de iconos
import {
    PencilIcon,
    TrashIcon,
    EllipsisVerticalIcon,
    ShareIcon,
    UsersIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// Imports de modals
import { RenameModal } from '../layout/Modals/RenameModal.jsx';
import { ShareModal } from '../layout/Modals/ShareModal.jsx';
import { DeleteConfirmModal } from '../layout/Modals/DeleteConfirmModal.jsx';
import { FilePreviewModal } from '../layout/Modals/FilePreviewModal.jsx';

import { shareStorageItemService } from '../../services/fetchStorageApi.js';

import { getFileIcon } from '../../utils/helpers.js';
import { formatDate } from '../../utils/dayJs.js';

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = Math.round(bytes / Math.pow(k, i));
    return `${size} ${sizes[i]}`;
};

const truncateFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExt.slice(0, maxLength - 3) + '...';
    return `${truncatedName}.${extension}`;
};

export const Archivo = ({
    file,
    onRename,
    onDelete,
    onRefetchStorage,
    isSharedFolder = false,
}) => {
    const { token } = useAuthHook();
    const {
        showOptions,
        showRenameModal,
        showShareModal,
        showDeleteModal,
        shareUrls,
        handleOptionsClick,
        handleRename,
        handleShare,
        handleDelete,
        handleDeleteConfirm,
        closeOptions,
        setShowRenameModal,
        setShowShareModal,
        setShowDeleteModal,
        handleDownload,
    } = useItemsHook(file, 'file', { onDelete, onRefetchStorage });

    const handleRenameSubmit = async (newName) => {
        await onRename(file.id, newName);
        setShowRenameModal(false);
    };

    // Función para habilitar la descarga del archivo
    const handleEnableDownload = async () => {
        try {
            closeOptions();
            toast.info('Habilitando descarga...', { autoClose: 2000 });

            // Usamos el mismo servicio que se usa para compartir
            await shareStorageItemService(file.id, token);

            // Mostramos un toast de éxito
            toast.success('Descarga habilitada correctamente');

            // Actualizamos el almacenamiento para reflejar los cambios
            if (onRefetchStorage) {
                onRefetchStorage();
            }
        } catch (error) {
            console.error('Error al habilitar descarga:', error);
            toast.error('Error al habilitar la descarga');
        }
    };

    // Determinar si debemos mostrar la opción "Habilitar descarga"
    const showEnableDownload = isSharedFolder && !file.shareToken;

    // Estado para controlar la visibilidad del modal de vista previa
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Función para manejar el clic en el archivo y mostrar la vista previa
    const handlePreviewClick = (e) => {
        e.stopPropagation();
        setShowPreviewModal(true);
    };

    return (
        <>
            <div className="relative group flex flex-col p-2 sm:p-4 border dark:border-[#494949] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1e1e1e]">
                <article
                    className="flex items-center mb-2 cursor-pointer"
                    onClick={handlePreviewClick}
                >
                    {getFileIcon(file.name)}
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {truncateFileName(
                                file.name,
                                window.innerWidth < 640 ? 15 : 25
                            )}
                        </h3>
                        <div className="flex items-center mt-0.5">
                            {file.shareToken && (
                                <UsersIcon
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 flex-shrink-0"
                                    title="Archivo compartido"
                                />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                        {/* Implementamos dayjs al subir archivos */}
                        <span className="text-xs mt-1 text-gray-500 ml-1">
                            {formatDate(file.uploadedAt)}
                        </span>
                    </div>
                </article>

                <div className="flex items-center justify-end space-x-0.5 sm:space-x-1 mt-1 sm:mt-2">
                    <button
                        onClick={handleDownload}
                        className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#323232] rounded-full transition-colors"
                        title="Descargar"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </button>
                    <button
                        onClick={handleOptionsClick}
                        className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#323232] rounded-full transition-colors relative"
                    >
                        <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </button>

                    {showOptions && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={closeOptions}
                            />
                            <nav className="absolute bottom-10 z-20 w-48 md:right-4 md:bottom-12 text-gray-700 dark:text-white dark:bg-[#1b1b1b] bg-white rounded-lg shadow-lg border border-gray-200 dark:border-none">
                                <button
                                    onClick={handleRename}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#323232]"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    <span>Renombrar</span>
                                </button>

                                {/* Mostrar "Compartir" o "Habilitar descarga" según el contexto */}
                                {showEnableDownload ? (
                                    <button
                                        onClick={handleEnableDownload}
                                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#323232] w-full text-left px-3 py-2 rounded-md"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                        Habilitar descarga
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#323232] w-full text-left px-3 py-2 rounded-md"
                                    >
                                        <ShareIcon className="h-4 w-4" />
                                        Compartir
                                    </button>
                                )}

                                <button
                                    onClick={handleDelete}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#323232]"
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    <span>Eliminar</span>
                                </button>
                            </nav>
                        </>
                    )}
                </div>
            </div>
            {/* Modales */}
            <RenameModal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                onSubmit={handleRenameSubmit}
                currentName={file.name}
                type="file"
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                type="file"
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => {
                    console.log('Cerrando modal');
                    setShowShareModal(false);
                    // Actualizar el almacenamiento cuando se cierra el modal
                    if (onRefetchStorage) {
                        onRefetchStorage();
                    }
                }}
                urls={shareUrls}
                type="file"
                title={file.name}
            />

            {/* Modal de vista previa de archivos */}
            <FilePreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                file={file}
            />
        </>
    );
};
