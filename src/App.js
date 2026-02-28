import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown, Shield, Users, Heart, Star, Layout, Database
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", "SECPLAN", "Jurídica", 
  "Control", "Salud", "Educación", "Seguridad Ciudadana", "Aseo y Ornato", 
  "Turismo", "Cultura", "Deportes", "Comunicaciones", "Eventos y RRPP"
];

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="text-xs">
        <p className="font-bold leading-none">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px]">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Smart City IMLS 2026</div>
    <Music size={20} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
  </div>
);

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ 
    nombres: '', apellidos: '', fechaNac: '', email: '', 
    direccion: '', whatsapp: '', dept: '' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 15;
  const progress = (step / totalSteps) * 100;

  // NUEVA FUNCIÓN: Valida si hay scroll o si el texto es corto
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isShort = el.scrollHeight <= el.clientHeight + 10;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isShort || isAtBottom) setCanAdvance(true);
    }
  };

  useEffect(() => {
    if (step === 0 || step === 1 || step >= 14) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Damos 500ms para que el texto aparezca antes de validar
      setTimeout(checkProgress, 500);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Pantalla 0: Registro (Mantenemos tu diseño)
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      <div className="lg:w-1/3 bg-slate-900 p-12 flex flex-col justify-center text-white relative h-1/3 lg:h-full shrink-0">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="La Serena" />
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-5xl font-black mb-2 tracking-tighter">IMLS 2026</h1>
          <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Portal de Inducción</p>
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-slate-800">Ficha del Funcionario</h2>
            <p className="text-slate-500">Completa tus datos para iniciar el proceso de {totalSteps} capítulos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" type="date" onChange={e => setUserData({...userData, fechaNac: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="WhatsApp +569..." onChange={e => setUserData({...userData, whatsapp: e.target.value})} />
            <input className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" type="email" placeholder="Correo electrónico institucional" onChange={e => setUserData({...userData, email: e.target.value})} />
            <input className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Dirección particular" onChange={e => setUserData({...userData, direccion: e.target.value})} />
            <select className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu Departamento...</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-slate-900 text-white p-5 rounded-3xl font-bold hover:bg-red-600 disabled:bg-slate-200 transition-all shadow-xl flex justify-between items-center px-8">
            Ingresar al Portal <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      <div className="w-full lg:w-1/2 flex flex-col h-[60%] lg:h-full pt-12">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Capítulo {step} de {totalSteps}</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mt-1 leading-tight">{title}</h2>
          <h3 className="text-lg text-slate-400 font-light italic">{subtitle}</h3>
        </div>
        <div 
          ref={scrollRef} 
          onScroll={checkProgress} 
          className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-xl text-slate-600 leading-relaxed custom-scrollbar"
        >
          {content}
          <div className="h-40"></div>
        </div>
        <div className="px-8 lg:px-16 py-6 border-t bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle /> Lectura Validada</span> : <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown /> Baja para avanzar</span>}
           </div>
           <button 
             disabled={!canAdvance} 
             onClick={() => setStep(prev => prev + 1)} 
             className="bg-red-600 text-white px-10 py-3 rounded-full font-bold shadow-2xl hover:bg-red-700 disabled:bg-slate-300 transition-all flex items-center gap-2"
           >
             Siguiente <ChevronRight />
           </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-[40%] lg:h-full bg-slate-900 flex items-center justify-center relative">
        {youtubeId ? (
          <div className={`${isVertical ? 'h-[90%] aspect-[9/16]' : 'w-full h-full'} bg-black`}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&modestbranding=1&controls=0`} title="Video" frameBorder="0" allowFullScreen></iframe>
          </div>
        ) : (
          <img src={image} alt="IMLS" className="w-full h-full object-cover opacity-60 transition-opacity duration-1000" />
        )}
        <div className="absolute top-6 right-6 bg-slate-900/50 p-3 rounded-full text-white text-xs font-bold uppercase tracking-widest">Visualización Smart City</div>
      </div>
      <RadioPlayer />
    </div>
  );

  // --- LOS 15 PASOS DE TU INDUCCIÓN ---
  switch (step) {
    case 1: return <ChapterLayout isVertical={true} youtubeId="yA_86g9Bq_U" title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" content={<p>¡Hola! Soy Serenito y te doy la bienvenida. Hoy es el inicio de tu carrera en la Municipalidad más innovadora de Chile. Nuestra Alcaldesa tiene un mensaje especial para ti.</p>} />;
    case 2: return <ChapterLayout image="PINTURA_LA_SERENA.jpg" title="¿Qué es la IMLS?" subtitle="Misión y Visión" content={<p>La Ilustre Municipalidad de La Serena es la segunda ciudad más antigua de Chile, pero nuestra mente está en el futuro.</p>} />;
    case 3: return <ChapterLayout image="ESTRATEGIA_IMLS.png" title="Valores y Estrategia" subtitle="Modelo Asset Light" content={<p>Priorizamos la eficiencia. En el área de Eventos usamos el modelo "Asset Light": arrendamos lo grande para invertir en las personas.</p>} />;
    // ... (Aquí siguen tus casos 4 al 13 que tienes en tu código)
    case 14: return <ChapterLayout image="QUIZ_ICONO.png" title="Evaluación" subtitle="Mide tu aprendizaje" content={<p>¡Llegaste al nivel final! Responde este breve cuestionario didáctico para obtener tu certificado.</p>} />;
    case 15: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full border-b-8 border-red-600 relative z-10 text-center">
          <Award size={100} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-2 leading-tight uppercase">¡Excelente Trabajo!</h2>
          <p className="text-xl text-slate-500 mb-8 font-medium italic">Felicidades, {userData.nombres}. Has completado la inducción IMLS 2026.</p>
          <div className="p-8 border-4 border-double border-slate-100 bg-slate-50 rounded-3xl text-3xl font-serif">Certificado de Aprobación</div>
          <button onClick={() => setStep(0)} className="mt-8 w-full bg-slate-900 text-white py-5 rounded-2xl font-bold">Reiniciar Sistema</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
