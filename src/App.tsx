import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, Radio, Music, Award, 
  ChevronDown, Star, Shield, Heart, DollarSign, FileText, 
  Users, Map, Brain, Printer, RefreshCw, XCircle, UserCheck
} from 'lucide-react';

// --- DATOS DEL QUIZ (10 PREGUNTAS ACTUALIZADAS) ---
const QUESTIONS = [
  { q: "¿Cuántos concejales componen el Concejo Municipal?", options: ["6 Concejales", "8 Concejales", "10 Concejales"], ans: 2 },
  { q: "¿Cuál es el órgano fiscalizador del municipio?", options: ["DIDECO", "El Concejo Municipal", "Juzgado de Policía"], ans: 1 },
  { q: "¿Qué ley sanciona el acoso laboral y sexual?", options: ["Ley de Tránsito", "Ley Karin (21.643)", "Estatuto Administrativo"], ans: 1 },
  { q: "¿Qué significa 'Probidad Administrativa'?", options: ["Llegar temprano", "Honestidad y rectitud en el actuar", "Usar uniforme"], ans: 1 },
  { q: "¿Cuándo se pagan las remuneraciones?", options: ["Fechas fijas mensuales", "Cuando hay fondos", "Cada quincena"], ans: 0 },
  { q: "¿Qué debo hacer ante un accidente laboral?", options: ["Irse a la casa", "Seguir trabajando", "Informar inmediatamente para activar seguro"], ans: 2 },
  { q: "¿Quién lidera la administración comunal?", options: ["El Intendente", "La Alcaldesa", "El Gobernador"], ans: 1 },
  { q: "¿Qué es el Reglamento Interno?", options: ["Sugerencias de vestimenta", "Normas de derechos y deberes", "Una guía turística"], ans: 1 },
  { q: "¿Cuál es el canal de denuncia Ley Karin?", options: ["Redes Sociales", "Canal Confidencial Oficial", "Radio Pasillo"], ans: 1 },
  { q: "¿Cuál es la misión principal del funcionario?", options: ["Servicio Público de Calidad", "Cumplir horario", "Ganar bonos"], ans: 0 },
];

// --- COMPONENTES AUXILIARES ---
const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900/95 backdrop-blur-md text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl print:hidden">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="flex flex-col">
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px] tracking-wide">Señal Oficial IMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Inducción 2026</div>
    <div className="flex items-center gap-4 text-slate-400"><Music size={18} /></div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  
  // Estado del Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<null | boolean>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 9; // Aumentamos un paso por la diapo de concejales

  // Lógica de avance por lectura
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isShort || isAtBottom) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos que no requieren scroll obligatorio inmediato (Login, Video, Concejales, Quiz, Certificado)
    if ([0, 1, 2, 8, 9].includes(step)) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 1000);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Manejo del Quiz
  const handleQuizAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    setShowFeedback(isCorrect);
    
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setShowFeedback(null);
      if (quizIndex < QUESTIONS.length - 1) {
        setQuizIndex(i => i + 1);
      } else {
        setQuizFinished(true);
        if (score >= 7) setStep(9); // Pasa al certificado (Paso 9)
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setShowFeedback(null);
  };

  const printCertificate = () => {
    window.print();
  };

  // --- LAYOUTS ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden pb-16 print:hidden">
      <div className="fixed top-0 w-full h-1.5 bg-slate-800 z-50">
        <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col h-full pt-12 relative z-10 bg-white">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase mb-2">Módulo {step}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none tracking-tight">{title}</h2>
          <h3 className="text-xl text-slate-400 font-medium italic mt-2">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed">
          {content}
          <div className="h-32"></div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? 
               <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle size={16}/> Completado</span> : 
               <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={16}/> Lee para avanzar</span>
             }
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2">
             Continuar <ChevronRight size={18} />
           </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-100 flex items-center justify-center relative overflow-hidden border-l border-slate-200">
        {visual}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- PANTALLAS ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden relative print:hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-20"></div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-8">
        <Shield size={80} className="text-red-600 mb-6 drop-shadow-lg" />
        <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">IMLS 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-[0.5em] text-lg mb-12">Portal de Inducción</p>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-md w-full space-y-4 shadow-2xl">
          <input className="w-full p-4 border-none rounded-xl bg-white/90 text-slate-900 font-bold placeholder:text-slate-500" placeholder="Nombre Completo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
          <select className="w-full p-4 border-none rounded-xl bg-white/90 text-slate-900 font-bold" onChange={e => setUserData({...userData, dept: e.target.value})}>
            <option value="">Selecciona Departamento...</option>
            <option value="DIDECO">DIDECO</option>
            <option value="Salud">Salud</option>
            <option value="Educación">Educación</option>
            <option value="Tránsito">Tránsito</option>
            <option value="DOM">DOM</option>
            <option value="Gabinete">Gabinete</option>
          </select>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-between px-6">
            INGRESAR <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    // 1. BIENVENIDA ALCALDESA (VIDEO VERTICAL)
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Alcaldesa Daniela Norambuena" 
      visual={
        <div className="w-full h-full flex items-center justify-center bg-black">
           {/* Contenedor que simula formato celular para el Short */}
           <div className="relative h-[90%] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
             <iframe className="w-full h-full" src={`https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&controls=0&loop=1&playlist=EQUdyb-YVxM`} title="Video Alcaldesa" frameBorder="0" allowFullScreen></iframe>
           </div>
        </div>
      }
      content={<p className="text-xl">"Querido funcionario/a, te damos la bienvenida a una administración cercana, moderna y transparente. Tu trabajo es el motor que mueve a La Serena hacia el futuro."</p>} 
    />;
    
    // 2. CONCEJO MUNICIPAL (NUEVA DIAPO)
    case 2: return <ChapterLayout title="Concejo Municipal" subtitle="Periodo 2024 - 2028" 
      visual={
        <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
            <h3 className="text-center font-black text-xl text-slate-900 mb-6 uppercase tracking-wider border-b pb-4">Concejales Electos</h3>
            <ul className="space-y-3">
              {[
                "Cristian Marín Pastén",
                "Rayen Pojomovsky Aliste",
                "Alejandro Astudillo Olguín",
                "Gladys Marín Ossandón",
                "Francisca Barahona Araya",
                "María Teresita Prouvay Cornejo",
                "Camilo Araya Plaza",
                "María Marcela Damke Marín",
                "Matías Espinosa Morales",
                "Luisa Jinete Cárcamo"
              ].map((name, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-medium p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full font-bold text-sm shrink-0">{i + 1}</span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
      content={
        <>
          <p>El <strong>Concejo Municipal</strong> es el órgano encargado de hacer efectiva la participación de la comunidad local y de ejercer atribuciones fiscalizadoras.</p>
          <p>Está compuesto por la Alcaldesa y <strong>10 concejales</strong>, elegidos democráticamente, quienes representan las distintas visiones de nuestra comuna.</p>
        </>
      } 
    />;

    // 3. ORGANIGRAMA (Actualizado)
    case 3: return <ChapterLayout title="Organigrama" subtitle="Nuestra Estructura" 
      visual={
        <div className="p-8 w-full max-w-lg">
          <div className="flex flex-col items-center gap-4">
             <div className="bg-red-600 text-white p-4 rounded-xl font-bold w-full text-center shadow-lg transform hover:scale-105 transition-all">ALCALDESA</div>
             <div className="h-8 w-0.5 bg-slate-300"></div>
             <div className="bg-slate-800 text-white p-3 rounded-xl font-bold w-3/4 text-center shadow-md">CONCEJO MUNICIPAL</div>
             <div className="h-8 w-0.5 bg-slate-300"></div>
             <div className="grid grid-cols-2 gap-4 w-full">
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">ADMIN. MUNICIPAL</div>
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">JPL / CONTROL</div>
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">DIDECO</div>
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">SECPLAN</div>
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">DOM</div>
               <div className="bg-white border border-slate-200 p-3 rounded-lg text-center text-sm font-bold shadow-sm">TRÁNSITO</div>
             </div>
             <div className="mt-4 text-xs text-slate-400 uppercase tracking-widest text-center">Estructura Simplificada 2026</div>
          </div>
        </div>
      }
      content={<><p>El municipio se organiza jerárquicamente para responder a las necesidades de la comuna.</p><p>Las direcciones operativas ejecutan los planes estratégicos definidos por la Alcaldía y el Concejo, asegurando que los servicios lleguen a todos los barrios.</p></>} 
    />;

    // 4. MAPA DE PÚBLICOS
    case 4: return <ChapterLayout title="Mapa de Públicos" subtitle="¿A quién nos debemos?" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-[500px] h-[500px] border border-slate-200 rounded-full flex items-center justify-center animate-pulse"></div>
          <div className="absolute w-[350px] h-[350px] border border-red-100 rounded-full flex items-center justify-center bg-red-50/50"></div>
          
          <div className="z-10 bg-slate-900 text-white p-6 rounded-full font-black text-xl shadow-xl z-20">IMLS</div>
          
          <div className="absolute top-20 bg-white border border-slate-200 px-4 py-2 rounded-full font-bold shadow-md text-sm hover:scale-110 transition-transform cursor-default">VECINOS</div>
          <div className="absolute bottom-20 bg-white border border-slate-200 px-4 py-2 rounded-full font-bold shadow-md text-sm hover:scale-110 transition-transform cursor-default">GOBIERNO</div>
          <div className="absolute left-10 bg-white border border-slate-200 px-4 py-2 rounded-full font-bold shadow-md text-sm hover:scale-110 transition-transform cursor-default">GREMIOS</div>
          <div className="absolute right-10 bg-white border border-slate-200 px-4 py-2 rounded-full font-bold shadow-md text-sm hover:scale-110 transition-transform cursor-default">TURISTAS</div>
        </div>
      }
      content={<><p>Nuestra gestión es un ecosistema vivo. No trabajamos aislados.</p><ul className="list-disc ml-5 space-y-2"><li><strong>Vecinos:</strong> Nuestro foco principal y razón de ser.</li><li><strong>Gobierno Central:</strong> Fuentes de financiamiento y normativa.</li><li><strong>Sector Privado:</strong> Alianzas estratégicas para el desarrollo.</li></ul></>} 
    />;

    case 5: return <ChapterLayout title="Ley Karin" subtitle="Espacios Seguros" visual={<div className="flex items-center justify-center h-full bg-red-50"><Heart size={150} className="text-red-600" /></div>} content={<p>Tolerancia Cero al acoso. La Ley 21.643 nos protege a todos y es deber de cada funcionario denunciar conductas inapropiadas a través de los canales oficiales.</p>} />;
    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Transparencia" visual={<div className="flex items-center justify-center h-full bg-green-50"><DollarSign size={150} className="text-green-600" /></div>} content={<p>Tu sueldo se compone de base, asignaciones y bonos. Es vital mantener la transparencia y el orden administrativo para asegurar el pago oportuno.</p>} />;
    case 7: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" visual={<div className="flex items-center justify-center h-full bg-yellow-50"><Shield size={150} className="text-yellow-600" /></div>} content={<p>La prevención es tarea de todos. Identifica las zonas seguras, conoce a tu prevencionista y respeta los protocolos de emergencia ante sismos o tsunamis.</p>} />;
    
    // 8. QUIZ
    case 8: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden">
        <div className="max-w-2xl w-full">
          {!quizFinished ? (
            <>
              <div className="flex justify-between items-end mb-6">
                 <h2 className="text-3xl font-black">Evaluación Final</h2>
                 <span className="text-red-500 font-bold">{quizIndex + 1}/{QUESTIONS.length}</span>
              </div>
              
              <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${((quizIndex) / QUESTIONS.length) * 100}%` }}></div>
              </div>

              <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                 {showFeedback === true && <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center text-white text-4xl font-black z-20"><CheckCircle size={60} className="mr-4"/> ¡CORRECTO!</div>}
                 {showFeedback === false && <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center text-white text-4xl font-black z-20"><XCircle size={60} className="mr-4"/> INCORRECTO</div>}

                 <h3 className="text-2xl font-bold mb-8">{QUESTIONS[quizIndex].q}</h3>
                 <div className="space-y-4">
                   {QUESTIONS[quizIndex].options.map((opt, idx) => (
                     <button key={idx} onClick={() => handleQuizAnswer(idx)} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-red-600 hover:bg-red-50 transition-all font-medium text-lg flex items-center justify-between group">
                       {opt}
                       <ChevronRight className="text-slate-300 group-hover:text-red-600"/>
                     </button>
                   ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center shadow-2xl">
              <h2 className="text-4xl font-black mb-4">Resultados</h2>
              <div className="text-8xl font-black text-red-600 mb-2">{score * 10}%</div>
              <p className="text-xl text-slate-500 mb-8">{score >= 7 ? "¡Aprobado con éxito!" : "Debes repasar los contenidos."}</p>
              
              {score >= 7 ? (
                <button onClick={() => setStep(9)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-xl text-xl flex items-center justify-center gap-2">
                  <Award /> Obtener Certificado
                </button>
              ) : (
                <button onClick={restartQuiz} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors shadow-xl flex items-center justify-center gap-2">
                  <RefreshCw /> Intentar de Nuevo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );

    // 9. CERTIFICADO FINAL
    case 9: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        {/* Este div es el que se imprime */}
        <div className="bg-white p-12 max-w-4xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-center text-center border-[20px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0">
          
          <div className="absolute top-10 left-10 opacity-50"><Shield size={60} className="text-slate-300"/></div>
          <div className="absolute bottom-10 right-10 opacity-50"><Award size={60} className="text-slate-300"/></div>
          <div className="absolute inset-0 border-[1px] border-slate-300 m-4 pointer-events-none"></div>

          <Shield size={80} className="text-red-600 mb-6" />
          <h1 className="text-5xl font-serif font-black text-slate-900 mb-2 uppercase tracking-wide">Certificado de Aprobación</h1>
          <p className="text-xl text-slate-500 italic mb-12">Se otorga el presente reconocimiento a:</p>
          
          <div className="border-b-2 border-slate-900 pb-2 mb-8 w-3/4">
            <h2 className="text-4xl font-bold text-slate-900 uppercase">{userData.nombres}</h2>
          </div>
          
          <p className="text-lg text-slate-600 mb-2">Por haber completado exitosamente la</p>
          <h3 className="text-2xl font-bold text-red-600 uppercase tracking-widest mb-12">Inducción Municipal 2026</h3>
          
          <div className="flex justify-between w-full px-20 mt-8">
            <div className="text-center">
              <div className="w-32 h-0.5 bg-slate-400 mb-2 mx-auto"></div>
              <p className="text-xs font-bold uppercase text-slate-400">Dirección de Personas</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
              <p className="text-xs font-bold uppercase text-slate-400">Fecha de Emisión</p>
            </div>
            <div className="text-center">
               <div className="w-32 h-0.5 bg-slate-400 mb-2 mx-auto"></div>
               <p className="text-xs font-bold uppercase text-slate-400">Alcaldía La Serena</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
           <button onClick={() => setStep(0)} className="bg-slate-600 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all">
             <RefreshCw />
           </button>
           <button onClick={printCertificate} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             <Printer /> Descargar PDF / Imprimir
           </button>
        </div>
      </div>
    );
    default: return null;
  }
}
