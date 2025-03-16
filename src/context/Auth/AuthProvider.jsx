import React, { useEffect, useState } from 'react';

import { AuthContext } from './AuthContext.js';

import { getFromLocalStorage, setToLocalStorage } from '../../utils/helpers.js';

import { getOwnUserService } from '../../services/fetchUserApi.js';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getFromLocalStorage('DDToken') || null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const user = await getOwnUserService(token);
                    setCurrentUser(user);
                    setIsAdmin(user.role === 'admin');
                } catch (error) {
                    console.error(error);
                    localStorage.removeItem('DDToken');
                    setToken(null);
                    setCurrentUser(null);
                    setIsAdmin(false);
                }
            }
        };
        loadUser();
    }, [token]);

    const onLogin = async (token) => {
        try {
            setToken(token);
            setToLocalStorage('DDToken', token);
            const user = await getOwnUserService(token);
            setCurrentUser(user);
            setIsAdmin(user.role === 'admin');
        } catch (error) {
            localStorage.removeItem('DDToken');
            setToken(null);
            setCurrentUser(null);
            setIsAdmin(false);
            throw error;
        }
    };

    const onLogout = () => {
        localStorage.removeItem('DDToken');
        setToken(null);
        setCurrentUser(null);
        setIsAdmin(false);
    };

    // Método para refrescar el currentUser desde el servidor
    const refreshCurrentUser = async () => {
        if (token) {
            try {
                console.log('Refrescando currentUser en AuthContext');
                console.log('Token actual:', token.substring(0, 10) + '...');
                console.log('currentUser antes de refrescar:', currentUser);

                const user = await getOwnUserService(token);
                console.log('Datos de usuario obtenidos:', user);

                // Forzar un nuevo objeto para asegurar que React detecte el cambio
                setCurrentUser({ ...user });
                setIsAdmin(user.role === 'admin');

                console.log('currentUser después de refrescar:', user);
                return true;
            } catch (error) {
                console.error('Error al refrescar currentUser:', error);
                return false;
            }
        }
        console.log('No hay token para refrescar currentUser');
        return false;
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                currentUser,
                isAdmin,
                onLogin,
                onLogout,
                refreshCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
