import React, { useState, useEffect, useRef } from 'react';
import { ArrowsUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SearchFilters = ({ onSort }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSort, setCurrentSort] = useState({
        orderBy: null,
        orderDirection: null,
    });
    const menuRef = useRef(null);

    // Handle clicks outside the menu to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sortOptions = [
        { label: 'Nombre (A-Z)', orderBy: 'name', orderDirection: 'ASC' },
        { label: 'Nombre (Z-A)', orderBy: 'name', orderDirection: 'DESC' },
        {
            label: 'Tamaño (menor a mayor)',
            orderBy: 'size',
            orderDirection: 'ASC',
        },
        {
            label: 'Tamaño (mayor a menor)',
            orderBy: 'size',
            orderDirection: 'DESC',
        },
        {
            label: 'Fecha (más reciente)',
            orderBy: 'date',
            orderDirection: 'DESC',
        },
        {
            label: 'Fecha (más antigua)',
            orderBy: 'date',
            orderDirection: 'ASC',
        },
    ];

    const handleSortSelect = (option) => {
        setCurrentSort(option);
        onSort(option);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetOption = { orderBy: null, orderDirection: null };
        setCurrentSort(resetOption);
        onSort(resetOption);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                type="button"
                className="h-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-[#676767] text-sm font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-[#676767] border-l-0 rounded-r-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#777777] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all duration-200"
                onClick={() => setIsOpen(!isOpen)}
                title="Ordenar elementos"
            >
                <ArrowsUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
                {currentSort.orderBy && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#555555]"
                        title="Restablecer orden"
                    >
                        <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-white" />
                    </button>
                )}
            </button>

            {isOpen && (
                <nav className="absolute right-0 z-10 mt-2 w-56 py-1 origin-top-right rounded-md bg-white dark:bg-[#2c2c2c] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <>
                        {sortOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleSortSelect(option)}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c3c3c]"
                            >
                                {option.label}
                            </button>
                        ))}
                        {currentSort.orderBy && (
                            <>
                                <hr className="my-1 border-gray-200 dark:border-[#444444]" />
                                <button
                                    onClick={handleReset}
                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3c3c3c]"
                                >
                                    Restablecer orden
                                </button>
                            </>
                        )}
                    </>
                </nav>
            )}
        </div>
    );
};
