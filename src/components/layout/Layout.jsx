import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Imports de componentes
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

// Import de ErrorBoundaries
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Función para definir nuestro Layout
export const Layout = () => {
    const location = useLocation();

    // Determinar si estamos en una ruta privada
    const isPrivateRoute = ['/storage', '/profile', '/admin/users'].some(
        (route) => location.pathname.startsWith(route)
    );

    // Determinar las clases CSS para el main según la ruta
    const mainClasses = isPrivateRoute
        ? location.pathname.startsWith('/storage')
            ? 'flex-1 relative w-full max-w-screen-xl mx-auto px-0 lg:px-4 py-6' // Rutas con Sidebar
            : 'flex-1 relative w-full max-w-screen-lg mx-auto px-2 sm:px-4 py-6' // Otras rutas privadas
        : '';

    return (
        <>
            <Header />
            <Boundary>
                <main className={mainClasses}>
                    <Outlet />
                </main>
            </Boundary>
            <Footer />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};
