import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
// import { ThemeUserMode } from './components/ThemeUserMode.jsx';

// Páginas Publicas
import { LandingPage } from './pages/LandingPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ValidationPage } from './pages/ValidationPage.jsx';
import { AssessmentsPage } from './pages/AssessmentsPage.jsx';
import { SharedLinkPage } from './pages/SharedLinkPage.jsx';
import { DownloadPage } from './pages/DownloadPage.jsx';
import { RecoveryPassCodePage } from './pages/RecoveryPassCodePage.jsx';
import { RecoveryEmailPage } from './pages/RecoveryEmailPage.jsx';
// Páginas Privadas
import { HomePage } from './pages/HomePage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { UsersListPage } from './pages/UsersListPage.jsx';
// Página 404
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function App() {
    return (
        <>
            {/* <ThemeUserMode /> */}
            <Routes>
                {/* Layout */}
                <Route element={<Layout />}>
                    {/* Rutas Públicas */}
                    <Route index element={<LandingPage />} />
                    <Route path="/assessments" element={<AssessmentsPage />} />
                    <Route path="/aboutUs" element={<AboutPage />} />
                    {/* Ruta 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/users">
                    {/* Ruta LoginPage */}
                        <Route path="login" element={<LoginPage />} />
                        {/* Ruta RegisterPage */}
                        <Route path="register" element={<RegisterPage />} />
                        {/* Ruta ValidationPage */}
                        <Route
                            path="validation/:registrationCode"
                            element={<ValidationPage />}
                        />
                        {/* Ruta RecoveryEmailPage */}
                        <Route
                            path="recovery-email"
                            element={<RecoveryEmailPage />}
                        />
                        {/* Ruta RecoveryPassCodePage */}
                        <Route
                            path="recovery"
                            element={<RecoveryPassCodePage />}
                        />
                    </Route>
                    {/* Ruta SharedLinkPage */}
                    <Route
                        path="/storage/share/link/:shareToken"
                        element={<SharedLinkPage />}
                    />
                    {/* Ruta DownloadPage */}
                    <Route
                        path="/storage/share/download/:shareToken"
                        element={<DownloadPage />}
                    />

                    {/* Rutas Privadas */}
                    <Route path="/storage" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/users" element={<UsersListPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
