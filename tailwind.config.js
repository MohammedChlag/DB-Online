/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                float: 'float 6s ease-in-out infinite',
                fadeIn: 'fadeIn 0.3s ease-in-out',
                slideIn: 'slideIn 0.3s ease-in-out',
                popIn: 'popIn 0.2s ease-out',
                elegantRise:
                    'elegantRise 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                staggerFade: 'fadeIn 0.5s ease-out var(--delay, 0s)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                popIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                elegantRise: {
                    '0%': {
                        transform: 'translateY(8px) scale(0.98)',
                        opacity: '0',
                        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
                    },
                    '60%': {
                        transform: 'translateY(-2px) scale(1.01)',
                        opacity: '0.85',
                    },
                    '100%': {
                        transform: 'translateY(0) scale(1)',
                        opacity: '1',
                        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
            boxShadow: {
                elegant:
                    '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
};
