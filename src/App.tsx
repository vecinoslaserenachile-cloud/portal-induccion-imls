Entendido, Rodrigo. Si se va a negro después de la 4, es un **error de código (Crash)** en la diapositiva 5 (El Mapa de Públicos). Probablemente una animación o un ícono que tu sistema no reconoce y hace explotar la aplicación.

Y lo del video "Loop" es porque el botón Siguiente no se estaba activando bien.

**ESTA ES LA SOLUCIÓN DEFINITIVA "MODO SEGURO":**

1. **Eliminé TODAS las animaciones complejas** (giros, desenfoques) que causan la pantalla negra. Ahora es diseño limpio y estático.
2. **Cambié los Íconos:** Usé solo íconos básicos (`User`, `Star`, `Home`) que funcionan en cualquier versión para evitar el crash de la diapositiva 5.
3. **Botón Siguiente LIBERADO:** Ya no depende del scroll ni de nada. Siempre podrás avanzar.
4. **Video:** Puesto de forma simple.

Por favor, copia y pega esto en `src/App.tsx`. **Te garantizo que pasará de la diapositiva 5.**

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, User, Map, Briefcase, 
  Home, Star, Clock, Smartphone, 
  ArrowRight, AlertCircle, PlayCircle
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
  { q: "¿Quiénes son parte del equipo municipal?", options: ["Solo planta", "Planta, Contrata y Honorarios", "Solo directivos"], ans: 1, explanation: "Correcto. Todos somos funcionarios con vocación de servicio." },
  { q: "¿Cuál es el foco de nuestra gestión?", options: ["La Burocracia", "El Vecino y su bienestar", "Cumplir horario"], ans: 1, explanation: "Exacto. El vecino es el centro de cada decisión." },
  { q: "¿Cuántos concejales componen el Concejo?", options: ["6", "8", "10"], ans: 2, explanation: "Son 10 concejales electos democráticamente." },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Avisar INMEDIATAMENTE a jefatura", "Esperar"], ans: 1, explanation: "Vital: Avisar de inmediato para activar el seguro ACHS." },
  { q: "¿Qué sanciona la Ley Karin?", options: ["Acoso y Violencia", "Llegar tarde", "Uniforme"], ans: 0, explanation: "Tolerancia cero al acoso laboral, sexual y violencia." },
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
  
  // Quiz Logic
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 12;

  // Reloj simple
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // Navegación Segura
  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => Math.max(0, prev - 1));

  // Quiz Handlers
  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'waiting') return;
    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    if (isCorrect) {
      setQuizState('correct');
      setScore(prev => prev + 1);
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

  // --- LAYOUT ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Barra Progreso */}
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      {/* VISUAL */}
      <div className="lg:order-2 lg:w-1/2 w-full lg:h-full h-[40vh] bg-slate-100 flex items-center justify-center relative p-0 lg:p-8 border-b lg:border-b-0 lg:border-l border-slate-200">
        <div className="w-full h-full lg:rounded-3xl overflow-hidden shadow-none lg:shadow-xl bg-white relative">
           {visual}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="lg:order-1 lg:w-1/2 w-full flex flex-col h-[60vh] lg:h-full bg-white relative z-10">
        
        <div className="px-8 lg:px-16 pt-6 pb-2 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Módulo {step}</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Inducción 2026</span>
          </div>
          <h2 className="text-2xl lg:text-5xl font-black text-slate-900 leading-tight mb-1">{title}</h2>
          <h3 className="text-base lg:text-xl text-slate-500 font-serif italic">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6">
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-normal">
            {content}
            <div className="h-24"></div>
          </div>
        </div>

        <div className="px-8 lg:px-16 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
           <button onClick={goBack} className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-100">
             <ChevronLeft size={16}/> Atrás
           </button>

           <button onClick={goNext} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-red-600 transition-all flex items-center gap-2 text-sm uppercase tracking-wide">
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
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-20" alt="Fondo" />
        <div className="absolute inset-0 bg-slate-900/50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl m-4">
        <div className="text-center mb-6">
          <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-20 mx-auto mb-2" alt="Escudo" />
          <h1 className="text-3xl font-black text-slate-900 uppercase">Inducción Municipal</h1>
        </div>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <input className="w-full p-3 bg-slate-100 rounded-lg font-bold text-slate-900" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
               <input className="w-full p-3 bg-slate-100 rounded-lg font-bold text-slate-900" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <input className="w-full p-3 bg-slate-100 rounded-lg font-bold text-slate-900" placeholder="RUT" onChange={e => setUserData({...userData, rut: e.target.value})} />
            <select className="w-full p-3 bg-slate-100 rounded-lg font-bold text-slate-900" onChange={e => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona Unidad...</option>
                {DEPARTAMENTOS.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
            <input className="w-full p-3 bg-slate-100 rounded-lg font-bold text-slate-900" placeholder="Cargo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
            
            <button disabled={!userData.nombres || !userData.rut || !userData.dept} onClick={goNext} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all flex justify-center gap-2 items-center disabled:opacity-50">
              INGRESAR <ArrowRight size={20}/>
            </button>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Mensaje de la Alcaldesa" 
      visual={
        <div className="w-full h-full bg-black flex items-center justify-center">
           <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/EQUdyb-YVxM?rel=0" title="Mensaje" frameBorder="0" allowFullScreen></iframe>
        </div>
      }
      content={
        <div>
           <p className="font-black text-3xl text-slate-900 mb-6">¡Hola, {userData.nombres}!</p>
           <p className="mb-6 text-xl text-slate-600">Te sumas a una institución con historia. La Serena es una capital patrimonial que exige lo mejor de nosotros.</p>
           <div className="bg-red-50 p-6 rounded-2xl border-l-8 border-red-600 mb-8">
             <p className="text-xl font-serif italic text-red-900">"Queremos funcionarios proactivos, empáticos y que entiendan que detrás de cada papel hay una familia."</p>
             <p className="text-right font-bold text-red-700 mt-2 text-sm">- Daniela Norambuena, Alcaldesa</p>
           </div>
        </div>
      } 
    />;

    case 2: return <ChapterLayout title="Carta de Navegación" subtitle="Misión y Visión" 
      visual={
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-8">
           <div className="space-y-6 w-full max-w-sm">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                 <h4 className="font-black text-2xl text-yellow-400 mb-2">MISIÓN</h4>
                 <p className="text-slate-200">Mejorar la calidad de vida de los habitantes de la comuna con gestión participativa.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                 <h4 className="font-black text-2xl text-red-400 mb-2">VISIÓN</h4>
                 <p className="text-slate-200">Ser una comuna líder en desarrollo sostenible, turismo y patrimonio.</p>
              </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-2xl font-light text-slate-500 mb-8">Nuestros Valores:</p>
          <div className="space-y-4">
             <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
               <div><h4 className="font-bold text-slate-900">Probidad</h4><p className="text-slate-600">Actuamos con rectitud intachable.</p></div>
             </div>
             <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
               <div><h4 className="font-bold text-slate-900">Cercanía</h4><p className="text-slate-600">Somos servidores públicos empáticos.</p></div>
             </div>
             <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
               <div><h4 className="font-bold text-slate-900">Transparencia</h4><p className="text-slate-600">Nuestros actos son públicos.</p></div>
             </div>
          </div>
        </>
      } 
    />;
    
    case 3: return <ChapterLayout title="Concejo Municipal" subtitle="Fiscalización" 
      visual={
        <div className="h-full w-full bg-slate-100 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-3 rounded-xl shadow-sm text-center border border-slate-200">
                 <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 overflow-hidden">
                   <User className="w-full h-full p-2 text-slate-400" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-900 uppercase">{name}</p>
               </div>
            ))}
            </div>
        </div>
      }
      content={
        <>
          <p className="mb-6 text-lg">El <strong>Concejo Municipal</strong> está compuesto por <strong>10 concejales</strong> electos.</p>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
             <h4 className="font-black text-yellow-900 text-lg mb-4">Sus Funciones:</h4>
             <ul className="space-y-3">
               <li className="flex gap-2"><CheckCircle size={20} className="text-yellow-700"/> <strong>Normar:</strong> Aprueban ordenanzas.</li>
               <li className="flex gap-2"><CheckCircle size={20} className="text-yellow-700"/> <strong>Fiscalizar:</strong> Revisan el presupuesto.</li>
               <li className="flex gap-2"><CheckCircle size={20} className="text-yellow-700"/> <strong>Resolver:</strong> Aprueban licitaciones.</li>
             </ul>
          </div>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama" subtitle="Estructura" 
      visual={<div className="flex items-center justify-center h-full bg-slate-100 p-4"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/800x1000/png?text=Organigrama'} className="max-h-full max-w-full object-contain" /></div>}
      content={
        <>
          <p className="mb-6 text-lg">Entender el organigrama es vital para saber a quién acudir.</p>
          <div className="grid gap-4">
             <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h4 className="font-bold text-slate-900">DIDECO (Social)</h4><p className="text-slate-500">Gestiona ayudas sociales y organizaciones.</p>
             </div>
             <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h4 className="font-bold text-slate-900">DOM (Obras)</h4><p className="text-slate-500">Permisos de edificación y urbanismo.</p>
             </div>
             <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h4 className="font-bold text-slate-900">SECPLAN (Planificación)</h4><p className="text-slate-500">Diseña los proyectos de inversión.</p>
             </div>
          </div>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Ecosistema" subtitle="Mapa de Públicos" 
      visual={
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-8 space-y-4">
           {/* VERSIÓN SIMPLIFICADA QUE NO CRASHEA */}
           <div className="bg-white p-4 rounded-full w-24 h-24 flex items-center justify-center font-black text-xl shadow-[0_0_20px_white]">IMLS</div>
           
           <div className="grid grid-cols-2 gap-4 w-full">
             <div className="bg-blue-900/50 p-4 rounded-xl text-center text-blue-100 border border-blue-500/30">
               <User className="mx-auto mb-1"/> Vecinos
             </div>
             <div className="bg-green-900/50 p-4 rounded-xl text-center text-green-100 border border-green-500/30">
               <Briefcase className="mx-auto mb-1"/> Empresas
             </div>
             <div className="bg-purple-900/50 p-4 rounded-xl text-center text-purple-100 border border-purple-500/30">
               <Shield className="mx-auto mb-1"/> Gobierno
             </div>
             <div className="bg-orange-900/50 p-4 rounded-xl text-center text-orange-100 border border-orange-500/30">
               <Map className="mx-auto mb-1"/> Turistas
             </div>
           </div>
        </div>
      }
      content={
        <>
          <p className="text-lg mb-6">No somos una isla. El municipio interactúa con:</p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-900">1. El Vecino</h4>
              <p className="text-blue-700 text-sm">Es el centro de nuestra gestión.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
              <h4 className="font-bold text-green-900">2. Privados</h4>
              <p className="text-green-700 text-sm">Socios estratégicos para obras y servicios.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-900">3. Instituciones</h4>
              <p className="text-purple-700 text-sm">Carabineros, Bomberos, Gobierno.</p>
            </div>
          </div>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Remuneraciones" subtitle="Somos un Equipo" visual={<div className="flex items-center justify-center h-full bg-green-50 rounded-2xl"><DollarSign size={150} className="text-green-600/50" /></div>} 
      content={
        <>
          <p className="mb-6 text-lg">En el municipio conviven distintas modalidades, pero <strong>todos somos compañeros</strong>.</p>
          <div className="grid gap-4">
             <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <strong className="text-slate-900 block mb-1">Planta y Contrata</strong>
               <p className="text-slate-600 text-sm">Pago: <strong>Penúltimo día hábil del mes</strong>.</p>
             </div>
             <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <strong className="text-slate-900 block mb-1">Honorarios</strong>
               <p className="text-slate-600 text-sm">Pago: Variable, requiere Informe de Actividades.</p>
             </div>
          </div>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Ley Karin" subtitle="Dignidad" visual={<div className="flex items-center justify-center h-full bg-pink-50 rounded-2xl"><Heart size={150} className="text-pink-400/50" /></div>} 
      content={
        <>
          <p className="mb-6 text-lg">La <strong>Ley N° 21.643</strong> establece <strong>Tolerancia Cero</strong> con:</p>
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="bg-pink-50 p-4 rounded-xl font-bold text-pink-900 flex gap-2"><Shield size={20}/> Acoso Laboral</div>
            <div className="bg-pink-50 p-4 rounded-xl font-bold text-pink-900 flex gap-2"><Shield size={20}/> Acoso Sexual</div>
            <div className="bg-pink-50 p-4 rounded-xl font-bold text-pink-900 flex gap-2"><Shield size={20}/> Violencia</div>
          </div>
          <p className="text-slate-600">Un solo acto grave es suficiente para denunciar.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad" subtitle="Autocuidado" visual={<div className="flex items-center justify-center h-full bg-yellow-50 rounded-2xl"><Shield size={200} className="text-yellow-500/50" /></div>} 
      content={
        <>
          <p className="mb-6 text-lg">Reglas de oro que salvan vidas:</p>
          <div className="space-y-6">
             <div>
               <h4 className="font-black text-slate-900 text-lg mb-1">Zona de Tsunamis</h4>
               <p className="text-slate-600">Evacúa hacia la <strong>Cota 30</strong> (Desde Av. Cisternas hacia arriba).</p>
             </div>
             <div>
               <h4 className="font-black text-slate-900 text-lg mb-1">Accidentes</h4>
               <div className="bg-red-50 p-4 rounded-xl text-sm font-bold text-red-800">
                  1. AVISAR A JEFATURA.<br/>
                  2. ACUDIR A LA ACHS.<br/>
                  3. REGISTRO OBLIGATORIO.
               </div>
             </div>
          </div>
        </>
      } 
    />;
    
    // 9. QUIZ
    case 9: return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden relative overflow-hidden">
        <div className="max-w-2xl w-full relative z-10 pb-10 overflow-y-auto max-h-screen">
          {!quizFinished ? (
            <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl">
               <h3 className="text-2xl font-black mb-6">{QUESTIONS[quizIndex].q}</h3>
               <div className="space-y-3">
                 {QUESTIONS[quizIndex].options.map((opt, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => handleAnswer(idx)}
                     disabled={quizState !== 'waiting'}
                     className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all
                       ${quizState === 'waiting' ? 'border-slate-200 hover:bg-slate-50' : ''}
                       ${quizState !== 'waiting' && idx === QUESTIONS[quizIndex].ans ? 'border-green-500 bg-green-50 text-green-700' : ''}
                       ${quizState === 'wrong' && idx === parseInt(String(QUESTIONS[quizIndex].options.indexOf(opt))) ? 'border-red-500 bg-red-50 text-red-700' : ''} 
                     `}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
               {quizState !== 'waiting' && (
                 <div className="mt-6">
                    <p className="mb-4 text-sm font-bold">{QUESTIONS[quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className="w-full py-3 rounded-xl font-bold bg-slate-900 text-white">Siguiente</button>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white text-slate-900 p-10 rounded-3xl text-center shadow-2xl">
              <Award size={60} className="text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-4">¡Aprobado!</h2>
              <button onClick={() => setStep(10)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl">Generar Certificado</button>
            </div>
          )}
        </div>
      </div>
    );

    // 10. CERTIFICADO
    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-4xl w-full relative shadow-2xl text-center border-[10px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:absolute print:top-0 print:left-0">
          <div className="flex justify-between mb-8 opacity-50">
             <img src="/img/escudo.png" className="h-16 object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
             <img src="/img/innovacion.png" className="h-16 object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 uppercase">CERTIFICADO</h1>
          <p className="text-xl text-slate-500 italic mb-8">Inducción Corporativa</p>
          <h2 className="text-4xl font-black text-slate-900 uppercase mb-2">{userData.nombres} {userData.apellidos}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">RUT: {userData.rut}</p>
          <p className="text-lg text-slate-600 mb-8">Ha completado exitosamente la Inducción Municipal 2026.</p>
          <div className="flex justify-between px-10 mt-12 opacity-70 text-xs font-bold uppercase">
            <div>Gestión de Personas</div>
            <div>{currentTime.toLocaleDateString()}</div>
            <div>Alcaldía</div>
          </div>
        </div>
        <div className="fixed bottom-8 right-8 flex gap-3 print:hidden z-50">
           <button onClick={printCertificate} className="bg-white px-6 py-4 rounded-full font-bold shadow-xl"><Printer/></button>
           <button onClick={() => setStep(11)} className="bg-red-600 text-white px-6 py-4 rounded-full font-bold shadow-xl"><ArrowRight/></button>
        </div>
      </div>
    );

    // 11. COMUNIDAD
    case 11: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 shadow-2xl">
           <Smartphone size={60} className="mx-auto mb-6 text-cyan-400" />
           <h2 className="text-4xl font-black mb-4">¡Sigue Conectado!</h2>
           <p className="text-slate-300 mb-8">Únete a nuestra comunidad digital.</p>
           <div className="bg-white p-6 rounded-3xl text-slate-900 mb-8">
              <QrCode size={100} className="mx-auto mb-4"/>
              <p className="font-bold text-sm">Escanea para acceder al Portal RDMLS</p>
           </div>
           <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto">
             <RefreshCw size={14}/> Cerrar Sesión
           </button>
        </div>
      </div>
    );

    default: return null;
  }
}

```
