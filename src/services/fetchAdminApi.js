const apiPath = import.meta.env.VITE_BACKEND_HOST;

export const getAllUsersService = async (token) => {
    const response = await fetch(`${apiPath}/users/list`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al obtener usuarios');
    }

    return responseData.data.users;
};

export const toggleUserActiveService = async (userId, currentActive, token) => {
    const response = await fetch(`${apiPath}/users/status/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !currentActive }), // Enviamos el opuesto del estado actual
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(
            responseData.message || 'Error al cambiar estado del usuario'
        );
    }

    return responseData.data.user;
};

export const deleteUserService = async (userId, token) => {
    const response = await fetch(`${apiPath}/admin/user/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Error al eliminar usuario');
    }

    return responseData;
};
