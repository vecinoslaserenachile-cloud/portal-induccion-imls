import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, Radio, Music, Award, 
  ChevronDown, Star, Shield, Heart, DollarSign, FileText 
} from 'lucide-react';

// --- COMPONENTES ---
const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="flex flex-col">
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px] tracking-wide">Transmisión Oficial</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Smart City IMLS 2026</div>
    <div className="flex items-center gap-4 text-slate-400"><Music size={18} /></div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 7;

  // Detector de lectura
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isShort || isAtBottom) setCanAdvance(true);
    }
  };

  useEffect(() => {
    if (step === 0 || step === 1 || step === 7) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 1000);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // --- PLANTILLA ---
  const ChapterLayout = ({ title, subtitle, content, image, youtubeId }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden pb-16">
      <div className="fixed top-0 w-full h-1.5 bg-slate-800 z-50">
        <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
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
               <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle size={16}/> Leído</span> : 
               <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={16}/> Baja para avanzar</span>
             }
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2">
             Siguiente <ChevronRight size={18} />
           </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {youtubeId ? (
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&rel=0`} title="Video" frameBorder="0" allowFullScreen></iframe>
        ) : (
          <>
            <img src={image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070"} className="w-full h-full object-cover opacity-70" onLoad={checkProgress} alt="Visual" />
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Star size={12} className="text-yellow-400" /> Smart City View</div>
          </>
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- CONTENIDO ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-30"></div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-8">
        <Shield size={80} className="text-red-600 mb-6 drop-shadow-lg" />
        <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">IMLS 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-[0.5em] text-lg mb-12">Portal de Inducción</p>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-md w-full space-y-4 shadow-2xl">
          <input className="w-full p-4 border-none rounded-xl bg-white/90 text-slate-900 font-bold placeholder:text-slate-500" placeholder="Nombre Completo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
          <select className="w-full p-4 border-none rounded-xl bg-white/90 text-slate-900 font-bold" onChange={e => setUserData({...userData, dept: e.target.value})}>
            <option value="">Departamento...</option>
            <option value="DIDECO">DIDECO</option>
            <option value="Salud">Salud</option>
            <option value="Educación">Educación</option>
          </select>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-between px-6">
            COMENZAR <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje Alcaldesa" youtubeId="yA_86g9Bq_U" content={<p>Bienvenido al equipo IMLS. Escucha el mensaje oficial de nuestra autoridad comunal.</p>} />;
    case 2: return <ChapterLayout title="Estrategia" subtitle="Gobierno Comunal" content={<><p><strong>El Concejo:</strong> Órgano fiscalizador.</p><p><strong>Puntos Estratégicos:</strong> Modernización Digital, Seguridad Integral y Desarrollo Sostenible.</p></>} image="https://images.unsplash.com/photo-1555848960-8c3ed4cf32a0?q=80&w=2070" />;
    case 3: return <ChapterLayout title="Ley Karin" subtitle="Espacios Seguros" content={<p>Tolerancia Cero al acoso laboral y sexual (Ley 21.643).</p>} image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070" />;
    case 4: return <ChapterLayout title="Remuneraciones" subtitle="Tu Sueldo" content={<p>Conoce tu liquidación: Sueldo base, asignaciones y descuentos legales.</p>} image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070" />;
    case 5: return <ChapterLayout title="Reglamento" subtitle="Interno" content={<p>Control horario, credenciales y probidad administrativa.</p>} image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070" />;
    case 6: return <ChapterLayout title="Seguridad" subtitle="Laboral" content={<p>Prevención de riesgos, EPP y protocolos de emergencia.</p>} image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070" />;
    case 7: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white p-4 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070')] bg-cover opacity-20"></div>
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center max-w-2xl w-full relative z-10 shadow-2xl">
          <Award size={100} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-4 uppercase">¡Inducción Aprobada!</h2>
          <p className="text-xl text-slate-500 mb-8">Felicidades, {userData.nombres}.</p>
          <button onClick={() => setStep(0)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-xl">Reiniciar</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}
