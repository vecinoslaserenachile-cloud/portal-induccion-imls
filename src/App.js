import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Shield, Heart, Radio, Map, Award, BookOpen, Music 
} from 'lucide-react';

// --- DATOS DE CONFIGURACIÓN ---
const DEPARTAMENTOS = [
  "Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", 
  "Jurídica", "Administración y Finanzas", "Secplan", 
  "Gestión de Riesgos", "Salud", "Educación", "Turismo"
];

// --- COMPONENTES UI ---

// 1. BARRA DE RADIO (Siempre visible)
const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse">
        <Radio size={16} />
      </div>
      <div className="text-sm">
        <p className="font-bold">Radio Municipal La Serena</p>
        <p className="text-xs text-slate-400">En vivo: "Innovación Smart City"</p>
      </div>
    </div>
    <Music size={20} className="text-slate-500" />
  </div>
);

// 2. BARRA DE PROGRESO
const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  return (
    <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
      <div 
        className="h-full bg-red-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// --- PANTALLAS DEL FLUJO ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', dept: '' });
  const [showCert, setShowCert] = useState(false);

  const totalSteps = 9; // Total de capítulos

  // Manejador de avance
  const nextStep = () => setStep(prev => prev + 1);

  // PANTALLA 0: REGISTRO (Login)
  if (step === 0) return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagen Lateral (Escritorio) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-800 items-center justify-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" alt="La Serena" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 text-white p-12">
          <h1 className="text-5xl font-bold mb-4">Bienvenido al Equipo</h1>
          <p className="text-xl">Ilustre Municipalidad de La Serena</p>
        </div>
      </div>
      
      {/* Formulario */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Iniciar Inducción</h2>
            <p className="text-slate-500 mt-2">Ingresa tus datos para generar tu certificado final.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nombre Completo</label>
              <input 
                type="text" 
                className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Ej: Rodrigo Godoy"
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Departamento</label>
              <select 
                className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                onChange={(e) => setUserData({...userData, dept: e.target.value})}
              >
                <option value="">Selecciona tu área...</option>
                {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
            <button 
              disabled={!userData.name || !userData.dept}
              onClick={nextStep}
              className="w-full bg-slate-900 text-white p-4 rounded-lg font-bold hover:bg-slate-800 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              Comenzar Experiencia <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ESTRUCTURA GENÉRICA PARA LOS CAPÍTULOS (Split Screen)
  const ChapterLayout = ({ title, subtitle, content, image, buttonText = "Continuar" }) => (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative pb-16">
      <ProgressBar current={step} total={totalSteps} />
      
      {/* Contenido (Izquierda en Desktop, Arriba en Móvil) */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center order-2 md:order-1">
        <div className="uppercase tracking-wide text-sm text-red-600 font-bold mb-2">Capítulo {step} de {totalSteps}</div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{title}</h2>
        <h3 className="text-xl text-slate-600 mb-6 font-semibold">{subtitle}</h3>
        <div className="text-slate-600 space-y-4 mb-8 text-lg leading-relaxed">
          {content}
        </div>
        <button 
          onClick={nextStep} 
          className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition-transform flex items-center w-fit gap-2"
        >
          {buttonText} <ChevronRight />
        </button>
      </div>

      {/* Imagen (Derecha en Desktop, Abajo en Móvil) */}
      <div className="w-full md:w-1/2 h-64 md:h-auto order-1 md:order-2 relative">
        <img src={image} alt="Visual" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent md:bg-gradient-to-l"></div>
      </div>

      <RadioPlayer />
    </div>
  );

  // --- LOGICA DE PASOS (Switch) ---

  switch (step) {
    case 1: // VIDEO ALCALDESA
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4 pb-20">
          <ProgressBar current={step} total={totalSteps} />
          <div className="w-full max-w-5xl aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer border border-slate-700">
             {/* SIMULACIÓN VIDEO */}
             <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                <Play size={80} className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h2 className="text-2xl font-bold">Saludo de la Alcaldesa</h2>
                <p className="opacity-70">Haz clic para reproducir</p>
             </div>
             <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974" className="w-full h-full object-cover opacity-40" alt="Video Placeholder" />
          </div>
          <button onClick={nextStep} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 flex gap-2">
            Continuar <ChevronRight />
          </button>
          <RadioPlayer />
        </div>
      );

    case 2: // MISIÓN Y VISIÓN
      return <ChapterLayout 
        title="Nuestra Esencia Municipal" 
        subtitle="Misión, Visión y Valores Estratégicos"
        content={<>
          <p>Somos el corazón de La Serena. Nuestra misión es brindar un servicio de excelencia, cercano y transparente.</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Probidad:</strong> Actuar siempre con rectitud.</li>
            <li><strong>Cercanía:</strong> Escuchar al vecino.</li>
            <li><strong>Innovación:</strong> Smart City al servicio de las personas.</li>
          </ul>
        </>}
        image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
      />;

    case 3: // ORGANIGRAMA Y AUTORIDADES
      return <ChapterLayout 
        title="Autoridades y Estructura" 
        subtitle="Quiénes lideran nuestra comuna"
        content={<>
          <p>La Alcaldesa y el Concejo Municipal definen el rumbo. Las Direcciones (DIDECO, DOM, Tránsito) ejecutan las obras.</p>
          <p>Tu rol en <strong>{userData.dept}</strong> es fundamental para engranar con el resto de la maquinaria municipal.</p>
        </>}
        image="https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=2033" 
      />;

    case 4: // LEY KARIN Y SEGURIDAD
      return <ChapterLayout 
        title="Normativa y Convivencia" 
        subtitle="Ley Karin, Seguridad y Respeto"
        content={<>
          <p>Garantizamos espacios libres de acoso y violencia. La <strong>Ley Karin</strong> nos protege a todos.</p>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 my-4">
            <p className="text-sm italic">"El respeto es la base de nuestra organización. Cuidamos a quienes cuidan la ciudad."</p>
          </div>
        </>}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070" 
      />;

    case 5: // HABILIDADES BLANDAS
      return <ChapterLayout 
        title="El Sello del Funcionario" 
        subtitle="Cordialidad, Alegría y Buen Trato"
        content={<>
          <p>No solo administramos, acogemos. Un "Buenos días" con una sonrisa cambia la experiencia del vecino.</p>
          <p>Buscamos soluciones, no problemas. La empatía es tu herramienta más poderosa.</p>
        </>}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784" 
      />;

    case 6: // REPUTACIÓN 360
      return <ChapterLayout 
        title="Reputación 360°" 
        subtitle="Mapa de Públicos y Confianza"
        content={<>
          <p>La imagen del municipio la construimos todos, todos los días. Desde el personal de aseo hasta la dirección.</p>
          <p>Gestionamos nuestra reputación ante vecinos, turistas, inversionistas y el gobierno central.</p>
        </>}
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932" 
      />;

    case 7: // CAMPAÑA Y PERSONAJES
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 pb-24 text-center">
           <ProgressBar current={step} total={totalSteps} />
           <h2 className="text-4xl font-bold mb-8">Conoce a tus Compañeros Digitales</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
              {['Serenito', 'Don Joaco', 'Milagros', 'Compita'].map((char) => (
                <div key={char} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 transition-colors cursor-pointer group">
                  <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 group-hover:bg-red-600 transition-colors flex items-center justify-center">
                    <User size={32} />
                  </div>
                  <h3 className="font-bold text-xl">{char}</h3>
                </div>
              ))}
           </div>
           <button onClick={nextStep} className="mt-12 bg-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-700 flex gap-2">
             Finalizar Inducción <CheckCircle />
           </button>
           <RadioPlayer />
        </div>
      );

    case 8: // CERTIFICADO Y FIN
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pb-20">
          <ProgressBar current={step} total={totalSteps} />
          
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tarjeta de Certificado */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-red-600 text-center">
              <Award size={64} className="text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">¡Inducción Completada!</h2>
              <div className="my-6 p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Certificado de Aprobación</p>
                <h3 className="text-3xl font-script font-bold text-slate-900">{userData.name}</h3>
                <p className="text-gray-600 mt-2">{userData.dept} - IMLS 2026</p>
              </div>
              <button className="bg-slate-900 text-white w-full py-3 rounded-lg font-bold hover:bg-slate-800">
                Descargar PDF
              </button>
            </div>

            {/* Panel Smart City (El Futuro) */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Map size={24} className="text-red-500"/> Herramientas Smart City
                </h3>
                <p className="text-slate-400 mb-6">Tu cuenta ha sido habilitada. Ya puedes acceder a las plataformas de gestión.</p>
                <div className="space-y-3">
                  <div className="bg-slate-800 p-3 rounded flex items-center gap-3 cursor-pointer hover:bg-slate-700">
                    <Radio size={20} className="text-red-400"/> Consola Radio Digital
                  </div>
                  <div className="bg-slate-800 p-3 rounded flex items-center gap-3 cursor-pointer hover:bg-slate-700">
                    <MapPin size={20} className="text-blue-400"/> Tickets Georreferenciados
                  </div>
                  <div className="bg-slate-800 p-3 rounded flex items-center gap-3 cursor-pointer hover:bg-slate-700">
                    <BookOpen size={20} className="text-green-400"/> Biblioteca Virtual
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
                Innovación Municipal de Clase Mundial
              </div>
            </div>
          </div>
          <RadioPlayer />
        </div>
      );

    default:
      return null;
  }
}

export default App;
