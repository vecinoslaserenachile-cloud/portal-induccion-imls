import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, Calendar, BookOpen, ShieldCheck, Globe
} from 'lucide-react';

// --- BASE DE DATOS MUNICIPAL EXTENDIDA ---
const DEPARTAMENTOS = [
  "Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", 
  "DIDECO", "Dirección de Obras (DOM)", "Tránsito y Transporte", "DAF", 
  "Gestión de Personas", "Seguridad Ciudadana", "Turismo y Patrimonio", 
  "Servicio a la Comunidad", "Salud (Corporación)", "Educación"
];

const CONCEJALES = [
  { name: "Cristian Marín Pastén", img: "/img/concejal_1.jpg" },
  { name: "Rayen Pojomovsky Aliste", img: "/img/concejal_2.jpg" },
  { name: "Alejandro Astudillo Olguín", img: "/img/concejal_3.jpg" },
  { name: "Gladys Marín Ossandón", img: "/img/concejal_4.jpg" },
  { name: "Francisca Barahona Araya", img: "/img/concejal_5.jpg" },
  { name: "María Teresita Prouvay", img: "/img/concejal_6.jpg" },
  { name: "Camilo Araya Plaza", img: "/img/concejal_7.jpg" },
  { name: "María Marcela Damke", img: "/img/concejal_8.jpg" },
  { name: "Matías Espinosa Morales", img: "/img/concejal_9.jpg" },
  { name: "Luisa Jinete Cárcamo", img: "/img/concejal_10.jpg" }
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos servidores públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal 24/7." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "No usar credencial"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y violencia laboral." },
  { q: "¿Dónde está la zona de seguridad ante Tsunami?", options: ["En el Faro", "Cota 30 (Av. Cisternas)", "Playa"], ans: 1, explanation: "Sobre la Cota 30 hacia el oriente es la zona segura." },
  { q: "¿Qué área ofrece apoyo psicológico?", options: ["Obras", "Calidad de Vida", "Rentas"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Qué dirección diseña los proyectos Smart City?", options: ["SECPLAN", "DIDECO", "Tránsito"], ans: 0, explanation: "SECPLAN es el cerebro técnico de la planificación municipal." },
  { q: "¿Cuál es la misión de un concejal?", options: ["Ejecutar obras", "Fiscalizar y Normar", "Atender público"], ans: 1, explanation: "El concejo fiscaliza la gestión y aprueba las normas locales." },
  { q: "¿Qué significa ser Probo?", options: ["Ser rápido", "Rectitud y honestidad", "Ser amable"], ans: 1, explanation: "La Probidad Administrativa es actuar con rectitud intachable." },
  { q: "¿Qué es RDMLS?", options: ["Una oficina", "Radio Digital Municipal", "Un software"], ans: 1, explanation: "Nuestra Radio Digital Municipal, la voz oficial de la ciudad." },
];

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', 
    apellidos: 'Godoy', 
    rut: '12.345.678-9', 
    dept: 'SECPLAN', 
    cargo: 'Director de Innovación',
    email: 'rodrigo.godoy@laserena.cl',
    ingreso: '2026-03-01'
  });
  
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

  // Lógica de Scroll para móviles y PC
  const handleScroll = (e: any) => {
    const el = e.target;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 60;
    if (isAtBottom) setCanAdvance(true);
  };

  useEffect(() => {
    if ([0, 1, 10, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 10) {
          setCanAdvance(true);
        }
      }, 800);
    }
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = idx === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  const printCertificate = () => window.print();

  // --- LAYOUT MAESTRO ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_15px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center relative border border-white/10">
             {visual}
             <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                <img src="/img/escudo.png" className="h-8 opacity-80" />
             </div>
           </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden relative">
          <div className="px-8 lg:px-16 pt-10 pb-4 shrink-0 border-b border-white/5">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">MÓDULO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-3 border-l border-white/10">INDUCCIÓN CORPORATIVA</span>
             </div>
             <h2 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter mb-2">{title}</h2>
             <h3 className="text-lg lg:text-2xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8 scroll-smooth">
            <div className="space-y-10 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-24"></div> 
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-50">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all p-4 border border-white/5 rounded-xl">
            <ChevronLeft size={20}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-6">
            {!canAdvance && (
              <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <ChevronDown size={18}/> BAJA EL SCROLL PARA CONTINUAR
              </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-10 py-4 lg:px-14 lg:py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-widest
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/50 scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              {canAdvance && <CheckCircle size={20} className="text-white animate-bounce"/>}
              SIGUIENTE <ArrowRight size={20} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- ESCENAS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-12">
        <div className="text-center md:text-left space-y-6 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 mx-auto md:mx-0 drop-shadow-2xl" />
          <h1 className="text-7xl lg:text-[8rem] font-black text-white leading-none tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs pl-2 border-l-4 border-red-600 mt-6">Gestión de Personas • Smart City</p>
        </div>
        
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-3 uppercase tracking-tighter"><User className="text-red-600"/> Identificación de Funcionario</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Nombres</label>
                <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Apellidos</label>
                <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">RUT</label>
                <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Fecha Ingreso</label>
                <input type="date" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm" value={userData.ingreso} onChange={e => setUserData({...userData, ingreso: e.target.value})}/>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Email Institucional</label>
              <input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})}/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Dirección Municipal</label>
              <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                  {DEPARTAMENTOS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
              </select>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-5 rounded-2xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all uppercase text-lg mt-4 flex items-center justify-center gap-3 hover:scale-[1.02]">Comenzar Inducción <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenidos" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black">
          <iframe className="w-full h-full aspect-video scale-105" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1" title="Bienvenida" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      }
      content={<><p className="font-black text-5xl text-white mb-8">¡Bienvenido, {userData.nombres}!</p><p>Te integras a la **Ilustre Municipalidad de La Serena**, una institución con más de 480 años de historia, pero con una visión de futuro innovadora y profundamente humana.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p>En este proceso, conocerás los pilares estratégicos y los protocolos que te protegen a ti y a nuestra comunidad.</p></>} 
    />;

    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión y Visión Estratégica" 
      visual={<div className="flex flex-col gap-10 items-center text-center p-12"><Target size={120} className="text-red-600 animate-pulse drop-shadow-[0_0_20px_red]"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white">Estrategia 2026</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Star/> Misión Institucional</h4><p className="text-2xl font-light leading-relaxed">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso económico, social y cultural. Nuestro compromiso es entregar servicios de alta calidad, eficiencia y total transparencia.</p></section><section className="space-y-6 pt-10 border-t border-white/5"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Visión de Ciudad</h4><p className="text-2xl font-light leading-relaxed">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto al patrimonio histórico y por brindar la mejor calidad de vida a sus habitantes.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="El Cuerpo Colegiado" 
      visual={<div className="grid grid-cols-2 gap-4 p-8 overflow-y-auto">{CONCEJALES.map(c => <div key={c.name} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[10px] font-bold text-center flex flex-col items-center"><User size={20} className="mb-2 text-red-600"/>{c.name}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar las normas que rigen nuestra ciudad.</p><div className="bg-yellow-500/10 p-10 rounded-[3rem] border border-yellow-500/20 shadow-xl space-y-6"><h4 className="text-yellow-500 font-black text-2xl uppercase flex items-center gap-3"><Shield/> Atribuciones del Concejo</h4><ul className="space-y-4 text-xl"><li>• Aprobar el presupuesto municipal anual.</li><li>• Fiscalizar el cumplimiento de planes y programas.</li><li>• Dictar las ordenanzas municipales.</li></ul></div></>} 
    />;

    case 4: return <ChapterLayout title="La Estructura" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center h-full p-6"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-2xl" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200/222/fff?text=Mapa+Estructural'}/></div>}
      content={<><p className="text-3xl font-black text-white mb-8 italic">Organización Eficiente:</p><div className="grid gap-6">
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-6 items-center"><Heart className="text-red-500" size={40}/><div><h4 className="font-black text-white text-xl uppercase">DIDECO</h4><p className="text-slate-400 text-sm">Desarrollo Comunitario: El motor social de la municipalidad.</p></div></div>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-6 items-center"><Building2 className="text-blue-500" size={40}/><div><h4 className="font-black text-white text-xl uppercase">DOM</h4><p className="text-slate-400 text-sm">Obras Municipales: El brazo constructor y fiscalizador urbano.</p></div></div>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-6 items-center"><Search className="text-green-500" size={40}/><div><h4 className="font-black text-white text-xl uppercase">SECPLAN</h4><p className="text-slate-400 text-sm">Planificación: Donde nace la inversión y los proyectos Smart.</p></div></div>
      </div></>} 
    />;

    case 5: return <ChapterLayout title="Smart City" subtitle="Nuestros Públicos" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-10 rounded-full mb-12 text-5xl shadow-[0_0_60px_rgba(255,255,255,0.4)]">IMLS</div><div className="grid grid-cols-2 gap-8 text-center text-sm w-full"><div className="bg-blue-600/30 p-8 rounded-[3rem] border border-blue-500/50 flex flex-col items-center gap-3 shadow-xl"><Users size={40}/><span className="font-black uppercase tracking-widest text-lg">Vecinos</span></div><div className="bg-green-600/30 p-8 rounded-[3rem] border border-green-500/50 flex flex-col items-center gap-3 shadow-xl"><Landmark size={40}/><span className="font-black uppercase tracking-widest text-lg">Gobierno</span></div></div></div>}
      content={<><p>Ponemos la tecnología al servicio de la gente. El ecosistema municipal interactúa 24/7 con el **Vecino**, buscando agilizar trámites, mejorar la seguridad y fortalecer la transparencia pública.</p><div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-blue-600"><p className="text-lg italic">"Nuestra meta es una ciudad conectada, segura y eficiente a través de la digitalización de servicios."</p></div></>} 
    />;

    case 6: return <ChapterLayout title="Seguridad Ciudadana" subtitle="Prevención y Comunidad 24/7" 
      visual={<div className="p-16 text-center animate-pulse"><Phone size={150} className="text-red-600 mx-auto drop-shadow-[0_0_30px_red]"/><h4 className="text-white font-black text-7xl mt-10 tracking-tighter italic">1420</h4></div>}
      content={
        <>
          <p className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Tu tranquilidad es nuestra prioridad.</p>
          <p>La Dirección de Seguridad Ciudadana despliega diariamente patrullajes preventivos y cámaras de alta tecnología en toda la comuna. Somos ojos y oídos para la prevención del delito.</p>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 mt-8">
             <div className="flex gap-6 items-center">
               <div className="bg-red-600 p-4 rounded-2xl text-white shadow-lg"><Phone size={40}/></div>
               <div><h4 className="font-black text-white text-3xl">LÍNEA 1420</h4><p className="text-lg text-slate-400 uppercase tracking-widest font-black">Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-6 items-center">
               <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg"><Eye size={40}/></div>
               <div><h4 className="font-black text-white text-2xl uppercase italic">Central de Cámaras</h4><p className="text-sm">Monitoreo con IA en puntos críticos de la ciudad.</p></div>
             </div>
          </div>
          <p className="mt-10 text-slate-500 font-bold uppercase tracking-widest text-sm">Recuerda: Seguridad la construimos entre todos.</p>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Calidad de Vida" subtitle="Bienestar Integral" 
      visual={<div className="p-16 text-center animate-in zoom-in duration-1000"><HeartHandshake size={200} className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-4xl mt-12 uppercase italic tracking-tighter">Funcionario Primero</h4></div>}
      content={<><p>En la IMLS no solo eres un trabajador, eres parte de una familia. Contamos con una red de apoyo para ti y tu familia:</p><div className="space-y-8 mt-10">
        <div className="p-8 border-2 border-green-500/30 bg-green-500/10 rounded-[2.5rem] flex gap-8 items-center shadow-2xl"><Stethoscope size={60} className="text-green-500 shrink-0"/><div className="space-y-2"><h4 className="font-black text-white text-2xl uppercase tracking-tighter">Salud & Psicología</h4><p className="text-lg">Seguros complementarios y equipo de psicólogos permanente.</p></div></div>
        <div className="p-8 border-2 border-blue-500/30 bg-blue-500/10 rounded-[2.5rem] flex gap-8 items-center shadow-2xl"><Activity size={60} className="text-blue-500 shrink-0"/><div className="space-y-2"><h4 className="font-black text-white text-2xl uppercase tracking-tighter">Deportes & Pausas</h4><p className="text-lg">Acceso a canchas municipales y ligas de fútbol interno.</p></div></div>
      </div></>} 
    />;

    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral 21.643" 
      visual={<div className="p-20 text-center"><Shield size={200} className="text-pink-600 mx-auto drop-shadow-[0_0_40px_rgba(219,39,119,0.4)]"/><h4 className="text-pink-100 font-black text-5xl mt-12 uppercase tracking-tighter leading-none">Respeto<br/>Absoluto</h4></div>}
      content={<><p className="text-3xl font-bold text-white mb-10">Tolerancia Cero al Acoso.</p><p>La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. En este municipio aplicamos protocolos estrictos para garantizar un entorno seguro:</p><div className="bg-pink-600/10 p-10 rounded-[3rem] border border-pink-500/30 space-y-6 mt-10 shadow-2xl transition-transform hover:scale-105"><div className="flex gap-8 items-center"><AlertTriangle className="text-pink-500" size={50}/><div className="space-y-1"><h5 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Canales Confidenciales</h5><p className="text-lg text-slate-400 font-light">Toda denuncia es tratada bajo estricto anonimato y respeto.</p></div></div></div><p className="mt-12 font-black text-white bg-white/5 p-8 rounded-3xl text-center border border-white/10 uppercase italic leading-tight italic font-serif">"Un solo acto grave es suficiente para iniciar un proceso de sanción."</p></>} 
    />;

    case 9: return <ChapterLayout title="Seguridad Laboral" subtitle="Protocolo ACHS y Emergencias" 
      visual={<div className="p-20"><AlertTriangle size={200} className="text-yellow-500 mx-auto animate-bounce drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"/><div className="h-4 w-40 bg-black/50 rounded-full mx-auto mt-6 blur-2xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-4xl uppercase tracking-tighter mb-10 border-b border-yellow-500/20 pb-4">Seguro Ley 16.744</h4><p className="text-2xl mb-10 font-bold">Si te lesionas en horario laboral o de trayecto:</p><div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl"><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">1</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Aviso a Jefatura</h5><p className="text-xl text-slate-400">Informa a tu superior inmediato en el momento exacto del incidente.</p></div></div><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">2</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Registro ACHS</h5><p className="text-xl text-slate-400">Acude a la Mutualidad (ACHS) para el registro médico oficial (DIAT).</p></div></div></div><div className="mt-16 bg-blue-600/20 p-10 rounded-[3rem] border border-blue-500/30 shadow-xl"><h4 className="text-blue-400 font-black text-3xl uppercase tracking-tighter flex items-center gap-6 mb-6"><MapPin size={40}/> Zona de Tsunami</h4><p className="text-xl leading-relaxed">Ante sismo de alta intensidad: **EVACUAR HACIA LA COTA 30** (Av. Cisternas hacia el oriente).</p></div></>} 
    />;

    case 10: return <ChapterLayout title="Capacitación" subtitle="E-learning e Innovación" 
      visual={<div className="p-16"><GraduationCap size={200} className="text-red-600 mx-auto drop-shadow-[0_0_20px_red] animate-pulse"/></div>}
      content={<><p className="text-3xl font-bold text-white mb-10">La formación no termina hoy.</p><p className="text-2xl font-light leading-relaxed">En la Ilustre Municipalidad de La Serena impulsamos el crecimiento constante. A través de nuestras plataformas digitales de educación, podrás acceder a cursos de especialización administrativa, liderazgo y herramientas Smart City.</p><div className="grid gap-6 mt-12"><div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6"><BookOpen className="text-red-500" size={32}/><div><h4 className="font-black uppercase">Portal Academia IMLS</h4><p className="text-sm text-slate-400 font-light">Cursos online con certificación interna.</p></div></div><div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6"><Zap className="text-orange-500" size={32}/><div><h4 className="font-black uppercase">Innovación Abierta</h4><p className="text-sm text-slate-400 font-light">Talleres presenciales de modernización municipal.</p></div></div></div></>} 
    />;

    case 11: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto font-sans">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[5rem] shadow-2xl w-full max-w-5xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000">
           <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden rounded-t-[5rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_30px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-10 text-[14px] font-black text-slate-500 uppercase tracking-[0.5em]"><span>Examen de Ingreso IMLS</span><span className="bg-white/5 px-6 py-3 rounded-full border border-white/10 text-white font-bold">Pregunta {quizIndex + 1} de 10</span></div>
               <h3 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-6 pt-10">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-10 rounded-[2.5rem] border-2 font-black text-2xl transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-white/40 scale-100' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_50px_rgba(22,163,74,0.4)] scale-105' : 'opacity-20 grayscale text-white scale-95'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-16 p-12 rounded-[4rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-2xl">
                    <p className="text-[12px] text-slate-500 mb-6 uppercase font-black tracking-[0.5em]">{quizState === 'correct' ? '✅ Brillante' : '❌ Nota Técnica:'}</p>
                    <p className="text-white text-3xl font-light italic leading-snug font-serif">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-12 bg-white text-slate-950 p-8 rounded-[2rem] font-black uppercase text-lg tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-6">Continuar Evaluación <ArrowRight size={28}/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={200} className="mx-auto text-yellow-500 mb-12 drop-shadow-[0_0_50px_rgba(234,179,8,0.7)] animate-bounce" />
               <h2 className="text-7xl lg:text-[10rem] font-black text-white mb-10 tracking-tighter uppercase italic leading-none">¡APROBADO!</h2>
               <p className="text-slate-400 mb-20 text-3xl font-light max-w-4xl mx-auto leading-relaxed">Has superado la evaluación con un **{(score/10)*100}%** de éxito. Eres oficialmente parte de la excelencia municipal.</p>
               <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-12 rounded-[4rem] font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-3xl shadow-red-900/50">Obtener Certificado Digital</button>
             </div>
           )}
        </div>
      </div>
    );

    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-28 rounded-[5rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10">
            <div className="flex justify-center gap-8 mb-12 animate-bounce">
              <img src="/img/escudo.png" className="h-24 object-contain shadow-2xl" />
              <img src="/img/innovacion.png" className="h-24 object-contain shadow-2xl" />
            </div>
            <h2 className="text-7xl lg:text-[9rem] font-black mb-12 tracking-tighter uppercase leading-[0.75] italic">¡BIENVENIDO<br/>A BORDO!</h2>
            <p className="text-3xl lg:text-4xl text-slate-400 mb-24 font-light max-w-5xl mx-auto leading-relaxed italic font-serif">Tu inducción termina hoy, pero tu carrera en el municipio recién comienza. Súmate a nuestras redes y vive la transformación digital.</p>
            
            <div className="grid md:grid-cols-2 gap-20 text-left bg-black/40 p-16 lg:p-24 rounded-[5rem] border border-white/5 shadow-inner">
               <div className="flex flex-col items-center justify-center bg-white p-16 rounded-[4rem] shadow-[0_0_80px_rgba(255,255,255,0.15)] group transition-all hover:scale-105">
                  <QrCode size={250} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-10 text-2xl uppercase tracking-[0.5em]">ACCESO RDMLS</p>
               </div>
               <div className="space-y-14 flex flex-col justify-center">
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform hover:text-red-500"><div className="p-6 bg-red-600 rounded-[2rem] shadow-xl group-hover:rotate-12 transition-all"><Radio size={50}/></div><div className="space-y-1"><span className="font-black text-5xl tracking-tighter uppercase block leading-none">Radio Digital</span><p className="text-slate-500 text-xl font-light">La voz oficial de los serenenses.</p></div></div>
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform hover:text-blue-500"><div className="p-6 bg-blue-600 rounded-[2rem] shadow-xl group-hover:rotate-12 transition-all"><Globe size={50}/></div><div className="space-y-1"><span className="font-black text-5xl tracking-tighter uppercase block leading-none">Portal Web</span><p className="text-slate-500 text-xl font-light">Noticias y servicios en línea.</p></div></div>
                  <button className="mt-10 bg-white text-slate-950 w-full py-10 rounded-[3rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-3xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95">Ir al Portal RDMLS.CL</button>
               </div>
            </div>
            
            <div className="mt-24 flex flex-col items-center gap-6">
              <p className="text-slate-500 font-bold uppercase tracking-[1em] text-xs">Ilustre Municipalidad de La Serena • Chile</p>
              <button onClick={() => window.print()} className="bg-white/5 border border-white/10 text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4"><Printer size={18}/> Imprimir Comprobante de Aprobación</button>
              <button onClick={() => setStep(0)} className="text-slate-700 hover:text-red-500 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.8em] font-black transition-colors w-full uppercase mt-12"><RefreshCw size={24}/> Cerrar Sesión</button>
            </div>
         </div>
      </div>
    );

    default: return null;
  }
}
