import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, AlertCircle, Quote, Play, Radio, MessageCircle
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
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios públicos." },
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

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
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

  // Reset scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // NAVEGACIÓN INDESTRUCTIBLE
  const goNext = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // TRUCO: Llenar datos de prueba
  const fillDemoData = () => {
    setUserData({ 
      nombres: 'Rodrigo', 
      apellidos: 'Godoy', 
      rut: '12.345.678-9', 
      dept: 'Alcaldía', 
      cargo: 'Director' 
    });
  };

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

  // --- LAYOUT MAESTRO (TEXTOS GRANDES) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-3 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL */}
      <div className="lg:w-1/2 w-full lg:h-full h-[35vh] bg-slate-100 p-0 lg:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-300 relative z-10">
         <div className="w-full h-full lg:rounded-3xl overflow-hidden shadow-xl bg-white relative">
           {visual}
         </div>
      </div>

      {/* CONTENIDO */}
      <div className="lg:w-1/2 w-full flex flex-col h-[65vh] lg:h-full relative z-20 bg-white shadow-2xl">
        <div className="px-8 lg:px-12 pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase">Paso {step}</span>
            <span className="text-slate-400 text-xs font-bold uppercase">Inducción 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-2">{title}</h2>
          <h3 className="text-xl lg:text-2xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-12 py-6">
          <div className="space-y-8 text-xl lg:text-2xl text-slate-700 leading-relaxed font-normal">
            {content}
            <div className="h-24"></div>
          </div>
        </div>

        <div className="px-8 lg:px-12 py-6 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 z-30">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-900 font-bold text-sm uppercase flex items-center gap-2 px-6 py-4 rounded-xl hover:bg-slate-100 border border-slate-200">
             <ChevronLeft size={20}/> ANTERIOR
           </button>
           <button onClick={goNext} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black shadow-xl hover:bg-red-600 transition-all flex items-center gap-3 text-sm uppercase tracking-wide transform hover:-translate-y-1">
             SIGUIENTE <ArrowRight size={20} />
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
      </div>
      
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center p-8 gap-12">
        <div className="text-center md:text-left space-y-4 flex-1">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-28 mx-auto md:mx-0 drop-shadow-xl" alt="Escudo" />
          <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter">INDUCCIÓN<br/><span className="text-red-500">MUNICIPAL</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Ilustre Municipalidad de La Serena</p>
        </div>
        
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl flex-1 relative">
          
          <button onClick={fillDemoData} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 flex items-center gap-1 text-[10px] uppercase font-bold transition-colors">
            ⚡ Llenar Datos
          </button>

          <div className="space-y-5">
            <h3 className="text-slate-900 font-black text-2xl mb-6 flex items-center gap-3 uppercase">Bienvenido</h3>
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-900 border-2 border-transparent focus:border-red-500 outline-none" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-900 border-2 border-transparent focus:border-red-500 outline-none" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-900 border-2 border-transparent focus:border-red-500 outline-none" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-900 border-2 border-transparent focus:border-red-500 outline-none" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
            <input className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-900 border-2 border-transparent focus:border-red-500 outline-none" placeholder="Cargo" value={userData.cargo} onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.nombres} onClick={goNext} className="w-full bg-red-600 text-white p-5 rounded-xl font-black tracking-widest hover:bg-red-700 transition-all shadow-lg flex justify-center gap-3 mt-6 items-center disabled:opacity-50">
              INGRESAR <ArrowRight size={24}/>
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
           {/* REPRODUCTOR NATIVO DE YOUTUBE: INFALIBLE */}
           <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM" title="Mensaje" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      }
      content={
        <div className="animate-in fade-in duration-700">
           <p className="font-black text-4xl text-slate-900 mb-6">¡Hola, {userData.nombres}!</p>
           <p className="mb-8 text-2xl font-light text-slate-600">Te sumas a una institución con historia. La Serena es una capital patrimonial que exige lo mejor de nosotros.</p>
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
           <div className="space-y-8 w-full max-w-sm">
              <div className="bg-white/10 p-8 rounded-3xl border border-white/20">
                 <h4 className="font-black text-3xl text-yellow-400 mb-2">MISIÓN</h4>
                 <p className="text-slate-200 text-lg">Mejorar la calidad de vida con gestión participativa.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-3xl border border-white/20">
                 <h4 className="font-black text-3xl text-red-400 mb-2">VISIÓN</h4>
                 <p className="text-slate-200 text-lg">Líderes en desarrollo sostenible y patrimonio.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-8">Nuestros Valores:</p>
          <div className="space-y-6">
             <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0"><Shield size={32}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">Probidad</h4><p className="text-slate-600 text-lg">Rectitud intachable con los recursos.</p></div>
             </div>
             <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Heart size={32}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">Cercanía</h4><p className="text-slate-600 text-lg">Empatía total con el vecino.</p></div>
             </div>
             <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0"><Lightbulb size={32}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">Transparencia</h4><p className="text-slate-600 text-lg">Actos públicos y claros.</p></div>
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
                 <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center border-2 border-slate-200">
                   <User size={32} className="text-slate-300" />
                 </div>
                 <p className="text-xs font-black text-slate-900 uppercase leading-tight">{name}</p>
               </div>
            ))}
            </div>
        </div>
      }
      content={
        <>
          <p className="mb-8 text-2xl font-light">El <strong>Concejo Municipal</strong> tiene 10 integrantes electos.</p>
          <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-[2rem]">
             <h4 className="font-black text-yellow-900 text-2xl mb-6">Funciones Clave:</h4>
             <ul className="space-y-4 text-lg">
               <li className="flex gap-4 items-center"><CheckCircle size={28} className="text-yellow-700"/> <span className="text-yellow-900"><strong>Normar:</strong> Ordenanzas comunales.</span></li>
               <li className="flex gap-4 items-center"><CheckCircle size={28} className="text-yellow-700"/> <span className="text-yellow-900"><strong>Fiscalizar:</strong> Presupuesto.</span></li>
               <li className="flex gap-4 items-center"><CheckCircle size={28} className="text-yellow-700"/> <span className="text-yellow-900"><strong>Resolver:</strong> Licitaciones.</span></li>
             </ul>
          </div>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura" 
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-4"><img src="/img/organigrama_full.png" className="max-h-full max-w-full object-contain drop-shadow-xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000?text=Organigrama'}/></div>}
      content={
        <>
          <p className="mb-8 text-2xl font-light">Direcciones clave para la gestión:</p>
          <div className="space-y-6">
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 flex gap-6 items-center">
               <div className="bg-red-100 p-4 rounded-2xl text-red-600"><Heart size={40}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">DIDECO</h4><p className="text-slate-500 text-lg">Corazón social. Gestiona ayudas.</p></div>
             </div>
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 flex gap-6 items-center">
               <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Building2 size={40}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">DOM (Obras)</h4><p className="text-slate-500 text-lg">Permisos de edificación.</p></div>
             </div>
             <div className="p-6 bg-white shadow-sm rounded-3xl border border-slate-100 flex gap-6 items-center">
               <div className="bg-green-100 p-4 rounded-2xl text-green-600"><Map size={40}/></div>
               <div><h4 className="font-black text-slate-900 text-2xl">SECPLAN</h4><p className="text-slate-500 text-lg">Diseño de proyectos.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-8">
           <div className="bg-white text-slate-900 font-black p-8 rounded-full mb-12 text-3xl shadow-xl">IMLS</div>
           <div className="grid grid-cols-2 gap-6 w-full max-w-md">
             <div className="bg-slate-800 p-6 rounded-3xl flex flex-col items-center"><User size={40} className="text-blue-400 mb-2"/><span className="font-bold">Vecinos</span></div>
             <div className="bg-slate-800 p-6 rounded-3xl flex flex-col items-center"><Briefcase size={40} className="text-green-400 mb-2"/><span className="font-bold">Empresas</span></div>
             <div className="bg-slate-800 p-6 rounded-3xl flex flex-col items-center"><Shield size={40} className="text-purple-400 mb-2"/><span className="font-bold">Gobierno</span></div>
             <div className="bg-slate-800 p-6 rounded-3xl flex flex-col items-center"><Map size={40} className="text-orange-400 mb-2"/><span className="font-bold">Turistas</span></div>
           </div>
        </div>
      }
      content={
        <>
          <p className="mb-8 text-2xl font-light">Interactuamos 24/7 con nuestro entorno:</p>
          <div className="space-y-6">
            <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-3xl border-l-8 border-blue-500">
               <div className="text-blue-600"><User size={40}/></div>
               <div><strong className="text-xl block text-slate-900">Vecinos</strong>El centro de nuestra gestión.</div>
            </div>
            <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-3xl border-l-8 border-green-500">
               <div className="text-green-600"><Briefcase size={40}/></div>
               <div><strong className="text-xl block text-slate-900">Privados</strong>Socios estratégicos.</div>
            </div>
            <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-3xl border-l-8 border-purple-500">
               <div className="text-purple-600"><Shield size={40}/></div>
               <div><strong className="text-xl block text-slate-900">Instituciones</strong>Coordinación vital.</div>
            </div>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Solo Equipo" 
      visual={<div className="w-full h-full flex items-center justify-center bg-green-50"><DollarSign size={200} className="text-green-600"/></div>}
      content={
        <>
          <p className="mb-8 text-2xl font-light">Todos somos compañeros, con distintas modalidades:</p>
          <div className="space-y-6">
             <div className="p-8 border-2 border-green-100 bg-green-50 rounded-[2rem]">
               <strong className="block text-2xl text-green-900 mb-2">Planta y Contrata</strong>
               <span className="text-green-700 text-lg">Pago: <strong>Penúltimo día hábil del mes</strong>.</span>
             </div>
             <div className="p-8 border-2 border-blue-100 bg-blue-50 rounded-[2rem]">
               <strong className="block text-2xl text-blue-900 mb-2">Honorarios</strong>
               <span className="text-blue-700 text-lg">Pago: Variable (requiere informe mensual).</span>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad" 
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50"><Heart size={200} className="text-pink-500"/></div>}
      content={
        <>
          <p className="mb-8 text-2xl font-light"><strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-1 gap-4 mb-8">
             <div className="bg-pink-50 p-6 rounded-2xl font-black text-pink-900 flex gap-4 items-center text-xl border border-pink-200"><Shield size={32}/> Acoso Laboral</div>
             <div className="bg-pink-50 p-6 rounded-2xl font-black text-pink-900 flex gap-4 items-center text-xl border border-pink-200"><Shield size={32}/> Acoso Sexual</div>
             <div className="bg-pink-50 p-6 rounded-2xl font-black text-pink-900 flex gap-4 items-center text-xl border border-pink-200"><Shield size={32}/> Violencia</div>
          </div>
          <p className="text-slate-600 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-lg font-serif italic">"Un solo acto grave es suficiente para denunciar."</p>
        </>
      } 
    />;

    // --- DIAPOSITIVA 8: SEGURIDAD (REPARADA) ---
    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50"><Shield size={200} className="text-yellow-600"/></div>}
      content={
        <div className="space-y-10">
           <div>
             <h4 className="font-black text-3xl mb-4 flex items-center gap-3 text-slate-900"><Map className="text-blue-600" size={32}/> Zona de Tsunamis</h4>
             <p className="text-xl text-slate-700 leading-relaxed">Ante un sismo que dificulte mantenerse en pie, evacuar siempre a la <strong>Cota 30</strong> (Desde Avenida Cisternas hacia arriba).</p>
           </div>
           
           <div>
             <h4 className="font-black text-3xl mb-6 flex items-center gap-3 text-slate-900"><AlertCircle className="text-red-600" size={32}/> Accidentes Laborales</h4>
             <div className="bg-red-50 p-8 rounded-[2rem] border-l-8 border-red-600">
               <ol className="list-decimal ml-6 space-y-4 text-xl font-bold text-red-900">
                 <li>AVISAR INMEDIATAMENTE A JEFATURA.</li>
                 <li>ACUDIR A LA ACHS (MUTUALIDAD).</li>
                 <li>NO IRSE A CASA SIN REGISTRO.</li>
               </ol>
             </div>
           </div>
        </div>
      } 
    />;

    // 9. QUIZ
    case 9: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl w-full max-w-3xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-3 bg-slate-100"><div className="h-full bg-green-500 transition-all" style={{width: `${((quizIndex+1)/QUESTIONS.length)*100}%`}}></div></div>
           
           {!quizFinished ? (
             <>
               <div className="flex justify-between mb-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
                 <span>Evaluación</span>
                 <span>{quizIndex + 1} / {QUESTIONS.length}</span>
               </div>
               
               <h3 className="text-3xl md:text-4xl font-black mb-10 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="space-y-4">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleAnswer(i)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-xl transition-all ${
                       quizState === 'waiting' ? 'border-slate-200 hover:bg-slate-50' :
                       i === QUESTIONS[quizIndex].ans ? 'bg-green-50 border-green-500 text-green-800' : 
                       quizState === 'wrong' && quizIndex === i ? 'bg-red-50 border-red-500 text-red-800' : 'opacity-50'
                     }`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>

               {quizState !== 'waiting' && (
                 <div className={`mt-8 p-8 rounded-3xl ${quizState === 'correct' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'} animate-in fade-in`}>
                   <p className="font-black text-2xl mb-2 flex items-center gap-3">
                     {quizState === 'correct' ? <><CheckCircle size={32}/> ¡Correcto!</> : <><AlertCircle size={32}/> Corrección:</>}
                   </p>
                   <p className="mb-6 text-lg leading-relaxed">{QUESTIONS[quizIndex].explanation}</p>
                   <button onClick={nextQuestion} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl text-lg hover:bg-slate-800">Siguiente Pregunta</button>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-10">
               <Award size={100} className="mx-auto text-yellow-500 mb-8" />
               <h2 className="text-5xl font-black mb-6">¡Excelente!</h2>
               <p className="text-slate-500 mb-10 text-2xl">Has completado la evaluación.</p>
               <button onClick={goNext} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black shadow-2xl hover:bg-red-600 transition-colors text-xl">Generar Certificado</button>
             </div>
           )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-16 w-full max-w-6xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[12px] border-double border-slate-200">
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
         {/* Fondo Animado Final */}
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/30"></div>
         
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
