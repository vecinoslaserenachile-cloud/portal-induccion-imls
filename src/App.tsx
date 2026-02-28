import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  Shield, Heart, DollarSign, Printer, RefreshCw, 
  User, Map, Briefcase, Building2, Lightbulb, 
  Clock, Smartphone, ArrowRight, AlertCircle, Quote, PlayCircle, Star
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
  { q: "¿Quiénes son parte del equipo?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Todos somos funcionarios públicos." },
  { q: "¿Cuál es el foco de gestión?", options: ["Burocracia", "El Vecino", "Cumplir horario"], ans: 1, explanation: "El vecino es el centro." },
  { q: "¿Cuántos concejales hay?", options: ["6", "8", "10"], ans: 2, explanation: "10 concejales electos." },
  { q: "¿Qué hacer ante un accidente?", options: ["Irse a casa", "Avisar a jefatura", "Nada"], ans: 1, explanation: "Avisar para activar seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia cero al acoso." },
];

const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

export default function App() {
  // ESTADO
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', apellidos: '', rut: '', dept: '', cargo: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // QUIZ STATE
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const TOTAL_STEPS = 11; // 0 a 11

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- NAVEGACIÓN MANUAL (SEGURA) ---
  const goNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // --- LÓGICA QUIZ ---
  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return;
    if (optionIndex === QUESTIONS[quizIndex].ans) {
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
    }
  };

  const printCertificate = () => window.print();

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Barra Superior */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
      </div>

      {/* Contenedor Principal (Scrollable) */}
      <div className="flex-1 flex flex-col lg:flex-row pt-2">
        
        {/* VISUAL (Arriba en móvil, Izquierda en PC) */}
        <div className="lg:w-1/2 bg-slate-100 flex items-center justify-center p-4 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 lg:h-screen lg:fixed lg:top-0 lg:left-0">
           <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden aspect-video lg:aspect-auto lg:h-[600px] relative flex items-center justify-center">
             {visual}
           </div>
        </div>

        {/* CONTENIDO (Abajo en móvil, Derecha en PC - Con margen para no tapar lo fijo) */}
        <div className="lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen bg-white">
           <div className="p-8 lg:p-16 flex-1">
              <div className="mb-6">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Paso {step}</span>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mt-4 mb-2 leading-tight">{title}</h2>
                <h3 className="text-xl text-slate-500 font-serif italic">{subtitle}</h3>
              </div>
              
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                {content}
              </div>
              
              <div className="h-24"></div> {/* Espacio para el footer fijo */}
           </div>

           {/* BOTONERA FIJA ABAJO */}
           <div className="fixed bottom-0 right-0 w-full lg:w-1/2 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 lg:p-8 flex justify-between items-center z-40">
              <button onClick={goBack} className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                <ChevronLeft size={20}/> Atrás
              </button>
              
              <button onClick={goNext} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-red-600 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                Siguiente <ArrowRight size={20}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  // --- VISTAS ---

  // 0. LOGIN
  if (step === 0) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-20"></div>
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
           <h1 className="text-4xl font-black text-slate-900 mb-1">INDUCCIÓN</h1>
           <p className="text-red-600 font-bold tracking-[0.3em] text-sm">MUNICIPALIDAD LA SERENA</p>
        </div>
        <div className="space-y-4">
           <input className="w-full p-4 bg-slate-100 rounded-xl font-bold" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
           <input className="w-full p-4 bg-slate-100 rounded-xl font-bold" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
           <input className="w-full p-4 bg-slate-100 rounded-xl font-bold" placeholder="RUT" onChange={e => setUserData({...userData, rut: e.target.value})} />
           <select className="w-full p-4 bg-slate-100 rounded-xl font-bold" onChange={e => setUserData({...userData, dept: e.target.value})}>
             <option value="">Departamento...</option>
             {DEPARTAMENTOS.map((d,i) => <option key={i} value={d}>{d}</option>)}
           </select>
           <input className="w-full p-4 bg-slate-100 rounded-xl font-bold" placeholder="Cargo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
           
           <button disabled={!userData.nombres} onClick={goNext} className="w-full bg-red-600 text-white p-4 rounded-xl font-black text-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2">
             INGRESAR <ArrowRight/>
           </button>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Alcaldesa Daniela Norambuena" 
      visual={
        <iframe className="w-full h-full" src="https://www.youtube.com/embed/EQUdyb-YVxM" title="Video" frameBorder="0" allowFullScreen></iframe>
      }
      content={
        <div>
           <p className="text-2xl font-bold text-slate-900 mb-4">¡Hola, {userData.nombres}!</p>
           <p className="mb-6">Bienvenido a la Ilustre Municipalidad de La Serena. Te sumas a un equipo comprometido con el desarrollo de la segunda ciudad más antigua de Chile.</p>
           <div className="bg-red-50 p-6 rounded-2xl border-l-4 border-red-600 italic text-red-900">
             "Nuestro compromiso es modernizar la gestión municipal. Queremos funcionarios proactivos y empáticos."
           </div>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión y Valores" 
      visual={
        <div className="w-full h-full bg-slate-800 flex flex-col justify-center items-center text-white p-8 text-center">
           <Lightbulb size={60} className="text-yellow-400 mb-4"/>
           <h4 className="font-black text-3xl mb-2">MISIÓN</h4>
           <p>Mejorar la calidad de vida con gestión participativa.</p>
        </div>
      }
      content={
        <>
          <p className="text-xl mb-6 font-light">Nuestros valores intransables:</p>
          <div className="space-y-4">
             <div className="p-4 border rounded-xl flex gap-4 items-center">
               <div className="bg-red-100 p-2 rounded-lg text-red-600 font-bold">1</div>
               <div><h4 className="font-bold">Probidad</h4><p className="text-sm">Rectitud intachable.</p></div>
             </div>
             <div className="p-4 border rounded-xl flex gap-4 items-center">
               <div className="bg-blue-100 p-2 rounded-lg text-blue-600 font-bold">2</div>
               <div><h4 className="font-bold">Cercanía</h4><p className="text-sm">Empatía con el vecino.</p></div>
             </div>
             <div className="p-4 border rounded-xl flex gap-4 items-center">
               <div className="bg-green-100 p-2 rounded-lg text-green-600 font-bold">3</div>
               <div><h4 className="font-bold">Transparencia</h4><p className="text-sm">Actos públicos.</p></div>
             </div>
          </div>
        </>
      } 
    />;

    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={
        <div className="w-full h-full bg-slate-100 p-4 overflow-y-auto">
           <div className="grid grid-cols-2 gap-2">
             {CONCEJALES.map((c, i) => (
               <div key={i} className="bg-white p-2 rounded-lg text-center text-[10px] font-bold shadow-sm border">
                 <User className="mx-auto mb-1 text-slate-300"/> {c}
               </div>
             ))}
           </div>
        </div>
      }
      content={
        <>
          <p>El Concejo Municipal tiene 10 integrantes electos.</p>
          <ul className="space-y-3 mt-4">
            <li className="flex gap-2"><CheckCircle className="text-green-500"/> <strong>Normar:</strong> Ordenanzas.</li>
            <li className="flex gap-2"><CheckCircle className="text-green-500"/> <strong>Fiscalizar:</strong> Presupuesto.</li>
            <li className="flex gap-2"><CheckCircle className="text-green-500"/> <strong>Resolver:</strong> Licitaciones.</li>
          </ul>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura" 
      visual={<img src="/img/organigrama_full.png" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src='https://placehold.co/600x800?text=Organigrama'}/>}
      content={
        <>
          <p className="mb-4">Direcciones clave:</p>
          <div className="space-y-4">
             <div className="p-4 bg-white shadow-sm rounded-xl border">
               <h4 className="font-bold text-red-600">DIDECO</h4>
               <p className="text-sm">Ayudas sociales y organizaciones.</p>
             </div>
             <div className="p-4 bg-white shadow-sm rounded-xl border">
               <h4 className="font-bold text-blue-600">DOM</h4>
               <p className="text-sm">Obras y permisos de edificación.</p>
             </div>
             <div className="p-4 bg-white shadow-sm rounded-xl border">
               <h4 className="font-bold text-green-600">SECPLAN</h4>
               <p className="text-sm">Proyectos de inversión.</p>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Ecosistema" 
      visual={
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
           <div className="bg-white text-slate-900 font-black p-4 rounded-full mb-8">IMLS</div>
           <div className="grid grid-cols-2 gap-4 text-center text-sm">
             <div className="bg-blue-600 p-2 rounded-lg">Vecinos</div>
             <div className="bg-green-600 p-2 rounded-lg">Empresas</div>
             <div className="bg-purple-600 p-2 rounded-lg">Gobierno</div>
             <div className="bg-orange-600 p-2 rounded-lg">Turistas</div>
           </div>
        </div>
      }
      content={
        <>
          <p className="mb-4">Interactuamos con:</p>
          <ul className="space-y-4">
            <li className="flex gap-3 items-center"><User className="text-blue-500"/> <strong>Vecinos:</strong> El centro de la gestión.</li>
            <li className="flex gap-3 items-center"><Briefcase className="text-green-500"/> <strong>Privados:</strong> Socios estratégicos.</li>
            <li className="flex gap-3 items-center"><Building2 className="text-purple-500"/> <strong>Instituciones:</strong> Gobierno y policías.</li>
          </ul>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Un Solo Equipo" 
      visual={<div className="w-full h-full flex items-center justify-center bg-green-50"><DollarSign size={100} className="text-green-600"/></div>}
      content={
        <>
          <p className="mb-4">Todos somos compañeros, con distintas modalidades:</p>
          <div className="space-y-4">
             <div className="p-4 border rounded-xl">
               <strong className="block text-lg">Planta y Contrata</strong>
               <span className="text-sm text-slate-500">Pago: Penúltimo día hábil.</span>
             </div>
             <div className="p-4 border rounded-xl">
               <strong className="block text-lg">Honorarios</strong>
               <span className="text-sm text-slate-500">Pago: Variable (con informe).</span>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad" 
      visual={<div className="w-full h-full flex items-center justify-center bg-pink-50"><Heart size={100} className="text-pink-500"/></div>}
      content={
        <>
          <p className="mb-4"><strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-1 gap-2">
             <div className="bg-pink-100 p-3 rounded text-pink-800 font-bold">🚫 Acoso Laboral</div>
             <div className="bg-pink-100 p-3 rounded text-pink-800 font-bold">✋ Acoso Sexual</div>
             <div className="bg-pink-100 p-3 rounded text-pink-800 font-bold">🗣️ Violencia</div>
          </div>
          <p className="mt-4 text-sm">Denuncia segura y confidencial.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" 
      visual={<div className="w-full h-full flex items-center justify-center bg-yellow-50"><Shield size={100} className="text-yellow-500"/></div>}
      content={
        <>
          <div className="space-y-6">
             <div>
               <h4 className="font-bold text-lg">Zona de Tsunamis</h4>
               <p>Evacuar a la <strong>Cota 30</strong> (Av. Cisternas).</p>
             </div>
             <div>
               <h4 className="font-bold text-lg">Accidentes</h4>
               <div className="bg-red-50 p-4 rounded-xl text-red-800 font-bold text-sm">
                 1. AVISAR A JEFATURA.<br/>
                 2. IR A LA ACHS.<br/>
                 3. REGISTRO OBLIGATORIO.
               </div>
             </div>
          </div>
        </>
      } 
    />;

    // 9. QUIZ
    case 9: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl">
           {!quizFinished ? (
             <>
               <div className="flex justify-between mb-6 text-sm font-bold text-slate-400">
                 <span>PREGUNTA</span>
                 <span>{quizIndex + 1} / {QUESTIONS.length}</span>
               </div>
               <h3 className="text-xl font-black mb-6">{QUESTIONS[quizIndex].q}</h3>
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleAnswer(i)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all ${
                       quizState === 'waiting' ? 'border-slate-200 hover:bg-slate-50' :
                       i === QUESTIONS[quizIndex].ans ? 'bg-green-100 border-green-500 text-green-800' : 'opacity-50'
                     }`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-6">
                   <p className="mb-4 text-sm font-medium">{QUESTIONS[quizIndex].explanation}</p>
                   <button onClick={nextQuestion} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Siguiente</button>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-8">
               <Award size={60} className="mx-auto text-yellow-500 mb-4"/>
               <h2 className="text-3xl font-black mb-2">¡Completado!</h2>
               <p className="text-slate-500 mb-6">Puntuación: {score}/{QUESTIONS.length}</p>
               <button onClick={goNext} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-xl">Obtener Certificado</button>
             </div>
           )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 w-full max-w-4xl aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[10px] border-double border-slate-300">
           <div className="w-full flex justify-between opacity-50">
             <img src="/img/escudo.png" className="h-16 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-16 object-contain" onError={(e)=>e.currentTarget.style.display='none'}/>
           </div>
           
           <div>
             <h1 className="text-5xl font-serif font-black text-slate-900 mb-2">CERTIFICADO</h1>
             <p className="text-xl italic text-slate-500 mb-6">Inducción Corporativa 2026</p>
             <h2 className="text-3xl font-bold uppercase text-slate-900 mb-2">{userData.nombres} {userData.apellidos}</h2>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{userData.rut} • {userData.cargo}</p>
             <p className="text-lg text-slate-600">Ha completado exitosamente el programa de inducción.</p>
           </div>

           <div className="flex justify-between w-full px-8 mt-8 text-xs font-bold uppercase text-slate-400">
             <div>Gestión de Personas</div>
             <div>{currentTime.toLocaleDateString()}</div>
             <div>Alcaldía</div>
           </div>
        </div>
        
        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
           <button onClick={printCertificate} className="bg-white px-6 py-3 rounded-full font-bold shadow-lg"><Printer/></button>
           <button onClick={goNext} className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">Finalizar <ArrowRight size={16}/></button>
        </div>
      </div>
    );

    // 11. FINAL
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
         <div className="bg-white/10 p-10 rounded-3xl backdrop-blur-md border border-white/10 max-w-md w-full">
            <Smartphone size={50} className="mx-auto mb-4 text-cyan-400"/>
            <h2 className="text-3xl font-black mb-4">¡Sigue Conectado!</h2>
            <p className="text-slate-300 mb-8">Únete a nuestra comunidad digital.</p>
            <div className="bg-white p-6 rounded-2xl text-slate-900 mb-8">
               <QrCode size={100} className="mx-auto mb-2"/>
               <p className="font-bold text-xs">Escanea para ir al Portal RDMLS</p>
            </div>
            <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm w-full"><RefreshCw size={14}/> Cerrar Sesión</button>
         </div>
      </div>
    );

    default: return null;
  }
}
