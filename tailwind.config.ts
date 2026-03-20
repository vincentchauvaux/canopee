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
        // Charte Google Stitch / Material — « Canopée Botanical Editorial »
        surface: {
          DEFAULT: '#fafaee',
          dim: '#dadbcf',
          bright: '#fafaee',
          variant: '#e3e3d7',
          tint: '#506354',
        },
        'surface-container': '#eeefe3',
        'surface-container-high': '#e9e9dd',
        'surface-container-highest': '#e3e3d7',
        'surface-container-low': '#f4f4e8',
        'surface-container-lowest': '#ffffff',
        background: '#fafaee',
        'on-background': '#1a1c15',
        'on-surface': '#1a1c15',
        'on-surface-variant': '#434843',
        primary: {
          DEFAULT: '#334537',
          container: '#4a5d4e',
          fixed: '#d3e8d5',
          'fixed-dim': '#b7ccb9',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#c0d5c2',
        secondary: {
          DEFAULT: '#516256',
          fixed: '#d4e7d7',
          'fixed-dim': '#b8cbbc',
        },
        'secondary-container': '#cfe2d2',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#546558',
        tertiary: {
          DEFAULT: '#404327',
          fixed: '#e3e5bf',
          'fixed-dim': '#c6c9a4',
        },
        'tertiary-container': '#585b3d',
        'tertiary-fixed': '#e3e5bf',
        'on-tertiary': '#ffffff',
        outline: '#737872',
        'outline-variant': '#c3c8c1',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        // Ancienne palette Canopée (compat rétro si besoin)
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
        // Alias historiques — mappés sur Stitch
        accent: {
          DEFAULT: '#e3e5bf',
        },
        text: {
          dark: '#1a1c15',
          light: '#FFFFFF',
        },
        gray: {
          DEFAULT: '#e3e3d7',
        },
      },
      fontFamily: {
        serif: [
          'var(--font-noto-serif)',
          'Noto Serif',
          'Georgia',
          'serif',
        ],
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        headline: [
          'var(--font-noto-serif)',
          'Noto Serif',
          'Georgia',
          'serif',
        ],
        body: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.5rem',
        button: '9999px',
      },
      transitionDuration: {
        default: '300ms',
      },
      boxShadow: {
        'canopee-soft': '0 4px 24px rgba(26, 28, 21, 0.06)',
        'canopee-deep': '0 8px 32px rgba(26, 28, 21, 0.1)',
        'ambient-float': '0 12px 40px rgba(26, 28, 21, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config
