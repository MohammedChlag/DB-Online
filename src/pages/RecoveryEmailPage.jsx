import { useState } from 'react';
import { toast } from 'react-toastify';

// Import de service de recuperación de contraseña
import { recoveryPasswordService } from '../services/fetchUserApi.js';

// Imports de componentes
import { Input } from '../components/forms/Input.jsx';
import { Button } from '../components/layout/Button.jsx';
import { Form } from '../components/forms/Form.jsx';

// Función de página de email de recuperación
export const RecoveryEmailPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await recoveryPasswordService(email); //se llama al service para enviar código al correo

        if (success) {
            toast.success('Código enviado, Revisa tu email');
            setEmail('');
        } else {
            toast.error('Error al enviar código de recuperación');
        }
    };

    return (
        <Form
            className="flex flex-col gap-6 p-8 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg w-full max-w-md mx-auto my-8 sm:my-16"
            handleSubmit={handleSubmit}
        >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Recuperar Contraseña
            </h3>
            <Input
                label="Correo Electrónico"
                type="email"
                name="email"
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                required
            />

            <Button
                type="submit"
                className="w-full bg-[#00B4D8] hover:bg-[#0096B4] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                Enviar Codigo
            </Button>
        </Form>
    );
};
