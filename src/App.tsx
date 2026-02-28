import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Star, AlertTriangle, FileText
} from 'lucide-react';

// --- DATOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "Gabinete", "Administración Municipal", "Secretaría Municipal", 
  "Asesoría Jurídica", "Dirección de Control", "SECPLAN", "DIDECO", "DOM (Obras)", "Dirección de Tránsito",
  "Dirección de Gestión de Personas", "DAF (Admin. y Finanzas)", "Seguridad Ciudadana", "Servicio a la Comunidad",
  "Turismo y Patrimonio", "Cultura", "Comunicaciones", "Delegación Av. del Mar", "Delegación La Antena", 
  "Delegación Las Compañías", "Delegación Rural", "Juzgado de Policía Local 1", "Juzgado de Policía Local 2",
  "Cementerios", "Bodega Municipal", "Talleres", "Salud Municipal", "Educación Municipal"
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos al servicio de la comunidad." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso y violencia." },
  { q: "¿Cuándo se paga a Planta y Contrata?", options: ["Día 5", "Penúltimo día hábil", "Día 15"], ans: 1, explanation: "El pago es mensual y fijo el penúltimo día hábil." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Cuál es un valor intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base de nuestra función." },
  { q: "¿Qué dirección ve los proyectos?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN diseña los proyectos comunales." },
  { q: "¿Qué debo hacer al terminar?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a RDMLS." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín", "Gladys Marín Ossandón", "Francisca Barahona Araya", 
  "María Teresita Prouvay", "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- VIDEO PLAYER ESTABLE ---
const VideoPlayer = () => {
  const [play, setPlay] = useState(false);
  return play ? (
    <div className="w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl animate-in fade-in">
      <iframe className="w-full h-full" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0" title="Mensaje" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
    </div>
  ) : (
    <div className="w-full h-full relative cursor-pointer group rounded-3xl overflow-hidden shadow-2xl bg-slate-900" onClick={() => setPlay(true)}>
      <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-all"/>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Play size={40} fill="white" className="ml-2"/></div>
        <p className="mt-4 font-black uppercase tracking-widest text-lg drop-shadow-md">Ver Mensaje Alcaldesa</p>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ names: '', surnames: '', rut: '', dept: '', cargo: '' });
  const [canAdvance, setCanAdvance] = useState(true); 
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Quiz Logic
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

  // --- LÓGICA DE SCROLL OBLIGATORIO ---
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Calculamos si llegó al fondo (con margen de 20px)
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
      const isShort = el.scrollHeight <= el.clientHeight; // Si el texto es corto
      
      if (isBottom || isShort) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos exentos de lectura obligatoria (Login, Video, Quiz, Certificado, Final)
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false); // Bloquear al inicio
      if (scrollRef.current) scrollRef.current.scrollTop = 0; // Reset scroll
      setTimeout(checkProgress, 500); // Check inicial
    }
  }, [step]);

  // Navegación
  const goNext = () => {
    if (canAdvance) setStep(s => Math.min(s + 1, totalSteps - 1));
  };
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // Quiz
  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const correct = idx === QUESTIONS[quizIndex].ans;
    setQuizState(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setQuizState('waiting');
    if (quizIndex < QUESTIONS.length - 1) setQuizIndex(i => i + 1);
    else setQuizFinished(true);
  };

  const printCertificate = () => window.print();

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      
      {/* Fondo Glow Estático */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white via-slate-50 to-slate-100"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL */}
      <div className="lg:w-1/2 w-full lg:h-full h-[35vh] p-4 lg:p-12 flex items-center justify-center relative z-10 bg-slate-100/50 border-b lg:border-b-0 lg:border-r border-slate-200">
         <div className="w-full h-full relative shadow-xl rounded-3xl overflow-hidden bg-white">{visual}</div>
      </div>

      {/* CONTENIDO */}
      <div className="lg:w-1/2 w-full flex flex-col h-[65vh] lg:h-full relative z-20 bg-white/90 backdrop-blur-xl shadow-2xl">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Paso {step}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-none mb-2">{title}</h2>
          <h3 className="text-lg lg:text-xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        {/* SCROLL DETECTOR */}
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 scroll-smooth">
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-light text-justify">
            {content}
            
            {/* Espaciador visual para forzar scroll */}
            {!canAdvance && (
              <div className="py-8 text-center opacity-50 animate-pulse">
                <ChevronDown className="mx-auto text-red-500 mb-2"/>
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Sigue leyendo para avanzar</p>
              </div>
            )}
            <div className="h-12"></div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 lg:px-16 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 z-30">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors">
             <ChevronLeft size={16}/> Atrás
           </button>
           
           <div className="flex items-center gap-4">
             {canAdvance ? (
                <span className="text-green-600 text-xs font-bold flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2"><CheckCircle size={16}/> Leído</span>
             ) : (
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1"><ChevronDown size={16}/> Baja más</span>
             )}
             
             <button 
               onClick={goNext} 
               disabled={!canAdvance}
               className={`px-8 py-3 rounded-xl font-bold shadow-xl transition-all flex items-center gap-2 text-sm uppercase tracking-wide transform 
                 ${canAdvance ? 'bg-slate-900 text-white hover:bg-red-600 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
               `}
             >
               Siguiente <ArrowRight size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- VISTAS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl h-full flex flex-col md:flex-row items-center justify-center p-8 gap-12">
        <div className="text-center md:text-left space-y-4 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 mx-auto md:mx-0 drop-shadow-2xl" alt="Escudo" />
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">INDUCCIÓN<br/><span className="text-red-500">MUNICIPAL</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
        </div>
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-2xl flex-1 relative">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><User className="text-red-500"/> Registro Funcionario</h3>
            
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" placeholder="Nombres" value={userData.names} onChange={e => setUserData({...userData, names: e.target.value})} />
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" placeholder="Apellidos" value={userData.surnames} onChange={e => setUserData({...userData, surnames: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d} className="text-black">{d}</option>)}
            </select>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" placeholder="Cargo" value={userData.cargo} onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.names} onClick={goNext} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl font-black tracking-wide hover:shadow-lg hover:shadow-red-900/50 flex justify-center gap-3 mt-6 items-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02]">
              INGRESAR AHORA <ArrowRight size={20}/>
            </button>
            
            {/* BOTÓN MÁGICO DE LLENADO */}
            <button onClick={() => setUserData({names: 'Rodrigo', surnames: 'Godoy', rut: '12.345.678-9', dept: 'Alcaldía', cargo: 'Director'})} className="w-full text-[10px] text-white/20 hover:text-white/50 uppercase font-bold text-center mt-2">
              ⚡ Llenar Datos (Prueba)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" visual={<VideoPlayer />}
      content={
        <div>
           <p className="font-black text-4xl text-slate-900 mb-6">¡Hola, {userData.names}!</p>
           <p className="mb-8 text-xl font-light text-slate-600">Te sumas a una institución con historia. La Serena es una capital patrimonial que exige lo mejor de nosotros.</p>
           <div className="bg-red-50 p-8 rounded-[2rem] border-l-8 border-red-600 mb-10 shadow-sm">
             <p className="text-2xl font-serif italic text-red-900 leading-relaxed">"Nuestro compromiso es modernizar la gestión municipal. Queremos funcionarios proactivos, empáticos y que entiendan que detrás de cada papel hay una familia."</p>
             <p className="text-right font-bold text-red-700 mt-4 text-sm uppercase">- Daniela Norambuena, Alcaldesa</p>
           </div>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión y Valores" 
      visual={<div className="w-full h-full bg-slate-800 flex flex-col justify-center items-center text-white p-8"><Star size={80} className="text-yellow-400 mb-4"/><h4 className="font-black text-4xl">MISIÓN</h4></div>}
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-8">Nuestros Valores:</p>
          <div className="space-y-6">
             <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold text-xl">1</div><div><h4 className="font-bold text-slate-900 text-xl">Probidad</h4><p className="text-slate-600">Rectitud intachable.</p></div></div>
             <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">2</div><div><h4 className="font-bold text-slate-900 text-xl">Cercanía</h4><p className="text-slate-600">Empatía total.</p></div></div>
             <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-xl">3</div><div><h4 className="font-bold text-slate-900 text-xl">Transparencia</h4><p className="text-slate-600">Actos públicos.</p></div></div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={<div className="h-full w-full bg-slate-100 p-6 overflow-y-auto rounded-3xl"><div className="grid grid-cols-2 gap-3">{CONCEJALES.map((name, i) => (<div key={i} className="bg-white p-3 rounded-xl shadow-sm text-center"><User className="mx-auto text-slate-300"/><p className="text-[10px] font-bold mt-2">{name}</p></div>))}</div></div>}
      content={
        <>
          <p className="mb-6 text-xl">El <strong>Concejo Municipal</strong> tiene 10 integrantes electos.</p>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
             <h4 className="font-black text-yellow-900 text-lg mb-4">Funciones Clave:</h4>
             <ul className="space-y-3">
               <li className="flex gap-3 items-center"><CheckCircle className="text-yellow-700"/> <span className="text-yellow-900"><strong>Normar:</strong> Ordenanzas comunales.</span></li>
               <li className="flex gap-3 items-center"><CheckCircle className="text-yellow-700"/> <span className="text-yellow-900"><strong>Fiscalizar:</strong> Presupuesto.</span></li>
               <li className="flex gap-3 items-center"><CheckCircle className="text-yellow-700"/> <span className="text-yellow-900"><strong>Resolver:</strong> Licitaciones.</span></li>
             </ul>
          </div>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura" 
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-4 rounded-3xl"><img src="/img/organigrama_full.png" className="max-h-full max-w-full object-contain" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Organigrama'}/></div>}
      content={
        <>
          <p className="mb-6 text-xl">Direcciones clave:</p>
          <div className="space-y-4">
             <div className="p-5 bg-white shadow-sm rounded-2xl border flex gap-4"><Heart className="text-red-600"/><h4 className="font-bold text-slate-900">DIDECO (Social)</h4></div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border flex gap-4"><Building2 className="text-blue-600"/><h4 className="font-bold text-slate-900">DOM (Obras)</h4></div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border flex gap-4"><Map className="text-green-600"/><h4 className="font-bold text-slate-900">SECPLAN (Proyectos)</h4></div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white rounded-3xl p-6"><div className="bg-white text-slate-900 font-black p-6 rounded-full mb-8 text-2xl">IMLS</div><div className="grid grid-cols-2 gap-4 text-center text-sm w-full"><div className="bg-blue-600/30 p-4 rounded-2xl">Vecinos</div><div className="bg-green-600/30 p-4 rounded-2xl">Empresas</div></div></div>}
      content={
        <>
          <p className="mb-6 text-xl">Interactuamos 24/7 con nuestro entorno.</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500"><User className="text-blue-600"/><div><strong className="text-lg block">Vecinos</strong>El centro de nuestra gestión.</div></div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-green-500"><Briefcase className="text-green-600"/><div><strong className="text-lg block">Privados</strong>Socios estratégicos.</div></div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-purple-500"><Shield className="text-purple-600"/><div><strong className="text-lg block">Instituciones</strong>Coordinación vital.</div></div>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Solo Equipo" 
      visual={<div className="w-full h-full flex items-center justify-center bg-green-50 rounded-3xl"><DollarSign size={150} className="text-green-600/50"/></div>}
      content={
        <>
          <p className="mb-6 text-xl">Todos somos compañeros, con distintas modalidades:</p>
          <div className="space-y-6">
             <div className="p-6 border border-green-200 bg-green-50/50 rounded-3xl"><strong className="block text-xl text-green-900 mb-2">Planta y Contrata</strong><span className="text-green-700">Pago: <strong>Penúltimo día hábil del mes</strong>.</span></div>
             <div className="p-6 border border-blue-200 bg-blue-50/50 rounded-3xl"><strong className="block text-xl text-blue-900 mb-2">Honorarios</strong><span className="text-blue-700">Pago: Variable (requiere informe mensual).</span></div>
          </div>
        </>
      } 
    />;

    // --- DIAPOSITIVA 7: LEY KARIN (EXPANDIDA) ---
    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad y Respeto" 
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50 rounded-3xl"><Heart size={150} className="text-pink-500/50"/></div>}
      content={
        <>
          <p className="mb-6 text-lg">La <strong>Ley N° 21.643 (Ley Karin)</strong> modifica el Código del Trabajo para prevenir, investigar y sancionar el acoso laboral, sexual y la violencia en el trabajo. Establece un nuevo estándar de <strong>Tolerancia Cero</strong>.</p>
          
          <h4 className="font-bold text-slate-900 text-xl mb-4">¿Qué conductas sanciona?</h4>
          <div className="grid grid-cols-1 gap-4 mb-6">
             <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <strong className="text-pink-900 block flex items-center gap-2"><AlertTriangle size={18}/> Acoso Laboral</strong>
                <p className="text-sm text-slate-600 mt-1">Toda conducta que constituya agresión u hostigamiento, ejercida por el empleador o por uno o más trabajadores.</p>
             </div>
             <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <strong className="text-pink-900 block flex items-center gap-2"><AlertTriangle size={18}/> Acoso Sexual</strong>
                <p className="text-sm text-slate-600 mt-1">Cualquier requerimiento de carácter sexual no consentido que amenace o perjudique la situación laboral.</p>
             </div>
             <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <strong className="text-pink-900 block flex items-center gap-2"><AlertTriangle size={18}/> Violencia en el Trabajo</strong>
                <p className="text-sm text-slate-600 mt-1">Incluye la violencia ejercida por terceros ajenos a la relación laboral (clientes, usuarios, proveedores).</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h5 className="font-black text-slate-900 mb-2">Cambio Fundamental:</h5>
             <p className="text-slate-700">Ya no se exige que el acoso sea "reiterado". <strong>Un solo acto grave es suficiente</strong> para constituir acoso y ser denunciado.</p>
          </div>
          <p className="mt-4 text-sm text-slate-500">El municipio cuenta con un <strong>Protocolo de Prevención</strong> y canales de denuncia confidenciales que debes conocer y utilizar.</p>
        </>
      } 
    />;

    // --- DIAPOSITIVA 8: SEGURIDAD (EXPANDIDA) ---
    case 8: return <ChapterLayout title="Seguridad Laboral" subtitle="Tu vida es primero" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50 rounded-3xl"><Shield size={150} className="text-yellow-500/50"/></div>}
      content={
        <>
          <p className="mb-6 text-lg">La seguridad es responsabilidad de todos. Estamos cubiertos por la <strong>Ley 16.744</strong> sobre Accidentes del Trabajo y Enfermedades Profesionales.</p>
          
          <div className="space-y-8">
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><Map className="text-blue-500"/> Zona de Tsunamis</h4>
               <p className="text-slate-700 mb-2">La Serena es una ciudad costera con riesgo de tsunami. Ante un sismo de mayor intensidad (que te cueste mantenerte en pie), la evacuación es obligatoria.</p>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                 <strong className="text-blue-900">Punto de Encuentro:</strong> Sobre la <strong>Cota 30</strong> (Desde Avenida Cisternas hacia el oriente).
               </div>
             </div>

             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><AlertCircle className="text-red-500"/> Accidentes Laborales</h4>
               <p className="text-slate-700 mb-3">Si sufres una lesión a causa o con ocasión del trabajo, o en el trayecto directo (habitación-trabajo-habitación), sigue estos pasos <strong>SIN FALTA</strong>:</p>
               
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-red-600 rounded-full text-white flex items-center justify-center font-bold shrink-0">1</div>
                   <div><strong className="block text-slate-900">AVISO INMEDIATO</strong>Debes informar a tu jefatura directa en el momento exacto del accidente.</div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-red-600 rounded-full text-white flex items-center justify-center font-bold shrink-0">2</div>
                   <div><strong className="block text-slate-900">ACUDIR A MUTUALIDAD</strong>Dirígete al centro de atención de la <strong>ACHS</strong> (Asociación Chilena de Seguridad) más cercano.</div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-red-600 rounded-full text-white flex items-center justify-center font-bold shrink-0">3</div>
                   <div><strong className="block text-slate-900">NO IRSE A CASA</strong>Si te vas a tu domicilio sin el registro médico ("DIAT"), pierdes la cobertura del seguro.</div>
                 </div>
               </div>
             </div>
          </div>
        </>
      } 
    />;

    // 9. QUIZ
    case 9: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative">
           {!quizFinished ? (
             <>
               <div className="flex justify-between mb-8 text-sm font-bold text-slate-400 uppercase tracking-widest"><span>Evaluación</span><span>{quizIndex + 1} / {QUESTIONS.length}</span></div>
               <h3 className="text-2xl font-black mb-8 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all ${quizState === 'waiting' ? 'border-slate-100 hover:bg-slate-50' : i === QUESTIONS[quizIndex].ans ? 'bg-green-50 border-green-500 text-green-800' : quizState === 'wrong' && quizIndex === i ? 'bg-red-50 border-red-500 text-red-800' : 'opacity-50'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-8 p-6 rounded-2xl bg-slate-50 animate-in fade-in">
                   <p className="font-bold mb-2">{quizState === 'correct' ? '¡Correcto!' : 'Corrección:'}</p>
                   <p className="mb-6 text-sm">{QUESTIONS[quizIndex].explanation}</p>
                   <button onClick={nextQuestion} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg">Siguiente</button>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-10">
               <Award size={80} className="mx-auto text-yellow-500 mb-6" />
               <h2 className="text-4xl font-black mb-4">¡Excelente!</h2>
               <p className="text-slate-500 mb-8 text-xl">Has completado la evaluación.</p>
               <button onClick={goNext} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-2xl hover:bg-red-600 transition-colors">Generar Certificado</button>
             </div>
           )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 w-full max-w-5xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[12px] border-double border-slate-200">
           <div className="w-full flex justify-between opacity-80">
             <img src="/img/escudo.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
           </div>
           
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-4 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-2xl italic text-slate-500 mb-8 font-serif">De Aprobación de Inducción Corporativa</p>
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{userData.names} {userData.surnames}</h2>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">RUT: {userData.rut} • {userData.cargo}</p>
             <div className="h-1 w-32 bg-red-600 mx-auto rounded-full mb-8"></div>
             <p className="text-xl text-slate-600">Ha completado exitosamente la Inducción 2026.</p>
           </div>

           <div className="flex justify-between w-full px-8 mt-12 text-xs font-bold uppercase text-slate-400 tracking-widest">
             <div className="text-center"><div className="h-16 mb-2 border-b border-slate-300 w-48 mx-auto flex items-end justify-center"><img src="/img/firma_personas.png" className="h-14 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/></div>Director Gestión Personas</div>
             <div className="text-center pt-8">{currentTime.toLocaleDateString()}</div>
             <div className="text-center"><div className="h-16 mb-2 border-b border-slate-300 w-48 mx-auto flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-14 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/></div>Alcaldesa</div>
           </div>
        </div>
        
        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100 flex items-center gap-2"><Printer/> Descargar</button>
           <button onClick={goNext} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 flex items-center gap-2">Siguiente <ArrowRight/></button>
        </div>
      </div>
    );

    // 11. COMUNIDAD FINAL (RESTAURADA)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-30 bg-cover"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent"></div>
         
         <div className="bg-white/10 p-10 md:p-16 rounded-[3rem] backdrop-blur-xl border border-white/10 max-w-5xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Smartphone size={70} className="mx-auto mb-6 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"/>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">¡Sigue Conectado!</h2>
            <p className="text-xl text-slate-300 mb-12 font-light max-w-2xl mx-auto">La inducción termina, pero tu vida funcionaria recién comienza. Únete a nuestra comunidad digital.</p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left bg-black/20 p-8 rounded-3xl border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
                  <QrCode size={160} className="text-slate-900"/>
                  <p className="text-slate-900 font-bold mt-4 text-sm uppercase tracking-wider">Escanear Acceso</p>
               </div>
               <div className="space-y-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4"><Radio className="text-red-500" size={28}/><span className="font-bold text-xl">Radio Digital Municipal</span></div>
                  <div className="flex items-center gap-4"><Map className="text-blue-500" size={28}/><span className="font-bold text-xl">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-4"><MessageCircle className="text-green-500" size={28}/><span className="font-bold text-xl">Chat con Serenito</span></div>
                  
                  <button className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 text-lg">
                    Ir al Portal RDMLS <ArrowRight size={20}/>
                  </button>
               </div>
            </div>
            
            <div className="mt-12 flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
               <img src="/img/escudo.png" className="h-16 object-contain" onError={(e)=>e.currentTarget.style.display='none'} title="Ilustre Municipalidad de La Serena"/>
               <img src="/img/innovacion.png" className="h-16 object-contain" onError={(e)=>e.currentTarget.style.display='none'} title="Innovación Municipal de Clase Mundial"/>
            </div>

            <button onClick={() => setStep(0)} className="mt-8 text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm uppercase tracking-widest transition-colors w-full">
              <RefreshCw size={14}/> Cerrar Sesión Segura
            </button>
         </div>
      </div>
    );

    default: return null;
  }
}
