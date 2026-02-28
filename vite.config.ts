import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // --- ESTA ES LA LÍNEA NUEVA QUE ARREGLA LA PANTALLA BLANCA ---
    // (Asegúrate de que 'portal-induccion-imls' sea el nombre exacto de tu repositorio)
    base: "/portal-induccion-imls/", 
    // -------------------------------------------------------------

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
      // Configuración original de AI Studio (se mantiene igual)
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
