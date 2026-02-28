import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, LifeBuoy, MapPin, Search
} from 'lucide-react';

// --- BASE DE DATOS EXTENDIDA ---
const DEPARTAMENTOS = [
  { id: "ALC", name: "Alcaldía", desc: "Dirección estratégica y representación legal de la comuna." },
  { id: "ADM", name: "Administración Municipal", desc: "Gestión operativa interna y coordinación de servicios." },
  { id: "DIDECO", name: "DIDECO", desc: "Desarrollo Comunitario: El corazón social del municipio." },
  { id: "DOM", name: "Dirección de Obras (DOM)", desc: "Urbanismo, permisos de edificación y fiscalización técnica." },
  { id: "SECPLAN", name: "SECPLAN", desc: "Secretaría de Planificación: Proyectos de inversión y Smart City." },
  { id: "DAF", name: "DAF", desc: "Administración y Finanzas: Gestión de recursos y presupuesto." },
  { id: "DGP", name: "Gestión de Personas", desc: "Bienestar, remuneraciones y desarrollo del funcionario." },
  { id: "TRANS", name: "Tránsito", desc: "Licencias, permisos de circulación y seguridad vial." },
  { id: "SEG", name: "Seguridad Ciudadana", desc: "Prevención, vigilancia y apoyo a la comunidad 24/7." },
  { id: "TUR", name: "Turismo y Patrimonio", desc: "Promoción de la ciudad y resguardo histórico." },
  { id: "JPL", name: "Juzgados de Policía Local", desc: "Administración de justicia comunal." },
  { id: "SERV", name: "Servicio a la Comunidad", desc: "Mantención de áreas verdes, aseo y ornato." },
  { id: "SALUD", name: "Salud Municipal", desc: "Red de atención primaria de salud (CESFAM)." },
  { id: "EDU", name: "Educación Municipal", desc: "Gestión de establecimientos educacionales públicos." }
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada una de nuestras decisiones." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos que fiscalizan y norman la comuna." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato a tu jefatura para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y violencia en el trabajo." },
  { q: "¿Qué busca el área de Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar físico y mental", "Nada"], ans: 1, explanation: "Buscamos el bienestar integral del funcionario y su familia." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Seguridad ante todo: Siempre hacia la zona segura sobre la Cota 30." },
  { q: "¿Cuál es un valor municipal intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base ética de nuestra función pública." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN es el cerebro técnico que diseña y postula los proyectos." },
  { q: "¿Qué debo hacer al terminar la inducción?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Te invitamos a sumarte a RDMLS y nuestras redes digitales." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
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
  const totalSteps = 12;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // LÓGICA DE SCROLL OBLIGATORIO
  const handleScroll = (e: any) => {
    const el = e.target;
    // Si llegamos cerca del final (50px de margen)
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos exentos de scroll obligatorio
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Pequeño check para contenidos cortos que no necesitan scroll
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 10) {
          setCanAdvance(true);
        }
      }, 800);
    }
    window.scrollTo(0, 0); // Scroll arriba al cambiar de paso
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 11));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = idx === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  const printCertificate = () => window.print();

  // --- LAYOUT MAESTRO "GLOW LUXURY" ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Glow Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[100]">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 shadow-[0_0_15px_red]" style={{ width: `${(step / 11) * 100}%` }}></div>
      </div>
      
      {/* VISUAL: Lado Izquierdo (Fijo en PC) */}
      <div className="lg:fixed lg:left-0 lg:top-0 lg:w-1/2 w-full h-[40vh] lg:h-screen flex items-center justify-center p-4 lg:p-12 z-10 border-b border-white/5 lg:border-b-0 lg:border-r">
         <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center relative">
           {visual}
         </div>
      </div>

      {/* CONTENIDO: Lado Derecho (Scrollable) */}
      <div className="lg:ml-[50%] lg:w-1/2 w-full flex flex-col min-h-screen relative z-20 bg-slate-950/40 backdrop-blur-3xl">
        {/* Header Diapo */}
        <div className="px-8 lg:px-20 pt-12 pb-8 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-red-900/40">Módulo {step}</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Smart Induction 2026</span>
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-4">{title}</h2>
          <div className="h-1 w-24 bg-red-600 rounded-full mb-4"></div>
          <h3 className="text-xl lg:text-3xl text-slate-400 font-serif italic leading-tight">{subtitle}</h3>
        </div>
        
        {/* Cuerpo de Texto con Scroll Detector */}
        <div onScroll={handleScroll} ref={scrollRef} className="flex-1 px-8 lg:px-20 py-10">
          <div className="space-y-10 text-xl lg:text-2xl text-slate-300 leading-relaxed font-light text-justify">
            {content}
            <div className="h-32"></div> {/* Espacio extra para llegar al fondo */}
          </div>
        </div>

        {/* Navegación Footer */}
        <div className="px-8 lg:px-20 py-8 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between sticky bottom-0 z-50">
           <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all">
             <ChevronLeft size={18}/> Atrás
           </button>
           
           <div className="flex items-center gap-6">
             {canAdvance ? (
                <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
                  <CheckCircle size={18}/> Lectura Completa
                </div>
             ) : (
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  <ChevronDown size={18}/> Baja para habilitar
                </div>
             )}
             
             <button 
               onClick={goNext} 
               disabled={!canAdvance}
               className={`px-10 py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3 text-sm uppercase tracking-[0.2em] transform 
                 ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/40' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
               `}
             >
               Siguiente <ArrowRight size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN RODRIGO ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          <div>
            <h1 className="text-7xl lg:text-9xl font-black text-white leading-none tracking-tighter uppercase italic">Inducción<br/><span className="text-red-600">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-sm mt-6 pl-2 border-l-4 border-red-600">Capital Patrimonial de Chile</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-6">
            <h3 className="text-white font-black text-3xl mb-8 flex items-center gap-4 uppercase tracking-tighter">
              <Landmark className="text-red-600" size={32}/> Acceso
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombres</label>
                <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Apellidos</label>
                <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">RUT de Funcionario</label>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none transition-all" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Unidad Municipal</label>
              <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                  {DEPARTAMENTOS.map(d => <option key={d.id} value={d.name} className="text-black">{d.name}</option>)}
              </select>
            </div>

            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-2xl shadow-red-900/40 transition-all hover:scale-[1.03] uppercase text-lg mt-4 flex items-center justify-center gap-3">
              Comenzar Experiencia <ArrowRight/>
            </button>
            
            <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">Plataforma de Inducción de Clase Mundial</p>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // --- DIAPO 1: VIDEO ALCALDESA ---
    case 1: return <ChapterLayout title="Bienvenidos al Equipo" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={<iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1" title="Mensaje" frameBorder="0" allowFullScreen></iframe>}
      content={<><p className="font-black text-5xl text-white mb-8">¡Bienvenido, {userData.nombres}!</p><p>Es un orgullo recibirte en la **Ilustre Municipalidad de La Serena**. Te integras a una institución con más de 480 años de historia, pero con una visión de futuro moderna, innovadora y profundamente humana.</p><div className="bg-red-600/20 p-10 rounded-[2.5rem] border-l-8 border-red-600 shadow-2xl ring-1 ring-white/10 italic font-serif text-3xl text-red-100 leading-tight">"Nuestra misión es transformar La Serena en una ciudad de clase mundial, donde la tecnología esté al servicio de la gente y la calidez del funcionario sea nuestro sello."</div><p className="text-slate-400">Durante este recorrido, conocerás los pilares estratégicos de nuestra gestión y los protocolos que garantizan tu bienestar y seguridad en el trabajo.</p></>} 
    />;

    // --- DIAPO 2: MISIÓN Y VISIÓN (RESTAURADA) ---
    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Estrategia Institucional" 
      visual={<div className="flex flex-col gap-10 p-12 items-center text-center"><Target size={120} className="text-red-600 drop-shadow-[0_0_20px_red]"/><h4 className="font-black text-5xl uppercase tracking-tighter text-white">Misión & Visión</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Star/> Nuestra Misión</h4><p className="text-2xl font-light">Somos la institución encargada de administrar la comuna de La Serena, buscando satisfacer las necesidades de la comunidad local y asegurar su participación en el progreso económico, social y cultural de nuestra ciudad. Nuestro compromiso es entregar servicios de alta calidad, con eficiencia, transparencia y empatía.</p></section><section className="space-y-6 pt-10 border-t border-white/5"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light">Proyectamos a La Serena como una ciudad líder en desarrollo sostenible y Smart City en Chile, reconocida internacionalmente por su respeto al patrimonio histórico, su seguridad ciudadana y la excepcional calidad de vida de sus habitantes.</p></section></>} 
    />;

    // --- DIAPO 3: CONCEJO MUNICIPAL ---
    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-12 overflow-y-auto">{CONCEJALES.map((name, i) => (<div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center"><User size={24} className="mx-auto mb-2 text-red-600"/><p className="text-[10px] font-black uppercase text-white">{name}</p></div>))}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su rol es normativo, resolutivo y fiscalizador.</p><div className="bg-yellow-500/10 p-10 rounded-[3rem] border border-yellow-500/20 shadow-xl space-y-6"><h4 className="text-yellow-500 font-black text-2xl uppercase flex items-center gap-3"><Shield/> Atribuciones</h4><ul className="space-y-4 text-xl"><li>• Fiscalizar el presupuesto municipal.</li><li>• Normar ordenanzas y regulaciones locales.</li><li>• Aprobar el Plan Comunal de Desarrollo.</li></ul></div></>} 
    />;

    // --- DIAPO 4: DIRECCIONES (MAPA) ---
    case 4: return <ChapterLayout title="Nuestra Red" subtitle="Direcciones Municipales" 
      visual={<div className="flex items-center justify-center h-full bg-slate-900/50 p-6"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-2xl" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200?text=Mapa+Organigrama'}/></div>}
      content={<><p className="mb-8">Conoce las áreas estratégicas de la IMLS:</p><div className="grid gap-6">{DEPARTAMENTOS.slice(0, 5).map(d => (<div key={d.id} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group"><h4 className="font-black text-white text-xl uppercase group-hover:text-red-500 transition-colors">{d.name}</h4><p className="text-slate-400 text-sm mt-2">{d.desc}</p></div>))}</div><p className="text-sm text-slate-500 italic mt-8">Existen más de 20 direcciones especializadas para el servicio al vecino.</p></>} 
    />;

    // --- DIAPO 5: ECOSISTEMA ---
    case 5: return <ChapterLayout title="Smart City" subtitle="Ecosistema Digital" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-10 rounded-full mb-12 text-5xl shadow-[0_0_50px_rgba(255,255,255,0.4)]">IMLS</div><div className="grid grid-cols-2 gap-8 text-center text-sm w-full"><div className="bg-blue-600/30 p-6 rounded-[2rem] border border-blue-500/50 flex flex-col items-center gap-3"><Users size={32}/><span className="font-black uppercase tracking-widest">Vecinos</span></div><div className="bg-green-600/30 p-6 rounded-[2rem] border border-green-500/50 flex flex-col items-center gap-3"><Landmark size={32}/><span className="font-black uppercase tracking-widest">Estado</span></div></div></div>}
      content={<><p>La Serena se proyecta como una **Smart City**. Esto significa poner la tecnología al servicio del habitante. Nuestro ecosistema integra:</p><ul className="space-y-8 mt-10"><li className="flex gap-6 items-start"><div className="bg-red-600/20 p-4 rounded-2xl text-red-500"><Smartphone/></div><div><h4 className="text-white font-bold text-xl uppercase">Digitalización</h4><p>Trámites 100% online y atención ciudadana multicanal.</p></div></li><li className="flex gap-6 items-start"><div className="bg-blue-600/20 p-4 rounded-2xl text-blue-500"><Search/></div><div><h4 className="text-white font-bold text-xl uppercase">Transparencia</h4><p>Datos abiertos y rendición de cuentas en tiempo real.</p></div></li></ul></>} 
    />;

    // --- DIAPO 6: CALIDAD DE VIDA (RECUPERADA) ---
    case 6: return <ChapterLayout title="Tu Bienestar" subtitle="Calidad de Vida & Beneficios" 
      visual={<div className="p-16 text-center animate-pulse"><HeartHandshake size={200} className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-3xl mt-10 uppercase italic">Primero el Humano</h4></div>}
      content={<><p>En la IMLS no solo eres un funcionario, eres parte de una familia. El departamento de **Bienestar y Calidad de Vida** tiene programas exclusivos para ti:</p><div className="space-y-6 mt-10"><div className="p-8 border-2 border-green-500/30 bg-green-500/10 rounded-[2.5rem] flex gap-8 items-center"><Stethoscope size={50} className="text-green-500"/><div className="space-y-2"><h4 className="font-black text-white text-2xl uppercase tracking-tighter">Salud & Psicología</h4><p className="text-sm">Seguros complementarios, convenios dentales y apoyo psicológico permanente.</p></div></div><div className="p-8 border-2 border-blue-500/30 bg-blue-500/10 rounded-[2.5rem] flex gap-8 items-center"><Activity size={50} className="text-blue-500"/><div className="space-y-2"><h4 className="font-black text-white text-2xl uppercase tracking-tighter">Deportes & Pausas</h4><p className="text-sm">Acceso a canchas municipales, ligas deportivas y programas de pausa activa.</p></div></div></div></>} 
    />;

    // --- DIAPO 7: LEY KARIN (DETALLADA) ---
    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad y Respeto 21.643" 
      visual={<div className="p-16 text-center"><Shield size={180} className="text-pink-600 mx-auto drop-shadow-2xl"/><h4 className="text-pink-100 font-black text-4xl mt-8 uppercase tracking-widest">Protocolo Seguro</h4></div>}
      content={<><p className="text-2xl">La **Ley Karin** (21.643) nos mandata a garantizar entornos de trabajo libres de violencia. En este municipio aplicamos **Tolerancia Cero**.</p><div className="grid grid-cols-1 gap-6 mt-10"><div className="bg-pink-600/10 p-6 rounded-3xl border border-pink-500/30 flex items-center gap-6"><AlertTriangle className="text-pink-500" size={40}/><div><h5 className="text-white font-black text-xl uppercase">Acoso Laboral</h5><p className="text-sm">Toda agresión u hostigamiento que atente contra la integridad.</p></div></div><div className="bg-pink-600/10 p-6 rounded-3xl border border-pink-500/30 flex items-center gap-6"><MessageCircle className="text-pink-500" size={40}/><div><h5 className="text-white font-black text-xl uppercase">Violencia Laboral</h5><p className="text-sm">Conductas ejercidas por terceros ajenos a la relación laboral.</p></div></div></div><p className="mt-10 font-black text-white bg-white/5 p-6 rounded-2xl text-center border border-white/10 uppercase tracking-tighter italic">"Un solo acto grave es suficiente para iniciar un proceso de sanción."</p></>} 
    />;

    // --- DIAPO 8: SEGURIDAD (DETALLADA) ---
    case 8: return <ChapterLayout title="Seguridad" subtitle="Tu Integridad es Primero" 
      visual={<div className="p-16"><AlertTriangle size={200} className="text-yellow-500 mx-auto animate-bounce"/><div className="h-4 w-40 bg-black/50 rounded-full mx-auto mt-4 blur-xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-4xl uppercase tracking-tighter mb-8">Protocolo ACHS (Ley 16.744)</h4><p>Estamos protegidos por el seguro social contra accidentes del trabajo y enfermedades profesionales. Sigue estos pasos **OBLIGATORIOS**:</p><div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8 mt-8 shadow-2xl"><div className="flex gap-6 items-start"><div className="bg-yellow-500 text-slate-950 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shrink-0 shadow-lg">1</div><div><h5 className="font-black text-white text-xl uppercase">Aviso Inmediato</h5><p className="text-sm mt-2 text-slate-400">Informa a tu jefatura en el momento exacto de la lesión.</p></div></div><div className="flex gap-6 items-start"><div className="bg-yellow-500 text-slate-950 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shrink-0 shadow-lg">2</div><div><h5 className="font-black text-white text-xl uppercase">Derivación ACHS</h5><p className="text-sm mt-2 text-slate-400">Debes acudir al centro de atención de la Mutualidad más cercano.</p></div></div></div><h4 className="text-blue-500 font-black text-3xl mt-12 uppercase tracking-tighter">Zona de Tsunami</h4><p>Ante sismo grado VII o superior: **Evacuar hacia la COTA 30** (Av. Cisternas hacia el oriente).</p></>} 
    />;

    // --- PASO 9: QUIZ 10 PREGUNTAS ---
    case 9: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 lg:p-20 rounded-[4rem] shadow-2xl w-full max-w-3xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-700">
           <div className="absolute top-0 left-0 w-full h-2 bg-white/5 overflow-hidden rounded-t-[4rem]"><div className="h-full bg-red-600 transition-all duration-300" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-10">
               <div className="flex justify-between mb-8 text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]"><span>Evaluación Final</span><span>{quizIndex + 1} de 10</span></div>
               <h3 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tighter">{QUESTIONS[quizIndex].q}</h3>
               <div className="space-y-4 pt-6">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-8 rounded-3xl border-2 font-bold text-xl transition-all ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-white/30' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_30px_rgba(22,163,74,0.4)]' : 'opacity-20 grayscale text-white'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-8">
                    <p className="text-xs text-slate-500 mb-4 uppercase font-black tracking-widest">{quizState === 'correct' ? '✅ Brillante' : '❌ Nota importante'}</p>
                    <p className="text-white text-2xl font-light italic leading-snug">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-10 bg-white text-slate-950 p-6 rounded-2xl font-black uppercase text-sm tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">Continuar <ArrowRight className="inline ml-2"/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 animate-in zoom-in duration-1000">
               <Award size={150} className="mx-auto text-yellow-500 mb-10 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]" />
               <h2 className="text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">¡Excelente Trabajo!</h2>
               <p className="text-slate-400 mb-16 text-2xl font-light">Has completado la formación obligatoria con distinción.</p>
               <button onClick={() => setStep(10)} className="w-full bg-red-600 text-white py-8 rounded-3xl font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xl shadow-red-900/40">Ver mi Certificado Oficial</button>
             </div>
           )}
        </div>
      </div>
    );

    // --- PASO 10: CERTIFICADO ---
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 w-full max-w-6xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[20px] border-double border-slate-200">
           <div className="w-full flex justify-between items-center opacity-80 mb-6">
             <img src="/img/escudo.png" className="h-32 object-contain" />
             <img src="/img/innovacion.png" className="h-32 object-contain" />
           </div>
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-7xl lg:text-9xl font-serif font-black text-slate-900 mb-6 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-3xl italic text-slate-400 mb-12 font-serif border-y border-slate-100 py-6 uppercase tracking-[0.2em]">Inducción Corporativa IMLS 2026</p>
             <h2 className="text-5xl lg:text-8xl font-black text-slate-900 uppercase tracking-tighter mb-8">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-2xl font-bold text-slate-400 uppercase tracking-[0.5em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
             <p className="text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-light">Por haber cumplido con éxito los requerimientos formativos y éticos para su ingreso a la **Ilustre Municipalidad de La Serena**.</p>
           </div>
           <div className="flex justify-between w-full px-20 mt-20 text-xs font-bold uppercase text-slate-400 tracking-[0.3em]">
             <div className="text-center w-80"><div className="h-20 mb-6 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_personas.png" className="h-16" /></div>Director Gestión Personas</div>
             <div className="text-center pt-20 text-xl text-slate-300 italic">{currentTime.toLocaleDateString()}</div>
             <div className="text-center w-80"><div className="h-20 mb-6 border-b-2 border-slate-200 flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-16" /></div>Daniela Norambuena - Alcaldesa</div>
           </div>
        </div>
        <div className="fixed bottom-12 right-12 flex gap-6 print:hidden">
           <button onClick={printCertificate} className="bg-white text-slate-950 px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-slate-100 flex items-center gap-4 text-lg"><Printer size={28}/> Imprimir</button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-12 py-6 rounded-2xl font-black shadow-2xl hover:bg-red-700 flex items-center gap-4 text-lg">Finalizar <ArrowRight size={28}/></button>
        </div>
      </div>
    );

    // --- PASO 11: COMUNIDAD (MÓVIL INFINITO) ---
    case 11: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent"></div>
         
         <div className="bg-white/5 p-12 lg:p-24 rounded-[5rem] backdrop-blur-3xl border border-white/10 max-w-6xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-10">
            <Smartphone size={100} className="mx-auto mb-10 text-red-600 drop-shadow-[0_0_25px_red]"/>
            <h2 className="text-6xl lg:text-9xl font-black mb-8 tracking-tighter uppercase leading-[0.8] italic">¡Sigue<br/>Conectado!</h2>
            <p className="text-2xl lg:text-3xl text-slate-400 mb-20 font-light max-w-5xl mx-auto leading-relaxed">Tu inducción termina hoy, pero tu carrera en el municipio recién comienza. Súmate a nuestras redes de innovación digital y mantente informado en tiempo real.</p>
            
            <div className="grid md:grid-cols-2 gap-16 text-left bg-black/40 p-12 lg:p-20 rounded-[4rem] border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-12 rounded-[4rem] shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  <QrCode size={250} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-10 text-lg uppercase tracking-[0.4em]">Acceso Oficial</p>
               </div>
               <div className="space-y-12 flex flex-col justify-center">
                  <div className="flex items-center gap-8 group cursor-pointer hover:translate-x-4 transition-transform"><div className="p-5 bg-red-600 rounded-3xl group-hover:scale-110 transition-transform"><Radio size={40}/></div><div className="space-y-1"><span className="font-black text-4xl tracking-tighter uppercase block">Radio Digital</span><p className="text-slate-500 text-sm">Escucha la voz oficial del municipio.</p></div></div>
                  <div className="flex items-center gap-8 group cursor-pointer hover:translate-x-4 transition-transform"><div className="p-5 bg-blue-600 rounded-3xl group-hover:scale-110 transition-transform"><Map size={40}/></div><div className="space-y-1"><span className="font-black text-4xl tracking-tighter uppercase block">Tours 3D</span><p className="text-slate-500 text-sm">Explora el patrimonio en realidad virtual.</p></div></div>
                  <div className="flex items-center gap-8 group cursor-pointer hover:translate-x-4 transition-transform"><div className="p-5 bg-green-600 rounded-3xl group-hover:scale-110 transition-transform"><MessageCircle size={40}/></div><div className="space-y-1"><span className="font-black text-4xl tracking-tighter uppercase block">Chat Serenito</span><p className="text-slate-500 text-sm">Consultas automatizadas 24/7.</p></div></div>
                  <button className="mt-10 bg-white text-slate-950 w-full py-8 rounded-[2rem] font-black transition-all shadow-2xl hover:bg-red-600 hover:text-white text-2xl tracking-[0.2em] uppercase">Portal RDMLS.CL</button>
               </div>
            </div>
            <div className="mt-20 flex justify-center gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
               <img src="/img/escudo.png" className="h-24 object-contain" />
               <img src="/img/innovacion.png" className="h-24 object-contain" />
            </div>
            <button onClick={() => setStep(0)} className="mt-20 text-slate-600 hover:text-red-500 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.6em] font-black transition-colors w-full"><RefreshCw size={20}/> Reiniciar Plataforma</button>
         </div>
      </div>
    );

    default: return null;
  }
}
