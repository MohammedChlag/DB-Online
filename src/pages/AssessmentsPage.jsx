import React from 'react';

// Import de componente
import { AssessmentComponent } from '../components/assessments/AssessmentComponent';

// Función de página de valoraciones
export const AssessmentsPage = () => {
    return (
        <section className="bg-gradient-to-b  dark:bg-[#1f1f1f]">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <header className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        Valoraciones de Hackloud
                    </h1>
                    <div className="w-24 h-1 bg-[#009EB5] mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-0 max-w-3xl mx-auto">
                        Conoce las opiniones de nuestros usuarios sobre
                        Hackloud. Tu opinión es importante para nosotros y nos
                        ayuda a mejorar continuamente nuestro servicio.
                    </p>
                </header>

                <div className="max-w-7xl mx-auto">
                    <AssessmentComponent />
                </div>
            </div>
        </section>
    );
};
