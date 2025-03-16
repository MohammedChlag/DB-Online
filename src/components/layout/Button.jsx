// Función de el componente Button
export const Button = ({
    id,
    type,
    handleClick,
    loading,
    children,
    className,
}) => {
    return (
        <button
            id={id}
            onClick={handleClick}
            type={type}
            disabled={loading}
            className={
                className ||
                'w-full max-w-xs py-3 px-6 text-white bg-[#009EB5] border rounded-md shadow-md hover:bg-[#009ec3]'
            }
        >
            {loading ? 'Cargando...' : children}
        </button>
    );
};
