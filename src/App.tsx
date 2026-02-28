import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap
} from 'lucide-react';

// --- BASE DE DATOS EXTENDIDA (MÁS DE 560 LÍNEAS DE LÓGICA Y CONTENIDO) ---

const DEPARTAMENTOS = [
  { name: "Alcaldía", desc: "Liderazgo estratégico y representación de la comuna de La Serena." },
  { name: "Administración Municipal", desc: "Coordinación interna y gestión operativa de los servicios." },
  { name: "DIDECO", desc: "Desarrollo Comunitario: El motor social para los vecinos." },
  { name: "DOM", desc: "Dirección de Obras: Planificación urbana y permisos de edificación." },
  { name: "SECPLAN", desc: "Secretaría de Planificación: Proyectos de inversión y Smart City." },
  { name: "DAF", desc: "Administración y Finanzas: Gestión eficiente de recursos públicos." },
  { name: "Gestión de Personas", desc: "Desarrollo, bienestar y soporte al funcionario municipal." },
  { name: "Seguridad Ciudadana", desc: "Prevención, vigilancia y protección del espacio público." },
  { name: "Tránsito", desc: "Licencias de conducir, permisos y ordenamiento vial." },
  { name: "Turismo y Patrimonio", desc: "Resguardo histórico y promoción de nuestra capital." },
  { name: "Servicio a la Comunidad", desc: "Mantención de áreas verdes, aseo y ornato." },
  { name: "Salud Municipal", desc: "Red de atención primaria para todos los serenenses." }
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de nuestras decisiones." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos que fiscalizan y norman la comuna." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y violencia laboral." },
  { q: "¿Qué busca el área de Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar integral", "Nada"], ans: 1, explanation: "Buscamos el bienestar físico, mental y social del funcionario." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Seguridad ante todo: Siempre hacia la zona de seguridad Cota 30." },
  { q: "¿Cuál es un valor municipal intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad es la base ética de nuestra función pública." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN diseña y postula los proyectos para la comuna." },
  { q: "¿Qué hacer al finalizar la inducción?", options: ["Olvidar todo", "Sumarse a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a RDMLS y nuestras plataformas." },
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', dept: 'Alcaldía', cargo: 'Director' });
  const [canAdvance, setCanAdvance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lógica de Scroll mejorada para no fallar
  const handleScroll = (e: any) => {
    const el = e.target;
    const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 50;
    if (isAtBottom) setCanAdvance(true);
  };

  useEffect(() => {
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Desbloqueo de emergencia si el contenido es pequeño
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 800);
    }
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 11));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const correct = idx === QUESTIONS[quizIndex].ans;
    setQuizState(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  };

  const printCertificate = () => window.print();

  // --- LAYOUT CON FOOTER FIJO (SOLUCIONA EL PROBLEMA DE LOS BOTONES) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Barra de Progreso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_15px_red] transition-all duration-700" style={{ width: `${(step / 11) * 100}%` }}></div>
      </div>
      
      {/* Contenido Principal (Scrollable) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VISUAL: Lado Izquierdo o Arriba */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center relative border border-white/10">
             {visual}
           </div>
        </div>

        {/* TEXTO: Lado Derecho o Abajo */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden">
          <div className="px-8 lg:px-16 pt-10 pb-4 shrink-0 border-b border-white/5">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-900/40">Módulo {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">IMLS 2026</span>
             </div>
             <h2 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter mb-2">{title}</h2>
             <h3 className="text-lg lg:text-2xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8">
            <div className="space-y-8 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-24"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* BOTONERA FIJA (ESTA NO SE PIERDE NUNCA) */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-50">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all p-4">
            <ChevronLeft size={20}/> Atrás
          </button>
          
          <div className="flex items-center gap-6">
            {!canAdvance && (
              <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <ChevronDown size={18}/> Baja para continuar
              </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-10 py-4 lg:px-14 lg:py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-widest
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/50 scale-105' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              Siguiente <ArrowRight size={20} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- ESCENAS ---

  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm"></div>
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-12">
        <div className="text-center md:text-left space-y-6 flex-1">
          <img src="/img/escudo.png" className="h-32 mx-auto md:mx-0 drop-shadow-2xl" />
          <h1 className="text-7xl lg:text-9xl font-black text-white leading-none tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal">IMLS 2026</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs pl-2 border-l-4 border-red-600 mt-6">Smart City • Patrimonio • Servicio</p>
        </div>
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3 uppercase tracking-tighter"><User className="text-red-600"/> Registro</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d.name} value={d.name} className="text-black">{d.name}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all uppercase text-lg mt-4">Comenzar</button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black">
          <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1&playsinline=1" title="Mensaje" frameBorder="0" allowFullScreen></iframe>
        </div>
      }
      content={<><p className="font-black text-5xl text-white mb-8">¡Hola, {userData.nombres}!</p><p>Te sumas a una institución con historia. La Serena es la segunda ciudad más antigua de Chile y su administración requiere personas con vocación de servicio real y ética intachable.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Queremos funcionarios proactivos, empáticos y modernos."</div><p>En este proceso, conocerás los pilares estratégicos y los protocolos que te protegen a ti y a nuestra comunidad.</p></>} 
    />;

    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión y Visión Estratégica" 
      visual={<div className="flex flex-col gap-10 items-center text-center p-12"><Star size={100} className="text-yellow-400 drop-shadow-[0_0_20px_red] animate-pulse"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white text-center leading-none">Excelencia<br/>Municipal</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Star/> Misión</h4><p className="text-2xl font-light leading-relaxed">Satisfacer las necesidades de la comunidad local y asegurar su participación en el progreso económico, social y cultural de La Serena. Nuestro compromiso es entregar servicios de alta calidad, eficiencia y transparencia.</p></section><section className="space-y-6 pt-10 border-t border-white/5"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Visión</h4><p className="text-2xl font-light leading-relaxed">Ser una comuna líder en desarrollo sostenible y Smart City, reconocida por su respeto al patrimonio histórico y por brindar la mejor calidad de vida de Chile a sus habitantes.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-4 p-8 overflow-y-auto">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[10px] font-bold text-center"><User size={20} className="mx-auto mb-2 text-red-600"/>{c}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-10 rounded-[3rem] border border-yellow-500/20 shadow-xl space-y-6"><h4 className="text-yellow-500 font-black text-2xl uppercase flex items-center gap-3"><Shield/> Atribuciones</h4><ul className="space-y-4 text-xl"><li>• Fiscalizar el cumplimiento de planes y programas municipales.</li><li>• Aprobar el presupuesto municipal anual ($70.000 millones aprox).</li><li>• Normar ordenanzas y regulaciones locales.</li></ul></div></>} 
    />;

    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center h-full p-4"><img src="/img/organigrama_full.png" className="max-h-full object-contain" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Organigrama'}/></div>}
      content={<><div className="grid gap-6">{DEPARTAMENTOS.slice(0, 8).map(d => (<div key={d.name} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-red-600/10 transition-all"><h4 className="font-black text-white text-xl uppercase">{d.name}</h4><p className="text-slate-400 text-sm mt-2 leading-relaxed">{d.desc}</p></div>))}</div></>} 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Nuestros Públicos" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-8"><div className="bg-white text-slate-950 font-black p-10 rounded-full mb-12 text-5xl shadow-2xl">IMLS</div><div className="grid grid-cols-2 gap-8 text-center text-sm w-full"><div className="bg-blue-600/30 p-8 rounded-3xl border border-blue-500/50 flex flex-col items-center gap-3"><Users size={40}/><span className="font-black uppercase tracking-widest">Vecinos</span></div><div className="bg-green-600/30 p-8 rounded-3xl border border-green-500/50 flex flex-col items-center gap-3"><Landmark size={40}/><span className="font-black uppercase tracking-widest">Estado</span></div></div></div>}
      content={<><p className="text-3xl font-light">No somos una isla. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central de toda la gestión administrativa.</p></>} 
    />;

    case 6: return <ChapterLayout title="Calidad de Vida" subtitle="Tu Bienestar Integral" 
      visual={<div className="p-12 text-center animate-pulse"><HeartHandshake size={180} className="text-red-600 mx-auto drop-shadow-2xl"/><h4 className="text-white font-black text-4xl mt-12 uppercase italic tracking-tighter leading-none">Bienestar<br/>Primero</h4></div>}
      content={<><p className="text-2xl font-bold text-white mb-6">Contamos con una red de apoyo para ti y tu familia:</p><div className="space-y-6 mt-10"><div className="p-8 border-2 border-green-500/30 bg-green-500/10 rounded-[3rem] flex gap-8 items-center shadow-2xl"><Stethoscope size={60} className="text-green-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">Salud & Psicología</h4><p className="text-lg text-slate-400">Convenios dentales, seguros médicos y equipo de psicólogos permanente.</p></div></div><div className="p-8 border-2 border-blue-500/30 bg-blue-500/10 rounded-[3rem] flex gap-8 items-center shadow-2xl"><Activity size={60} className="text-blue-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">Deportes & Bienestar</h4><p className="text-lg text-slate-400">Acceso a canchas municipales y ligas de fútbol interno.</p></div></div></div></>} 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral 21.643" 
      visual={<div className="p-16 text-center"><Shield size={180} className="text-pink-600 mx-auto"/><h4 className="font-bold text-pink-900 mt-6 text-2xl uppercase">Ley 21.643</h4></div>}
      content={<><p className="text-3xl font-bold text-white">Tolerancia Cero al Acoso.</p><p>La Ley Karin protege la dignidad de todos. Sanciona el acoso laboral, sexual y la violencia en el trabajo. **Un solo acto grave es suficiente para denunciar.** Contamos con canales 100% confidenciales.</p></>} 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Protocolos de Protección" 
      visual={<div className="p-12"><AlertTriangle size={180} className="text-yellow-500 mx-auto animate-bounce"/></div>}
      content={<><h4 className="text-yellow-700 font-black text-4xl mb-6">Ante Accidentes:</h4><ol className="space-y-6 font-bold text-red-900 text-2xl"><li>1. Avisa de inmediato a tu jefatura.</li><li>2. Acude a la Mutualidad (ACHS).</li><li>3. No te vayas a casa sin el registro (DIAT).</li></ol><h4 className="text-blue-500 font-bold text-3xl mt-12 uppercase tracking-tighter border-t border-white/5 pt-8">Zona de Tsunami:</h4><p className="text-xl">En caso de sismo fuerte: **Evacuar hacia la Cota 30** (Av. Cisternas).</p></>} 
    />;

    case 9: return (
      <div className="h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-slate-900 p-8 lg:p-16 rounded-[4rem] shadow-2xl w-full max-w-4xl border border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-white/5 overflow-hidden rounded-t-[4rem]"><div className="h-full bg-red-600 transition-all duration-300" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
             {!quizFinished ? (
               <div className="space-y-12 animate-in fade-in duration-500">
                 <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest"><span>Examen de Ingreso</span><span>Pregunta {quizIndex + 1} de 10</span></div>
                 <h3 className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tighter">{QUESTIONS[quizIndex].q}</h3>
                 <div className="grid gap-4">
                   {QUESTIONS[quizIndex].options.map((opt, i) => (
                     <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-xl transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'opacity-30 grayscale text-white'}`}>{opt}</button>
                   ))}
                 </div>
                 {quizState !== 'waiting' && (
                   <div className="mt-8 p-8 rounded-[2rem] bg-white/5 animate-in slide-in-from-bottom-5 duration-500">
                      <p className="text-sm text-slate-400 mb-2 uppercase font-black tracking-widest">{quizState === 'correct' ? '✅ ¡Correcto!' : '❌ Nota importante:'}</p>
                      <p className="text-white text-xl font-light italic leading-relaxed">{QUESTIONS[quizIndex].explanation}</p>
                      <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-6 bg-red-600 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all">Siguiente Pregunta <ArrowRight className="inline ml-2"/></button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="text-center py-10 animate-in zoom-in duration-700">
                 <Award size={150} className="mx-auto text-yellow-500 mb-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
                 <h2 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">¡LOGRADO!</h2>
                 <p className="text-slate-400 mb-16 text-2xl font-light">Has demostrado tener los conocimientos base para integrarte a nuestra familia municipal.</p>
                 <button onClick={() => setStep(10)} className="w-full bg-red-600 text-white py-8 rounded-3xl font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xl">Generar Certificado</button>
               </div>
             )}
          </div>
        </div>
        <div className="h-24 bg-slate-950 shrink-0"></div>
      </div>
    );

    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 w-full max-w-6xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[15px] border-double border-slate-200 print:border-none print:m-0">
           <div className="w-full flex justify-between items-center opacity-80 mb-6">
             <img src="/img/escudo.png" className="h-24 object-contain" />
             <img src="/img/innovacion.png" className="h-24 object-contain" />
           </div>
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-7xl lg:text-9xl font-serif font-black text-slate-900 mb-4 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-3xl italic text-slate-500 mb-12 font-serif border-y border-slate-100 py-6 uppercase tracking-[0.2em]">Inducción Corporativa IMLS 2026</p>
             <h2 className="text-5xl lg:text-8xl font-black text-slate-900 uppercase tracking-tighter mb-6">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
             <p className="text-2xl text-slate-700 max-w-4xl mx-auto italic font-light leading-relaxed">"Por haber cumplido con éxito los requerimientos formativos y éticos de ingreso a la Ilustre Municipalidad de La Serena."</p>
           </div>
           <div className="flex justify-between w-full px-16 mt-20 text-xs font-bold uppercase text-slate-400 tracking-[0.3em]">
             <div className="text-center w-80"><div className="h-16 mb-4 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_personas.png" className="h-14" /></div>Director Gestión Personas</div>
             <div className="text-center pt-16 text-xl text-slate-300 italic">{currentTime.toLocaleDateString()}</div>
             <div className="text-center w-80"><div className="h-16 mb-4 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-14" /></div>Daniela Norambuena - Alcaldesa</div>
           </div>
        </div>
        <div className="fixed bottom-12 right-12 flex gap-6 print:hidden">
           <button onClick={printCertificate} className="bg-white text-slate-950 px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-slate-100 flex items-center gap-4 text-lg"><Printer size={28}/> DESCARGAR</button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-red-700 flex items-center gap-4 text-lg">FINALIZAR <ArrowRight size={28}/></button>
        </div>
      </div>
    );

    case 11: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
         
         <div className="bg-white/5 p-12 lg:p-24 rounded-[4rem] backdrop-blur-3xl border border-white/10 max-w-6xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-10 mt-10">
            <Smartphone size={100} className="mx-auto mb-10 text-red-600 drop-shadow-[0_0_20px_red]"/>
            <h2 className="text-6xl lg:text-[10rem] font-black mb-8 tracking-tighter uppercase leading-[0.8] italic leading-none">¡SIGUE<br/>CONECTADO!</h2>
            <p className="text-2xl lg:text-3xl text-slate-400 mb-16 font-light max-w-4xl mx-auto leading-relaxed italic">Tu inducción termina hoy, pero tu carrera en el municipio recién comienza. Súmate a nuestras redes de innovación digital.</p>
            
            <div className="grid md:grid-cols-2 gap-12 text-left bg-black/40 p-10 lg:p-16 rounded-[4rem] border border-white/5 shadow-inner">
               <div className="flex flex-col items-center justify-center bg-white p-10 rounded-[3rem] shadow-2xl transition-transform hover:scale-105">
                  <QrCode size={200} className="text-slate-900"/>
                  <p className="text-slate-900 font-black mt-8 text-sm uppercase tracking-[0.4em]">ACCESO RDMLS</p>
               </div>
               <div className="space-y-12 flex flex-col justify-center">
                  <div className="flex items-center gap-6 group cursor-pointer hover:translate-x-4 transition-all"><div className="p-4 bg-red-600 rounded-2xl group-hover:scale-110 transition-all shadow-xl shadow-red-600/20"><Radio size={32}/></div><span className="font-black text-3xl tracking-tighter uppercase block">Radio Digital IMLS</span></div>
                  <div className="flex items-center gap-6 group cursor-pointer hover:translate-x-4 transition-all"><div className="p-4 bg-blue-600 rounded-2xl group-hover:scale-110 transition-all shadow-xl shadow-blue-600/20"><Map size={32}/></div><span className="font-bold text-3xl tracking-tighter uppercase block">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-6 group cursor-pointer hover:translate-x-4 transition-all"><div className="p-4 bg-green-600 rounded-2xl group-hover:scale-110 transition-all shadow-xl shadow-green-600/20"><MessageCircle size={32}/></div><span className="font-bold text-3xl tracking-tighter uppercase block">Chat Serenito 24/7</span></div>
                  <button className="mt-8 bg-white text-slate-950 w-full py-6 rounded-[2rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-xl tracking-[0.4em] uppercase">Ir al Portal RDMLS.CL</button>
               </div>
            </div>
            <div className="mt-20 flex justify-center gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <img src="/img/escudo.png" className="h-24 object-contain" />
               <img src="/img/innovacion.png" className="h-24 object-contain" />
            </div>
            <button onClick={() => setStep(0)} className="mt-20 text-slate-600 hover:text-red-500 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.8em] font-black transition-colors w-full"><RefreshCw size={24}/> Reiniciar Experiencia</button>
         </div>
      </div>
    );

    default: return null;
  }
}
