/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        'canvas-dots': 'var(--canvas-dots)',
        'win-bg': 'var(--win-bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        inset: 'var(--inset)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        chrome: 'var(--chrome)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-faint': 'var(--text-faint)',
        green: 'var(--green)',
        'green-fg': 'var(--green-fg)',
        'green-soft': 'var(--green-soft)',
        blue: 'var(--blue)',
        'blue-fg': 'var(--blue-fg)',
        'blue-soft': 'var(--blue-soft)',
        amber: 'var(--amber)',
        'amber-fg': 'var(--amber-fg)',
        'amber-soft': 'var(--amber-soft)',
        violet: 'var(--violet)',
        'violet-fg': 'var(--violet-fg)',
        'violet-soft': 'var(--violet-soft)',
        'red-fg': 'var(--red-fg)',
      },
      fontFamily: {
        disp: 'var(--font-disp)',
      },
    },
  },
  plugins: [],
};
