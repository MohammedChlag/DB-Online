import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export const LayoutPage = () => {
    return (
        <>
            <Outlet />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};
