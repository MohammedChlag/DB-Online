export const ActionSidebarButton = ({ icon: Icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
          flex items-center w-full px-4 py-3 
          bg-[#009EB5] text-white rounded-lg
          hover:bg-[#009ec3] duration-200
          mb-2 transition-all transform hover:scale-105 hover:shadow-xl
        "
        >
            <Icon className="h-5 w-5 mr-2" />
            <span>{label}</span>
        </button>
    );
};
