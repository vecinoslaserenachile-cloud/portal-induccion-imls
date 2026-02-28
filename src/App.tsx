import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, ShieldCheck, Globe, BookOpen, HeartPulse, Camera, Info
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", 
  "DIDECO", "Dirección de Obras (DOM)", "Tránsito y Transporte", "DAF", 
  "Gestión de Personas", "Seguridad Ciudadana", "Turismo y Patrimonio", 
  "Servicio a la Comunidad", "Salud (Corporación)", "Educación"
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos servidores públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión municipal." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es el número único de emergencias municipales 24/7." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "No usar uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia." },
  { q: "¿Dónde evacuar ante un Tsunami?", options: ["Al Faro", "Cota 30 (Av. Cisternas)", "Plaza de Armas"], ans: 1, explanation: "Sobre la Cota 30 hacia el oriente es la zona segura." },
  { q: "¿Qué área ofrece apoyo psicológico?", options: ["Dirección de Obras", "Calidad de Vida", "Rentas"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Qué dirección ve los proyectos Smart City?", options: ["SECPLAN", "DIDECO", "Tránsito"], ans: 0, explanation: "SECPLAN es el cerebro técnico de la planificación municipal." },
  { q: "¿Cuál es el rol del concejal?", options: ["Ejecutar obras", "Fiscalizar y Normar", "Atender cajas"], ans: 1, explanation: "El concejo fiscaliza y aprueba las normas locales." },
  { q: "¿Qué significa Probidad?", options: ["Ser rápido", "Rectitud y honestidad", "Ser amable"], ans: 1, explanation: "La Probidad es actuar con una conducta funcionaria intachable." },
  { q: "¿Qué es RDMLS?", options: ["Una oficina", "Radio Digital Municipal", "Un software"], ans: 1, explanation: "Nuestra Radio Digital Municipal, la voz oficial de la ciudad." },
];

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', 
    apellidos: 'Godoy', 
    rut: '12.345.678-9', 
    dept: 'Alcaldía', 
    cargo: 'Director',
    email: 'rodrigo.godoy@laserena.cl',
    ingreso: '2026-03-01'
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

  // Lógica de Scroll para desbloquear botón
  const handleScroll = (e: any) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-desbloqueo si no hay scroll suficiente
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 1000);
    }
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = idx === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  // --- LAYOUT MAESTRO ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Barra de Progreso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_15px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      {/* Contenedor Principal Adaptativo */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LADO VISUAL */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10 flex items-center justify-center relative backdrop-blur-3xl transition-all duration-500">
             {visual}
             <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <img src="/img/escudo.png" className="h-10" onError={(e)=>e.currentTarget.style.display='none'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 leading-none">MUNICIPALIDAD<br/>LA SERENA</span>
             </div>
           </div>
        </div>

        {/* LADO CONTENIDO */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden relative shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
          <div className="px-8 lg:px-16 pt-10 pb-6 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">MÓDULO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-l border-white/10 pl-3">SMART INDUCTION 2026</span>
             </div>
             <h2 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter mb-2 italic uppercase">{title}</h2>
             <h3 className="text-lg lg:text-2xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-10 scroll-smooth relative">
            <div className="space-y-12 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-40"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NAVEGACIÓN FIJO (SOLUCIONA EL PROBLEMA DE LOS BOTONES FUERA) */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-3 transition-all p-4 hover:bg-white/5 rounded-xl">
            <ChevronLeft size={24}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-8">
            {!canAdvance && (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={24} className="animate-bounce"/> DESLIZA HACIA ABAJO PARA CONTINUAR
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-12 py-5 lg:px-20 lg:py-6 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-[0.3em] transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50 scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              {canAdvance && <CheckCircle size={24} className="text-white animate-bounce"/>}
              SIGUIENTE <ArrowRight size={24} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-25 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-52 mx-auto md:mx-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
          <div>
            <h1 className="text-7xl lg:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-xs pl-4 border-l-4 border-red-600 mt-8">Smart City • Patrimonio • Servicio Público de Excelencia</p>
          </div>
        </div>
        
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-6">
            <h3 className="text-white font-black text-3xl mb-8 flex items-center gap-4 uppercase tracking-tighter italic border-b border-white/5 pb-4"><User className="text-red-600" size={32}/> Acceso Único</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Nombres</label>
                <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Apellidos</label>
                <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">RUT</label>
                <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Fecha Ingreso</label>
                <input type="date" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm" value={userData.ingreso} onChange={e => setUserData({...userData, ingreso: e.target.value})}/>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Email Institucional</label>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})}/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Dirección Municipal</label>
              <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                  {DEPARTAMENTOS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
              </select>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-7 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all hover:scale-[1.03] uppercase text-xl mt-6 flex items-center justify-center gap-4">Iniciar Inducción <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // 1. VIDEO (BLINDADO)
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div key="video-step" className="w-full h-full bg-black">
          {/* El Iframe está envuelto para evitar que React lo rompa en transiciones */}
          <iframe 
            className="w-full h-full aspect-video" 
            src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1&enablejsapi=1" 
            title="Bienvenida IMLS" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      }
      content={<><p className="font-black text-5xl text-white mb-8 leading-none tracking-tighter uppercase italic">¡Bienvenido a bordo!</p><p className="text-2xl">Es un honor saludarte en tu ingreso a la **Ilustre Municipalidad de La Serena**. Te sumas a una institución con más de 480 años de historia, pero con una visión de futuro innovadora y profundamente humana.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p className="text-slate-400">En este proceso de inducción interactiva, conocerás los pilares estratégicos y los protocolos que te protegen a ti y a nuestra comunidad.</p></>} 
    />;

    // 2. ESTRATEGIA
    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Estrategia Institucional" 
      visual={<div className="flex flex-col gap-10 items-center p-12 animate-in zoom-in duration-1000"><Target size={150} className="text-red-600 drop-shadow-[0_0_20px_red]"/><h4 className="font-black text-7xl uppercase tracking-tighter text-white text-center leading-none italic">ESTRATEGIA<br/>IMLS 2026</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-4 italic"><Star/> Nuestra Misión</h4><p className="text-2xl font-light leading-relaxed">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso económico, social y cultural. Nuestro compromiso es entregar servicios de alta calidad, con eficiencia, total transparencia y máxima calidez humana hacia el serenense en cada interacción.</p></section><section className="space-y-6 pt-12"><h4 className="text-orange-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-4 italic"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light leading-relaxed">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto absoluto al patrimonio histórico y por brindar la mejor calidad de vida a sus habitantes.</p></section></>} 
    />;

    // 3. CONCEJO
    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia Local" 
      visual={<div className="grid grid-cols-2 gap-6 p-10 overflow-y-auto h-full bg-slate-900/50">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-[11px] font-black uppercase text-center flex flex-col items-center justify-center shadow-2xl group hover:border-red-600 transition-all"><User size={28} className="mb-3 text-red-600 group-hover:scale-125 transition-transform"/>{c}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-12 rounded-[3.5rem] border border-yellow-500/20 shadow-2xl space-y-8 mt-6"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-5 italic"><Shield size={40}/> Atribuciones Clave</h4><ul className="space-y-6 text-xl"><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Fiscalizar el cumplimiento de planes y programas municipales.</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Aprobar el presupuesto municipal anual (más de $75 mil millones).</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Dictar las ordenanzas que rigen la convivencia de la ciudad.</li></ul></div></>} 
    />;

    // 4. ESTRUCTURA (MAPA)
    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center h-full p-8"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_60px_rgba(220,38,38,0.25)]" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200/111/fff?text=Cargar+Organigrama'}/></div>}
      content={<><p className="text-3xl font-black text-white mb-10 uppercase italic border-l-4 border-red-600 pl-6 tracking-tighter">Organización para el Servicio:</p><div className="grid gap-8">
        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-red-600/10 transition-all"><Heart className="text-red-500 group-hover:scale-110 transition-transform" size={50}/><div><h4 className="font-black text-white text-2xl uppercase tracking-tighter leading-none">DIDECO</h4><p className="text-slate-400 text-lg mt-3 font-light">Desarrollo Comunitario: El motor social de la municipalidad hacia las familias serenenses.</p></div></div>
        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-blue-600/10 transition-all"><Building2 className="text-blue-500 group-hover:scale-110 transition-transform" size={50}/><div><h4 className="font-black text-white text-2xl uppercase tracking-tighter leading-none">DOM</h4><p className="text-slate-400 text-lg mt-3 font-light">Obras Municipales: El brazo constructor y fiscalizador del crecimiento urbano ordenado.</p></div></div>
        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-green-600/10 transition-all"><Search className="text-green-500 group-hover:scale-110 transition-transform" size={50}/><div><h4 className="font-black text-white text-2xl uppercase tracking-tighter leading-none">SECPLAN</h4><p className="text-slate-400 text-lg mt-3 font-light">Planificación: Donde nace la inversión, los proyectos Smart City y el futuro comunal.</p></div></div>
      </div></>} 
    />;

    // 5. PÚBLICOS
    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital 2026" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-14 rounded-full mb-20 text-7xl shadow-[0_0_80px_rgba(255,255,255,0.4)] animate-pulse">IMLS</div><div className="grid grid-cols-2 gap-12 text-center text-sm w-full max-w-2xl"><div className="bg-blue-600/30 p-12 rounded-[4rem] border border-blue-500/50 flex flex-col items-center gap-6 shadow-2xl transition-transform hover:scale-105"><Users size={60}/><span className="font-black uppercase tracking-widest text-xl">VECINOS</span></div><div className="bg-green-600/30 p-12 rounded-[4rem] border border-green-500/50 flex flex-col items-center gap-6 shadow-2xl transition-transform hover:scale-105"><Landmark size={60}/><span className="font-black uppercase tracking-widest text-xl">ESTADO</span></div></div></div>}
      content={<><p className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none border-b border-white/5 pb-8">Tecnología al Servicio de la Gente.</p><p className="text-2xl">No somos una isla administrativa. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central de toda estrategia. Nuestra gestión se coordina con el Gobierno Regional, Carabineros y el sector privado para garantizar seguridad y desarrollo integral.</p><div className="mt-10 p-8 bg-white/5 rounded-[2.5rem] border-l-8 border-blue-600 shadow-inner italic font-light"><p className="text-xl leading-relaxed">"Nuestra meta es una ciudad conectada, segura y transparente a través de la digitalización total de los servicios municipales."</p></div></>} 
    />;

    // 6. SEGURIDAD CIUDADANA (NUEVA)
    case 6: return <ChapterLayout title="Seguridad Ciudadana" subtitle="Prevención y Emergencia 1420" 
      visual={<div className="p-20 text-center animate-in zoom-in duration-1000"><Phone size={180} className="text-red-600 mx-auto drop-shadow-[0_0_40px_red]"/><h4 className="text-white font-black text-9xl mt-12 tracking-tighter italic leading-none drop-shadow-2xl">1420</h4></div>}
      content={
        <>
          <p className="text-4xl font-black text-white mb-10 uppercase tracking-tighter leading-none italic">Tu tranquilidad es nuestra prioridad absoluta.</p>
          <p className="text-2xl">La Dirección de Seguridad Ciudadana despliega patrullajes preventivos y monitorea más de 100 cámaras de alta tecnología con IA las 24 horas del día.</p>
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10 mt-12">
             <div className="flex gap-10 items-center border-b border-white/5 pb-10 group cursor-pointer">
               <div className="bg-red-600 p-6 rounded-3xl text-white shadow-2xl group-hover:scale-110 transition-transform"><Phone size={50}/></div>
               <div><h4 className="font-black text-white text-5xl">LÍNEA 1420</h4><p className="text-xl text-slate-400 uppercase tracking-widest font-black mt-2">Emergencias Municipales Directas</p></div>
             </div>
             <div className="flex gap-10 items-center group cursor-pointer">
               <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-2xl group-hover:scale-110 transition-transform"><Eye size={50}/></div>
               <div><h4 className="font-black text-white text-4xl uppercase italic leading-none">Central de Cámaras</h4><p className="text-xl text-slate-400 mt-2 font-light">Monitoreo Preventivo y apoyo a Carabineros.</p></div>
             </div>
          </div>
          <div className="mt-14 bg-yellow-500/10 p-10 rounded-[3rem] border-l-8 border-yellow-500 shadow-xl">
            <h5 className="text-yellow-500 font-black text-2xl uppercase mb-4 italic tracking-widest flex items-center gap-4"><Info/> Recomendación:</h5>
            <p className="text-xl leading-relaxed font-light">Informa siempre a los vecinos que para ruidos molestos, vehículos sospechosos o luminarias apagadas, el **1420** es el canal más rápido y eficiente de nuestra comuna.</p>
          </div>
        </>
      } 
    />;

    // 7. CALIDAD DE VIDA
    case 7: return <ChapterLayout title="Calidad de Vida" subtitle="Bienestar Integral del Funcionario" 
      visual={<div className="p-16 text-center animate-in zoom-in duration-1000"><HeartHandshake size={240} className="text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-5xl mt-14 uppercase italic tracking-tighter leading-none shadow-xl">PERSONAS<br/>PRIMERO</h4></div>}
      content={<><p className="text-3xl font-black text-white mb-10 italic border-l-4 border-red-600 pl-6 tracking-tighter leading-none uppercase">Cuidamos a quienes cuidan la ciudad.</p><p className="text-2xl font-light">En la IMLS no eres solo un número, eres parte de nuestra familia municipal. Contamos con una red de apoyo completa para ti y tu grupo familiar:</p><div className="space-y-10 mt-12">
        <div className="p-12 border-2 border-green-500/30 bg-green-500/10 rounded-[3.5rem] flex gap-12 items-center shadow-2xl group hover:border-green-400 transition-all"><Stethoscope size={80} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter leading-none">Salud & Psicología</h4><p className="text-xl text-slate-400 font-light leading-snug">Convenios dentales, seguros médicos complementarios y un equipo de psicólogos permanente para contención emocional en crisis.</p></div></div>
        <div className="p-12 border-2 border-blue-500/30 bg-blue-500/10 rounded-[3.5rem] flex gap-12 items-center shadow-2xl group hover:border-blue-400 transition-all"><Activity size={80} className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter leading-none">Deportes & Bienestar</h4><p className="text-xl text-slate-400 font-light leading-snug">Acceso gratuito a recintos deportivos municipales, talleres de pausa activa, ligas de fútbol interno y eventos recreativos familiares.</p></div></div>
      </div></>} 
    />;

    // 8. LEY KARIN
    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad y Respeto Laboral 21.643" 
      visual={<div className="p-24 text-center"><Shield size={250} className="text-pink-600 mx-auto drop-shadow-[0_0_50px_rgba(219,39,119,0.4)]"/><h4 className="text-pink-100 font-black text-6xl mt-12 uppercase tracking-tighter leading-none italic shadow-2xl">RESPETO<br/>TOTAL</h4></div>}
      content={<><p className="text-4xl font-black text-white mb-10 border-b border-white/5 pb-8 italic tracking-tighter uppercase leading-none">Tolerancia Cero al Acoso.</p><p className="text-2xl font-light">La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. En este municipio aplicamos protocolos de máxima severidad para garantizar un entorno saludable:</p><div className="grid grid-cols-1 gap-10 mt-12"><div className="bg-pink-600/10 p-12 rounded-[3.5rem] border border-pink-500/30 flex items-center gap-12 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"><AlertTriangle className="text-pink-500" size={70}/><div className="space-y-2"><h5 className="text-white font-black text-4xl uppercase tracking-tighter leading-none italic">Acoso Laboral</h5><p className="text-xl text-slate-400 font-light leading-relaxed">Toda agresión u hostigamiento que atente contra la dignidad del funcionario, sea presencial o digital.</p></div></div><div className="bg-pink-600/10 p-12 rounded-[3.5rem] border border-pink-500/30 flex items-center gap-12 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"><MessageCircle className="text-pink-500" size={70}/><div className="space-y-2"><h5 className="text-white font-black text-4xl uppercase tracking-tighter leading-none italic italic">Violencia Laboral</h5><p className="text-xl text-slate-400 font-light leading-relaxed">Conductas violentas ejercidas por terceros (vecinos, usuarios o proveedores) hacia el servidor público.</p></div></div></div><p className="mt-14 font-black text-white bg-white/5 p-12 rounded-[3rem] text-center border border-white/10 uppercase italic leading-tight shadow-inner text-2xl font-serif">"Un solo acto grave es suficiente para iniciar un proceso de sanción inmediata. La IMLS protege tu integridad."</p></>} 
    />;

    // 9. SEGURIDAD ACHS
    case 9: return <ChapterLayout title="Tu Seguridad" subtitle="Protocolo ACHS y Emergencias" 
      visual={<div className="p-24"><AlertTriangle size={240} className="text-yellow-500 mx-auto animate-bounce drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]"/><div className="h-6 w-48 bg-black/60 rounded-full mx-auto mt-8 blur-3xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-5xl uppercase tracking-tighter mb-12 border-b border-yellow-500/20 pb-6 italic">SEGURO LEY 16.744</h4><p className="text-3xl mb-12 font-black text-white italic tracking-tighter uppercase leading-none">Protocolo Ante Accidentes:</p><div className="bg-white/5 p-14 rounded-[4rem] border border-white/10 space-y-16 shadow-2xl"><div className="flex gap-12 items-start group"><div className="bg-yellow-500 text-slate-950 w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-5xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">1</div><div className="space-y-3"><h5 className="font-black text-white text-4xl uppercase tracking-tighter leading-none">Avisa a Jefatura</h5><p className="text-2xl text-slate-400 font-light">Debes informar obligatoriamente a tu superior directo en el momento exacto del incidente, por leve que parezca.</p></div></div><div className="flex gap-12 items-start group"><div className="bg-yellow-500 text-slate-950 w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-5xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">2</div><div className="space-y-3"><h5 className="font-black text-white text-4xl uppercase tracking-tighter leading-none">Centro Médico ACHS</h5><p className="text-2xl text-slate-400 font-light">Acude de inmediato a la Mutualidad (ACHS) para el registro médico oficial (DIAT) y asegurar tu cobertura total.</p></div></div></div><div className="mt-20 bg-blue-600/20 p-12 rounded-[4rem] border border-blue-500/30 shadow-2xl"><h4 className="text-blue-400 font-black text-4xl uppercase tracking-tighter flex items-center gap-8 mb-8 italic leading-none"><MapPin size={50}/> ZONA DE SEGURIDAD</h4><p className="text-2xl leading-relaxed font-light italic">La Serena es costera. Ante sismo grado VII o superior que impida mantenerse en pie: **EVACUAR HACIA LA COTA 30** (Sobre Avenida Cisternas hacia el oriente).</p></div></>} 
    />;

    // 10. EDUCACIÓN
    case 10: return <ChapterLayout title="Educación" subtitle="Capacitación Continua e Innovación" 
      visual={<div className="p-20 animate-in zoom-in duration-1000"><GraduationCap size={220} className="text-red-600 drop-shadow-[0_0_50px_red] animate-pulse"/></div>}
      content={<><p className="text-4xl font-black text-white mb-10 border-b border-white/5 pb-8 uppercase italic tracking-tighter leading-none shadow-xl">Formación de Vanguardia.</p><p className="text-2xl font-light leading-relaxed">En la IMLS impulsamos tu crecimiento profesional como motor de cambio comunal. A través de nuestras plataformas de e-learning y capacitación presencial, accederás a:</p><div className="grid gap-10 mt-14"><div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex items-center gap-10 shadow-2xl hover:bg-white/10 transition-all group cursor-pointer"><BookOpen className="text-red-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="text-white font-black text-3xl uppercase tracking-tighter leading-none italic">Academia Municipal</h4><p className="text-slate-400 text-xl mt-3 font-light leading-snug">Cursos de gestión pública moderna, atención vecinal y herramientas Smart City con certificación.</p></div></div><div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex items-center gap-10 shadow-2xl hover:bg-white/10 transition-all group cursor-pointer"><Zap className="text-orange-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="text-white font-black text-3xl uppercase tracking-tighter leading-none italic">Sello de Innovación</h4><p className="text-slate-400 text-xl mt-3 font-light leading-snug">Programas especiales para proponer soluciones digitales a los problemas territoriales de La Serena.</p></div></div></div></>} 
    />;

    // 11. EVALUACIÓN (BLINDADA)
    case 11: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto font-sans relative">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-6xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000 ring-1 ring-white/5">
           <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden rounded-t-[5rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_30px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-14 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-12 text-[14px] font-black text-slate-500 uppercase tracking-[0.5em] border-b border-white/5 pb-6"><span>EXAMEN DE INGRESO IMLS</span><span className="bg-red-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-xl">Pregunta {quizIndex + 1} / 10</span></div>
               <h3 className="text-5xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-6 pt-10">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-12 rounded-[2.5rem] border-2 font-black text-3xl transition-all shadow-xl ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-red-600 scale-100 active:scale-95' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/30 border-green-600 text-green-400 shadow-[0_0_60px_rgba(22,163,74,0.4)] scale-105' : 'opacity-20 grayscale text-white scale-95 border-transparent'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-16 p-14 rounded-[4rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border-l-8 border-red-600">
                    <p className="text-sm text-slate-500 mb-8 uppercase font-black tracking-[0.5em] flex items-center gap-4">{quizState === 'correct' ? <><CheckCircle className="text-green-500"/> ¡RESPUESTA CORRECTA!</> : <><X className="text-red-500"/> NOTA TÉCNICA DEL MÓDULO:</>}</p>
                    <p className="text-white text-4xl font-light italic leading-snug font-serif tracking-tight">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-16 bg-white text-slate-950 p-10 rounded-[2.5rem] font-black uppercase text-xl tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-8 shadow-white/10">SIGUIENTE DESAFÍO <ArrowRight size={36}/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={250} className="mx-auto text-yellow-500 mb-14 drop-shadow-[0_0_60px_rgba(234,179,8,0.6)] animate-bounce" />
               <h2 className="text-8xl lg:text-[11rem] font-black text-white mb-12 tracking-tighter uppercase italic leading-[0.75] shadow-xl">¡ERES PARTE<br/>DEL EQUIPO!</h2>
               <p className="text-slate-400 mb-24 text-4xl font-light max-w-5xl mx-auto leading-relaxed italic font-serif">Has superado la evaluación institucional con éxito. Tu compromiso con la **Excelencia Municipal** comienza hoy.</p>
               <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-12 rounded-[4rem] font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-4xl shadow-red-900/60 ring-4 ring-red-500/20">GENERAR MI CERTIFICADO OFICIAL</button>
             </div>
           )}
        </div>
      </div>
    );

    // 12. FINAL (CERTIFICADO + REDES + RDMLS)
    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto font-sans">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-32 rounded-[6rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10 ring-1 ring-white/5">
            
            {/* VISTA PREVIA DEL CERTIFICADO */}
            <div className="bg-white p-14 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] mb-24 border-[25px] border-double border-slate-200 text-slate-900 text-left relative overflow-hidden print:m-0 group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000"><img src="/img/escudo.png" className="h-[400px]" /></div>
               <div className="flex justify-between items-center mb-14 border-b-2 border-slate-100 pb-10">
                  <img src="/img/escudo.png" className="h-28 shadow-2xl" />
                  <img src="/img/innovacion.png" className="h-28 shadow-2xl" />
               </div>
               <h1 className="text-8xl font-serif font-black uppercase tracking-[0.2em] mb-6 leading-none italic">CERTIFICADO</h1>
               <p className="text-3xl italic text-slate-400 mb-16 uppercase border-y-2 border-slate-50 py-6 tracking-[0.4em] font-light">Aprobación Inducción Corporativa IMLS 2026</p>
               <h2 className="text-7xl lg:text-[7rem] font-black uppercase mb-8 tracking-tighter border-b-8 border-red-600 inline-block px-4 pb-4">{userData.nombres} {userData.apellidos}</h2>
               <p className="text-3xl font-bold text-slate-500 uppercase tracking-[0.4em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
               <p className="text-3xl text-slate-800 max-w-6xl font-light leading-relaxed mb-16 font-serif">Se otorga el presente reconocimiento por haber cumplido con éxito absoluto los requerimientos formativos de ingreso a la **Ilustre Municipalidad de La Serena**.</p>
               <div className="flex justify-between items-end mt-24">
                  <div className="text-center w-96 border-t-4 border-slate-300 pt-8 text-sm font-black uppercase text-slate-500 tracking-widest shadow-2xl"><img src="/img/firma_personas.png" className="h-24 mx-auto mb-4 opacity-80" />Director Gestión de Personas</div>
                  <div className="text-center text-slate-300 font-serif italic text-3xl tracking-widest">{currentTime.toLocaleDateString()}</div>
                  <div className="text-center w-96 border-t-4 border-slate-300 pt-8 text-sm font-black uppercase text-slate-500 tracking-widest shadow-2xl"><img src="/img/firma_alcaldesa.png" className="h-24 mx-auto mb-4 opacity-80" />Daniela Norambuena - Alcaldesa</div>
               </div>
            </div>

            {/* SECCIÓN RDMLS Y REDES */}
            <div className="grid md:grid-cols-2 gap-24 text-left bg-black/60 p-20 lg:p-32 rounded-[6rem] border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
               <div className="flex flex-col items-center justify-center bg-white p-20 rounded-[5rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] group transition-all hover:scale-110 active:scale-95 cursor-pointer">
                  <QrCode size={350} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-14 text-3xl uppercase tracking-[0.6em] shadow-xl">ACCESO RDMLS</p>
               </div>
               <div className="space-y-16 flex flex-col justify-center">
                  <div className="flex items-center gap-12 group cursor-pointer hover:translate-x-8 transition-transform hover:text-red-500"><div className="p-8 bg-red-600 rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:rotate-12 transition-all"><Radio size={60}/></div><div className="space-y-2"><span className="font-black text-6xl tracking-tighter uppercase block leading-none italic shadow-2xl">Radio Digital</span><p className="text-slate-500 text-2xl font-light italic">La voz de los serenenses en la red.</p></div></div>
                  <div className="flex items-center gap-12 group cursor-pointer hover:translate-x-8 transition-transform hover:text-blue-500"><div className="p-8 bg-blue-600 rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.5)] group-hover:rotate-12 transition-all"><Globe size={60}/></div><div className="space-y-2"><span className="font-black text-6xl tracking-tighter uppercase block leading-none italic shadow-2xl">Portal Web</span><p className="text-slate-500 text-2xl font-light italic">Servicios digitales 24/7.</p></div></div>
                  <button className="mt-16 bg-white text-slate-950 w-full py-12 rounded-[4rem] font-black transition-all shadow-[0_50px_100px_rgba(255,255,255,0.15)] hover:bg-red-600 hover:text-white text-4xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95 flex items-center justify-center gap-10 shadow-2xl" onClick={() => window.print()}><Printer size={48}/> IMPRIMIR DIPLOMA</button>
               </div>
            </div>
            
            <div className="mt-32 flex flex-col items-center gap-12">
              <div className="flex justify-center gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                <img src="/img/escudo.png" className="h-28 object-contain" />
                <img src="/img/innovacion.png" className="h-28 object-contain" />
              </div>
              <p className="text-slate-700 font-black uppercase tracking-[1.5em] text-sm animate-pulse mt-10 italic">ILUSTRE MUNICIPALIDAD DE LA SERENA • CHILE</p>
              <button onClick={() => setStep(0)} className="text-slate-800 hover:text-red-500 flex items-center justify-center gap-8 text-sm uppercase tracking-[1em] font-black transition-colors w-full mt-20 group"><RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-1000"/> CERRAR SESIÓN SEGURA</button>
            </div>
         </div>
      </div>
    );

    default: return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500">
        <div className="text-center p-20 bg-slate-900 rounded-[5rem] shadow-2xl border border-red-900/50">
          <AlertTriangle size={150} className="mx-auto mb-10 animate-bounce" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Error de Secuencia Estructural</h1>
          <p className="text-2xl text-slate-400 mb-12 italic">No se pudo cargar el paso {step}. Reiniciando protocolos de seguridad...</p>
          <button onClick={() => setStep(0)} className="bg-red-600 text-white px-20 py-8 rounded-3xl font-black uppercase tracking-widest text-xl shadow-red-900/50 hover:bg-red-500 transition-all">Restaurar Sistema</button>
        </div>
      </div>
    );
  }
}
