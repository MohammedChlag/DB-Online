// Importamos joi.
import joi from 'joi';

// Importamos los mensajes de error personalizados.
import joiErrorMessages from '../joiErrorMessages.js';

// Definimos el patrón
const pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[¡!@$%^&*()_+|~=`{}:";'<>¿?,.])[a-zA-Z0-9¡!@$%^&*()_+|~=`{}:";'<>¿?,.]{8,}$/;

// Creamos el esquema de Joi donde comprobamos todas las propiedades necesarias.
export const editPasswordSchema = joi.object({
    oldPassword: joi
        .string()
        .pattern(pattern)
        .required()
        .messages(joiErrorMessages),
    newPassword: joi
        .string()
        .pattern(pattern)
        .required()
        .messages(joiErrorMessages),
    confirmNewPassword: joi
        .string()
        .pattern(pattern)
        .required()
        .valid(joi.ref('newPassword'))
        .messages({
            'any.only': 'La contraseña nueva no conicide',
        }),
});
