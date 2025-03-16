import React from 'react';

export class Boundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    // Atrapa el error
    // Método 1
    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    // Método 2
    // Ambos sirven por igual
    componentDidCatch(error) {
        console.log('Component did catch:', error.message);
    }

    render() {
        if (this.state.hasError) {
            // UI de emergencia
            return (
                <div className="px-4 py-2 m-4">
                    <h1 className="mt-2 font-bold text-lg mb-1">
                        Tremendo! Conseguiste un Error inesperado.
                    </h1>
                    <p>{this.state.errorMessage}</p>
                    <button
                        className="px-4 py-2 rounded bg-[#009EB5] hover:bg-[#009ec3] active:outline text-sm"
                        onClick={() => window.location.reload()}
                    >
                        Recargar la página{''}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
