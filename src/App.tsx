import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Star, Radio, MessageCircle
} from 'lucide-react';

// --- DATOS Y CONTENIDO ---
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

// 10 PREGUNTAS CON FEEDBACK
const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "¡Correcto! Todos somos funcionarios públicos al servicio de la comunidad, sin importar el contrato." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión que tomamos." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente que fiscalizan y norman." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar a que pase"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro de la Ley 16.744 (ACHS)." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "No usar uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Cuándo se paga a Planta y Contrata?", options: ["Día 5 del mes", "Penúltimo día hábil", "Día 15"], ans: 1, explanation: "Correcto. El pago es mensual y fijo el penúltimo día hábil." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "La seguridad es primero. Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Cuál es un valor intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa (honestidad y rectitud) es la base de nuestra función." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN es el cerebro técnico que diseña y postula los proyectos comunales." },
  { q: "¿Qué debo hacer al terminar esta inducción?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Te invitamos a sumarte a RDMLS y usar nuestras herramientas digitales." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTE DE VIDEO NETFLIX (SIN BUG) ---
const VideoPlayer = () => {
  const [active, setActive] = useState(false);
  return active ? (
    <div className="w-full h-full bg-black animate-in fade-in duration-500">
      <iframe className="w-full h-full" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0" title="Mensaje" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
    </div>
  ) : (
    <div className="w-full h-full relative cursor-pointer group overflow-hidden" onClick={() => setActive(true)}>
      <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"><Play size={40} fill="white" className="ml-2"/></div>
        <p className="mt-4 font-black uppercase tracking-widest text-xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">Ver Mensaje Alcaldesa</p>
      </div>
    </div>
  );
};

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
  const TOTAL_STEPS = 11; // 0 a 11

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll Reset
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Navegación Segura
  const goNext = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const goBack = () => setStep(prev => Math.max(0, prev - 1));

  // Quiz
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

  // --- LAYOUT PREMIUM (GLOW) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      
      {/* FONDO ANIMADO (GLOW) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-red-400/20 rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
      </div>
      
      {/* VISUAL */}
      <div className="lg:w-1/2 w-full lg:h-full h-[35vh] flex items-center justify-center relative p-0 lg:p-12 z-10">
        <div className="w-full h-full lg:rounded-[2.5rem] overflow-hidden shadow-2xl bg-white relative ring-1 ring-black/5">
           {visual}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="lg:w-1/2 w-full flex flex-col h-[65vh] lg:h-full relative z-20 bg-white/60 backdrop-blur-xl border-l border-white/50">
        <div className="px-8 lg:px-16 pt-10 pb-4 shrink-0 border-b border-slate-100/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30">Paso {step}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-2">{title}</h2>
          <h3 className="text-lg lg:text-2xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8 scroll-smooth">
          <div className="space-y-8 text-lg lg:text-xl text-slate-700 leading-relaxed font-light">
            {content}
            <div className="h-24"></div>
          </div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t border-white/50 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 shadow-2xl z-30">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/50 transition-colors">
             <ChevronLeft size={16}/> Atrás
           </button>
           <button onClick={goNext} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-red-600 hover:shadow-red-500/30 transition-all flex items-center gap-3 text-sm uppercase tracking-wide transform hover:-translate-y-1">
             Siguiente <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );

  // --- PANTALLAS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-slate-900/20"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center p-8 gap-16">
        <div className="text-center md:text-left space-y-8 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-32 mx-auto md:mx-0 drop-shadow-2xl" alt="Escudo" />
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-2 tracking-tighter">INDUCCIÓN<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">MUNICIPAL</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
          </div>
        </div>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/20 shadow-2xl flex-1">
          <div className="space-y-5">
            <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3"><User className="text-red-500"/> Registro Funcionario</h3>
            <div className="grid grid-cols-2 gap-4">
               <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="RUT" onChange={e => setUserData({...userData, rut: e.target.value})} />
            <div className="relative">
              <select className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 font-bold text-white text-sm appearance-none focus:border-red-500 outline-none cursor-pointer" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d} className="text-slate-900">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16}/>
            </div>
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Cargo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
            <button disabled={!userData.nombres || !userData.rut} onClick={goNext} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-5 rounded-xl font-black tracking-wide hover:shadow-lg hover:shadow-red-900/50 flex justify-center gap-3 mt-6 items-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02]">
              INICIAR <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={<VideoPlayer />}
      content={
        <div className="animate-in fade-in duration-700">
           <p className="font-black text-4xl text-slate-900 mb-6">¡Hola, {userData.nombres}!</p>
           <p className="mb-8 text-xl font-light text-slate-600">Te sumas a una institución con historia. La Serena no es solo la segunda ciudad más antigua de Chile; es una capital patrimonial que exige lo mejor de nosotros.</p>
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] opacity-20"></div>
           <div className="space-y-6 w-full max-w-sm relative z-10">
              <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                 <h4 className="font-black text-3xl text-yellow-400 mb-2">MISIÓN</h4>
                 <p className="text-slate-200 text-lg">Mejorar la calidad de vida con gestión participativa.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                 <h4 className="font-black text-3xl text-red-400 mb-2">VISIÓN</h4>
                 <p className="text-slate-200 text-lg">Líderes en desarrollo sostenible y patrimonio.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-10">Nuestros Valores Intransables:</p>
          <div className="space-y-6">
             <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-black text-2xl">1</div>
               <div><h4 className="font-black text-slate-900 text-xl">Probidad</h4><p className="text-slate-600">Rectitud intachable con los recursos.</p></div>
             </div>
             <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl">2</div>
               <div><h4 className="font-black text-slate-900 text-xl">Cercanía</h4><p className="text-slate-600">Empatía total con el vecino.</p></div>
             </div>
             <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-black text-2xl">3</div>
               <div><h4 className="font-black text-slate-900 text-xl">Transparencia</h4><p className="text-slate-600">Información clara y oportuna.</p></div>
             </div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={
        <div className="h-full w-full bg-slate-100 p-8 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-4 rounded-3xl shadow-sm text-center border border-slate-200">
                 <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 overflow-hidden">
                   <img src={`/img/concejal_${i+1}.jpg`} onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover"/>
                   <User className="w-full h-full p-4 text-slate-300" />
                 </div>
                 <p className="text-xs font-black text-slate-900 uppercase">{name}</p>
                 <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full mt-2 inline-block">Concejal</span>
               </div>
            ))}
            </div>
        </div>
      }
      content={
        <>
          <p className="mb-8 text-xl font-light">El <strong>Concejo Municipal</strong> tiene 10 integrantes electos.</p>
          <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-[2rem]">
             <h4 className="font-black text-yellow-900 text-xl mb-6">Funciones Clave:</h4>
             <ul className="space-y-4">
               <li className="flex gap-4 items-center"><CheckCircle size={24} className="text-yellow-700"/> <span className="text-lg text-yellow-900"><strong>Normar:</strong> Ordenanzas comunales.</span></li>
               <li className="flex gap-4 items-center"><CheckCircle size={24} className="text-yellow-700"/> <span className="text-lg text-yellow-900"><strong>Fiscalizar:</strong> Presupuesto.</span></li>
               <li className="flex gap-4 items-center"><CheckCircle size={24} className="text-yellow-700"/> <span className="text-lg text-yellow-900"><strong>Resolver:</strong> Licitaciones.</span></li>
             </ul>
          </div>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura" 
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-8"><img src="/img/organigrama_full.png" className="max-h-full max-w-full object-contain drop-shadow-xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Mapa+Estructural'}/></div>}
      content={
        <>
          <p className="mb-8 text-xl font-light">Estructura clave para la gestión:</p>
          <div className="space-y-4">
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 hover:border-red-200 transition-colors">
               <h4 className="font-black text-xl text-slate-900 flex items-center gap-3"><Heart className="text-red-500"/> DIDECO</h4>
               <p className="text-slate-500 mt-2">Corazón social. Gestiona ayudas y organizaciones.</p>
             </div>
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
               <h4 className="font-black text-xl text-slate-900 flex items-center gap-3"><Building2 className="text-blue-500"/> DOM (Obras)</h4>
               <p className="text-slate-500 mt-2">Permisos de edificación y urbanismo.</p>
             </div>
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 hover:border-green-200 transition-colors">
               <h4 className="font-black text-xl text-slate-900 flex items-center gap-3"><Map className="text-green-500"/> SECPLAN</h4>
               <p className="text-slate-500 mt-2">Diseño de proyectos de inversión.</p>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
           <div className="absolute w-[600px] h-[600px] border border-slate-700 rounded-full opacity-20 animate-spin-slow"></div>
           <div className="bg-white text-slate-900 font-black p-6 rounded-full mb-10 text-2xl shadow-[0_0_30px_white] relative z-10">IMLS</div>
           <div className="grid grid-cols-2 gap-6 text-center text-sm w-full relative z-10">
             <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded-2xl backdrop-blur-sm"><User className="mx-auto mb-2 text-blue-400"/>Vecinos</div>
             <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-2xl backdrop-blur-sm"><Briefcase className="mx-auto mb-2 text-green-400"/>Empresas</div>
             <div className="bg-purple-600/20 border border-purple-500/50 p-4 rounded-2xl backdrop-blur-sm"><Shield className="mx-auto mb-2 text-purple-400"/>Gobierno</div>
             <div className="bg-orange-600/20 border border-orange-500/50 p-4 rounded-2xl backdrop-blur-sm"><Map className="mx-auto mb-2 text-orange-400"/>Turistas</div>
           </div>
        </div>
      }
      content={
        <>
          <p className="mb-8 text-xl font-light">Interactuamos 24/7 con nuestro entorno:</p>
          <div className="space-y-6">
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
               <div className="bg-blue-100 p-3 rounded-full text-blue-600"><User/></div>
               <div><strong className="text-lg block">Vecinos</strong>El centro de nuestra gestión.</div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
               <div className="bg-green-100 p-3 rounded-full text-green-600"><Briefcase/></div>
               <div><strong className="text-lg block">Privados</strong>Socios estratégicos para obras.</div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
               <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Shield/></div>
               <div><strong className="text-lg block">Instituciones</strong>Coordinación vital para emergencias.</div>
            </div>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Solo Equipo" 
      visual={<div className="w-full h-full flex items-center justify-center bg-green-50"><DollarSign size={150} className="text-green-600/50"/></div>}
      content={
        <>
          <p className="mb-8 text-xl">Todos somos compañeros, con distintas modalidades:</p>
          <div className="space-y-6">
             <div className="p-6 border border-green-200 bg-green-50/50 rounded-3xl">
               <strong className="block text-xl text-green-900 mb-2">Planta y Contrata</strong>
               <span className="text-green-700">Pago: <strong>Penúltimo día hábil del mes</strong>.</span>
             </div>
             <div className="p-6 border border-blue-200 bg-blue-50/50 rounded-3xl">
               <strong className="block text-xl text-blue-900 mb-2">Honorarios</strong>
               <span className="text-blue-700">Pago: Variable (requiere informe).</span>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad" 
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50"><Heart size={150} className="text-pink-500/50 animate-pulse"/></div>}
      content={
        <>
          <p className="mb-8 text-xl"><strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-1 gap-4 mb-8">
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg"><Shield/> Acoso Laboral</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg"><Shield/> Acoso Sexual</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg"><Shield/> Violencia</div>
          </div>
          <div className="bg-white border-l-4 border-pink-500 p-6 shadow-sm">
            <p className="text-slate-600 italic">"Un solo acto grave es suficiente para denunciar."</p>
          </div>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50"><Shield size={150} className="text-yellow-500/50"/></div>}
      content={
        <>
          <div className="space-y-8">
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2"><MapPin className="text-blue-500"/> Zona de Tsunamis</h4>
               <p className="text-lg">Evacuar siempre a la <strong>Cota 30</strong> (Av. Cisternas).</p>
             </div>
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2"><AlertCircle className="text-red-500"/> Accidentes</h4>
               <div className="bg-red-50 p-6 rounded-3xl text-red-900 font-bold text-lg border border-red-100">
                 1. AVISAR A JEFATURA.<br/>
                 2. IR A LA ACHS.<br/>
                 3. REGISTRO OBLIGATORIO.
               </div>
             </div>
          </div>
        </>
      } 
    />;

    // 9. QUIZ (10 PREGUNTAS)
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
                   <p className="font-bold mb-2 flex items-center gap-2">
                     {quizState === 'correct' ? <><CheckCircle/> ¡Correcto!</> : <><AlertCircle/> Corrección:</>}
                   </p>
                   <p className="mb-4 text-sm">{QUESTIONS[quizIndex].explanation}</p>
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
           <div className="w-full flex justify-between opacity-60">
             <img src="/img/escudo.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
           </div>
           
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-4 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-2xl italic text-slate-500 mb-8 font-serif">De Aprobación de Inducción Corporativa</p>
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">RUT: {userData.rut}</p>
             <div className="h-1 w-32 bg-red-600 mx-auto rounded-full mb-8"></div>
             <p className="text-xl text-slate-600">Ha completado exitosamente la Inducción 2026.</p>
           </div>

           <div className="flex justify-between w-full px-8 mt-12 text-xs font-bold uppercase text-slate-400 tracking-widest">
             <div>Gestión de Personas</div>
             <div>{currentTime.toLocaleDateString()}</div>
             <div>Alcaldía</div>
           </div>
        </div>
        
        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100"><Printer/></button>
           <button onClick={goNext} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 flex items-center gap-2">Finalizar <ArrowRight/></button>
        </div>
      </div>
    );

    // 11. COMUNIDAD (FINAL)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/20"></div>
         
         <div className="bg-white/10 p-10 md:p-16 rounded-[3rem] backdrop-blur-xl border border-white/10 max-w-4xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Smartphone size={60} className="mx-auto mb-6 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"/>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">¡Sigue Conectado!</h2>
            <p className="text-xl text-slate-300 mb-12 font-light">La inducción termina, pero tu vida funcionaria recién comienza. Únete a nuestra comunidad digital.</p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left bg-black/20 p-8 rounded-3xl border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
                  <QrCode size={140} className="text-slate-900"/>
                  <p className="text-slate-900 font-bold mt-4 text-sm uppercase tracking-wider">Escanear Acceso</p>
               </div>
               <div className="space-y-4 flex flex-col justify-center">
                  <div className="flex items-center gap-3"><Radio className="text-red-500"/><span className="font-bold text-lg">Radio Digital Municipal</span></div>
                  <div className="flex items-center gap-3"><Map className="text-blue-500"/><span className="font-bold text-lg">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-3"><MessageCircle className="text-green-500"/><span className="font-bold text-lg">Chat con Serenito</span></div>
                  
                  <button className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20">
                    Ir al Portal RDMLS
                  </button>
               </div>
            </div>
            
            <button onClick={() => setStep(0)} className="mt-12 text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm uppercase tracking-widest transition-colors w-full">
              <RefreshCw size={14}/> Cerrar Sesión Segura
            </button>
         </div>
         <div className="absolute bottom-6 text-slate-600 text-xs font-bold uppercase tracking-widest">IMLS Inducción 2026 • Innovación Digital</div>
      </div>
    );

    default: return null;
  }
}
