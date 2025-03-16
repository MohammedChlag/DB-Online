import { FormProvider } from '../context/Form/FormProvider.jsx';
import { ProfileForm } from '../components/forms/ProfileForm.jsx';
import { PasswordForm } from '../components/forms/PasswordForm.jsx';

export const ProfilePage = () => {
    return (
        <FormProvider>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 p-4 sm:p-6">
                <ProfileForm />
                <PasswordForm />
            </section>
        </FormProvider>
    );
};
