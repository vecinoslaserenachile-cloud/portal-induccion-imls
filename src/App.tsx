import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, ChevronRight, Radio, Music, Award, 
  ChevronDown, Shield, Heart, DollarSign, 
  Printer, RefreshCw, XCircle, Phone, User, Briefcase, MapPin
} from 'lucide-react';

// --- DATOS DEL QUIZ ---
const QUESTIONS = [
  { q: "¿Cuántos tipos de contrato existen principalmente?", options: ["Solo Honorarios", "Planta, Contrata y Honorarios", "Solo Voluntariado"], ans: 1 },
  { q: "¿Cuántos concejales componen el Concejo 2024-2028?", options: ["6 Concejales", "8 Concejales", "10 Concejales"], ans: 2 },
  { q: "¿Qué ley sanciona el acoso laboral (Ley Karin)?", options: ["Ley 21.643", "Ley de Tránsito", "Estatuto Administrativo"], ans: 0 },
  { q: "¿Cuál es el principio base del funcionario?", options: ["Rapidez", "Probidad Administrativa", "Creatividad"], ans: 1 },
  { q: "¿Cuándo se pagan las remuneraciones?", options: ["El día 5 del mes", "El último día hábil", "El penúltimo día hábil del mes"], ans: 2 },
  { q: "¿Qué hacer ante un accidente laboral?", options: ["Irse a casa", "Informar de inmediato a jefatura", "Esperar que pase el dolor"], ans: 1 },
  { q: "¿Quién lidera la administración comunal?", options: ["El Delegado", "La Alcaldesa", "El Gobernador"], ans: 1 },
  { q: "¿Qué documento regula deberes y derechos internos?", options: ["Reglamento Interno", "Constitución", "Diario Oficial"], ans: 0 },
  { q: "¿A quién nos debemos principalmente?", options: ["Al Gobierno", "A los Vecinos", "A los Gremios"], ans: 1 },
  { q: "¿Cuál es el canal de denuncia oficial?", options: ["Redes Sociales", "Plataforma de Denuncias Confidencial", "Comentario de pasillo"], ans: 1 },
];

// --- LISTA DE CONCEJALES ---
const CONCEJALES = [
  "Cristian Marín Pastén", "Rayen Pojomovsky Aliste", "Alejandro Astudillo Olguín",
  "Gladys Marín Ossandón", "Francisca Barahona Araya", "María Teresita Prouvay",
  "Camilo Araya Plaza", "María Marcela Damke", "Matías Espinosa Morales", "Luisa Jinete Cárcamo"
];

// --- COMPONENTES AUXILIARES ---
const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900/95 backdrop-blur-md text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl print:hidden">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div>
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px]">Señal Oficial</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Inducción Municipal 2026</div>
    <div className="flex items-center gap-4 text-slate-400"><Music size={18} /></div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ nombres: '', rut: '', telefono: '', cargo: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  
  // Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<null | boolean>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = 10; 

  // --- LÓGICA DE SCROLL MEJORADA (ANTI-BLOQUEO) ---
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      // Calculamos cuánto falta para llegar al fondo
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      // Si falta menos de 100px (muy generoso) o si el contenido es corto, activamos.
      if (remaining < 150) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Pasos exentos de scroll: Login(0), Video(1), Quiz(9), Certificado(10)
    if ([0, 1, 9, 10].includes(step)) {
      setCanAdvance(true);
    } else {
      setCanAdvance(false);
      // Intentamos desbloquear automáticamente si el texto es corto
      setTimeout(checkProgress, 500);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);
  // --------------------------------------------------

  const handleQuizAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === QUESTIONS[quizIndex].ans;
    setShowFeedback(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setShowFeedback(null);
      if (quizIndex < QUESTIONS.length - 1) setQuizIndex(i => i + 1);
      else {
        setQuizFinished(true);
        if (score >= 7) setStep(10);
      }
    }, 1500);
  };

  const restartQuiz = () => { setQuizIndex(0); setScore(0); setQuizFinished(false); setShowFeedback(null); };
  const printCertificate = () => window.print();

  // --- PLANTILLA MAESTRA ---
  const ChapterLayout = ({ title, subtitle, content, visual }: any) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden pb-16 print:hidden">
      
      <div className="fixed top-0 w-full h-2 bg-slate-200 z-50">
        <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col h-full pt-12 relative z-10 bg-white shadow-2xl">
        <div className="px-8 lg:px-12 pt-8 pb-4 shrink-0 bg-white z-20">
          <div className="flex justify-between items-center mb-2">
            <p className="text-red-600 font-black text-xs tracking-widest uppercase">Módulo {step}/{totalSteps}</p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
               <div className="w-8 h-8 rounded-full border-4 border-slate-200 flex items-center justify-center text-[10px] text-slate-600 relative">
                 <span className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" style={{animationDuration: '3s'}}></span>
                 {Math.round((step / totalSteps) * 100)}%
               </div>
               PROGRESO
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">{title}</h2>
          <h3 className="text-lg text-slate-500 font-medium italic mt-2 border-l-4 border-red-600 pl-4">{subtitle}</h3>
        </div>
        
        {/* ÁREA DE LECTURA */}
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-12 py-6 space-y-6 text-lg text-slate-600 leading-relaxed text-justify">
          {content}
          {/* El aviso solo aparece si AÚN no puedes avanzar */}
          {!canAdvance && (
            <div className="h-32 flex items-center justify-center opacity-40 animate-pulse text-red-500 font-bold">
              <ChevronDown className="animate-bounce mr-2"/> Sigue bajando para continuar
            </div>
          )}
          {/* Espaciador invisible para garantizar scroll */}
          <div className="h-10"></div>
        </div>

        <div className="px-8 lg:px-12 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? 
               <span className="text-green-600 flex items-center gap-2 animate-pulse bg-green-50 px-3 py-1 rounded-full"><CheckCircle size={16}/> Lectura Completa</span> : 
               <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={16}/> Debes leer todo el texto</span>
             }
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2 group">
             Siguiente <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
           </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-100 flex items-center justify-center relative overflow-hidden border-l border-slate-200">
        {visual}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- PASO 0: PORTADA Y REGISTRO ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden relative print:hidden">
      <div className="absolute inset-0">
        <img src="/img/portada.jpg" onError={(e) => e.currentTarget.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070'} className="w-full h-full object-cover opacity-40" alt="La Serena" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-8 overflow-y-auto">
        <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 mb-6 drop-shadow-lg" alt="Escudo" />
        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">INDUCCIÓN 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-[0.5em] text-sm md:text-lg mb-8">Ilustre Municipalidad de La Serena</p>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-lg w-full space-y-4 shadow-2xl">
          <div className="flex gap-4">
             <div className="relative w-1/2">
                <User className="absolute top-4 left-4 text-slate-400" size={18}/>
                <input className="w-full pl-12 p-4 rounded-xl bg-white/90 font-bold text-slate-900" placeholder="Nombre Completo" onChange={e => setUserData({...userData, nombres: e.target.value})} />
             </div>
             <div className="relative w-1/2">
                <FileText className="absolute top-4 left-4 text-slate-400" size={18}/>
                <input className="w-full pl-12 p-4 rounded-xl bg-white/90 font-bold text-slate-900" placeholder="RUT" onChange={e => setUserData({...userData, rut: e.target.value})} />
             </div>
          </div>
          <div className="flex gap-4">
             <div className="relative w-1/2">
                <Phone className="absolute top-4 left-4 text-slate-400" size={18}/>
                <input className="w-full pl-12 p-4 rounded-xl bg-white/90 font-bold text-slate-900" placeholder="Teléfono" onChange={e => setUserData({...userData, telefono: e.target.value})} />
             </div>
             <div className="relative w-1/2">
                <Briefcase className="absolute top-4 left-4 text-slate-400" size={18}/>
                <input className="w-full pl-12 p-4 rounded-xl bg-white/90 font-bold text-slate-900" placeholder="Cargo" onChange={e => setUserData({...userData, cargo: e.target.value})} />
             </div>
          </div>

          <div className="relative">
            <MapPin className="absolute top-4 left-4 text-slate-400" size={18}/>
            <select className="w-full pl-12 p-4 rounded-xl bg-white/90 font-bold text-slate-900 appearance-none" onChange={e => setUserData({...userData, dept: e.target.value})}>
              <option value="">Selecciona tu Dirección / Depto...</option>
              <optgroup label="Direcciones Estratégicas">
                <option value="Alcaldía">Alcaldía / Gabinete</option>
                <option value="Administración Municipal">Administración Municipal</option>
                <option value="Secretaría Municipal">Secretaría Municipal</option>
                <option value="Asesoría Jurídica">Asesoría Jurídica</option>
                <option value="Control Interno">Dirección de Control Interno</option>
                <option value="SECPLAN">SECPLAN (Planificación)</option>
                <option value="Comunicaciones">Comunicaciones Estratégicas</option>
              </optgroup>
              <optgroup label="Direcciones Operativas">
                <option value="DIDECO">DIDECO (Desarrollo Comunitario)</option>
                <option value="DOM">DOM (Obras Municipales)</option>
                <option value="Tránsito">Dirección de Tránsito</option>
                <option value="Servicios a la Comunidad">Servicios a la Comunidad (Aseo y Ornato)</option>
                <option value="Seguridad Ciudadana">Seguridad Ciudadana</option>
                <option value="Turismo y Patrimonio">Turismo y Patrimonio</option>
                <option value="Gestión de Personas">Gestión de Personas (RRHH)</option>
                <option value="DAF">DAF (Admin. y Finanzas)</option>
                <option value="Protección Civil">Protección Civil y Emergencias</option>
              </optgroup>
              <optgroup label="Delegaciones y Otros">
                <option value="Del. Avenida del Mar">Delegación Avenida del Mar</option>
                <option value="Del. La Antena">Delegación La Antena</option>
                <option value="Del. Las Compañías">Delegación Las Compañías</option>
                <option value="Del. Rural">Delegación Rural</option>
                <option value="Juzgado Policía Local">Juzgado de Policía Local (1° o 2°)</option>
                <option value="Cultura">Departamento de Cultura</option>
              </optgroup>
              <optgroup label="Corporaciones">
                <option value="Salud Municipal">Salud Municipal</option>
                <option value="Educación">Educación</option>
              </optgroup>
            </select>
          </div>
          
          <button disabled={!userData.nombres || !userData.rut || !userData.dept} onClick={() => setStep(1)} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-between px-6 items-center group">
            COMENZAR INDUCCIÓN <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1: return <ChapterLayout title="Bienvenida Oficial" subtitle="Mensaje de la Alcaldesa" 
      visual={
        <div className="w-full h-full flex items-center justify-center bg-black">
           <div className="relative h-[90%] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
             <iframe className="w-full h-full" src={`https://www.youtube.com/embed/EQUdyb-YVxM?autoplay=1&mute=0&controls=0&loop=1&playlist=EQUdyb-YVxM`} title="Video Alcaldesa" allow="autoplay; encrypted-media" frameBorder="0" allowFullScreen></iframe>
           </div>
        </div>
      }
      content={
        <>
           <p><strong>Estimado(a) {userData.nombres}:</strong></p>
           <p>Es un honor recibirte en la Ilustre Municipalidad de La Serena. Asumes hoy un compromiso vital con la segunda ciudad más antigua de Chile, una comuna rica en historia, patrimonio y proyección de futuro.</p>
           <p>Esta inducción ha sido diseñada para entregarte las herramientas fundamentales que guiarán tu labor. Nuestra administración se caracteriza por la cercanía, la transparencia y la innovación. Buscamos funcionarios proactivos, que entiendan que detrás de cada trámite hay un vecino esperando una solución.</p>
           <p>Te invitamos a ver el mensaje de nuestra Alcaldesa Daniela Norambuena, quien te contará de primera fuente los desafíos que enfrentamos juntos en este periodo 2024-2028. ¡Bienvenido al equipo!</p>
        </>
      } 
    />;
    
    case 2: return <ChapterLayout title="Concejo Municipal" subtitle="Periodo 2024 - 2028" 
      visual={
        <div className="h-full w-full bg-slate-50 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CONCEJALES.map((name, i) => (
               <div key={i} className="bg-white p-2 rounded-xl shadow-md flex flex-col items-center text-center transform hover:scale-105 transition-all">
                 <div className="w-20 h-20 bg-slate-200 rounded-full mb-2 overflow-hidden border-2 border-red-100">
                   <img src={`/img/concejal_${i+1}.jpg`} onError={(e) => e.currentTarget.style.display='none'} className="w-full h-full object-cover" alt="Foto"/>
                   <User className="w-full h-full p-4 text-slate-400" />
                 </div>
                 <p className="text-xs font-bold text-slate-800 leading-tight">{name}</p>
                 <span className="text-[10px] text-red-500 font-bold mt-1">Concejal {i+1}</span>
               </div>
            ))}
          </div>
        </div>
      }
      content={
        <>
          <p>El <strong>Concejo Municipal</strong> es el órgano colegiado encargado de hacer efectiva la participación de la comunidad local. Su función no es solo normativa, dictando ordenanzas clave para la comuna, sino también fiscalizadora.</p>
          <p>Está compuesto por la Alcaldesa y <strong>10 concejales</strong>, elegidos democráticamente. Ellos representan las distintas sensibilidades políticas y sociales de La Serena.</p>
          <p>Es fundamental que conozcas a nuestras autoridades. Las sesiones de Concejo son públicas y se transmiten para garantizar la transparencia de cara a la ciudadanía.</p>
          <p>La precedencia (orden) de los concejales está determinada por su votación histórica, siendo el primero de la lista quien subroga protocolarmente a la Alcaldesa.</p>
        </>
      } 
    />;

    case 3: return <ChapterLayout title="Nuestra Estructura" subtitle="Visión General" 
      visual={<div className="flex items-center justify-center h-full bg-slate-50 p-8"><img src="/img/organigrama_simple.png" onError={(e) => e.currentTarget.src='https://placehold.co/600x400/png?text=Organigrama+Simple'} className="max-w-full shadow-2xl rounded-xl" /></div>}
      content={
        <>
          <p>El municipio se organiza bajo una estructura jerárquica clara para servir eficientemente a la comunidad.</p>
          <p><strong>Nivel Directivo:</strong> Encabezado por la Alcaldía, Secretaría Municipal y Administración Municipal. Aquí se define la estrategia.</p>
          <p><strong>Nivel Operativo:</strong> Direcciones como DIDECO, DOM y Tránsito, que ejecutan los programas en terreno.</p>
          <p><strong>Nivel de Apoyo:</strong> Unidades como Jurídica, Control y Gestión de Personas, que dan soporte transversal.</p>
        </>
      } 
    />;

    case 4: return <ChapterLayout title="Organigrama Detallado" subtitle="Mapa Completo de Áreas" 
      visual={<div className="flex items-center justify-center h-full bg-slate-50 overflow-auto p-4"><img src="/img/organigrama_full.png" onError={(e) => e.currentTarget.src='https://placehold.co/1000x1000/png?text=Carga+tu+img/organigrama_full.png'} className="min-w-[800px] shadow-2xl" /></div>}
      content={
        <>
          <p>Este es el mapa completo de nuestra institución. Cada dirección se subdivide en departamentos especializados.</p>
          <p>Es importante que identifiques tu ubicación exacta: ¿De qué Dirección dependes? ¿Quién es tu jefatura directa? La comunicación formal debe respetar siempre los conductos regulares.</p>
          <p>Observa también las unidades de Control y Jurídica: ellas velan por la legalidad de nuestros actos. Cualquier proceso importante pasará por su revisión.</p>
        </>
      } 
    />;

    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Nuestro Ecosistema" 
      visual={
        <div className="relative w-full h-full flex items-center justify-center bg-slate-50">
           <div className="grid grid-cols-2 gap-8 p-12">
             <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500"><h4 className="font-bold text-blue-600">CIUDADANÍA</h4><p className="text-sm">Juntas de Vecinos, Adulto Mayor, Usuarios.</p></div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500"><h4 className="font-bold text-red-600">GOBIERNO</h4><p className="text-sm">SUBDERE, GORE, Contraloría.</p></div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500"><h4 className="font-bold text-green-600">PRIVADOS</h4><p className="text-sm">Proveedores, Gremios, Empresas.</p></div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500"><h4 className="font-bold text-purple-600">INTERNO</h4><p className="text-sm">Funcionarios, Concejo, Sindicatos.</p></div>
           </div>
        </div>
      }
      content={
        <>
          <p>La gestión municipal es un ecosistema vivo. Interactuamos constantemente con múltiples actores:</p>
          <p><strong>1. El Ciudadano:</strong> Nuestro foco principal. Todo lo que hacemos debe mejorar su calidad de vida.</p>
          <p><strong>2. Gobierno Central:</strong> Fuente de financiamiento y normativa.</p>
          <p><strong>3. Gremios y Sociedad Civil:</strong> Actores claves para la gobernanza local.</p>
        </>
      } 
    />;

    case 6: return <ChapterLayout title="Ley Karin" subtitle="Espacios Libres de Violencia" visual={<div className="flex items-center justify-center h-full bg-pink-50"><Heart size={200} className="text-pink-500 animate-pulse" /></div>} 
      content={
        <>
          <p>La <strong>Ley N° 21.643 (Ley Karin)</strong> marca un antes y un después. Previene, investiga y sanciona el acoso laboral, sexual y la violencia en el trabajo.</p>
          <p><strong>¿Qué cambia?</strong> Ya no se exige "reiteración" para denunciar. Un solo acto grave basta. También sanciona la violencia de terceros (usuarios) hacia funcionarios.</p>
          <p>El Municipio tiene tolerancia cero y cuenta con protocolos de denuncia confidencial. El buen trato es ahora una obligación legal.</p>
        </>
      } 
    />;

    case 7: return <ChapterLayout title="Remuneraciones" subtitle="Tu Vínculo Contractual" visual={<div className="flex items-center justify-center h-full bg-green-50"><DollarSign size={200} className="text-green-600" /></div>} 
      content={
        <>
          <p>En el municipio conviven tres estamentos principales, cada uno con sus reglas:</p>
          <p><strong>1. Planta (Titulares):</strong> Cargos permanentes por ley. Tienen carrera funcionaria.</p>
          <p><strong>2. Contrata:</strong> Cargos transitorios anuales (renovables).</p>
          <p><strong>3. Honorarios:</strong> Prestadores de servicios específicos. Se rigen por su contrato y el Código Civil/Trabajo según corresponda.</p>
          <p><strong>Pago:</strong> Planta y Contrata reciben su sueldo el <strong>penúltimo día hábil del mes</strong>. Revisa siempre tu liquidación para ver asignaciones y bonos.</p>
        </>
      } 
    />;

    case 8: return <ChapterLayout title="Seguridad y Normas" subtitle="Derechos y Deberes" visual={<div className="flex items-center justify-center h-full bg-yellow-50"><Shield size={200} className="text-yellow-600" /></div>} 
      content={
        <>
          <p><strong>Reglamento Interno:</strong> Es nuestra "Constitución". Regula el control horario, uso de credencial, permisos (6 días administrativos al año) y obligaciones funcionarias.</p>
          <p><strong>Seguridad:</strong> Conoce las vías de evacuación (Cota 30 ante tsunamis). Ante cualquier accidente laboral o de trayecto, informa INMEDIATAMENTE para activar el seguro ACHS.</p>
          <p>Un funcionario informado es un funcionario seguro. ¡Estás listo para la evaluación!</p>
        </>
      } 
    />;
    
    case 9: return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 print:hidden">
        <div className="max-w-2xl w-full">
          {!quizFinished ? (
            <>
              <div className="flex justify-between items-end mb-6">
                 <h2 className="text-3xl font-black">Evaluación Final</h2>
                 <span className="text-red-500 font-bold">{quizIndex + 1}/{QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden"><div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${((quizIndex) / QUESTIONS.length) * 100}%` }}></div></div>
              <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                 {showFeedback === true && <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center text-white text-4xl font-black z-20"><CheckCircle size={60} className="mr-4"/> ¡CORRECTO!</div>}
                 {showFeedback === false && <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center text-white text-4xl font-black z-20"><XCircle size={60} className="mr-4"/> INCORRECTO</div>}
                 <h3 className="text-2xl font-bold mb-8">{QUESTIONS[quizIndex].q}</h3>
                 <div className="space-y-4">
                   {QUESTIONS[quizIndex].options.map((opt, idx) => (
                     <button key={idx} onClick={() => handleQuizAnswer(idx)} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-red-600 hover:bg-red-50 transition-all font-medium text-lg flex items-center justify-between group">
                       {opt} <ChevronRight className="text-slate-300 group-hover:text-red-600"/>
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
                <button onClick={() => setStep(10)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-xl text-xl flex items-center justify-center gap-2">
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

    case 10: return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-12 max-w-5xl w-full aspect-[1.4/1] relative shadow-2xl flex flex-col items-center justify-between text-center border-[20px] border-double border-slate-200 print:w-full print:h-screen print:border-none print:shadow-none print:absolute print:top-0 print:left-0 print:m-0">
          
          <div className="w-full flex justify-between items-start mb-8">
             <img src="/img/escudo.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 object-contain" alt="Escudo IMLS"/>
             <img src="/img/innovacion.png" onError={(e) => e.currentTarget.style.display='none'} className="h-24 object-contain" alt="Sello Innovación"/>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
             <h1 className="text-6xl font-serif font-black text-slate-900 mb-2 uppercase tracking-wide">CERTIFICADO</h1>
             <p className="text-xl text-slate-500 italic mb-8">De Aprobación de Inducción Corporativa</p>
             
             <p className="text-lg text-slate-600 mb-2">Se otorga a:</p>
             <div className="border-b-2 border-slate-900 pb-2 mb-2 w-full max-w-2xl">
               <h2 className="text-4xl font-bold text-slate-900 uppercase">{userData.nombres}</h2>
             </div>
             <p className="text-sm text-slate-400 font-bold mb-8">RUT: {userData.rut} | Cargo: {userData.cargo} | Depto: {userData.dept}</p>
             
             <p className="text-lg text-slate-600 mb-2">Por haber completado con distinción el programa de</p>
             <h3 className="text-3xl font-bold text-red-600 uppercase tracking-widest mb-4">Inducción Municipal 2026</h3>
             <p className="max-w-xl text-slate-500 text-sm">Validando conocimientos en probidad, estructura municipal, Ley Karin, remuneraciones y seguridad laboral.</p>
          </div>
          
          <div className="flex justify-between w-full px-10 mt-12 items-end">
            <div className="text-center">
              <div className="w-40 h-16 mb-2 mx-auto flex items-end justify-center"><img src="/img/firma_personas.png" className="max-h-full opacity-50" onError={(e)=>e.currentTarget.style.display='none'}/></div>
              <div className="w-48 h-0.5 bg-slate-400 mb-2 mx-auto"></div>
              <p className="text-xs font-bold uppercase text-slate-600">Director(a) Gestión de Personas</p>
            </div>
            
            <div className="text-center mb-4">
              <div className="border-2 border-slate-300 p-4 rounded-lg">
                 <p className="font-bold text-slate-900 text-xl">{new Date().toLocaleDateString()}</p>
                 <p className="text-[10px] font-bold uppercase text-slate-400">Fecha de Emisión</p>
              </div>
            </div>

            <div className="text-center">
               <div className="w-40 h-16 mb-2 mx-auto flex items-end justify-center"><img src="/img/firma_alcaldesa.png" className="max-h-full opacity-50" onError={(e)=>e.currentTarget.style.display='none'}/></div>
               <div className="w-48 h-0.5 bg-slate-400 mb-2 mx-auto"></div>
               <p className="text-xs font-bold uppercase text-slate-600">Alcaldesa de La Serena</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
           <button onClick={() => setStep(0)} className="bg-slate-600 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all" title="Reiniciar">
             <RefreshCw />
           </button>
           <button onClick={printCertificate} className="bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 animate-bounce">
             <Printer /> Descargar Diploma Oficial
           </button>
        </div>
      </div>
    );
    default: return null;
  }
}
