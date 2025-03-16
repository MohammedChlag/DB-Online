// iconos
import {
    FolderIcon,
    PencilIcon,
    ShareIcon,
    TrashIcon,
    EllipsisVerticalIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
// hook y estado
import { useItemsHook } from '../../hooks/useItemsHook.js';
// modales algún día serán uno...
import { RenameModal } from '../layout/Modals/RenameModal.jsx';
import { DeleteConfirmModal } from '../layout/Modals/DeleteConfirmModal.jsx';
import { ShareModal } from '../layout/Modals/ShareModal.jsx';
import { formatDate } from '../../utils/dayJs.js';

// Esta te la sabes?
const truncateFolderName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + '...';
};

// Componenente carpeta recibe funciones y se maneja con el hook
export const Carpeta = ({
    folder,
    onFolderClick,
    onRename,
    onDelete,
    onRefetchStorage,
}) => {
    // maravilla de customHook
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
    } = useItemsHook(folder, 'folder', { onDelete, onRefetchStorage });

    const handleRenameSubmit = async (newName) => {
        await onRename(folder.id, newName);
        setShowRenameModal(false);
    };

    const handleFolderClick = (e) => {
        if (e.target.closest('.folder-options')) {
            return;
        }
        onFolderClick(folder.id);
    };

    return (
        <>
            <div
                onClick={handleFolderClick}
                className="relative flex items-center p-3 border dark:border-[#494949] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e1e1e] group"
            >
                <article className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 mr-2">
                        {folder.shareToken ? (
                            <div className="relative">
                                <FolderIcon className="h-8 w-8 text-blue-500" />
                                <UsersIcon className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 bg-white dark:bg-[#2c2c2c] rounded-full" />
                            </div>
                        ) : (
                            <FolderIcon className="h-8 w-8 text-blue-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {truncateFolderName(folder.name)}
                        </p>
                        {/* Implementamos dayjs al crear carpetas */}
                        <p className="text-xs text-gray-500">
                            {formatDate(folder.createdAt)}
                        </p>
                    </div>
                </article>

                <nav className="folder-options relative ml-2">
                    <button
                        onClick={handleOptionsClick}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#323232]"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500 " />
                    </button>

                    {showOptions && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={closeOptions}
                            ></div>
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-[#1b1b1b] rounded-md shadow-lg z-20 py-1">
                                <button
                                    onClick={handleRename}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-[#323232]"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    <span>Renombrar</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#323232] w-full text-left px-3 py-2 rounded-md"
                                >
                                    <ShareIcon className="h-4 w-4" />
                                    Compartir
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#323232]"
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </>
                    )}
                </nav>
            </div>
            {/* Modales */}
            <RenameModal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                onSubmit={handleRenameSubmit}
                currentName={folder.name}
                type="folder"
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                type="folder"
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => {
                    setShowShareModal(false);
                    // Actualizar el almacenamiento cuando se cierra el modal
                    if (onRefetchStorage) {
                        onRefetchStorage();
                    }
                }}
                urls={shareUrls}
                type="folder"
                title={folder.name}
            />
        </>
    );
};
