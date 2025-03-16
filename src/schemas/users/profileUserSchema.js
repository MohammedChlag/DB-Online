import joi from 'joi';
import { joiErrorMessages } from '../joiErrorMessages.js';

// Creamos el esquema para editar usuario
export const profileUserSchema = joi.object({
    username: joi.string().min(3).max(25).required().messages(joiErrorMessages),
    firstName: joi
        .string()
        .min(3)
        .max(40)
        .optional()
        .messages(joiErrorMessages),
    lastName: joi.string().min(3).max(40).optional().messages(joiErrorMessages),
    email: joi
        .string()
        .required()
        .email({ tlds: { allow: false } })
        .messages(joiErrorMessages),
});
