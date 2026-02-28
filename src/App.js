import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, Music, Award, ChevronDown, Star
} from 'lucide-react';

// --- COMPONENTES VISUALES ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="flex flex-col">
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px] tracking-wide">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Smart City IMLS 2026</div>
    <div className="flex items-center gap-4 text-slate-400">
      <Music size={18} />
    </div>
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-1.5 bg-slate-800 z-50">
    <div className="h-full bg-red-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(220,38,38,0.8)]" style={{ width: `${progress}%` }}></div>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);
  const totalSteps = 15;

  // Lógica ANTI-BLOQUEO (La solución definitiva)
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Si el contenido es corto o llegaste al fondo, libera el botón
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isShort || isAtBottom) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos automáticos (Inicio, Videos, Fin)
    if (step === 0 || step === 1 || step >= 14) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      setTimeout(checkProgress, 800); // Esperar a que cargue
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // --- LAYOUT GENÉRICO ---
  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null }) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden pb-16">
      <ProgressBar progress={(step / totalSteps) * 100} />
      
      <div className="w-full lg:w-1/2 flex flex-col h-full pt-12 relative z-10 bg-white">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase mb-2">Capítulo {step} de {totalSteps}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none tracking-tight">{title}</h2>
          <h3 className="text-xl text-slate-400 font-medium italic mt-2">{subtitle}</h3>
        </div>

        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed">
          {content}
          <div className="h-32"></div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? 
               <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle size={16}/> Listo</span> : 
               <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={16}/> Baja para avanzar</span>
             }
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(prev => prev + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2">
             Siguiente <ChevronRight size={18} />
           </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {youtubeId ? (
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0`} title="Video" frameBorder="0" allowFullScreen></iframe>
        ) : (
          <>
            <img src={image} alt="Visual" className="w-full h-full object-cover opacity-70" onLoad={checkProgress} />
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Star size={12} className="text-yellow-400" /> Smart City View
            </div>
          </>
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- PANTALLA 0: REGISTRO ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden">
      <div className="lg:w-1/3 bg-slate-900 p-12 flex flex-col justify-center text-white relative border-r border-slate-800">
        <h1 className="text-6xl font-black mb-2 tracking-tighter">IMLS 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Portal de Inducción</p>
      </div>
      <div className="flex-1 p-12 bg-white flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><User className="text-red-600"/> Ficha del Funcionario</h2>
          <input className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-900" placeholder="Nombre completo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
          <select className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-900" onChange={e => setUserData({...userData, dept: e.target.value})}>
            <option value="">Selecciona Departamento...</option>
            <option value="DIDECO">DIDECO</option>
            <option value="Salud">Salud</option>
          </select>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl flex justify-between px-8">
            Ingresar <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  // --- CONTENIDO ---
  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena" youtubeId="yA_86g9Bq_U" content={<p>¡Hola! Soy Serenito y te doy la bienvenida.</p>} />;
    case 2: return <ChapterLayout title="¿Qué es la IMLS?" subtitle="Historia" image="PINTURA_LA_SERENA.jpg" content={<p>La segunda ciudad más antigua...</p>} />;
    
    // AQUÍ ESTABA EL PROBLEMA, AHORA ARREGLADO:
    case 3: return <ChapterLayout title="Valores" subtitle="La Lucha Municipalidad" image="ESTRATEGIA_IMLS.png" content={
      <>
        <p><strong>Eficiencia ante todo.</strong> En esta nueva gestión, cada recurso cuenta.</p>
        <p>Nuestra "Lucha" es contra la burocracia lenta. Queremos soluciones rápidas, digitales y cercanas.</p>
        <p>Este contenido ya no se pegará porque el sistema detecta automáticamente cuando terminas de leer.</p>
      </>
    } />;

    // Puedes rellenar los pasos 4 al 14 aquí...
    default: 
      if (step < 15) return <ChapterLayout title={`Capítulo ${step}`} subtitle="En construcción" image="placeholder.jpg" content={<p>Contenido en desarrollo...</p>} />;
      
    case 15: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white p-4">
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center max-w-2xl w-full">
          <Award size={80} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-4">¡FELICIDADES!</h2>
          <p className="text-xl text-slate-500 mb-8">Has completado la inducción, {userData.nombres}.</p>
          <div className="p-6 bg-slate-100 rounded-xl border-2 border-slate-200 mb-8 font-serif text-2xl text-slate-700">Certificado de Aprobación IMLS 2026</div>
          <button onClick={() => setStep(0)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors">Reiniciar</button>
        </div>
        <RadioPlayer />
      </div>
    );
  }
}

export default App;
