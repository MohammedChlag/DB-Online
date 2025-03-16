import joi from 'joi';
import { joiErrorMessages } from '../joiErrorMessages.js';

//Creamos el esquema para loguear un usuario
export const loginUserSchema = joi.object({
    email: joi
        .string()
        .email({ tlds: { allow: false } })
        .min(8)
        .required()
        .messages(joiErrorMessages),
    password: joi.string().min(8).required().messages(joiErrorMessages),
});
