import { Carpeta } from './Carpeta';

export const FolderSection = ({
    folders = [],
    loading,
    onFolderClick,
    onRename,
    onDelete,
    onRefetchStorage,
}) => {
    if (loading) {
        return (
            <section className="bg-gray-50 rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
                <h2 className="text-base sm:text-lg font-semibold mb-4">
                    Carpetas
                </h2>
                <div className="flex flex-col">
                    <section className="flex items-center justify-center py-4 sm:py-6">
                        <p
                            className="animate-pulse text-gray-500 dark:text-white"
                            role="status"
                        >
                            Cargando carpetas...
                        </p>
                    </section>
                </div>
            </section>
        );
    }

    if (!folders.length) {
        return (
            <section className="bg-gray-50 dark:bg-[#2c2c2c] p-1 rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
                <h2 className="text-base sm:text-lg font-semibold mb-4">
                    Carpetas
                </h2>
                <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-white">
                        No hay carpetas para mostrar
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 dark:bg-[#2c2c2c] p-1 rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
                Carpetas
            </h2>
            <ul className="flex flex-col space-y-2 sm:space-y-3 list-none p-0">
                {folders.map((folder, index) => (
                    <li
                        key={folder.id}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <Carpeta
                            folder={folder}
                            onFolderClick={onFolderClick}
                            onRename={onRename}
                            onDelete={onDelete}
                            onRefetchStorage={onRefetchStorage}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};
