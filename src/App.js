import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown, Shield, Users, Heart, Star, Layout, Database
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const DEPARTAMENTOS = ["Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", "SECPLAN", "Jurídica", "Control", "Salud", "Educación", "Seguridad Ciudadana", "Aseo y Ornato", "Turismo", "Cultura", "Deportes", "Comunicaciones", "Eventos y RRPP"];

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

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 15;
  const progress = (step / totalSteps) * 100;

  // SOLUCIÓN AL BLOQUEO: Validación de scroll inteligente
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Si el contenido es más pequeño que la pantalla o ya llegaste al final, libera el botón
      const isShort = el.scrollHeight <= el.clientHeight + 20;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      
      if (isShort || isAtBottom) {
        setCanAdvance(true);
      }
    }
  };

  useEffect(() => {
    // Pasos que no necesitan scroll (Bienvenida, Registro, Final)
    if (step === 0 || step === 1 || step >= 14) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Re-revisamos cada vez que cambie el paso después de un breve delay
      setTimeout(checkProgress, 800); 
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Pantalla de Registro
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
       {/* ... Tu código de registro lateral ... */}
       <div className="flex-1 p-6 lg:p-12 bg-white flex items-center justify-center">
         <div className="max-w-2xl w-full space-y-6">
            <h2 className="text-3xl font-bold">Ficha del Funcionario</h2>
            <input className="w-full p-4 border rounded-2xl" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <select className="w-full p-4 border rounded-2xl" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona Departamento...</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-slate-900 text-white p-5 rounded-3xl font-bold">Ingresar <ChevronRight className="inline"/></button>
         </div>
       </div>
       <RadioPlayer />
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col h-full pt-12">
        <div className="px-8 lg:px-16 pt-8 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Capítulo {step} de {totalSteps}</p>
          <h2 className="text-4xl font-bold text-slate-900">{title}</h2>
          <h3 className="text-lg text-slate-400 italic">{subtitle}</h3>
        </div>

        {/* CONTENEDOR DE SCROLL: Aquí es donde se "pegaba" */}
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 text-xl text-slate-600 leading-relaxed">
          {content}
          <div className="h-20"></div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t bg-slate-50 flex items-center justify-between h-24">
           <div className="text-xs font-bold uppercase">
             {canAdvance ? <span className="text-green-600 flex items-center gap-2"><CheckCircle /> Validado</span> : <span className="text-red-500 animate-bounce">Baja para avanzar</span>}
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(prev => prev + 1)} className="bg-red-600 text-white px-10 py-3 rounded-full font-bold disabled:bg-slate-300">
             Siguiente
           </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-900 relative">
        {youtubeId ? (
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} frameBorder="0" allowFullScreen></iframe>
        ) : (
          <img src={image} className="w-full h-full object-cover opacity-60" onLoad={checkProgress} />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" youtubeId="yA_86g9Bq_U" content={<p>¡Hola! Soy Serenito...</p>} />;
    case 2: return <ChapterLayout title="¿Qué es la IMLS?" image="PINTURA_LA_SERENA.jpg" content={<p>Segunda ciudad más antigua de Chile...</p>} />;
    
    // CAPÍTULO 3: El que se quedaba pegado
    case 3: return <ChapterLayout 
                title="Valores y Estrategia" 
                subtitle="La Lucha Municipalidad" 
                image="ESTRATEGIA_IMLS.png" 
                content={
                  <div className="space-y-4">
                    <p>Aquí va todo el texto de la lucha municipalidad.</p>
                    <p>Al añadir el evento onLoad en la imagen, el botón se activará apenas la imagen termine de cargar.</p>
                  </div>
                } 
              />;

    // --- AQUÍ PEGA TUS CASOS DEL 4 AL 13 ---
    
    case 14: return <ChapterLayout title="Evaluación" image="QUIZ.png" content={<p>Cuestionario final.</p>} />;
    case 15: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center">
          <Award size={80} className="mx-auto text-red-600 mb-4" />
          <h2 className="text-3xl font-black">¡INDUCCIÓN COMPLETADA!</h2>
          <p>Felicidades, {userData.nombres}.</p>
          <button onClick={() => setStep(0)} className="mt-6 bg-slate-900 text-white p-4 rounded-xl">Finalizar</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
