import React from 'react';
import { LoginForm } from '../components/forms/LoginForm.jsx';
import { FormProvider } from '../context/Form/FormProvider.jsx';

export const LoginPage = () => {
    return (
        <FormProvider>
            <LoginForm />
        </FormProvider>
    );
};
