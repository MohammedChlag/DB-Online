import { useEffect, useState } from 'react';

// Import de services
import { getUserService } from '../services/fetchUserApi.js';
import { getOwnUserService } from '../services/fetchUserApi.js';
import { updateUserService } from '../services/fetchUserApi.js';
import { updateAvatarService } from '../services/fetchUserApi.js';
import { deleteAvatarService } from '../services/fetchUserApi.js';
import { updatePasswordService } from '../services/fetchUserApi.js';

export const useUserHook = (id, token, refreshCallback = null) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('=== useUserHook iniciado ===');
        console.log('Token recibido:', !!token);
        console.log('ID recibido:', id);

        let isSubscribed = true;

        const fetchUser = async () => {
            if (!token) {
                console.log('No hay token disponible');
                setError('Token no disponible');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = id
                    ? await getUserService(id)
                    : await getOwnUserService(token);

                console.log('Datos de usuario recibidos:', data);

                if (isSubscribed) {
                    setUser(data);
                    setError(null);
                }
            } catch (err) {
                console.error('Error en fetchUser:', err);
                if (isSubscribed) {
                    setError(err.message || 'Error fetching user');
                }
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            console.log('=== useUserHook limpiando ===');
            isSubscribed = false;
        };
    }, [id, token]);

    const updateUser = async (info) => {
        if (!token) {
            setError('Token no disponible');
            return { success: false, error: 'Token no disponible' };
        }

        try {
            setLoading(true);
            setError(null);

            console.log('updateUser - Iniciando actualización con:', info);

            // Primero actualizamos el usuario
            const message = await updateUserService(info, token);
            console.log('updateUser - Usuario actualizado:', message);
            const updatedUser = await getOwnUserService(token);

            // Actualizamos el estado con los datos actualizados
            setUser(updatedUser);

            // Refrescar el currentUser en el AuthContext si existe el callback
            if (refreshCallback && typeof refreshCallback === 'function') {
                try {
                    await refreshCallback();
                } catch (refreshError) {
                    console.error(
                        'Error al refrescar currentUser:',
                        refreshError
                    );
                }
            }

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('updateUser - Error:', error);
            setError(error.message || 'Error updating user');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const updateAvatar = async (file) => {
        if (!token) {
            console.log('No hay token disponible');
            setError('Token no disponible');
            return { success: false, error: 'Token no disponible' };
        }

        try {
            setLoading(true);
            setError(null);
            await updateAvatarService(file, token);

            // Obtener datos actualizados del usuario
            const updatedUser = await getOwnUserService(token);
            setUser(updatedUser);

            // Refrescar el currentUser en el AuthContext si existe el callback
            if (refreshCallback && typeof refreshCallback === 'function') {
                try {
                    await refreshCallback();
                } catch (refreshError) {
                    console.error(
                        'Error al refrescar currentUser:',
                        refreshError
                    );
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error en updateAvatar:', error);
            setError(error.message || 'Error updating avatar');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteAvatar = async () => {
        if (!token) {
            console.log('No hay token disponible');
            setError('Token no disponible');
            return { success: false, error: 'Token no disponible' };
        }

        try {
            setLoading(true);
            setError(null);
            await deleteAvatarService(token);

            // Obtener datos actualizados del usuario
            const updatedUser = await getOwnUserService(token);
            setUser(updatedUser);

            // Refrescar el currentUser en el AuthContext si existe el callback
            if (refreshCallback && typeof refreshCallback === 'function') {
                try {
                    await refreshCallback();
                } catch (refreshError) {
                    console.error(
                        'Error al refrescar currentUser:',
                        refreshError
                    );
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error en deleteAvatar:', error);
            setError(error.message || 'Error deleting avatar');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (passwords) => {
        if (!token) {
            setError('Token no disponible');
            return { success: false, error: 'Token no disponible' };
        }

        try {
            setLoading(true);
            setError(null);

            console.log('updatePassword - Iniciando actualización');
            await updatePasswordService(passwords, token);

            return { success: true };
        } catch (error) {
            console.error('updatePassword - Error:', error);
            setError(error.message || 'Error updating password');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        updateUser,
        updateAvatar,
        deleteAvatar,
        updatePassword,
        setError,
    };
};
