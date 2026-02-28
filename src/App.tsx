import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Building2, Lightbulb, Clock, QrCode, Smartphone, 
  ArrowRight, Play, Radio, MessageCircle, Zap, 
  HeartHandshake, Smile, Activity, Stethoscope, AlertTriangle, Star, 
  Target, Users, Landmark, MapPin, Search, GraduationCap, Phone, 
  Mail, ShieldCheck, Globe, BookOpen, Eye, Info
} from 'lucide-react';

// --- DATA MUNICIPAL EXTENDIDA ---
const DEPARTAMENTOS = ["Alcaldía", "Administración Municipal", "Secretaría Municipal", "SECPLAN", "DIDECO", "Dirección de Obras (DOM)", "Gestión de Personas", "Seguridad Ciudadana", "Tránsito", "Turismo y Patrimonio", "Servicio a la Comunidad", "Salud", "Educación"];

const CONCEJALES = ["Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín", "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay", "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"];

const QUESTIONS = [
  { q: "¿Quiénes componen el equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos servidores públicos al servicio de La Serena." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino de La Serena es el centro de cada decisión." },
  { q: "¿Cuál es el número de Seguridad Ciudadana?", options: ["911", "1420", "133"], ans: 1, explanation: "El 1420 es nuestro número de emergencia municipal directo 24/7." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia Cero al acoso laboral, sexual y la violencia en el trabajo." },
  { q: "¿Área que brinda apoyo psicológico y bienestar?", options: ["DOM", "Calidad de Vida", "DAF"], ans: 1, explanation: "Calidad de Vida busca el bienestar integral del funcionario." },
  { q: "¿Dónde evacuar en caso de Tsunami?", options: ["Al Faro", "Plaza de Armas", "Cota 30 (Av. Cisternas)"], ans: 2, explanation: "Seguridad primero: Siempre hacia la zona de seguridad sobre la Cota 30." },
  { q: "¿Qué es RDMLS?", options: ["Un edificio", "Radio Digital Municipal", "Un parque"], ans: 1, explanation: "Nuestra Radio Digital Municipal, innovación en comunicación." },
  { q: "¿Quién fiscaliza la gestión municipal?", options: ["Solo el Alcalde", "El Concejo Municipal", "Empresas"], ans: 1, explanation: "El Concejo fiscaliza y aprueba las normativas comunales." },
  { q: "¿Valor municipal principal?", options: ["Rapidez", "Probidad", "Simpatía"], ans: 1, explanation: "La Probidad es la base ética de nuestra función pública." },
  { q: "¿Qué debo hacer al terminar?", options: ["Irse", "Integrarse a la Comunidad Digital", "Nada"], ans: 1, explanation: "¡Bienvenido! Súmate a nuestras redes y portales de innovación." },
];

// --- APP ---
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

  // Lógica de Scroll mejorada para móviles (Infinito vertical)
  const handleScroll = (e: any) => {
    const el = e.target;
    // Si llegamos cerca del final (100px de margen para móviles)
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    if (atBottom) setCanAdvance(true);
  };

  useEffect(() => {
    // Pasos exentos de bloqueo por lectura
    if ([0, 1, 11, 12].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Auto-desbloqueo si el contenido es corto y no hay scroll
      setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 20) {
          setCanAdvance(true);
        }
      }, 1000);
    }
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const goNext = () => canAdvance && setStep(s => Math.min(s + 1, 12));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleAnswer = (idx: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = idx === QUESTIONS[quizIndex].ans;
    setQuizState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
  };

  // --- LAYOUT MAESTRO RESPONSIVE ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Barra de Progreso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-800 z-[100]">
        <div className="h-full bg-red-600 shadow-[0_0_20px_red] transition-all duration-700" style={{ width: `${(step / 12) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* VISUAL: Lado Izquierdo (PC) / Arriba (Móvil) */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-full bg-slate-900 flex items-center justify-center p-4 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
           <div className="w-full h-full lg:rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center relative border border-white/10 group">
             {visual}
             <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <img src="/img/escudo.png" className="h-10" onError={(e) => e.currentTarget.style.display='none'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 leading-none">MUNICIPALIDAD<br/>LA SERENA</span>
             </div>
           </div>
        </div>

        {/* CONTENIDO: Lado Derecho (PC) / Abajo (Móvil) con Scroll Infinito */}
        <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-full bg-slate-950 overflow-hidden relative">
          <div className="px-8 lg:px-16 pt-12 pb-6 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10 shadow-2xl">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">MÓDULO {step}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-3 border-l border-white/10">SMART INDUCTION</span>
             </div>
             <h2 className="text-3xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-4 italic uppercase">{title}</h2>
             <h3 className="text-lg lg:text-3xl text-slate-400 font-serif italic">{subtitle}</h3>
          </div>

          <div onScroll={handleScroll} ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-10 scroll-smooth">
            <div className="space-y-12 text-xl lg:text-2xl text-slate-300 font-light leading-relaxed text-justify">
              {content}
              <div className="h-40"></div> 
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NAVEGACIÓN FIJO (ESTE NO SE ESCAPA NUNCA) */}
      <div className="h-24 lg:h-28 shrink-0 bg-slate-900 border-t border-white/10 px-8 lg:px-20 flex items-center justify-between z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button onClick={goBack} className="text-slate-500 hover:text-white font-bold text-xs uppercase flex items-center gap-3 transition-all p-4 hover:bg-white/5 rounded-xl">
            <ChevronLeft size={24}/> ATRÁS
          </button>
          
          <div className="flex items-center gap-8">
            {!canAdvance && (
               <div className="hidden sm:flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <ChevronDown size={24} className="animate-bounce"/> DESLIZA EL CONTENIDO PARA AVANZAR
               </div>
            )}
            <button 
              onClick={goNext} 
              disabled={!canAdvance}
              className={`px-12 py-5 lg:px-20 lg:py-6 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-sm uppercase tracking-widest transform 
                ${canAdvance ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/50 scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              {canAdvance && <CheckCircle size={24} className="text-white animate-bounce"/>}
              CONTINUAR <ArrowRight size={24} />
            </button>
          </div>
      </div>
    </div>
  );

  // --- PASO 0: LOGIN ---
  if (step === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('/img/portada.jpg')] bg-cover opacity-30 blur-sm scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center p-8 gap-20">
        <div className="text-center md:text-left space-y-8 flex-1 animate-in slide-in-from-left-10 duration-1000">
          <img src="/img/escudo.png" className="h-32 lg:h-52 mx-auto md:mx-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
          <div>
            <h1 className="text-7xl lg:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">INDUCCIÓN<br/><span className="text-red-600 font-normal italic">IMLS 2026</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs pl-4 border-l-4 border-red-600 mt-8">Smart City • Patrimonio • Servicio de Excelencia</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl flex-1 animate-in zoom-in duration-700 relative">
          <div className="absolute -top-4 -right-4 bg-red-600 text-white p-4 rounded-full shadow-2xl animate-bounce"><Star size={24}/></div>
          <div className="space-y-4">
            <h3 className="text-white font-black text-2xl mb-6 flex items-center gap-4 uppercase tracking-tighter border-b border-white/5 pb-4"><User className="text-red-600" size={32}/> Acceso Único</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="Nombres" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})}/>
              <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="Apellidos" value={userData.apellidos} onChange={e => setUserData({...userData, apellidos: e.target.value})}/>
            </div>
            <input className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-600 outline-none" placeholder="RUT" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})}/>
            <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none focus:border-red-600 cursor-pointer" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
                {DEPARTAMENTOS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
            </select>
            <button onClick={() => setStep(1)} className="w-full bg-red-600 text-white py-7 rounded-3xl font-black tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/50 transition-all hover:scale-[1.03] uppercase text-xl mt-4 flex items-center justify-center gap-4">Entrar al Sistema <ArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (step) {
    // 1. VIDEO CON BOTÓN DE PLAY PARA DESBLOQUEAR NAVEGADOR
    case 1: return <ChapterLayout title="Bienvenidos" subtitle="Daniela Norambuena, Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
          {!videoActive ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 cursor-pointer group" onClick={() => setVideoActive(true)}>
              <img src="https://img.youtube.com/vi/EQUdyb-YVxM/maxresdefault.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className="relative flex flex-col items-center gap-6">
                 <div className="w-28 h-28 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.6)] transition-all group-hover:scale-110 active:scale-90">
                   <Play size={48} fill="white" className="ml-2 text-white" />
                 </div>
                 <h4 className="text-white font-black text-3xl uppercase tracking-[0.4em] drop-shadow-2xl">Ver Mensaje Oficial</h4>
                 <div className="flex gap-2 items-center bg-white/10 px-4 py-1 rounded-full backdrop-blur-md"><Activity size={14} className="text-red-500 animate-pulse"/> <span className="text-[10px] font-bold uppercase tracking-widest">Contenido en HD</span></div>
              </div>
            </div>
          ) : (
            <iframe className="w-full h-full aspect-video scale-105" src="https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&rel=0&modestbranding=1&enablejsapi=1" title="Mensaje" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          )}
        </div>
      }
      content={<><p className="font-black text-6xl text-white mb-10 leading-none tracking-tighter uppercase italic">¡Bienvenido a la Familia IMLS!</p><p className="text-2xl">Es un orgullo saludarte en tu ingreso. Te integras a una institución con historia y vocación de excelencia, donde nuestra misión trasciende los límites de una oficina para impactar en el bienestar de miles de ciudadanos de La Serena.</p><div className="bg-red-600/20 p-12 rounded-[4rem] border-l-8 border-red-600 shadow-2xl italic font-serif text-4xl text-red-100 leading-tight">"La municipalidad es el rostro más cercano del Estado. Cada vez que atiendes a un vecino, representas la esperanza de una ciudad mejor, más segura y más humana."</div><p className="text-slate-400">En este proceso conocerás los pilares estratégicos que guían nuestra gestión 2026.</p></>} 
    />;

    // 2. ESTRATEGIA
    case 2: return <ChapterLayout title="Nuestra Brújula" subtitle="Misión, Visión y Valores Institucionales" 
      visual={<div className="flex flex-col gap-12 items-center p-12"><Target size={150} className="text-red-600 drop-shadow-[0_0_30px_red] animate-pulse"/><h4 className="font-black text-7xl uppercase tracking-tighter text-white leading-none italic text-center">ESTRATEGIA<br/>IMLS 2026</h4></div>}
      content={<><section className="space-y-6"><h4 className="text-red-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4"><Star/> Nuestra Misión</h4><p className="text-2xl font-light leading-relaxed">Administrar la comuna de La Serena asegurando la participación activa de la comunidad en su progreso económico, social y cultural. Entregar servicios de alta calidad, con eficiencia, total transparencia y máxima calidez humana.</p></section><section className="space-y-6 pt-12 border-t border-white/5"><h4 className="text-orange-500 font-black text-4xl uppercase tracking-widest flex items-center gap-4"><Landmark/> Nuestra Visión</h4><p className="text-2xl font-light leading-relaxed">Ser una comuna líder en desarrollo sostenible y Smart City a nivel nacional, reconocida internacionalmente por su respeto absoluto al patrimonio histórico y por brindar la mejor calidad de vida de Chile a sus habitantes.</p></section></>} 
    />;

    // 3. CONCEJO
    case 3: return <ChapterLayout title="El Concejo" subtitle="Fiscalización y Democracia Local" 
      visual={<div className="grid grid-cols-2 gap-6 p-8 overflow-y-auto h-full bg-slate-900/50">{CONCEJALES.map(c => <div key={c} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center shadow-xl group hover:border-red-600 transition-all"><User size={28} className="mb-3 text-red-600 mx-auto group-hover:scale-125 transition-transform"/><p className="text-[11px] font-black uppercase text-white leading-none">{c}</p></div>)}</div>}
      content={<><p>El **Concejo Municipal** es el órgano colegiado que, junto a la Alcaldesa, hace efectiva la participación ciudadana. Su misión es fiscalizar la gestión edilicia y aprobar materias clave.</p><div className="bg-yellow-500/10 p-12 rounded-[4rem] border border-yellow-500/20 shadow-2xl space-y-10 mt-6"><h4 className="text-yellow-500 font-black text-3xl uppercase flex items-center gap-6 italic"><Shield size={40}/> Atribuciones Clave</h4><ul className="space-y-8 text-2xl font-light"><li>• Fiscalizar el cumplimiento de planes y programas municipales.</li><li>• Aprobar el presupuesto municipal anual (más de $75.000 millones).</li><li>• Normar las ordenanzas que rigen la convivencia de la ciudad.</li></ul></div></>} 
    />;

    // 4. DIRECCIONES
    case 4: return <ChapterLayout title="Estructura" subtitle="Direcciones Municipales Estratégicas" 
      visual={<div className="flex items-center justify-center h-full p-8"><img src="/img/organigrama_full.png" className="max-h-full object-contain drop-shadow-[0_0_60px_rgba(220,38,38,0.2)] shadow-2xl rounded-3xl" onError={(e) => e.currentTarget.src='https://placehold.co/800x1200?text=Mapa+Estructural'}/></div>}
      content={<><p className="text-3xl font-black text-white italic border-l-8 border-red-600 pl-8 uppercase tracking-tighter">Organización del Servicio:</p><div className="grid gap-8 mt-10">
        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-red-600/10 transition-all hover:scale-[1.02]"><Heart className="text-red-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">DIDECO</h4><p className="text-slate-400 text-xl mt-4 font-light leading-relaxed">Desarrollo Comunitario: El motor social directo hacia el vecino, organizaciones y bienestar social.</p></div></div>
        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex gap-8 items-center shadow-xl group hover:bg-blue-600/10 transition-all hover:scale-[1.02]"><Building2 className="text-blue-500 group-hover:scale-110 transition-transform" size={60}/><div><h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">DOM</h4><p className="text-slate-400 text-xl mt-4 font-light leading-relaxed">Obras Municipales: El brazo constructor y fiscalizador del espacio urbano y la edificación.</p></div></div>
      </div></>} 
    />;

    // 5. PÚBLICOS
    case 5: return <ChapterLayout title="Ecosistema" subtitle="Nuestros Públicos y Colaboradores" 
      visual={<div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-12"><div className="bg-white text-slate-950 font-black p-14 rounded-full mb-16 text-8xl shadow-[0_0_80px_rgba(255,255,255,0.4)] animate-pulse">IMLS</div><div className="grid grid-cols-2 gap-12 text-center text-sm w-full max-w-3xl"><div className="bg-blue-600/30 p-12 rounded-[4rem] border border-blue-500/50 flex flex-col items-center gap-6 shadow-2xl transition-transform hover:scale-110"><Users size={80}/><span className="font-black uppercase tracking-widest text-2xl">VECINOS</span></div><div className="bg-green-600/30 p-12 rounded-[4rem] border border-green-500/50 flex flex-col items-center gap-6 shadow-2xl transition-transform hover:scale-110"><Landmark size={80}/><span className="font-black uppercase tracking-widest text-2xl">GOBIERNO</span></div></div></div>}
      content={<><p className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none mb-6">Un Municipio Conectado.</p><p className="text-2xl font-light leading-relaxed">No somos una isla administrativa. La IMLS interactúa con un ecosistema complejo donde el **Vecino** es el eje central de toda estrategia. Nuestra gestión se coordina con el Gobierno Regional, Delegaciones Territoriales, Carabineros, Bomberos y el sector privado para garantizar seguridad y desarrollo en cada rincón de La Serena.</p></>} 
    />;

    // 6. SEGURIDAD CIUDADANA 1420
    case 6: return <ChapterLayout title="Seguridad" subtitle="Prevención y Emergencia 1420" 
      visual={<div className="p-20 text-center animate-in zoom-in duration-1000"><Phone size={180} className="text-red-600 mx-auto drop-shadow-[0_0_40px_red]"/><h4 className="text-white font-black text-[10rem] mt-12 tracking-tighter italic leading-none drop-shadow-2xl">1420</h4></div>}
      content={
        <>
          <p className="text-4xl font-black text-white mb-10 uppercase tracking-tighter italic leading-none">Tu tranquilidad es nuestra prioridad.</p>
          <p className="text-2xl font-light leading-relaxed">La Dirección de Seguridad Ciudadana despliega patrullajes preventivos constantes y monitorea una red de cámaras de alta tecnología con IA las 24 horas del día.</p>
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-12 mt-12">
             <div className="flex gap-10 items-center border-b border-white/5 pb-12 group cursor-pointer">
               <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl transition-transform group-hover:scale-110"><Phone size={60}/></div>
               <div><h4 className="font-black text-white text-6xl">LÍNEA 1420</h4><p className="text-2xl text-slate-400 uppercase tracking-widest font-black mt-2">Central de Emergencias Municipales</p></div>
             </div>
             <div className="flex gap-10 items-center group cursor-pointer">
               <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl transition-transform group-hover:scale-110"><Eye size={60}/></div>
               <div><h4 className="font-black text-white text-5xl uppercase italic leading-none">Vigilancia con IA</h4><p className="text-2xl text-slate-400 mt-2 font-light italic">Monitoreo Preventivo Inteligente.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    // 7. CALIDAD DE VIDA
    case 7: return <ChapterLayout title="Bienestar" subtitle="Tu Calidad de Vida es Prioritaria" 
      visual={<div className="p-16 text-center animate-in zoom-in duration-1000"><HeartHandshake size={260} className="text-red-600 drop-shadow-[0_0_60px_rgba(220,38,38,0.5)]"/><h4 className="text-white font-black text-6xl mt-16 uppercase italic tracking-tighter leading-none shadow-2xl italic">SERVIDORES<br/>DE EXCELENCIA</h4></div>}
      content={<><p className="text-4xl font-black text-white mb-10 italic border-l-8 border-red-600 pl-10 uppercase tracking-tighter">Cuidamos a quienes cuidan la ciudad.</p><div className="space-y-12 mt-12">
        <div className="p-12 border-2 border-green-500/30 bg-green-500/10 rounded-[4rem] flex gap-12 items-center shadow-2xl hover:border-green-400 transition-all group"><Stethoscope size={100} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter">Salud & Psicología</h4><p className="text-2xl text-slate-400 font-light leading-snug italic">Convenios dentales, seguros médicos de alto estándar y equipo de psicólogos permanente para contención emocional.</p></div></div>
        <div className="p-12 border-2 border-blue-500/30 bg-blue-500/10 rounded-[4rem] flex gap-12 items-center shadow-2xl hover:border-blue-400 transition-all group"><Activity size={100} className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform"/><div className="space-y-3"><h4 className="font-black text-white text-4xl uppercase tracking-tighter">Deporte & Bienestar</h4><p className="text-2xl text-slate-400 font-light leading-snug italic">Acceso gratuito a recintos deportivos municipales, ligas internas y talleres de pausa activa para reducir el estrés.</p></div></div>
      </div></>} 
    />;

    // 8. LEY KARIN
    case 8: return <ChapterLayout title="Ley Karin" subtitle="Dignidad Laboral y Respeto (21.643)" 
      visual={<div className="p-24 text-center"><Shield size={280} className="text-pink-600 mx-auto drop-shadow-[0_0_60px_rgba(219,39,119,0.5)]"/><h4 className="text-pink-100 font-black text-7xl mt-12 uppercase tracking-tighter leading-none italic shadow-2xl">DIGNIDAD<br/>MUNICIPAL</h4></div>}
      content={<><p className="text-5xl font-black text-white mb-12 italic uppercase leading-none border-b border-white/5 pb-10 tracking-tighter text-center">Tolerancia Cero.</p><p className="text-3xl font-light italic text-slate-400 mb-10 leading-relaxed text-center">"Tu derecho es trabajar en paz. Nuestra obligación es protegerte."</p><p className="text-2xl font-light">La **Ley Karin** mandata la prevención y sanción del acoso laboral, sexual y la violencia. Contamos con protocolos inmediatos para proteger tu integridad física y psíquica:</p><div className="grid grid-cols-1 gap-12 mt-14"><div className="bg-pink-600/10 p-14 rounded-[4rem] border border-pink-500/30 flex items-center gap-14 shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer active:scale-95"><AlertTriangle className="text-pink-500" size={80}/><div className="space-y-2"><h5 className="text-white font-black text-4xl uppercase tracking-tighter italic">Acoso Laboral</h5><p className="text-2xl text-slate-400 font-light leading-relaxed">Hostigamiento o agresión que atente contra tu dignidad o salud.</p></div></div></div><p className="mt-16 font-black text-white bg-white/5 p-14 rounded-[3.5rem] text-center border border-white/10 uppercase italic leading-tight text-3xl italic font-serif">"Un solo acto grave es suficiente para activar la protección de ley."</p></>} 
    />;

    // 9. SEGURIDAD ACHS
    case 9: return <ChapterLayout title="Protección" subtitle="Seguridad ACHS y Protocolos de Vida" 
      visual={<div className="p-24 animate-bounce"><AlertTriangle size={280} className="text-yellow-500 mx-auto drop-shadow-[0_0_50px_rgba(234,179,8,0.5)]"/><div className="h-6 w-56 bg-black/70 rounded-full mx-auto mt-10 blur-3xl opacity-50"></div></div>}
      content={<><h4 className="text-yellow-500 font-black text-6xl uppercase tracking-tighter mb-14 border-b border-yellow-500/20 pb-8 italic leading-none">SEGURO LEY 16.744</h4><p className="text-4xl mb-12 font-black text-white italic tracking-tighter uppercase leading-none border-l-8 border-red-600 pl-8">Protocolo Ante Accidentes:</p><div className="bg-white/5 p-14 rounded-[5rem] border border-white/10 space-y-20 shadow-2xl"><div className="flex gap-14 items-start group"><div className="bg-yellow-500 text-slate-950 w-28 h-28 rounded-3xl flex items-center justify-center font-black text-6xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">1</div><div className="space-y-4"><h5 className="font-black text-white text-5xl uppercase tracking-tighter leading-none italic">Avisa a Jefatura</h5><p className="text-3xl text-slate-400 font-light leading-relaxed italic">Debes informar obligatoriamente a tu superior directo en el momento exacto del incidente.</p></div></div><div className="flex gap-14 items-start group"><div className="bg-yellow-500 text-slate-950 w-28 h-28 rounded-3xl flex items-center justify-center font-black text-6xl shrink-0 shadow-2xl transition-transform group-hover:rotate-12">2</div><div className="space-y-4"><h5 className="font-black text-white text-5xl uppercase tracking-tighter leading-none italic">Centro ACHS</h5><p className="text-3xl text-slate-400 font-light leading-relaxed italic">Acude a la Mutualidad (ACHS) para el registro médico oficial (DIAT). ¡No te retires a casa sin esto!</p></div></div></div><div className="mt-20 bg-blue-600/20 p-14 rounded-[5rem] border border-blue-500/30 shadow-[0_0_100px_rgba(37,99,235,0.2)]"><h4 className="text-blue-400 font-black text-5xl uppercase tracking-tighter flex items-center gap-10 mb-10 italic leading-none"><MapPin size={70}/> ZONA DE SEGURIDAD</h4><p className="text-3xl leading-relaxed font-light italic">La Serena es costera. Ante un sismo grado VII o superior que impida mantenerse en pie: **EVACUAR HACIA LA COTA 30** (Sobre Avenida Cisternas hacia el oriente).</p></div></>} 
    />;

    // 10. EDUCACIÓN
    case 10: return <ChapterLayout title="Educación" subtitle="Capacitación Continua e Innovación" 
      visual={<div className="p-20 animate-in zoom-in duration-1000"><GraduationCap size={260} className="text-red-600 drop-shadow-[0_0_60px_red] animate-pulse"/></div>}
      content={<><p className="text-5xl font-black text-white mb-12 border-b border-white/5 pb-10 uppercase italic tracking-tighter leading-none shadow-xl">Formación de Clase Mundial.</p><p className="text-3xl font-light italic leading-relaxed">En la IMLS impulsamos tu crecimiento profesional como motor de cambio para nuestra ciudad. Accede a nuestras plataformas de educación:</p><div className="grid gap-12 mt-16"><div className="p-14 bg-white/5 rounded-[4rem] border border-white/10 flex items-center gap-14 shadow-2xl transition-all hover:bg-white/10 group cursor-pointer"><BookOpen className="text-red-500 group-hover:scale-110 transition-transform shadow-2xl shadow-red-500/20" size={90}/><div><h4 className="text-white font-black text-5xl uppercase tracking-tighter leading-none italic">Academia Digital</h4><p className="text-slate-400 text-2xl mt-4 font-light italic leading-snug">Cursos certificados de gestión pública moderna y herramientas Smart City.</p></div></div><div className="p-14 bg-white/5 rounded-[4rem] border border-white/10 flex items-center gap-14 shadow-2xl transition-all hover:bg-white/10 group cursor-pointer"><Zap className="text-orange-500 group-hover:scale-110 transition-transform shadow-2xl shadow-orange-500/20" size={90}/><div><h4 className="text-white font-black text-5xl uppercase tracking-tighter leading-none italic">Sello de Innovación</h4><p className="text-slate-400 text-2xl mt-4 font-light italic leading-snug">Talleres presenciales para proponer soluciones tecnológicas a los desafíos de La Serena.</p></div></div></div></>} 
    />;

    // 11. EVALUACIÓN (CON LÓGICA DE DIPLOMA)
    case 11: return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-slate-900 p-12 lg:p-24 rounded-[6rem] shadow-[0_0_150px_rgba(0,0,0,0.9)] w-full max-w-7xl border border-white/10 relative overflow-hidden animate-in zoom-in duration-1000 ring-1 ring-white/5">
           <div className="absolute top-0 left-0 w-full h-4 bg-white/5 overflow-hidden rounded-t-[6rem]"><div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_40px_red]" style={{width: `${((quizIndex+1)/10)*100}%`}}></div></div>
           {!quizFinished ? (
             <div className="space-y-16 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-16 text-[16px] font-black text-slate-500 uppercase tracking-[0.6em] border-b border-white/5 pb-10"><span>CERTIFICACIÓN DE INGRESO IMLS</span><span className="bg-red-600 text-white px-8 py-4 rounded-full font-black text-2xl shadow-2xl animate-pulse">PREGUNTA {quizIndex + 1} / 10</span></div>
               <h3 className="text-6xl lg:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase italic drop-shadow-2xl">{QUESTIONS[quizIndex].q}</h3>
               <div className="grid gap-8 pt-12">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} disabled={quizState !== 'waiting'} className={`w-full text-left p-14 rounded-[3.5rem] border-2 font-black text-4xl transition-all shadow-2xl ${quizState === 'waiting' ? 'border-white/10 hover:bg-white/5 text-white hover:border-red-600 hover:scale-[1.02] active:scale-95' : i === QUESTIONS[quizIndex].ans ? 'bg-green-600/30 border-green-600 text-green-400 shadow-[0_0_80px_rgba(22,163,74,0.4)] scale-105 rotate-1' : 'opacity-20 grayscale text-white scale-95 border-transparent'}`}>{opt}</button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-20 p-16 rounded-[5rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-12 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] border-l-[15px] border-red-600">
                    <p className="text-white text-5xl font-light italic leading-snug font-serif tracking-tight">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={() => { setQuizState('waiting'); if(quizIndex < 9) setQuizIndex(quizIndex+1); else setQuizFinished(true); }} className="w-full mt-20 bg-white text-slate-950 p-12 rounded-[3.5rem] font-black uppercase text-2xl tracking-[0.5em] hover:bg-red-600 hover:text-white transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-10 shadow-white/5">CONTINUAR EVALUACIÓN <ArrowRight size={48}/></button>
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-20 animate-in zoom-in duration-1000">
               <Award size={300} className="mx-auto text-yellow-500 mb-20 drop-shadow-[0_0_100px_rgba(234,179,8,0.7)] animate-bounce" />
               <h2 className="text-[10rem] lg:text-[13rem] font-black text-white mb-16 tracking-tighter uppercase italic leading-[0.7] shadow-xl">¡LOGRADO!</h2>
               <p className="text-slate-400 mb-32 text-5xl font-light max-w-6xl mx-auto leading-relaxed italic font-serif">Has superado la evaluación institucional con un éxito rotundo. Bienvenido a la excelencia municipal.</p>
               <button onClick={() => setStep(12)} className="w-full bg-red-600 text-white py-16 rounded-[5rem] font-black shadow-[0_40px_100px_rgba(220,38,38,0.5)] hover:scale-105 transition-all uppercase tracking-[0.4em] text-5xl ring-8 ring-red-500/20">OBTENER MI DIPLOMA OFICIAL</button>
             </div>
           )}
        </div>
      </div>
    );

    // 12. FINAL CORPORATIVO (DIPLOMA + RDMLS + REDES)
    case 12: return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-y-auto font-sans">
         <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-25 bg-cover blur-md scale-110"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/98 to-transparent"></div>
         
         <div className="bg-white/5 p-16 lg:p-32 rounded-[8rem] backdrop-blur-3xl border border-white/10 max-w-7xl w-full shadow-2xl relative z-10 animate-in zoom-in duration-1000 mb-20 mt-10 ring-1 ring-white/5">
            
            {/* DIPLOMA INSTITUCIONAL */}
            <div className="bg-white p-16 lg:p-24 rounded-[5rem] shadow-[0_80px_150px_rgba(0,0,0,1)] mb-32 border-[30px] border-double border-slate-200 text-slate-900 text-left relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5"><img src="/img/escudo.png" className="h-[600px]" /></div>
               <div className="flex justify-between items-center mb-20 border-b-4 border-slate-100 pb-12">
                  <img src="/img/escudo.png" className="h-32 shadow-2xl" />
                  <img src="/img/innovacion.png" className="h-32 shadow-2xl" />
               </div>
               <h1 className="text-9xl font-serif font-black uppercase tracking-[0.3em] mb-10 leading-none italic">DIPLOMA</h1>
               <p className="text-4xl italic text-slate-400 mb-20 uppercase border-y-4 border-slate-50 py-10 tracking-[0.5em] font-light italic">Aprobación Inducción Corporativa IMLS 2026</p>
               <h2 className="text-8xl lg:text-[9rem] font-black uppercase mb-12 tracking-tighter border-b-[15px] border-red-600 inline-block px-6 pb-6 shadow-sm">{userData.nombres} {userData.apellidos}</h2>
               <p className="text-4xl font-bold text-slate-500 uppercase tracking-[0.6em] mb-20">RUT: {userData.rut} • {userData.dept}</p>
               <p className="text-4xl text-slate-800 max-w-6xl font-light leading-relaxed mb-24 font-serif italic italic shadow-inner bg-slate-50 p-10 rounded-3xl">"Se certifica que el funcionario ha cumplido con éxito absoluto los requerimientos formativos, éticos y técnicos para su ingreso oficial a la **Ilustre Municipalidad de La Serena**."</p>
               <div className="flex justify-between items-end mt-40">
                  <div className="text-center w-[400px] border-t-8 border-slate-300 pt-12 text-[14px] font-black uppercase text-slate-500 tracking-[0.4em] shadow-xl"><img src="/img/firma_personas.png" className="h-32 mx-auto mb-8 opacity-90" />DIRECTOR GESTIÓN DE PERSONAS</div>
                  <div className="text-center text-slate-300 font-serif italic text-4xl tracking-[0.3em] pb-10 underline underline-offset-[20px] decoration-red-600/30">{currentTime.toLocaleDateString()}</div>
                  <div className="text-center w-[400px] border-t-8 border-slate-300 pt-12 text-[14px] font-black uppercase text-slate-500 tracking-[0.4em] shadow-xl"><img src="/img/firma_alcaldesa.png" className="h-32 mx-auto mb-8 opacity-90" />DANIELA NORAMBUENA - ALCALDESA</div>
               </div>
            </div>

            {/* SECCIÓN RDMLS Y COMUNIDAD DIGITAL */}
            <div className="grid md:grid-cols-2 gap-32 text-left bg-black/70 p-24 lg:p-40 rounded-[8rem] border border-white/5 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]">
               <div className="flex flex-col items-center justify-center bg-white p-24 rounded-[6rem] shadow-[0_0_120px_rgba(255,255,255,0.25)] group transition-all hover:scale-105 active:scale-90 cursor-pointer">
                  <QrCode size={450} className="text-slate-950"/>
                  <p className="text-slate-950 font-black mt-20 text-5xl uppercase tracking-[0.7em] shadow-2xl">RADIO RDMLS</p>
               </div>
               <div className="space-y-24 flex flex-col justify-center">
                  <div className="flex items-center gap-16 group cursor-pointer hover:translate-x-12 transition-transform hover:text-red-500"><div className="p-10 bg-red-600 rounded-[4rem] shadow-[0_0_80px_rgba(220,38,38,0.7)] group-hover:rotate-[360deg] transition-all duration-1000"><Radio size={80}/></div><div className="space-y-4"><span className="font-black text-8xl tracking-tighter uppercase block leading-none italic shadow-2xl">Radio Digital</span><p className="text-slate-400 text-3xl font-light italic">Sintoniza la voz oficial de la ciudad.</p></div></div>
                  <div className="flex items-center gap-16 group cursor-pointer hover:translate-x-12 transition-transform hover:text-blue-500"><div className="p-10 bg-blue-600 rounded-[4rem] shadow-[0_0_80px_rgba(37,99,235,0.7)] group-hover:rotate-[360deg] transition-all duration-1000"><Globe size={80}/></div><div className="space-y-4"><span className="font-black text-8xl tracking-tighter uppercase block leading-none italic shadow-2xl">Portal Web</span><p className="text-slate-400 text-3xl font-light italic">Trámites e innovación 24/7.</p></div></div>
                  <button className="mt-20 bg-white text-slate-950 w-full py-16 rounded-[5rem] font-black transition-all shadow-[0_60px_150px_rgba(255,255,255,0.2)] hover:bg-red-600 hover:text-white text-5xl tracking-[0.4em] uppercase transform hover:scale-105 active:scale-95 flex items-center justify-center gap-14 shadow-2xl" onClick={() => window.print()}><Printer size={64}/> IMPRIMIR MI DIPLOMA</button>
               </div>
            </div>
            
            <div className="mt-40 flex flex-col items-center gap-16">
              <div className="flex justify-center gap-40 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                <img src="/img/escudo.png" className="h-40 object-contain" />
                <img src="/img/innovacion.png" className="h-40 object-contain" />
              </div>
              <p className="text-slate-700 font-black uppercase tracking-[2em] text-lg animate-pulse mt-20 italic">ILUSTRE MUNICIPALIDAD DE LA SERENA • CHILE</p>
              <button onClick={() => setStep(0)} className="text-slate-800 hover:text-red-500 flex items-center justify-center gap-12 text-sm uppercase tracking-[1.5em] font-black transition-colors w-full mt-32 group italic"><RefreshCw size={36} className="group-hover:rotate-180 transition-transform duration-1000"/> CERRAR SESIÓN SEGURA</button>
            </div>
         </div>
         <p className="text-slate-900 text-[10px] font-black uppercase tracking-[2em] mb-20 opacity-20">PLATAFORMA DE INNOVACIÓN MUNICIPAL • RDMLS</p>
      </div>
    );

    default: return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500 p-20">
        <div className="text-center p-24 bg-slate-900 rounded-[6rem] shadow-[0_0_100px_rgba(220,38,38,0.3)] border border-red-900/50 animate-in zoom-in">
          <AlertTriangle size={200} className="mx-auto mb-16 animate-bounce" />
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-10 italic leading-none">SECUENCIA INTERRUMPIDA</h1>
          <p className="text-3xl text-slate-400 mb-16 font-light italic">No se pudo cargar el paso {step}. Reiniciando protocolos de seguridad...</p>
          <button onClick={() => setStep(0)} className="bg-red-600 text-white px-24 py-10 rounded-[3rem] font-black uppercase tracking-widest text-2xl shadow-red-900/50 hover:bg-red-500 transition-all hover:scale-105 active:scale-95 shadow-2xl">RESTAURAR INDUCCIÓN</button>
        </div>
      </div>
    );
  }
}
