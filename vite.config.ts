import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // EL TRUCO MAESTRO: "./" hace que funcione en cualquier repositorio
  base: "./", 
  build: {
    outDir: 'dist',
  }
})
