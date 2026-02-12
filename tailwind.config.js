export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0d1b2a',
        'neon-blue': '#00d9ff',
        'neon-cyan': '#00d9ff',
        'portfolio-teal': '#1b4965',
        'luxury-gray': '#1a2f5a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xl': '100px',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
