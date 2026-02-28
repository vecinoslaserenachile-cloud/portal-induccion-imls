import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, X
} from 'lucide-react';

// --- BASE DE DATOS EXTENDIDA ---
const DEPARTAMENTOS = [
  { name: "Alcaldía", desc: "Liderazgo estratégico y representación de la comuna de La Serena." },
  { name: "Administración Municipal", desc: "Coordinación interna y gestión de los servicios municipales." },
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
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de cada una de nuestras decisiones." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente que representan a la comunidad." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato a tu jefatura para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Qué busca el área de Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar integral", "Nada"], ans: 1, explanation: "Buscamos el bienestar físico, mental y social del funcionario." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30 hacia el oriente." },
  { q: "¿Cuál es un valor municipal intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base ética de nuestra función." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN es el cerebro técnico que diseña y postula los proyectos." },
  { q: "¿Qué debo hacer al terminar la inducción?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a RDMLS y nuestras plataformas digitales." },
];

// --- APLICACIÓN PRINCIPAL ---
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
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // LÓGICA DE SCROLL Y DESBLOQUEO
  const handleScroll = (e: any) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 60) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-desbloqueo si no hay scroll necesario
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 10) {
          setCanAdvance(true);
        }
      }, 700);
    }
    // Scroll a la cima al cambiar de diapositiva
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 11));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // Quiz
  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = idx === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setQuizState('waiting');
    if (quizIndex < 9) setQuizIndex(quizIndex + 1);
    else setQuizFinished(true);
  };

  const printCertificate = () => window.print();

  // --- LAYOUT MAESTRO "INFINITE LUXURY" ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Barra de Progreso Global */}
      <div className="fixed top-0 left-0 w-full h-2 bg-white/5 z-[100]">
        <div className="h-full bg-red-600 transition-all duration-700 shadow-[0_0_20px_red]" style={{ width: `${(step / 11) * 100}%` }}></div>
      </div>
      
      {/* VISUAL: Fijo en PC, Scrollable en móvil */}
      <div className="lg:fixed lg:left-0 lg:top-0 lg:w-1/2 w-full h-[45vh] lg:h-screen bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/10 z-10 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
         <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black/40 border border-white/10 relative flex items-center justify-center backdrop-blur-3xl">
           {visual}
         </div>
      </div>

      {/* CONTENIDO: Scroll natural para móviles */}
      <div className="lg:ml-[50%] lg:w-1/2 w-full flex flex-col min-h-screen relative z-20 bg-slate-950/50 backdrop-blur-3xl">
        <div ref={topRef} />
        
        {/* Header de la diapositiva */}
        <div className="px-8 lg:px-16 pt-16 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-red-900/40 animate-pulse">Etapa {step}</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-4 border-l border-white/10">IMLS Smart Induction</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-4">{title}</h2>
          <div className="h-1 w-24 bg-red-600 rounded-full mb-6"></div>
          <h3 className="text-2xl lg:text-3xl text-slate-400 font-serif italic leading-tight">{subtitle}</h3>
        </div>
        
        {/* Cuerpo del Contenido */}
        <div onScroll={handleScroll} ref={scrollRef} className="flex-1 px-8 lg:px-16 py-10 lg:overflow-y-auto">
          <div className="space-y-12 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
            {content}
            <div className="h-24 lg:h-48"></div> 
          </div>
        </div>

        {/* Barra de Navegación Pegajosa al final */}
        <div className="px-8 lg:px-16 py-8 border-t border-white/5 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between sticky bottom-0 z-50">
           <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all">
             <ChevronLeft size={20}/> Atrás
           </button>
           
           <div className="flex items-center gap-6">
             {canAdvance ? (
                <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle size={20}/> Diapositiva Listada
                </div>
             ) : (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  <ChevronDown size={20}/> Baja para desbloquear
                </div>
             )}
             
             <button 
               onClick={goNext} 
               disabled={!canAdvance}
               className={`px-12 py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-widest transform 
                 ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50 scale-105' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
               `}
             >
               Siguiente <ArrowRight size={22} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN PREMIUM ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-md scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
          <div>
            <h1 className="text-7xl lg:text-9xl font-black text-white leading-none tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs pl-2 border-l-4 border-red-600 mt-6">Gestión de Personas • Innovación</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-6">
            <h3 className="text-white font-black text-3xl mb-8 flex items-center gap-4 uppercase tracking-tighter"><Landmark className="text-red-600" size={32}/> Acceso Único</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d.name} value={d.name} className="text-black">{d.name}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-2xl shadow-red-900/50 transition-all hover:scale-[1.03] uppercase text-xl mt-4">Iniciar Experiencia</button>
            <button onClick={() => setUserData({nombres:'', apellidos:'', rut:'', dept:'', cargo:''})} className="w-full text-[10px] text-white/20 uppercase font-bold text-center mt-2">Limpiar Campos</button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenidos" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={<iframe className="w-full h-full aspect-video scale-110" src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1" title="Mensaje" frameBorder="0" allowFullScreen></iframe>}
      content={<><p className="font-black text-5xl text-white mb-8">¡Bienvenido, {userData.nombres}!</p><p>Es un orgullo para nuestra institución darte la bienvenida oficial. Te sumas a la **Ilustre Municipalidad de La Serena**, una institución con más de 480 años de historia, pero con una visión de futuro moderna, innovadora y profundamente humana.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p className="text-slate-400">Durante este recorrido, conocerás los pilares estratégicos de nuestra gestión y los protocolos que garantizan tu bienestar en el trabajo.</p></>} 
    />;

    case 2: return <ChapterLayout title="Nuestra Estrategia" subtitle="Misión, Visión y Valores" 
      visual={<div className="flex flex-col gap-10 items-center text-center p-12"><Target size={120} className="text-red-600 animate-pulse drop-shadow-[0_0_20px_red]"/><h4 className="font-black text-6xl uppercase tracking-tighter text-white">Rumbo 2026</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Star/> Misión</h4><p className="text-2xl font-light">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso. Nuestro compromiso es entregar servicios de alta calidad, con eficiencia, transparencia y máxima calidez humana.</p></section><section className="space-y-6 pt-10 border-t border-white/5"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Visión</h4><p className="text-2xl font-light">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida por su respeto absoluto al patrimonio histórico y por brindar una excepcional calidad de vida a sus habitantes.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto h-full">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-[2rem] border border-white/10 text-[10px] font-bold text-center flex flex-col items-center justify-center shadow-xl group hover:border-red-600 transition-all"><User size={24} className="mb-2 text-red-600 group-hover:scale-110 transition-transform"/>{c}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-10 rounded-[3rem] border border-yellow-500/20 shadow-2xl space-y-8"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-4"><Shield size={32}/> Atribuciones Clave</h4><ul className="space-y-6 text-xl"><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Fiscalizar el cumplimiento de planes y programas.</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Aprobar el presupuesto municipal anual (más de $70 mil millones).</li><li className="flex gap-4"><CheckCircle className="text-yellow-500 shrink-0"/> Normar ordenanzas y regulaciones comunales.</li></ul></div></>} 
    />;

    case 4: return <ChapterLayout title="La Estructura" subtitle="Direcciones Estratégicas" 
      visual={<div className="flex items-center justify-center h-full p-6"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.2)]" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200/222/fff?text=Mapa+Organigrama'}/></div>}
      content={<><p className="text-3xl font-black text-white mb-8">Estructura Operativa:</p><div className="grid gap-6">{DEPARTAMENTOS.slice(0, 6).map(d => (<div key={d.name} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all shadow-xl"><h4 className="font-black text-red-500 text-2xl uppercase tracking-tighter">{d.name}</h4><p className="text-slate-400 text-lg mt-3 font-light leading-snug">{d.desc}</p></div>))}</div><p className="text-sm text-slate-600 italic mt-10">Contamos con más de 20 direcciones dedicadas al bienestar vecinal.</p></>} 
    />;

    case 5: return <ChapterLayout title="Smart City" subtitle="Nuestros Públicos" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-12 rounded-full mb-16 text-6xl shadow-[0_0_60px_rgba(255,255,255,0.4)] animate-pulse">IMLS</div><div className="grid grid-cols-2 gap-10 text-center text-sm w-full"><div className="bg-blue-600/30 p-10 rounded-[3rem] border border-blue-500/50 flex flex-col items-center gap-4"><Users size={50}/><span className="font-black uppercase tracking-widest text-lg">Vecinos</span></div><div className="bg-green-600/30 p-10 rounded-[3rem] border border-green-500/50 flex flex-col items-center gap-4"><Landmark size={50}/><span className="font-black uppercase tracking-widest text-lg">Gobierno</span></div></div></div>}
      content={<><p className="text-3xl">Ponemos la tecnología al servicio de la gente.</p><p>La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central. Nuestra gestión se coordina con el Gobierno Regional, Carabineros, Bomberos y el sector privado para garantizar seguridad y desarrollo integral en cada rincón de la comuna.</p></>} 
    />;

    case 6: return <ChapterLayout title="Calidad de Vida" subtitle="Tu Bienestar Integral" 
      visual={<div className="p-16 text-center animate-in zoom-in duration-1000"><HeartHandshake size={240} className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-4xl mt-12 uppercase italic tracking-tighter">Bienestar Primero</h4></div>}
      content={<><p className="text-2xl font-bold text-white mb-6">Contamos con una red de apoyo para ti y tu familia:</p><div className="space-y-8 mt-10"><div className="p-10 border-2 border-green-500/30 bg-green-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl"><Stethoscope size={70} className="text-green-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter">Salud & Psicología</h4><p className="text-xl text-slate-400">Convenios dentales, seguros complementarios y un equipo de psicólogos permanentes para contención emocional en momentos críticos.</p></div></div><div className="p-10 border-2 border-blue-500/30 bg-blue-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl"><Activity size={70} className="text-blue-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter">Deportes & Bienestar</h4><p className="text-xl text-slate-400">Acceso gratuito a canchas municipales, ligas de fútbol interno y talleres de pausa activa durante tu jornada.</p></div></div><div className="p-10 border-2 border-orange-500/30 bg-orange-500/10 rounded-[3.5rem] flex gap-10 items-center shadow-2xl"><Smile size={70} className="text-orange-500 shrink-0"/><div className="space-y-3"><h4 className="font-black text-white text-3xl uppercase tracking-tighter">Beneficios Sociales</h4><p className="text-xl text-slate-400">Bonos de escolaridad, aguinaldos y beneficios directos a través de la Caja de Compensación para ti y tus cargas.</p></div></div></div></>} 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral 21.643" 
      visual={<div className="p-20 text-center"><Shield size={220} className="text-pink-600 mx-auto drop-shadow-[0_0_40px_rgba(219,39,119,0.4)]"/><h4 className="text-pink-100 font-black text-5xl mt-12 uppercase tracking-tighter">Respeto Total</h4></div>}
      content={<><p className="text-3xl font-bold text-white mb-10">En este municipio aplicamos Tolerancia Cero.</p><p className="text-2xl">La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. Contamos con protocolos inmediatos para proteger tu integridad:</p><div className="grid grid-cols-1 gap-8 mt-12"><div className="bg-pink-600/10 p-10 rounded-[3rem] border border-pink-500/30 flex items-center gap-10 shadow-xl transition-transform hover:scale-105"><AlertTriangle className="text-pink-500" size={60}/><div className="space-y-2"><h5 className="text-white font-black text-3xl uppercase tracking-tighter">Acoso Laboral</h5><p className="text-lg text-slate-400">Toda agresión u hostigamiento que atente contra la dignidad del funcionario.</p></div></div><div className="bg-pink-600/10 p-10 rounded-[3rem] border border-pink-500/30 flex items-center gap-10 shadow-xl transition-transform hover:scale-105"><MessageCircle className="text-pink-500" size={60}/><div className="space-y-2"><h5 className="text-white font-black text-3xl uppercase tracking-tighter">Violencia Laboral</h5><p className="text-lg text-slate-400">Conductas violentas ejercidas por terceros (vecinos o usuarios) hacia el funcionario.</p></div></div></div><p className="mt-12 font-black text-white bg-white/5 p-10 rounded-[2.5rem] text-center border border-white/10 uppercase italic leading-tight shadow-inner">"Un solo acto grave es suficiente para iniciar la denuncia. Contamos con canales 100% confidenciales."</p></>} 
    />;

    case 8: return <ChapterLayout title="Tu Seguridad" subtitle="Protocolo ACHS y Emergencias" 
      visual={<div className="p-20"><AlertTriangle size={220} className="text-yellow-500 mx-auto animate-bounce drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"/><div className="h-4 w-40 bg-black/50 rounded-full mx-auto mt-6 blur-2xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-4xl uppercase tracking-tighter mb-10 border-b border-yellow-500/20 pb-4">Seguro Ley 16.744</h4><p className="text-2xl mb-10">Ante cualquier lesión laboral o de trayecto, sigue estos pasos **OBLIGATORIOS** para garantizar tu cobertura:</p><div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl"><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">1</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Informa a tu Jefe</h5><p className="text-xl text-slate-400">Debes avisar inmediatamente a tu superior jerárquico, por leve que sea el incidente.</p></div></div><div className="flex gap-10 items-start group"><div className="bg-yellow-500 text-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">2</div><div className="space-y-2"><h5 className="font-black text-white text-3xl uppercase tracking-tighter">Mutualidad ACHS</h5><p className="text-xl text-slate-400">Debes acudir al centro de atención ACHS más cercano para el registro médico oficial (DIAT).</p></div></div></div><div className="mt-16 bg-blue-600/20 p-10 rounded-[3rem] border border-blue-500/30"><h4 className="text-blue-400 font-black text-3xl uppercase tracking-tighter flex items-center gap-6 mb-6"><MapPin size={40}/> Zona de Tsunami</h4><p className="text-xl">La Serena es costera. Ante sismo grado VII o superior que impida estar de pie: **EVACUAR HACIA LA COTA 30** (Sobre Avenida Cisternas hacia el oriente).</p></div></>} 
    />;

    case 9: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[5rem] shadow-2xl w-full max-w-5xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000">
           <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden rounded-t-[5rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_20px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-12">
               <div className="flex justify-between items-center mb-10 text-[14px] font-black text-slate-500 uppercase tracking-[0.5em]"><span>Examen de Ingreso IMLS</span><span className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white">Pregunta {quizIndex + 1} / 10</span></div>
               <h3 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-6 pt-10">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-10 rounded-[2.5rem] border-2 font-black text-2xl transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-white/40' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_50px_rgba(22,163,74,0.4)] scale-105' : 'opacity-20 grayscale text-white'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-16 p-12 rounded-[4rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-inner">
                    <p className="text-sm text-slate-500 mb-6 uppercase font-black tracking-[0.5em]">{quizState === 'correct' ? '✅ Brillante' : '❌ Nota Técnica:'}</p>
                    <p className="text-white text-3xl font-light italic leading-snug">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className="w-full mt-12 bg-white text-slate-950 p-8 rounded-[2rem] font-black uppercase text-lg tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95">Siguiente Desafío <ArrowRight size={24} className="inline ml-4"/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={200} className="mx-auto text-yellow-500 mb-12 drop-shadow-[0_0_40px_rgba(234,179,8,0.7)]" />
               <h2 className="text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none">¡LOGRADO!</h2>
               <p className="text-slate-400 mb-20 text-3xl font-light max-w-4xl mx-auto">Has superado la evaluación de ingreso con un puntaje de **{score}/10**. Ya estás listo para tu certificado.</p>
               <button onClick={() => setStep(10)} className="w-full bg-red-600 text-white py-10 rounded-[3rem] font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-3xl shadow-red-900/50">Obtener Mi Certificado Oficial</button>
             </div>
           )}
        </div>
      </div>
    );

    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-12 lg:p-24 w-full max-w-7xl aspect-[1.41/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[25px] border-double border-slate-200 print:border-none print:m-0">
           <div className="w-full flex justify-between items-center opacity-90 mb-10">
             <img src="/img/escudo.png" className="h-40 object-contain" />
             <img src="/img/innovacion.png" className="h-40 object-contain" />
           </div>
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-8xl lg:text-[10rem] font-serif font-black text-slate-900 mb-8 uppercase tracking-widest leading-none">CERTIFICADO</h1>
             <p className="text-4xl italic text-slate-400 mb-16 font-serif border-y border-slate-100 py-10 uppercase tracking-[0.3em]">Aprobación Inducción Corporativa IMLS 2026</p>
             <h2 className="text-6xl lg:text-9xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-b-8 border-red-600 inline-block px-10 pb-4">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-3xl font-bold text-slate-400 uppercase tracking-[0.6em] mb-16">RUT: {userData.rut} • {userData.dept}</p>
             <p className="text-3xl text-slate-700 max-w-5xl mx-auto leading-relaxed font-light">Se otorga el presente reconocimiento por haber cumplido con éxito absoluto los requerimientos formativos y éticos de ingreso a la **Ilustre Municipalidad de La Serena**.</p>
           </div>
           <div className="flex justify-between w-full px-24 mt-24 text-sm font-bold uppercase text-slate-400 tracking-[0.5em]">
             <div className="text-center w-96"><div className="h-24 mb-10 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_personas.png" className="h-20" /></div>Director Gestión Personas</div>
             <div className="text-center pt-32 text-2xl text-slate-300 italic">{currentTime.toLocaleDateString()}</div>
             <div className="text-center w-96"><div className="h-24 mb-10 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-20" /></div>Daniela Norambuena - Alcaldesa</div>
           </div>
        </div>
        <div className="fixed bottom-12 right-12 flex gap-8 print:hidden">
           <button onClick={printCertificate} className="bg-white text-slate-950 px-16 py-8 rounded-3xl font-black shadow-2xl hover:bg-slate-100 flex items-center gap-6 text-xl"><Printer size={32}/> Imprimir</button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-16 py-8 rounded-3xl font-black shadow-2xl hover:bg-red-700 flex items-center gap-6 text-xl">Finalizar Experiencia <ArrowRight size={32}/></button>
        </div>
      </div>
    );

    case 11: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-28 rounded-[5rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10">
            <Smartphone size={120} className="mx-auto mb-12 text-red-600 drop-shadow-[0_0_40px_red]"/>
            <h2 className="text-7xl lg:text-[10rem] font-black mb-12 tracking-tighter uppercase leading-[0.75] italic">¡SIGUE<br/>CONECTADO!</h2>
            <p className="text-3xl lg:text-4xl text-slate-400 mb-24 font-light max-w-5xl mx-auto leading-relaxed italic">Tu inducción termina hoy, pero tu carrera en el municipio recién comienza. Súmate a nuestras redes y vive la transformación digital.</p>
            
            <div className="grid md:grid-cols-2 gap-20 text-left bg-black/40 p-16 lg:p-24 rounded-[5rem] border border-white/5 shadow-inner">
               <div className="flex flex-col items-center justify-center bg-white p-16 rounded-[4rem] shadow-[0_0_80px_rgba(255,255,255,0.1)] group transition-transform hover:scale-105">
                  <QrCode size={300} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-12 text-2xl uppercase tracking-[0.6em]">PORTAL RDMLS</p>
               </div>
               <div className="space-y-16 flex flex-col justify-center">
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform"><div className="p-6 bg-red-600 rounded-[2rem] group-hover:scale-110 transition-transform shadow-xl"><Radio size={50}/></div><div className="space-y-2"><span className="font-black text-5xl tracking-tighter uppercase block">Radio Digital</span><p className="text-slate-500 text-xl font-light">La voz oficial de los serenenses.</p></div></div>
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform"><div className="p-6 bg-blue-600 rounded-[2rem] group-hover:scale-110 transition-transform shadow-xl"><Map size={50}/></div><div className="space-y-2"><span className="font-black text-5xl tracking-tighter uppercase block">Tours 3D</span><p className="text-slate-500 text-xl font-light">Explora el patrimonio de La Serena.</p></div></div>
                  <div className="flex items-center gap-10 group cursor-pointer hover:translate-x-6 transition-transform"><div className="p-6 bg-green-600 rounded-[2rem] group-hover:scale-110 transition-transform shadow-xl"><MessageCircle size={50}/></div><div className="space-y-2"><span className="font-black text-5xl tracking-tighter uppercase block">Serenito AI</span><p className="text-slate-500 text-xl font-light">Tu asistente virtual 24/7.</p></div></div>
                  <button className="mt-12 bg-white text-slate-950 w-full py-10 rounded-[3rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-3xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95">Entrar al Portal RDMLS.CL</button>
               </div>
            </div>
            <div className="mt-24 flex justify-center gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <img src="/img/escudo.png" className="h-32 object-contain" />
               <img src="/img/innovacion.png" className="h-32 object-contain" />
            </div>
            <button onClick={() => setStep(0)} className="mt-24 text-slate-600 hover:text-red-500 flex items-center justify-center gap-6 text-sm uppercase tracking-[0.8em] font-black transition-colors w-full uppercase"><RefreshCw size={24}/> Cerrar Sesión de Seguridad</button>
         </div>
         <p className="text-slate-800 text-[10px] font-black uppercase tracking-[1em] mb-10">Ilustre Municipalidad de La Serena • Chile</p>
      </div>
    );

    default: return null;
  }
}
