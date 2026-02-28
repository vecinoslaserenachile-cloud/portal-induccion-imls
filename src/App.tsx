import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, HeartHandshake, 
  Smile, Activity, Stethoscope, AlertTriangle, Star
} from 'lucide-react';

// --- CONTENIDO EXPANDIDO ---
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
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. La gestión municipal la construimos todos, independientemente de la calidad jurídica." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de cada una de nuestras decisiones." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente que representan a la comunidad." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS (Ley 16.744)." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Qué busca el área de Calidad de Vida?", options: ["Solo pagar sueldos", "Bienestar integral", "Nada"], ans: 1, explanation: "Buscamos el bienestar físico, mental y social del funcionario y su familia." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "A la Playa", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "La seguridad es primero. Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Cuál es un valor municipal intransable?", options: ["Probidad", "Rapidez", "Simpatía"], ans: 0, explanation: "La Probidad Administrativa es la base ética de nuestra función pública." },
  { q: "¿Qué dirección ve los proyectos de inversión?", options: ["DIDECO", "SECPLAN", "Tránsito"], ans: 1, explanation: "SECPLAN es el cerebro técnico que diseña y postula los proyectos comunales." },
  { q: "¿Qué debo hacer al terminar?", options: ["Olvidar todo", "Integrarme a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Te invitamos a usar nuestras herramientas digitales oficiales." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- APP ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
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
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Si el usuario llega al 90% del scroll, activamos el botón
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setCanAdvance(true);
      }
    }
  };

  useEffect(() => {
    // Pasos que NO requieren scroll obligatorio
    if ([0, 1, 9, 10, 11].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Pequeño delay para chequear si el contenido cabe sin scroll
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight) {
          setCanAdvance(true);
        }
      }, 500);
    }
  }, [step]);

  const goNext = () => canAdvance && setStep(s => s + 1);
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const correct = idx === QUESTIONS[quizIndex].ans;
    setQuizState(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  };

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <div className="fixed top-0 w-full h-1.5 bg-slate-800 z-50">
        <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      <div className="lg:w-1/2 w-full lg:h-full h-[35vh] flex items-center justify-center p-4 lg:p-12 relative z-10 bg-slate-950">
         <div className="w-full h-full lg:rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black flex items-center justify-center">
           {visual}
         </div>
      </div>

      <div className="lg:w-1/2 w-full flex flex-col h-[65vh] lg:h-full bg-slate-900 border-l border-white/5 shadow-2xl relative z-20">
        <div className="px-8 lg:px-16 pt-10 pb-6 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Módulo {step}</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black leading-tight mb-2 tracking-tighter">{title}</h2>
          <h3 className="text-lg lg:text-xl text-slate-400 font-serif italic">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-8 lg:px-16 py-8 scroll-smooth">
          <div className="space-y-8 text-lg lg:text-xl text-slate-300 leading-relaxed font-light text-justify">
            {content}
            <div className="h-20"></div>
          </div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between shrink-0">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-200 font-bold text-xs uppercase flex items-center gap-2">
             <ChevronLeft size={16}/> Atrás
           </button>

           <div className="flex items-center gap-4">
             {!canAdvance && (
               <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                 <ChevronDown size={14}/> LEE TODO PARA AVANZAR
               </div>
             )}
             <button 
               onClick={goNext} 
               disabled={!canAdvance}
               className={`px-8 py-4 rounded-xl font-black flex items-center gap-3 text-sm uppercase tracking-widest transition-all
                 ${canAdvance ? 'bg-red-600 text-white shadow-xl shadow-red-900/40 hover:bg-red-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
               `}
             >
               {canAdvance && <CheckCircle size={18} className="text-white animate-bounce"/>}
               Siguiente <ArrowRight size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- ESCENAS ---

  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm"></div>
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center p-8 gap-16">
        <div className="text-center md:text-left space-y-6 flex-1">
          <img src="/img/escudo.png" className="h-32 mx-auto md:mx-0 drop-shadow-2xl" />
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">Inducción<br/><span className="text-red-600">IMLS 2026</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm mt-4">Smart City • Patrimonio • Comunidad</p>
          </div>
        </div>
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex-1">
          <div className="space-y-5">
            <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3 uppercase"><User className="text-red-600"/> Registro</h3>
            <input className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-red-600" placeholder="Nombre Completo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-red-600" placeholder="RUT (12.345.678-9)" onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-slate-400" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona tu Dirección...</option>
                {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-5 rounded-xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/50 transition-all">INGRESAR <ArrowRight size={20} className="inline ml-2"/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Mensaje de Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black relative">
          {/* VIDEO CON CONFIGURACIÓN DE SEGURIDAD MÁXIMA */}
          <iframe 
            className="w-full h-full aspect-video" 
            src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=0&rel=0&modestbranding=1&enablejsapi=1" 
            title="Bienvenida" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      }
      content={
        <>
          <p className="font-black text-4xl text-white mb-6">¡Hola, {userData.nombres}!</p>
          <p>Es un orgullo para nuestra institución darte la bienvenida oficial al equipo municipal. La Serena es la segunda ciudad más antigua de Chile y su administración requiere de personas con vocación de servicio, ética y una visión de futuro moderna.</p>
          <div className="bg-red-600/20 p-8 rounded-3xl border-l-8 border-red-600 shadow-lg italic font-serif text-2xl text-red-100 leading-relaxed">
            "Nuestra gestión no se trata de papeles, se trata de personas. Cada vez que atiendas a un vecino, recuerda que representas el sueño de una ciudad mejor, más segura y más humana."
          </div>
          <p>En este proceso de inducción, conocerás los pilares que sostienen nuestro municipio: desde nuestra visión estratégica hasta los protocolos de seguridad que protegen tu integridad y la de tus compañeros. ¡Comencemos!</p>
        </>
      } 
    />;

    case 2: return <ChapterLayout title="Nuestra Carta de Navegación" subtitle="Misión, Visión y Valores" 
      visual={<div className="flex flex-col gap-6 p-8"><Star size={80} className="text-yellow-400 mx-auto animate-pulse"/><h4 className="text-white font-black text-4xl text-center uppercase tracking-tighter">Excelencia Municipal</h4></div>}
      content={
        <>
          <h4 className="text-red-500 font-black text-2xl uppercase tracking-widest">Nuestra Misión</h4>
          <p>Somos la institución encargada de administrar la comuna de La Serena, buscando satisfacer las necesidades de la comunidad local y asegurar su participación en el progreso económico, social y cultural. Nuestro compromiso es entregar servicios de alta calidad, con eficiencia y calidez humana.</p>
          
          <h4 className="text-red-500 font-black text-2xl uppercase tracking-widest mt-10">Nuestra Visión</h4>
          <p>Proyectamos a La Serena como una comuna líder en desarrollo sostenible a nivel nacional, reconocida por su respeto al patrimonio arquitectónico, su innovación en Smart City y su excepcional calidad de vida para todos sus habitantes.</p>
          
          <div className="grid gap-6 mt-10">
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-6 items-center">
                <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">1</div>
                <div><h5 className="font-black text-white uppercase">Probidad</h5><p className="text-sm">Actuamos con rectitud intachable y honestidad total.</p></div>
             </div>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-6 items-center">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">2</div>
                <div><h5 className="font-black text-white uppercase">Cercanía</h5><p className="text-sm">El vecino no es un número, es nuestro centro de atención.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="El Cuerpo Colegiado" 
      visual={<div className="grid grid-cols-2 gap-4 p-8">{CONCEJALES.slice(0,4).map(c => <div key={c} className="bg-white/5 p-4 rounded-xl border border-white/10 text-[10px] font-bold text-center"><User className="mx-auto mb-2 text-red-600"/>{c}</div>)}</div>}
      content={
        <>
          <p>La administración de la comuna reside en la Alcaldesa y en el Concejo Municipal. Este último es un órgano colegiado, de carácter normativo, resolutivo y fiscalizador, encargado de hacer efectiva la participación de la comunidad local.</p>
          <p>Actualmente, el honorable Concejo Municipal de La Serena está integrado por 10 concejales electos por votación popular, quienes tienen la misión de aprobar el presupuesto, fiscalizar la gestión y normar las ordenanzas que rigen nuestra ciudad.</p>
          <div className="bg-yellow-500/10 p-6 rounded-3xl border border-yellow-500/20 mt-6">
             <h4 className="text-yellow-500 font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Atribuciones del Concejo:</h4>
             <ul className="space-y-4 text-lg">
                <li className="flex gap-3"><CheckCircle className="text-yellow-500 shrink-0"/> Fiscalizar el cumplimiento de los planes y programas municipales.</li>
                <li className="flex gap-3"><CheckCircle className="text-yellow-500 shrink-0"/> Aprobar el Plan Comunal de Desarrollo y el Presupuesto Municipal.</li>
                <li className="flex gap-3"><CheckCircle className="text-yellow-500 shrink-0"/> Dar su acuerdo para las licitaciones y contratos de gran envergadura.</li>
             </ul>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Calidad de Vida" subtitle="Tu Bienestar Integral" 
      visual={<div className="p-12"><HeartHandshake size={150} className="text-red-600 mx-auto drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"/></div>}
      content={
        <>
          <p>Para nosotros, tu bienestar no es solo una palabra, es una política institucional. El área de Bienestar y Calidad de Vida tiene como objetivo principal acompañarte en tu desarrollo personal y profesional.</p>
          
          <div className="space-y-8 mt-8">
             <div className="flex gap-6 items-start">
               <div className="bg-red-600/20 p-4 rounded-2xl text-red-500 shrink-0"><Stethoscope size={30}/></div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-1">Salud y Apoyo Psicológico</h4>
                 <p className="text-sm">Contamos con convenios médicos, seguros complementarios y un equipo de psicólogos para brindarte contención emocional y orientación en momentos difíciles.</p>
               </div>
             </div>

             <div className="flex gap-6 items-start">
               <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-500 shrink-0"><Activity size={30}/></div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-1">Deporte y Recreación</h4>
                 <p className="text-sm">Acceso a recintos deportivos municipales, talleres de yoga, fútbol y pausas activas durante la jornada laboral para reducir el estrés.</p>
               </div>
             </div>

             <div className="flex gap-6 items-start">
               <div className="bg-green-600/20 p-4 rounded-2xl text-green-500 shrink-0"><Smile size={30}/></div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-1">Beneficios Sociales</h4>
                 <p className="text-sm">Bonos de escolaridad, aguinaldos y beneficios directos a través de la Caja de Compensación para ti y tus cargas familiares.</p>
               </div>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad y Respeto Laboral" 
      visual={<div className="p-12 text-center"><Shield size={120} className="text-pink-500 mx-auto mb-6"/><h4 className="text-pink-100 font-bold uppercase tracking-widest">Protocolo 21.643</h4></div>}
      content={
        <>
          <p>La **Ley 21.643 (Ley Karin)** establece un nuevo estándar en las relaciones laborales en Chile, y en el municipio de La Serena la aplicamos con rigor absoluto. Nuestro compromiso es garantizar entornos de trabajo seguros, saludables y con perspectiva de género.</p>
          
          <div className="grid grid-cols-1 gap-4 mt-8">
             <div className="bg-pink-600/10 p-5 rounded-2xl border border-pink-500/20">
                <h5 className="text-pink-500 font-black mb-2 uppercase flex items-center gap-2"><AlertTriangle size={18}/> Acoso Laboral</h5>
                <p className="text-sm text-slate-400">Toda conducta que constituya agresión u hostigamiento, ejercida por el empleador o por uno o más trabajadores.</p>
             </div>
             <div className="bg-pink-600/10 p-5 rounded-2xl border border-pink-500/20">
                <h5 className="text-pink-500 font-black mb-2 uppercase flex items-center gap-2"><AlertTriangle size={18}/> Acoso Sexual</h5>
                <p className="text-sm text-slate-400">Requerimientos de carácter sexual no consentidos que amenacen o perjudiquen la situación laboral del funcionario.</p>
             </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-pink-600 mt-8 shadow-xl">
             <p className="text-white font-bold mb-2">Cambio Fundamental:</p>
             <p className="text-sm italic">"Ya no se requiere que la conducta sea reiterada. Un solo acto grave es suficiente para constituir acoso y activar los protocolos de investigación y sanción."</p>
          </div>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad y Salud" subtitle="Protección en el Trabajo" 
      visual={<div className="p-12"><AlertTriangle size={150} className="text-yellow-500 mx-auto animate-pulse"/></div>}
      content={
        <>
          <p>Tu seguridad es nuestra prioridad número uno. Todos los funcionarios están protegidos por la **Ley 16.744** sobre accidentes del trabajo y enfermedades profesionales, con cobertura a través de nuestra mutualidad (ACHS).</p>
          
          <h4 className="text-yellow-500 font-bold text-2xl mt-10 mb-4">Protocolo Ante Accidentes:</h4>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
             <div className="flex gap-4">
                <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-900 shrink-0">1</div>
                <p><span className="text-white font-bold">Informa:</span> Debes dar aviso inmediato a tu jefatura directa, sin importar la levedad de la lesión.</p>
             </div>
             <div className="flex gap-4">
                <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-900 shrink-0">2</div>
                <p><span className="text-white font-bold">Derivación:</span> Se te entregará una orden de atención para acudir al centro ACHS más cercano.</p>
             </div>
             <div className="flex gap-4">
                <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-900 shrink-0">3</div>
                <p><span className="text-white font-bold">Registro:</span> No te retires a tu domicilio sin el registro médico oficial; de lo contrario, podrías perder la cobertura del seguro.</p>
             </div>
          </div>

          <h4 className="text-blue-500 font-bold text-2xl mt-12 mb-4 uppercase tracking-tighter">Emergencias Naturales:</h4>
          <p>Al ser una ciudad costera, debemos estar preparados. Ante un sismo de mayor intensidad que dificulte mantenerte en pie, evacúa de inmediato hacia la **COTA 30** (Desde Avenida Cisternas hacia el oriente).</p>
        </>
      } 
    />;

    // --- ESCENAS FINALES ---

    case 9: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl w-full max-w-2xl border border-white/5">
           {!quizFinished ? (
             <>
               <div className="flex justify-between mb-8 text-xs font-black text-slate-500 uppercase tracking-widest"><span>Evaluación Final</span><span>{quizIndex + 1} / {QUESTIONS.length}</span></div>
               <h3 className="text-2xl md:text-3xl font-black text-white mb-10 leading-tight">{QUESTIONS[quizIndex].q}</h3>
               <div className="space-y-4">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-6 rounded-2xl border-2 font-bold transition-all ${quizState === 'waiting' ? 'border-white/5 hover:bg-white/5' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/20 border-green-600 text-green-500 shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'opacity-40 grayscale'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-8 p-6 rounded-2xl bg-white/5 animate-in slide-in-from-bottom-5 duration-500">
                    <p className="text-sm text-slate-400 mb-4 uppercase font-bold tracking-widest">{quizState === 'correct' ? '✅ Excelente' : '❌ Por si no lo sabías...'}</p>
                    <p className="text-white text-lg font-light italic leading-relaxed">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-6 bg-white text-black p-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all">Siguiente Pregunta</button>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-10">
               <Award size={100} className="mx-auto text-yellow-500 mb-6 drop-shadow-glow" />
               <h2 className="text-5xl font-black text-white mb-6">¡Completado!</h2>
               <p className="text-slate-400 mb-10 text-xl font-light">Has demostrado tener los conocimientos base para integrarte a nuestra familia municipal.</p>
               <button onClick={() => setStep(10)} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest">Generar mi Certificado</button>
             </div>
           )}
        </div>
      </div>
    );

    case 11: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-sm"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
         
         <div className="bg-white/5 p-12 lg:p-20 rounded-[4rem] backdrop-blur-3xl border border-white/10 max-w-5xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Smartphone size={80} className="mx-auto mb-8 text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"/>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter uppercase">¡Sigue Conectado!</h2>
            <p className="text-2xl text-slate-400 mb-16 font-light max-w-3xl mx-auto leading-relaxed">Tu inducción termina aquí, pero tu historia en el municipio recién comienza. Únete a nuestra red de innovación digital.</p>
            
            <div className="grid md:grid-cols-2 gap-12 text-left bg-black/40 p-12 rounded-[3rem] border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-8 rounded-[2rem] shadow-2xl">
                  <QrCode size={180} className="text-slate-900"/>
                  <p className="text-slate-900 font-black mt-6 text-sm uppercase tracking-widest">Escanea el Acceso</p>
               </div>
               <div className="space-y-8 flex flex-col justify-center">
                  <div className="flex items-center gap-6"><Radio className="text-red-500" size={32}/><span className="font-bold text-2xl tracking-tighter uppercase">Radio Digital IMLS</span></div>
                  <div className="flex items-center gap-6"><Map className="text-blue-500" size={32}/><span className="font-bold text-2xl tracking-tighter uppercase">Tours Virtuales 3D</span></div>
                  <div className="flex items-center gap-6"><MessageCircle className="text-green-500" size={32}/><span className="font-bold text-2xl tracking-tighter uppercase">Chat Serenito Virtual</span></div>
                  
                  <button className="mt-6 bg-red-600 hover:bg-red-500 text-white w-full py-5 rounded-2xl font-black transition-all shadow-xl shadow-red-900/40 text-xl tracking-widest uppercase">
                    Ir al Portal RDMLS
                  </button>
               </div>
            </div>
            
            <div className="mt-16 flex justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <img src="/img/escudo.png" className="h-20 object-contain" />
               <img src="/img/innovacion.png" className="h-20 object-contain" />
            </div>

            <button onClick={() => setStep(0)} className="mt-12 text-slate-600 hover:text-red-500 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] font-black transition-colors w-full">
              <RefreshCw size={14}/> Cerrar Sesión Segura
            </button>
         </div>
      </div>
    );

    default: return null;
  }
}
