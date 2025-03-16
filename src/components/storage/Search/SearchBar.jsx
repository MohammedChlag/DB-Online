import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchFilters } from './SearchFilters';

// Hook de debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export const SearchBar = ({ onSearch, onClearSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortParams, setSortParams] = useState({
        orderBy: null,
        orderDirection: null,
    });
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Efecto para búsqueda
    useEffect(() => {
        // Solo ejecutar la búsqueda si hay un término de búsqueda
        if (debouncedSearchTerm?.trim()) {
            onSearch({
                query: debouncedSearchTerm.trim(),
                orderBy: sortParams.orderBy,
                orderDirection: sortParams.orderDirection,
            });
        }
    }, [debouncedSearchTerm, sortParams]); // Depender del término de búsqueda y los parámetros de ordenación

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value.trim()) {
            onClearSearch(); // Limpiar cuando el input está vacío
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onClearSearch();
    };

    const handleSort = ({ orderBy, orderDirection }) => {
        setSortParams({ orderBy, orderDirection });

        // Si hay un término de búsqueda, actualizar la búsqueda con los nuevos parámetros
        if (searchTerm.trim()) {
            onSearch({
                query: searchTerm.trim(),
                orderBy,
                orderDirection,
            });
        } else if (orderBy && orderDirection) {
            // Si no hay término de búsqueda pero sí parámetros de ordenación, usar el servicio de ordenación
            onSort({ orderBy, orderDirection });
        } else {
            // Si no hay término de búsqueda ni parámetros de ordenación, resetear la vista
            onClearSearch();
        }
    };

    return (
        <section className="w-full flex justify-center items-center mb-4">
            <article className="w-[80vw] md:w-[60vw] lg:w-[50vw] flex">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder="Busca tus archivos..."
                        className="w-full pl-10 pr-10 py-3 rounded-l-xl border border-gray-300 dark:border-[#676767] 
                        bg-cyan-50 dark:bg-[#676767] shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400
                        transition-all duration-200"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                            text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            ✖
                        </button>
                    )}
                </div>
                <SearchFilters onSort={handleSort} />
            </article>
        </section>
    );
};
