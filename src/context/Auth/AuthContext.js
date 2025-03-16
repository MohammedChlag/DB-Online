import { createContext } from 'react';

export const AuthContext = createContext({
    token: null,
    currentUser: null,
    isAdmin: false,
    onLogin: () => undefined,
    onLogout: () => undefined,
    refreshCurrentUser: () => undefined,
});
