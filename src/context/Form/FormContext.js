import { createContext } from 'react';

export const FormContext = createContext({
    info: {},
    errors: [],
    validate: () => undefined,
    handleChange: () => undefined,
});
