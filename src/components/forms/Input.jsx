import { useState } from 'react';

// Import de Hook
import { useFormHook } from '../../hooks/useFormHook.js';

// Imports de iconos
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Importamos la estructura de la contraseña
import { PasswordStrength } from './PasswordStrength.jsx';

// Funcion de Inputs
export const Input = ({
    label,
    type = 'text',
    name,
    value = '',
    checked = false,
    handleChange,
    disabled = false,
}) => {
    const { errors } = useFormHook();
    const [showPassword, setShowPassword] = useState(false);

    const error = errors.find((error) => error.context.key === name);

    const handleInputChange = (event) => {
        const { type, name, checked, value } = event.target;

        handleChange({
            target: {
                type,
                name,
                value: type === 'checkbox' ? checked : value,
                checked: type === 'checkbox' ? checked : undefined,
            },
        });
    };

    return (
        <label
            className={`block ${
                error ? 'text-red-500' : 'text-gray-600 dark:text-white'
            }`}
        >
            {type !== 'checkbox' && (
                <span className="block mb-1 text-sm font-medium">{label}</span>
            )}
            <div
                className={`relative ${
                    type === 'checkbox' ? 'flex items-center gap-2' : ''
                }`}
            >
                <input
                    type={
                        type === 'password'
                            ? showPassword
                                ? 'text'
                                : 'password'
                            : type
                    }
                    name={name}
                    checked={type === 'checkbox' ? checked : undefined}
                    value={type === 'checkbox' ? 'true' : value || ''}
                    placeholder={type !== 'checkbox' ? label : undefined}
                    autoComplete={
                        type !== 'checkbox' ? `new-${name}` : undefined
                    }
                    onChange={handleInputChange}
                    disabled={disabled}
                    className={`${
                        type === 'checkbox'
                            ? 'h-4 w-4 rounded border-gray-300 text-[#00B4D8] focus:ring-[#00B4D8]'
                            : `w-full p-2 bg-[#cdffff] dark:bg-gray-400 border rounded-md focus:outline-none focus:ring-2 placeholder-gray-400 dark:placeholder:text-gray-600 ${
                                  error
                                      ? 'border-red-500 focus:ring-red-200'
                                      : 'border-gray-200 focus:ring-[#00B4D8] focus:border-[#00B4D8]'
                              } ${type === 'password' ? 'pr-12' : ''}`
                    }`}
                />
                {type === 'password' && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 dark:text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                )}
                {type === 'checkbox' && (
                    <span className="text-sm text-gray-600 dark:text-white">
                        {label}
                    </span>
                )}
            </div>
            {error && (
                <span className="text-sm text-red-500 mt-1">
                    {error.message}
                </span>
            )}

            {/* Renderizar PasswordStrength solo si es un campo de contraseña */}
            {type === 'password' && value && (
                <PasswordStrength password={value} />
            )}
        </label>
    );
};
