import React, { useState } from 'react';
import { 
  Shield, Play, Users, FileText, Map, Bus, Radio, Music, 
  ChevronRight, Heart, Star, Layout, Briefcase, Zap 
} from 'lucide-react';

// --- COMPONENTES VISUALES ---

// 1. EL ASISTENTE VIRTUAL (Serenito)
const SerenitoBot = ({ message }) => (
  <div className="fixed bottom-24 right-6 flex items-end gap-4 z-50 fade-in">
    <div className="bg-white text-slate-900 p-4 rounded-t-2xl rounded-bl-2xl shadow-2xl max-w-xs text-sm font-medium border-2 border-red-600">
      {message}
    </div>
    {/* Placeholder para la imagen 3D de Serenito */}
    <div className="w-20 h-20 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
      <span className="text-2xl">🤖</span> 
    </div>
  </div>
);

// 2. REPRODUCTOR DE RADIO (Footer)
const SmartFooter = () => (
  <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md text-white h-16 border-t border-slate-700 flex items-center justify-between px-6 z-40">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="text-xs">
        <p className="font-bold">Radio Digital Municipal</p>
        <p className="text-slate-400">En vivo desde La Serena</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
      <Shield size={14} /> Innovación Municipal Clase Mundial
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [currentModule, setCurrentModule] = useState('home'); // home, essence, contract, structure, smart
  const [userProfile, setUserProfile] = useState(null); // planta, contrata, honorarios

  // --- NAVEGACIÓN DE MÓDULOS ---

  // 1. PANTALLA DE INICIO (Dashboard)
  const renderHome = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 fade-in relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-20"></div>
      
      <div className="relative z-10 text-center max-w-4xl">
        <div className="flex justify-center mb-6">
           {/* Escudo Municipal Placeholder */}
           <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-xl">
             <Shield size={40} className="text-yellow-500" />
           </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">IMLS <span className="text-red-600">2026</span></h1>
        <p className="text-xl text-slate-300 font-light tracking-widest uppercase mb-12">Portal de Inducción Smart City</p>

        {/* Video Saludo Alcaldesa */}
        <div className="aspect-video w-full bg-black rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/40 transition-all">
            <div className="bg-red-600/90 p-6 rounded-full group-hover:scale-110 transition-transform">
              <Play size={32} className="text-white fill-white" />
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974" className="w-full h-full object-cover opacity-60" alt="Video Alcaldesa" />
          <div className="absolute bottom-4 left-4 text-white text-left">
            <p className="font-bold text-lg">Bienvenida Oficial</p>
            <p className="text-sm opacity-80">Mensaje de Probidad y Cercanía</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <button onClick={() => setCurrentModule('essence')} className="glass-panel p-4 rounded-xl text-white hover:bg-red-600 transition-all hover:-translate-y-1">
            <Heart className="mx-auto mb-2" /> Cultura
          </button>
          <button onClick={() => setCurrentModule('contract')} className="glass-panel p-4 rounded-xl text-white hover:bg-red-600 transition-all hover:-translate-y-1">
            <Briefcase className="mx-auto mb-2" /> Tu Contrato
          </button>
          <button onClick={() => setCurrentModule('structure')} className="glass-panel p-4 rounded-xl text-white hover:bg-red-600 transition-all hover:-translate-y-1">
            <Layout className="mx-auto mb-2" /> Organigrama
          </button>
          <button onClick={() => setCurrentModule('smart')} className="glass-panel p-4 rounded-xl text-white hover:bg-red-600 transition-all hover:-translate-y-1">
            <Zap className="mx-auto mb-2" /> Smart Tools
          </button>
        </div>
      </div>
      <SerenitoBot message="¡Hola! Soy Serenito. Bienvenido a la Municipalidad del Futuro. ¿Comenzamos?" />
    </div>
  );

  // 2. MÓDULO "NUESTRA ESENCIA" (Cómics)
  const renderEssence = () => (
    <div className="h-full p-8 md:p-16 fade-in overflow-y-auto pb-32">
      <h2 className="text-4xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">Nuestra Esencia</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Valor 1: Respeto y Patrimonio */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl group">
          <div className="h-64 bg-slate-200 relative overflow-hidden">
             {/* Aquí iría la viñeta del cómic de Serenito en el Muro */}
             <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center text-white font-bold text-2xl">CÓMIC: Muro de Piedra</div>
             <img src="https://images.unsplash.com/photo-1599592233482-16e64df08826?q=80&w=2070" className="w-full h-full object-cover opacity-50" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Respeto y Patrimonio</h3>
            <p className="text-slate-600">"El verdadero artista respeta la historia". Serenito nos enseña a cuidar nuestro legado arquitectónico.</p>
          </div>
        </div>

        {/* Valor 2: Solidaridad y Medio Ambiente */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl group">
          <div className="h-64 bg-slate-200 relative overflow-hidden">
             {/* Aquí iría la viñeta de Fariño en el Faro */}
             <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center text-white font-bold text-2xl">CÓMIC: El Faro</div>
             <img src="https://images.unsplash.com/photo-1549610257-25d2595c52c0?q=80&w=2070" className="w-full h-full object-cover opacity-50" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sostenibilidad</h3>
            <p className="text-slate-600">Fariño cuida el Faro Monumental, recordándonos que la inclusión también es con nuestro entorno natural.</p>
          </div>
        </div>
      </div>
      <SerenitoBot message="Estos cómics representan el alma de nuestro servicio. ¡El respeto es clave!" />
    </div>
  );

  // 3. MÓDULO "TU CONTRATO Y EQUIPO" (Avatares)
  const renderContract = () => (
    <div className="h-full p-8 md:p-16 fade-in overflow-y-auto pb-32">
      <h2 className="text-4xl font-bold text-white mb-2 border-l-4 border-red-600 pl-4">Tu Modalidad</h2>
      <p className="text-slate-400 mb-12 ml-5">Selecciona tu tipo de contrato para conocer a tu guía.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Opción PLANTA - Don Joaco */}
        <button onClick={() => setUserProfile('Planta')} className={`p-8 rounded-3xl border-2 transition-all ${userProfile === 'Planta' ? 'bg-red-600 border-red-400 scale-105' : 'glass-panel border-slate-700 hover:bg-slate-800'}`}>
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
            {/* Avatar Don Joaco */}
            <span className="text-4xl flex items-center justify-center h-full">👴🏻</span>
          </div>
          <h3 className="text-xl font-bold text-white text-center">Planta</h3>
          <p className="text-center text-sm text-slate-300 mt-2">Guía: <strong>Don Joaco</strong></p>
        </button>

        {/* Opción CONTRATA - Milagros */}
        <button onClick={() => setUserProfile('Contrata')} className={`p-8 rounded-3xl border-2 transition-all ${userProfile === 'Contrata' ? 'bg-red-600 border-red-400 scale-105' : 'glass-panel border-slate-700 hover:bg-slate-800'}`}>
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
            {/* Avatar Milagros */}
            <span className="text-4xl flex items-center justify-center h-full">👩🏻‍💼</span>
          </div>
          <h3 className="text-xl font-bold text-white text-center">Contrata</h3>
          <p className="text-center text-sm text-slate-300 mt-2">Guía: <strong>Milagros</strong></p>
        </button>

        {/* Opción HONORARIOS - Compita */}
        <button onClick={() => setUserProfile('Honorarios')} className={`p-8 rounded-3xl border-2 transition-all ${userProfile === 'Honorarios' ? 'bg-red-600 border-red-400 scale-105' : 'glass-panel border-slate-700 hover:bg-slate-800'}`}>
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
            {/* Avatar Compita */}
            <span className="text-4xl flex items-center justify-center h-full">🧢</span>
          </div>
          <h3 className="text-xl font-bold text-white text-center">Honorarios</h3>
          <p className="text-center text-sm text-slate-300 mt-2">Guía: <strong>Compita</strong></p>
        </button>
      </div>

      {userProfile && (
        <div className="mt-8 bg-slate-800/50 p-6 rounded-2xl border border-red-600/30 animate-pulse">
          <p className="text-white text-center text-lg">Has seleccionado <strong>{userProfile}</strong>. Tu guía te explicará tus derechos y deberes a continuación...</p>
        </div>
      )}
      <SerenitoBot message="Cada modalidad tiene sus propias reglas. Elige la tuya para empezar." />
    </div>
  );

  // 4. MÓDULO "ESTRUCTURA MUNICIPAL" (Organigrama)
  const renderStructure = () => (
    <div className="h-full p-8 md:p-16 fade-in overflow-y-auto pb-32">
      <h2 className="text-4xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">Estructura IMLS</h2>
      
      <div className="relative bg-slate-800 rounded-3xl p-8 border border-slate-700">
        {/* Simulación Gráfica del Organigrama */}
        <div className="flex flex-col items-center gap-8">
           <div className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-red-900/50 w-64 text-center">ALCALDÍA</div>
           <div className="w-1 h-8 bg-slate-600"></div>
           <div className="w-full h-1 bg-slate-600 max-w-2xl"></div>
           <div className="flex flex-wrap justify-center gap-4">
             {['DIDECO', 'SECPLAN', 'JURÍDICA', 'DOM', 'TRÁNSITO', 'SALUD', 'EDUCACIÓN', 'SEGURIDAD'].map(dept => (
               <div key={dept} className="bg-white text-slate-900 px-4 py-3 rounded-lg font-bold text-sm w-32 text-center shadow hover:scale-110 transition-transform cursor-pointer hover:bg-yellow-400">
                 {dept}
               </div>
             ))}
           </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
            <h4 className="text-yellow-400 font-bold mb-2">🚑 Prevención de Riesgos</h4>
            <p className="text-slate-300 text-sm">Ubicados en el Zócalo. Contacto: anexo 5540.</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
            <h4 className="text-green-400 font-bold mb-2">🧘🏻‍♀️ Calidad de Vida</h4>
            <p className="text-slate-300 text-sm">Bienestar funcionario y actividades. Edificio Consistorial.</p>
          </div>
        </div>
      </div>
      <SerenitoBot message="Haz clic en cada dirección para ver sus funciones críticas." />
    </div>
  );

  // 5. MÓDULO "SMART CITY TOOLS" (Bus Red)
  const renderSmart = () => (
    <div className="h-full p-8 md:p-16 fade-in overflow-y-auto pb-32">
      <h2 className="text-4xl font-bold text-white mb-2 border-l-4 border-red-600 pl-4">Herramientas Smart City</h2>
      <p className="text-slate-400 mb-8 ml-5">Centro de entrenamiento tecnológico IMLS 2026.</p>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Metáfora del BUS RED */}
        <div className="relative h-80 w-full bg-slate-800 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
          <Bus size={120} className="text-red-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-4 text-center w-full text-slate-400 text-sm">
             Visualización: Bus Red Conectado
          </div>
          {/* Aquí iría la imagen 3D del Bus lleno de personajes */}
        </div>

        {/* Lista de Herramientas */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700 cursor-pointer transition-colors border border-slate-700">
            <div className="bg-red-600 p-3 rounded-lg"><Radio size={24} className="text-white"/></div>
            <div>
              <h4 className="text-white font-bold">Radio Digital Municipal</h4>
              <p className="text-slate-400 text-sm">Operación y locución.</p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700 cursor-pointer transition-colors border border-slate-700">
            <div className="bg-blue-600 p-3 rounded-lg"><Map size={24} className="text-white"/></div>
            <div>
              <h4 className="text-white font-bold">Tickets Georreferenciados</h4>
              <p className="text-slate-400 text-sm">Gestión de solicitudes vecinales.</p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700 cursor-pointer transition-colors border border-slate-700">
            <div className="bg-yellow-500 p-3 rounded-lg"><Bus size={24} className="text-white"/></div>
            <div>
              <h4 className="text-white font-bold">Planificador de Rutas</h4>
              <p className="text-slate-400 text-sm">Multimodal: Pie, Bici, Auto, Bus.</p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700 cursor-pointer transition-colors border border-slate-700">
            <div className="bg-purple-600 p-3 rounded-lg"><Zap size={24} className="text-white"/></div>
            <div>
              <h4 className="text-white font-bold">Asistente IA</h4>
              <p className="text-slate-400 text-sm">Automatización de trámites.</p>
            </div>
          </div>
        </div>
      </div>
      <SerenitoBot message="¡Súbete al Bus del Futuro! Aquí aprenderás a usar todas nuestras apps." />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-slate-900 overflow-hidden relative font-sans selection:bg-red-600 selection:text-white">
      {/* Botón Volver al Home (si no estamos en home) */}
      {currentModule !== 'home' && (
        <button 
          onClick={() => setCurrentModule('home')} 
          className="fixed top-6 left-6 z-50 bg-slate-800/80 backdrop-blur text-white px-4 py-2 rounded-full border border-slate-600 hover:bg-red-600 hover:border-red-600 transition-all flex items-center gap-2"
        >
          ← Volver al Inicio
        </button>
      )}

      {/* RENDERIZADO DINÁMICO */}
      {currentModule === 'home' && renderHome()}
      {currentModule === 'essence' && renderEssence()}
      {currentModule === 'contract' && renderContract()}
      {currentModule === 'structure' && renderStructure()}
      {currentModule === 'smart' && renderSmart()}

      <SmartFooter />
    </div>
  );
}
