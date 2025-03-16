export const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className={`ml-2 px-3.5 py-3 text-sm font-medium ${
            active
                ? 'text-[#00B4D8] border-b-2 border-[#00B4D8]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
        }`}
    >
        {children}
    </button>
);
