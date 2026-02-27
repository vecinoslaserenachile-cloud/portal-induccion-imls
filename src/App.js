import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown
} from 'lucide-react';

const DEPARTAMENTOS = ["Alcaldía", "DIDECO", "DOM", "Tránsito", "SECPLAN", "Jurídica", "Salud", "Turismo"];

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-1.5 rounded-full animate-pulse"><Radio size={14} /></div>
      <div className="text-[10px] md:text-xs">
        <p className="font-bold leading-none">Radio Digital La Serena</p>
      </div>
    </div>
    <div className="hidden md:block text-[9px] text-slate-500 uppercase tracking-widest">IMLS 2026</div>
    <Music size={16} className="text-slate-500" />
  </div>
);

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', email: '', whatsapp: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  // FUNCIÓN CRÍTICA: Verifica si el texto es corto o si se llegó al final
  const checkScrollStatus = () => {
    const el = scrollRef.current;
    if (el) {
      const isNotScrollable = el.scrollHeight <= el.clientHeight + 10;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      
      if (isNotScrollable || isAtBottom) {
        setCanAdvance(true);
      }
    }
  };

  useEffect(() => {
    if (step === 0 || step === 1 || step >= 6) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Damos un tiempo a que el contenido cargue antes de verificar
      setTimeout(checkScrollStatus, 500);
    }
  }, [step]);

  // PANTALLA DE INICIO (Con todos los campos que pediste)
  if (step === 0) return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100">
      <div className="lg:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="La Serena" />
        <h1 className="text-5xl font-black relative z-10">IMLS 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-widest mt-2 relative z-10 text-sm">Registro de Inducción</p>
      </div>
      <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            <input className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" type="email" placeholder="Correo electrónico" onChange={e => setUserData({...userData, email: e.target.value})} />
            <input className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" placeholder="WhatsApp (+569...)" onChange={e => setUserData({...userData, whatsapp: e.target.value})} />
            <select className="md:col-span-2 p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-red-500" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu Departamento</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-red-600 disabled:bg-slate-200 transition-all shadow-lg flex justify-center items-center gap-2">Comenzar <ChevronRight size={18}/></button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <div className="fixed top-0 w-full h-1 bg-slate-200 z-50"><div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div></div>
      <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-screen pt-10">
        <div className="px-6 lg:px-16 pt-6 shrink-0">
          <p className="text-red-600 font-bold text-[10px] uppercase tracking-widest">Capítulo {step}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{title}</h2>
          <h3 className="text-lg text-slate-400 font-light italic">{subtitle}</h3>
        </div>
        <div ref={scrollRef} onScroll={checkScrollStatus} className="flex-1 overflow-y-auto px-6 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed custom-scrollbar">
          {content}
          <div className="h-20"></div>
        </div>
        <div className="px-6 lg:px-16 py-4 border-t bg-slate-50 flex items-center justify-between shrink-0">
           <div className="text-xs font-bold">{canAdvance ? <span className="text-green-600 flex items-center gap-1">✅ Lectura Validada</span> : <span className="text-red-500 animate-bounce">↓ Baja para leer todo</span>}</div>
           <button disabled={!canAdvance} onClick={() => setStep(prev => prev + 1)} className="bg-red-600 text-white px-8 py-2 rounded-full font-bold shadow-xl hover:bg-red-700 disabled:bg-slate-300 transition-all flex items-center gap-2">Siguiente <ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen bg-slate-900 flex items-center justify-center">
        {youtubeId ? (
          <iframe className={`${isVertical ? 'h-[90%] aspect-[9/16]' : 'w-full h-full'}`} src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`} title="YouTube" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        ) : (
          <img src={image} alt="IMLS" className="w-full h-full object-cover opacity-60" />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout youtubeId="IHWkslPC-pQ" title="Bienvenida" subtitle="Mensaje Institucional" content={<p>Bienvenido al equipo municipal. Como funcionario, tu labor es clave para el desarrollo de La Serena.</p>} />;
    case 2: return <ChapterLayout image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" title="Valores IMLS" subtitle="Nuestra Misión" content={<p>La Serena es pionera en el modelo Smart City en Chile. Nuestra misión es servir con probidad, transparencia y empatía.</p>} />;
    case 6: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white">
        <div className="bg-white text-slate-900 p-10 rounded-3xl max-w-lg w-full border-b-8 border-red-600 shadow-2xl">
          <Award size={60} className="mx-auto text-red-600 mb-4" />
          <h2 className="text-3xl font-black">¡INDUCCIÓN LISTA!</h2>
          <p className="mt-4 text-slate-500 italic">{userData.nombres}, has completado el proceso oficial para {userData.dept}.</p>
          <button onClick={() => setStep(0)} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Reiniciar</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
