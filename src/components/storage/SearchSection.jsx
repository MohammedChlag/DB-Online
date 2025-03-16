import { Archivo } from './Archivo.jsx';
import { Carpeta } from './Carpeta.jsx';

export const SearchSection = ({
    results,
    onFolderClick,
    onRename,
    onDelete,
    onRefetchStorage,
}) => {
    // Asegurarnos de que results sea un array
    const searchResults = Array.isArray(results?.data) ? results.data : [];

    if (searchResults.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron resultados</p>
            </div>
        );
    }

    // Filtrar por el type que viene del backend
    const folders = searchResults.filter((item) => item.type === 'folder');
    const files = searchResults.filter((item) => item.type === 'file');

    return (
        <div className="space-y-6 px-4">
            {folders.length > 0 && (
                <section>
                    <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                        Carpetas ({folders.length})
                    </h2>
                    <div className="space-y-2">
                        {folders.map((folder) => (
                            <Carpeta
                                key={folder.id}
                                folder={folder}
                                onFolderClick={onFolderClick}
                                onRename={onRename}
                                onDelete={onDelete}
                                onRefetchStorage={onRefetchStorage}
                            />
                        ))}
                    </div>
                </section>
            )}

            {files.length > 0 && (
                <section>
                    <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                        Archivos ({files.length})
                    </h2>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <Archivo
                                key={file.id}
                                file={file}
                                onRename={onRename}
                                onDelete={onDelete}
                                onRefetchStorage={onRefetchStorage}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
