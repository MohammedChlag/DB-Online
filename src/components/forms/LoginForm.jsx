import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Imports de hooks
import { useFormHook } from '../../hooks/useFormHook.js';
import { useAuthHook } from '../../hooks/useAuthHook.js';

// Import de service
import { loginUserService } from '../../services/fetchUserApi.js';

// Imports de componentes
import { Form } from './Form.jsx';
import { Button } from '../layout/Button.jsx';
import { Input } from './Input.jsx';

import { loginUserSchema } from '../../schemas/users/loginUserSchema.js';

// Import de ErrorBoundaries
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Función de el formulario de Login
export const LoginForm = () => {
    const { info, errors, validate, handleChange } = useFormHook();
    const [loading, setLoading] = useState(false);
    const { onLogin } = useAuthHook();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const value = await validate(loginUserSchema);

            setLoading(true);
            const { token } = await loginUserService(value);
            await onLogin(token);

            toast('Bienvenido 👋🏻', {
                style: { background: '#009ec3', color: 'white' },
            });
            navigate('/storage');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Boundary>
            <Form
                className="flex flex-col gap-6 p-8 bg-white dark:bg-[#2c2c2c] rounded-xl shadow-lg w-full max-w-md mx-auto my-8 sm:my-16"
                handleSubmit={handleSubmit}
            >
                <header className="text-center space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Iniciar sesión
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white">
                        Bienvenido de nuevo a Hackloud
                    </p>
                </header>
                <fieldset className="space-y-4">
                    <Input
                        id="email"
                        label="Correo Electrónico"
                        type="email"
                        name="email"
                        value={info.email}
                        errors={errors}
                        handleChange={handleChange}
                    />
                    <Input
                        id="password"
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={info.password}
                        errors={errors}
                        handleChange={handleChange}
                    />
                </fieldset>
                <footer className="space-y-4">
                    <Button
                        type="submit"
                        className="w-full bg-[#009EB5] hover:bg-[#009ec3] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                    <section className="flex flex-col items-center gap-3 text-sm">
                        <p className="text-gray-600 dark:text-white">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to="/users/register"
                                className="text-[#009EB5] hover:text-[#009ec3] font-medium hover:underline"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                        <Link
                            to="/users/recovery-email"
                            className="text-[#009EB5] hover:text-[#009ec3] font-medium hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </section>
                </footer>
            </Form>
        </Boundary>
    );
};
