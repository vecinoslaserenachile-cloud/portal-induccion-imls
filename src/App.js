import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown
} from 'lucide-react';

// --- LISTA EXTENDIDA DE DEPARTAMENTOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "Secretaría Municipal", "DIDECO", "DOM (Obras)", "Tránsito", 
  "SECPLAN", "Administración y Finanzas", "Jurídica", "Control",
  "Salud", "Educación", "Seguridad Ciudadana", "Aseo y Ornato", 
  "Turismo y Patrimonio", "Cultura", "Deportes", "Comunicaciones",
  "Operaciones", "Rentas", "Bienestar", "Gestión de Riesgos"
];

// --- COMPONENTES AUXILIARES ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={14} /></div>
      <div className="text-[10px] md:text-sm">
        <p className="font-bold leading-none">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[9px] md:text-xs">Señal Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em]">Inducción IMLS 2026</div>
    <Music size={18} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ 
    nombres: '', apellidos: '', fechaNac: '', email: '', 
    direccion: '', whatsapp: '', dept: '' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 6; 
  const progress = (step / totalSteps) * 100;

  // Resetear candado y scroll al cambiar de capítulo
  useEffect(() => {
    if (step === 1 || step >= 6) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // SENSOR DE SCROLL MEJORADO (Foolproof)
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Si falta menos de 50px para llegar al fondo, desbloqueamos
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setCanAdvance(true);
    }
  };

  // PANTALLA 0: REGISTRO COMPLETO (Responsivo)
  if (step === 0) return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <div className="lg:w-1/3 bg-slate-900 p-10 flex flex-col justify-center text-white relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="La Serena" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">IMLS 2026</h1>
          <p className="text-red-500 font-bold tracking-widest uppercase text-sm">Registro de Funcionario</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Nombres</label>
              <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="Ej: Rodrigo" onChange={(e) => setUserData({...userData, nombres: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Apellidos</label>
              <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="Ej: Godoy" onChange={(e) => setUserData({...userData, apellidos: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Fecha de Nacimiento</label>
              <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" onChange={(e) => setUserData({...userData, fechaNac: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp</label>
              <input type="tel" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="+56 9..." onChange={(e) => setUserData({...userData, whatsapp: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Correo Electrónico</label>
              <input type="email" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="nombre@laserena.cl" onChange={(e) => setUserData({...userData, email: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Dirección Particular</label>
              <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="Calle, Número, Sector" onChange={(e) => setUserData({...userData, direccion: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Departamento</label>
              <select className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none transition" onChange={(e) => setUserData({...userData, dept: e.target.value})}>
                <option value="">Selecciona tu unidad...</option>
                {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
          </div>
          <button 
            disabled={!userData.nombres || !userData.dept || !userData.email} 
            onClick={() => setStep(1)} 
            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-red-600 disabled:bg-slate-200 transition-all shadow-lg flex justify-center items-center gap-2"
          >
            Comenzar Inducción <ChevronRight size={18}/>
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      
      {/* LADO IZQUIERDO: CONTENIDO */}
      <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-screen pt-10">
        <div className="px-6 lg:px-16 pt-6 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Capítulo {step}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-1">{title}</h2>
          <h3 className="text-lg text-slate-400 font-light italic">{subtitle}</h3>
        </div>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed custom-scrollbar"
        >
          {content}
          <div className="h-32"></div> {/* Espacio extra para asegurar el scroll */}
        </div>

        <div className="px-6 lg:px-16 py-4 border-t bg-slate-50 flex items-center justify-between shrink-0">
           <div className="text-xs font-bold">
             {canAdvance ? <span className="text-green-600 flex items-center gap-1 animate-pulse"><CheckCircle size={14}/> Lectura Validada</span> : <span className="text-red-500 flex items-center gap-1"><ChevronDown size={14} className="animate-bounce"/> Baja para leer todo</span>}
           </div>
           <button 
             disabled={!canAdvance} 
             onClick={() => setStep(prev => prev + 1)} 
             className="bg-red-600 text-white px-8 py-2.5 rounded-full font-bold shadow-xl hover:bg-red-700 disabled:bg-slate-300 transition-all flex items-center gap-2 text-sm"
           >
             Siguiente <ChevronRight size={16} />
           </button>
        </div>
      </div>

      {/* LADO DERECHO: MEDIA */}
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen bg-slate-900 flex items-center justify-center relative">
        {youtubeId ? (
          <div className={`${isVertical ? 'h-[90%] aspect-[9/16]' : 'w-full h-full'} bg-black overflow-hidden`}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&modestbranding=1`} 
              title="YouTube" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img src={image} alt="IMLS" className="w-full h-full object-cover opacity-60" />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  // CONTENIDOS LARGOS PARA PROBAR SCROLL
  const LongText = ({ topic }) => (
    <div className="space-y-4">
      <p><strong>{topic}:</strong> La Serena es pionera en la implementación del modelo Smart City en Chile. Esto significa que cada decisión que tomamos en la municipalidad está respaldada por datos y tecnología para mejorar la vida de los ciudadanos.</p>
      <p>Como nuevo funcionario, tu rol es fundamental en esta cadena de valor. La probidad administrativa y el buen trato al vecino no son negociables. Debes conocer el organigrama y saber que cada dirección trabaja de forma interconectada.</p>
      <p>Nuestra misión es clara: Servicio de excelencia, transparencia total y desarrollo sostenible. La Serena no es solo una ciudad histórica, es el faro del desarrollo en el norte chico.</p>
      <p>Continúa leyendo los manuales internos que se te entregarán. Recuerda que la Ley Karin nos protege a todos y asegura un ambiente de respeto mutuo. La alegría y la cordialidad deben ser tu sello personal.</p>
      <p className="font-bold text-slate-900 italic">"Para avanzar al siguiente capítulo, confirma que has comprendido los puntos anteriores bajando hasta el final de esta sección."</p>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout isVertical={true} youtubeId="yA_86g9Bq_U" title="Bienvenida Institucional" subtitle="Mensaje de nuestra Alcaldesa" content={<LongText topic="Visión de Liderazgo" />} />;
    case 2: return <ChapterLayout image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" title="Valores IMLS" subtitle="Misión y Visión Smart City" content={<LongText topic="Pilares Estratégicos" />} />;
    case 3: return <ChapterLayout image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976" title="Normativa y Respeto" subtitle="Ley Karin y Convivencia" content={<LongText topic="Seguridad Laboral" />} />;
    case 6: return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-xl w-full border-b-8 border-red-600 animate-fade-in">
          <Award size={80} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-2">¡PROCESO COMPLETADO!</h2>
          <p className="text-slate-500 mb-8 font-medium">Felicidades, {userData.nombres}. Has finalizado tu inducción oficial.</p>
          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl mb-8">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Certificado de Aprobación</p>
            <p className="text-2xl font-serif font-bold text-slate-800 leading-tight">{userData.nombres} {userData.apellidos}</p>
            <p className="text-xs text-red-600 mt-2 font-bold tracking-widest">{userData.dept}</p>
          </div>
          <button onClick={() => setStep(0)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors">Cerrar y Salir</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
