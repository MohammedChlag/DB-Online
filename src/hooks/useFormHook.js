import { useContext } from 'react';
import { FormContext } from '../context/Form/FormContext.js';

export const useFormHook = () => {
    const { info, errors, validate, handleChange } = useContext(FormContext);

    return {
        info,
        errors,
        validate,
        handleChange,
    };
};
