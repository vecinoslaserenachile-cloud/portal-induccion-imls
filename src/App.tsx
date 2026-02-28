import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, XCircle, User, FileText, Map, Briefcase, MapPin, Building2, Lightbulb, Clock, QrCode, Smartphone
} from 'lucide-react';

// --- BASE DE DATOS DEPARTAMENTOS ---
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

// --- QUIZ DIDÁCTICO ---
const QUESTIONS = [
  { 
    q: "¿Quiénes componen el equipo municipal?", 
    options: ["Solo los de planta", "Planta, Contrata y Honorarios", "Solo los jefes"], 
    ans: 1,
    explanation: "¡Correcto! Todos somos funcionarios públicos al servicio de la comunidad, sin importar el tipo de contrato."
  },
  { 
    q: "¿Cuál es la misión principal del municipio?", 
    options: ["Generar ganancias", "Mejorar la calidad de vida de los vecinos", "Hacer trámites"], 
    ans: 1,
    explanation: "Exacto. El vecino es el centro de nuestra gestión."
  },
  { 
    q: "¿Cuántos concejales fiscalizan la gestión 2024-2028?", 
    options: ["6 Concejales", "8 Concejales", "10 Concejales"], 
    ans: 2,
    explanation: "Así es. Son 10 concejales electos democráticamente."
  },
  { 
    q: "¿Qué hago ante un accidente laboral?", 
    options: ["Me voy a la casa", "Aviso INMEDIATAMENTE a mi jefatura", "Espero a ver si pasa"], 
    ans: 1,
    explanation: "¡Vital! Debes avisar de inmediato para activar el seguro ACHS."
  },
  { 
    q: "¿Qué sanciona la Ley Karin?", 
    options: ["Acoso laboral, sexual y violencia", "Llegar tarde", "Uso de celular"], 
    ans: 0,
    explanation: "Correcto. Tolerancia cero al acoso y violencia en el trabajo."
  },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTES ---
const Footer = () => (
  <div className="w-full bg-slate-900 text-slate-500 text-[10px] uppercase tracking-widest text-center py-4 border-t border-slate-800 print:hidden shrink-0">
    IMLS Inducción 2026 • Ilustre Municipalidad de La Serena
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 12; // 0-Login, 1-8 Contenido, 9 Quiz, 10 Certificado, 11 Comunidad

  // Reloj para el certificado
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGICA SCROLL ---
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      if (isAtBottom || isShort) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos libres: Login(0), Video(1), Quiz(9), Certificado(10), Comunidad(11)
    if ([0, 1, 9, 10, 11].includes(step)) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 500);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // --- LOGICA QUIZ (CORREGIDA) ---
  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return; 

    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    if (isCorrect) {
      setQuizState('correct');
      setScore(prev => prev + 1); // Actualización segura
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

  // --- LAYOUT MAESTRO ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden print:hidden">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* MÓVIL: Visual Arriba */}
      <div className="lg:hidden w-full h-[35vh] bg-slate-100 border-b border-slate-200 relative shrink-0">
         {visual}
      </div>

      {/* ESCRITORIO: Visual Derecha */}
      <div className="hidden lg:flex w-1/2 h-full bg-slate-100 items-center justify-center border-l border-slate-200 relative">
        {visual}
      </div>

      {/* CONTENIDO SCROLLABLE */}
      <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full relative z-10 bg-white">
        
        <div className="px-6 lg:px-12 pt-6 pb-2 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-1">
            <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Módulo {step}/{totalSteps}</p>
            <span className="text-slate-400 text-[10px] font-bold">{Math.round((step/totalSteps)*100)}%</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-none">{title}</h2>
          <h3 className="text-sm lg:text-lg text-slate-500 font-medium italic mt-1">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-6 lg:px-12 py-4 space-y-4 text-base lg:text-lg text-slate-600 leading-relaxed text-justify">
          {content}
          {!canAdvance && (
            <div className="h-16 flex items-center justify-center opacity-50 animate-pulse text-red-500 font-bold text-xs">
              <ChevronDown className="animate-bounce mr-1"/> Desliza para leer
            </div>
          )}
          {/* Padding extra para móvil */}
          <div className="h-24 lg:h-8"></div>
        </div>

        <div className="px-6 lg:px-12 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 mb-safe">
           <div className="text-[10px] font-bold uppercase tracking-widest">
             {canAdvance ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Listo</span> : <span className="text-slate-400">Lee todo</span>}
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2 text-sm">
             Continuar <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );

  // --- PASOS ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden print:hidden">
      <div className="absolute inset-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col h-full justify-center overflow-y-auto pb-24">
        <div className="text-center mb-6">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-20 mx-auto mb-4 drop-shadow-lg" alt="Escudo" />
          <h1 className="text-4xl font-black text-white tracking-tighter">INDUCCIÓN 2026</h1>
          <p className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs">Ilustre Municipalidad de La Serena</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Nombres</label>
                <input className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" placeholder="Ej: Rodrigo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Apellidos</label>
                <input className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" placeholder="Ej: Godoy" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
             </div>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">RUT</label>
             <input className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" placeholder="12.345.678-9" onChange={e => setUserData({...userData, rut: e.target.value})} />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Cargo</label>
             <input className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" placeholder="Ej: Administrativo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Departamento</label>
            <select className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu área...</option>
              {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
          </div>
          <button disabled={!userData.nombres || !userData.apellidos || !userData.rut || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-center gap-2 mt-4 items-center disabled:opacity-50">
            INICIAR SESIÓN <ChevronRight size={18}/>
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Alcaldesa Daniela Norambuena" 
      visual={
        <div className="w-full h-full bg-black flex items-center justify-center">
           {/* Contenedor que ocupa todo el espacio sin bordes */}
           <iframe className="w-full h-full object-cover" src={`https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&mute=0&controls=0&loop=1&playlist=EQUdyb-YVxM&rel=0`} title="Video Alcaldesa" frameBorder="0" allowFullScreen></iframe>
        </div>
      }
      content={
        <>
           <p className="font-bold text-xl text-slate-800">¡Hola, {userData.nombres}!</p>
           <p>Te damos la más cordial bienvenida a la Ilustre Municipalidad de La Serena. Hoy te sumas a un equipo comprometido con el desarrollo de la segunda ciudad más antigua de Chile.</p>
           <p className="bg-slate-100 p-4 rounded-lg border-l-4 border-red-600 italic">"Nuestro compromiso es modernizar la gestión para estar más cerca de cada vecino." - Alcaldesa Daniela Norambuena.</p>
        </>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión, Visión y Valores" 
      visual={
        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-8">
           <div className="space-y-8 text-center">
              <div><Lightbulb size={40} className="text-yellow-400 mx-auto mb-2"/><h4 className="font-black text-2xl">MISIÓN</h4><p className="text-sm text-slate-300">Mejorar la calidad de vida con gestión participativa.</p></div>
              <div><MapPin size={40} className="text-red-500 mx-auto mb-2"/><h4 className="font-black text-2xl">VISIÓN</h4><p className="text-sm text-slate-300">Líderes en turismo, patrimonio y desarrollo sostenible.</p></div>
              <div><Heart size={40} className="text-pink-500 mx-auto mb-2"/><h4 className="font-black text-2xl">VALORES</h4><p className="text-sm text-slate-300">Probidad • Transparencia • Cercanía</p></div>
           </div>
        </div>
      }
      content={
        <>
          <p>Para remar todos hacia el mismo lado, debemos tener clara nuestra Carta de Navegación.</p>
          <p><strong>Probidad:</strong> Actuamos siempre con rectitud. Los recursos municipales son sagrados.</p>
          <p><strong>Cercanía:</strong> Empatizamos con el problema del vecino. No somos burócratas, somos servidores.</p>
          <p><strong>Innovación:</strong> Buscamos nuevas formas de resolver problemas. Tu creatividad es bienvenida.</p>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Periodo 2024 - 2028" 
      visual={
        <div className="h-full w-full bg-slate-50 overflow-y-auto p-4 flex flex-wrap content-center justify-center gap-3">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-2 w-32 rounded-lg shadow-sm flex flex-col items-center text-center border border-slate-100">
                 <div className="w-12 h-12 bg-slate-200 rounded-full mb-1 overflow-hidden">
                   <img src={`/img/concejal_${i+1}.jpg`} onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover" alt="Foto"/>
                   <User className="w-full h-full p-2 text-slate-300" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-800 leading-tight">{name}</p>
               </div>
            ))}
        </div>
      }
      content={
        <>
          <p>La administración cuenta con un <strong>Concejo Municipal</strong> de 10 concejales electos democráticamente.</p>
          <p><strong>Funciones Clave:</strong> 
             <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
               <li><strong>Normar:</strong> Aprueban ordenanzas comunales.</li>
               <li><strong>Fiscalizar:</strong> Revisan que el presupuesto se gaste correctamente.</li>
               <li><strong>Resolver:</strong> Aprueban patentes y licitaciones importantes.</li>
             </ul>
          </p>
          <p>Ellos representan la voz de la ciudadanía y trabajan en comisiones que deberás conocer.</p>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Nuestra Estructura" subtitle="Organigrama Municipal" 
      visual={<div className="flex items-center justify-center h-full bg-slate-50 p-4"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1000/png?text=Organigrama+Detallado'} className="max-h-full max-w-full shadow-lg rounded-xl" /></div>}
      content={
        <>
          <p>Somos una institución grande. Entender el organigrama es vital para saber a quién acudir.</p>
          <p><strong>Direcciones Clave:</strong></p>
          <ul className="space-y-2 text-sm">
             <li className="flex gap-2"><Briefcase size={16} className="text-red-500 shrink-0"/> <strong>DIDECO:</strong> El corazón social. Ayudas y organizaciones comunitarias.</li>
             <li className="flex gap-2"><Building2 size={16} className="text-blue-500 shrink-0"/> <strong>DOM:</strong> Obras. Permisos de edificación y urbanismo.</li>
             <li className="flex gap-2"><Map size={16} className="text-green-500 shrink-0"/> <strong>SECPLAN:</strong> Diseña los proyectos de inversión (plazas, estadios).</li>
             <li className="flex gap-2"><Shield size={16} className="text-yellow-500 shrink-0"/> <strong>SEGURIDAD:</strong> Prevención y televigilancia.</li>
          </ul>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Mapa de Públicos" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center bg-slate-50 overflow-hidden">
           <div className="absolute w-[80%] h-[80%] border border-slate-200 rounded-full animate-spin-slow opacity-20"></div>
           <div className="z-20 bg-red-600 text-white w-24 h-24 rounded-full flex items-center justify-center font-black shadow-xl animate-pulse">IMLS</div>
           <div className="absolute top-[20%] left-[20%] bg-blue-100 p-2 rounded-xl shadow text-[10px] font-bold text-blue-700 text-center w-20">Vecinos</div>
           <div className="absolute bottom-[20%] right-[20%] bg-green-100 p-2 rounded-xl shadow text-[10px] font-bold text-green-700 text-center w-20">Empresas</div>
           <div className="absolute top-[20%] right-[20%] bg-purple-100 p-2 rounded-xl shadow text-[10px] font-bold text-purple-700 text-center w-20">Gobierno</div>
           <div className="absolute bottom-[20%] left-[20%] bg-orange-100 p-2 rounded-xl shadow text-[10px] font-bold text-orange-700 text-center w-20">Turistas</div>
        </div>
      }
      content={
        <>
          <p>No somos una isla. Interactuamos constantemente:</p>
          <p><strong>El Vecino (Centro):</strong> Todo gira en torno a él. Desde el nacimiento hasta la asistencia social.</p>
          <p><strong>Proveedores:</strong> Socios estratégicos para ejecutar obras.</p>
          <p><strong>Instituciones:</strong> Carabineros, Bomberos, Gobierno Regional. La coordinación es vital.</p>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Equipo, Distintas Fechas" visual={<div className="flex items-center justify-center h-full bg-green-50"><DollarSign size={150} className="text-green-600 drop-shadow-md" /></div>} 
      content={
        <>
          <p>En el municipio conviven modalidades contractuales, pero <strong>todos somos compañeros</strong>.</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
             <div>
               <strong className="text-slate-900 block">PLANTA Y CONTRATA:</strong>
               <span className="text-slate-500">Pago: <strong>Penúltimo día hábil del mes</strong>. Se rigen por Estatuto Administrativo.</span>
             </div>
             <div className="border-t border-slate-200 pt-2">
               <strong className="text-slate-900 block">HONORARIOS:</strong>
               <span className="text-slate-500">Pago: Variable (primeros días del mes siguiente). Requiere informe de actividades.</span>
             </div>
             <div className="border-t border-slate-200 pt-2">
               <strong className="text-slate-900 block">CÓDIGO DEL TRABAJO:</strong>
               <span className="text-slate-500">Común en cementerios/servicios. Fechas según contrato colectivo.</span>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Espacios Dignos" visual={<div className="flex items-center justify-center h-full bg-pink-50"><Heart size={150} className="text-pink-500 animate-pulse" /></div>} 
      content={
        <>
          <p>La <strong>Ley N° 21.643</strong> establece un nuevo estándar. Tenemos <strong>Tolerancia Cero</strong> con:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Acoso Laboral.</li>
            <li>Acoso Sexual.</li>
            <li>Violencia en el trabajo (incluso de usuarios).</li>
          </ul>
          <p>Un solo acto grave basta para denunciar. Tenemos protocolos confidenciales para protegerte.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad Laboral" subtitle="Autocuidado" visual={<div className="flex items-center justify-center h-full bg-yellow-50"><Shield size={150} className="text-yellow-600" /></div>} 
      content={
        <>
          <p>La Serena es zona de tsunamis. Memoriza: <strong>Cota 30</strong> (Av. Cisternas hacia arriba).</p>
          <p><strong>Accidentes:</strong> Si te lesionas trabajando o en el trayecto directo:</p>
          <ol className="list-decimal ml-5 font-bold text-slate-800">
             <li>AVISA INMEDIATAMENTE a tu jefatura.</li>
             <li>Acude a la ACHS.</li>
             <li>No te vayas a casa sin el registro, o pierdes la cobertura.</li>
          </ol>
        </>
      } 
    />;
    
    // 9. QUIZ (Bug arreglado: garantiza terminación)
    case 9: return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden relative overflow-hidden">
        <div className="absolute top-0 w-full h-2 bg-slate-800"><div className="bg-green-500 h-full transition-all" style={{width: `${((quizIndex)/QUESTIONS.length)*100}%`}}></div></div>
        
        <div className="max-w-xl w-full relative z-10 pb-20 overflow-y-auto max-h-screen">
          {!quizFinished ? (
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-4">
                 <span>Evaluación Didáctica</span>
                 <span>{quizIndex+1} / {QUESTIONS.length}</span>
               </div>
               
               <h3 className="text-xl md:text-2xl font-black mb-6">{QUESTIONS[quizIndex].q}</h3>
               
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => handleAnswer(idx)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex justify-between items-center
                       ${quizState === 'waiting' ? 'border-slate-100 hover:border-blue-500 hover:bg-blue-50' : ''}
                       ${quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans ? 'border-green-500 bg-green-50 text-green-700' : ''}
                       ${quizState === 'wrong' && idx !== QUESTIONS[quizIndex].ans ? 'opacity-50' : ''}
                     `}
                   >
                     {opt}
                     {quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans && <CheckCircle className="text-green-600"/>}
                     {quizState === 'wrong' && idx !== QUESTIONS[quizIndex].ans && <div/>}
                   </button>
                 ))}
               </div>

               {quizState !== 'waiting' && (
                 <div className={`mt-6 p-4 rounded-xl ${quizState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-in fade-in slide-in-from-bottom-4`}>
                    <p className="font-bold mb-1">{quizState === 'correct' ? '¡Excelente!' : 'Ups, revisemos...'}</p>
                    <p className="text-sm">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className={`mt-4 w-full py-3 rounded-lg font-bold text-white shadow-lg ${quizState === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                      {quizIndex < QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white text-slate-900 p-8 md:p-12 rounded-[3rem] text-center shadow-2xl">
              <Award size={80} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-2">¡Evaluación Completa!</h2>
              <div className="text-5xl font-black text-green-600 mb-4">100%</div>
              <p className="text-slate-500 mb-6">Has demostrado conocer los valores de nuestra institución.</p>
              <button onClick={() => setStep(10)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
                Generar mi Certificado
              </button>
            </div>
          )}
        </div>
      </div>
    );

    // 10. CERTIFICADO (Con hora real)
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-12 max-w-5xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[10px] md:border-[20px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0 print:m-0">
          
          <div className="w-full flex justify-between items-start mb-4">
             <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Escudo"/>
             <img src="/img/innovacion.png" onError={(e) => e.currentTarget.style.display='none'} className="h-16 md:h-24 object-contain" alt="Sello"/>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
             <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-2 uppercase tracking-wide">CERTIFICADO</h1>
             <p className="text-lg md:text-xl text-slate-500 italic mb-6">De Aprobación de Inducción Corporativa</p>
             
             <p className="text-base text-slate-600 mb-1">Otorgado a:</p>
             <div className="border-b-2 border-slate-900 pb-2 mb-2 w-full max-w-2xl">
               <h2 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase">{userData.nombres} {userData.apellidos}</h2>
             </div>
             <p className="text-xs md:text-sm text-slate-400 font-bold mb-6">RUT: {userData.rut} • {userData.cargo} • {userData.dept}</p>
             
             <p className="text-base text-slate-600 mb-2">Por haber completado con distinción el programa de</p>
             <h3 className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-widest mb-4">Inducción Municipal 2026</h3>
          </div>
          
          <div className="flex justify-between w-full px-4 md:px-10 mt-8 items-end gap-4">
            <div className="text-center flex-1">
              <div className="h-12 border-b border-slate-400 mb-1"></div>
              <p className="text-[10px] font-bold uppercase text-slate-600">Gestión de Personas</p>
            </div>
            
            <div className="text-center mb-2 flex-1">
               <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm">
                 <Clock size={14}/> {currentTime.toLocaleTimeString()}
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

        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={() => setStep(11)} className="bg-slate-600 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all flex gap-2 font-bold items-center">
             Siguiente <ChevronRight size={16}/>
           </button>
           <button onClick={printCertificate} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             <Printer /> Descargar Diploma
           </button>
        </div>
      </div>
    );

    // 11. COMUNIDAD VIRTUAL (NUEVO)
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[url('/img/portada.jpg')] opacity-20 bg-cover"></div>
        <div className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
           <Smartphone size={60} className="mx-auto mb-4 text-cyan-400" />
           <h2 className="text-4xl font-black mb-2">¡Sigue Conectado!</h2>
           <p className="text-xl text-slate-300 mb-8">Únete a la comunidad virtual de La Serena a través de RDMLS y nuestros canales digitales.</p>
           
           <div className="bg-white p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="bg-slate-900 p-4 rounded-xl shrink-0">
                <QrCode size={120} className="text-white"/>
              </div>
              <div className="text-left">
                 <h3 className="text-slate-900 font-black text-xl mb-1">Escanea el código</h3>
                 <p className="text-slate-500 text-sm mb-4">Accede a "Serenito y sus vecinos", radio digital, tours 3D y todo el feedback de tu inducción.</p>
                 <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 w-full md:w-auto">
                   Ir al Portal RDMLS
                 </button>
              </div>
           </div>
           
           <button onClick={() => setStep(0)} className="mt-8 text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto">
             <RefreshCw size={14}/> Cerrar Sesión
           </button>
        </div>
      </div>
    );

    default: return null;
  }
}
