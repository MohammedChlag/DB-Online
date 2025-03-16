const apiPath = import.meta.env.VITE_BACKEND_HOST;

export const getUserByIdService = async (userId) => {
    try {
        if (!userId) {
            throw new Error('ID de usuario no proporcionado');
        }

        const response = await fetch(`${apiPath}/users/${userId}`);
        const responseData = await response.json();

        const { status, data } = responseData;

        // Verificar si el status es "ok" o "Ok" (aceptar ambos)
        if (!response.ok || (status !== 'ok' && status !== 'Ok')) {
            throw new Error(
                responseData.message ||
                    'Error al obtener la información del usuario'
            );
        }

        if (data && data.avatar && !data.avatar.startsWith('http')) {
            // La ruta correcta es /uploads/userId/avatars/avatarName
            data.avatarUrl = `${apiPath}/uploads/${data.id}/avatars/${data.avatar}`;
        } else if (data && data.avatar) {
            data.avatarUrl = data.avatar;
        }

        return {
            user: data, // Devolver los datos del usuario
        };
    } catch (error) {
        console.error('Error en getUserByIdService:', error);
        throw error;
    }
};

export const getOwnUserService = async (token) => {
    const response = await fetch(`${apiPath}/users/own`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { message, data } = await response.json();

    if (!response.ok) throw new Error(message || 'Error getting user');

    return data.user;
};

export const getUserService = async (userId) => {
    const response = await fetch(`${apiPath}/users/${userId}`);

    const { message, data } = await response.json();

    if (!response.ok) {
        throw new Error(message);
    }

    return data.user;
};

export const registerUserService = async (value) => {
    // Formatear la fecha antes de enviar
    const formattedData = {
        ...value,
        birthday:
            value.birthday instanceof Date
                ? value.birthday.toISOString().split('T')[0]
                : typeof value.birthday === 'string'
                ? value.birthday.split('T')[0]
                : value.birthday,
    };

    const response = await fetch(`${apiPath}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
    });

    const { message } = await response.json();

    if (!response.ok) {
        throw new Error(message);
    }

    return message;
};

export const loginUserService = async (value) => {
    const response = await fetch(`${apiPath}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    });

    const { message, data } = await response.json();

    if (!response.ok) {
        throw new Error(message);
    }

    return { message, token: data.token };
};

// Service que envia el email del usuario al backend
export const recoveryPasswordService = async (email) => {
    //Envia codigo al correo del usuario
    try {
        const response = await fetch(`${apiPath}/users/password/recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo enviar el código');
        }
        return true; //Èxito
    } catch (error) {
        console.error('Error en recoveryPasswordService:', error);
        return false; //falló
    }
};

export const resetPasswordService = async (recoveryPassCode, newPassword) => {
    //Usa el código para cambiar contraseña

    const response = await fetch(`${apiPath}/users/password/recover`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recoveryPassCode, newPassword }),
    });
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(
            responseData.message || 'No se pudo restablecer la contraseña'
        );
    }
    return true; // Éxito
};

export const updateAvatarService = async (file, token) => {
    if (!file) {
        throw new Error('Debes enviar un archivo.');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${apiPath}/users/avatar`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const { message } = await response.json();

    if (!response.ok) {
        throw new Error(message || 'Error al actualizar el avatar');
    }

    return message;
};

export const deleteAvatarService = async (token) => {
    const response = await fetch(`${apiPath}/users/avatar`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { message } = await response.json();

    if (!response.ok) throw new Error(message);

    return message;
};

export const updateUserService = async (info, token) => {
    const response = await fetch(`${apiPath}/users/own`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(info),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message);
    }

    return responseData.data.user;
};

export const updatePasswordService = async (passwords, token) => {
    const response = await fetch(`${apiPath}/users/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            confirmNewPassword: passwords.confirmNewPassword,
        }),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message);
    }

    return responseData;
};
