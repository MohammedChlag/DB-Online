import joi from 'joi';
import { joiErrorMessages } from '../joiErrorMessages.js';

// Creamos el esquema para registrar usuario
export const registerUserSchema = joi.object({
    firstName: joi.string().max(40).allow('', null).messages(joiErrorMessages),
    lastName: joi.string().max(40).allow('', null).messages(joiErrorMessages),
    birthday: joi.date().required().messages(joiErrorMessages),
    email: joi
        .string()
        .required()
        .email({ tlds: { allow: false } })
        .messages(joiErrorMessages),
    username: joi.string().min(3).max(25).required().messages(joiErrorMessages),
    password: joi
        .string()
        .pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[¡!@$%^&()_+|~=`{}:";'<>¿?,.])[a-zA-Z0-9¡!@$%^&()_+|~=`{}:";'<>¿?,.]{8,}$/
        )
        .required()
        .messages(joiErrorMessages),
    terms: joi
        .boolean()
        .valid(true)
        .required()
        .messages({
            ...joiErrorMessages,
            'any.only': 'Debes aceptar los términos y condiciones',
        }),
});
