import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, Radio, Music, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, XCircle, User, FileText, Map, Briefcase, MapPin, Building2, Lightbulb
} from 'lucide-react';

// --- BASE DE DATOS DEPARTAMENTOS (Realista) ---
const DEPARTAMENTOS = [
  "Alcaldía", "Gabinete", "Administración Municipal", "Secretaría Municipal", 
  "Asesoría Jurídica", "Dirección de Control", "SECPLAN (Planificación)", 
  "DIDECO (Desarrollo Comunitario)", "DOM (Obras Municipales)", "Dirección de Tránsito",
  "Dirección de Gestión de Personas", "DAF (Admin. y Finanzas)", 
  "Dirección de Seguridad Ciudadana", "Dirección de Servicio a la Comunidad",
  "Dirección de Turismo y Patrimonio", "Departamento de Cultura",
  "Departamento de Comunicaciones", "Protección Civil y Emergencias",
  "Delegación Av. del Mar", "Delegación La Antena", "Delegación Las Compañías", 
  "Delegación Rural", "Delegación La Pampa",
  "Juzgado de Policía Local 1", "Juzgado de Policía Local 2",
  "Cementerios Municipales", "Bodega Municipal", "Talleres Municipales",
  "Corporación Gabriel González Videla (Salud)", "Corporación Gabriel González Videla (Educación)"
];

// --- QUIZ DIDÁCTICO (Con Explicación Inmediata) ---
const QUESTIONS = [
  { 
    q: "¿Quiénes componen el equipo municipal?", 
    options: ["Solo los de planta", "Planta, Contrata y Honorarios", "Solo los jefes"], 
    ans: 1,
    explanation: "¡Correcto! Aunque tengamos distintas fechas de pago o contratos, TODOS somos funcionarios públicos al servicio de la comunidad."
  },
  { 
    q: "¿Cuál es la misión principal del municipio?", 
    options: ["Generar ganancias", "Mejorar la calidad de vida de los vecinos", "Hacer trámites lentos"], 
    ans: 1,
    explanation: "Exacto. El vecino es el centro de nuestra gestión. Cada trámite o servicio busca su bienestar."
  },
  { 
    q: "¿Cuántos concejales fiscalizan la gestión 2024-2028?", 
    options: ["6 Concejales", "8 Concejales", "10 Concejales"], 
    ans: 2,
    explanation: "Así es. Son 10 concejales electos que, junto a la Alcaldesa, norman y fiscalizan el actuar municipal."
  },
  { 
    q: "¿Qué hago si sufro un accidente laboral?", 
    options: ["Me voy a la casa", "Aviso INMEDIATAMENTE a mi jefatura", "Me quedo callado"], 
    ans: 1,
    explanation: "¡Vital! Debes avisar de inmediato para activar el seguro de la Ley 16.744 (ACHS). El autocuidado es lo primero."
  },
  { 
    q: "¿Qué sanciona la Ley Karin?", 
    options: ["El acoso laboral, sexual y violencia", "Llegar tarde", "El uso de uniforme"], 
    ans: 0,
    explanation: "Correcto. Tolerancia cero al acoso y a la violencia, incluso de parte de terceros (usuarios) hacia funcionarios."
  },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTES ---
const Footer = () => (
  <div className="w-full bg-slate-900 text-slate-500 text-[10px] uppercase tracking-widest text-center py-2 border-t border-slate-800 print:hidden shrink-0 z-50">
    IMLS Inducción 2026 • Ilustre Municipalidad de La Serena
  </div>
);

const RadioPlayer = () => (
  <div className="fixed bottom-8 right-0 md:bottom-0 md:w-full bg-slate-900/90 backdrop-blur-md text-white p-2 md:p-3 flex items-center justify-between z-40 border-t border-slate-700 md:h-16 shadow-2xl print:hidden rounded-l-xl md:rounded-none w-auto">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={14} /></div>
      <div className="hidden md:block">
        <p className="font-bold leading-none text-sm">Radio IMLS</p>
        <p className="text-slate-400 text-[10px]">Señal Interna</p>
      </div>
    </div>
    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-4 hidden md:block">Capacitación Continua</div>
    <div className="flex items-center gap-4 text-slate-400"><Music size={16} /></div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  
  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting'); // waiting, correct, wrong
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 11; // Aumentamos pasos (Misión/Visión)

  // --- LOGICA SCROLL RESPONSIVE ---
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Tolerancia amplia para detectar el final
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      const isShort = el.scrollHeight <= el.clientHeight + 20;
      if (isAtBottom || isShort) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos sin bloqueo de lectura
    if ([0, 1, 10, 11].includes(step)) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 500); // Check inicial
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // --- LOGICA QUIZ DIDÁCTICO ---
  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return; // Evitar doble click

    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    if (isCorrect) {
      setQuizState('correct');
      setScore(s => s + 1);
    } else {
      setQuizState('wrong');
    }
  };

  const nextQuestion = () => {
    setQuizState('waiting');
    if (quizIndex < QUESTIONS.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setQuizFinished(true);
      if (score >= QUESTIONS.length - 1) setStep(11); // Aprueba con casi todo bueno
    }
  };

  const printCertificate = () => window.print();

  // --- LAYOUT MAESTRO (RESPONSIVE FIX) ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden print:hidden">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* MÓVIL: El visual va ARRIBA (35% alto) para que se vea el video */}
      <div className="lg:hidden w-full h-[35vh] bg-slate-100 border-b border-slate-200 relative shrink-0">
         {visual}
      </div>

      {/* ESCRITORIO: El visual va a la DERECHA (50% ancho) */}
      <div className="hidden lg:flex w-1/2 h-full bg-slate-100 items-center justify-center border-l border-slate-200 relative">
        {visual}
      </div>

      {/* CONTENIDO (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col h-[65vh] lg:h-full relative z-10 bg-white">
        
        {/* Header del paso */}
        <div className="px-6 lg:px-12 pt-6 pb-2 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-1">
            <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Módulo {step}/{totalSteps}</p>
            <span className="text-slate-400 text-[10px] font-bold">{Math.round((step/totalSteps)*100)}%</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-none">{title}</h2>
          <h3 className="text-sm lg:text-lg text-slate-500 font-medium italic mt-1">{subtitle}</h3>
        </div>
        
        {/* Texto con Scroll */}
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-6 lg:px-12 py-4 space-y-4 text-base lg:text-lg text-slate-600 leading-relaxed text-justify">
          {content}
          {!canAdvance && (
            <div className="h-16 flex items-center justify-center opacity-50 animate-pulse text-red-500 font-bold text-xs">
              <ChevronDown className="animate-bounce mr-1"/> Desliza para leer
            </div>
          )}
          <div className="h-8"></div>
        </div>

        {/* Botonera */}
        <div className="px-6 lg:px-12 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
           <div className="text-[10px] font-bold uppercase tracking-widest">
             {canAdvance ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Listo</span> : <span className="text-slate-400">Lee todo</span>}
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2 text-sm">
             Continuar <ChevronRight size={16} />
           </button>
        </div>
        <Footer />
      </div>

      <RadioPlayer />
    </div>
  );

  // --- PASO 0: LOGIN COMPLETO ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden print:hidden">
      <div className="absolute inset-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-30" alt="Fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col h-full justify-center overflow-y-auto">
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
             <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Cargo / Función</label>
             <input className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" placeholder="Ej: Administrativo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold pl-2">Departamento / Unidad</label>
            <select className="w-full p-3 rounded-lg bg-white/90 font-bold text-slate-900 text-sm" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu área...</option>
              {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button disabled={!userData.nombres || !userData.apellidos || !userData.rut || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-center gap-2 mt-4 items-center disabled:opacity-50 disabled:cursor-not-allowed">
            INICIAR SESIÓN <ChevronRight size={18}/>
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );

  // --- FLUJO DE CAPÍTULOS ---
  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Alcaldesa Daniela Norambuena" 
      visual={
        <div className="w-full h-full bg-black flex items-center justify-center">
           <div className="relative w-full h-full lg:w-[80%] lg:h-[90%] bg-black lg:rounded-2xl overflow-hidden shadow-2xl">
             <iframe className="w-full h-full" src={`https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&mute=0&controls=0&loop=1&playlist=EQUdyb-YVxM`} title="Video Alcaldesa" allow="autoplay; encrypted-media" frameBorder="0" allowFullScreen></iframe>
           </div>
        </div>
      }
      content={
        <>
           <p className="font-bold text-xl text-slate-800">¡Hola, {userData.nombres}!</p>
           <p>Te damos la más cordial bienvenida a la Ilustre Municipalidad de La Serena. Hoy te sumas a un equipo comprometido con el desarrollo de la segunda ciudad más antigua de Chile.</p>
           <p>Esta inducción es tu primer paso. Queremos que conozcas nuestra casa, nuestros valores y las reglas que nos permiten servir con excelencia.</p>
           <p className="bg-slate-100 p-4 rounded-lg border-l-4 border-red-600 italic">"Nuestro compromiso es modernizar la gestión para estar más cerca de cada vecino." - Alcaldesa Daniela Norambuena.</p>
        </>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión, Visión y Valores" 
      visual={
        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-8">
           <div className="space-y-8 text-center">
              <div><Lightbulb size={40} className="text-yellow-400 mx-auto mb-2"/><h4 className="font-black text-2xl">MISIÓN</h4><p className="text-sm text-slate-300">Mejorar la calidad de vida a través de una gestión participativa.</p></div>
              <div><MapPin size={40} className="text-red-500 mx-auto mb-2"/><h4 className="font-black text-2xl">VISIÓN</h4><p className="text-sm text-slate-300">Ser una comuna líder en turismo, patrimonio y desarrollo sostenible.</p></div>
              <div><Heart size={40} className="text-pink-500 mx-auto mb-2"/><h4 className="font-black text-2xl">VALORES</h4><p className="text-sm text-slate-300">Probidad • Transparencia • Cercanía • Eficiencia</p></div>
           </div>
        </div>
      }
      content={
        <>
          <p>Para remar todos hacia el mismo lado, debemos tener clara nuestra Carta de Navegación. Estos no son solo palabras bonitas, son el filtro para tomar decisiones.</p>
          <p><strong>Probidad:</strong> Actuamos siempre con rectitud y honestidad. Los recursos municipales son sagrados.</p>
          <p><strong>Cercanía:</strong> No somos burócratas detrás de un escritorio. Empatizamos con el problema del vecino.</p>
          <p><strong>Innovación:</strong> Buscamos nuevas formas de resolver viejos problemas. Tu creatividad es bienvenida aquí.</p>
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
          <p>La administración no la hace sola la Alcaldesa. Existe un <strong>Concejo Municipal</strong> compuesto por 10 concejales electos democráticamente.</p>
          <p><strong>¿Qué hacen?</strong> 
             <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
               <li><strong>Normar:</strong> Aprueban ordenanzas municipales.</li>
               <li><strong>Fiscalizar:</strong> Revisan que el presupuesto se gaste correctamente.</li>
               <li><strong>Resolver:</strong> Aprueban patentes de alcoholes, licitaciones grandes y el plan comunal.</li>
             </ul>
          </p>
          <p>Ellos representan la voz diversa de la ciudadanía. Es probable que debas presentar proyectos ante sus comisiones de trabajo.</p>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Nuestra Estructura" subtitle="Organigrama Municipal" 
      visual={<div className="flex items-center justify-center h-full bg-slate-50 p-4"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1000/png?text=Organigrama+Detallado'} className="max-h-full max-w-full shadow-lg rounded-xl" /></div>}
      content={
        <>
          <p>Somos una institución grande y compleja. Entender el organigrama es vital para saber a quién acudir.</p>
          <p><strong>Direcciones Clave:</strong></p>
          <ul className="space-y-2 text-sm">
             <li className="flex gap-2"><Briefcase size={16} className="text-red-500 shrink-0"/> <strong>DIDECO:</strong> El corazón social. Ayudas, organizaciones comunitarias y programas sociales.</li>
             <li className="flex gap-2"><Building2 size={16} className="text-blue-500 shrink-0"/> <strong>DOM:</strong> Obras. Permisos de edificación y urbanismo.</li>
             <li className="flex gap-2"><Map size={16} className="text-green-500 shrink-0"/> <strong>SECPLAN:</strong> El cerebro. Diseña los proyectos de inversión (plazas, estadios, pavimentos).</li>
             <li className="flex gap-2"><Shield size={16} className="text-yellow-500 shrink-0"/> <strong>SEGURIDAD:</strong> Prevención del delito y cámaras de televigilancia.</li>
          </ul>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Mapa de Públicos" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center bg-slate-50 overflow-hidden">
           {/* Representación Lúdica Sistema Solar */}
           <div className="absolute w-[600px] h-[600px] border border-slate-200 rounded-full animate-spin-slow opacity-20"></div>
           <div className="absolute w-[400px] h-[400px] border border-slate-300 rounded-full animate-spin-reverse opacity-30"></div>
           
           <div className="z-20 bg-red-600 text-white w-24 h-24 rounded-full flex items-center justify-center font-black shadow-xl animate-pulse">MUNICIPIO</div>
           
           <div className="absolute top-[20%] left-[20%] bg-blue-100 p-3 rounded-full shadow-md text-xs font-bold text-blue-700 flex flex-col items-center"><User size={20}/> Vecinos</div>
           <div className="absolute bottom-[20%] right-[20%] bg-green-100 p-3 rounded-full shadow-md text-xs font-bold text-green-700 flex flex-col items-center"><Building2 size={20}/> Empresas</div>
           <div className="absolute top-[20%] right-[20%] bg-purple-100 p-3 rounded-full shadow-md text-xs font-bold text-purple-700 flex flex-col items-center"><Shield size={20}/> Gobierno</div>
           <div className="absolute bottom-[20%] left-[20%] bg-orange-100 p-3 rounded-full shadow-md text-xs font-bold text-orange-700 flex flex-col items-center"><MapPin size={20}/> Turistas</div>
        </div>
      }
      content={
        <>
          <p>No somos una isla. Somos un ecosistema vivo interactuando constantemente.</p>
          <p><strong>El Vecino (Centro):</strong> Todo gira en torno a él. Desde que nace (Registro Civil) hasta que necesita asistencia social.</p>
          <p><strong>Proveedores y Privados:</strong> Socios estratégicos para ejecutar obras y servicios.</p>
          <p><strong>Otras Instituciones:</strong> Carabineros, Bomberos, Gobierno Regional. La coordinación con ellos es vital para emergencias y proyectos.</p>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Solo Equipo, Distintas Fechas" visual={<div className="flex items-center justify-center h-full bg-green-50"><DollarSign size={150} className="text-green-600 drop-shadow-md" /></div>} 
      content={
        <>
          <p>En el municipio conviven distintas modalidades contractuales, pero <strong>todos somos compañeros de trabajo</strong> con la misma camiseta.</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
             <div>
               <strong className="text-slate-900 block">PLANTA Y CONTRATA:</strong>
               <span className="text-slate-500">Se rigen por el Estatuto Administrativo. Su sueldo se paga religiosamente el <strong>penúltimo día hábil del mes</strong>.</span>
             </div>
             <div className="border-t border-slate-200 pt-2">
               <strong className="text-slate-900 block">HONORARIOS:</strong>
               <span className="text-slate-500">Se rigen por el Código Civil/Trabajo. Su fecha de pago es variable (generalmente primeros días del mes siguiente) y depende de la entrega oportuna del informe de actividades.</span>
             </div>
             <div className="border-t border-slate-200 pt-2">
               <strong className="text-slate-900 block">CÓDIGO DEL TRABAJO:</strong>
               <span className="text-slate-500">Común en cementerios o servicios traspasados. Tienen fechas específicas según contrato colectivo.</span>
             </div>
          </div>
          <p className="mt-2 font-bold text-red-600">¡Importante! La calidad jurídica no define tu valor. Tu compromiso sí.</p>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Espacios Seguros y Dignos" visual={<div className="flex items-center justify-center h-full bg-pink-50"><Heart size={150} className="text-pink-500 animate-pulse" /></div>} 
      content={
        <>
          <p>La <strong>Ley N° 21.643 (Ley Karin)</strong> establece un nuevo estándar de dignidad. El municipio tiene <strong>Tolerancia Cero</strong> con:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Acoso Laboral.</li>
            <li>Acoso Sexual.</li>
            <li>Violencia en el trabajo (incluso de usuarios hacia funcionarios).</li>
          </ul>
          <p>Ya no necesitas demostrar "reiteración". Un solo acto grave basta. Si ves o sufres algo, denúncialo. Tenemos protocolos confidenciales para protegerte.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad Laboral" subtitle="Autocuidado" visual={<div className="flex items-center justify-center h-full bg-yellow-50"><Shield size={150} className="text-yellow-600" /></div>} 
      content={
        <>
          <p>Tu integridad física es lo primero. La Serena es zona de tsunamis, así que memoriza esto: <strong>Cota 30</strong> (Avenida Cisternas hacia arriba).</p>
          <p><strong>Accidentes:</strong> Si te caes, chocas o te lesionas trabajando (o en el trayecto directo casa-trabajo):</p>
          <ol className="list-decimal ml-5 font-bold text-slate-800">
             <li>AVISA INMEDIATAMENTE a tu jefatura.</li>
             <li>Acude a la ACHS (Asociación Chilena de Seguridad).</li>
             <li>No te vayas a la casa sin registrar el accidente, o perderás la cobertura.</li>
          </ol>
        </>
      } 
    />;
    
    // 9. QUIZ DIDÁCTICO
    case 9: return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden relative overflow-hidden">
        <div className="absolute top-0 w-full h-2 bg-slate-800"><div className="bg-green-500 h-full transition-all" style={{width: `${((quizIndex)/QUESTIONS.length)*100}%`}}></div></div>
        
        <div className="max-w-xl w-full relative z-10">
          {!quizFinished ? (
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-4">
                 <span>Evaluación Didáctica</span>
                 <span>Pregunta {quizIndex+1} de {QUESTIONS.length}</span>
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

               {/* FEEDBACK INMEDIATO */}
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
            <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center shadow-2xl">
              <Award size={80} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-2">¡Evaluación Completa!</h2>
              <p className="text-slate-500 mb-6">Has demostrado conocer los valores y normas de nuestra institución.</p>
              <button onClick={() => setStep(10)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
                Generar mi Certificado
              </button>
            </div>
          )}
        </div>
      </div>
    );

    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 max-w-5xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[10px] md:border-[20px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0 print:m-0">
          
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
               <p className="font-bold text-slate-900 text-sm">{new Date().toLocaleDateString()}</p>
               <p className="text-[8px] font-bold uppercase text-slate-400">Fecha de Emisión</p>
            </div>

            <div className="text-center flex-1">
               <div className="h-12 border-b border-slate-400 mb-1"></div>
               <p className="text-[10px] font-bold uppercase text-slate-600">Alcaldesa</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={() => setStep(0)} className="bg-slate-600 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all">
             <RefreshCw />
           </button>
           <button onClick={printCertificate} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             <Printer /> Descargar Diploma
           </button>
        </div>
      </div>
    );
    default: return null;
  }
}
