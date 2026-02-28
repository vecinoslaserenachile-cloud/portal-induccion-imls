import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown, Shield, Users, Heart, Star, Layout, Database
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const DEPARTAMENTOS = [
  "Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", "SECPLAN", "Jurídica", 
  "Control", "Salud", "Educación", "Seguridad Ciudadana", "Aseo y Ornato", 
  "Turismo", "Cultura", "Deportes", "Comunicaciones", "Eventos y RRPP"
];

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 shadow-2xl h-16">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="text-xs">
        <p className="font-bold leading-none">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px]">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Smart City IMLS 2026</div>
    <Music size={20} className="text-slate-500" />
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
  </div>
);

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ 
    nombres: '', apellidos: '', fechaNac: '', email: '', 
    direccion: '', whatsapp: '', dept: '' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 15; // De 0 a 15
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Solo bloqueamos por scroll en capítulos de contenido (2 al 13)
    if (step === 0 || step === 1 || step >= 14) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 50) setCanAdvance(true);
  };

  // --- PANTALLA 0: REGISTRO FULLSCREEN ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      <div className="lg:w-1/3 bg-slate-900 p-12 flex flex-col justify-center text-white relative h-1/3 lg:h-full">
        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="La Serena" />
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-5xl font-black mb-2 tracking-tighter">IMLS 2026</h1>
          <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Portal de Inducción</p>
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-slate-800">Ficha del Funcionario</h2>
            <p className="text-slate-500">Completa tus datos para iniciar el proceso de {totalSteps} capítulos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" type="date" onChange={e => setUserData({...userData, fechaNac: e.target.value})} />
            <input className="p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="WhatsApp +569..." onChange={e => setUserData({...userData, whatsapp: e.target.value})} />
            <input className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" type="email" placeholder="Correo electrónico institucional" onChange={e => setUserData({...userData, email: e.target.value})} />
            <input className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" placeholder="Dirección particular" onChange={e => setUserData({...userData, direccion: e.target.value})} />
            <select className="md:col-span-2 p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu Departamento...</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="w-full bg-slate-900 text-white p-5 rounded-3xl font-bold hover:bg-red-600 disabled:bg-slate-200 transition-all shadow-xl flex justify-between items-center px-8">
            Ingresar al Portal <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null, isVertical = false }) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      <div className="w-full lg:w-1/2 flex flex-col h-[60%] lg:h-full pt-12">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase">Capítulo {step} de {totalSteps}</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mt-1 leading-tight">{title}</h2>
          <h3 className="text-lg text-slate-400 font-light italic">{subtitle}</h3>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-xl text-slate-600 leading-relaxed custom-scrollbar">
          {content}
          <div className="h-40"></div>
        </div>
        <div className="px-8 lg:px-16 py-6 border-t bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase">
             {canAdvance ? <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle /> Lectura Validada</span> : <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown /> Sigue bajando para avanzar</span>}
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(prev => prev + 1)} className="bg-red-600 text-white px-10 py-3 rounded-full font-bold shadow-2xl hover:bg-red-700 disabled:bg-slate-300 transition-all flex items-center gap-2">Siguiente <ChevronRight /></button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-[40%] lg:h-full bg-slate-900 flex items-center justify-center relative">
        {youtubeId ? (
          <div className={`${isVertical ? 'h-[90%] aspect-[9/16]' : 'w-full h-full'} bg-black`}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&modestbranding=1&controls=0`} title="Video" frameBorder="0" allowFullScreen></iframe>
          </div>
        ) : (
          <img src={image} alt="IMLS" className="w-full h-full object-cover opacity-60 transition-opacity duration-1000" />
        )}
        <div className="absolute top-6 right-6 bg-slate-900/50 p-3 rounded-full text-white text-xs font-bold uppercase tracking-widest">Visualización Smart City</div>
      </div>
      <RadioPlayer />
    </div>
  );

  // --- LOS 15 PASOS DE LA INDUCCIÓN ---
  switch (step) {
    case 1: return <ChapterLayout isVertical={true} youtubeId="yA_86g9Bq_U" title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" content={<p>¡Hola! Soy Serenito y te doy la bienvenida. Hoy es el inicio de tu carrera en la Municipalidad más innovadora de Chile. Nuestra Alcaldesa tiene un mensaje especial para ti.</p>} />;
    case 2: return <ChapterLayout image="PINTURA_LA_SERENA.jpg" title="¿Qué es la IMLS?" subtitle="Misión y Visión" content={<p>La Ilustre Municipalidad de La Serena es la segunda ciudad más antigua de Chile, pero nuestra mente está en el futuro. Buscamos ser un faro de desarrollo y bienestar.</p>} />;
    case 3: return <ChapterLayout image="ESTRATEGIA_IMLS.png" title="Valores y Estrategia" subtitle="Modelo Asset Light" content={<p>Priorizamos la eficiencia. En el área de Eventos usamos el modelo "Asset Light": arrendamos lo grande para invertir en lo que importa: las personas.</p>} />;
    case 4: return <ChapterLayout image="AUTORIDADES_FOTO.png" title="Nuestras Autoridades" subtitle="Alcaldesa y Concejo" content={<p>Daniela Norambuena lidera el equipo. Trabajamos junto al Gobernador Cristóbal Juliá y los Delegados Presidenciales en el orden de precedencia legal.</p>} />;
    case 5: return <ChapterLayout image="ORGANIGRAMA_FULL.png" title="Estructura Municipal" subtitle="Las 14 Direcciones" content={<p>Desde DIDECO hasta la Dirección de Obras (DOM). Somos una maquinaria compleja coordinada para el bienestar del vecino.</p>} />;
    case 6: return <ChapterLayout image="SERVICIOS_AL_VECINO.png" title="Servicios al Vecino" subtitle="Permisos y Soluciones" content={<p>Tu rol, {userData.nombres}, es facilitar la vida de los usuarios en trámites de tránsito, patentes y asistencia social.</p>} />;
    case 7: return <ChapterLayout image="LEY_KARIN_ICONO.png" title="Ley Karin" subtitle="Respeto y Convivencia" content={<p>Garantizamos un ambiente laboral seguro. El maltrato y el acoso no tienen lugar en nuestra municipalidad. El respeto es ley.</p>} />;
    case 8: return <ChapterLayout image="SEGURIDAD_INDUSTRIAL.jpg" title="Seguridad y Calidad" subtitle="Normas y Protocolos" content={<p>Tu integridad es lo primero. Conoce las vías de evacuación y los protocolos de seguridad industrial en cada recinto municipal.</p>} />;
    case 9: return <ChapterLayout image="REMUNERACIONES_TABLA.png" title="Tu Contrato" subtitle="Remuneraciones y Modalidad" content={<p>Ya seas Planta, Contrata u Honorarios (como tu cargo a Suma Alzada), tenemos un formato de remuneraciones transparente.</p>} />;
    case 10: return <ChapterLayout image="ETICA_MANEJO.png" title="Manejo de Información" subtitle="Ética y Confidencialidad" content={<p>La alegría para trabajar va de la mano con el respeto por la información sensible de nuestros vecinos.</p>} />;
    case 11: return <ChapterLayout image="MAPA_PUBLICOS_360.png" title="Reputación 360°" subtitle="Nuestros Stakeholders" content={<p>Gestionamos la confianza ante vecinos, turistas e inversionistas. Cada acción tuya construye la reputación de La Serena.</p>} />;
    case 12: return <ChapterLayout image="SERENITO_CAMPANA.png" title="Campaña Serenito" subtitle="Los 14 Personajes" content={<p>Serenito, Fariño, Compita y Milagros te acompañarán. Son la cara humana de nuestra tecnología Smart City.</p>} />;
    case 13: return <ChapterLayout image="RADIO_3D_TOUR.png" title="La Nueva Era Digital" subtitle="Radio RDMLS y Paseos 3D" content={<p>Innovamos con la Radio Digital y paseos históricos en 3D. Somos una Smart City que no olvida su patrimonio.</p>} />;
    case 14: return <ChapterLayout image="QUIZ_ICONO.png" title="Evaluación" subtitle="Mide tu aprendizaje" content={<p>¡Llegaste al nivel final! Responde este breve cuestionario didáctico para obtener tu certificado.</p>} />;
    case 15: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-8 text-white relative">
        <div className="absolute inset-0 bg-red-600 opacity-10 animate-pulse"></div>
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full border-b-8 border-red-600 relative z-10 text-center">
          <Award size={100} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-2">¡EXCELENTE TRABAJO!</h2>
          <p className="text-xl text-slate-500 mb-8 font-medium">Felicidades, {userData.nombres}. Has completado la inducción IMLS 2026.</p>
          <div className="p-8 border-4 border-double border-slate-100 bg-slate-50 rounded-3xl italic font-serif text-3xl mb-10 shadow-inner">Certificado Digital de Aprobación</div>
          <button onClick={() => setStep(0)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors">Finalizar y Cerrar</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
