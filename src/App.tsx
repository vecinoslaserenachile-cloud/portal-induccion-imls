import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Eye, Info, HardHat, BookOpen, Globe, PenTool
} from 'lucide-react';

// --- DATA MUNICIPAL ---
const DEPARTAMENTOS = ["Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", "DIDECO", "Dirección de Obras (DOM)", "Gestión de Personas", "Seguridad Ciudadana", "Tránsito", "Turismo", "Servicios a la Comunidad", "Salud", "Educación"];

const CONCEJALES = ["Cristian Marín", "Rayen Pojomovsky", "Alejandro Astudillo", "Gladys Marín", "Francisca Barahona", "María Teresita Prouvay", "Camilo Araya", "María Marcela Damke", "Matías Espinosa", "Luisa Jinete"];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso y violencia laboral." },
  { q: "¿Organismo de seguridad laboral?", options: ["ACHS", "Mutual de Seguridad", "ISL"], ans: 1, explanation: "Estamos adheridos a la Mutual de Seguridad CChC." },
  { q: "¿Dónde evacuar por Tsunami?", options: ["Al Faro", "Cota 30 (Av. Cisternas)", "Playa"], ans: 1, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Quién diseña proyectos Smart City?", options: ["SECPLAN", "DIDECO", "Tránsito"], ans: 0, explanation: "SECPLAN es el cerebro técnico de la planificación." },
  { q: "¿Qué es RDMLS?", options: ["Radio Digital", "Una oficina", "Un trámite"], ans: 0, explanation: "Radio Digital Municipal La Serena." },
  { q: "¿Valor intransable?", options: ["Rapidez", "Probidad", "Simpatía"], ans: 1, explanation: "La Probidad es la base ética de nuestra función." },
  { q: "¿Qué hacer al terminar?", options: ["Irse", "Unirse a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a nuestras redes y portales." },
];

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', 
    dept: 'SECPLAN', cargo: 'Director de Innovación', email: 'rodrigo.godoy@laserena.cl' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: any) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 50) {
          setCanAdvance(true);
        }
      }, 1000);
    }
    window.scrollTo(0, 0);
    if(scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    if (idx === QUESTIONS[quizIndex].ans) {
      setQuizState('correct');
      setScore(s => s + 1);
    } else {
      setQuizState('wrong');
    }
  };

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_20px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* VISUAL (Móvil: Arriba, PC: Izq) */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5 z-10">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10 flex items-center justify-center relative">
             {visual}
           </div>
        </div>

        {/* CONTENIDO (Móvil: Abajo, PC: Der) */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden relative z-20">
          <div className="px-8 lg:px-16 pt-10 pb-6 shrink-0 border-b border-white/5 bg-slate-950/95 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">PASO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">INDUCCIÓN IMLS</span>
             </div>
             <h2 className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tighter uppercase italic mb-1">{title}</h2>
             <h3 className="text-lg lg:text-2xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8 scroll-smooth">
            <div className="space-y-10 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify pb-32">
              {content}
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 lg:h-28 shrink-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-50 absolute bottom-0 w-full shadow-2xl">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 p-4 transition-colors">
            <ChevronLeft size={20}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-6">
            {!canAdvance && (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={20}/> Baja para avanzar
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-10 py-4 lg:px-14 lg:py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3 text-xs lg:text-sm uppercase tracking-[0.2em] transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50' : 'bg-white/10 text-slate-600 cursor-not-allowed'}
              `}
            >
              {canAdvance && <CheckCircle size={18} className="text-white animate-bounce"/>}
              SIGUIENTE <ArrowRight size={18} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- PANTALLA 0: LOGIN ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-30 blur-md scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center p-8 gap-16">
        <div className="text-center md:text-left space-y-8 flex-1">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" onError={(e) => e.currentTarget.style.display='none'} />
          <h1 className="text-6xl lg:text-[8rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs pl-4 border-l-4 border-red-600 mt-6">Smart City • Patrimonio</p>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-500">
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl mb-6 flex items-center gap-4 uppercase tracking-tighter border-b border-white/5 pb-4"><User className="text-red-600" size={32}/> Acceso</h3>
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm outline-none focus:border-red-600 bg-slate-900" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all uppercase text-lg mt-4 flex items-center justify-center gap-3">INGRESAR <ArrowRight size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // 1. VIDEO (NATIVO, SIN SCRIPTS RAROS)
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
          <iframe 
            className="w-full h-full" 
            src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1" 
            title="Mensaje Alcaldesa" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      }
      content={<><p className="font-black text-5xl text-white mb-8 italic tracking-tighter">¡Hola, {userData.nombres}!</p><p>Te damos la bienvenida a la **Ilustre Municipalidad de La Serena**. Te sumas a una institución con más de 480 años de historia, pero con una visión de futuro moderna e innovadora.</p><div className="bg-red-600/20 p-8 rounded-3xl border-l-4 border-red-600 italic text-xl text-red-100">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos."</div><p className="text-slate-400 text-sm mt-4">Dale play al video para ver el saludo oficial.</p></>} 
    />;

    case 2: return <ChapterLayout title="Estrategia" subtitle="Misión y Visión" 
      visual={<div className="flex flex-col gap-10 items-center p-12 text-center"><Target size={140} className="text-red-600 animate-pulse"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white leading-none italic">RUMBO<br/>2026</h4></div>}
      content={<><section className="space-y-4"><h4 className="text-red-500 font-black text-2xl uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-4"><Star/> Misión</h4><p className="font-light text-xl">Administrar la comuna asegurando la participación de la comunidad en su progreso. Entregar servicios de alta calidad, con eficiencia, transparencia y calidez humana.</p></section><section className="space-y-4 pt-10"><h4 className="text-orange-500 font-black text-2xl uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-4"><Landmark/> Visión</h4><p className="font-light text-xl">Ser una comuna líder en desarrollo sostenible y Smart City, reconocida por su respeto al patrimonio y por brindar calidad de vida.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-4 p-6 w-full h-full overflow-y-auto">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center text-[10px] font-black uppercase flex flex-col items-center justify-center hover:bg-red-600 transition-colors shadow-lg"><User size={24} className="mb-2 text-red-500 group-hover:text-white"/><span className="text-white">{c}</span></div>)}</div>}
      content={<><p>El **Concejo Municipal** fiscaliza la gestión y aprueba normas locales. Está compuesto por 10 concejales electos.</p><div className="bg-yellow-500/10 p-8 rounded-3xl border border-yellow-500/20 space-y-6 mt-4"><h4 className="text-yellow-500 font-black text-2xl uppercase flex items-center gap-4 italic"><Shield/> Funciones</h4><ul className="space-y-4 font-light text-lg"><li>• Fiscalizar planes y programas.</li><li>• Aprobar el presupuesto anual.</li><li>• Dictar ordenanzas comunales.</li></ul></div></>} 
    />;

    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center p-8"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]" onError={(e) => e.currentTarget.src='https://placehold.co/600x800/111/fff?text=Organigrama'}/></div>}
      content={<><p className="text-3xl font-black text-white italic border-l-4 border-red-600 pl-4 uppercase tracking-tighter mb-8">Red de Servicio:</p><div className="grid gap-4 mt-6">{DEPARTAMENTOS.slice(0, 6).map((d, i) => (<div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><h4 className="font-black text-white uppercase text-xl">{d}</h4></div>))}</div></>} 
    />;

    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital" 
      visual={<div className="w-full h-full flex flex-col items-center justify-center p-8"><div className="bg-white text-slate-950 font-black p-10 rounded-full mb-10 text-4xl shadow-2xl">IMLS</div><div className="flex gap-6 w-full justify-center"><div className="bg-blue-600/30 p-6 rounded-3xl border border-blue-500/50 flex flex-col items-center gap-2 w-1/2"><Users size={30}/><span className="font-black uppercase text-xs">VECINOS</span></div><div className="bg-green-600/30 p-6 rounded-3xl border border-green-500/50 flex flex-col items-center gap-2 w-1/2"><Landmark size={30}/><span className="font-black uppercase text-xs">ESTADO</span></div></div></div>}
      content={<><p className="text-2xl font-bold text-white uppercase italic tracking-tighter">Tecnología al Servicio.</p><p>No somos una isla. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central. Nuestra gestión se coordina con el Gobierno Regional y el sector privado.</p><div className="mt-6 p-6 bg-blue-900/20 rounded-2xl border border-blue-500/30"><p className="italic text-lg">"Nuestra meta es una ciudad conectada, segura y transparente."</p></div></>} 
    />;

    case 6: return <ChapterLayout title="Seguridad" subtitle="Línea 1420" 
      visual={<div className="p-12 text-center animate-pulse"><Phone size={140} className="text-red-600 mx-auto"/><h4 className="text-white font-black text-[7rem] mt-6 tracking-tighter italic leading-none shadow-2xl">1420</h4></div>}
      content={
        <>
          <p className="text-3xl font-black text-white mb-8 uppercase italic tracking-tighter">Tu tranquilidad es prioridad.</p>
          <p className="text-xl font-light mb-8">Seguridad Ciudadana despliega patrullajes preventivos y monitorea cámaras con IA las 24 horas.</p>
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8"><div className="flex gap-6 items-center"><div className="bg-red-600 p-6 rounded-2xl text-white shadow-lg"><Phone size={32}/></div><div><h4 className="font-black text-white text-3xl">1420</h4><p className="text-sm text-slate-400 uppercase font-black tracking-widest">Emergencias Municipales</p></div></div><div className="flex gap-6 items-center"><div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg"><Eye size={32}/></div><div><h4 className="font-black text-white text-2xl uppercase italic">Cámaras IA</h4><p className="text-sm text-slate-400 uppercase font-black tracking-widest">Monitoreo 24/7</p></div></div></div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Bienestar" subtitle="Calidad de Vida" 
      visual={<div className="p-12 text-center"><HeartHandshake size={150} className="text-red-600 mx-auto drop-shadow-2xl"/><h4 className="text-white font-black text-3xl mt-8 uppercase italic">PERSONAS<br/>PRIMERO</h4></div>}
      content={<><p className="text-2xl font-bold text-white mb-6">Red de apoyo para ti:</p><div className="space-y-6"><div className="p-6 border-2 border-green-500/30 bg-green-500/10 rounded-3xl flex gap-6 items-center"><Stethoscope size={40} className="text-green-500 shrink-0"/><div className="space-y-1"><h4 className="font-black text-white text-xl uppercase">Salud & Psicología</h4><p className="text-sm text-slate-400">Convenios, seguros y apoyo psicológico.</p></div></div><div className="p-6 border-2 border-blue-500/30 bg-blue-500/10 rounded-3xl flex gap-6 items-center"><Activity size={40} className="text-blue-500 shrink-0"/><div className="space-y-1"><h4 className="font-black text-white text-xl uppercase">Deportes</h4><p className="text-sm text-slate-400">Acceso a recintos y pausas activas.</p></div></div></div></>} 
    />;

    case 8: return <ChapterLayout title="Ley Karin" subtitle="Respeto (21.643)" 
      visual={<div className="p-12 text-center"><Shield size={150} className="text-pink-600 mx-auto"/><h4 className="font-bold text-pink-100 mt-6 text-3xl uppercase">Ley 21.643</h4></div>}
      content={<><p className="text-3xl font-black text-white mb-6 italic uppercase leading-none border-b border-white/10 pb-4">Tolerancia Cero.</p><p>La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. Protegemos tu integridad:</p><div className="grid gap-6 mt-8"><div className="bg-pink-600/10 p-6 rounded-3xl border border-pink-500/30 flex items-center gap-6"><AlertTriangle className="text-pink-500" size={32}/><div><h5 className="text-white font-black text-lg uppercase">Acoso Laboral</h5><p className="text-xs text-slate-400">Agresión u hostigamiento contra la dignidad.</p></div></div><div className="bg-pink-600/10 p-6 rounded-3xl border border-pink-500/30 flex items-center gap-6"><MessageCircle className="text-pink-500" size={32}/><div><h5 className="text-white font-black text-lg uppercase">Violencia</h5><p className="text-xs text-slate-400">Ejercida por terceros (usuarios/vecinos).</p></div></div></div></>} 
    />;

    case 9: return <ChapterLayout title="Protección" subtitle="Mutualidad y Emergencias" 
      visual={<div className="p-12"><HardHat size={150} className="text-yellow-500 mx-auto animate-bounce"/></div>}
      content={<><h4 className="text-yellow-500 font-black text-3xl uppercase tracking-tighter mb-6 border-b border-yellow-500/20 pb-4">Mutual de Seguridad</h4><p className="mb-6 font-bold text-xl">Si te lesionas (Ley 16.744):</p><div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6"><div className="flex gap-6 items-start"><div className="bg-yellow-500 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0">1</div><div><h5 className="font-black text-white text-xl">Avisa a Jefatura</h5><p className="text-sm mt-1 text-slate-400">De inmediato, por leve que sea el incidente.</p></div></div><div className="flex gap-6 items-start"><div className="bg-yellow-500 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0">2</div><div><h5 className="font-black text-white text-xl">Ir a Mutual CChC</h5><p className="text-sm mt-1 text-slate-400">Exige el registro médico oficial (DIAT).</p></div></div></div><div className="mt-10 bg-blue-600/20 p-6 rounded-3xl border border-blue-500/30"><h4 className="text-blue-400 font-black text-xl uppercase flex items-center gap-3 mb-2"><Radio size={30}/> Tsunami</h4><p className="text-sm">Ante sismo fuerte: **EVACUAR A COTA 30** (Av. Cisternas).</p></div></>} 
    />;

    case 10: return <ChapterLayout title="Educación" subtitle="Capacitación Continua" 
      visual={<div className="p-12 animate-in zoom-in duration-1000"><GraduationCap size={150} className="text-red-600 drop-shadow-[0_0_30px_red] animate-pulse"/></div>}
      content={<><p className="text-3xl font-black text-white mb-6 uppercase italic">Capacitación Continua.</p><p className="font-light">Impulsamos tu crecimiento profesional:</p><div className="grid gap-6 mt-8"><div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6"><BookOpen className="text-red-500" size={40}/><div><h4 className="text-white font-black text-xl uppercase">Academia</h4><p className="text-slate-400 text-xs mt-1">Cursos certificados de gestión pública.</p></div></div><div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6"><Zap className="text-orange-500" size={40}/><div><h4 className="text-white font-black text-xl uppercase">Innovación</h4><p className="text-slate-400 text-xs mt-1">Talleres de soluciones digitales.</p></div></div></div></>} 
    />;

    // 11. QUIZ
    case 11: return (
      <div className="h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 w-full max-w-4xl rounded-[3rem] border border-white/10 flex flex-col h-[80vh] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-white/5"><div className="h-full bg-red-600 transition-all" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           
           {!quizFinished ? (
             <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-hidden">
               <div className="flex justify-between items-center mb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>EVALUACIÓN</span><span>{quizIndex + 1} / 10</span></div>
               <h3 className="text-xl lg:text-3xl font-black text-white leading-tight mb-6">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-5 rounded-2xl border-2 font-bold text-sm lg:text-lg transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-400' : 'opacity-30 grayscale text-white'}`}>{opt}</button>
                 ))}
               </div>

               {quizState !== 'waiting' && (
                 <div className="mt-4 p-4 rounded-2xl bg-white/5 border-l-4 border-red-600 shrink-0">
                    <p className="text-white text-xs font-light italic">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-3 bg-white text-slate-950 p-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all">Siguiente</button>
                 </div>
               )}
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
               <Award size={100} className="text-yellow-500 mb-8 animate-bounce" />
               <h2 className="text-5xl font-black text-white mb-6 uppercase italic">¡APROBADO!</h2>
               <p className="text-slate-400 mb-10 text-lg">Has completado la inducción 2026.</p>
               <button onClick={() => setStep(12)} className="bg-red-600 text-white py-4 px-10 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl hover:scale-105 transition-transform">Ver Diploma</button>
             </div>
           )}
        </div>
      </div>
    );

    // 12. DIPLOMA (DISEÑO FIERO ARREGLADO)
    case 12: return (
      <div className="h-[100dvh] bg-slate-950 flex flex-col overflow-y-auto font-sans p-6">
         <div className="w-full max-w-5xl mx-auto space-y-10 py-10">
            {/* DIPLOMA DE LUJO */}
            <div className="bg-white p-10 lg:p-20 rounded-[1rem] shadow-2xl text-slate-900 relative overflow-hidden border-[20px] border-double border-[#C5A065] relative">
               {/* Marca de agua */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                 <img src="/img/escudo.png" className="h-[500px]" />
               </div>

               <div className="flex justify-between items-center mb-12 border-b-2 border-[#C5A065]/30 pb-8 relative z-10">
                  <img src="/img/escudo.png" className="h-20" />
                  <img src="/img/innovacion.png" className="h-20" />
               </div>
               
               <div className="text-center relative z-10">
                 <h1 className="text-6xl lg:text-8xl font-serif font-black uppercase tracking-[0.1em] mb-4 leading-none text-[#1a1a1a]">DIPLOMA</h1>
                 <p className="text-xl italic text-slate-500 mb-12 font-serif">De Aprobación Inducción Corporativa 2026</p>
                 
                 <h2 className="text-4xl lg:text-6xl font-black uppercase mb-8 tracking-tighter text-[#C5A065] drop-shadow-sm">{userData.nombres} {userData.apellidos}</h2>
                 <p className="text-lg font-bold text-slate-600 uppercase tracking-[0.3em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
                 <p className="text-xl text-slate-800 font-serif italic mb-16 max-w-3xl mx-auto leading-relaxed">"Por haber cumplido con éxito los requerimientos formativos y éticos de ingreso a la Ilustre Municipalidad de La Serena."</p>
               </div>

               <div className="flex justify-between items-end mt-24 text-[10px] font-black uppercase text-slate-400 tracking-widest relative z-10 px-8">
                  <div className="text-center w-48">
                    <img src="/img/firma_personas.png" className="h-16 mx-auto mb-2 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/>
                    <div className="border-t-2 border-slate-300 pt-2">Gestión Personas</div>
                  </div>
                  <div className="text-center w-48">
                    <img src="/img/firma_alcaldesa.png" className="h-16 mx-auto mb-2 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/>
                    <div className="border-t-2 border-slate-300 pt-2">Alcaldía</div>
                  </div>
               </div>
            </div>

            {/* REDES */}
            <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 text-center">
               <h2 className="text-5xl font-black text-white mb-10 uppercase italic tracking-tighter">¡Sigue Conectado!</h2>
               <div className="grid gap-6">
                  <button className="bg-red-600 text-white w-full py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-lg"><Radio/> Radio Digital</button>
                  <button className="bg-blue-600 text-white w-full py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-lg"><Globe/> Portal Web</button>
               </div>
               <button onClick={() => setStep(0)} className="mt-16 text-slate-500 hover:text-white text-xs font-black uppercase tracking-[0.5em] flex items-center justify-center gap-2"><RefreshCw size={14}/> Cerrar Sesión</button>
            </div>
         </div>
      </div>
    );

    default: return null;
  }
}
