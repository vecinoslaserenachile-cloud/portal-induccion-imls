import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, HelpCircle, XCircle 
} from 'lucide-react';

// --- CONFIGURACIÓN DE PREGUNTAS (EVALUACIÓN) ---
const QUIZ_DATA = [
  {
    question: "¿Cuál es uno de los valores principales de la IMLS?",
    options: ["Competencia feroz", "Probidad y Transparencia", "Trabajo individual"],
    correct: 1,
    feedback: "¡Exacto! La probidad es nuestro norte."
  },
  {
    question: "¿Qué Ley nos protege contra el acoso laboral?",
    options: ["Ley del Tránsito", "Ley Karin", "Ley de Rentas"],
    correct: 1,
    feedback: "Correcto. La Ley Karin asegura espacios seguros."
  }
];

const DEPARTAMENTOS = ["Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", "Jurídica", "Turismo"];

// --- COMPONENTES UI ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="text-sm hidden md:block">
        <p className="font-bold">Radio Municipal La Serena</p>
        <p className="text-xs text-slate-400">En vivo: Innovación Smart City</p>
      </div>
    </div>
    <div className="flex gap-4 text-xs text-slate-400 uppercase tracking-widest italic">Portal de Inducción IMLS 2026</div>
    <Music size={20} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
    <div className="h-full bg-red-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);

  const totalSteps = 8; 
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Si el paso es el video o quiz, no bloqueamos por scroll
    if (step === 1 || step >= 7) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
    }
  }, [step]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Ajustado para mayor sensibilidad (50px de margen)
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setCanAdvance(true);
    }
  };

  // PANTALLA 0: REGISTRO
  if (step === 0) return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="La Serena" />
        <div className="relative z-10 text-white p-12"><h1 className="text-6xl font-bold mb-4">IMLS 2026</h1><p className="text-2xl font-light">Innovación de Clase Mundial</p></div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido al Equipo</h2>
          <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Nombre Completo" onChange={(e) => setUserData({...userData, name: e.target.value})} />
          <select className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-500" onChange={(e) => setUserData({...userData, dept: e.target.value})}>
            <option value="">Departamento...</option>
            {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <button disabled={!userData.name || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-300 flex justify-between items-center">Ingresar <ChevronRight /></button>
        </div>
      </div>
    </div>
  );

  // LAYOUT INTERNO
  const ChapterLayout = ({ title, subtitle, text, image, youtubeId = null }) => (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      <div className="w-full md:w-1/2 flex flex-col h-screen pt-10">
        <div className="px-8 md:px-16 pt-8 pb-4 shrink-0">
          <div className="text-red-600 font-bold text-xs uppercase mb-2 tracking-widest">Capítulo {step}</div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{title}</h2>
          <h3 className="text-xl text-slate-500">{subtitle}</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-8 md:px-16 py-4 space-y-6 text-lg text-slate-600 custom-scrollbar" onScroll={handleScroll}>
          {text}
          <div className="h-20"></div>
          {!canAdvance && <p className="text-center text-sm text-red-500 animate-bounce font-bold italic">↓ Sigue bajando para desbloquear ↓</p>}
        </div>
        <div className="px-8 md:px-16 py-6 border-t bg-white flex items-center justify-between">
           <div className="text-sm">{canAdvance ? <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16}/> Lectura Lista</span> : <span className="text-gray-400 italic">Lee todo el contenido...</span>}</div>
           <button disabled={!canAdvance} onClick={() => setStep(prev => prev + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 disabled:bg-gray-300 flex items-center gap-2">Siguiente <ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="hidden md:block w-1/2 h-screen relative bg-slate-900">
        {youtubeId ? (
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        ) : (
          <img src={image} alt="Visual" className="w-full h-full object-cover opacity-80" />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout youtubeId="IHWkslPC-pQ" title="Saludo Institucional" subtitle="Bienvenida IMLS 2026" text={<><p>Este es el punto de partida de tu viaje. Mira el video de bienvenida para entender nuestra visión.</p><p>En la IMLS no solo trabajamos, servimos a una comunidad histórica con miras al futuro.</p></>} />;
    case 2: return <ChapterLayout image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" title="Nuestra Misión" subtitle="Valores Institucionales" text={<><p>Nuestra misión es transformar La Serena en una Smart City humana.</p><p><strong>Valores:</strong> Probidad, Transparencia, Innovación y Empatía.</p><p>Cada acción que realizas impacta en la calidad de vida de nuestros vecinos.</p><p>Buscamos la excelencia en cada trámite municipal.</p></>} />;
    case 3: return <ChapterLayout image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070" title="Ley Karin" subtitle="Seguridad y Respeto" text={<><p>El buen trato es ley. Garantizamos espacios libres de acoso laboral y sexual.</p><p>Cuidamos el clima organizacional para que trabajes con alegría.</p></>} />;
    case 7: return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center border-t-8 border-red-600">
          <Award size={80} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-bold mb-2">¡Felicitaciones {userData.name}!</h2>
          <p className="text-xl text-gray-600 mb-8">Has completado tu inducción en el área de {userData.dept}.</p>
          <div className="p-6 border-4 border-double border-gray-200 bg-gray-50 rounded-lg italic font-serif text-2xl mb-8">Certificado de Aprobación IMLS 2026</div>
          <button onClick={() => setStep(0)} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold">Finalizar y Cerrar</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
