import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  PlayCircle, ArrowRight
} from 'lucide-react';

// --- DATOS Y CONSTANTES ---
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
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo jefaturas"], ans: 1, explanation: "¡Correcto! Todos somos funcionarios públicos al servicio de la comunidad." },
  { q: "¿Cuál es el centro de nuestra misión?", options: ["El dinero", "El Vecino y su calidad de vida", "La burocracia"], ans: 1, explanation: "Exacto. El vecino es el corazón de nuestra gestión." },
  { q: "¿Cuántos concejales tiene la comuna?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos que norman y fiscalizan." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Nada"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso laboral, sexual y violencia", "Llegar tarde", "Vestimenta"], ans: 0, explanation: "Tolerancia cero al acoso y violencia en el trabajo." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTES UI (DISEÑO) ---

// Fondo animado sutil
const BackgroundGradient = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
  </div>
);

const Footer = () => (
  <div className="w-full bg-white/80 backdrop-blur-md text-slate-400 text-[10px] uppercase tracking-widest text-center py-4 border-t border-slate-200 print:hidden shrink-0 z-20">
    IMLS Inducción 2026 • Ilustre Municipalidad de La Serena
  </div>
);

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

  // Scroll Check
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      if (isAtBottom || isShort) setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 9, 10, 11].includes(step)) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 800);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Quiz Handlers
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

  // --- LAYOUT MAESTRO (PREMIUM) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden print:hidden font-sans">
      <BackgroundGradient />
      
      {/* Barra Progreso Superior */}
      <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL (Izquierda en Desktop, Arriba en Móvil) */}
      <div className="lg:order-2 hidden lg:flex w-1/2 h-full items-center justify-center relative p-8 z-10">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-white relative group">
           {visual}
           {/* Brillo decorativo */}
           <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* VISUAL MÓVIL */}
      <div className="lg:hidden w-full h-[30vh] bg-slate-100 relative shrink-0 shadow-lg z-20">
         {visual}
      </div>

      {/* CONTENIDO (Derecha en Desktop, Abajo en Móvil) */}
      <div className="lg:order-1 w-full lg:w-1/2 flex flex-col h-[70vh] lg:h-full relative z-20 bg-white/80 backdrop-blur-xl lg:bg-transparent">
        
        <div className="px-6 lg:px-12 pt-8 pb-2 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Módulo {step}</span>
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-2">{title}</h2>
          <h3 className="text-base lg:text-xl text-slate-500 font-medium">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-6 lg:px-12 py-4 space-y-5 text-base lg:text-lg text-slate-600 leading-relaxed">
          {content}
          
          {!canAdvance && (
            <div className="h-20 flex items-center justify-center opacity-70 animate-bounce text-red-500 font-bold text-xs mt-4">
              <ChevronDown className="mr-1"/> Desliza para leer más
            </div>
          )}
          <div className="h-12"></div>
        </div>

        {/* BOTONERA DE NAVEGACIÓN */}
        <div className="px-6 lg:px-12 py-6 border-t border-slate-200/50 bg-white/50 backdrop-blur-md flex items-center justify-between shrink-0 mb-safe">
           
           {/* Botón ATRÁS */}
           <button 
             onClick={() => setStep(s => Math.max(0, s - 1))} 
             className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors px-4 py-2 hover:bg-slate-100 rounded-lg"
           >
             <ChevronLeft size={14}/> Anterior
           </button>

           <div className="flex gap-4 items-center">
             <div className="text-[10px] font-bold uppercase tracking-widest hidden md:block">
               {canAdvance ? <span className="text-green-600 flex items-center gap-1 animate-pulse"><CheckCircle size={14}/> Completo</span> : <span className="text-slate-400">Lectura Pendiente</span>}
             </div>
             
             <button 
               disabled={!canAdvance} 
               onClick={() => setStep(s => s + 1)} 
               className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-600 hover:shadow-red-600/30 hover:-translate-y-1 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:transform-none transition-all flex items-center gap-2 text-sm"
             >
               Siguiente <ArrowRight size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- PASOS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden print:hidden">
      {/* Fondo con Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-slate-900/20"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl h-full flex flex-col md:flex-row items-center justify-center p-6 gap-12">
        {/* Lado Izquierdo: Branding */}
        <div className="text-center md:text-left space-y-6 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 mx-auto md:mx-0 drop-shadow-2xl" alt="Escudo" />
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-2">INDUCCIÓN<br/><span className="text-red-600">MUNICIPAL</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Ilustre Municipalidad de La Serena</p>
          </div>
          <div className="hidden md:block bg-white/5 backdrop-blur-sm p-4 rounded-xl border-l-4 border-red-600">
            <p className="text-slate-300 italic text-sm">"Bienvenidos al equipo que construye el futuro de la segunda ciudad más antigua de Chile."</p>
          </div>
        </div>
        
        {/* Lado Derecho: Formulario Glass */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl flex-1 animate-in slide-in-from-right-10 fade-in duration-700">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><User className="text-red-500"/> Identificación</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-3 rounded-xl bg-white/90 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-3 rounded-xl bg-white/90 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-white/90 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="RUT (12.345.678-9)" onChange={e => setUserData({...userData, rut: e.target.value})} />
            <input className="w-full p-3 rounded-xl bg-white/90 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Cargo / Función" onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <div className="relative">
              <select className="w-full p-3 rounded-xl bg-white/90 font-bold text-slate-900 text-sm appearance-none focus:ring-2 focus:ring-red-500 outline-none" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Departamento...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/>
            </div>
            
            <button disabled={!userData.nombres || !userData.rut || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/50 flex justify-center gap-2 mt-4 items-center disabled:opacity-50 disabled:cursor-not-allowed group">
              COMENZAR <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Alcaldesa Daniela Norambuena" 
      visual={
        <div className="w-full h-full bg-black flex items-center justify-center relative group">
           {/* Video Ajustado Verticalmente */}
           <iframe className="w-full h-full aspect-[9/16] object-cover" src={`https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=0&controls=1&rel=0`} title="Mensaje Alcaldesa" frameBorder="0" allowFullScreen></iframe>
           <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase">Mensaje Oficial</div>
        </div>
      }
      content={
        <div className="animate-in slide-in-from-bottom-5 fade-in duration-500">
           <p className="font-bold text-2xl text-slate-900 mb-4">¡Hola, {userData.nombres}!</p>
           <p className="text-slate-600 mb-4">Te damos la más cordial bienvenida. Hoy te sumas a un equipo comprometido con el desarrollo de la segunda ciudad más antigua de Chile.</p>
           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start shadow-sm">
             <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Lightbulb size={20}/></div>
             <div>
               <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Tu Rol es Importante</h4>
               <p className="text-sm text-blue-700 italic">"Nuestro compromiso es modernizar la gestión para estar más cerca de cada vecino."</p>
             </div>
           </div>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión, Visión y Valores" 
      visual={
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 relative overflow-hidden">
           {/* Decoración Fondo */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-20"></div>
           <div className="grid gap-6 w-full max-w-sm relative z-10">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default">
                 <div className="flex items-center gap-3 mb-1"><MapPin className="text-red-400"/> <h4 className="font-black text-lg">MISIÓN</h4></div>
                 <p className="text-sm text-slate-300">Mejorar la calidad de vida con gestión participativa.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default">
                 <div className="flex items-center gap-3 mb-1"><Award className="text-yellow-400"/> <h4 className="font-black text-lg">VISIÓN</h4></div>
                 <p className="text-sm text-slate-300">Líderes en turismo, patrimonio y desarrollo.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default">
                 <div className="flex items-center gap-3 mb-1"><Heart className="text-pink-400"/> <h4 className="font-black text-lg">VALORES</h4></div>
                 <p className="text-sm text-slate-300">Probidad • Transparencia • Cercanía</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p>Para remar todos hacia el mismo lado, debemos tener clara nuestra Carta de Navegación.</p>
          <div className="space-y-4 mt-4">
             <div className="flex gap-4">
               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold shrink-0">1</div>
               <div><h4 className="font-bold text-slate-900">Probidad</h4><p className="text-sm">Actuamos siempre con rectitud. Los recursos son sagrados.</p></div>
             </div>
             <div className="flex gap-4">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
               <div><h4 className="font-bold text-slate-900">Cercanía</h4><p className="text-sm">Empatizamos con el vecino. No somos burócratas, somos servidores.</p></div>
             </div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización y Normativa" 
      visual={
        <div className="h-full w-full bg-slate-100 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center border border-slate-200">
                 <div className="w-14 h-14 bg-slate-200 rounded-full mb-2 overflow-hidden ring-2 ring-white">
                   <img src={`/img/concejal_${i+1}.jpg`} onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover" alt="Foto"/>
                   <User className="w-full h-full p-3 text-slate-300" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">{name}</p>
               </div>
            ))}
            </div>
        </div>
      }
      content={
        <>
          <p>La administración cuenta con un <strong>Concejo Municipal</strong> de 10 miembros electos.</p>
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl my-4">
             <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><Shield size={16}/> Funciones Clave</h4>
             <ul className="space-y-2 text-sm text-yellow-900">
               <li>• <strong>Normar:</strong> Aprueban ordenanzas comunales.</li>
               <li>• <strong>Fiscalizar:</strong> Revisan el gasto del presupuesto.</li>
               <li>• <strong>Resolver:</strong> Aprueban patentes y licitaciones.</li>
             </ul>
          </div>
          <p>Representan la voz de la ciudadanía y trabajan en comisiones específicas.</p>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura Interna" 
      visual={<div className="flex items-center justify-center h-full bg-white p-6 rounded-3xl"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1000/png?text=Mapa+Estructural'} className="max-h-full object-contain" /></div>}
      content={
        <>
          <p>Somos una institución compleja. Entender el organigrama es vital.</p>
          <div className="grid grid-cols-1 gap-3 mt-4">
             <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                <div className="bg-red-100 p-2 rounded-lg text-red-600"><Heart size={18}/></div>
                <div><h4 className="font-bold text-xs">DIDECO</h4><p className="text-[10px] text-slate-500">Corazón Social y Ayudas</p></div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Building2 size={18}/></div>
                <div><h4 className="font-bold text-xs">DOM (Obras)</h4><p className="text-[10px] text-slate-500">Permisos y Urbanismo</p></div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Map size={18}/></div>
                <div><h4 className="font-bold text-xs">SECPLAN</h4><p className="text-[10px] text-slate-500">Diseño de Proyectos</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Mapa de Públicos" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden rounded-3xl">
           <div className="absolute w-[400px] h-[400px] border border-slate-700 rounded-full animate-spin-slow opacity-30"></div>
           <div className="z-20 bg-white text-slate-900 w-24 h-24 rounded-full flex items-center justify-center font-black shadow-[0_0_30px_white] animate-pulse">IMLS</div>
           
           <div className="absolute top-[20%] left-[20%] bg-blue-500/20 backdrop-blur-md p-2 rounded-xl border border-blue-500/50 text-xs font-bold text-blue-200 w-20 text-center">Vecinos</div>
           <div className="absolute bottom-[20%] right-[20%] bg-green-500/20 backdrop-blur-md p-2 rounded-xl border border-green-500/50 text-xs font-bold text-green-200 w-20 text-center">Empresas</div>
           <div className="absolute top-[20%] right-[20%] bg-purple-500/20 backdrop-blur-md p-2 rounded-xl border border-purple-500/50 text-xs font-bold text-purple-200 w-20 text-center">Gobierno</div>
           <div className="absolute bottom-[20%] left-[20%] bg-orange-500/20 backdrop-blur-md p-2 rounded-xl border border-orange-500/50 text-xs font-bold text-orange-200 w-20 text-center">Turistas</div>
        </div>
      }
      content={
        <>
          <p>No somos una isla. Interactuamos constantemente en un ecosistema vivo.</p>
          <ul className="space-y-4 mt-4">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
              <p><strong>El Vecino (Centro):</strong> Todo gira en torno a él. Desde el nacimiento hasta la asistencia.</p>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
              <p><strong>Proveedores:</strong> Socios estratégicos para obras.</p>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
              <p><strong>Instituciones:</strong> Carabineros, Bomberos, Gobierno.</p>
            </li>
          </ul>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Somos un Solo Equipo" visual={<div className="flex items-center justify-center h-full bg-green-50 rounded-3xl"><DollarSign size={150} className="text-green-600 drop-shadow-lg" /></div>} 
      content={
        <>
          <p>En el municipio conviven distintas modalidades, pero <strong>todos somos compañeros</strong>.</p>
          <div className="space-y-3 mt-4">
             <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
               <div className="flex justify-between mb-1">
                 <strong className="text-slate-900 text-xs uppercase">Planta y Contrata</strong>
                 <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Estatuto Admin.</span>
               </div>
               <p className="text-sm text-slate-500">Pago: <strong>Penúltimo día hábil del mes</strong>.</p>
             </div>
             
             <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
               <div className="flex justify-between mb-1">
                 <strong className="text-slate-900 text-xs uppercase">Honorarios</strong>
                 <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Código Civil</span>
               </div>
               <p className="text-sm text-slate-500">Pago: Variable (requiere informe de actividades).</p>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral" visual={<div className="flex items-center justify-center h-full bg-pink-50 rounded-3xl"><Heart size={150} className="text-pink-500 animate-pulse" /></div>} 
      content={
        <>
          <p>La <strong>Ley N° 21.643</strong> establece un nuevo estándar ético. Tenemos <strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-pink-50 p-3 rounded-lg text-center border border-pink-100">
               <span className="text-2xl">🚫</span>
               <p className="text-xs font-bold text-pink-800 mt-1">Acoso Laboral</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg text-center border border-pink-100">
               <span className="text-2xl">✋</span>
               <p className="text-xs font-bold text-pink-800 mt-1">Acoso Sexual</p>
            </div>
          </div>
          <p className="mt-4 text-sm bg-white p-3 rounded-lg border border-slate-100 shadow-sm">Un solo acto grave basta para denunciar. Tenemos protocolos confidenciales.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" visual={<div className="flex items-center justify-center h-full bg-yellow-50 rounded-3xl"><Shield size={150} className="text-yellow-500" /></div>} 
      content={
        <>
          <p>La Serena es zona de tsunamis. Memoriza: <strong>Cota 30</strong> (Av. Cisternas hacia arriba).</p>
          <h4 className="font-bold text-slate-900 mt-4 mb-2">Protocolo de Accidentes:</h4>
          <ol className="relative border-l border-slate-200 ml-3 space-y-4">
            <li className="pl-4">
               <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-1.5 top-1.5 border border-white"></div>
               <p className="font-bold text-sm">AVISO INMEDIATO</p>
               <p className="text-xs">A tu jefatura directa.</p>
            </li>
            <li className="pl-4">
               <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-1.5 top-1.5 border border-white"></div>
               <p className="font-bold text-sm">ACUDIR A ACHS</p>
               <p className="text-xs">Asociación Chilena de Seguridad.</p>
            </li>
          </ol>
        </>
      } 
    />;
    
    // 9. QUIZ
    case 9: return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden relative overflow-hidden">
        {/* Barra Progreso Quiz */}
        <div className="absolute top-0 w-full h-2 bg-slate-800"><div className="bg-green-500 h-full transition-all duration-300" style={{width: `${((quizIndex+1)/QUESTIONS.length)*100}%`}}></div></div>
        
        <div className="max-w-xl w-full relative z-10 pb-10 overflow-y-auto max-h-screen">
          {!quizFinished ? (
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-6">
                 <span>Evaluación Interactiva</span>
                 <span>{quizIndex+1} / {QUESTIONS.length}</span>
               </div>
               
               <h3 className="text-xl md:text-2xl font-black mb-8 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => handleAnswer(idx)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex justify-between items-center group
                       ${quizState === 'waiting' ? 'border-slate-100 hover:border-slate-300 hover:bg-slate-50' : ''}
                       ${quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans ? 'border-green-500 bg-green-50 text-green-700' : ''}
                       ${quizState === 'wrong' && idx !== QUESTIONS[quizIndex].ans ? 'opacity-40' : ''}
                       ${quizState === 'wrong' && idx === parseInt(String(QUESTIONS[quizIndex].options.indexOf(opt))) ? 'border-red-500 bg-red-50 text-red-700' : ''} 
                     `}
                   >
                     {opt}
                     {quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans && <CheckCircle className="text-green-600"/>}
                   </button>
                 ))}
               </div>

               {/* FEEDBACK */}
               {quizState !== 'waiting' && (
                 <div className={`mt-6 p-4 rounded-xl ${quizState === 'correct' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'} animate-in slide-in-from-bottom-2`}>
                    <p className="font-bold mb-1 flex items-center gap-2">
                      {quizState === 'correct' ? <><CheckCircle size={18}/> ¡Correcto!</> : <><XCircle size={18}/> Repasemos...</>}
                    </p>
                    <p className="text-sm mb-4">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${quizState === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                      {quizIndex < QUESTIONS.length - 1 ? 'Siguiente' : 'Ver Resultados'}
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white text-slate-900 p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={40} className="text-yellow-600" />
              </div>
              <h2 className="text-3xl font-black mb-2">¡Felicitaciones!</h2>
              <p className="text-slate-500 mb-8 font-medium">Has completado tu inducción exitosamente.</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Puntuación Final</div>
                <div className="text-5xl font-black text-slate-900">{Math.round((score/QUESTIONS.length)*100)}%</div>
              </div>

              <button onClick={() => setStep(10)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-red-600 hover:scale-105 transition-all">
                Generar Certificado Oficial
              </button>
            </div>
          )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-12 max-w-5xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[10px] md:border-[20px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0 print:m-0">
          
          <div className="w-full flex justify-between items-start mb-4">
             <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Escudo"/>
             <img src="/img/innovacion.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Sello"/>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-1000">
             <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-2 uppercase tracking-wide">CERTIFICADO</h1>
             <p className="text-lg md:text-xl text-slate-500 italic mb-6">De Aprobación de Inducción Corporativa</p>
             
             <p className="text-base text-slate-600 mb-1">Otorgado a:</p>
             <div className="border-b-2 border-slate-900 pb-2 mb-2 w-full max-w-2xl">
               <h2 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase">{userData.nombres} {userData.apellidos}</h2>
             </div>
             <p className="text-xs md:text-sm text-slate-400 font-bold mb-6">RUT: {userData.rut} • {userData.cargo}</p>
             
             <p className="text-base text-slate-600 mb-2">Por haber completado con distinción el programa de</p>
             <h3 className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-widest mb-4">Inducción Municipal 2026</h3>
          </div>
          
          <div className="flex justify-between w-full px-4 md:px-10 mt-8 items-end gap-4">
            <div className="text-center flex-1">
              <div className="h-12 border-b border-slate-400 mb-1"></div>
              <p className="text-[10px] font-bold uppercase text-slate-600">Gestión de Personas</p>
            </div>
            
            <div className="text-center mb-2 flex-1">
               <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm bg-slate-100 rounded px-2 py-1 inline-block mb-1">
                 <Clock size={12}/> {currentTime.toLocaleTimeString()}
               </div>
               <p className="font-bold text-slate-900 text-sm">{currentTime.toLocaleDateString()}</p>
               <p className="text-[8px] font-bold uppercase text-slate-400">Fecha de Emisión</p>
            </div>

            <div className="text-center flex-1">
               <div className="h-12 border-b border-slate-400 mb-1"></div>
               <p className="text-[10px] font-bold uppercase text-slate-600">Alcaldesa</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex gap-3 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2">
             <Printer size={20}/> Descargar
           </button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-6 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             Siguiente <ArrowRight size={20}/>
           </button>
        </div>
      </div>
    );

    // 11. COMUNIDAD (NUEVO FINAL)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
        
        <div className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
           <Smartphone size={50} className="mx-auto mb-4 text-cyan-400" />
           <h2 className="text-3xl md:text-5xl font-black mb-2">¡Sigue Conectado!</h2>
           <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto">Únete a la comunidad virtual de La Serena a través de RDMLS y nuestros canales digitales.</p>
           
           <div className="bg-white p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-lg">
              <div className="bg-slate-900 p-4 rounded-2xl shrink-0">
                <QrCode size={100} className="text-white"/>
              </div>
              <div className="text-left flex-1">
                 <h3 className="text-slate-900 font-black text-xl mb-1">Escanea el código</h3>
                 <p className="text-slate-500 text-sm mb-4 leading-relaxed">Accede a "Serenito y sus vecinos", radio digital, tours 3D y danos tu opinión sobre esta inducción.</p>
                 <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 w-full md:w-auto transition-colors flex items-center justify-center gap-2">
                   Ir al Portal RDMLS <ArrowRight size={14}/>
                 </button>
              </div>
           </div>
           
           <button onClick={() => setStep(0)} className="mt-8 text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors px-4 py-2 hover:bg-white/5 rounded-full">
             <RefreshCw size={14}/> Cerrar Sesión
           </button>
        </div>
        <Footer />
      </div>
    );

    default: return null;
  }
}
