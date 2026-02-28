import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, AlertCircle, Quote, Play
} from 'lucide-react';

// --- COMPONENTE DE VIDEO INTELIGENTE ("NETFLIX STYLE") ---
const SmartVideoPlayer = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500">
        <iframe 
          className="w-full h-full" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`} 
          title="Mensaje Alcaldesa" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
      {/* Portada del Video (Thumbnail de Alta Calidad) */}
      <img 
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
        className="w-full h-full object-cover rounded-[2rem] shadow-2xl brightness-75 group-hover:brightness-50 transition-all duration-500"
        alt="Portada Video"
      />
      
      {/* Botón Play Gigante */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform duration-300">
          <Play size={40} fill="white" className="ml-2"/>
        </div>
        <p className="mt-4 font-black text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
          Ver Mensaje Oficial
        </p>
      </div>

      {/* Etiqueta Inferior */}
      <div className="absolute bottom-8 left-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
        <p className="text-white font-bold text-lg">Alcaldesa Daniela Norambuena</p>
        <p className="text-slate-300 text-sm">Bienvenida IMLS 2026</p>
      </div>
    </div>
  );
};

// --- BASE DE DATOS ---
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
  { q: "¿Quiénes son parte del equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios con vocación de servicio." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia cero al acoso laboral, sexual y violencia." },
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
  const [canAdvance, setCanAdvance] = useState(false);
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

  // SCROLL LOGIC (Ajustada para textos largos)
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      const isShort = el.scrollHeight <= el.clientHeight;
      if (isAtBottom || isShort) setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      setTimeout(checkProgress, 800);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    if (isCorrect) {
      setQuizState('correct');
      setScore(prev => prev + 1);
    } else {
      setQuizState('wrong');
    }
  };

  const nextQuestion = () => {
    setQuizState('waiting');
    if (quizIndex < QUESTIONS.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const printCertificate = () => window.print();

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden print:hidden font-sans">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-700 shadow-lg" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL (Desktop: Izquierda / Móvil: Arriba) */}
      <div className="lg:order-2 hidden lg:flex w-1/2 h-full items-center justify-center relative p-12 bg-slate-100 border-l border-slate-200">
        <div className="w-full h-full max-h-[800px] relative z-10">
           {visual}
        </div>
      </div>

      <div className="lg:hidden w-full h-[35vh] bg-slate-100 relative shrink-0 shadow-lg z-20 border-b border-slate-200">
         {visual}
      </div>

      {/* CONTENIDO (Desktop: Derecha / Móvil: Abajo) */}
      <div className="lg:order-1 w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full relative z-20 bg-white">
        
        {/* HEADER */}
        <div className="px-8 lg:px-16 pt-10 pb-6 shrink-0 bg-white border-b border-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-red-200 shadow-lg">Módulo {step}</span>
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Inducción 2026</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-3">{title}</h2>
          <div className="h-1 w-20 bg-red-600 rounded-full mb-3"></div>
          <h3 className="text-lg lg:text-2xl text-slate-500 font-medium font-serif italic">{subtitle}</h3>
        </div>
        
        {/* TEXTO (TIPOGRAFÍA MEJORADA) */}
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8">
          <div className="space-y-8 text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
            {content}
            
            {/* Espaciador para forzar scroll */}
            <div className="py-16 flex flex-col items-center justify-center opacity-40 gap-2">
              <div className="h-16 w-[2px] bg-slate-300"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Fin de la lectura</span>
            </div>
          </div>
        </div>

        {/* BOTONERA */}
        <div className="px-8 lg:px-16 py-6 border-t border-slate-100 bg-white/90 backdrop-blur flex items-center justify-between shrink-0 mb-safe z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           
           <button 
             onClick={() => setStep(s => Math.max(0, s - 1))} 
             className="text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors px-4 py-3 rounded-lg hover:bg-slate-50"
           >
             <ChevronLeft size={16}/> Volver
           </button>

           <div className="flex gap-6 items-center">
             {!canAdvance && (
                <span className="text-red-500 text-xs font-bold animate-pulse flex items-center gap-2">
                  <ChevronDown size={14} className="animate-bounce"/> Desliza hasta el final
                </span>
             )}
             
             <button 
               disabled={!canAdvance} 
               onClick={() => setStep(s => s + 1)} 
               className="bg-slate-900 text-white pl-8 pr-6 py-4 rounded-2xl font-bold shadow-xl hover:bg-red-600 hover:shadow-red-500/30 hover:-translate-y-1 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none disabled:transform-none transition-all flex items-center gap-3 text-sm group"
             >
               Siguiente <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- CONTENIDOS ---

  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden print:hidden">
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-20" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center p-8 gap-16">
        <div className="text-center md:text-left space-y-8 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-32 mx-auto md:mx-0 drop-shadow-2xl opacity-90" alt="Escudo" />
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] mb-4">INDUCCIÓN<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">MUNICIPAL</span></h1>
            <div className="h-1 w-24 bg-red-600 mb-4 mx-auto md:mx-0"></div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex-1 ring-1 ring-white/20">
          <div className="space-y-5">
            <h3 className="text-white font-bold text-2xl mb-8 flex items-center gap-3"><User className="text-red-500"/> Registro Funcionario</h3>
            
            <div className="grid grid-cols-2 gap-4">
               <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="RUT (12.345.678-9)" onChange={e => setUserData({...userData, rut: e.target.value})} />

            <div className="relative">
              <select className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-bold text-white text-sm appearance-none focus:border-red-500 outline-none cursor-pointer" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d} className="text-slate-900">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={16}/>
            </div>
            
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Cargo (Ej: Administrativo)" onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.nombres || !userData.rut || !userData.dept} onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-5 rounded-xl font-black tracking-wide hover:shadow-lg hover:shadow-red-900/50 flex justify-center gap-3 mt-6 items-center disabled:opacity-30 disabled:cursor-not-allowed group transition-all">
              INICIAR SESIÓN <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={
        // AQUÍ ESTÁ EL COMPONENTE DE VIDEO NUEVO
        <div className="w-full h-full p-4">
           <SmartVideoPlayer videoId="EQUdyb-YVxM" />
        </div>
      }
      content={
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
           <p className="font-black text-4xl text-slate-900 mb-8">¡Bienvenido al Equipo, {userData.nombres}!</p>
           
           <p className="mb-8 font-light text-2xl text-slate-600">Te sumas a una institución con historia. La Serena no es solo la segunda ciudad más antigua de Chile; es una capital patrimonial que exige lo mejor de nosotros.</p>
           
           <div className="bg-red-50 p-8 rounded-3xl border-l-8 border-red-500 mb-10 shadow-lg">
             <Quote className="text-red-300 mb-4" size={40}/>
             <p className="text-2xl font-serif italic text-red-900 leading-relaxed">"Nuestro compromiso es modernizar la gestión municipal. Queremos funcionarios proactivos, empáticos y que entiendan que detrás de cada papel hay una familia esperando una solución."</p>
           </div>

           <p className="font-bold text-slate-800 text-xl mb-4">En esta inducción conocerás:</p>
           <ul className="space-y-4">
             <li className="flex items-center gap-4 text-lg"><div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle size={20}/></div> Nuestra Misión y Valores.</li>
             <li className="flex items-center gap-4 text-lg"><div className="bg-blue-100 p-2 rounded-full text-blue-600"><CheckCircle size={20}/></div> Estructura y Autoridades.</li>
             <li className="flex items-center gap-4 text-lg"><div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><CheckCircle size={20}/></div> Tus Derechos y Deberes.</li>
           </ul>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión, Visión y Valores" 
      visual={
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-12 relative overflow-hidden rounded-[2rem]">
           <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[150px] opacity-20"></div>
           <div className="grid gap-6 w-full relative z-10">
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                 <div className="flex items-center gap-4 mb-3"><Lightbulb className="text-yellow-400" size={32}/> <h4 className="font-black text-3xl tracking-tight">MISIÓN</h4></div>
                 <p className="text-slate-300 text-lg leading-relaxed">Mejorar la calidad de vida de los habitantes de la comuna a través de una gestión participativa, inclusiva y transparente.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                 <div className="flex items-center gap-4 mb-3"><MapPin className="text-red-500" size={32}/> <h4 className="font-black text-3xl tracking-tight">VISIÓN</h4></div>
                 <p className="text-slate-300 text-lg leading-relaxed">Ser una comuna líder en desarrollo sostenible, turismo y patrimonio, reconocida por su calidad de vida.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-3xl font-light text-slate-500 mb-10">Para remar todos hacia el mismo lado, debemos tener clara nuestra brújula.</p>
          
          <h4 className="font-black text-slate-900 text-2xl mb-8">Nuestros Valores Intransables:</h4>
          
          <div className="grid gap-8">
             <div className="flex gap-6 items-start p-6 hover:bg-slate-50 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
               <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-black text-3xl shrink-0 shadow-md">1</div>
               <div><h4 className="font-bold text-slate-900 text-2xl mb-2">Probidad</h4><p className="text-slate-600 text-lg">Actuamos con rectitud intachable. Los recursos municipales son sagrados y pertenecen a todos los vecinos.</p></div>
             </div>
             
             <div className="flex gap-6 items-start p-6 hover:bg-slate-50 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-3xl shrink-0 shadow-md">2</div>
               <div><h4 className="font-bold text-slate-900 text-2xl mb-2">Cercanía</h4><p className="text-slate-600 text-lg">No somos burócratas, somos servidores públicos. Empatizamos con el problema del otro.</p></div>
             </div>

             <div className="flex gap-6 items-start p-6 hover:bg-slate-50 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
               <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-black text-3xl shrink-0 shadow-md">3</div>
               <div><h4 className="font-bold text-slate-900 text-2xl mb-2">Transparencia</h4><p className="text-slate-600 text-lg">Nuestros actos son públicos. Informamos con claridad y oportundidad a la comunidad.</p></div>
             </div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="El Equipo Fiscalizador" 
      visual={
        <div className="h-full w-full bg-slate-100 p-8 overflow-y-auto rounded-[2rem]">
            <div className="grid grid-cols-2 gap-4">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center border border-slate-200 group cursor-default">
                 <div className="w-24 h-24 bg-slate-200 rounded-full mb-4 overflow-hidden ring-4 ring-white group-hover:scale-105 transition-transform shadow-inner">
                   <img src={`/img/concejal_${i+1}.jpg`} onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover" alt="Foto"/>
                   <User className="w-full h-full p-6 text-slate-300" />
                 </div>
                 <p className="text-sm font-black text-slate-800 uppercase leading-tight">{name}</p>
                 <span className="text-[10px] text-red-500 font-bold mt-2 bg-red-50 px-3 py-1 rounded-full">Concejal</span>
               </div>
            ))}
            </div>
        </div>
      }
      content={
        <>
          <p className="mb-8 text-xl">La administración comunal no la ejerce sola la Alcaldesa. Existe un <strong>Concejo Municipal</strong>, un órgano colegiado compuesto por <strong>10 concejales</strong> electos por votación popular.</p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-10 rounded-[2rem] mb-10">
             <h4 className="font-bold text-yellow-900 text-2xl mb-6 flex items-center gap-3"><Shield className="text-yellow-600" size={32}/> ¿Qué hacen los concejales?</h4>
             <ul className="space-y-6">
               <li className="flex gap-4 items-start">
                 <div className="bg-yellow-200 p-1 rounded-full mt-1"><CheckCircle size={20} className="text-yellow-700"/></div>
                 <div><strong className="text-lg text-yellow-900 block">Normar</strong>Aprueban las ordenanzas que rigen la comuna (aseo, ruidos, tránsito).</div>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="bg-yellow-200 p-1 rounded-full mt-1"><CheckCircle size={20} className="text-yellow-700"/></div>
                 <div><strong className="text-lg text-yellow-900 block">Fiscalizar</strong>Revisan que el presupuesto municipal se gaste de forma correcta y legal.</div>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="bg-yellow-200 p-1 rounded-full mt-1"><CheckCircle size={20} className="text-yellow-700"/></div>
                 <div><strong className="text-lg text-yellow-900 block">Resolver</strong>Aprueban materias claves como el Plan Regulador, licitaciones grandes y patentes.</div>
               </li>
             </ul>
          </div>
          
          <p className="text-lg font-bold text-slate-800">Es muy probable que en tu labor debas presentar proyectos o informes ante alguna de las Comisiones del Concejo.</p>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Nuestra Estructura" 
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-8 rounded-[2rem]"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1200/png?text=Mapa+Estructural'} className="max-h-full max-w-full object-contain drop-shadow-2xl" /></div>}
      content={
        <>
          <p className="mb-8 text-xl">Somos una institución grande y compleja. Entender el organigrama es vital para saber a quién acudir y respetar los conductos regulares.</p>
          
          <h4 className="font-bold text-slate-900 text-2xl mb-6">Direcciones Clave que debes conocer:</h4>
          
          <div className="grid gap-6">
             <div className="flex items-start gap-6 p-6 bg-white border border-slate-100 shadow-lg rounded-3xl hover:border-red-200 transition-colors group">
                <div className="bg-red-100 p-4 rounded-2xl text-red-600 shrink-0 group-hover:scale-110 transition-transform"><Heart size={32}/></div>
                <div><h4 className="font-bold text-slate-900 text-xl">DIDECO (Desarrollo Comunitario)</h4><p className="text-base text-slate-500 mt-2">El "corazón social". Gestiona ayudas sociales, organizaciones comunitarias, subsidios y programas para el adulto mayor.</p></div>
             </div>
             
             <div className="flex items-start gap-6 p-6 bg-white border border-slate-100 shadow-lg rounded-3xl hover:border-blue-200 transition-colors group">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0 group-hover:scale-110 transition-transform"><Building2 size={32}/></div>
                <div><h4 className="font-bold text-slate-900 text-xl">DOM (Obras Municipales)</h4><p className="text-base text-slate-500 mt-2">El brazo técnico. Otorga permisos de edificación, recepciones finales y fiscaliza construcciones en la comuna.</p></div>
             </div>
             
             <div className="flex items-start gap-6 p-6 bg-white border border-slate-100 shadow-lg rounded-3xl hover:border-green-200 transition-colors group">
                <div className="bg-green-100 p-4 rounded-2xl text-green-600 shrink-0 group-hover:scale-110 transition-transform"><Map size={32}/></div>
                <div><h4 className="font-bold text-slate-900 text-xl">SECPLAN (Planificación)</h4><p className="text-base text-slate-500 mt-2">El "cerebro". Diseña los proyectos de inversión (plazas, pavimentos, estadios) y postula a financiamiento externo.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Mapa de Públicos" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden rounded-[2rem]">
           <div className="absolute w-[600px] h-[600px] border border-slate-700 rounded-full animate-spin-slow opacity-30"></div>
           <div className="z-20 bg-white text-slate-900 w-32 h-32 rounded-full flex items-center justify-center font-black text-2xl shadow-[0_0_50px_white] animate-pulse">IMLS</div>
           <div className="absolute top-[15%] left-[20%] bg-blue-500/10 backdrop-blur-md p-4 rounded-2xl border border-blue-500/50 flex flex-col items-center gap-2"><User className="text-blue-400" size={32}/><span className="text-sm font-bold text-blue-200 uppercase">Vecinos</span></div>
           <div className="absolute bottom-[20%] right-[15%] bg-green-500/10 backdrop-blur-md p-4 rounded-2xl border border-green-500/50 flex flex-col items-center gap-2"><Briefcase className="text-green-400" size={32}/><span className="text-sm font-bold text-green-200 uppercase">Empresas</span></div>
           <div className="absolute top-[20%] right-[20%] bg-purple-500/10 backdrop-blur-md p-4 rounded-2xl border border-purple-500/50 flex flex-col items-center gap-2"><Building2 className="text-purple-400" size={32}/><span className="text-sm font-bold text-purple-200 uppercase">Gobierno</span></div>
        </div>
      }
      content={
        <>
          <p className="text-2xl mb-8 font-light">No somos una isla. El municipio es un organismo vivo que interactúa 24/7 con su entorno.</p>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-2 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-black text-slate-900 text-2xl mb-2">1. El Vecino (Nuestro Centro)</h4>
                <p className="text-slate-600 text-lg">Es la razón de ser del municipio. Todo proceso debe pensarse para facilitarle la vida, desde que nace hasta que requiere un servicio social.</p>
              </div>
            </div>

            <div className="flex gap-6">
               <div className="w-2 bg-green-500 rounded-full"></div>
               <div>
                 <h4 className="font-black text-slate-900 text-2xl mb-2">2. Proveedores y Privados</h4>
                 <p className="text-slate-600 text-lg">Socios estratégicos. Sin ellos no podríamos construir obras, retirar la basura o mantener las áreas verdes.</p>
               </div>
            </div>

            <div className="flex gap-6">
               <div className="w-2 bg-purple-500 rounded-full"></div>
               <div>
                 <h4 className="font-black text-slate-900 text-2xl mb-2">3. Otras Instituciones</h4>
                 <p className="text-slate-600 text-lg">Carabineros, Bomberos, Gobierno Regional. La coordinación con ellos es vital para emergencias y grandes proyectos.</p>
               </div>
            </div>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Somos un Solo Equipo" visual={<div className="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-green-100 rounded-[2rem]"><DollarSign size={200} className="text-green-600/50 drop-shadow-2xl" /></div>} 
      content={
        <>
          <p className="mb-8 text-2xl font-light">En el municipio conviven distintas modalidades contractuales, pero quiero que sepas algo: <strong>todos somos compañeros de trabajo</strong> con la misma camiseta.</p>
          
          <div className="grid gap-6">
             <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-green-300 transition-colors">
               <div className="flex justify-between mb-4 items-center">
                 <strong className="text-slate-900 font-black uppercase tracking-wide text-lg">Planta y Contrata</strong>
                 <span className="text-xs bg-green-100 text-green-800 px-4 py-1.5 rounded-full font-bold">Estatuto Administrativo</span>
               </div>
               <p className="text-slate-600 text-lg">Son funcionarios públicos. Su sueldo se paga religiosamente el <strong>penúltimo día hábil del mes</strong>.</p>
             </div>
             
             <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-blue-300 transition-colors">
               <div className="flex justify-between mb-4 items-center">
                 <strong className="text-slate-900 font-black uppercase tracking-wide text-lg">Honorarios</strong>
                 <span className="text-xs bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-bold">Código Civil</span>
               </div>
               <p className="text-slate-600 text-lg">Prestadores de servicios. La fecha de pago es variable (generalmente primeros días del mes siguiente) y depende de la entrega oportuna del <strong>Informe de Actividades</strong>.</p>
             </div>
          </div>
          
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border-l-8 border-slate-300">
             <p className="text-lg italic text-slate-500 font-serif">"La calidad jurídica no define tu valor como persona ni tu aporte a la ciudad. El respeto es transversal."</p>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad y Respeto" visual={<div className="flex items-center justify-center h-full bg-pink-50 rounded-[2rem]"><Heart size={200} className="text-pink-400/50 animate-pulse" /></div>} 
      content={
        <>
          <p className="mb-8 text-2xl font-light">La entrada en vigencia de la <strong>Ley N° 21.643</strong> marca un antes y un después. Establece un nuevo estándar de dignidad en el trabajo.</p>
          
          <h4 className="font-black text-slate-900 text-2xl mb-6">Tolerancia Cero con:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-pink-50 p-6 rounded-3xl text-center border border-pink-100 hover:scale-105 transition-transform shadow-sm">
               <span className="text-5xl block mb-4">🚫</span>
               <p className="font-bold text-pink-900 text-lg">Acoso Laboral</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl text-center border border-pink-100 hover:scale-105 transition-transform shadow-sm">
               <span className="text-5xl block mb-4">✋</span>
               <p className="font-bold text-pink-900 text-lg">Acoso Sexual</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl text-center border border-pink-100 hover:scale-105 transition-transform shadow-sm">
               <span className="text-5xl block mb-4">🗣️</span>
               <p className="font-bold text-pink-900 text-lg">Violencia</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h5 className="font-black text-slate-900 text-xl mb-3">¿Qué cambia?</h5>
            <p className="text-slate-600 text-lg">Ya no necesitas demostrar que el acoso fue "reiterado". <strong>Un solo acto grave es suficiente</strong> para denunciar. El municipio cuenta con protocolos estrictos y confidenciales para protegerte.</p>
          </div>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad Laboral" subtitle="Tu vida es primero" visual={<div className="flex items-center justify-center h-full bg-yellow-50 rounded-[2rem]"><Shield size={200} className="text-yellow-500/50" /></div>} 
      content={
        <>
          <p className="mb-8 text-2xl font-light">Trabajar seguros es responsabilidad de todos. Aquí tienes las reglas de oro que pueden salvarte la vida.</p>
          
          <div className="space-y-8">
             <div className="flex gap-6 items-start">
               <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0"><MapPin size={32}/></div>
               <div>
                 <h4 className="font-black text-slate-900 text-2xl mb-2">Zona de Tsunamis</h4>
                 <p className="text-slate-600 text-lg">La Serena es costera. Ante un sismo fuerte que te impida mantenerte en pie, evacúa inmediatamente hacia la <strong>Cota 30</strong> (Desde Av. Cisternas hacia arriba).</p>
               </div>
             </div>

             <div className="flex gap-6 items-start">
               <div className="bg-red-100 p-4 rounded-2xl text-red-600 shrink-0"><AlertCircle size={32}/></div>
               <div>
                 <h4 className="font-black text-slate-900 text-2xl mb-2">Accidentes Laborales</h4>
                 <p className="text-slate-600 text-lg mb-4">Si te lesionas trabajando o en el trayecto directo casa-trabajo:</p>
                 <div className="bg-red-50 p-6 rounded-2xl text-lg font-bold text-red-800 border border-red-100">
                    <ol className="list-decimal ml-6 space-y-2">
                      <li>AVISAR INMEDIATAMENTE a tu jefatura.</li>
                      <li>Acudir a la ACHS.</li>
                      <li>No irse a casa sin registro (pierdes la cobertura).</li>
                    </ol>
                 </div>
               </div>
             </div>
          </div>
        </>
      } 
    />;
    
    // 9. QUIZ
    case 9: return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden relative overflow-hidden">
        <div className="absolute top-0 w-full h-2 bg-slate-800"><div className="bg-green-500 h-full transition-all duration-300" style={{width: `${((quizIndex+1)/QUESTIONS.length)*100}%`}}></div></div>
        
        <div className="max-w-2xl w-full relative z-10 pb-10 overflow-y-auto max-h-screen">
          {!quizFinished ? (
            <div className="bg-white text-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-8">
                 <span className="bg-slate-100 px-3 py-1 rounded-full">Evaluación Interactiva</span>
                 <span>{quizIndex+1} / {QUESTIONS.length}</span>
               </div>
               
               <h3 className="text-2xl md:text-3xl font-black mb-10 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="space-y-4">
                 {QUESTIONS[quizIndex].options.map((opt, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => handleAnswer(idx)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-5 rounded-2xl border-2 font-bold text-lg transition-all flex justify-between items-center group shadow-sm
                       ${quizState === 'waiting' ? 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.01]' : ''}
                       ${quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200' : ''}
                       ${quizState === 'wrong' && idx !== QUESTIONS[quizIndex].ans ? 'opacity-40 grayscale' : ''}
                       ${quizState === 'wrong' && idx === parseInt(String(QUESTIONS[quizIndex].options.indexOf(opt))) ? 'border-red-500 bg-red-50 text-red-700' : ''} 
                     `}
                   >
                     {opt}
                     {quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans && <CheckCircle className="text-green-600" size={24}/>}
                   </button>
                 ))}
               </div>

               {quizState !== 'waiting' && (
                 <div className={`mt-8 p-6 rounded-2xl ${quizState === 'correct' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'} animate-in slide-in-from-bottom-4 shadow-inner`}>
                    <p className="font-black text-lg mb-2 flex items-center gap-2">
                      {quizState === 'correct' ? <><CheckCircle size={24}/> ¡Excelente!</> : <><XCircle size={24}/> Corrección:</>}
                    </p>
                    <p className="text-base mb-6 font-medium leading-relaxed">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className={`w-full py-4 rounded-xl font-black text-white text-lg shadow-xl hover:scale-[1.02] transition-transform ${quizState === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                      {quizIndex < QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white text-slate-900 p-10 md:p-16 rounded-[3rem] text-center shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600"></div>
              
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Award size={48} className="text-yellow-600" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">¡Aprobado!</h2>
              <p className="text-slate-500 mb-10 text-xl max-w-md mx-auto">Has demostrado manejar los conceptos claves de nuestra institución.</p>
              
              <div className="bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-100">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Tu Resultado</div>
                <div className="text-6xl font-black text-slate-900">{Math.round((score/QUESTIONS.length)*100)}%</div>
              </div>

              <button onClick={() => setStep(10)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-red-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                <Printer size={20}/> Generar Certificado Oficial
              </button>
            </div>
          )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 max-w-5xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[12px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0 print:m-0 print:p-0">
          
          <div className="w-full flex justify-between items-start mb-4 opacity-90">
             <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Escudo"/>
             <img src="/img/innovacion.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Sello"/>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-1000">
             <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-4 uppercase tracking-wider">CERTIFICADO</h1>
             <p className="text-xl md:text-2xl text-slate-500 italic mb-8 font-serif">De Aprobación de Inducción Corporativa</p>
             
             <p className="text-lg text-slate-600 mb-2 font-bold uppercase tracking-widest text-[10px]">Otorgado a:</p>
             <div className="border-b-2 border-slate-900 pb-2 mb-4 w-full max-w-3xl">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">{userData.nombres} {userData.apellidos}</h2>
             </div>
             <div className="flex gap-4 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest mb-10">
               <span>RUT: {userData.rut}</span> • <span>{userData.cargo}</span> • <span>{userData.dept}</span>
             </div>
             
             <p className="text-lg text-slate-600 mb-3">Por haber completado con distinción el programa de</p>
             <h3 className="text-3xl md:text-4xl font-black text-red-600 uppercase tracking-widest mb-4">Inducción Municipal 2026</h3>
          </div>
          
          <div className="flex justify-between w-full px-4 md:px-20 mt-12 items-end gap-8">
            <div className="text-center flex-1">
              <div className="h-16 border-b border-slate-400 mb-2 relative">
                 <img src="/img/firma_personas.png" className="absolute bottom-0 left-1/2 -translate-x-1/2 max-h-full opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/>
              </div>
              <p className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">Director Gestión de Personas</p>
            </div>
            
            <div className="text-center mb-2 flex-1 opacity-70">
               <div className="flex items-center justify-center gap-2 text-slate-900 font-bold text-sm bg-slate-100 rounded-full px-4 py-2 inline-block mb-2">
                 <Clock size={14}/> {currentTime.toLocaleTimeString()}
               </div>
               <p className="font-bold text-slate-900 text-sm">{currentTime.toLocaleDateString()}</p>
            </div>

            <div className="text-center flex-1">
               <div className="h-16 border-b border-slate-400 mb-2 relative">
                  <img src="/img/firma_alcaldesa.png" className="absolute bottom-0 left-1/2 -translate-x-1/2 max-h-full opacity-80" onError={(e)=>e.currentTarget.style.display='none'}/>
               </div>
               <p className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">Alcaldesa</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex gap-3 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2">
             <Printer size={20}/> Descargar
           </button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             Siguiente <ArrowRight size={20}/>
           </button>
        </div>
      </div>
    );

    // 11. COMUNIDAD (FINAL)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center text-white font-sans">
        <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
        
        <div className="relative z-10 max-w-4xl w-full bg-white/5 backdrop-blur-2xl p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-700">
           <Smartphone size={60} className="mx-auto mb-6 text-cyan-400" />
           <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">¡Sigue Conectado!</h2>
           <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">La inducción termina, pero tu vida funcionaria recién comienza. Únete a nuestra comunidad digital.</p>
           
           <div className="bg-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl text-slate-900">
              <div className="bg-slate-900 p-6 rounded-3xl shrink-0 shadow-inner">
                <QrCode size={120} className="text-white"/>
              </div>
              <div className="text-left flex-1 space-y-4">
                 <div>
                   <h3 className="font-black text-2xl md:text-3xl mb-1">Escanea el código QR</h3>
                   <p className="text-slate-500 font-medium">Únete al portal oficial RDMLS.</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Radio Digital</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Tours 3D</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Serenito Virtual</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Feedback</div>
                 </div>

                 <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-red-700 w-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30">
                   IR AL PORTAL AHORA <ArrowRight size={16}/>
                 </button>
              </div>
           </div>
           
           <button onClick={() => setStep(0)} className="mt-10 text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors px-6 py-3 hover:bg-white/5 rounded-full uppercase tracking-widest font-bold">
             <RefreshCw size={14}/> Cerrar Sesión Segura
           </button>
        </div>
        <Footer />
      </div>
    );

    default: return null;
  }
}
