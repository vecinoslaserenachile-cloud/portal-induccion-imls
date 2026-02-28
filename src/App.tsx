import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, Eye, ShieldCheck
} from 'lucide-react';

// --- BASE DE DATOS MUNICIPAL ---
const DEPARTAMENTOS = [
  { name: "Alcaldía", desc: "Liderazgo estratégico y representación de la comuna de La Serena." },
  { name: "Administración Municipal", desc: "Coordinación de los servicios y ejecución de la política pública." },
  { name: "DIDECO", desc: "Desarrollo Comunitario: Programas sociales, deportes y organizaciones." },
  { name: "DOM", desc: "Dirección de Obras: Gestión territorial, edificación y espacio público." },
  { name: "SECPLAN", desc: "Secretaría de Planificación: Proyectos de inversión, Smart City y fondos externos." },
  { name: "DAF", desc: "Administración y Finanzas: Gestión de presupuestos y tesorería." },
  { name: "Gestión de Personas", desc: "Cuidado, desarrollo y bienestar de todo nuestro capital humano." },
  { name: "Seguridad Ciudadana", desc: "Vigilancia comunitaria, prevención del delito y apoyo 24/7." },
  { name: "Tránsito", desc: "Movilidad urbana, licencias de conducir y seguridad vial." },
  { name: "Turismo y Patrimonio", desc: "Promoción de nuestra capital y conservación histórica." },
  { name: "Servicio a la Comunidad", desc: "Higiene ambiental, parques, jardines e iluminación." },
  { name: "Salud Municipal", desc: "Red de atención primaria CESFAM de toda la comuna." }
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

const QUESTIONS = [
  { q: "¿Quiénes son parte del equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos servidores públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal directo." },
  { q: "¿Cuántos concejales tiene La Serena?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y violencia laboral." },
  { q: "¿Qué área ve el apoyo psicológico?", options: ["Obras", "Calidad de Vida", "Tránsito"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["El Faro", "Cota 30 (Av. Cisternas)", "Plaza de Armas"], ans: 1, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Quién diseña los proyectos Smart City?", options: ["DIDECO", "SECPLAN", "DAF"], ans: 1, explanation: "SECPLAN es el cerebro técnico de la planificación municipal." },
  { q: "¿Qué es RDMLS?", options: ["Una oficina", "Radio Digital Municipal", "Un parque"], ans: 1, explanation: "Nuestra Radio Digital Municipal: innovación en comunicación." },
];

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', dept: 'Alcaldía', cargo: 'Director' });
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

  // Lógica de Scroll y Desbloqueo
  const handleScroll = (e: any) => {
    const el = e.target;
    // Si llegamos cerca del final o si el contenido es tan corto que no hay scroll
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 10, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-activar después de un tiempo prudente por si falla el detector
      const timer = setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // --- LAYOUT MAESTRO ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Barra de Progreso Superior */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_15px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      {/* Contenedor Principal Adaptativo */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VISUAL: Fijo en Desktop, Arriba en Móvil */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10 flex items-center justify-center relative backdrop-blur-3xl transition-transform duration-500 hover:scale-[1.01]">
             {visual}
           </div>
        </div>

        {/* CONTENIDO: Scrollable siempre */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950">
          <div className="px-8 lg:px-16 pt-10 pb-6 shrink-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">PASO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">INDUCCIÓN IMLS</span>
             </div>
             <h2 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter mb-2">{title}</h2>
             <h3 className="text-lg lg:text-2xl text-slate-400 font-serif italic leading-tight">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8 scroll-smooth">
            <div className="space-y-10 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-32"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER DE NAVEGACIÓN FIJO */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-[60]">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all p-4 border border-white/5 rounded-xl">
            <ChevronLeft size={20}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-8">
            {canAdvance ? (
               <div className="hidden sm:flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
                 <CheckCircle size={22}/> ¡LECTURA COMPLETADA!
               </div>
            ) : (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={22}/> BAJA PARA CONTINUAR
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-12 py-4 lg:px-16 lg:py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-[0.2em] transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50 scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              SIGUIENTE <ArrowRight size={22} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-25 blur-sm scale-105 animate-spin-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          <div>
            <h1 className="text-7xl lg:text-[9rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-xs pl-2 border-l-4 border-red-600 mt-8">Smart City • Patrimonio • Comunidad</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-6">
            <h3 className="text-white font-black text-3xl mb-8 flex items-center gap-4 uppercase tracking-tighter">Acceso Funcionario</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d.name} value={d.name} className="text-black">{d.name}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all hover:scale-[1.03] uppercase text-xl mt-4 flex items-center justify-center gap-4">Ingresar <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // --- DIAPO 1: VIDEO ALCALDESA (DESBLOQUEADO) ---
    case 1: return <ChapterLayout title="Mensaje de Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={<iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&mute=0&rel=0&modestbranding=1" title="Bienvenida" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
      content={<><p className="font-black text-5xl text-white mb-8">¡Bienvenido, {userData.nombres}!</p><p>Es un orgullo para nuestra institución darte la bienvenida oficial. Te sumas a la **Ilustre Municipalidad de La Serena**, una institución con historia y vocación transformadora.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p className="text-slate-400">En este proceso, conocerás los pilares estratégicos y los protocolos que te protegen a ti y a nuestra comunidad.</p></>} 
    />;

    // --- DIAPO 2: ESTRATEGIA ---
    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión, Visión y Valores" 
      visual={<div className="flex flex-col gap-10 items-center p-12"><Target size={120} className="text-red-600 drop-shadow-[0_0_20px_red]"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white text-center">Estrategia<br/>IMLS</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Star/> Misión</h4><p className="text-2xl font-light">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso. Nuestro compromiso es entregar servicios de alta calidad, eficiencia y transparencia.</p></section><section className="space-y-6 pt-10 border-t border-white/5"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Visión</h4><p className="text-2xl font-light">Ser una comuna líder en desarrollo sostenible y Smart City, reconocida por su respeto al patrimonio histórico y por brindar la mejor calidad de vida a sus habitantes.</p></section></>} 
    />;

    // --- DIAPO 3: CONCEJO ---
    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-2xl border text-[10px] font-bold text-center"><User size={20} className="mx-auto mb-2 text-red-600"/>{c}</div>)}</div>}
      content={<><p>La administración reside en la Alcaldesa y en el Concejo Municipal. Su misión es fiscalizar la gestión edilicia y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-8 rounded-[3rem] border border-yellow-500/20 shadow-xl space-y-6"><h4 className="text-yellow-500 font-black text-2xl uppercase flex items-center gap-3"><Shield/> Atribuciones:</h4><ul className="space-y-4 text-xl"><li>• Fiscalizar el cumplimiento de planes y programas.</li><li>• Aprobar el presupuesto municipal anual.</li><li>• Normar ordenanzas y regulaciones locales.</li></ul></div></>} 
    />;

    // --- DIAPO 4: ESTRUCTURA ---
    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Estratégicas" 
      visual={<div className="flex items-center justify-center h-full p-4"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-2xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Organigrama'}/></div>}
      content={<><div className="grid gap-6">{DEPARTAMENTOS.slice(0, 8).map(d => (<div key={d.name} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-red-600/10 transition-all"><h4 className="font-black text-white text-xl uppercase">{d.name}</h4><p className="text-slate-400 text-sm mt-2">{d.desc}</p></div>))}</div></>} 
    />;

    // --- DIAPO 5: SMART CITY ---
    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-10 rounded-full mb-12 text-5xl shadow-2xl">IMLS</div><div className="grid grid-cols-2 gap-8 text-center text-sm w-full"><div className="bg-blue-600/30 p-4 rounded-2xl">Vecinos</div><div className="bg-green-600/30 p-4 rounded-2xl">Gobierno</div></div></div>}
      content={<><p>No somos una isla. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central. Nuestra gestión se coordina con el Gobierno Regional y el sector privado para garantizar seguridad y desarrollo.</p></>} 
    />;

    // --- DIAPO 6: SEGURIDAD CIUDADANA (NUEVA) ---
    case 6: return <ChapterLayout title="Seguridad Ciudadana" subtitle="Prevención y Comunidad 24/7" 
      visual={<div className="p-16 text-center animate-pulse"><Phone size={150} className="text-red-600 mx-auto"/><h4 className="text-white font-black text-6xl mt-8 tracking-tighter italic">1420</h4></div>}
      content={
        <>
          <p className="text-3xl font-bold text-white mb-6">Nuestra prioridad es tu tranquilidad.</p>
          <p>La Dirección de Seguridad Ciudadana despliega diariamente patrullajes preventivos y cámaras de alta tecnología en toda la comuna. Somos ojos y oídos para la prevención del delito.</p>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 mt-8">
             <div className="flex gap-6 items-center">
               <div className="bg-red-600 p-4 rounded-2xl text-white"><Phone size={32}/></div>
               <div><h4 className="font-black text-white text-3xl">LÍNEA 1420</h4><p className="text-lg text-slate-400 uppercase tracking-widest font-black">Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-6 items-center">
               <div className="bg-blue-600 p-4 rounded-2xl text-white"><Eye size={32}/></div>
               <div><h4 className="font-black text-white text-2xl uppercase">Central de Cámaras</h4><p className="text-sm">Monitoreo con IA en puntos críticos de la ciudad.</p></div>
             </div>
             <div className="flex gap-6 items-center">
               <div className="bg-green-600 p-4 rounded-2xl text-white"><ShieldCheck size={32}/></div>
               <div><h4 className="font-black text-white text-2xl uppercase">Patrullaje Mixto</h4><p className="text-sm">Convenio con Carabineros para mayor efectividad.</p></div>
             </div>
          </div>
          <h4 className="text-red-500 font-black text-2xl mt-10 mb-4 uppercase tracking-tighter">Recomendaciones:</h4>
          <ul className="space-y-4 text-xl">
             <li>• Descarga nuestra aplicación de alerta vecinal.</li>
             <li>• Reporta luminarias apagadas al 1420.</li>
             <li>• Conoce a tu gestor territorial de seguridad.</li>
          </ul>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Calidad de Vida" subtitle="Bienestar Integral" 
      visual={<div className="p-12"><HeartHandshake size={150} className="text-red-600 mx-auto animate-pulse"/></div>}
      content={<><p>Tu bienestar es prioridad. Contamos con una red de apoyo integral:</p><div className="space-y-6 mt-8"><div className="p-6 border-2 border-green-500/30 bg-green-50/10 rounded-2xl flex gap-6"><Stethoscope className="text-green-600"/><h4 className="font-bold text-green-900 text-xl uppercase">Salud & Psicología</h4></div><div className="p-6 border-2 border-blue-500/30 bg-blue-50/10 rounded-2xl flex gap-6"><Activity className="text-blue-600"/><h4 className="font-bold text-blue-900 text-xl uppercase">Deporte & Pausas</h4></div></div></>} 
    />;

    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral" 
      visual={<div className="p-12 text-center"><Shield size={120} className="text-pink-600 mx-auto"/><h4 className="font-bold text-pink-900 mt-4 uppercase">Protocolo 21.643</h4></div>}
      content={<><p>Tolerancia Cero al acoso. La Ley Karin protege la dignidad de todos. Sanciona el acoso laboral, sexual y la violencia. **Un solo acto grave es suficiente para denunciar.** Contamos con canales 100% confidenciales.</p></>} 
    />;

    case 9: return <ChapterLayout title="Seguridad" subtitle="Protocolos ACHS" 
      visual={<div className="p-12"><AlertTriangle size={150} className="text-yellow-500 mx-auto animate-bounce"/></div>}
      content={<><h4 className="text-yellow-700 font-bold text-2xl mb-6">Ante Accidentes:</h4><ol className="space-y-6 font-bold text-red-900 text-2xl"><li>1. Avisa de inmediato a tu jefatura.</li><li>2. Acude a la Mutualidad (ACHS).</li><li>3. No te vayas a casa sin el registro (DIAT).</li></ol></>} 
    />;

    case 10: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl w-full max-w-3xl border border-white/5 relative">
           <div className="absolute top-0 left-0 w-full h-2 bg-white/5"><div className="h-full bg-red-600 transition-all duration-300" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest"><span>Evaluación Final</span><span>Pregunta {quizIndex + 1} de 10</span></div>
               <h3 className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tighter">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-4">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-xl transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'opacity-30 grayscale text-white'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-8 p-8 rounded-[2rem] bg-white/5 animate-in slide-in-from-bottom-5">
                    <p className="text-white text-xl font-light italic">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-6 bg-red-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 transition-all">Siguiente Pregunta <ArrowRight className="inline ml-2"/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-700">
               <Award size={150} className="mx-auto text-yellow-500 mb-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
               <h2 className="text-6xl font-black text-white mb-6">¡LOGRADO!</h2>
               <button onClick={() => setStep(11)} className="w-full bg-red-600 text-white py-8 rounded-3xl font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xl">Generar Certificado</button>
             </div>
           )}
        </div>
      </div>
    );

    case 11: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 w-full max-w-6xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[15px] border-double border-slate-200 print:border-none print:m-0">
           <div className="w-full flex justify-between items-center opacity-80 mb-6">
             <img src="/img/escudo.png" className="h-24 object-contain" />
             <img src="/img/innovacion.png" className="h-24 object-contain" />
           </div>
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-7xl lg:text-[10rem] font-serif font-black text-slate-900 mb-6 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-3xl italic text-slate-500 mb-12 font-serif border-y border-slate-100 py-6 uppercase">Inducción Corporativa IMLS 2026</p>
             <h2 className="text-5xl lg:text-8xl font-black text-slate-900 uppercase tracking-tighter mb-6">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
             <p className="text-2xl text-slate-700 max-w-4xl mx-auto italic font-light leading-relaxed">"Por haber cumplido exitosamente con los requerimientos formativos de ingreso a la Ilustre Municipalidad de La Serena."</p>
           </div>
           <div className="flex justify-between w-full px-16 mt-20 text-xs font-bold uppercase text-slate-400 tracking-[0.3em]">
             <div className="text-center w-80"><div className="h-16 mb-4 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_personas.png" className="h-14" /></div>Director Gestión Personas</div>
             <div className="text-center pt-16 text-xl text-slate-300 italic">{currentTime.toLocaleDateString()}</div>
             <div className="text-center w-80"><div className="h-16 mb-4 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-14" /></div>Alcaldesa Daniela Norambuena</div>
           </div>
        </div>
        <div className="fixed bottom-12 right-12 flex gap-6 print:hidden">
           <button onClick={printCertificate} className="bg-white text-slate-950 px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-slate-100 flex items-center gap-4 text-lg"><Printer size={28}/> DESCARGAR</button>
           <button onClick={() => setStep(12)} className="bg-red-600 text-white px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-red-700 flex items-center gap-4 text-lg">FINALIZAR <ArrowRight size={28}/></button>
        </div>
      </div>
    );

    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="bg-white/5 p-12 lg:p-24 rounded-[5rem] backdrop-blur-3xl border border-white/10 max-w-6xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-10 mt-10">
            <Smartphone size={100} className="mx-auto mb-10 text-red-600 drop-shadow-[0_0_20px_red]"/>
            <h2 className="text-6xl lg:text-[10rem] font-black mb-8 tracking-tighter uppercase italic leading-none">¡SIGUE<br/>CONECTADO!</h2>
            <div className="grid md:grid-cols-2 gap-12 text-left bg-black/40 p-10 lg:p-16 rounded-[4rem] border border-white/5 shadow-inner">
               <div className="flex flex-col items-center justify-center bg-white p-10 rounded-[3rem] shadow-2xl transition-transform hover:scale-105">
                  <QrCode size={200} className="text-slate-900"/>
                  <p className="text-slate-900 font-black mt-8 text-sm uppercase tracking-[0.4em]">ACCESO RDMLS</p>
               </div>
               <div className="space-y-12 flex flex-col justify-center">
                  <div className="flex items-center gap-6 group cursor-pointer hover:translate-x-4 transition-all"><div className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-600/20"><Radio size={32}/></div><span className="font-black text-3xl tracking-tighter uppercase block text-white">Radio Digital IMLS</span></div>
                  <div className="flex items-center gap-6 group cursor-pointer hover:translate-x-4 transition-all"><div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20"><Map size={32}/></div><span className="font-bold text-3xl tracking-tighter uppercase block text-white">Tours Virtuales 3D</span></div>
                  <button className="mt-8 bg-white text-slate-950 w-full py-6 rounded-[2rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-xl tracking-[0.4em] uppercase">Portal RDMLS.CL</button>
               </div>
            </div>
            <div className="mt-20 flex justify-center gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <img src="/img/escudo.png" className="h-24 object-contain" />
               <img src="/img/innovacion.png" className="h-24 object-contain" />
            </div>
            <button onClick={() => setStep(0)} className="mt-20 text-slate-600 hover:text-red-500 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.8em] font-black transition-colors w-full uppercase"><RefreshCw size={24}/> Cerrar Sesión</button>
         </div>
      </div>
    );

    default: return null;
  }
}
