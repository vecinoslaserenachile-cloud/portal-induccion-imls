import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, ShieldCheck, Globe, BookOpen, HeartPulse
} from 'lucide-react';

// --- CONFIGURACIÓN DE IMÁGENES (Para que las reemplaces en public/img/) ---
// portada.jpg, escudo.png, innovacion.png, firma_alcaldesa.png, firma_personas.png
// concejal_1.jpg ... concejal_10.jpg

const DEPARTAMENTOS = [
  { name: "Alcaldía", desc: "Gestión estratégica y representación oficial de la comuna." },
  { name: "Administración Municipal", desc: "Coordinación de procesos y servicios internos." },
  { name: "DIDECO", desc: "Desarrollo Comunitario: El motor social para los serenenses." },
  { name: "SECPLAN", desc: "Planificación: Proyectos de inversión y Smart City." },
  { name: "Dirección de Obras (DOM)", desc: "Permisos de edificación y planificación urbana." },
  { name: "Gestión de Personas", desc: "Bienestar, remuneraciones y desarrollo funcionario." },
  { name: "Seguridad Ciudadana", desc: "Prevención, vigilancia y emergencia 1420." },
  { name: "Tránsito y Transporte", desc: "Licencias, vialidad y permisos de circulación." },
  { name: "Turismo y Patrimonio", desc: "Promoción y resguardo de nuestra capital histórica." },
  { name: "Servicio a la Comunidad", desc: "Aseo, ornato y mantenimiento de áreas verdes." },
  { name: "Salud Municipal", desc: "Atención primaria a través de nuestra red de CESFAM." },
  { name: "Educación", desc: "Administración de liceos y colegios municipales." }
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión municipal." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es el número único de emergencias municipales." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "No usar uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia." },
  { q: "¿Dónde evacuar ante un Tsunami?", options: ["Al Faro", "Cota 30 (Av. Cisternas)", "Plaza de Armas"], ans: 1, explanation: "Sobre la Cota 30 hacia el oriente es la zona segura." },
  { q: "¿Qué área ofrece apoyo psicológico?", options: ["Dirección de Obras", "Calidad de Vida", "Rentas"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Quién diseña los proyectos Smart City?", options: ["SECPLAN", "DIDECO", "Tránsito"], ans: 0, explanation: "SECPLAN es el cerebro técnico de la planificación municipal." },
  { q: "¿Cuál es el rol del concejal?", options: ["Ejecutar obras", "Fiscalizar y Normar", "Atender cajas"], ans: 1, explanation: "El concejo fiscaliza y aprueba las normas locales." },
  { q: "¿Qué significa Probidad?", options: ["Ser rápido", "Rectitud y honestidad", "Ser amable"], ans: 1, explanation: "La Probidad es actuar con una conducta funcionaria intachable." },
  { q: "¿Qué es RDMLS?", options: ["Una oficina", "Radio Digital Municipal", "Un software"], ans: 1, explanation: "Nuestra Radio Digital Municipal, innovación en comunicación." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTE DE VIDEO SEGURO ---
const SafeVideoPlayer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center group">
      {!isLoaded ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 cursor-pointer" onClick={() => setIsLoaded(true)}>
          <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px]" alt="Portada" />
          <div className="relative z-20 flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
               <Play size={40} fill="white" className="text-white ml-2" />
             </div>
             <p className="text-white font-black text-xl uppercase tracking-widest drop-shadow-lg">Reproducir Mensaje</p>
          </div>
        </div>
      ) : (
        <iframe 
          className="w-full h-full aspect-video" 
          src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0&modestbranding=1&enablejsapi=1" 
          title="Bienvenida" frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

// --- APLICACIÓN PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', 
    apellidos: 'Godoy', 
    rut: '12.345.678-9', 
    dept: 'Dirección de Innovación', 
    cargo: 'Director',
    email: 'rodrigo.godoy@laserena.cl'
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

  // Lógica de Scroll y Botones
  const handleScroll = (e: any) => {
    const el = e.target;
    // Si llega al final del scroll con margen de 80px
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos que NO bloquean el botón "Siguiente"
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-desbloqueo si el contenido no tiene scroll (pantallas cortas)
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 1000);
    }
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const correct = idx === QUESTIONS[quizIndex].ans;
    setQuizState(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  };

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Progreso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[100]">
        <div className="h-full bg-red-600 transition-all duration-700 shadow-[0_0_20px_red]" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      {/* Contenedor Dual */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LADO VISUAL (Imagen/Video) */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10 flex items-center justify-center relative backdrop-blur-3xl">
             {visual}
             <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <img src="/img/escudo.png" className="h-10" onError={(e)=>e.currentTarget.style.display='none'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Municipalidad<br/>La Serena</span>
             </div>
           </div>
        </div>

        {/* LADO CONTENIDO (Texto y Scroll) */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950">
          <div className="px-8 lg:px-16 pt-12 pb-6 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Módulo {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-l border-white/10 pl-3">Smart City 2026</span>
             </div>
             <h2 className="text-4xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-4 uppercase italic">{title}</h2>
             <h3 className="text-xl lg:text-3xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-10 scroll-smooth">
            <div className="space-y-12 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-32"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NAVEGACIÓN (SIEMPRE VISIBLE) */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-3 transition-all p-4">
            <ChevronLeft size={24}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-8">
            {canAdvance ? (
               <div className="hidden sm:flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                 <CheckCircle size={24}/> LECTURA LISTA
               </div>
            ) : (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={24} className="animate-bounce"/> BAJA PARA CONTINUAR
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-12 py-5 lg:px-20 lg:py-6 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-[0.3em] transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50 scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              CONTINUAR <ArrowRight size={24} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
          <div>
            <h1 className="text-7xl lg:text-[9rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-xs pl-4 border-l-4 border-red-600 mt-8">Smart City • Patrimonio • Servicio Público</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-6">
            <h3 className="text-white font-black text-3xl mb-8 flex items-center gap-4 uppercase tracking-tighter"><User className="text-red-600" size={32}/> Registro</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm" placeholder="Email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d.name} value={d.name} className="text-black">{d.name}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/50 transition-all hover:scale-[1.03] uppercase text-xl mt-4 flex items-center justify-center gap-4">Ingresar <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenidos" subtitle="Daniela Norambuena, Alcaldesa" visual={<SafeVideoPlayer />}
      content={<><p className="font-black text-5xl text-white mb-8 leading-none tracking-tighter">¡Hola, {userData.nombres}!</p><p>Bienvenido a la **Ilustre Municipalidad de La Serena**. Te integras a una institución con más de 480 años de historia, pero con una visión de futuro innovadora y profundamente humana.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p className="text-slate-400">Durante este recorrido, conocerás los pilares estratégicos de nuestra gestión y los protocolos que garantizan tu bienestar y seguridad en el trabajo.</p></>} 
    />;

    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión y Visión Estratégica" 
      visual={<div className="flex flex-col gap-10 items-center text-center p-12"><Target size={120} className="text-red-600 animate-pulse"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white leading-none">Estrategia<br/>IMLS 2026</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-4"><Star/> Nuestra Misión</h4><p className="text-2xl font-light leading-relaxed">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso económico, social y cultural. Nuestro compromiso es entregar servicios de alta calidad, con eficiencia, total transparencia y máxima calidez humana hacia el serenense.</p></section><section className="space-y-6 pt-10"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-4"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light leading-relaxed">Proyectamos a La Serena como una ciudad líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto absoluto al patrimonio histórico y por brindar una excepcional calidad de vida a sus habitantes.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto h-full">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-[2rem] border border-white/10 text-[10px] font-bold text-center flex flex-col items-center justify-center shadow-xl group hover:border-red-600 transition-all"><User size={24} className="mb-2 text-red-600 group-hover:scale-110 transition-transform"/>{c}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-10 rounded-[3rem] border border-yellow-500/20 shadow-2xl space-y-8"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-4"><Shield/> Atribuciones Clave</h4><ul className="space-y-6 text-xl"><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Fiscalizar el cumplimiento de planes y programas municipales.</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Aprobar el presupuesto municipal anual (más de $70 mil millones).</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Normar ordenanzas y regulaciones comunales.</li></ul></div></>} 
    />;

    case 4: return <ChapterLayout title="La Estructura" subtitle="Direcciones Estratégicas" 
      visual={<div className="flex items-center justify-center h-full p-6"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.2)]" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200/222/fff?text=Mapa+Estructural'}/></div>}
      content={<><p className="text-3xl font-black text-white mb-8">Nuestra Red Operativa:</p><div className="grid gap-6">{DEPARTAMENTOS.slice(0, 8).map(d => (<div key={d.name} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all shadow-xl group"><h4 className="font-black text-red-500 text-2xl uppercase tracking-tighter group-hover:text-white transition-colors">{d.name}</h4><p className="text-slate-400 text-lg mt-3 font-light leading-snug">{d.desc}</p></div>))}</div><p className="text-sm text-slate-600 italic mt-10">La Serena cuenta con un despliegue territorial a través de 4 Delegaciones: Avenida del Mar, La Antena, Las Compañías y Rural.</p></>} 
    />;

    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-12 rounded-full mb-16 text-6xl shadow-[0_0_60px_rgba(255,255,255,0.4)] animate-pulse">IMLS</div><div className="grid grid-cols-2 gap-10 text-center text-sm w-full"><div className="bg-blue-600/30 p-10 rounded-[3rem] border border-blue-500/50 flex flex-col items-center gap-4 shadow-xl"><Users size={50}/><span className="font-black uppercase tracking-widest text-lg">Vecinos</span></div><div className="bg-green-600/30 p-10 rounded-[3rem] border border-green-500/50 flex flex-col items-center gap-4 shadow-xl"><Landmark size={50}/><span className="font-black uppercase tracking-widest text-lg">Gobierno</span></div></div></div>}
      content={<><p className="text-3xl font-bold text-white uppercase italic tracking-tighter">Digitalización al Servicio de la Gente.</p><p>No somos una isla. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central. Nuestra gestión se coordina con el Gobierno Regional, Carabineros, Bomberos y el sector privado para garantizar seguridad y desarrollo integral en cada rincón de la comuna.</p></>} 
    />;

    case 6: return <ChapterLayout title="Seguridad Ciudadana" subtitle="Prevención y Emergencia 1420" 
      visual={<div className="p-16 text-center animate-pulse"><Phone size={150} className="text-red-600 mx-auto drop-shadow-[0_0_30px_red]"/><h4 className="text-white font-black text-8xl mt-10 tracking-tighter italic">1420</h4></div>}
      content={
        <>
          <p className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Tu seguridad es nuestra prioridad.</p>
          <p>La Dirección de Seguridad Ciudadana despliega diariamente patrullajes preventivos y monitorea más de 100 cámaras de alta tecnología en toda la comuna.</p>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 mt-8">
             <div className="flex gap-8 items-center border-b border-white/5 pb-6">
               <div className="bg-red-600 p-5 rounded-2xl text-white shadow-lg"><Phone size={40}/></div>
               <div><h4 className="font-black text-white text-4xl">LÍNEA 1420</h4><p className="text-lg text-slate-400 uppercase tracking-widest font-black">Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-8 items-center">
               <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg"><Eye size={40}/></div>
               <div><h4 className="font-black text-white text-3xl uppercase italic leading-none">Central de Cámaras</h4><p className="text-lg text-slate-400 mt-1">Monitoreo con Inteligencia Artificial 24/7.</p></div>
             </div>
          </div>
          <div className="mt-12 bg-white/5 p-8 rounded-3xl border-l-4 border-yellow-500">
            <h5 className="text-yellow-500 font-black text-xl uppercase mb-2">Recomendación para el Funcionario:</h5>
            <p className="text-lg">Fomenta en los vecinos el uso del número **1420** para denuncias de ruidos molestos, luminarias apagadas o actividades sospechosas. Somos un apoyo vital para Carabineros.</p>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Calidad de Vida" subtitle="Tu Bienestar Integral" 
      visual={<div className="p-16 text-center animate-in zoom-in duration-1000"><HeartHandshake size={240} className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-4xl mt-12 uppercase italic tracking-tighter">Personas Primero</h4></div>}
      content={<><p className="text-2xl font-bold text-white mb-6">En la IMLS eres parte de una familia. Contamos con una red de apoyo para ti y tu familia:</p><div className="space-y-8 mt-10">
        <div className="p-10 border-2 border-green-500/30 bg-green-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl group hover:border-green-400 transition-all"><Stethoscope size={70} className="text-green-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">Salud & Psicología</h4><p className="text-xl text-slate-400 leading-snug">Seguros complementarios, convenios dentales y apoyo psicológico permanente para contención emocional.</p></div></div>
        <div className="p-10 border-2 border-blue-500/30 bg-blue-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl group hover:border-blue-400 transition-all"><Activity size={70} className="text-blue-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">Deportes & Bienestar</h4><p className="text-xl text-slate-400 leading-snug">Acceso gratuito a canchas municipales, ligas de fútbol interno y talleres de pausa activa durante tu jornada.</p></div></div>
      </div></>} 
    />;

    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral 21.643" 
      visual={<div className="p-20 text-center"><Shield size={220} className="text-pink-600 mx-auto drop-shadow-[0_0_40px_rgba(219,39,119,0.4)]"/><h4 className="text-pink-100 font-black text-5xl mt-12 uppercase tracking-tighter">Entorno Seguro</h4></div>}
      content={<><p className="text-3xl font-bold text-white mb-10 border-b border-white/5 pb-6">Tolerancia Cero al Acoso.</p><p className="text-2xl">La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. En este municipio aplicamos protocolos estrictos para garantizar un entorno saludable:</p><div className="grid grid-cols-1 gap-8 mt-12"><div className="bg-pink-600/10 p-10 rounded-[3rem] border border-pink-500/30 flex items-center gap-10 shadow-xl transition-transform hover:scale-105"><AlertTriangle className="text-pink-500" size={60}/><div className="space-y-2"><h5 className="text-white font-black text-3xl uppercase tracking-tighter">Acoso Laboral</h5><p className="text-lg text-slate-400">Toda agresión u hostigamiento que atente contra la dignidad del funcionario.</p></div></div><div className="bg-pink-600/10 p-10 rounded-[3rem] border border-pink-500/30 flex items-center gap-10 shadow-xl transition-transform hover:scale-105"><MessageCircle className="text-pink-500" size={60}/><div className="space-y-2"><h5 className="text-white font-black text-3xl uppercase tracking-tighter leading-none">Violencia Laboral</h5><p className="text-lg text-slate-400 mt-2">Conductas ejercidas por terceros (vecinos o usuarios) hacia el funcionario.</p></div></div></div><p className="mt-12 font-black text-white bg-white/5 p-10 rounded-[2.5rem] text-center border border-white/10 uppercase italic leading-tight shadow-inner">"Un solo acto grave es suficiente para iniciar un proceso de sanción inmediata."</p></>} 
    />;

    case 9: return <ChapterLayout title="Tu Seguridad" subtitle="Protocolo ACHS y Emergencias" 
      visual={<div className="p-20"><AlertTriangle size={220} className="text-yellow-500 mx-auto animate-bounce drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"/><div className="h-4 w-40 bg-black/50 rounded-full mx-auto mt-6 blur-2xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-4xl uppercase tracking-tighter mb-10 border-b border-yellow-500/20 pb-4">Seguro Ley 16.744</h4><p className="text-2xl mb-10 font-bold">Si sufres un accidente laboral o de trayecto:</p><div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl"><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">1</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Aviso a Jefatura</h5><p className="text-xl text-slate-400">Informa a tu superior inmediato en el momento exacto del incidente, por leve que sea.</p></div></div><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">2</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Registro ACHS</h5><p className="text-xl text-slate-400">Acude a la Mutualidad (ACHS) para el registro médico oficial (DIAT) y asegurar tu cobertura.</p></div></div></div><div className="mt-16 bg-blue-600/20 p-10 rounded-[3rem] border border-blue-500/30"><h4 className="text-blue-400 font-black text-3xl uppercase tracking-tighter flex items-center gap-6 mb-6"><MapPin size={40}/> Zona de Tsunami</h4><p className="text-xl leading-relaxed">Ante un sismo grado VII o superior que impida estar de pie: **EVACUAR HACIA LA COTA 30** (Sobre Avenida Cisternas hacia el oriente).</p></div></>} 
    />;

    case 10: return <ChapterLayout title="Educación" subtitle="Capacitación y E-learning" 
      visual={<div className="p-16"><GraduationCap size={200} className="text-red-600 drop-shadow-[0_0_40px_red] animate-pulse"/></div>}
      content={<><p className="text-3xl font-black text-white mb-8 border-b border-white/5 pb-6 uppercase italic tracking-tighter">Formación de Clase Mundial.</p><p className="text-2xl font-light">En la IMLS impulsamos tu crecimiento profesional. A través de nuestras plataformas digitales de educación continua, podrás acceder a certificaciones en:</p><div className="grid gap-6 mt-12"><div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-8 shadow-xl hover:bg-white/10 transition-all"><BookOpen className="text-red-500" size={50}/><div><h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Academia Digital</h4><p className="text-slate-400 mt-2">Cursos de gestión pública moderna y herramientas Smart City.</p></div></div><div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-8 shadow-xl hover:bg-white/10 transition-all"><Zap className="text-orange-500" size={50}/><div><h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Innovación Abierta</h4><p className="text-slate-400 mt-2">Talleres presenciales para proponer mejoras en los procesos vecinales.</p></div></div></div></>} 
    />;

    // --- PASO 11: EVALUACIÓN ---
    case 11: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[5rem] shadow-2xl w-full max-w-5xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000">
           <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden rounded-t-[5rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_30px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-10 text-[14px] font-black text-slate-500 uppercase tracking-[0.5em]"><span>Examen de Ingreso IMLS</span><span className="bg-white/5 px-6 py-3 rounded-full border border-white/10 text-white font-bold">Pregunta {quizIndex + 1} / 10</span></div>
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
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-12 bg-white text-slate-950 p-8 rounded-[2rem] font-black uppercase text-lg tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-6">Siguiente Desafío <ArrowRight size={28}/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={200} className="mx-auto text-yellow-500 mb-12 drop-shadow-[0_0_50px_rgba(234,179,8,0.7)] animate-bounce" />
               <h2 className="text-7xl lg:text-[10rem] font-black text-white mb-10 tracking-tighter uppercase italic leading-none">¡LOGRADO!</h2>
               <p className="text-slate-400 mb-20 text-3xl font-light max-w-4xl mx-auto leading-relaxed italic">Has superado la inducción 2026 con un puntaje de excelencia. Ya puedes reclamar tu certificado institucional.</p>
               <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-12 rounded-[4rem] font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-3xl shadow-red-900/50">Generar Mi Diploma de Aprobación</button>
             </div>
           )}
        </div>
      </div>
    );

    // --- PASO 12: FINAL CON CERTIFICADO Y REDES ---
    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-28 rounded-[5rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10">
            
            {/* CERTIFICADO INTERACTIVO */}
            <div className="bg-white p-12 rounded-3xl shadow-2xl mb-20 border-[15px] border-double border-slate-200 text-slate-900 text-left relative overflow-hidden print:m-0">
               <div className="absolute top-0 right-0 p-8 opacity-10"><img src="/img/escudo.png" className="h-64" /></div>
               <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-8">
                  <img src="/img/escudo.png" className="h-20" />
                  <img src="/img/innovacion.png" className="h-20" />
               </div>
               <h1 className="text-6xl font-serif font-black uppercase tracking-widest mb-4">CERTIFICADO</h1>
               <p className="text-xl italic text-slate-400 mb-12 uppercase border-y border-slate-50 py-4 tracking-widest">Aprobación Inducción Corporativa IMLS 2026</p>
               <h2 className="text-5xl font-black uppercase mb-6">{userData.nombres} {userData.apellidos}</h2>
               <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-10">RUT: {userData.rut} • {userData.dept}</p>
               <p className="text-2xl text-slate-700 max-w-4xl font-light leading-relaxed mb-12">Por haber cumplido con éxito absoluto los requerimientos formativos de ingreso a la **Ilustre Municipalidad de La Serena**.</p>
               <div className="flex justify-between items-end mt-20">
                  <div className="text-center w-64 border-t border-slate-300 pt-4 text-xs font-bold uppercase text-slate-400">Gestión de Personas</div>
                  <div className="text-center text-slate-300 font-serif italic">{currentTime.toLocaleDateString()}</div>
                  <div className="text-center w-64 border-t border-slate-300 pt-4 text-xs font-bold uppercase text-slate-400">Alcaldía La Serena</div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-20 text-left bg-black/40 p-16 lg:p-24 rounded-[5rem] border border-white/5 shadow-inner">
               <div className="flex flex-col items-center justify-center bg-white p-16 rounded-[4rem] shadow-[0_0_80px_rgba(255,255,255,0.15)] group transition-all hover:scale-105">
                  <QrCode size={250} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-10 text-2xl uppercase tracking-[0.6em]">PORTAL RDMLS</p>
               </div>
               <div className="space-y-14 flex flex-col justify-center">
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform hover:text-red-500"><div className="p-6 bg-red-600 rounded-[2rem] shadow-xl group-hover:rotate-12 transition-all"><Radio size={50}/></div><div className="space-y-1"><span className="font-black text-5xl tracking-tighter uppercase block leading-none">Radio Digital</span><p className="text-slate-500 text-xl font-light">La voz de los serenenses en la web.</p></div></div>
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform hover:text-blue-500"><div className="p-6 bg-blue-600 rounded-[2rem] shadow-xl group-hover:rotate-12 transition-all"><Globe size={50}/></div><div className="space-y-1"><span className="font-black text-5xl tracking-tighter uppercase block leading-none">Portal Web</span><p className="text-slate-500 text-xl font-light">Trámites y noticias en línea.</p></div></div>
                  <button className="mt-10 bg-white text-slate-950 w-full py-10 rounded-[3rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-3xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95 flex items-center justify-center gap-6" onClick={() => window.print()}><Printer/> Imprimir Diploma</button>
               </div>
            </div>
            
            <button onClick={() => setStep(0)} className="mt-24 text-slate-600 hover:text-red-500 flex items-center justify-center gap-6 text-sm uppercase tracking-[0.8em] font-black transition-colors w-full uppercase"><RefreshCw size={24}/> Finalizar Sesión Segura</button>
         </div>
      </div>
    );

    default: return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500">
        <div className="text-center">
          <AlertTriangle size={80} className="mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase">Falla de Secuencia</h1>
          <button onClick={() => setStep(0)} className="mt-6 bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest">Reiniciar Sistema</button>
        </div>
      </div>
    );
  }
}
