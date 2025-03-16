import { Archivo } from './Archivo';

export const DocumentsSection = ({
    documents = [],
    loading,
    error,
    onRename,
    onDelete,
    onRefetchStorage,
    isSharedFolder = false,
}) => {
    if (loading) {
        return (
            <section className="bg-gray-50 dark:bg-[#2c2c2c] p-1 rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
                <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">
                    Archivos
                </h2>
                <div className="flex flex-col">
                    <section className="flex items-center justify-center py-4 sm:py-6">
                        <p
                            className="animate-pulse text-gray-500 dark:text-gray-300"
                            role="status"
                        >
                            Cargando archivos...
                        </p>
                    </section>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-gray-50 dark:bg-[#2c2c2c] rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
                <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">
                    Archivos
                </h2>
                <div className="flex flex-col">
                    <p className="text-red-500 dark:text-red-400">
                        Error al cargar los archivos
                    </p>
                </div>
            </section>
        );
    }

    if (!documents.length) {
        return (
            <section className="bg-gray-50 dark:bg-[#2c2c2c] rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
                <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">
                    Archivos
                </h2>
                <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-300">
                        No hay archivos para mostrar
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 dark:bg-[#2c2c2c] p-1 rounded-lg px-4 sm:py-6 animate-fadeIn transition-all duration-300 ease-in-out">
            <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">
                Archivos
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 list-none p-0">
                {documents.map((file, index) => (
                    <li
                        key={file.id}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <Archivo
                            file={file}
                            onRename={onRename}
                            onDelete={onDelete}
                            onRefetchStorage={onRefetchStorage}
                            isSharedFolder={isSharedFolder}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};
