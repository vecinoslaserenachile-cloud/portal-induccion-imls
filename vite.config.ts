import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // --- ESTA ES LA LÍNEA MÁGICA (FIX) ---
    // El "./" le dice al navegador que busque los archivos en la carpeta actual, 
    // sin importar cómo se llame el repositorio. Esto arregla la pantalla blanca.
    base: "./", 
    // -------------------------------------

    plugins: [react(), tailwindcss()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    
    server: {
      // Configuración original para evitar parpadeos en AI Studio
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    
    build: {
      outDir: 'dist',
    }
  };
});
