import { useState } from 'react';
import { toast } from 'react-toastify';

// Imports de Hooks
import { useUserHook } from '../../hooks/useUserHook.js';
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Imports de componentes
import { Form } from './Form.jsx';
import { Input } from './Input.jsx';
import { Button } from '../layout/Button.jsx';

// Imports de ErrorBoundaries
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Import de formulario de Password
export const PasswordForm = () => {
    const { token } = useAuthHook();
    const { updatePassword, loading, error } = useUserHook(null, token);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        try {
            const result = await updatePassword(formData);
            if (result.success) {
                toast.success('Contraseña actualizada correctamente');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            } else {
                toast.error(
                    result.error || 'Error al actualizar la contraseña'
                );
            }
        } catch {
            toast.error('Error al actualizar la contraseña');
        }
    };

    return (
        <Boundary>
            <Form
                handleSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#2c2c2c] rounded-lg shadow-md w-full max-w-lg mx-auto text-center mt-6 border border-gray-200"
            >
                <h3 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
                    Cambiar Contraseña
                </h3>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <fieldset className="w-full space-y-4" disabled={loading}>
                    <legend className="sr-only">
                        Formulario de actualización de contraseña
                    </legend>
                    <Input
                        id="oldPassword"
                        label="Contraseña Actual"
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        handleChange={handleInputChange}
                        required
                    />
                    <Input
                        id="newPassword"
                        label="Nueva Contraseña"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        handleChange={handleInputChange}
                        required
                    />
                    <Input
                        id="confirmNewPassword"
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        handleChange={handleInputChange}
                        required
                    />
                </fieldset>
                <Button
                    type="submit"
                    className="w-full bg-[#009EB5] hover:bg-[#009ec3] text-white font-semibold py-3 rounded-md transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
            </Form>
        </Boundary>
    );
};
