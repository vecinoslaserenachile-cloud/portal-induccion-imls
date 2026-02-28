import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Star, Radio, MessageCircle
} from 'lucide-react';

// --- DATOS ---
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
  { q: "¿Cuándo se paga a Planta y Contrata?", options: ["Día 5", "Penúltimo día hábil", "Día 15"], ans: 1, explanation: "El pago es mensual y fijo el penúltimo día hábil." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Cuál es un valor intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base de nuestra función." },
  { q: "¿Qué dirección ve los proyectos?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN diseña los proyectos comunales." },
  { q: "¿Qué debo hacer al terminar?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a RDMLS." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTES AUXILIARES ---

// Reproductor de Video Seguro (Evita bloqueos de autoplay)
const SafeVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl animate-in fade-in">
        <iframe 
          className="w-full h-full" 
          src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0" 
          title="Mensaje Alcaldesa" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative cursor-pointer group rounded-3xl overflow-hidden shadow-2xl bg-slate-900"
      onClick={() => setIsPlaying(true)}
    >
      <img 
        src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
        alt="Portada"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Play size={40} fill="white" className="text-white ml-2" />
        </div>
        <p className="mt-4 text-white font-black text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          Ver Mensaje Oficial
        </p>
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
  const totalSteps = 12; // 0 a 11

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // NAVEGACIÓN MANUAL (INDISPENSABLE)
  const goNext = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep(s => Math.max(0, s - 1));

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

  // --- LAYOUT MAESTRO (DISEÑO PREMIUM PERO ESTABLE) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      
      {/* Fondo Decorativo Estático (Evita crasheos de animaciones) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL (Izquierda PC / Arriba Móvil) */}
      <div className="lg:w-1/2 w-full lg:h-full h-[40vh] p-4 lg:p-12 flex items-center justify-center relative z-10">
         <div className="w-full h-full relative">
           {visual}
         </div>
      </div>

      {/* CONTENIDO (Derecha PC / Abajo Móvil) */}
      <div className="lg:w-1/2 w-full flex flex-col h-[60vh] lg:h-full relative z-20 bg-white/80 backdrop-blur-xl border-l border-white/50 shadow-2xl">
        
        {/* Header */}
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Paso {step}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-none mb-2">{title}</h2>
          <h3 className="text-lg lg:text-xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        {/* Contenido Scrollable */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 scroll-smooth">
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-light">
            {content}
            <div className="h-24"></div> {/* Espacio para el footer */}
          </div>
        </div>

        {/* Footer de Navegación Fijo */}
        <div className="px-8 lg:px-16 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 z-30">
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
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center p-8 gap-12">
        <div className="text-center md:text-left space-y-4 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 mx-auto md:mx-0 drop-shadow-2xl" alt="Escudo" />
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">INDUCCIÓN<br/><span className="text-red-500">MUNICIPAL</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
        </div>
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-2xl flex-1">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><User className="text-red-500"/> Registro Funcionario</h3>
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="RUT" onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d} className="text-black">{d}</option>)}
            </select>
            <input className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-600 font-bold text-white text-sm focus:border-red-500 outline-none" placeholder="Cargo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.nombres} onClick={goNext} className="w-full bg-red-600 text-white p-4 rounded-xl font-black tracking-wide hover:bg-red-700 transition-all shadow-lg flex justify-center gap-2 mt-4 items-center disabled:opacity-50">
              INICIAR <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={<SafeVideoPlayer />} // VIDEO SEGURO
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-8 rounded-3xl">
           <div className="space-y-6 w-full max-w-sm">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                 <h4 className="font-black text-2xl text-yellow-400 mb-2">MISIÓN</h4>
                 <p className="text-slate-200">Mejorar la calidad de vida con gestión participativa.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                 <h4 className="font-black text-2xl text-red-400 mb-2">VISIÓN</h4>
                 <p className="text-slate-200">Líderes en desarrollo sostenible y patrimonio.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-8">Nuestros Valores:</p>
          <div className="space-y-4">
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-black text-xl shrink-0">1</div>
               <div><h4 className="font-bold text-slate-900">Probidad</h4><p className="text-slate-600">Rectitud intachable.</p></div>
             </div>
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl shrink-0">2</div>
               <div><h4 className="font-bold text-slate-900">Cercanía</h4><p className="text-slate-600">Empatía total.</p></div>
             </div>
             <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-black text-xl shrink-0">3</div>
               <div><h4 className="font-bold text-slate-900">Transparencia</h4><p className="text-slate-600">Actos públicos.</p></div>
             </div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={
        <div className="h-full w-full bg-slate-100 p-6 overflow-y-auto rounded-3xl">
            <div className="grid grid-cols-2 gap-3">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-3 rounded-xl shadow-sm text-center border border-slate-200">
                 <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center">
                   <User className="text-slate-400" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-900 uppercase">{name}</p>
                 <span className="text-[9px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full mt-1 inline-block">Concejal</span>
               </div>
            ))}
            </div>
        </div>
      }
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
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-4 rounded-3xl"><img src="/img/organigrama_full.png" className="max-h-full max-w-full object-contain drop-shadow-xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Mapa+Estructural'}/></div>}
      content={
        <>
          <p className="mb-6 text-xl font-light">Direcciones clave para la gestión:</p>
          <div className="space-y-4">
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 hover:border-red-200 transition-colors flex gap-4">
               <div className="bg-red-100 p-3 rounded-xl text-red-600 h-fit"><Heart/></div>
               <div><h4 className="font-bold text-slate-900 text-lg">DIDECO</h4><p className="text-slate-500">Corazón social. Ayudas y organizaciones.</p></div>
             </div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors flex gap-4">
               <div className="bg-blue-100 p-3 rounded-xl text-blue-600 h-fit"><Building2/></div>
               <div><h4 className="font-bold text-slate-900 text-lg">DOM (Obras)</h4><p className="text-slate-500">Permisos de edificación y urbanismo.</p></div>
             </div>
             <div className="p-5 bg-white shadow-sm rounded-2xl border border-slate-100 hover:border-green-200 transition-colors flex gap-4">
               <div className="bg-green-100 p-3 rounded-xl text-green-600 h-fit"><Map/></div>
               <div><h4 className="font-bold text-slate-900 text-lg">SECPLAN</h4><p className="text-slate-500">Diseño de proyectos de inversión.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white rounded-3xl p-6 relative overflow-hidden">
           <div className="absolute w-[500px] h-[500px] bg-slate-800 rounded-full blur-3xl opacity-50"></div>
           <div className="bg-white text-slate-900 font-black p-6 rounded-full mb-8 text-2xl shadow-[0_0_30px_white] relative z-10">IMLS</div>
           <div className="grid grid-cols-2 gap-4 text-center text-sm w-full relative z-10">
             <div className="bg-blue-600/30 border border-blue-500/50 p-4 rounded-2xl backdrop-blur-sm"><User className="mx-auto mb-2 text-blue-400"/>Vecinos</div>
             <div className="bg-green-600/30 border border-green-500/50 p-4 rounded-2xl backdrop-blur-sm"><Briefcase className="mx-auto mb-2 text-green-400"/>Empresas</div>
             <div className="bg-purple-600/30 border border-purple-500/50 p-4 rounded-2xl backdrop-blur-sm"><Shield className="mx-auto mb-2 text-purple-400"/>Gobierno</div>
             <div className="bg-orange-600/30 border border-orange-500/50 p-4 rounded-2xl backdrop-blur-sm"><Map className="mx-auto mb-2 text-orange-400"/>Turistas</div>
           </div>
        </div>
      }
      content={
        <>
          <p className="mb-6 text-xl">Interactuamos 24/7 con nuestro entorno:</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
               <div className="text-blue-600"><User size={24}/></div>
               <div><strong className="text-lg block text-slate-900">Vecinos</strong>El centro de nuestra gestión.</div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-green-500">
               <div className="text-green-600"><Briefcase size={24}/></div>
               <div><strong className="text-lg block text-slate-900">Privados</strong>Socios estratégicos.</div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-purple-500">
               <div className="text-purple-600"><Shield size={24}/></div>
               <div><strong className="text-lg block text-slate-900">Instituciones</strong>Coordinación vital.</div>
            </div>
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
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50 rounded-3xl"><Heart size={150} className="text-pink-500/50 animate-pulse"/></div>}
      content={
        <>
          <p className="mb-6 text-xl"><strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-1 gap-3 mb-6">
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Acoso Laboral</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Acoso Sexual</div>
             <div className="bg-pink-50 p-5 rounded-2xl font-bold text-pink-900 flex gap-4 items-center text-lg border border-pink-100"><Shield/> Violencia</div>
          </div>
          <p className="text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">"Un solo acto grave es suficiente para denunciar."</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50 rounded-3xl"><Shield size={150} className="text-yellow-500/50"/></div>}
      content={
        <>
          <div className="space-y-8">
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><Map className="text-blue-500"/> Zona de Tsunamis</h4>
               <p className="text-lg text-slate-600">Evacuar siempre a la <strong>Cota 30</strong> (Av. Cisternas hacia arriba).</p>
             </div>
             <div>
               <h4 className="font-black text-2xl mb-4 flex items-center gap-2 text-slate-900"><AlertCircle className="text-red-500"/> Accidentes</h4>
               <div className="bg-red-50 p-6 rounded-3xl text-red-900 font-bold text-lg border border-red-100">
                 <ol className="list-decimal ml-6 space-y-2">
                   <li>AVISAR A JEFATURA.</li>
                   <li>IR A LA ACHS.</li>
                   <li>REGISTRO OBLIGATORIO.</li>
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
           {/* Barra Progreso Quiz */}
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
                     {quizState === 'correct' ? <><CheckCircle/> ¡Correcto!</> : <><AlertCircle/> Corrección:</>}
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
           <div className="w-full flex justify-between opacity-60">
             <img src="/img/escudo.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-20 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
           </div>
           
           <div className="flex-1 flex flex-col justify-center">
             <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-4 uppercase tracking-widest">CERTIFICADO</h1>
             <p className="text-2xl italic text-slate-500 mb-8 font-serif">De Aprobación de Inducción Corporativa</p>
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">RUT: {userData.rut} • {userData.cargo}</p>
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
           <button onClick={printCertificate} className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-xl hover:bg-slate-100 transition-colors flex gap-2 items-center"><Printer size={20}/> Descargar</button>
           <button onClick={goNext} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 flex items-center gap-2 transition-colors">Finalizar <ArrowRight/></button>
        </div>
      </div>
    );

    // 11. COMUNIDAD (FINAL)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
         {/* Fondo Animado Final */}
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/30"></div>
         
         <div className="bg-white/10 p-10 md:p-16 rounded-[3rem] backdrop-blur-xl border border-white/10 max-w-4xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Smartphone size={70} className="mx-auto mb-6 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"/>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">¡Sigue Conectado!</h2>
            <p className="text-xl text-slate-300 mb-12 font-light max-w-2xl mx-auto">La inducción termina, pero tu vida funcionaria recién comienza. Únete a nuestra comunidad digital.</p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left bg-black/20 p-8 rounded-3xl border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
                  <QrCode size={140} className="text-slate-900"/>
                  <p className="text-slate-900 font-bold mt-4 text-sm uppercase tracking-wider">Escanear Acceso</p>
               </div>
               <div className="space-y-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4"><Radio className="text-red-500" size={24}/><span className="font-bold text-lg">Radio Digital Municipal</span></div>
                  <div className="flex items-center gap-4"><Map className="text-blue-500" size={24}/><span className="font-bold text-lg">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-4"><MessageCircle className="text-green-500" size={24}/><span className="font-bold text-lg">Chat con Serenito</span></div>
                  
                  <button className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                    Ir al Portal RDMLS <ArrowRight size={18}/>
                  </button>
               </div>
            </div>
            
            <button onClick={() => setStep(0)} className="mt-12 text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm uppercase tracking-widest transition-colors w-full">
              <RefreshCw size={14}/> Cerrar Sesión Segura
            </button>
         </div>
      </div>
    );

    default: return null;
  }
}
