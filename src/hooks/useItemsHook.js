import { useState } from 'react';
import { toast } from 'react-toastify';

import { useAuthHook } from './useAuthHook.js';

// Imports de services
import { downloadFileService } from '../services/fetchStorageApi.js';
import { shareStorageItemService } from '../services/fetchStorageApi.js';

// customHook para interaciones con folders o files
// recibe por params el items en cuestión, el type(por defecto, file) y dos callbacks
export const useItemsHook = (
    item,
    type = 'file',
    { onDelete, onRefetchStorage } = {}
) => {
    /* Estados internos */
    // token
    const { token } = useAuthHook();
    // estado para setear las opciones
    const [showOptions, setShowOptions] = useState(false);
    // estados para manejar los modales
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // estado para las urls a la hora de compartir
    const [shareUrls, setShareUrls] = useState(null);

    // handle para alternar las opciones
    const handleOptionsClick = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setShowOptions(!showOptions);
    };

    // arrow para cerrar el menu opciones
    const closeOptions = () => {
        setShowOptions(false);
    };

    // handle para abrir el modal de renombrado
    const handleRename = () => {
        setShowRenameModal(true);
        closeOptions();
    };

    // este es es el más complejo
    const handleShare = async () => {
        try {
            console.log(`Compartiendo ${type}: ${item.name} (ID: ${item.id})`);

            // Resetear el estado de URLs antes de la nueva solicitud
            setShareUrls(null);

            // Abrir el modal primero para mostrar el estado de carga
            setShowShareModal(true);
            closeOptions();

            // Llamar al servicio para compartir
            const response = await shareStorageItemService(item.id, token);

            console.log('Respuesta del servicio de compartir:', response);

            // Actualizar el estado con las URLs recibidas
            setShareUrls(response);

            // No actualizamos el almacenamiento aquí para evitar que se cierre el modal
            // La actualización se hará cuando el usuario cierre el modal
        } catch (error) {
            console.error('Error al compartir:', error);
            toast.error(
                error.message ||
                    `Error al compartir ${
                        type === 'file' ? 'el archivo' : 'la carpeta'
                    }`
            );

            // Cerrar el modal en caso de error
            setShowShareModal(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
        closeOptions();
    };

    const handleDeleteConfirm = async () => {
        try {
            await onDelete(item.id, type);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error(error.message || 'Error al eliminar el elemento');
        }
    };

    const handleDownload = async () => {
        if (type === 'file') {
            try {
                const message = await downloadFileService(item.id, token);
                closeOptions();
                toast.success(message);
            } catch (error) {
                toast.error(error.message || 'Error al descargar el archivo');
            }
        }
    };

    const handleCloseShareModal = () => {
        setShowShareModal(false);
        if (onRefetchStorage) {
            console.log('Actualizando almacenamiento después de compartir');
            onRefetchStorage();
        }
    };

    return {
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
        handleCloseShareModal,
    };
};
