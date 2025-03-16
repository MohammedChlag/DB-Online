import React from 'react';
import { useLocation } from 'react-router-dom';

// Importación de iconos
import {
    HomeIcon,
    DocumentTextIcon,
    UsersIcon,
    InformationCircleIcon,
    FolderPlusIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

// Importación de Layot
import { ActionSidebarButton } from './ActionSidebarButton.jsx';
import { SidebarButton } from './SidebarButton.jsx';

// Función del sidebar lateral
export const Sidebar = ({
    onCreateFolder,
    onUpload,
    activeTab,
    setActiveTab,
    inFolder = false,
}) => {
    console.log('inFolder', inFolder);
    const location = useLocation();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white p-4 border-r border-gray-200 min-h-[80vh] max-h-[90vh] sticky top-0 dark:bg-[#2c2c2c] rounded-lg dark:border-none animate-slideIn">
            {/* Botones de acción */}
            <div className="flex flex-col space-y-2 mb-6 animate-fadeIn">
                <div
                    style={{ '--delay': '0.1s' }}
                    className="animate-staggerFade"
                >
                    <ActionSidebarButton
                        icon={FolderPlusIcon}
                        label="Crear carpeta"
                        onClick={onCreateFolder}
                    />
                </div>
                <div
                    style={{ '--delay': '0.2s' }}
                    className="animate-staggerFade"
                >
                    <ActionSidebarButton
                        icon={ArrowUpTrayIcon}
                        label="Subir archivo"
                        onClick={onUpload}
                    />
                </div>
            </div>

            {/* Navegación principal */}
            <h3
                className="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider mb-3 animate-fadeIn"
                style={{ '--delay': '0.3s' }}
            >
                Navegación
            </h3>
            <nav className="flex flex-col space-y-1 mb-8">
                <div
                    style={{ '--delay': '0.4s' }}
                    className="animate-staggerFade"
                >
                    <SidebarButton
                        icon={HomeIcon}
                        label="Página principal"
                        isActive={activeTab === 'principal'}
                        onClick={() => setActiveTab('principal')}
                    />
                </div>
                <div
                    style={{ '--delay': '0.5s' }}
                    className="animate-staggerFade"
                >
                    <SidebarButton
                        icon={DocumentTextIcon}
                        label="Mis documentos"
                        isActive={activeTab === 'documentos'}
                        onClick={() => setActiveTab('documentos')}
                    />
                </div>
                <div
                    style={{ '--delay': '0.6s' }}
                    className="animate-staggerFade"
                >
                    <SidebarButton
                        icon={UsersIcon}
                        label="Compartidos"
                        isActive={activeTab === 'compartidos'}
                        onClick={() => setActiveTab('compartidos')}
                    />
                </div>
            </nav>

            {/* Enlaces adicionales */}
            <div
                className="mt-auto animate-fadeIn"
                style={{ '--delay': '0.7s' }}
            >
                <SidebarButton
                    icon={InformationCircleIcon}
                    label="About us"
                    to="/aboutUs"
                    isActive={location.pathname === '/aboutUs'}
                />
            </div>
        </aside>
    );
};
