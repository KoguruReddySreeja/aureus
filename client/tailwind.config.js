/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base:            'var(--base)',
        surface:         'var(--surface)',
        'surface-2':     'var(--surface-2)',
        elevated:        'var(--elevated)',
        'elevated-2':    'var(--elevated-2)',
        border:          'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        accent:          'var(--accent)',
        'accent-hover':  'var(--accent-hover)',
        'accent-subtle': 'var(--accent-subtle)',
        success:         'var(--success)',
        'success-subtle':'var(--success-subtle)',
        danger:          'var(--danger)',
        'danger-subtle': 'var(--danger-subtle)',
        warning:         'var(--warning)',
        'warning-subtle':'var(--warning-subtle)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(47, 129, 247, 0.2)',
        'glow-sm':     '0 0 10px rgba(47, 129, 247, 0.15)',
        'card':        '0 1px 3px rgba(0,0,0,0.8)',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
