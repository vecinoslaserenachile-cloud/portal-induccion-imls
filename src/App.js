import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, HelpCircle, 
  Mail, Calendar, Phone, Home, Briefcase
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "Secretaría Municipal", "DIDECO (Desarrollo Comunitario)", 
  "DOM (Obras Municipales)", "Dirección de Tránsito", "SECPLAN (Planificación)", 
  "Administración y Finanzas", "Asesoría Jurídica", "Dirección de Control",
  "Salud (Corporación)", "Educación (Corporación)", "Seguridad Ciudadana",
  "Aseo y Ornato", "Medio Ambiente", "Turismo y Patrimonio", "Cultura",
  "Deportes y Recreación", "Comunicaciones e Imagen", "Operaciones y Eventos",
  "Rentas y Patentes", "Bienestar de Personal", "Gestión de Riesgos y Desastres"
];

// Texto simulado largo para forzar el scroll
const LOREM_IMLS = (
  <div className="space-y-4">
    <p><strong>Contexto Histórico:</strong> La Serena, fundada en 1544, es la segunda ciudad más antigua de Chile. Como funcionario, eres custodio de una tradición de servicio que abarca siglos. Nuestro compromiso es preservar el patrimonio mientras abrazamos la tecnología Smart City.</p>
    <p><strong>Cultura Organizacional:</strong> Trabajamos bajo un modelo de gestión por procesos donde la eficiencia no sacrifica la humanidad. La atención al vecino debe ser siempre nuestra prioridad número uno, entendiendo que cada interacción es una oportunidad para fortalecer el tejido social.</p>
    <p><strong>Innovación 2026:</strong> El proyecto RDMLS (Radio Digital Municipal) y la integración de personajes 3D como Serenito son parte de nuestra nueva cara hacia el futuro. Buscamos simplificar la burocracia mediante herramientas digitales de última generación.</p>
    <p><strong>Responsabilidades:</strong> Cada dirección tiene protocolos específicos de actuación. Es imperativo conocer los manuales de procedimiento y las normas de ética pública. La probidad no es una opción, es el cimiento de nuestra institución.</p>
    <p><strong>Entorno Smart City:</strong> Estamos implementando sensores de tráfico, gestión de residuos inteligente y una red de conectividad pública que requiere de funcionarios capacitados en el uso de datos para la toma de decisiones.</p>
    <p className="text-red-600 font-bold">IMPORTANTE: Para continuar, debe leer hasta el final de este documento técnico para asegurar la comprensión de los valores institucionales.</p>
  </div>
);

// --- COMPONENTES UI ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="text-sm hidden md:block">
        <p className="font-bold">Radio Digital La Serena</p>
        <p className="text-xs text-slate-400">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-[0.2em]">Inducción Smart City IMLS</div>
    <Music size={18} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ 
    firstName: '', lastName: '', dob: '', email: '', 
    address: '', whatsapp: '', dept: '' 
  });
  const [canAdvance, setCanAdvance] = useState(false);

  const totalSteps = 6; 
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Solo bloqueamos por scroll en los pasos de contenido (2, 3, 4, 5)
    if (step === 1 || step >= 6) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
    }
    // Volver al inicio del contenedor al cambiar paso
    const scroller = document.getElementById('text-scroller');
    if (scroller) scroller.scrollTop = 0;
  }, [step]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Sensor más preciso: requiere llegar al 98% del contenido
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      setCanAdvance(true);
    }
  };

  // PANTALLA 0: REGISTRO COMPLETO
  if (step === 0) return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <div className="hidden lg:flex lg:w-1/3 bg-slate-900 items-center justify-center relative">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="La Serena" />
        <div className="relative z-10 text-white p-10 text-center">
          <h1 className="text-5xl font-black mb-4">IMLS</h1>
          <p className="text-xl font-light tracking-widest uppercase">Portal de Inducción</p>
        </div>
      </div>
      
      <div className="w-full lg:w-2/3 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
          <div className="mb-8">
             <h2 className="text-3xl font-bold text-slate-800">Ficha del Funcionario</h2>
             <p className="text-slate-500 mt-1">Ingresa tus datos personales para el registro institucional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombres</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input type="text" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Juan Ignacio" onChange={(e) => setUserData({...userData, firstName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Apellidos</label>
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Pérez González" onChange={(e) => setUserData({...userData, lastName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Fecha de Nacimiento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input type="date" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" onChange={(e) => setUserData({...userData, dob: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input type="tel" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" placeholder="+56 9 1234 5678" onChange={(e) => setUserData({...userData, whatsapp: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input type="email" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" placeholder="juan.perez@laserena.cl" onChange={(e) => setUserData({...userData, email: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Dirección Particular</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input type="text" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Av. Francisco de Aguirre #..." onChange={(e) => setUserData({...userData, address: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Departamento / Área</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18}/>
                <select className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none appearance-none" onChange={(e) => setUserData({...userData, dept: e.target.value})}>
                  <option value="">Seleccione su unidad...</option>
                  {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button 
            disabled={!userData.firstName || !userData.lastName || !userData.dept || !userData.email} 
            onClick={() => setStep(1)} 
            className="w-full mt-8 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-red-700 disabled:bg-slate-200 transition-all flex justify-between items-center group shadow-lg"
          >
            <span>Iniciar Inducción</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      
      <div className="w-full lg:w-1/2 flex flex-col h-screen pt-12">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <span className="text-red-600 font-black text-[10px] tracking-widest uppercase">Capítulo {step} de {totalSteps}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">{title}</h2>
          <h3 className="text-xl text-slate-400 font-light italic">{subtitle}</h3>
        </div>

        <div 
          id="text-scroller"
          className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed custom-scrollbar" 
          onScroll={handleScroll}
        >
          {content}
          <div className="h-20"></div>
          {!canAdvance && (
             <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 animate-pulse">
               <span className="text-red-700 font-bold text-sm">↓ Debe desplazar hacia abajo para completar la lectura institucional</span>
             </div>
          )}
        </div>

        <div className="px-8 lg:px-16 py-6 border-t bg-slate-50 flex items-center justify-between shrink-0">
           <div className="text-sm font-medium">
             {canAdvance ? <span className="text-green-600 flex items-center gap-1">✅ Lectura Validada</span> : <span className="text-slate-400 italic">Pendiente de lectura...</span>}
           </div>
           <button 
             disabled={!canAdvance} 
             onClick={() => setStep(prev => prev + 1)} 
             className="bg-red-600 text-white px-10 py-3 rounded-full font-bold shadow-xl hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
           >
             Siguiente <ChevronRight size={20} />
           </button>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 h-screen relative bg-slate-900 flex items-center justify-center`}>
        {youtubeId ? (
          <div className={`${isVertical ? 'h-[90%] aspect-[9/16]' : 'w-full aspect-video'} bg-black shadow-2xl overflow-hidden rounded-2xl`}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&modestbranding=1`} 
              title="YouTube video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img src={image} alt="Visual" className="w-full h-full object-cover opacity-60" />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  switch (step) {
    case 1: 
      return <ChapterLayout 
        isVertical={true}
        youtubeId="yA_86g9Bq_U" // ID de un ejemplo vertical (Short)
        title="Mensaje de Bienvenida" 
        subtitle="Un saludo de nuestra Alcaldesa" 
        content={LOREM_IMLS} 
      />;
    case 2: 
      return <ChapterLayout 
        image="https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=2033"
        title="Visión Smart City" 
        subtitle="Hacia el Municipio del Futuro" 
        content={LOREM_IMLS} 
      />;
    case 3: 
      return <ChapterLayout 
        image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
        title="Ley Karin y Convivencia" 
        subtitle="Nuestro compromiso con el respeto" 
        content={LOREM_IMLS} 
      />;
    case 6: 
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[150px] opacity-20"></div>
          <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-2xl relative z-10 border-b-8 border-red-600">
            <Award size={100} className="mx-auto text-red-600 mb-8" />
            <h2 className="text-5xl font-black text-slate-900 mb-4">¡LOGRADO!</h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Felicitaciones <strong>{userData.firstName} {userData.lastName}</strong>.<br/>
              Has completado exitosamente la inducción para la unidad de <strong>{userData.dept}</strong>.
            </p>
            <div className="p-8 border-4 border-double border-slate-100 bg-slate-50 rounded-3xl italic font-serif text-3xl text-slate-800 mb-10 shadow-inner">
              Certificado Digital IMLS 2026
            </div>
            <button onClick={() => setStep(0)} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg">Cerrar Sesión</button>
          </div>
          <RadioPlayer />
        </div>
      );
    default: return null;
  }
}

export default App;
