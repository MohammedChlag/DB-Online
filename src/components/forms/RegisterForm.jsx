import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import de Hook
import { useFormHook } from '../../hooks/useFormHook.js';

// Imports de componentes
import { Form } from './Form.jsx';
import { Input } from './Input.jsx';
import { Button } from '../layout/Button.jsx';

// Import de service
import { registerUserService } from '../../services/fetchUserApi.js';
import { registerUserSchema } from '../../schemas/users/registerUserShema.js';
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Función de formulario de registro
export const RegisterForm = () => {
    const { info, errors, validate, handleChange } = useFormHook();
    const [loading, setLoading] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const value = await validate(registerUserSchema);

            const message = await registerUserService(value);

            toast.success(message);
            toast.info('Verifica tú email');
            navigate(`/users/login`);
        } catch (error) {
            toast.error(error.message || 'Error al registrar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const openTermsModal = (e) => {
        e.preventDefault();
        setShowTermsModal(true);
    };

    const closeTermsModal = () => {
        setShowTermsModal(false);
    };

    return (
        <>
            <Form
                className="flex flex-col gap-6 p-8 bg-white dark:bg-[#2c2c2c] rounded-xl shadow-lg w-full max-w-md mx-auto my-8 sm:my-16"
                handleSubmit={handleSubmit}
            >
                <header className="text-center space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Crear cuenta
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white">
                        Únete a Hackloud hoy mismo
                    </p>
                </header>

                <Boundary>
                    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                        <Input
                            id="firstName"
                            label="Nombre"
                            type="text"
                            name="firstName"
                            value={info.firstName}
                            errors={errors}
                            handleChange={handleChange}
                        />
                        <Input
                            id="lastName"
                            label="Apellido"
                            type="text"
                            name="lastName"
                            value={info.lastName}
                            errors={errors}
                            handleChange={handleChange}
                        />
                    </fieldset>
                </Boundary>

                <Boundary>
                    <fieldset className="space-y-4">
                        <Input
                            id="username"
                            label="Nombre de usuario"
                            type="text"
                            name="username"
                            value={info.username}
                            errors={errors}
                            handleChange={handleChange}
                        />
                        <Input
                            id="birthday"
                            label="Fecha de nacimiento"
                            type="date"
                            name="birthday"
                            value={info.birthday}
                            errors={errors}
                            handleChange={handleChange}
                        />
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
                        <Input
                            id="terms"
                            type="checkbox"
                            name="terms"
                            label={
                                <>
                                    Aceptar{' '}
                                    <a
                                        href="#"
                                        className="text-[#00B4D8] hover:text-[#0096B4] hover:underline"
                                        onClick={openTermsModal}
                                    >
                                        condiciones
                                    </a>
                                </>
                            }
                            checked={info.terms}
                            errors={errors}
                            handleChange={handleChange}
                        />
                    </fieldset>
                </Boundary>
                <Boundary>
                    <footer className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-[#009EB5] hover:bg-[#009ec3] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </Button>

                        <p className="text-center text-sm text-gray-600 dark:text-white">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/users/login"
                                className="text-[#009EB5] hover:text-[#009ec3] font-medium hover:underline"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </footer>
                </Boundary>
            </Form>

            {/* Modal de Términos y Condiciones */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <article className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <header className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Términos y Condiciones
                            </h3>
                            <button
                                onClick={closeTermsModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </header>
                        <main className="prose prose-sm max-w-none text-gray-600">
                            <h4>1. Aceptación de los Términos</h4>
                            <p>
                                Al registrarte y utilizar nuestros servicios,
                                aceptas cumplir con estos términos y
                                condiciones.
                            </p>

                            <h4>2. Uso del Servicio</h4>
                            <p>
                                Nuestro servicio de almacenamiento en la nube te
                                permite guardar, acceder y compartir archivos de
                                forma segura.
                            </p>

                            <h4>3. Privacidad y Seguridad</h4>
                            <p>
                                Nos comprometemos a proteger tu información
                                personal y tus archivos con las más altas
                                medidas de seguridad y encriptación.
                            </p>

                            <h4>4. Responsabilidades del Usuario</h4>
                            <p>
                                Eres responsable de mantener la confidencialidad
                                de tu cuenta y de todos los archivos que subas a
                                nuestra plataforma.
                            </p>

                            <h4>5. Limitaciones del Servicio</h4>
                            <p>
                                Aunque ofrecemos un servicio confiable, no
                                podemos garantizar que esté libre de errores o
                                interrupciones.
                            </p>
                        </main>
                        <footer className="mt-6 flex justify-end">
                            <button
                                onClick={closeTermsModal}
                                className="px-4 py-2 bg-[#00B4D8] text-white rounded-md hover:bg-[#0096B4] transition-colors"
                            >
                                Aceptar
                            </button>
                        </footer>
                    </article>
                </div>
            )}
        </>
    );
};
