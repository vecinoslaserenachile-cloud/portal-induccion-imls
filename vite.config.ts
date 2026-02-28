import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

// --- AQUÍ VA EL BLOQUE (Antes del export) ---
// Esto define __dirname para que no falle en servidores modernos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --------------------------------------------

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. RUTA RELATIVA (Vital para GitHub Pages)
    base: "./", 

    plugins: [react(), tailwindcss()],
    
    // 2. Variables de entorno (API Key)
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    // 3. Alias usando la variable que definimos arriba
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    
    build: {
      outDir: 'dist',
    }
  };
});
