import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  Shield, Heart, DollarSign, Printer, RefreshCw, 
  User, Map, Briefcase, Building2, Lightbulb, 
  Clock, QrCode, Smartphone, ArrowRight, 
  AlertTriangle, Quote, Play, Radio, MessageCircle, 
  Zap, HeartHandshake, Smile, Activity, Stethoscope
} from 'lucide-react';

// --- DATOS COMPLETOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "Gabinete", "Administración Municipal", "Secretaría Municipal", 
  "Asesoría Jurídica", "Dirección de Control", "SECPLAN", 
  "DIDECO", "DOM (Obras)", "Dirección de Tránsito",
  "Dirección de Gestión de Personas", "DAF (Admin. y Finanzas)", 
  "Seguridad Ciudadana", "Servicio a la Comunidad",
  "Turismo y Patrimonio", "Cultura", "Comunicaciones",
  "Delegación Av. del Mar", "Delegación La Antena", "Delegación Las Compañías", "Delegación Rural",
  "Juzgado de Policía Local 1", "Juzgado de Policía Local 2",
  "Cementerios", "Bodega Municipal", "Talleres",
  "Salud Municipal", "Educación Municipal"
];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "¡Correcto! Todos somos funcionarios públicos al servicio de la comunidad." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso y violencia." },
  { q: "¿Qué ofrece Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar, salud y deporte", "Nada"], ans: 1, explanation: "Buscamos el bienestar integral del funcionario y su familia." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Cuál es un valor intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base de nuestra función." },
  { q: "¿Qué dirección ve los proyectos?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN diseña los proyectos comunales." },
  { q: "¿Qué debo hacer al terminar?", options: ["Olvidar todo", "Sumarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a RDMLS." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
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

  // Scroll al inicio al cambiar paso
  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // NAVEGACIÓN
  const goNext = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // DATA DEMO
  const fillDemoData = () => {
    setUserData({ nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', dept: 'Alcaldía', cargo: 'Director' });
  };

  // QUIZ
  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setQuizState('waiting');
    if (quizIndex < QUESTIONS.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const printCertificate = () => window.print();

  // --- LAYOUT ROBUSTO (Móvil Infinito / Desktop Dividido) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL: Arriba en móvil (altura fija), Izquierda en PC (altura completa fija) */}
      <div className="lg:fixed lg:left-0 lg:top-0 lg:w-1/2 w-full h-[40vh] lg:h-screen bg-slate-100 flex items-center justify-center p-4 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 z-10">
         <div className="w-full h-full lg:rounded-3xl overflow-hidden shadow-none lg:shadow-xl bg-white relative flex items-center justify-center">
           {visual}
         </div>
      </div>

      {/* CONTENIDO: Abajo en móvil (scroll natural), Derecha en PC (scroll natural) */}
      <div className="lg:ml-[50%] lg:w-1/2 w-full flex flex-col min-h-screen relative z-20 bg-white shadow-2xl">
        <div className="px-6 lg:px-16 pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Paso {step}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-2">{title}</h2>
          <h3 className="text-lg lg:text-xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        <div className="flex-1 px-6 lg:px-16 py-8">
          <div className="space-y-8 text-lg lg:text-xl text-slate-700 leading-relaxed font-light">
            {content}
          </div>
        </div>

        <div className="px-6 lg:px-16 py-8 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors">
             <ChevronLeft size={16}/> Atrás
           </button>
           <button onClick={goNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:bg-red-600 transition-all flex items-center gap-2 text-sm uppercase tracking-wide transform hover:-translate-y-1">
             Siguiente <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );

  // --- PANTALLAS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-y-auto py-10">
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center p-6 gap-12">
        <div className="text-center md:text-left space-y-4 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 mx-auto md:mx-0 drop-shadow-2xl" alt="Escudo" />
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">INDUCCIÓN<br/><span className="text-red-500">MUNICIPAL</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
        </div>
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-2xl flex-1 relative">
          <button onClick={fillDemoData} className="absolute top-4 right-4 text-white/40 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold transition-colors">
            <Zap size={14}/> Demo
          </button>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><User className="text-red-500"/> Registro Funcionario</h3>
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d} className="text-black">{d}</option>)}
            </select>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Cargo" value={userData.cargo} onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.nombres} onClick={goNext} className="w-full bg-red-600 text-white p-4 rounded-xl font-black tracking-wide hover:bg-red-700 transition-all shadow-lg flex justify-center gap-3 mt-6 items-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]">
              INGRESAR AHORA <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black flex items-center justify-center">
           {/* VIDEO NATIVO: El playsinline es clave para móviles */}
           <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0&modestbranding=1&playsinline=1" title="Mensaje Alcaldesa" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      }
      content={
        <div className="animate-in fade-in duration-700">
           <p className="font-black text-4xl text-slate-900 mb-6">¡Hola, {userData.nombres}!</p>
           <p className="mb-8 text-xl font-light text-slate-600">Te sumas a una institución con historia. La Serena es una capital patrimonial que exige lo mejor de nosotros.</p>
           <div className="bg-red-50 p-8 rounded-[2rem] border-l-8 border-red-600 mb-10 shadow-sm">
             <Quote className="text-red-400 mb-4" size={40}/>
             <p className="text-2xl font-serif italic text-red-900 leading-relaxed">"Nuestro compromiso es modernizar la gestión municipal. Queremos funcionarios proactivos, empáticos y que entiendan que detrás de cada papel hay una familia."</p>
             <p className="text-right font-bold text-red-700 mt-4 text-sm uppercase">- Daniela Norambuena, Alcaldesa</p>
           </div>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión y Valores" 
      visual={
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-8">
           {/* Visual Simplificado para evitar crash */}
           <div className="space-y-8 w-full max-w-sm text-center">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                 <h4 className="font-black text-3xl text-yellow-400 mb-2">MISIÓN</h4>
                 <p className="text-slate-200 text-lg">Mejorar la calidad de vida con gestión participativa.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                 <h4 className="font-black text-3xl text-red-400 mb-2">VISIÓN</h4>
                 <p className="text-slate-200 text-lg">Líderes en desarrollo sostenible y patrimonio.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-8">Nuestros Valores:</p>
          <div className="space-y-4">
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-black text-xl shrink-0">1</div><div><h4 className="font-bold text-slate-900 text-xl">Probidad</h4><p className="text-slate-600">Rectitud intachable.</p></div></div>
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl shrink-0">2</div><div><h4 className="font-bold text-slate-900 text-xl">Cercanía</h4><p className="text-slate-600">Empatía total.</p></div></div>
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-black text-xl shrink-0">3</div><div><h4 className="font-bold text-slate-900 text-xl">Transparencia</h4><p className="text-slate-600">Actos públicos.</p></div></div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={<div className="h-full w-full bg-slate-100 p-6 overflow-y-auto"><div className="grid grid-cols-2 gap-3">{CONCEJALES.map((name, i) => (<div key={i} className="bg-white p-3 rounded-xl shadow-sm text-center border border-slate-200"><User className="mx-auto text-slate-300 mb-2"/><p className="text-[10px] font-black uppercase">{name}</p></div>))}</div></div>}
      content={
        <>
          <p className="mb-6 text-xl font-light">El <strong>Concejo Municipal</strong> tiene 10 integrantes electos.</p>
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
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-4"><img src="/img/organigrama_full.png" className="max-h-full max-w-full object-contain drop-shadow-xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Mapa+Estructural'}/></div>}
      content={
        <>
          <p className="mb-6 text-xl font-light">Direcciones clave para la gestión:</p>
          <div className="space-y-4">
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 flex gap-4"><Heart className="text-red-600"/><h4 className="font-bold text-slate-900 text-lg">DIDECO</h4><p className="ml-auto text-xs text-slate-400">Social</p></div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 flex gap-4"><Building2 className="text-blue-600"/><h4 className="font-bold text-slate-900 text-lg">DOM</h4><p className="ml-auto text-xs text-slate-400">Obras</p></div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 flex gap-4"><Map className="text-green-600"/><h4 className="font-bold text-slate-900 text-lg">SECPLAN</h4><p className="ml-auto text-xs text-slate-400">Proyectos</p></div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6"><div className="bg-white text-slate-900 font-black p-6 rounded-full mb-8 text-2xl">IMLS</div><div className="grid grid-cols-2 gap-4 text-center text-sm w-full"><div className="bg-blue-600/30 p-4 rounded-2xl">Vecinos</div><div className="bg-green-600/30 p-4 rounded-2xl">Empresas</div><div className="bg-purple-600/30 p-4 rounded-2xl">Gobierno</div><div className="bg-orange-600/30 p-4 rounded-2xl">Turistas</div></div></div>}
      content={
        <>
          <p className="mb-6 text-xl">Interactuamos 24/7 con nuestro entorno:</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500"><User className="text-blue-600"/><div><strong className="text-lg block text-slate-900">Vecinos</strong>El centro de nuestra gestión.</div></div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-green-500"><Briefcase className="text-green-600"/><div><strong className="text-lg block text-slate-900">Privados</strong>Socios estratégicos.</div></div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-purple-500"><Shield className="text-purple-600"/><div><strong className="text-lg block text-slate-900">Instituciones</strong>Coordinación vital.</div></div>
          </div>
        </>
      } 
    />;

    // --- NUEVA DIAPOSITIVA: CALIDAD DE VIDA (RECUPERADA Y EXPANDIDA) ---
    case 6: return <ChapterLayout title="Calidad de Vida" subtitle="Bienestar Integral" 
      visual={<div className="w-full h-full flex items-center justify-center bg-green-50"><HeartHandshake size={120} className="text-green-600/50"/></div>}
      content={
        <>
          <p className="mb-6 text-xl text-slate-700">Tu bienestar y el de tu familia son prioridad. Contamos con una red de apoyo integral:</p>
          <div className="space-y-5">
             <div className="p-5 border-2 border-green-100 bg-green-50/50 rounded-2xl flex items-start gap-4">
               <div className="bg-green-100 p-3 rounded-full text-green-700 shrink-0"><Stethoscope/></div>
               <div>
                 <strong className="block text-xl text-green-900">Salud y Apoyo Psicológico</strong>
                 <p className="text-green-800 text-sm mt-1">Convenios de salud, seguro complementario y programas de contención emocional y psicológica para el funcionario y sus cargas.</p>
               </div>
             </div>
             <div className="p-5 border-2 border-blue-100 bg-blue-50/50 rounded-2xl flex items-start gap-4">
               <div className="bg-blue-100 p-3 rounded-full text-blue-700 shrink-0"><Activity/></div>
               <div>
                 <strong className="block text-xl text-blue-900">Deporte y Recreación</strong>
                 <p className="text-blue-800 text-sm mt-1">Acceso gratuito a recintos deportivos municipales, talleres de pausa activa, ligas internas y eventos familiares.</p>
               </div>
             </div>
             <div className="p-5 border-2 border-orange-100 bg-orange-50/50 rounded-2xl flex items-start gap-4">
               <div className="bg-orange-100 p-3 rounded-full text-orange-700 shrink-0"><Smile/></div>
               <div>
                 <strong className="block text-xl text-orange-900">Beneficios Sociales</strong>
                 <p className="text-orange-800 text-sm mt-1">Bonos por escolaridad, aguinaldos (según contrato), sala cuna y beneficios exclusivos de la Caja de Compensación.</p>
               </div>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad" 
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50"><Shield size={120} className="text-pink-500/50"/></div>}
      content={
        <>
          <p className="mb-6 text-xl"><strong>Tolerancia Cero</strong> (Ley 21.643):</p>
          <div className="grid grid-cols-1 gap-3 mb-6">
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Acoso Laboral</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Acoso Sexual</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Violencia (Interna o Externa)</div>
          </div>
          <p className="text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">"Un solo acto grave es suficiente para denunciar. Existen canales protegidos."</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50"><AlertTriangle size={120} className="text-yellow-500/50"/></div>}
      content={
        <>
          <div className="space-y-8">
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><Map className="text-blue-500"/> Zona de Tsunamis</h4>
               <p className="text-lg text-slate-600">La Serena es zona de riesgo. Ante sismo fuerte, evacuar siempre a la <strong>Cota 30</strong> (Av. Cisternas hacia arriba).</p>
             </div>
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><AlertTriangle className="text-red-500"/> Accidentes Laborales</h4>
               <div className="bg-red-50 p-6 rounded-3xl text-red-900 font-bold text-lg border border-red-100">
                 <ol className="list-decimal ml-6 space-y-2">
                   <li>AVISAR INMEDIATAMENTE A JEFATURA.</li>
                   <li>ACUDIR A LA ACHS (Mutualidad).</li>
                   <li>REGISTRO OBLIGATORIO (DIAT).</li>
                 </ol>
               </div>
             </div>
          </div>
        </>
      } 
    />;

    // 9. QUIZ
    case 9: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-slate-100"><div className="h-full bg-green-500 transition-all" style={{width: `${((quizIndex+1)/QUESTIONS.length)*100}%`}}></div></div>
           
           {!quizFinished ? (
             <>
               <div className="flex justify-between mb-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                 <span>Evaluación</span>
                 <span>{quizIndex + 1} / {QUESTIONS.length}</span>
               </div>
               
               <h3 className="text-2xl md:text-3xl font-black mb-8 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleAnswer(i)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-5 rounded-2xl border-2 font-bold text-lg transition-all ${
                       quizState === 'waiting' ? 'border-slate-100 hover:bg-slate-50' :
                       i === QUESTIONS[quizIndex].ans ? 'bg-green-50 border-green-500 text-green-800' : 
                       quizState === 'wrong' && quizIndex === i ? 'bg-red-50 border-red-500 text-red-800' : 'opacity-50'
                     }`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>

               {quizState !== 'waiting' && (
                 <div className={`mt-8 p-6 rounded-2xl ${quizState === 'correct' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'} animate-in slide-in-from-bottom-2`}>
                   <p className="font-bold mb-2 flex items-center gap-2 text-xl">
                     {quizState === 'correct' ? <><CheckCircle/> ¡Correcto!</> : <><AlertTriangle/> Corrección:</>}
                   </p>
                   <p className="mb-6 text-base leading-relaxed">{QUESTIONS[quizIndex].explanation}</p>
                   <button onClick={nextQuestion} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors">Siguiente Pregunta</button>
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
           <div className="w-full flex justify-between opacity-80 mb-4">
             <img src="/img/escudo.png" className="h-24 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-24 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
           </div>
           
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 mb-4 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-3xl italic text-slate-500 mb-10 font-serif">De Aprobación de Inducción Corporativa</p>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">RUT: {userData.rut} • {userData.cargo}</p>
             <div className="h-2 w-40 bg-red-600 mx-auto rounded-full mb-10"></div>
             <p className="text-2xl text-slate-600">Ha completado exitosamente la Inducción 2026.</p>
           </div>

           <div className="flex justify-between w-full px-12 mt-16 text-sm font-bold uppercase text-slate-400 tracking-widest">
             <div className="text-center"><div className="h-20 mb-4 border-b-2 border-slate-300 w-64 mx-auto flex items-end justify-center"><img src="/img/firma_personas.png" className="h-16 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/></div>Director Gestión Personas</div>
             <div className="text-center pt-12 text-lg">{currentTime.toLocaleDateString()}</div>
             <div className="text-center"><div className="h-20 mb-4 border-b-2 border-slate-300 w-64 mx-auto flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="h-16 opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/></div>Alcaldesa</div>
           </div>
        </div>
        
        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100 flex items-center gap-2 text-lg"><Printer size={24}/> Descargar</button>
           <button onClick={goNext} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 flex items-center gap-2 text-lg">Finalizar <ArrowRight size={24}/></button>
        </div>
      </div>
    );

    // 11. COMUNIDAD (FINAL)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-30 bg-cover"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent"></div>
         
         <div className="bg-white/10 p-10 md:p-20 rounded-[3rem] backdrop-blur-xl border border-white/10 max-w-5xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Smartphone size={80} className="mx-auto mb-8 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]"/>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">¡Sigue Conectado!</h2>
            <p className="text-2xl text-slate-300 mb-16 font-light max-w-3xl mx-auto leading-relaxed">La inducción termina, pero tu vida funcionaria recién comienza. Únete a nuestra comunidad digital y mantente informado.</p>
            
            <div className="grid md:grid-cols-2 gap-12 text-left bg-black/30 p-10 rounded-[2.5rem] border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-xl">
                  <QrCode size={200} className="text-slate-900"/>
                  <p className="text-slate-900 font-bold mt-6 text-lg uppercase tracking-wider">Escanear Acceso</p>
               </div>
               <div className="space-y-8 flex flex-col justify-center">
                  <div className="flex items-center gap-5"><Radio className="text-red-500" size={32}/><span className="font-bold text-2xl">Radio Digital Municipal</span></div>
                  <div className="flex items-center gap-5"><Map className="text-blue-500" size={32}/><span className="font-bold text-2xl">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-5"><MessageCircle className="text-green-500" size={32}/><span className="font-bold text-2xl">Chat con Serenito</span></div>
                  
                  <button className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full py-5 rounded-2xl font-black transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 text-xl hover:scale-105">
                    Ir al Portal RDMLS <ArrowRight size={24}/>
                  </button>
               </div>
            </div>
            
            <div className="mt-16 flex justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <img src="/img/escudo.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'} title="Ilustre Municipalidad de La Serena"/>
               <img src="/img/innovacion.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'} title="Innovación Municipal de Clase Mundial"/>
            </div>

            <button onClick={() => setStep(0)} className="mt-12 text-slate-400 hover:text-white flex items-center justify-center gap-3 text-sm uppercase tracking-widest transition-colors w-full">
              <RefreshCw size={16}/> Cerrar Sesión Segura
            </button>
         </div>
      </div>
    );

    default: return null;
  }
}
