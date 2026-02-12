import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    postcss({
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    }),
  ],
  server: {
    port: 5173,
    open: true
  }
})
