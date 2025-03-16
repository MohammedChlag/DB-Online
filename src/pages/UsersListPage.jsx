import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthHook } from '../hooks/useAuthHook';

// Imports de services
import { getAllUsersService } from '../services/fetchAdminApi.js';
import { toggleUserActiveService } from '../services/fetchAdminApi.js';
import { deleteUserService } from '../services/fetchAdminApi.js';

// Imports de iconos
import {
    ArrowPathIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

// Import de modal de borrado de usuarios
import { DeleteUserModal } from '../components/layout/Modals/DeleteUserModal';

// Import de ErrorBoundaries
import { Boundary } from '../services/ErrorBoundary.jsx';

// Función para la lista de usuarios
export const UsersListPage = () => {
    const navigate = useNavigate();
    const { token, isAdmin } = useAuthHook();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        username: '',
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openMenuId &&
                !menuRefs.current[openMenuId]?.contains(event.target)
            ) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsersService(token);
            setUsers(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setError(error.message);
            toast.error('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/storage');
            return;
        }
        loadUsers();
    }, [token, isAdmin, navigate]);

    const handleToggleActive = async (userId, currentActive) => {
        try {
            await toggleUserActiveService(userId, currentActive, token);
            await loadUsers(); // Recargar la lista de usuarios
            toast.success(
                `Usuario ${
                    currentActive ? 'deshabilitado' : 'habilitado'
                } correctamente`
            );
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
            toast.error('Error al cambiar el estado del usuario');
        }
        setOpenMenuId(null); // Cerrar el menú
    };

    const handleDeleteUser = async (userId, username) => {
        setDeleteModal({ isOpen: true, userId, username });
        setOpenMenuId(null); // Cerrar el menú
    };

    const confirmDelete = async () => {
        try {
            await deleteUserService(deleteModal.userId, token);
            await loadUsers(); // Recargar la lista de usuarios
            toast.success('Usuario eliminado correctamente');
            setDeleteModal({ isOpen: false, userId: null, username: '' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            toast.error('Error al eliminar el usuario');
        }
    };

    if (!isAdmin) return null;

    if (loading) {
        return (
            <main className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </main>
        );
    }

    if (error) {
        return (
            <section className="text-center text-red-500 p-4" role="alert">
                Error: {error}
            </section>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Usuarios
                </h1>
                <button
                    onClick={loadUsers}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors"
                    aria-label="Actualizar lista de usuarios"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-4 sm:gap-6">
                {users
                    .filter((user) => user.role !== 'admin')
                    .map((user) => (
                        <article
                            key={user.id}
                            className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-sm border border-gray-200 dark:border-[#494949] p-4 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <Boundary>
                                    <figure className="flex items-center space-x-3">
                                        {user.avatar ? (
                                            <img
                                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                                src={`/uploads/${user.id}/avatars/${user.avatar}`}
                                                alt={`Avatar de ${user.username}`}
                                            />
                                        ) : (
                                            <span
                                                className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg"
                                                aria-label="Avatar por defecto"
                                            >
                                                {user.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                        <figcaption className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </figcaption>
                                    </figure>
                                </Boundary>

                                <Boundary>
                                    <nav
                                        className="relative ml-2"
                                        ref={(el) =>
                                            (menuRefs.current[user.id] = el)
                                        }
                                    >
                                        <button
                                            className="p-1 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-[#323232]"
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === user.id
                                                        ? null
                                                        : user.id
                                                )
                                            }
                                            aria-label="Menú de opciones"
                                            aria-expanded={
                                                openMenuId === user.id
                                            }
                                        >
                                            <EllipsisVerticalIcon className="h-5 w-5" />
                                        </button>
                                        {openMenuId === user.id && (
                                            <menu className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#1b1b1b] ring-1 ring-black ring-opacity-5 z-50">
                                                <li className="py-1">
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#323232] "
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                user.id,
                                                                user.active
                                                            )
                                                        }
                                                    >
                                                        {user.active
                                                            ? 'Deshabilitar'
                                                            : 'Habilitar'}
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#323232]"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id,
                                                                user.username
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            </menu>
                                        )}
                                    </nav>
                                </Boundary>
                            </div>

                            <Boundary>
                                <div className="mt-auto pt-3 border-t border-gray-100">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.active
                                                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-200 dark:text-black'
                                                : 'bg-red-100 text-red-900'
                                        }`}
                                    >
                                        {user.active
                                            ? 'Habilitado'
                                            : 'Deshabilitado'}
                                    </span>
                                </div>
                            </Boundary>
                        </article>
                    ))}
            </section>

            <Boundary>
                <DeleteUserModal
                    isOpen={deleteModal.isOpen}
                    onClose={() =>
                        setDeleteModal({
                            isOpen: false,
                            userId: null,
                            username: '',
                        })
                    }
                    onConfirm={confirmDelete}
                    username={deleteModal.username}
                />
            </Boundary>
        </section>
    );
};
