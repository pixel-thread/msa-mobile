/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/shared/components/**/*.{js,ts,tsx}',
    './src/app/**/*.{js,ts,tsx}',
    './src/features/*/{components,screens}/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        wf: {
          blue: 'hsl(var(--wf-blue))',
          purple: 'hsl(var(--wf-purple))',
          pink: 'hsl(var(--wf-pink))',
          green: 'hsl(var(--wf-green))',
          orange: 'hsl(var(--wf-orange))',
          yellow: 'hsl(var(--wf-yellow))',
          red: 'hsl(var(--wf-red))',
        },
      },
      fontFamily: {
        sans: ['WF Visual Sans Variable', 'Arial', 'sans-serif'],
        mono: ['Inconsolata', 'monospace'],
      },
      fontSize: {
        'wf-display': ['80px', { lineHeight: '1.04', letterSpacing: '-0.8px', fontWeight: '600' }],
        'wf-h1': ['56px', { lineHeight: '1.04', letterSpacing: '0', fontWeight: '600' }],
        'wf-h2': ['32px', { lineHeight: '1.30', letterSpacing: '0', fontWeight: '500' }],
        'wf-h3': ['24px', { lineHeight: '1.30', letterSpacing: '0', fontWeight: '500' }],
        'wf-body-lg': ['20px', { lineHeight: '1.50', letterSpacing: '0', fontWeight: '400' }],
        'wf-body': ['16px', { lineHeight: '1.60', letterSpacing: '-0.16px', fontWeight: '400' }],
        'wf-label': ['15px', { lineHeight: '1.30', letterSpacing: '1.5px', fontWeight: '500' }],
        'wf-caption': ['14px', { lineHeight: '1.60', letterSpacing: '0', fontWeight: '400' }],
        'wf-badge': ['12.8px', { lineHeight: '1.20', letterSpacing: '0', fontWeight: '550' }],
        'wf-micro': ['10px', { lineHeight: '1.30', letterSpacing: '1px', fontWeight: '500' }],
      },
      boxShadow: {
        'wf-cascade':
          'rgba(0,0,0,0) 0px 84px 24px, rgba(0,0,0,0.01) 0px 54px 22px, rgba(0,0,0,0.04) 0px 30px 18px, rgba(0,0,0,0.08) 0px 13px 13px, rgba(0,0,0,0.09) 0px 3px 7px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        'wf-1': '1px',
        'wf-2.4': '2.4px',
        'wf-3.2': '3.2px',
        'wf-5.6': '5.6px',
        'wf-7.2': '7.2px',
        'wf-9.6': '9.6px',
      },
    },
  },
  plugins: [],
};
