/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Base Colors (Logo, App Shell, Website Chrome)
        ivory: {
          DEFAULT: '#F5F1EC', // Warm Ivory - Primary Base
          bone: '#E9E3DA',    // Bone White
        },
        graphite: {
          DEFAULT: '#1C1C1E', // Deep Graphite
          warm: '#4A4A4A',    // Warm Graphite (micro-accent)
        },
        neutral: {
          DEFAULT: '#8E8E93', // Neutral Grey
          50: '#F5F1EC',      // Warm Ivory
          100: '#E9E3DA',     // Bone White
          200: '#D8D2C8',     // Divider
          300: '#C7BBAF',     // Warm Stone
          400: '#B1B1B6',     // Soft Titanium
          500: '#8E8E93',     // Neutral Grey
          600: '#5E5E62',     // Notices/Info
          700: '#3A3A3C',     // Secondary text
          800: '#2C2C2E',     // Dark mode lighter
          900: '#1C1C1E',     // Deep Graphite
        },

        // Product Accents (Prices, Availability, Actions, States)
        accent: {
          slate: {
            DEFAULT: '#2F3A4A', // Muted Slate Blue - Primary Accent
            hover: '#3B4758',
            disabled: '#1F262F',
          },
          moss: {
            DEFAULT: '#3F4F3C', // Estate Moss - Secondary Accent
            hover: '#4A5D47',
            disabled: '#2C3A2A',
          },
        },

        // Micro-Accents (Use sparingly - <3% of UI)
        bronze: '#6A4E42',    // Dark Bronze

        // Status Colors (Ultra-Restrained)
        status: {
          confirmed: '#3A5F4B',      // Booking Confirmed
          limited: '#C7BBAF',        // Limited Availability
          failure: '#5C2A2A',        // Payment Failure
          info: '#5E5E62',           // Notices / Info
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      fontSize: {
        // Generous line heights and slightly wide tracking
        xs: ['0.75rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0.005em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '0.005em' }],
        'hero': ['4rem', { lineHeight: '1.2', letterSpacing: '0.005em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '0.005em' }],
        'title': ['2rem', { lineHeight: '1.3', letterSpacing: '0.005em' }],
      },

      fontWeight: {
        light: '300',   // Meta / Labels
        normal: '400',  // Body
        medium: '500',  // Headings / Prices / Brand
        semibold: '600',
        bold: '700',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',   // Soft radius
        'lg': '0.5rem',     // Soft radius
        'xl': '0.75rem',    // Soft radius (not fully rounded)
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      backdropBlur: {
        xs: '2px',
      },

      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },

      backgroundImage: {
        // Paper-like grain texture (barely visible)
        'paper-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
