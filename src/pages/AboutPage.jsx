import { useNavigate } from 'react-router-dom';

// Imports de logos
import logoLight from '../assets/img/logo-hackloud-solo.png';
import logoDark from '../assets/img/logo-hackloud-solo-blanco.png';

// Import de componente
import { AssessmentPreview } from '../components/assessments/AssessmentsPreview.jsx';

// Función de la página de AboutUs
export const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col items-center text-center px-6 py-8 flex-1">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">About us</h2>
            <div className="w-12 h-1 bg-[#009EB5] mb-6"></div>

            <img
                src={logoLight}
                alt="Hackloud Logo Light"
                className="w-32 sm:w-40 mb-4 dark:hidden"
            />

            <img
                src={logoDark}
                alt="Hackloud Logo Dark"
                className="w-32 sm:w-40 mb-4 hidden dark:block"
            />

            <p className="text-base sm:text-lg font-medium">Save it ALL</p>

            <section className="max-w-2xl mx-auto text-gray-700 dark:text-gray-400 space-y-4 mt-4">
                <p>
                    Soy tu espacio seguro en la nube. Guarda, organiza y accede
                    a tus archivos desde cualquier dispositivo, en cualquier
                    momento. Conmigo, tus documentos están protegidos con la más
                    alta seguridad y encriptación.
                </p>
                <p>
                    Olvídate de perder información o quedarte sin espacio. Mi
                    interfaz intuitiva te permite encontrar lo que necesitas en
                    segundos y compartir archivos fácilmente con quien quieras.
                    Además, mis planes se adaptan a tus necesidades, desde el
                    usuario individual hasta grandes empresas.
                </p>
                <p className="font-bold">
                    ¡Prueba la libertad de tener tus archivos siempre contigo!
                </p>
            </section>

            <section className="flex justify-center mt-6 mb-8">
                <button
                    onClick={() => navigate('/assessments')}
                    className="text-white px-6 py-2 rounded-lg bg-[#009EB5] shadow-md hover:bg-[#007e94] transition-all"
                >
                    Dejar una Valoración
                </button>
            </section>

            {/* Sección de valoraciones */}
            <section
                id="valoraciones"
                className="w-full max-w-4xl mx-auto mt-4"
            >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                    <span className="text-[#009EB5]">♥</span> Opiniones de
                    nuestra comunidad
                </h3>
                <AssessmentPreview />
            </section>
        </section>
    );
};
