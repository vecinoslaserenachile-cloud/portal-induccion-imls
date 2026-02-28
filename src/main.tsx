import React from 'react';
import ReactDOM from 'react-dom/client';

// Intentamos cargar App, pero si falla, mostraremos un mensaje de emergencia
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root');
}

// Arrancamos React
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      color: 'white', 
      backgroundColor: '#0f172a', // Fondo oscuro original
      fontFamily: 'sans-serif',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Mensaje de confirmación de despliegue */}
      <h1 style={{fontSize: '2rem', textAlign: 'center'}}>
        IMLS 2026: SISTEMA BASE OK
      </h1>
      <p style={{color: '#94a3b8'}}>
        Si ves esto, la configuración de GitHub y Vite es correcta.
      </p>
      
      {/* Intentamos cargar la App real aquí dentro. 
          Si la App real falla por la API Key, al menos verás el texto de arriba. */}
      <div style={{border: '1px solid #334155', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '600px'}}>
        <App />
      </div>
    </div>
  </React.StrictMode>
);
