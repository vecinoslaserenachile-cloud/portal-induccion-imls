import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, HelpCircle, XCircle 
} from 'lucide-react';

// --- CONFIGURACIÓN DE PREGUNTAS (EVALUACIÓN) ---
const QUIZ_DATA = [
  {
    question: "¿Cuál es uno de los valores principales de la IMLS?",
    options: ["Competencia feroz", "Probidad y Transparencia", "Trabajo individual"],
    correct: 1, // La opción 1 es la correcta (empezando de 0)
    feedback: "¡Exacto! La probidad es nuestro norte."
  },
  {
    question: "¿Qué Ley nos protege contra el acoso laboral?",
    options: ["Ley del Tránsito", "Ley Karin", "Ley de Rentas"],
    correct: 1,
    feedback: "Correcto. La Ley Karin asegura espacios seguros."
  },
  {
    question: "Verdadero o Falso: ¿Debemos saludar con cordialidad a los vecinos?",
    options: ["Verdadero", "Falso"],
    correct: 0,
    feedback: "¡Así es! El buen trato es nuestro sello."
  }
];

const DEPARTAMENTOS = [
  "Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", 
  "Jurídica", "Administración y Finanzas", "Secplan", 
  "Gestión de Riesgos", "Salud", "Educación", "Turismo"
];

// --- COMPONENTES UI ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse">
        <Radio size={16} />
      </div>
      <div className="text-sm hidden md:block">
        <p className="font-bold">Radio Municipal La Serena</p>
        <p className="text-xs text-slate-400">En vivo: "Innovación Smart City"</p>
      </div>
    </div>
    <div className="flex gap-4 text-xs text-slate-400 uppercase tracking-widest">
      <span>Portal de Inducción IMLS 2026</span>
    </div>
    <Music size={20} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
    <div 
      className="h-full bg-red-600 transition-all duration-700 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// --- COMPONENTE DE QUIZ ---
const QuizModule = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (idx) => {
    setSelected(idx);
    const correct = idx === QUIZ_DATA[currentQ].correct;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(curr => curr + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      onComplete(); // Termina el quiz
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 text-blue-600">
        <HelpCircle />
        <span className="font-bold uppercase tracking-wider">Evaluación de Conocimientos</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {currentQ + 1}. {QUIZ_DATA[currentQ].question}
      </h3>

      <div className="space-y-3">
        {QUIZ_DATA[currentQ].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !showFeedback && handleAnswer(idx)}
            disabled={showFeedback}
            className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
              showFeedback 
                ? idx === QUIZ_DATA[currentQ].correct 
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : idx === selected 
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-gray-50 border-gray-200 opacity-50'
                : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 bg-slate-100 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-2 font-bold">
            {isCorrect ? <CheckCircle className="text-green-600"/> : <XCircle className="text-red-600"/>}
            <span>{isCorrect ? "¡Correcto!" : "Casi..."}</span>
          </div>
          <p className="text-gray-600 mb-4">{QUIZ_DATA[currentQ].feedback}</p>
          <button 
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            {currentQ < QUIZ_DATA.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
          </button>
        </div>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false); // Candado de lectura

  const totalSteps = 10; // Login + Video + 5 Caps + Quiz + Cert
  const progress = (step / totalSteps) * 100;

  // Resetear el candado al cambiar de paso
  useEffect(() => {
    if (step === 8) return; // En el Quiz no aplicamos scroll lock
    setCanAdvance(false);
  }, [step]);

  // Manejador de scroll para desbloquear
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20;
    if (bottom && !canAdvance) {
      setCanAdvance(true);
    }
  };

  // PANTALLA 0: REGISTRO
  if (step === 0) return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        {/* TU IMAGEN DE FONDO AQUÍ */}
        <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="La Serena" />
        <div className="relative z-10 text-white p-12 max-w-lg">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">Portal IMLS 2026</h1>
          <p className="text-2xl font-light">Innovación Municipal de Clase Mundial</p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
             <h2 className="text-3xl font-bold text-gray-800">Bienvenido al Equipo</h2>
             <p className="text-gray-500">Completa tus datos para iniciar la experiencia.</p>
          </div>
          <div className="space-y-5">
            <input 
              type="text" 
              className="w-full p-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none transition"
              placeholder="Tu Nombre Completo"
              onChange={(e) => setUserData({...userData, name: e.target.value})}
            />
            <select 
              className="w-full p-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none transition"
              onChange={(e) => setUserData({...userData, dept: e.target.value})}
            >
              <option value="">Selecciona tu Departamento</option>
              {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            <button 
              disabled={!userData.name || !userData.dept}
              onClick={() => setStep(1)}
              className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-300 transition-all flex justify-between items-center group"
            >
              <span>Ingresar</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // LAYOUT INTERNO
  const ChapterLayout = ({ title, subtitle, text, image, isVideo = false }) => (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      <ProgressBar progress={progress} />
      
      {/* Columna Izquierda: Contenido con SCROLL */}
      <div className="w-full md:w-1/2 flex flex-col h-screen pt-10 pb-20">
        <div className="px-8 md:px-16 pt-8 pb-4 shrink-0">
          <div className="text-red-600 font-bold tracking-widest text-xs mb-2 uppercase">Capítulo {step}</div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{title}</h2>
          <h3 className="text-xl text-slate-500">{subtitle}</h3>
        </div>

        {/* ÁREA SCROLLABLE (CANDADO) */}
        <div 
          className="flex-1 overflow-y-auto px-8 md:px-16 py-4 space-y-6 text-lg text-slate-600 leading-relaxed custom-scrollbar"
          onScroll={handleScroll}
        >
          {text}
          {/* Espaciador para asegurar scroll */}
          <div className="h-10"></div>
          <div className="text-center text-sm text-gray-400 italic">
            (Sigue bajando para completar la lectura)
          </div>
        </div>

        {/* BOTÓN DE AVANCE (Footer fijo) */}
        <div className="px-8 md:px-16 py-6 border-t bg-white shrink-0 flex items-center justify-between">
           <div className="flex items-center gap-2 text-sm">
             {canAdvance ? (
               <span className="text-green-600 flex items-center gap-1 font-bold animate-pulse"><CheckCircle size={16}/> Lectura Completada</span>
             ) : (
               <span className="text-gray-400">Lee todo para avanzar...</span>
             )}
           </div>
           <button 
             disabled={!canAdvance}
             onClick={() => setStep(prev => prev + 1)}
             className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
           >
             Siguiente <ChevronRight size={20} />
           </button>
        </div>
      </div>

      {/* Columna Derecha: Imagen/Video Fijo */}
      <div className="hidden md:block w-1/2 h-screen relative bg-slate-800">
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
             <img src={image} className="opacity-50 w-full h-full object-cover" alt="Video cover" />
             <div className="absolute z-10 text-white text-center cursor-pointer hover:scale-110 transition-transform">
               <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-white">
                 <Play size={40} className="ml-1"/>
               </div>
               <p className="font-bold">Ver Saludo Alcaldesa</p>
             </div>
          </div>
        ) : (
          <>
            <img src={image} alt="Visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
               <div className="absolute bottom-20 left-10 right-10 text-white">
                 <p className="italic text-lg">"La innovación es parte de nuestro ADN municipal"</p>
               </div>
            </div>
          </>
        )}
      </div>

      <RadioPlayer />
    </div>
  );

  // --- LOGICA DE PASOS ---

  switch (step) {
    case 1: // VIDEO
      return <ChapterLayout 
        isVideo={true}
        title="Saludo Inicial"
        subtitle="Mensaje de la Alcaldesa"
        text={<>
          <p>Bienvenido a la Ilustre Municipalidad de La Serena. Este video marca el inicio de tu carrera funcionaria con nosotros.</p>
          <p>En nuestra gestión, la probidad y el servicio a la comunidad son los pilares fundamentales que deben guiar tu actuar diario.</p>
          <p>Te invitamos a escuchar atentamente las palabras de nuestra máxima autoridad comunal, quien te explicará la importancia de tu rol en este engranaje de servicio público.</p>
          <p><strong>Recuerda:</strong> Somos servidores públicos. Nuestra misión es mejorar la calidad de vida de cada vecino que se acerca a nuestras oficinas.</p>
        </>}
        image="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974"
      />;

    case 2: // MISIÓN VISIÓN
      return <ChapterLayout 
        title="Nuestra Esencia"
        subtitle="Misión, Visión y Valores"
        text={<>
          <p><strong>Nuestra Misión:</strong> Entregar servicios de excelencia a la comunidad, promoviendo el desarrollo integral de la comuna y sus habitantes.</p>
          <p><strong>Nuestra Visión:</strong> Ser un municipio moderno, inclusivo, transparente y sostenible, reconocido por su gestión innovadora.</p>
          <hr className="my-6 border-gray-200"/>
          <h4 className="font-bold text-gray-900 mb-2">Valores Institucionales:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Probidad:</strong> Actuar con rectitud y honestidad.</li>
            <li><strong>Transparencia:</strong> Información clara y accesible.</li>
            <li><strong>Compromiso:</strong> Pasión por el servicio público.</li>
            <li><strong>Inclusión:</strong> Una ciudad para todos y todas.</li>
          </ul>
          <p className="mt-4">Estos valores no son solo palabras; deben reflejarse en cada atención, en cada trámite y en cada decisión que tomes.</p>
        </>}
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070"
      />;

    case 3: // ORGANIGRAMA
      return <ChapterLayout 
        title="Estructura Municipal"
        subtitle="¿Cómo funcionamos?"
        text={<>
          <p>El municipio es un gran equipo interconectado. Conocer el organigrama te ayudará a saber a quién recurrir.</p>
          <p><strong>Alcaldía y Concejo:</strong> Lideran la estrategia comunal.</p>
          <p><strong>DIDECO (Desarrollo Comunitario):</strong> El corazón social del municipio.</p>
          <p><strong>DOM (Obras):</strong> Regula el crecimiento urbano.</p>
          <p><strong>Tránsito:</strong> Ordena la movilidad de la ciudad.</p>
          <p><strong>Secplan:</strong> Diseña los proyectos de inversión.</p>
          <p className="mt-4">Tu trabajo en el departamento de <strong>{userData.dept}</strong> es esencial para que esta maquinaria funcione correctamente.</p>
        </>}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
      />;

    case 4: // LEY KARIN
      return <ChapterLayout 
        title="Ley Karin y Seguridad"
        subtitle="Un entorno laboral seguro"
        text={<>
          <p>La seguridad y el respeto son intransables. La <strong>Ley Karin</strong> establece protocolos claros para prevenir y sancionar el acoso laboral, sexual y la violencia en el trabajo.</p>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 my-4">
            <p className="font-bold text-red-800">Tolerancia Cero</p>
            <p className="text-sm text-red-700">No aceptamos ninguna forma de maltrato. Si eres testigo o víctima, existen canales de denuncia confidenciales.</p>
          </div>
          <p>Además, debes conocer los protocolos de seguridad de tu edificio (Prevención de Riesgos). Identifica las vías de evacuación y zonas seguras.</p>
          <p>Cuidarnos entre nosotros es la primera tarea.</p>
        </>}
        image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976"
      />;

    case 5: // CALIDAD DE SERVICIO
      return <ChapterLayout 
        title="Sello del Funcionario"
        subtitle="Empatía y Calidad"
        text={<>
          <p>El ciudadano no es un número, es un vecino. Nuestro sello es la <strong>empatía</strong>.</p>
          <p>A veces no podremos decir que "sí" a todo, pero siempre podemos dar una respuesta amable, clara y oportuna.</p>
          <p><strong>Claves de la Atención:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Saluda siempre con una sonrisa.</li>
            <li>Escucha activamente antes de responder.</li>
            <li>Usa un lenguaje claro, evita tecnicismos innecesarios.</li>
            <li>Si no sabes la respuesta, averigua o deriva responsablemente.</li>
          </ul>
          <p className="mt-4">Tú eres la cara visible de la municipalidad ante la comunidad.</p>
        </>}
        image="https://images.unsplash.com/photo-1521737781864-ca0461136d7b?q=80&w=1924"
      />;

    case 6: // REPUTACIÓN
      return <ChapterLayout 
        title="Reputación 360°"
        subtitle="Cuidando nuestra imagen"
        text={<>
          <p>La reputación se construye gota a gota y se pierde a chorros. En la era digital, cada acción cuenta.</p>
          <p><strong>Mapa de Públicos:</strong></p>
          <p>Nos relacionamos con vecinos, turistas, proveedores, gobierno central y medios de comunicación.</p>
          <p>Un buen funcionario cuida la imagen institucional tanto dentro como fuera del horario laboral. Somos embajadores de La Serena.</p>
          <p>Ante crisis o reclamos en redes sociales, no respondas impulsivamente. Sigue los conductos oficiales de comunicaciones.</p>
        </>}
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932"
      />;

    case 7: // PERSONAJES
      return <ChapterLayout 
        title="Campaña Comunicacional"
        subtitle="Conoce a nuestros Personajes"
        text={<>
          <p>Para comunicar mejor, hemos creado un ecosistema de personajes que representan la diversidad de nuestra comuna.</p>
          <p><strong>Serenito:</strong> Nuestro guía principal, amable y tecnológico.</p>
          <p><strong>Don Joaco:</strong> La experiencia y sabiduría de la planta municipal.</p>
          <p><strong>Milagros:</strong> La energía y eficiencia de la contrata.</p>
          <p><strong>Compita:</strong> La fuerza del terreno y el trabajo a honorarios.</p>
          <p>Úsalos en tus presentaciones y comunicaciones internas para dar vida y cercanía a los mensajes institucionales.</p>
        </>}
        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070"
      />;

    case 8: // QUIZ
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <ProgressBar progress={90} />
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Pon a prueba lo aprendido!</h2>
            <p className="text-slate-500">Responde correctamente para obtener tu certificado.</p>
          </div>
          
          <QuizModule onComplete={() => setStep(9)} />
          
          <RadioPlayer />
        </div>
      );

    case 9: // CERTIFICADO
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
          {/* Confeti de fondo simple */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-red-100 to-transparent"></div>
          
          <ProgressBar progress={100} />
          
          <div className="relative max-w-3xl w-full text-center space-y-8 animate-fade-in-up">
            <div className="inline-block bg-red-100 p-6 rounded-full text-red-600 mb-4">
               <Award size={64} />
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900">¡Felicitaciones!</h1>
            <p className="text-xl text-slate-600">Has completado exitosamente tu inducción.</p>

            {/* DIPLOMA */}
            <div className="bg-white border-4 border-double border-slate-200 p-12 shadow-2xl rounded-lg max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500">
               <div className="flex justify-center mb-6 opacity-80">
                 {/* Aquí iría el logo IMLS */}
                 <div className="text-2xl font-serif font-bold tracking-widest text-slate-800">IMLS 2026</div>
               </div>
               <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">Certifica que</p>
               <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-slate-900">
                 {userData.name}
               </h2>
               <p className="text-lg text-slate-600 mb-6">del Departamento de {userData.dept}</p>
               <p className="text-sm text-slate-400">Ha aprobado el programa de inducción "Innovación Municipal de Clase Mundial"</p>
               
               <div className="mt-8 pt-8 border-t flex justify-between items-end">
                 <div className="text-left">
                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=CertificadoValido" alt="QR" className="opacity-80"/>
                 </div>
                 <div className="text-right">
                   <div className="h-10 w-32 border-b border-slate-400 mb-2"></div>
                   <p className="text-xs font-bold uppercase">Director RRHH</p>
                 </div>
               </div>
            </div>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 flex items-center gap-2 mx-auto">
              <CheckCircle /> Finalizar Proceso
            </button>
          </div>
          <RadioPlayer />
        </div>
      );

    default:
      return null;
  }
}

export default App;
