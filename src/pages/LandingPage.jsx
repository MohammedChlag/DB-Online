import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Imports de iconos
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Import de icono
import nubelogo from '../assets/img/nube.png';

// Imports de componentes
import { Button } from '../components/layout/Button.jsx';
import { AssessmentPreview } from '../components/assessments/AssessmentsPreview.jsx';

// Función de página de Landing
export const LandingPage = () => {
    // Referencia para la sección de valoraciones y la sección principal
    const valoracionesRef = useRef(null);
    const heroRef = useRef(null);

    // Estado para controlar la dirección de la flecha y la posición
    const [isAtTop, setIsAtTop] = useState(true);

    // Función para desplazarse suavemente a la sección de valoraciones o al inicio
    const handleScroll = () => {
        if (isAtTop) {
            // Si estamos arriba, desplazarse a las valoraciones
            valoracionesRef.current.scrollIntoView({ behavior: 'smooth' });
            setIsAtTop(false); // Cambiar el estado inmediatamente
        } else {
            // Si estamos abajo, desplazarse al inicio de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsAtTop(true); // Cambiar el estado inmediatamente
        }
    };

    // Detectar la posición de desplazamiento para cambiar la dirección de la flecha
    // Usando un enfoque más robusto que funciona con diferentes niveles de zoom (Alex ya lo solucioné)
    useEffect(() => {
        const handleScrollPosition = () => {
            if (!valoracionesRef.current || !heroRef.current) return;

            // Obtener las posiciones relativas a la ventana (viewport)
            const valoracionesRect =
                valoracionesRef.current.getBoundingClientRect();
            const heroRect = heroRef.current.getBoundingClientRect();

            // Altura de la ventana
            const windowHeight = window.innerHeight;

            // Determinar si la sección de valoraciones está visible en la ventana
            // Consideramos que está visible si al menos 1/3 de la sección está en la ventana
            const valoracionesVisible =
                valoracionesRect.top < windowHeight * 0.8 &&
                valoracionesRect.bottom > 0;

            // Determinar si la sección hero está visible
            const heroVisible =
                heroRect.top < windowHeight * 0.5 && heroRect.bottom > 0;

            // Si las valoraciones son más visibles que el hero, estamos abajo
            // Si el hero es más visible o ambos son igualmente visibles, estamos arriba
            const shouldBeAtTop = heroVisible && !valoracionesVisible;

            // Solo actualizar si hay un cambio
            if (isAtTop !== shouldBeAtTop) {
                setIsAtTop(shouldBeAtTop);
            }
        };

        // Escuchar el evento de desplazamiento con throttling para mejor rendimiento
        let ticking = false;
        const scrollListener = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollListener);
        window.addEventListener('resize', handleScrollPosition); // También escuchar eventos de cambio de tamaño

        // Verificar la posición inicial
        handleScrollPosition();

        // Limpiar los event listeners al desmontar
        return () => {
            window.removeEventListener('scroll', scrollListener);
            window.removeEventListener('resize', handleScrollPosition);
        };
    }, [isAtTop]);

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Hero section mejorado con más protagonismo */}
            <section
                ref={heroRef}
                className="flex flex-col items-center justify-center text-center py-16 md:py-24"
            >
                <img
                    className="w-28 md:w-36 mb-6 animate-float"
                    src={nubelogo}
                    alt="Nube Informática"
                />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#009EB5] mb-4">
                    Tu espacio digital sin límites
                </h2>
                <p className="mt-4 text-base max-w-2xl md:text-lg text-gray-700 dark:text-white mb-8">
                    Libera tu creatividad y productividad con almacenamiento
                    seguro e ilimitado. Accede a tus archivos desde cualquier
                    lugar y olvídate de las preocupaciones de espacio.
                </p>
                <Button className="mt-6 px-8 py-3 bg-[#009EB5] text-white text-base font-semibold rounded-md shadow-lg hover:bg-[#009ec3] transition-all transform hover:scale-105 hover:shadow-xl">
                    <Link to="/users/register">¡Empieza gratis ahora!</Link>
                </Button>
            </section>

            {/* Separador visual con interacción */}
            <div className="relative py-8 md:py-12">
                <button
                    onClick={handleScroll}
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#2b2b2b] rounded-full p-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009EB5] focus:ring-opacity-50"
                    aria-label={
                        isAtTop ? 'Desplazarse a valoraciones' : 'Volver arriba'
                    }
                >
                    {isAtTop ? (
                        <ChevronDownIcon className="h-6 w-6 text-[#009EB5]" />
                    ) : (
                        <ChevronUpIcon className="h-6 w-6 text-[#009EB5]" />
                    )}
                </button>
                <hr className="border-gray-200 dark:border-gray-500" />
            </div>

            {/* Sección de valoraciones con menos protagonismo */}
            <section
                ref={valoracionesRef}
                className="py-6 px-4 text-center bg-gray-50 dark:bg-[#283e45] rounded-lg shadow-sm mb-16 opacity-90 hover:opacity-100 transition-opacity"
            >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                    <span className="text-[#009EB5]">♥</span> La voz de nuestra
                    comunidad
                </h3>
                <AssessmentPreview />
            </section>
        </div>
    );
};
