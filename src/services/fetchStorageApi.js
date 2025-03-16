const apiPath = import.meta.env.VITE_BACKEND_HOST;

export const getStorageService = async (token) => {
    try {
        const response = await fetch(`${apiPath}/storage`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Error getting storage');
        }

        return responseData.data;
    } catch (error) {
        console.error('Error en getStorageService:', error);
        throw error;
    }
};

export const uploadFileService = async (file, token, folderName = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderName) formData.append('folderName', folderName);

    const response = await fetch(`${apiPath}/uploads/files`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const { message, data } = await response.json();

    if (!response.ok) {
        throw new Error(message || 'Error uploading file');
    }

    return data;
};

export const deleteStorageItemService = async (id, type, token) => {
    const endpoint =
        type === 'file' ? `/uploads/files/${id}` : `/storage/folder/${id}`;

    const response = await fetch(`${apiPath}${endpoint}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { message, data } = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el elemento');
    }

    return message || 'Elemento eliminado correctamente';
};

export const createFolderService = async (folderName, token) => {
    const response = await fetch(`${apiPath}/storage/folder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderName }),
    });

    const { message, data } = await response.json();

    if (!response.ok) {
        throw new Error(message || 'Error al crear la carpeta');
    }

    return data;
};

export const renameStorageItemService = async (id, newName, token) => {
    try {
        const response = await fetch(`${apiPath}/storage/rename/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al renombrar el elemento');
        }
        const { message } = await response.json();

        return message;
    } catch (error) {
        console.error('Error en renameStorageItem:', error);
        throw error;
    }
};

export const searchStorageService = async ({ query, token }) => {
    if (!token) throw new Error('Token inválido');

    try {
        const response = await fetch(
            `${apiPath}/storage/search?name=${encodeURIComponent(query)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en searchStorage:', error);
        throw error;
    }
};

export const sortStorageService = async ({
    token,
    orderBy,
    orderDirection,
}) => {
    if (!token) throw new Error('Token inválido');

    try {
        let url = `${apiPath}/storage/search?orderBy=${orderBy}&orderDirection=${orderDirection}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al ordenar los elementos');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en sortStorage:', error);
        throw error;
    }
};

export const downloadFileService = async (id, token) => {
    const response = await fetch(`${apiPath}/download/files/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al descargar el archivo');
    }

    // Convertir la respuesta a blob
    const blob = await response.blob();

    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);

    // Crear enlace temporal
    const link = document.createElement('a');
    link.href = url;

    // Obtener nombre del archivo del header si existe
    const contentDisposition = response.headers.get('content-disposition');
    const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
        : 'archivo';

    link.setAttribute('download', fileName);

    // Simular clic y limpiar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return 'Archivo descargado correctamente';
};

export const shareStorageItemService = async (id, token) => {
    try {
        const response = await fetch(`${apiPath}/storage/share/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al compartir el elemento');
        }

        // Verificar que la respuesta tenga el formato esperado
        if (data.status !== 'ok') {
            throw new Error('No se pudo compartir el archivo');
        }

        // Devolver un objeto consistente con las URLs disponibles
        return {
            status: data.status,
            url: data.url || null,
            download: data.download || null,
        };
    } catch (error) {
        console.error('Error en shareStorageItemService:', error);
        throw error;
    }
};

export const getSharedLinkService = async (shareToken) => {
    try {
        const response = await fetch(
            `${apiPath}/storage/share/link/${shareToken}`
        );

        const responseData = await response.json();

        if (!response.ok) {
            const { message } = responseData;
            throw new Error(message);
        }

        // Devolver la respuesta completa en lugar de solo data
        return responseData;
    } catch (error) {
        console.error('Error en getSharedLinkService:', error);
        throw error;
    }
};

export const downloadSharedFileService = async (shareToken) => {
    try {
        const response = await fetch(
            `${apiPath}/storage/share/download/${shareToken}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || 'Error al descargar el archivo compartido'
            );
        }

        // Convertir la respuesta a blob
        const blob = await response.blob();

        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);

        // Crear enlace temporal
        const link = document.createElement('a');
        link.href = url;

        // Obtener nombre del archivo del header si existe
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
            : 'archivo_compartido';

        link.setAttribute('download', fileName);

        // Simular clic y limpiar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return 'Archivo compartido descargado correctamente';
    } catch (error) {
        console.error('Error en downloadSharedFileService:', error);
        throw error;
    }
};

export const getFilePreviewService = async (id, token, file) => {
    try {
        console.log(`Solicitando vista previa para archivo ID: ${id}`);
        const response = await fetch(`${apiPath}/files/${id}/preview`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            let errorMsg = 'Error al obtener la vista previa';
            try {
                const error = await response.json();
                errorMsg = error.message || errorMsg;
            } catch (e) {
                console.error('Error al parsear respuesta de error:', e);
            }
            throw new Error(errorMsg);
        }

        // Obtener el tipo de contenido
        const contentType = response.headers.get('content-type');

        // Si es una imagen, devolver la URL del blob
        if (contentType && contentType.startsWith('image/')) {
            const blob = await response.blob();
            return {
                type: 'image',
                content: URL.createObjectURL(blob),
                contentType,
            };
        }

        // Si es un PDF
        else if (contentType && contentType === 'application/pdf') {
            console.log('Procesando PDF...');
            const blob = await response.blob();
            // Creamos un objeto URL con tipo específico para PDFs
            const objectUrl = URL.createObjectURL(blob);
            return {
                type: 'pdf',
                content: objectUrl,
                contentType,
                filename: file?.name || 'documento.pdf',
            };
        }

        // Si es un video
        else if (contentType && contentType.startsWith('video/')) {
            const blob = await response.blob();
            return {
                type: 'video',
                content: URL.createObjectURL(blob),
                contentType,
            };
        }

        // Si es texto (incluye html, css, js, json, etc)
        else if (
            contentType &&
            (contentType.startsWith('text/') ||
                contentType === 'application/json' ||
                contentType === 'application/javascript' ||
                contentType === 'application/xml')
        ) {
            const text = await response.text();
            return {
                type: 'text',
                content: text,
                contentType,
            };
        }

        // Para otros tipos de archivo, solo devolver información
        else {
            console.log('Tipo de archivo no soportado:', contentType);
            return {
                type: 'unsupported',
                contentType: contentType || 'desconocido',
                message:
                    'Este tipo de archivo no tiene vista previa disponible',
            };
        }
    } catch (error) {
        console.error('Error en getFilePreviewService:', error);
        throw error;
    }
};
