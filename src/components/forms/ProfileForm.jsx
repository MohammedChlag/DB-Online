import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

// Imports de Hooks
import { useUserHook } from '../../hooks/useUserHook.js';
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Imports de componentes
import { Form } from './Form.jsx';
import { Input } from './Input.jsx';
import { Button } from '../layout/Button.jsx';

// Imports de Iconos
import {
    UserCircleIcon,
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/solid';

// Import de ErrorBoundaries
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Import de componente modal
import { DeleteConfirmModal } from '../layout/Modals/DeleteConfirmModal.jsx';

// Función de formulario de Perfil
export const ProfileForm = () => {
    const { token, refreshCurrentUser } = useAuthHook();
    const fileInputRef = useRef(null);
    const {
        user,
        loading,
        error,
        updateUser,
        updateAvatar,
        deleteAvatar,
        setError,
    } = useUserHook(null, token, refreshCurrentUser); // Pasamos refreshCurrentUser como tercer parámetro
    const [isEditing, setIsEditing] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        if (isEditing) {
            setFormData({
                username: user?.username || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
            });
        }
        setIsEditing(!isEditing);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        console.log('Archivo seleccionado:', file.name);
        try {
            const result = await updateAvatar(file);
            if (result) {
                setAvatarError(false);
                toast.success('Avatar actualizado correctamente');

                // Esperar un momento para que el toast sea visible y luego recargar la página
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            toast.error('Error al actualizar el avatar');
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteAvatar = async () => {
        try {
            const result = await deleteAvatar();
            if (result.success) {
                setAvatarError(false);
                toast.warn('Avatar eliminado correctamente');

                // Esperar un momento para que el toast sea visible y luego recargar la página
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(result.error || 'Error al eliminar el avatar');
            }
        } catch (error) {
            toast.error(error.message || 'Error al eliminar el avatar');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto

        if (!isEditing) {
            return;
        }

        try {
            const result = await updateUser({
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            });

            if (result.success) {
                if (result.user) {
                    setFormData({
                        username: result.user.username || '',
                        firstName: result.user.firstName || '',
                        lastName: result.user.lastName || '',
                        email: result.user.email || '',
                    });
                }

                setIsEditing(false);
                toast.success('Perfil actualizado correctamente');
            } else {
                toast.error(result.error || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error en submit:', error);
            toast.error('Error al actualizar el perfil');
        }
    };

    // Construir la URL del avatar
    const avatarUrl =
        !avatarError && user?.avatar
            ? `/uploads/${user.id}/avatars/${user.avatar}`
            : null;

    return (
        <Boundary>
            <Form
                handleSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#2c2c2c] rounded-lg shadow-md w-full max-w-lg mx-auto text-center mt-6 border border-gray-200"
            >
                <header>
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
                        {user?.username}
                    </h1>
                </header>
                <section
                    className="flex flex-col items-center mb-6"
                    aria-label="Gestión de avatar"
                >
                    <figure className="relative group">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleAvatarChange}
                            accept="image/*"
                            aria-label="Seleccionar nuevo avatar"
                        />
                        {avatarUrl ? (
                            <div className="relative">
                                <img
                                    src={avatarUrl}
                                    alt={`Avatar de ${user?.username}`}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:ring-2 hover:ring-blue-500"
                                    onClick={handleAvatarClick}
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.png';
                                        setAvatarError(true);
                                    }}
                                />
                                <nav
                                    className="absolute -bottom-2 right-0 flex gap-2"
                                    aria-label="Opciones de avatar"
                                >
                                    <Button
                                        type="button"
                                        handleClick={handleAvatarClick}
                                        className="bg-[#009EB5] hover:bg-[#009ec3] text-white p-2 rounded-full shadow-md"
                                        title="Cambiar avatar"
                                        aria-label="Cambiar avatar"
                                    >
                                        <PencilIcon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                    {!avatarError && (
                                        <Button
                                            type="button"
                                            handleClick={handleDeleteClick}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
                                            title="Eliminar avatar"
                                            aria-label="Eliminar avatar"
                                        >
                                            <TrashIcon
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        </Button>
                                    )}
                                </nav>
                            </div>
                        ) : (
                            <div className="relative">
                                <UserCircleIcon
                                    className="w-28 h-28 text-gray-400 cursor-pointer border-4 border-white rounded-full shadow-lg hover:ring-2 hover:ring-blue-500"
                                    onClick={handleAvatarClick}
                                    aria-label="Avatar por defecto"
                                />
                                <Button
                                    type="button"
                                    handleClick={handleAvatarClick}
                                    className="absolute -bottom-2 right-0 bg-[#009EB5] hover:bg-[#009ec3] text-white p-2 rounded-full shadow-md"
                                    title="Añadir avatar"
                                    aria-label="Añadir avatar"
                                >
                                    <PencilIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        )}
                    </figure>
                </section>
                {error && (
                    <p role="alert" className="text-red-500 text-sm mb-2">
                        {error}
                    </p>
                )}
                <fieldset className="w-full space-y-4" disabled={!isEditing}>
                    <legend className="sr-only">Información del perfil</legend>
                    <Input
                        id="username"
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        handleChange={handleInputChange}
                        disabled={!isEditing}
                        errors={error}
                        required
                        aria-required="true"
                    />
                    <Input
                        id="firstName"
                        label="Nombre"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        handleChange={handleInputChange}
                        disabled={!isEditing}
                        errors={error}
                    />
                    <Input
                        id="lastName"
                        label="Apellido"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        handleChange={handleInputChange}
                        disabled={!isEditing}
                        errors={error}
                    />
                    <Input
                        id="email"
                        label="Correo Electrónico"
                        type="email"
                        name="email"
                        value={formData.email}
                        handleChange={handleInputChange}
                        disabled={!isEditing}
                        errors={error}
                        required
                        aria-required="true"
                    />
                </fieldset>
                <footer className="flex gap-2 w-full mt-6">
                    <Button
                        type="button"
                        handleClick={handleEdit}
                        className="flex-1 bg-[#009EB5] hover:bg-[#009ec3] text-white font-semibold py-3 rounded-md transition-colors"
                        aria-label={
                            isEditing
                                ? 'Cancelar edición'
                                : 'Editar información'
                        }
                    >
                        {isEditing ? 'Cancelar' : 'Editar Información'}
                    </Button>
                    {isEditing && (
                        <Button
                            type="submit"
                            className="flex-1 bg-[#009EB5] hover:bg-[#009ec3] text-white font-semibold py-3 rounded-md transition-colors"
                            disabled={loading}
                            aria-label={
                                loading
                                    ? 'Guardando cambios'
                                    : 'Guardar cambios'
                            }
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    )}
                </footer>

                {/* Modal de confirmación para eliminar avatar */}
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        setShowDeleteModal(false);
                        handleDeleteAvatar();
                    }}
                    type="avatar"
                />
            </Form>
        </Boundary>
    );
};
