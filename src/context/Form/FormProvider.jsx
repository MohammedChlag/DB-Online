import { useState } from 'react';
import { validateSchemaUtil } from '../../utils/helpers.js';
import { FormContext } from './FormContext.js';

export const FormProvider = ({ children }) => {
    const [info, setInfo] = useState(() => ({}));

    const [errors, setErrors] = useState([]);

    const validate = async (schema) => {
        const { value, error } = await validateSchemaUtil(schema, info);
        if (error) {
            setErrors(error.details);
            throw new Error(error.details.map((error) => error.message));
        } else {
            setErrors([]);
        }
        return value;
    };

    const handleChange = (event) => {
        let { type, name, value, checked } = event.target;

        // Para inputs de fecha, asegurarnos de que solo enviamos YYYY-MM-DD
        if (type === 'date' && value) {
            try {
                // Asegurarnos de que tenemos una fecha válida
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    // La fecha es válida, formatearla como YYYY-MM-DD
                    value = date.toISOString().split('T')[0];
                }
            } catch (error) {
                console.error('Error al procesar la fecha:', error);
            }
        }

        setInfo((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <FormContext.Provider value={{ info, errors, validate, handleChange }}>
            {children}
        </FormContext.Provider>
    );
};
