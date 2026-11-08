/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F5F1E9",
          light: "#FAF8F3",
          dark: "#EDE7D9",
        },
        champagne: {
          DEFAULT: "#D8CBB8",
          light: "#E5DCCB",
          dark: "#C4B49D",
        },
        obsidian: {
          DEFAULT: "#22221F",
          light: "#33332F",
          dark: "#111110",
        },
        bronze: {
          DEFAULT: "#A18A70",
          light: "#B8A38C",
          dark: "#8A7458",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.8rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero': ['clamp(2.2rem, 6vw, 4.5rem)', { lineHeight: '1.1' }],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'editorial': '0.15em',
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'container': '1400px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}