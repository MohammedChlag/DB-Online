import React, { useEffect, useState } from 'react';

// Importación de iconos
import { MoonIcon as MoonSolid, SunIcon } from '@heroicons/react/24/solid';

// Importación LocalStorage
import { getFromLocalStorage, setToLocalStorage } from '../utils/helpers.js';

// Función para el modo noche y su button
export const ThemeUserMode = () => {
    // Almacenamos el tema actual en el localStorage
    const [theme, setTheme] = useState(
        getFromLocalStorage('DbTheme') || 'light'
    );

    // Variable para iniciar en el tema actual
    const [isChecked, setIsChecked] = useState(theme === 'dark');

    // Usamos useEffect para cambiar de tema
    useEffect(() => {
        if (theme === 'dark') {
            document.querySelector('html').classList.add('dark');
        } else {
            document.querySelector('html').classList.remove('dark');
        }

        // Guardamos el tema actual en el localStorage
        setToLocalStorage('DbTheme', theme);

        // Función para limpieza del estado
        return () => {
            if (theme === 'dark') {
                document.querySelector('html').classList.add('dark');
            } else {
                document.querySelector('html').classList.remove('dark');
            }
        };
    }, [theme]);

    // Función para cambiar el tema y actualizar el estado del switch.
    const handleChangeTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
        setIsChecked((prev) => !prev);
    };

    return (
        <div>
            {/* Botón tipo swicht para hacer los cambios del tema */}
            <button
                onClick={handleChangeTheme}
                className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-[#009EB5]'
                } dark:bg-[#676767] absolute top-7 md:top-8 border-black border-2 dark:border-white`}
                role="switch"
                aria-checked={isChecked}
            >
                {/* Texto alternativo para accesibilidad */}
                <span className="sr-only">Theme mode</span>

                {/* Un poco de estilo para el switch */}
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        theme === 'dark'
                            ? 'translate-x-6 flex items-center justify-center'
                            : 'translate-x-0 flex items-center justify-center'
                    }`}
                >
                    {/* Aquí le ponemos un icono de sol o luna dependiendo del tema */}
                    {theme === 'dark' ? (
                        <MoonSolid
                            className="size-4 fill-black"
                            aria-hidden="true"
                        />
                    ) : (
                        <SunIcon
                            className="size-4 fill-yellow-500"
                            aria-hidden="true"
                        />
                    )}
                </span>
            </button>
        </div>
    );
};
