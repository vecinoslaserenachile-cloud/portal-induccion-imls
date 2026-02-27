import React, { useState } from 'react';
import './index.css'; // Asegúrate de importar los estilos
import { Play, BookOpen, Users, Map, Cpu, CheckCircle, ChevronRight } from 'lucide-react';

// --- COMPONENTES SIMPLES ---

const WelcomeModule = ({ onNext }) => (
  <div className="text-center p-10 bg-white rounded-xl shadow-lg border-t-4 border-red-600">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal de Inducción IMLS 2026</h1>
    <p className="text-gray-500 mb-6">Innovación Municipal de Clase Mundial</p>
    <div className="bg-gray-900 text-white h-48 rounded-lg flex items-center justify-center mb-6 cursor-pointer hover:bg-gray-800 transition">
      <div className="text-center">
        <Play size={48} className="mx-auto mb-2"/>
        <span>Ver Saludo Alcaldesa</span>
      </div>
    </div>
    <button onClick={onNext} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 flex items-center justify-center mx-auto gap-2">
      Comenzar <ChevronRight size={20}/>
    </button>
  </div>
);

const MenuModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600 hover:shadow-lg cursor-pointer">
      <Users size={32} className="text-blue-600 mb-4"/>
      <h3 className="font-bold text-xl">Tu Contrato</h3>
      <p className="text-sm text-gray-500">Revisa tu modalidad (Planta, Contrata, Honorarios)</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600 hover:shadow-lg cursor-pointer">
      <Map size={32} className="text-green-600 mb-4"/>
      <h3 className="font-bold text-xl">Organigrama</h3>
      <p className="text-sm text-gray-500">Mapa de navegación municipal</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-600 hover:shadow-lg cursor-pointer col-span-1 md:col-span-2">
      <Cpu size={32} className="text-purple-600 mb-4"/>
      <h3 className="font-bold text-xl">Bus Smart City (Herramientas)</h3>
      <p className="text-sm text-gray-500">Radio Digital, Tickets Geo y Planificador de Rutas</p>
    </div>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-6">
      <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="font-bold text-lg text-gray-700">IMLS 2026</div>
        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">BETA INTERNA</div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!started ? <WelcomeModule onNext={() => setStarted(true)} /> : <MenuModule />}
      </main>

      {/* ASISTENTE SERENITO (Flotante) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        <div className="bg-white p-3 rounded-lg shadow-xl mb-2 max-w-xs border border-gray-200">
          <p className="text-sm text-gray-600">
            {!started ? "¡Hola! Soy Serenito. Dale play al video para empezar." : "Selecciona un módulo para entrenarte."}
          </p>
        </div>
        <div className="w-16 h-16 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
          SERENITO
        </div>
      </div>
    </div>
  );
}

export default App;