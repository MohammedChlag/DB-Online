// Import de ErrorBoundaries
import { Boundary } from '../../services/ErrorBoundary.jsx';

// Función de los criterios de contraseña
export const PasswordStrength = ({ password }) => {
    const calculateStrength = (pass) => {
        let strength = 0;

        // Longitud mínima
        if (pass.length >= 8) strength += 1;

        // Contiene números
        if (/\d/.test(pass)) strength += 1;

        // Contiene letras minúsculas
        if (/[a-z]/.test(pass)) strength += 1;

        // Contiene letras mayúsculas
        if (/[A-Z]/.test(pass)) strength += 1;

        // Contiene caracteres especiales
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength += 1;

        return {
            score: strength,
            label: strength <= 1 ? 'Débil' : strength <= 3 ? 'Media' : 'Fuerte',
            color:
                strength <= 1
                    ? 'bg-red-500'
                    : strength <= 3
                    ? 'bg-yellow-500'
                    : 'bg-green-500',
            width: `${(strength / 5) * 100}%`,
        };
    };

    const strength = calculateStrength(password);

    return (
        <Boundary>
            <div className="mt-1">
                <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Fortaleza:</span>
                    <span
                        className={`text-xs ${
                            strength.score <= 1
                                ? 'text-red-500'
                                : strength.score <= 3
                                ? 'text-yellow-500'
                                : 'text-green-500'
                        }`}
                    >
                        {strength.label}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>
        </Boundary>
    );
};
