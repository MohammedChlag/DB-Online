import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import de ErrorBoundaries
import { Boundary } from '../services/ErrorBoundary.jsx';

// Función para la página de validación
export const ValidationPage = () => {
    const { registrationCode } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const apiPath = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        const userActivation = async () => {
            try {
                const response = await fetch(
                    `${apiPath}/users/activate/${registrationCode}`,
                    { method: 'PUT' }
                );
                const result = await response.json();

                if (response.ok) {
                    setStatus('success');
                    toast.success('¡Cuenta validada correctamente!', {
                        onClose: () => {
                            navigate('/users/login', {
                                state: {
                                    message: result.message,
                                    type: 'success',
                                },
                            });
                        },
                    });
                } else {
                    setStatus('error');
                    toast.error(
                        result.message || 'Error al validar la cuenta',
                        {
                            onClose: () => {
                                navigate('/users/login', {
                                    state: {
                                        message: result.message,
                                        type: 'error',
                                    },
                                });
                            },
                        }
                    );
                }
            } catch (error) {
                setStatus('error');
                toast.error('Error de conexión. Inténtalo más tarde.', {
                    onClose: () => {
                        navigate('/users/login', {
                            state: {
                                message: 'Error de conexión',
                                type: 'error',
                            },
                        });
                    },
                });
            }
        };

        userActivation();
    }, [registrationCode, navigate, apiPath]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Boundary>
                <div className="text-center p-8 max-w-md mx-auto">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <div className="animate-spin h-12 w-12 mx-auto border-4 border-cyan-300 border-t-transparent rounded-full"></div>
                            <p className="text-gray-600">
                                Validando tu cuenta...
                            </p>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="text-green-500 text-6xl">✓</div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                ¡Cuenta validada!
                            </h2>
                            <p className="text-gray-600">
                                Redirigiendo al inicio de sesión...
                            </p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="text-red-500 text-6xl">✗</div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Error de validación
                            </h2>
                            <p className="text-gray-600">
                                Redirigiendo al inicio de sesión...
                            </p>
                        </div>
                    )}
                </div>
            </Boundary>
        </div>
    );
};
