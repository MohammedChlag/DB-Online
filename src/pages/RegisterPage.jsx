import { RegisterForm } from '../components/forms/RegisterForm.jsx';
import { FormProvider } from '../context/Form/FormProvider.jsx';

export const RegisterPage = () => {
    return (
        <FormProvider>
            <RegisterForm />
        </FormProvider>
    );
};
