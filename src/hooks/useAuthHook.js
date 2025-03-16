import { useContext } from 'react';
import { AuthContext } from '../context/Auth/AuthContext.js';

export const useAuthHook = () => {
    const { token, currentUser, isAdmin, onLogin, onLogout } =
        useContext(AuthContext);
    return { token, currentUser, isAdmin, onLogin, onLogout };
};
