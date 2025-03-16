import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { resetPasswordService } from '../services/fetchUserApi.js';

// Imports de componentes
import { Input } from '../components/forms/Input.jsx';
import { Button } from '../components/layout/Button.jsx';

// Función para la página de recuperación de contraseña
export const RecoveryPassCodePage = () => {
    const [searchParams] = useSearchParams(); //Obtenemos el código de la URL
    const recoveryPassCode = searchParams.get('recoveryPassCode');

    const [formData, setFormData] = useState({
        //Se guarda la nueva contraseña en formData
        newPassword: '',
        confirmNewPassword: '',
    });

    const navigate = useNavigate();

    //Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('Las contraseñas no coinciden'); //validamos que las contraseñas coincidan
            return;
        }
        try {
            const success = await resetPasswordService(
                //cambiamos la contraseña
                recoveryPassCode,
                formData.newPassword
            );

            if (success) {
                setTimeout(() => {
                    toast.success('Contraseña cambiada con éxito');
                    navigate('/users/login');
                }, 2000);
            } else {
                toast.error('Error al cambiar la contraseña');
            }
        } catch (error) {
            toast.error(
                error.message || 'Hubo un error al procesar la solicitud'
            );
        }
    };

    return (
        <form
            className="flex flex-col gap-6 p-8 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg w-full max-w-md mx-auto my-8 sm:my-16 border border-cyan-300 "
            onSubmit={handleSubmit}
        >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Restablecer Contraseña
            </h3>
            <Input
                label="Nueva contraseña"
                type="password"
                placeholder="Nueva contraseña"
                name="newPassword"
                value={formData.newPassword}
                handleChange={handleChange}
                required
            />
            <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="Confirmar nueva contraseña"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                handleChange={handleChange}
                required
            />
            <Button
                type="submit"
                className="w-full bg-[#00B4D8] hover:bg-[#0096B4] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                Cambiar Contraseña
            </Button>
        </form>
    );
};
