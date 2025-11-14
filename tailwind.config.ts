import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canopee: {
          primary: '#264E36',
          'primary-light': '#4F7F5A',
          secondary: '#7DAA6A',
          'secondary-light': '#AFCFA1',
          accent: '#F2E8C9',
          dark: '#2A2D23',
          light: '#DAD7CD',
          white: '#FFFFFF',
        },
        // Alias pour compatibilité
        primary: {
          DEFAULT: '#264E36',
          light: '#4F7F5A',
        },
        secondary: {
          DEFAULT: '#7DAA6A',
          light: '#AFCFA1',
        },
        accent: {
          DEFAULT: '#F2E8C9',
        },
        text: {
          dark: '#2A2D23',
          light: '#FFFFFF',
        },
        gray: {
          DEFAULT: '#DAD7CD',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      transitionDuration: {
        'default': '300ms',
      },
      boxShadow: {
        'canopee-soft': '0 4px 12px rgba(0,0,0,0.08)',
        'canopee-deep': '0 8px 20px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
export default config

