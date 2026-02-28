import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, Calendar, BookOpen, ShieldCheck, Globe, Eye
} from 'lucide-react';

// --- DATA MUNICIPAL ---
const DEPARTAMENTOS = ["Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", "DIDECO", "Dirección de Obras (DOM)", "Tránsito", "DAF", "Gestión de Personas", "Seguridad Ciudadana", "Turismo y Patrimonio", "Servicio a la Comunidad", "Salud", "Educación"];

const CONCEJALES = ["Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín", "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay", "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. La gestión la construimos todos los funcionarios sin importar su contrato." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de cada una de nuestras decisiones." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal directo 24/7." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Seguridad primero: Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Qué busca el área de Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar integral", "Nada"], ans: 1, explanation: "Buscamos el bienestar físico, mental y social del funcionario y su familia." },
  { q: "¿Cuál es un valor municipal intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base ética de nuestra función pública." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN diseña y postula los proyectos para la comuna." },
  { q: "¿Qué es RDMLS?", options: ["Una oficina", "Radio Digital Municipal", "Un parque"], ans: 1, explanation: "Radio Digital Municipal La Serena, nuestra voz oficial de innovación." },
  { q: "¿Qué debo hacer al terminar?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Te invitamos a sumarte a nuestras redes y portales." },
];

// --- APP ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', 
    dept: 'SECPLAN', cargo: 'Director de Innovación', 
    email: 'rodrigo.godoy@laserena.cl', fecha: '2026-03-01' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lógica de Scroll mejorada
  const handleScroll = (e: any) => {
    const el = e.target;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    if (isAtBottom) setCanAdvance(true);
  };

  useEffect(() => {
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-desbloqueo si el contenido no requiere scroll
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 50) {
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
    if (idx === QUESTIONS[quizIndex].ans) {
      setQuizState('correct');
      setScore(s => s + 1);
    } else {
      setQuizState('wrong');
    }
  };

  // --- LAYOUT MAESTRO ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Barra de Progreso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_20px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LADO VISUAL */}
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center relative border border-white/10 group">
             {visual}
             <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <img src="/img/escudo.png" className="h-10" onError={(e) => e.currentTarget.src='https://placehold.co/100x100?text=IMLS'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">MUNICIPALIDAD<br/>LA SERENA</span>
             </div>
           </div>
        </div>

        {/* LADO CONTENIDO */}
        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden relative">
          <div className="px-8 lg:px-16 pt-12 pb-6 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">MÓDULO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-3 border-l border-white/10">INDUCCIÓN CORPORATIVA</span>
             </div>
             <h2 className="text-3xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-2 italic uppercase">{title}</h2>
             <h3 className="text-lg lg:text-3xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-10 scroll-smooth">
            <div className="space-y-12 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-40"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NAVEGACIÓN */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-50">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-3 transition-all p-4 border border-white/5 rounded-xl">
            <ChevronLeft size={24}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-8">
            {!canAdvance && (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={24} className="animate-bounce"/> DESLIZA EL TEXTO PARA CONTINUAR
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
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-40 lg:h-52 mx-auto md:mx-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" onError={(e) => e.currentTarget.src='https://placehold.co/200x200?text=IMLS'} />
          <div>
            <h1 className="text-7xl lg:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.6em] text-xs pl-4 border-l-4 border-red-600 mt-8">Smart City • Gestión • Comunidad</p>
          </div>
        </div>
        
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl mb-6 flex items-center gap-4 uppercase tracking-tighter border-b border-white/5 pb-4"><User className="text-red-600" size={32}/> Acceso Funcionario</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="Cargo" value={userData.cargo} onChange={e => setUserData({...userData, cargo: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-7 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/50 transition-all hover:scale-[1.03] uppercase text-xl mt-4 flex items-center justify-center gap-4 shadow-red-600/20">Ingresar <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // 1. VIDEO
    case 1: return <ChapterLayout title="Bienvenidos" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black relative flex items-center justify-center">
          {!videoStarted ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 cursor-pointer" onClick={() => setVideoStarted(true)}>
              <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px]" />
              <div className="relative flex flex-col items-center gap-6">
                 <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-transform hover:scale-110">
                   <Play size={40} fill="white" className="ml-2 text-white" />
                 </div>
                 <h4 className="text-white font-black text-2xl uppercase tracking-[0.3em]">Reproducir Mensaje</h4>
              </div>
            </div>
          ) : (
            <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0&modestbranding=1" title="Mensaje" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          )}
        </div>
      }
      content={<><p className="font-black text-6xl text-white mb-10 leading-none tracking-tighter uppercase italic">¡Bienvenido a la IMLS!</p><p className="text-2xl">Es un honor saludarte. Te integras a una institución de excelencia, donde nuestra misión trasciende los límites de una oficina para impactar en la vida de miles de familias serenenses.</p><div className="bg-red-600/20 p-12 rounded-[4rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-4xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es una oportunidad de servir."</div><p className="text-slate-400">Durante este recorrido conocerás quiénes somos y cómo protegemos nuestra capital patrimonial.</p></>} 
    />;

    // 2. ESTRATEGIA
    case 2: return <ChapterLayout title="La Brújula" subtitle="Estrategia 2026" 
      visual={<div className="flex flex-col gap-12 items-center p-12"><Target size={150} className="text-red-600 drop-shadow-[0_0_30px_red] animate-pulse"/><h4 className="font-black text-7xl uppercase tracking-tighter text-white leading-none italic text-center">MISIÓN<br/>& VISIÓN</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4"><Star/> Nuestra Misión</h4><p className="text-2xl font-light">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso económico, social y cultural. Entregar servicios de alta calidad, eficiencia y total transparencia con máxima calidez humana.</p></section><section className="space-y-6 pt-12 border-t border-white/5"><h4 className="text-orange-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto absoluto al patrimonio histórico y por brindar la mejor calidad de vida a sus habitantes.</p></section></>} 
    />;

    // 3. CONCEJO
    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto h-full">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center shadow-xl group hover:border-red-600 transition-all"><User size={28} className="mb-3 text-red-600 mx-auto group-hover:scale-125 transition-transform"/><p className="text-[11px] font-black uppercase text-white">{c}</p></div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave.</p><div className="bg-yellow-500/10 p-12 rounded-[4rem] border border-yellow-500/20 shadow-2xl space-y-10 mt-6"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-6 italic"><Shield size={40}/> Atribuciones Clave</h4><ul className="space-y-8 text-2xl font-light"><li>• Fiscalizar el presupuesto municipal anual.</li><li>• Normar ordenanzas y regulaciones locales.</li><li>• Aprobar el Plan Comunal de Desarrollo (PLADECO).</li></ul></div></>} 
    />;

    // 4. ESTRUCTURA
    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center h-full p-8"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_60px_rgba(220,38,38,0.2)]" onError={(e) => e.currentTarget.src='https://placehold.co/800x1200?text=Mapa+Estructural'}/></div>}
      content={<><p className="text-3xl font-black text-white italic border-l-8 border-red-600 pl-8 uppercase tracking-tighter">Organización del Servicio:</p><div className="grid gap-8 mt-10">
        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-red-600/10 transition-all"><Heart className="text-red-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">DIDECO</h4><p className="text-slate-400 text-xl mt-4 font-light">Desarrollo Comunitario: El motor social directo hacia el vecino.</p></div></div>
        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-blue-600/10 transition-all"><Building2 className="text-blue-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">DOM</h4><p className="text-slate-400 text-xl mt-4 font-light">Obras Municipales: El brazo constructor y fiscalizador del espacio urbano.</p></div></div>
      </div></>} 
    />;

    // 5. SMART CITY
    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-12 rounded-full mb-16 text-6xl shadow-[0_0_80px_rgba(255,255,255,0.4)]">IMLS</div><div className="grid grid-cols-2 gap-10 text-center text-sm w-full"><div className="bg-blue-600/30 p-10 rounded-[3rem] border border-blue-500/50 flex flex-col items-center gap-4"><Users size={50}/><span className="font-black uppercase tracking-widest text-lg">Vecinos</span></div><div className="bg-green-600/30 p-10 rounded-[3rem] border border-green-500/50 flex flex-col items-center gap-4"><Landmark size={50}/><span className="font-black uppercase tracking-widest text-lg">Gobierno</span></div></div></div>}
      content={<><p className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none">Tecnología al Servicio de la Gente.</p><p className="text-2xl font-light">No somos una isla. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central. Nuestra gestión se coordina con Carabineros, Bomberos y el sector privado para garantizar seguridad y desarrollo integral en cada barrio.</p></>} 
    />;

    // 6. SEGURIDAD 1420
    case 6: return <ChapterLayout title="Seguridad" subtitle="Prevención y Emergencia 1420" 
      visual={<div className="p-20 text-center animate-in zoom-in duration-1000"><Phone size={180} className="text-red-600 mx-auto drop-shadow-[0_0_40px_red]"/><h4 className="text-white font-black text-9xl mt-12 tracking-tighter italic leading-none">1420</h4></div>}
      content={
        <>
          <p className="text-4xl font-black text-white mb-10 uppercase tracking-tighter italic leading-none">Tu tranquilidad es nuestra prioridad.</p>
          <p className="text-2xl font-light">La Dirección de Seguridad Ciudadana despliega patrullajes preventivos y monitorea más de 100 cámaras de alta tecnología con IA las 24 horas del día.</p>
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-12 mt-12">
             <div className="flex gap-10 items-center border-b border-white/5 pb-10">
               <div className="bg-red-600 p-6 rounded-3xl text-white shadow-2xl"><Phone size={50}/></div>
               <div><h4 className="font-black text-white text-5xl">LÍNEA 1420</h4><p className="text-xl text-slate-400 uppercase tracking-widest font-black">Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-10 items-center">
               <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-2xl"><Eye size={50}/></div>
               <div><h4 className="font-black text-white text-4xl uppercase italic leading-none">Central de Cámaras</h4><p className="text-xl text-slate-400 font-light">Apoyo Táctico a Carabineros de Chile.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    // 7. CALIDAD DE VIDA
    case 7: return <ChapterLayout title="Bienestar" subtitle="Tu Calidad de Vida" 
      visual={<div className="p-16 text-center animate-pulse"><HeartHandshake size={240} className="text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-5xl mt-14 uppercase italic tracking-tighter leading-none shadow-xl">PERSONAS<br/>PRIMERO</h4></div>}
      content={<><p className="text-3xl font-black text-white mb-10 italic border-l-4 border-red-600 pl-6 uppercase">Cuidamos a quienes cuidan la ciudad.</p><div className="space-y-10 mt-12">
        <div className="p-10 border-2 border-green-500/30 bg-green-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl"><Stethoscope size={70} className="text-green-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter">Salud & Psicología</h4><p className="text-xl text-slate-400 leading-snug">Convenios dentales, seguros médicos y apoyo psicológico permanente para contención emocional.</p></div></div>
        <div className="p-10 border-2 border-blue-500/30 bg-blue-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl"><Activity size={70} className="text-blue-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter">Deporte & Bienestar</h4><p className="text-xl text-slate-400 leading-snug">Acceso a canchas municipales, ligas de fútbol interno y pausas activas.</p></div></div>
      </div></>} 
    />;

    // 8. LEY KARIN
    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral 21.643" 
      visual={<div className="p-24 text-center"><Shield size={250} className="text-pink-600 mx-auto drop-shadow-[0_0_50px_rgba(219,39,119,0.4)]"/><h4 className="text-pink-100 font-black text-6xl mt-12 uppercase tracking-tighter leading-none italic">RESPETO<br/>TOTAL</h4></div>}
      content={<><p className="text-4xl font-black text-white mb-10 italic uppercase leading-none border-b border-white/5 pb-8 tracking-tighter">Tolerancia Cero al Acoso.</p><p className="text-2xl font-light">La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. Contamos con protocolos inmediatos para proteger tu integridad física y psíquica:</p><div className="grid grid-cols-1 gap-10 mt-12"><div className="bg-pink-600/10 p-12 rounded-[4rem] border border-pink-500/30 flex items-center gap-12 shadow-2xl"><AlertTriangle className="text-pink-500" size={70}/><div className="space-y-2"><h5 className="text-white font-black text-4xl uppercase tracking-tighter italic">Acoso Laboral</h5><p className="text-xl text-slate-400 font-light leading-relaxed">Hostigamiento reiterado que atente contra la dignidad del funcionario.</p></div></div></div><p className="mt-14 font-black text-white bg-white/5 p-12 rounded-[3rem] text-center border border-white/10 uppercase italic leading-tight text-2xl">"Un solo acto grave es suficiente para activar la protección."</p></>} 
    />;

    // 9. SEGURIDAD ACHS
    case 9: return <ChapterLayout title="Protección" subtitle="Seguridad ACHS y Emergencias" 
      visual={<div className="p-24 animate-bounce"><AlertTriangle size={240} className="text-yellow-500 mx-auto drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]"/></div>}
      content={<><h4 className="text-yellow-500 font-black text-5xl uppercase tracking-tighter mb-12 border-b border-yellow-500/20 pb-6 italic leading-none">SEGURO LEY 16.744</h4><p className="text-3xl mb-12 font-black text-white italic tracking-tighter uppercase leading-none">Protocolo Ante Accidentes:</p><div className="bg-white/5 p-14 rounded-[5rem] border border-white/10 space-y-16 shadow-2xl"><div className="flex gap-12 items-start"><div className="bg-yellow-500 text-slate-950 w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-5xl shrink-0 shadow-2xl">1</div><div className="space-y-3"><h5 className="font-black text-white text-4xl uppercase tracking-tighter leading-none italic">Avisa a Jefatura</h5><p className="text-2xl text-slate-400 font-light">Debes informar obligatoriamente a tu superior directo en el momento exacto del incidente.</p></div></div><div className="flex gap-12 items-start"><div className="bg-yellow-500 text-slate-950 w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-5xl shrink-0 shadow-2xl">2</div><div className="space-y-3"><h5 className="font-black text-white text-4xl uppercase tracking-tighter leading-none italic">Centro ACHS</h5><p className="text-2xl text-slate-400 font-light">Acude a la Mutualidad (ACHS) para el registro médico oficial (DIAT).</p></div></div></div><div className="mt-20 bg-blue-600/20 p-12 rounded-[4rem] border border-blue-500/30"><h4 className="text-blue-400 font-black text-4xl uppercase tracking-tighter flex items-center gap-8 mb-8 italic leading-none"><MapPin size={50}/> ZONA DE SEGURIDAD</h4><p className="text-2xl leading-relaxed">Ante un sismo grado VII o superior que impida mantenerse en pie: **EVACUAR HACIA LA COTA 30** (Av. Cisternas hacia el oriente).</p></div></>} 
    />;

    // 10. EDUCACIÓN
    case 10: return <ChapterLayout title="Educación" subtitle="Capacitación y E-learning" 
      visual={<div className="p-20 animate-in zoom-in duration-1000"><GraduationCap size={220} className="text-red-600 drop-shadow-[0_0_50px_red] animate-pulse"/></div>}
      content={<><p className="text-4xl font-black text-white mb-10 border-b border-white/5 pb-8 uppercase italic tracking-tighter leading-none shadow-xl">Formación de Clase Mundial.</p><p className="text-2xl font-light">En la IMLS impulsamos tu crecimiento profesional. A través de nuestras plataformas accederás a:</p><div className="grid gap-10 mt-14"><div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex items-center gap-10 shadow-2xl"><BookOpen className="text-red-500" size={60}/><div><h4 className="text-white font-black text-3xl uppercase tracking-tighter leading-none italic">Academia Municipal</h4><p className="text-slate-400 text-xl font-light">Cursos de gestión pública moderna y Smart City.</p></div></div><div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex items-center gap-10 shadow-2xl"><Zap className="text-orange-500" size={60}/><div><h4 className="text-white font-black text-3xl uppercase tracking-tighter leading-none italic">Sello Innovación</h4><p className="text-slate-400 text-xl font-light">Talleres para proponer mejoras territoriales digitales.</p></div></div></div></>} 
    />;

    // 11. EVALUACIÓN
    case 11: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-6xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000">
           <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden rounded-t-[5rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_30px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-14 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-12 text-[14px] font-black text-slate-500 uppercase tracking-[0.5em] border-b border-white/5 pb-6"><span>EXAMEN OFICIAL</span><span className="bg-red-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-xl">Pregunta {quizIndex + 1} / 10</span></div>
               <h3 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-6 pt-10">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-12 rounded-[2.5rem] border-2 font-black text-3xl transition-all shadow-xl ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-red-600 scale-100 active:scale-95' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/30 border-green-600 text-green-400 shadow-[0_0_60px_rgba(22,163,74,0.4)] scale-105' : 'opacity-20 grayscale text-white scale-95 border-transparent'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-16 p-14 rounded-[4rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-2xl border-l-8 border-red-600">
                    <p className="text-white text-4xl font-light italic leading-snug font-serif tracking-tight">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-16 bg-white text-slate-950 p-10 rounded-[2.5rem] font-black uppercase text-xl tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-8">CONTINUAR <ArrowRight size={36}/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={250} className="mx-auto text-yellow-500 mb-14 drop-shadow-[0_0_60px_rgba(234,179,8,0.6)] animate-bounce" />
               <h2 className="text-8xl lg:text-[11rem] font-black text-white mb-12 tracking-tighter uppercase italic leading-[0.75] shadow-xl">¡ERES PARTE<br/>DEL EQUIPO!</h2>
               <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-12 rounded-[4rem] font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-4xl shadow-red-900/60 ring-4 ring-red-500/20">GENERAR MI DIPLOMA</button>
             </div>
           )}
        </div>
      </div>
    );

    // 12. FINAL (CERTIFICADO + RDMLS)
    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto font-sans">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-32 rounded-[6rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10">
            
            {/* CERTIFICADO */}
            <div className="bg-white p-14 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] mb-24 border-[25px] border-double border-slate-200 text-slate-900 text-left relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000"><img src="/img/escudo.png" className="h-[400px]" /></div>
               <div className="flex justify-between items-center mb-14 border-b-2 border-slate-100 pb-10">
                  <img src="/img/escudo.png" className="h-28 shadow-2xl" />
                  <img src="/img/innovacion.png" className="h-28 shadow-2xl" />
               </div>
               <h1 className="text-8xl font-serif font-black uppercase tracking-[0.2em] mb-6 leading-none italic">CERTIFICADO</h1>
               <p className="text-3xl italic text-slate-400 mb-16 uppercase border-y-2 border-slate-50 py-6 tracking-[0.4em] font-light">Inducción Corporativa IMLS 2026</p>
               <h2 className="text-7xl lg:text-[7rem] font-black uppercase mb-8 tracking-tighter border-b-8 border-red-600 inline-block pb-4">{userData.nombres} {userData.apellidos}</h2>
               <p className="text-3xl font-bold text-slate-500 uppercase tracking-[0.4em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
               <p className="text-3xl text-slate-800 max-w-6xl font-light leading-relaxed mb-16 font-serif italic">"Cumplió con éxito los requerimientos formativos de ingreso a la Ilustre Municipalidad de La Serena."</p>
               <div className="flex justify-between items-end mt-24">
                  <div className="text-center w-96 border-t-4 border-slate-300 pt-8 text-sm font-black uppercase text-slate-500 tracking-widest shadow-2xl"><img src="/img/firma_personas.png" className="h-24 mx-auto mb-4 opacity-80" />Director de Gestión de Personas</div>
                  <div className="text-center text-slate-300 font-serif italic text-3xl tracking-widest">{currentTime.toLocaleDateString()}</div>
                  <div className="text-center w-96 border-t-4 border-slate-300 pt-8 text-sm font-black uppercase text-slate-500 tracking-widest shadow-2xl"><img src="/img/firma_alcaldesa.png" className="h-24 mx-auto mb-4 opacity-80" />Alcaldesa La Serena</div>
               </div>
            </div>

            {/* SECCIÓN RDMLS */}
            <div className="grid md:grid-cols-2 gap-24 text-left bg-black/60 p-20 lg:p-32 rounded-[6rem] border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-20 rounded-[5rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] group transition-all hover:scale-110 active:scale-95 cursor-pointer">
                  <QrCode size={350} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-14 text-3xl uppercase tracking-[0.6em]">RDMLS ACCESO</p>
               </div>
               <div className="space-y-16 flex flex-col justify-center">
                  <div className="flex items-center gap-12 group cursor-pointer hover:translate-x-8 transition-transform hover:text-red-500"><div className="p-8 bg-red-600 rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:rotate-12 transition-all"><Radio size={60}/></div><div className="space-y-2"><span className="font-black text-6xl tracking-tighter uppercase block leading-none italic shadow-2xl">Radio Digital</span><p className="text-slate-500 text-2xl font-light italic">La voz de los serenenses en la red.</p></div></div>
                  <button className="mt-16 bg-white text-slate-950 w-full py-12 rounded-[4rem] font-black transition-all shadow-[0_50px_100px_rgba(255,255,255,0.15)] hover:bg-red-600 hover:text-white text-4xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95 flex items-center justify-center gap-10 shadow-2xl" onClick={() => window.print()}><Printer size={48}/> IMPRIMIR DIPLOMA</button>
               </div>
            </div>
            
            <div className="mt-32 flex flex-col items-center gap-12">
              <p className="text-slate-700 font-black uppercase tracking-[1.5em] text-sm animate-pulse italic">ILUSTRE MUNICIPALIDAD DE LA SERENA • CHILE</p>
              <button onClick={() => setStep(0)} className="text-slate-800 hover:text-red-500 flex items-center justify-center gap-8 text-sm uppercase tracking-[1em] font-black transition-colors w-full mt-20 group"><RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-1000"/> FINALIZAR SESIÓN SEGURA</button>
            </div>
         </div>
      </div>
    );

    default: return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500">
        <div className="text-center p-20 bg-slate-900 rounded-[5rem] shadow-2xl border border-red-900/50 animate-pulse">
          <AlertTriangle size={150} className="mx-auto mb-10" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 italic">SISTEMA INTERRUMPIDO</h1>
          <button onClick={() => setStep(0)} className="bg-red-600 text-white px-20 py-8 rounded-3xl font-black uppercase tracking-widest text-xl shadow-red-900/50 hover:bg-red-500 transition-all">RESTAURAR INDUCCIÓN</button>
        </div>
      </div>
    );
  }
}
