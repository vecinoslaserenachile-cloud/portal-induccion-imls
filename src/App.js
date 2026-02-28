import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, User, MapPin, 
  Radio, BookOpen, Music, Award, Mail, Calendar, 
  Phone, Home, Briefcase, ChevronDown, Shield, Users, Heart, Star, Layout, Database
} from 'lucide-react';

// --- DATOS Y CONFIGURACIÓN ---
const DEPARTAMENTOS = [
  "Alcaldía", "DIDECO", "DOM (Obras)", "Tránsito", "SECPLAN", "Jurídica", 
  "Control", "Salud", "Educación", "Seguridad Ciudadana", "Aseo y Ornato", 
  "Turismo", "Cultura", "Deportes", "Comunicaciones", "Eventos y RRPP"
];

// --- COMPONENTES UI (El Diseño Rico) ---

const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse">
        <Radio size={16} />
      </div>
      <div className="flex flex-col">
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px] tracking-wide">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
      Smart City IMLS 2026
    </div>
    <div className="flex items-center gap-4 text-slate-400">
      <Music size={18} />
      <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 w-2/3 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 w-full h-1.5 bg-slate-200 z-50">
    <div 
      className="h-full bg-red-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// --- APLICACIÓN PRINCIPAL ---

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ 
    nombres: '', apellidos: '', fechaNac: '', email: '', 
    direccion: '', whatsapp: '', dept: '' 
  });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 15;
  const progress = (step / totalSteps) * 100;

  // --- LÓGICA DE VALIDACIÓN (CORREGIDA PARA QUE NO SE PEGUE) ---
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Validamos si llegó al fondo O si el contenido es corto (no requiere scroll)
      const isShort = el.scrollHeight <= el.clientHeight + 20;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      
      if (isShort || isAtBottom) {
        setCanAdvance(true);
      }
    }
  };

  useEffect(() => {
    // Pasos que no requieren lectura obligatoria inmediata
    if (step === 0 || step === 1 || step >= 14) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Pequeño timeout para asegurar que el DOM cargó antes de medir
      setTimeout(checkProgress, 800);
    }
    // Resetear scroll al cambiar de paso
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  // --- PANTALLA 0: REGISTRO (DISEÑO COMPLETO) ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Panel Izquierdo Visual */}
      <div className="lg:w-1/3 bg-slate-900 p-12 flex flex-col justify-center text-white relative h-1/3 lg:h-full shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-black mb-2 tracking-tighter">IMLS 2026</h1>
          <div className="h-1 w-20 bg-red-600 mb-6"></div>
          <p className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2">Portal de Inducción</p>
          <p className="text-slate-400 text-sm max-w-xs">Plataforma de gestión del conocimiento para funcionarios municipales.</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto bg-white flex items-center justify-center relative">
        <div className="max-w-2xl w-full space-y-8 animate-pulse-slow">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <User className="text-red-600" /> Ficha del Funcionario
            </h2>
            <p className="text-slate-500 mt-2">Completa tus datos para iniciar el proceso de {totalSteps} capítulos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input className="p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="Apellidos" onChange={e => setUserData({...userData, apellidos: e.target.value})} />
            <input className="p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" type="date" onChange={e => setUserData({...userData, fechaNac: e.target.value})} />
            <input className="p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="WhatsApp +569..." onChange={e => setUserData({...userData, whatsapp: e.target.value})} />
            <input className="md:col-span-2 p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" type="email" placeholder="Correo electrónico institucional" onChange={e => setUserData({...userData, email: e.target.value})} />
            <select className="md:col-span-2 p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu Departamento...</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button 
            disabled={!userData.nombres || !userData.dept} 
            onClick={() => setStep(1)} 
            className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl flex justify-between items-center px-8 text-lg group"
          >
            Ingresar al Portal 
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <RadioPlayer />
    </div>
  );

  // --- PLANTILLA DE CAPÍTULOS (ESTRUCTURA VISUAL COMPLETA) ---
  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null }) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden pb-16">
      <ProgressBar progress={progress} />
      
      {/* Contenido Izquierdo */}
      <div className="w-full lg:w-1/2 flex flex-col h-[60%] lg:h-full pt-12 relative z-10 bg-white">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Capítulo {step}</span>
            <span className="text-slate-300 text-[10px]">|</span>
            <span className="text-slate-400 text-[10px] uppercase tracking-widest">IMLS 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mt-1 leading-tight tracking-tight">{title}</h2>
          <h3 className="text-xl text-red-600 font-medium italic mt-2">{subtitle}</h3>
        </div>

        {/* ÁREA DE TEXTO CON SCROLL (Aquí estaba el bug, ahora arreglado) */}
        <div 
          ref={scrollRef} 
          onScroll={checkProgress} 
          className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed custom-scrollbar"
        >
          {content}
          <div className="h-32"></div> {/* Espacio extra al final */}
        </div>

        {/* Footer de Navegación */}
        <div className="px-8 lg:px-16 py-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? 
               <span className="text-green-600 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200"><CheckCircle size={14}/> Lectura Completada</span> : 
               <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={14}/> Baja para avanzar</span>
             }
           </div>
           <button 
             disabled={!canAdvance} 
             onClick={() => setStep(prev => prev + 1)} 
             className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-red-600/30 hover:bg-slate-900 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center gap-2"
           >
             Siguiente <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* Contenido Derecho (Imagen/Video) */}
      <div className="w-full lg:w-1/2 h-[40%] lg:h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {youtubeId ? (
          <div className="w-full h-full">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&modestbranding=1&controls=1`} title="Video" frameBorder="0" allowFullScreen></iframe>
          </div>
        ) : (
          <>
            <img 
              src={image} 
              alt="IMLS Visual" 
              className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[10s]" 
              onLoad={checkProgress} /* ESTO arregla el bug de quedarse pegado */
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Star size={12} className="text-yellow-400" /> Visualización Smart City
            </div>
          </>
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- LOS 15 PASOS COMPLETOS ---
  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" youtubeId="yA_86g9Bq_U" content={<p>¡Hola! Soy Serenito y te doy la bienvenida. Hoy es el inicio de tu carrera en la Municipalidad más innovadora de Chile. Nuestra Alcaldesa tiene un mensaje especial para ti.</p>} />;
    
    case 2: return <ChapterLayout title="¿Qué es la IMLS?" subtitle="Historia y Futuro" image="PINTURA_LA_SERENA.jpg" content={
      <>
        <p>La Ilustre Municipalidad de La Serena es la segunda ciudad más antigua de Chile, fundada en 1544. Pero nuestra historia no nos ancla al pasado; nos impulsa hacia el futuro.</p>
        <p>Hoy nos transformamos en una <strong>Smart City</strong>, integrando tecnología para mejorar la calidad de vida de nuestros vecinos.</p>
      </>
    } />;
    
    case 3: return <ChapterLayout title="Valores y Estrategia" subtitle="La Lucha Municipalidad" image="ESTRATEGIA_IMLS.png" content={
      <>
        <p><strong>Eficiencia ante todo.</strong> En la nueva gestión, cada recurso cuenta. No gastamos por gastar.</p>
        <p>Implementamos el modelo <em>"Asset Light"</em> (Activos Ligeros) en nuestros eventos y gestiones. Preferimos arrendar tecnología de punta cuando la necesitamos, en lugar de comprar equipos que quedan obsoletos.</p>
        <p>Nuestra "Lucha" es contra la burocracia lenta. Queremos soluciones rápidas, digitales y cercanas.</p>
      </>
    } />;

    case 4: return <ChapterLayout title="Estructura Organizacional" subtitle="El Organigrama" image="ORGANIGRAMA.png" content={<p>Conocer tu lugar en el equipo es vital. La municipalidad se divide en direcciones estratégicas que trabajan interconectadas.</p>} />;
    
    case 5: return <ChapterLayout title="DIDECO" subtitle="Desarrollo Comunitario" image="DIDECO.jpg" content={<p>El corazón social de la muni. Aquí gestionamos ayudas, organizaciones comunitarias y el bienestar directo de los vecinos.</p>} />;

    case 6: return <ChapterLayout title="Seguridad Ciudadana" subtitle="La Serena Segura" image="SEGURIDAD.jpg" content={<p>Trabajamos 24/7 con patrullajes preventivos, cámaras de televigilancia y coordinación directa con Carabineros.</p>} />;

    case 7: return <ChapterLayout title="Tránsito y Transporte" subtitle="Movilidad Inteligente" image="TRANSITO.jpg" content={<p>Gestionamos la señalética, licencias de conducir y buscamos optimizar el flujo vehicular con tecnología.</p>} />;

    case 8: return <ChapterLayout title="Obras (DOM)" subtitle="Construyendo Ciudad" image="OBRAS.jpg" content={<p>Regulamos la edificación y el urbanismo. Velamos porque el crecimiento de la ciudad sea ordenado y legal.</p>} />;

    case 9: return <ChapterLayout title="Salud y Educación" subtitle="Pilares Fundamentales" image="SALUD_EDU.jpg" content={<p>Administramos los CESFAM y colegios municipales, garantizando derechos básicos con calidad y calidez.</p>} />;

    case 10: return <ChapterLayout title="Aseo y Ornato" subtitle="Ciudad Limpia" image="PARQUES.jpg" content={<p>Desde la recolección de residuos hasta el cuidado de nuestras áreas verdes. Una ciudad limpia es tarea de todos.</p>} />;

    case 11: return <ChapterLayout title="Turismo y Cultura" subtitle="Patrimonio Vivo" image="FARO.jpg" content={<p>La Serena es capital turística. Protegemos nuestro Faro, nuestras iglesias y fomentamos eventos culturales todo el año.</p>} />;

    case 12: return <ChapterLayout title="Canales de Comunicación" subtitle="Siempre Conectados" image="APP_MUNI.jpg" content={<p>Usamos WhatsApp, Redes Sociales y la App "La Serena Más Cerca" para escuchar al vecino en tiempo real.</p>} />;

    case 13: return <ChapterLayout title="Beneficios al Funcionario" subtitle="Cuidamos a quien cuida" image="BIENESTAR.jpg" content={<p>Conoce tus derechos: días administrativos, convenios de salud, y actividades de bienestar laboral.</p>} />;

    case 14: return <ChapterLayout title="Evaluación Final" subtitle="Demuestra lo aprendido" image="QUIZ.png" content={<p>¡Has llegado al final del recorrido! Responde este breve cuestionario para validar tu inducción y obtener tu certificado digital.</p>} />;

    case 15: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070')] bg-cover opacity-10"></div>
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full border-b-8 border-red-600 relative z-10 text-center animate-pulse-slow">
          <Award size={100} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-2 leading-tight uppercase">¡Inducción Aprobada!</h2>
          <p className="text-xl text-slate-500 mb-8 font-medium italic">Felicidades, {userData.nombres}. Eres oficialmente parte del equipo IMLS 2026.</p>
          <div className="p-8 border-4 border-double border-slate-100 bg-slate-50 rounded-3xl text-3xl font-serif mb-8 text-slate-700">Certificado de Aprobación</div>
          <button onClick={() => setStep(0)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-xl">Reiniciar Sistema</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
