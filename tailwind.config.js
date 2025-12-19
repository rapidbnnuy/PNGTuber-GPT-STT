/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--app-font)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'theme': 'var(--app-radius)',
        'theme-lg': 'calc(var(--app-radius) + 4px)',
        'theme-sm': 'calc(var(--app-radius) - 2px)',
      },
      colors: {
        // Semantic System
        background: 'var(--app-background)',
        surface: 'var(--app-surface)',
        'surface-highlight': 'var(--app-surface-highlight)',
        border: 'var(--app-border)',

        // Content
        text: 'var(--app-text)',
        muted: 'var(--app-text-muted)',

        // Brand (Linked to Ionic)
        primary: 'var(--ion-color-primary)',
        secondary: 'var(--ion-color-secondary)',
      }
    },
  },
  plugins: [],
}

