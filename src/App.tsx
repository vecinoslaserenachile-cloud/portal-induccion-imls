import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, ShieldCheck, Globe, BookOpen, Eye, Info, X
} from 'lucide-react';

// --- DATA MUNICIPAL ---
const DEPARTAMENTOS = ["Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", "DIDECO", "Dirección de Obras (DOM)", "Gestión de Personas", "Seguridad Ciudadana", "Tránsito", "Turismo y Patrimonio", "Servicio a la Comunidad", "Salud", "Educación"];

const CONCEJALES = ["Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín", "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay", "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "¡Correcto! Todos somos funcionarios públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de cada decisión." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal directo 24/7." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Área que brinda apoyo psicológico y bienestar?", options: ["DOM", "Calidad de Vida", "DAF"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "Plaza de Armas", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Seguridad primero: Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Qué es RDMLS?", options: ["Un edificio", "Radio Digital Municipal", "Un parque"], ans: 1, explanation: "Nuestra Radio Digital Municipal, la voz oficial de la ciudad." },
  { q: "¿Quién fiscaliza la gestión municipal?", options: ["Solo el Alcalde", "El Concejo Municipal", "Empresas"], ans: 1, explanation: "El Concejo fiscaliza y aprueba las normativas comunales." },
  { q: "¿Valor municipal principal?", options: ["Rapidez", "Probidad", "Simpatía"], ans: 1, explanation: "La Probidad es la base ética de nuestra función pública." },
  { q: "¿Qué debo hacer al terminar?", options: ["Irse", "Integrarse a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a nuestras redes y portales de innovación." },
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ 
    nombres: 'Rodrigo', apellidos: 'Godoy', rut: '12.345.678-9', 
    dept: 'SECPLAN', cargo: 'Director de Innovación', 
    email: 'rodrigo.godoy@laserena.cl' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: any) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
      setCanAdvance(true);
    }
  };

  useEffect(() => {
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 1000);
    }
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    if (idx === QUESTIONS[quizIndex].ans) {
      setQuizState('correct');
      setScore(s => s + 1);
    } else {
      setQuizState('wrong');
    }
  };

  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_20px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden z-10">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center relative border border-white/10 backdrop-blur-3xl">
             {visual}
             <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <img src="/img/escudo.png" className="h-6" onError={(e) => e.currentTarget.style.display='none'} />
                <span className="text-[8px] font-black uppercase text-white/50 tracking-tighter">IMLS 2026</span>
             </div>
           </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-slate-950 overflow-hidden relative">
          <div className="px-6 lg:px-16 pt-8 pb-4 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10 shadow-2xl">
             <div className="flex items-center gap-3 mb-1">
                <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">PASO {step}</span>
                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest border-l border-white/10 pl-3">PLATAFORMA DE INDUCCIÓN</span>
             </div>
             <h2 className="text-2xl lg:text-6xl font-black text-white leading-none tracking-tighter italic uppercase">{title}</h2>
             <h3 className="text-base lg:text-2xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-16 py-8 scroll-smooth">
            <div className="space-y-8 text-lg lg:text-2xl text-slate-300 font-light leading-relaxed">
              {content}
              <div className="h-32"></div> 
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-6 lg:px-20 flex items-center justify-between z-50">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-2 transition-all p-3">
            <ChevronLeft size={20}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-6">
            {!canAdvance && (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={20} className="animate-bounce"/> DESLIZA HACIA ABAJO
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-8 py-3 lg:px-14 lg:py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3 text-xs uppercase tracking-widest transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              SIGUIENTE <ArrowRight size={20} />
            </button>
          </div>
      </div>
    </div>
  );

  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-20 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center p-8 gap-12">
        <div className="text-center md:text-left space-y-6 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-48 mx-auto md:mx-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
          <h1 className="text-6xl lg:text-[9rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs pl-4 border-l-4 border-red-600 mt-6 italic">Municipalidad de La Serena</p>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700">
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-4 uppercase tracking-tighter italic border-b border-white/5 pb-4"><User className="text-red-600" size={32}/> Acceso</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all hover:scale-[1.03] uppercase text-xl mt-4 flex items-center justify-center gap-4">Ingresar <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black relative flex items-center justify-center">
          {!videoActive ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 cursor-pointer group" onClick={() => setVideoActive(true)}>
              <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
              <div className="relative flex flex-col items-center gap-6">
                 <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-all">
                   <Play size={40} fill="white" className="ml-1 text-white" />
                 </div>
                 <h4 className="text-white font-black text-2xl uppercase tracking-[0.4em] italic drop-shadow-2xl">REPRODUCIR VIDEO</h4>
              </div>
            </div>
          ) : (
            <iframe className="w-full h-full aspect-video scale-105" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0&modestbranding=1&enablejsapi=1" title="Mensaje" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          )}
        </div>
      }
      content={<><p className="font-black text-5xl text-white mb-8 italic tracking-tighter leading-none">¡Hola, {userData.nombres}!</p><p className="text-2xl">Te damos la bienvenida oficial a la **Ilustre Municipalidad de La Serena**. Te sumas a un equipo con vocación de servicio, ética intachable y visión de futuro moderna.</p><div className="bg-red-600/20 p-10 rounded-[3rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-3xl text-red-100 leading-tight">"Nuestra gestión pone al vecino en el centro. Buscamos funcionarios proactivos, empáticos y modernos, capaces de entender que cada trámite es la vida de una familia."</div><p className="text-slate-400">En este proceso conocerás los pilares estratégicos y los protocolos que te protegen a ti y a nuestra comunidad.</p></>} 
    />;

    case 2: return <ChapterLayout title="La Brújula" subtitle="Estrategia IMLS 2026" 
      visual={<div className="flex flex-col gap-10 items-center p-12 animate-pulse"><Target size={150} className="text-red-600 drop-shadow-[0_0_30px_red]"/><h4 className="font-black text-7xl uppercase tracking-tighter text-white leading-none italic text-center">MISIÓN<br/>& VISIÓN</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4 italic border-b border-white/5 pb-4"><Star/> Nuestra Misión</h4><p className="text-2xl font-light">Administrar la comuna de La Serena asegurando la participación de la comunidad en su progreso económico, social y cultural. Entregar servicios de alta calidad, eficiencia y total transparencia con calidez humana.</p></section><section className="space-y-6 pt-12"><h4 className="text-orange-500 font-black text-3xl uppercase tracking-widest flex items-center gap-4 italic border-b border-white/5 pb-4"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto absoluto al patrimonio histórico y por brindar la mejor calidad de vida a sus habitantes.</p></section></>} 
    />;

    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto h-full bg-slate-900/50">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-4 rounded-[2.5rem] border border-white/10 text-[10px] font-black uppercase text-center flex flex-col items-center justify-center shadow-2xl group hover:border-red-600 transition-all"><User size={28} className="mb-2 text-red-600 mx-auto group-hover:scale-125 transition-transform"/>{c}</div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave para el desarrollo local.</p><div className="bg-yellow-500/10 p-12 rounded-[4rem] border border-yellow-500/20 shadow-2xl space-y-10 mt-6"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-6 italic"><Shield size={40}/> Atribuciones Clave</h4><ul className="space-y-6 text-2xl font-light"><li>• Fiscalizar el cumplimiento de planes y programas municipales.</li><li>• Aprobar el presupuesto municipal anual (más de $75 mil millones).</li><li>• Dictar las ordenanzas que rigen la convivencia de la ciudad.</li></ul></div></>} 
    />;

    case 6: return <ChapterLayout title="Seguridad" subtitle="Prevención y Emergencia 1420" 
      visual={<div className="p-20 text-center animate-in zoom-in duration-1000"><Phone size={180} className="text-red-600 mx-auto drop-shadow-[0_0_40px_red]"/><h4 className="text-white font-black text-[8rem] mt-12 tracking-tighter italic leading-none shadow-2xl">1420</h4></div>}
      content={
        <>
          <p className="text-3xl font-black text-white mb-10 uppercase tracking-tighter italic border-l-8 border-red-600 pl-8">Tu seguridad es nuestra prioridad.</p>
          <p className="text-2xl font-light">La Dirección de Seguridad Ciudadana despliega patrullajes preventivos constantes y monitorea una red de cámaras de alta tecnología con IA las 24 horas del día.</p>
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-12 mt-12">
             <div className="flex gap-10 items-center border-b border-white/5 pb-12 group cursor-pointer">
               <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl group-hover:scale-110 transition-all"><Phone size={60}/></div>
               <div><h4 className="font-black text-white text-5xl">LÍNEA 1420</h4><p className="text-2xl text-slate-400 uppercase tracking-widest font-black mt-2">Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-10 items-center group cursor-pointer">
               <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl group-hover:scale-110 transition-all"><Eye size={60}/></div>
               <div><h4 className="font-black text-white text-4xl uppercase italic leading-none tracking-tighter">Central Cámaras</h4><p className="text-2xl text-slate-400 mt-2 font-light italic italic">Monitoreo Preventivo Inteligente.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 11: return (
      <div className="h-screen bg-slate-950 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-slate-900 p-12 lg:p-24 rounded-[6rem] shadow-[0_0_150px_rgba(0,0,0,1)] w-full max-w-6xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000 ring-1 ring-white/5">
             <div className="absolute top-0 left-0 w-full h-4 bg-white/5 overflow-hidden rounded-t-[6rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_40px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
             {!quizFinished ? (
               <div className="space-y-16 animate-in fade-in duration-500">
                 <div className="flex justify-between items-center mb-12 text-[16px] font-black text-slate-500 uppercase tracking-[0.6em] border-b border-white/5 pb-10"><span>CERTIFICACIÓN OFICIAL IMLS</span><span className="bg-red-600 text-white px-8 py-4 rounded-full font-black text-2xl shadow-2xl">Pregunta {quizIndex + 1} / 10</span></div>
                 <h3 className="text-5xl lg:text-[7rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic drop-shadow-2xl">{QUESTIONS[quizIndex].q}</h3>
                 <div className="grid gap-6 pt-12 overflow-y-auto max-h-[40vh] px-4">
                   {QUESTIONS[quizIndex].options.map((opt, i) => (
                     <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-12 rounded-[2.5rem] border-2 font-black text-4xl transition-all shadow-xl ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-red-600' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/30 border-green-600 text-green-400 shadow-[0_0_80px_rgba(22,163,74,0.4)] scale-105' : 'opacity-20 grayscale text-white scale-95 border-transparent'}`}>{opt}</button>
                   ))}
                 </div>
                 {quizState !== 'waiting' && (
                   <div className="mt-16 p-14 rounded-[4rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] border-l-[15px] border-red-600">
                      <p className="text-white text-4xl font-light italic leading-snug font-serif tracking-tight">{QUESTIONS[quizIndex].explanation}</p>
                      <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-16 bg-white text-slate-950 p-10 rounded-[2.5rem] font-black uppercase text-xl tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-10">SIGUIENTE DESAFÍO <ArrowRight size={48}/></button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="text-center py-20 animate-in zoom-in duration-1000">
                 <Award size={250} className="mx-auto text-yellow-500 mb-14 drop-shadow-[0_0_100px_rgba(234,179,8,0.6)] animate-bounce" />
                 <h2 className="text-[10rem] lg:text-[13rem] font-black text-white mb-16 tracking-tighter uppercase italic leading-[0.7] shadow-xl">¡LOGRADO!</h2>
                 <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-16 rounded-[5rem] font-black shadow-[0_40px_100px_rgba(220,38,38,0.5)] hover:scale-105 transition-all uppercase tracking-[0.4em] text-5xl ring-8 ring-red-500/20">OBTENER DIPLOMA</button>
               </div>
             )}
          </div>
        </div>
      </div>
    );

    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-32 rounded-[6rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10 ring-1 ring-white/5">
            <div className="bg-white p-14 rounded-[4rem] shadow-[0_80px_150px_rgba(0,0,0,1)] mb-32 border-[30px] border-double border-slate-200 text-slate-900 text-left relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5"><img src="/img/escudo.png" className="h-[500px]" /></div>
               <div className="flex justify-between items-center mb-16 border-b-2 border-slate-100 pb-10">
                  <img src="/img/escudo.png" className="h-28 shadow-2xl" />
                  <img src="/img/innovacion.png" className="h-28 shadow-2xl" />
               </div>
               <h1 className="text-8xl font-serif font-black uppercase tracking-[0.2em] mb-6 leading-none italic">DIPLOMA</h1>
               <p className="text-2xl italic text-slate-400 mb-16 uppercase border-y-2 border-slate-50 py-6 tracking-[0.4em]">Aprobación Inducción Corporativa IMLS 2026</p>
               <h2 className="text-7xl lg:text-[8rem] font-black uppercase mb-12 tracking-tighter border-b-8 border-red-600 inline-block px-4 pb-4">{userData.nombres} {userData.apellidos}</h2>
               <p className="text-2xl font-bold text-slate-500 uppercase tracking-[0.4em] mb-12">RUT: {userData.rut} • {userData.dept}</p>
               <div className="flex justify-between items-end mt-24">
                  <div className="text-center w-80 border-t-4 border-slate-300 pt-8 text-xs font-black uppercase text-slate-400 shadow-xl"><img src="/img/firma_personas.png" className="h-20 mx-auto mb-4 opacity-80" />Director de Gestión de Personas</div>
                  <div className="text-center text-slate-300 font-serif italic text-3xl tracking-widest">{currentTime.toLocaleDateString()}</div>
                  <div className="text-center w-80 border-t-4 border-slate-300 pt-8 text-xs font-black uppercase text-slate-500 shadow-xl"><img src="/img/firma_alcaldesa.png" className="h-20 mx-auto mb-4 opacity-80" />Daniela Norambuena - Alcaldesa</div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-24 text-left bg-black/60 p-20 lg:p-32 rounded-[6rem] border border-white/5">
               <div className="flex flex-col items-center justify-center bg-white p-20 rounded-[5rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] group transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  <QrCode size={350} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-14 text-3xl uppercase tracking-[0.6em]">RDMLS ACCESO</p>
               </div>
               <div className="space-y-16 flex flex-col justify-center">
                  <div className="flex items-center gap-12 group cursor-pointer hover:translate-x-8 transition-transform hover:text-red-500"><div className="p-8 bg-red-600 rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:rotate-12 transition-all"><Radio size={60}/></div><div className="space-y-2"><span className="font-black text-6xl tracking-tighter uppercase block leading-none italic shadow-2xl">Radio Digital</span><p className="text-slate-400 text-2xl font-light italic">La voz de los serenenses en la red.</p></div></div>
                  <button className="mt-16 bg-white text-slate-950 w-full py-12 rounded-[4rem] font-black transition-all shadow-[0_50px_100px_rgba(255,255,255,0.15)] hover:bg-red-600 hover:text-white text-4xl tracking-[0.3em] uppercase transform hover:scale-105 active:scale-95 flex items-center justify-center gap-10 shadow-2xl" onClick={() => window.print()}><Printer size={48}/> IMPRIMIR DIPLOMA</button>
               </div>
            </div>
            
            <button onClick={() => setStep(0)} className="mt-32 text-slate-800 hover:text-red-500 flex items-center justify-center gap-8 text-sm uppercase tracking-[1em] font-black transition-colors w-full uppercase mt-20 group italic"><RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-1000"/> CERRAR SESIÓN SEGURA</button>
         </div>
      </div>
    );

    default: return null;
  }
}
