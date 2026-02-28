import { useState, useEffect, useRef, ReactNode } from 'react';
import { 
  CheckCircle, ChevronRight, Radio, Music, Award, 
  ChevronDown, Star, Shield 
} from 'lucide-react';
import SmartAssistant from './components/SmartAssistant';

// --- BARRA DE RADIO INFERIOR ---
const RadioPlayer = () => (
  <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur text-white p-3 flex items-center justify-between z-50 border-t border-slate-700 h-16 shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-red-600 p-2 rounded-full animate-pulse"><Radio size={16} /></div>
      <div className="flex flex-col">
        <p className="font-bold leading-none text-sm">Radio Digital La Serena</p>
        <p className="text-slate-400 text-[10px] tracking-wide">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="hidden md:block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Smart City IMLS 2026</div>
    <div className="flex items-center gap-4 text-slate-400"><Music size={18} /></div>
  </div>
);

interface ChapterLayoutProps {
  title: string;
  subtitle: string;
  content: ReactNode;
  image?: string;
  youtubeId?: string;
}

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', rut: '', email: '', telefono: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '' });
  const [quizError, setQuizError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Total de pasos: 0 (Registro) + 10 Contenido + 1 Quiz + 1 Certificado = 13
  const totalSteps = 13; 

  // Lógica ANTI-BLOQUEO (Detecta lectura)
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isShort = el.scrollHeight <= el.clientHeight + 50;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isShort || isAtBottom) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Actualizar barra de progreso (0% a 100%)
    // Calculado sobre 13 pasos (0 a 12)
    setProgress((step / (totalSteps - 1)) * 100);

    // Pasos automáticos (Inicio, Videos, Quiz, Final)
    // El Quiz (paso 11) tiene su propia lógica de validación
    if (step === 0 || step === 1 || step === 11 || step === totalSteps - 1) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 800);
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step, totalSteps]);

  const handleQuizSubmit = () => {
    // Respuestas correctas: 1b, 2a, 3c, 4b, 5b
    if (
      quizAnswers.q1 === 'b' && 
      quizAnswers.q2 === 'a' && 
      quizAnswers.q3 === 'c' &&
      quizAnswers.q4 === 'b' &&
      quizAnswers.q5 === 'b'
    ) {
      setStep(12); // Ir al certificado
    } else {
      setQuizError(true);
      setTimeout(() => setQuizError(false), 3000);
    }
  };

  // --- PLANTILLA DE CAPÍTULOS ---
  const ChapterLayout = ({ title, subtitle, content, image, youtubeId }: ChapterLayoutProps) => (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 overflow-hidden pb-16">
      <div className="fixed top-0 w-full h-1.5 bg-slate-800 z-50">
        <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col h-full pt-12 relative z-10 bg-white">
        <div className="px-8 lg:px-16 pt-8 pb-4 shrink-0">
          <p className="text-red-600 font-black text-[10px] tracking-widest uppercase mb-2">Capítulo {step} de {totalSteps - 1}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none tracking-tight">{title}</h2>
          <h3 className="text-xl text-slate-400 font-medium italic mt-2">{subtitle}</h3>
        </div>
        
        <div ref={scrollRef} onScroll={checkProgress} className="flex-1 overflow-y-auto px-8 lg:px-16 py-6 space-y-6 text-lg text-slate-600 leading-relaxed">
          {content}
          <div className="h-32"></div>
        </div>

        <div className="px-8 lg:px-16 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 h-24">
           <div className="text-xs font-bold uppercase tracking-widest">
             {canAdvance ? <span className="text-green-600 flex items-center gap-2 animate-pulse"><CheckCircle size={16}/> Leído</span> : <span className="text-red-500 flex items-center gap-2 animate-bounce"><ChevronDown size={16}/> Baja para leer</span>}
           </div>
           <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2">Siguiente <ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {youtubeId ? (
          <iframe className="w-full h-full object-cover" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${youtubeId}`} title="Video" frameBorder="0" allowFullScreen></iframe>
        ) : (
          <>
            <img src={image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070"} alt="Visual" className="w-full h-full object-cover opacity-60" onLoad={checkProgress} />
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Star size={12} className="text-yellow-400" /> Smart City View</div>
          </>
        )}
      </div>
      <RadioPlayer />
      <SmartAssistant />
    </div>
  );

  // --- PASO 0: BIENVENIDA MARAVILLOSA (REGISTRO COMPLETO) ---
  if (step === 0) return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden relative">
       {/* Imagen de fondo maravillosa */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')] bg-cover opacity-30"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-8 overflow-y-auto">
        <Shield size={60} className="text-red-600 mb-4 drop-shadow-lg" />
        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">IMLS 2026</h1>
        <p className="text-red-500 font-bold uppercase tracking-[0.5em] text-sm mb-8">Portal de Inducción</p>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-lg w-full space-y-3 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="w-full p-3 border-none rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-500 font-bold text-sm" placeholder="Nombre Completo" value={userData.nombres} onChange={e => setUserData({...userData, nombres: e.target.value})} />
            <input className="w-full p-3 border-none rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-500 font-bold text-sm" placeholder="RUT (12.345.678-9)" value={userData.rut} onChange={e => setUserData({...userData, rut: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="w-full p-3 border-none rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-500 font-bold text-sm" placeholder="Email Institucional" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
            <input className="w-full p-3 border-none rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-500 font-bold text-sm" placeholder="Teléfono (+569...)" value={userData.telefono} onChange={e => setUserData({...userData, telefono: e.target.value})} />
          </div>
          
          <select className="w-full p-3 border-none rounded-xl bg-white/90 text-slate-900 font-bold text-sm" value={userData.dept} onChange={e => setUserData({...userData, dept: e.target.value})}>
            <option value="">Selecciona tu Departamento / Área...</option>
            <option value="Alcaldía">Alcaldía</option>
            <option value="Administración Municipal">Administración Municipal</option>
            <option value="Secretaría Municipal">Secretaría Municipal</option>
            <option value="SECPLAN">SECPLAN</option>
            <option value="DIDECO">DIDECO (Desarrollo Comunitario)</option>
            <option value="DOM">DOM (Obras Municipales)</option>
            <option value="Tránsito">Dirección de Tránsito</option>
            <option value="Aseo y Ornato">Aseo y Ornato</option>
            <option value="Servicio a la Comunidad">Servicio a la Comunidad</option>
            <option value="Seguridad Ciudadana">Seguridad Ciudadana</option>
            <option value="Administración y Finanzas">Administración y Finanzas</option>
            <option value="Jurídica">Dirección Jurídica</option>
            <option value="Control">Dirección de Control</option>
            <option value="Salud">Departamento de Salud</option>
            <option value="Educación">Departamento de Educación</option>
            <option value="Juzgado Policía Local">Juzgado Policía Local</option>
          </select>

          <button 
            disabled={!userData.nombres || !userData.dept || !userData.rut || !userData.email} 
            onClick={() => setStep(1)} 
            className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-between px-6 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            COMENZAR INDUCCIÓN <ChevronRight />
          </button>
        </div>
      </div>
      <RadioPlayer />
      <SmartAssistant />
    </div>
  );

  // --- FLUJO DE CONTENIDO (LO QUE PEDISTE) ---
  switch (step) {
    // 1. VIDEO ALCALDESA (Vertical Style)
    case 1: return <ChapterLayout title="Bienvenida Oficial" subtitle="Mensaje de nuestra Alcaldesa" youtubeId="shorts_video_id" content={ // Placeholder ID, replace if specific one found
      <div className="space-y-4">
        <p className="text-xl font-bold text-slate-800">¡Bienvenida/o al equipo!</p>
        <p>Te damos la más cordial bienvenida a la Ilustre Municipalidad de La Serena. Queremos que te sientas parte de esta gran familia que trabaja día a día por mejorar la calidad de vida de nuestros vecinos.</p>
        <p>A continuación, verás un mensaje especial preparado para ti.</p>
      </div>
    } />;
    
    // 2. CONCEJO Y ESTRATEGIA
    case 2: return <ChapterLayout title="Gobierno Comunal" subtitle="El Concejo Municipal" image="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=2000" content={
      <>
        <p>El Concejo Municipal es el órgano normativo, resolutivo y fiscalizador. Junto a la Alcaldesa, definen el rumbo estratégico de la comuna.</p>
        <p><strong>Nuestros Ejes Estratégicos:</strong></p>
        <ul className="list-disc ml-5 space-y-2 font-bold text-slate-700">
          <li>La Serena Smart City</li>
          <li>Seguridad Integral</li>
          <li>Desarrollo Sostenible</li>
        </ul>
      </>
    } />;

    // 3. ESTRUCTURA Y ORGANIGRAMA (NUEVO)
    case 3: return <ChapterLayout title="Estructura Municipal" subtitle="Nuestra Organización" image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" content={
      <>
        <p>Para cumplir con nuestra misión, el municipio se organiza en direcciones y departamentos clave que reportan a la Alcaldía y Administración Municipal.</p>
        <p><strong>Áreas Estratégicas:</strong></p>
        <ul className="list-disc ml-5 space-y-2 font-bold text-slate-700">
          <li>Dirección de Desarrollo Comunitario (DIDECO)</li>
          <li>Secretaría Comunal de Planificación (SECPLAN)</li>
          <li>Dirección de Obras Municipales (DOM)</li>
          <li>Dirección de Tránsito</li>
        </ul>
        <p>Cada unidad es un engranaje vital para el funcionamiento de nuestra Smart City.</p>
      </>
    } />;

    // 4. VINCULACIÓN CON LA COMUNIDAD (NUEVO)
    case 4: return <ChapterLayout title="Vinculación Vecinal" subtitle="Cerca de la Comunidad" image="https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2000" content={
      <>
        <p>Nuestro foco está en las personas. Existen áreas dedicadas exclusivamente a la atención y vinculación con los vecinos:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li><strong>Delegaciones Municipales:</strong> Acercamos el municipio a los barrios (Antena, Las Compañías, Rural, etc.).</li>
          <li><strong>Oficinas de la Mujer, Infancia y Adulto Mayor:</strong> Programas focalizados.</li>
          <li><strong>Seguridad Ciudadana:</strong> Patrullaje preventivo y coordinación vecinal.</li>
        </ul>
      </>
    } />;

    // 5. STAKEHOLDERS (NUEVO)
    case 5: return <ChapterLayout title="Mapa de Públicos" subtitle="Nuestros Stakeholders" image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000" content={
      <>
        <p>Como municipio interactuamos con diversos actores clave (Stakeholders) que influyen en nuestra gestión:</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="block text-red-600 mb-1">Comunidad</strong>
            <span className="text-sm">Juntas de Vecinos, Organizaciones Sociales.</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="block text-red-600 mb-1">Instituciones</strong>
            <span className="text-sm">Gobierno Regional, Ministerios, Carabineros.</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="block text-red-600 mb-1">Privados</strong>
            <span className="text-sm">Empresas, Proveedores, Cámaras de Comercio.</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="block text-red-600 mb-1">Academia</strong>
            <span className="text-sm">Universidades, Centros de Formación Técnica.</span>
          </div>
        </div>
      </>
    } />;

    // 6. LEY KARIN (Acoso)
    case 6: return <ChapterLayout title="Ley Karin" subtitle="Ambientes Libres de Violencia" image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000" content={
      <>
        <p>La <strong>Ley Karin (N° 21.643)</strong> modifica el Código del Trabajo para prevenir, investigar y sancionar el acoso laboral, sexual y la violencia en el trabajo.</p>
        <p><strong>Protocolo IMLS:</strong></p>
        <p>Tenemos tolerancia cero. Cualquier conducta de maltrato debe ser denunciada a través de los canales oficiales de Recursos Humanos. Cuidamos la dignidad de cada funcionario.</p>
      </>
    } />;

    // 7. REMUNERACIONES
    case 7: return <ChapterLayout title="Remuneraciones" subtitle="Tu Trabajo, Tu Pago" image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000" content={
      <>
        <p>El pago de remuneraciones se realiza mensualmente. Es vital que conozcas los componentes de tu liquidación:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Sueldo Base</li>
          <li>Asignaciones (Zona, Profesional, etc.)</li>
          <li>Bonos Trimestrales (según cumplimiento PMG)</li>
        </ul>
        <p>Las fechas de pago son sagradas para nosotros, asegurando tu tranquilidad financiera.</p>
      </>
    } />;

    // 8. REGLAMENTO INTERNO
    case 8: return <ChapterLayout title="Reglamento Interno" subtitle="Derechos y Deberes" image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000" content={
      <>
        <p>Nuestro Reglamento Interno de Orden, Higiene y Seguridad regula la convivencia diaria.</p>
        <p><strong>Deberes Clave:</strong></p>
        <p>Cumplimiento de horario (reloj control), uso de credencial, y probidad administrativa.</p>
        <p><strong>Tus Derechos:</strong></p>
        <p>Días administrativos, feriados legales, y permisos parentales.</p>
      </>
    } />;

    // 9. SEGURIDAD Y MEDIO AMBIENTE
    case 9: return <ChapterLayout title="Seguridad Laboral" subtitle="Prevención de Riesgos" image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000" content={
      <>
        <p>Tu seguridad es intransable. Contamos con un Departamento de Prevención de Riesgos que te entregará tus EPP (Elementos de Protección Personal) si tu cargo lo requiere.</p>
        <p><strong>Protocolo de Accidentes:</strong></p>
        <p>En caso de accidente de trayecto o laboral, debes informar inmediatamente a tu jefatura directa para activar el seguro de la mutualidad (ACHS/Mutual).</p>
      </>
    } />;

    // 10. SOBRE NOSOTROS
    case 10: return <ChapterLayout title="Sobre Nosotros" subtitle="Ilustre Municipalidad de La Serena" image="https://images.unsplash.com/photo-1596280696328-98444f97d85f?q=80&w=2000" content={
      <>
        <p>La Ilustre Municipalidad de La Serena es el órgano encargado de la administración local de la comuna, comprometida con el desarrollo social, económico y cultural de sus habitantes.</p>
        <p><strong>Nuestra Misión:</strong></p>
        <p>Mejorar la calidad de vida de la comunidad mediante una gestión participativa, inclusiva y transparente, promoviendo el desarrollo sustentable y la identidad patrimonial.</p>
        <p><strong>Contacto:</strong></p>
        <ul className="list-none space-y-2">
          <li>📍 Arturo Prat 451, La Serena</li>
          <li>📞 +56 51 2 206600</li>
          <li>✉️ contacto@laserena.cl</li>
        </ul>
      </>
    } />;

    // 11. CUESTIONARIO
    case 11: return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 overflow-hidden relative p-6">
        <div className="max-w-2xl w-full bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 z-10">
          <h2 className="text-3xl font-black mb-6 text-center text-slate-900">Validación de Conocimientos</h2>
          <p className="text-slate-500 mb-8 text-center">Responde correctamente para obtener tu certificado.</p>
          
          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2">1. ¿Qué ley sanciona el acoso laboral y sexual?</p>
              <div className="flex gap-4">
                <button onClick={() => setQuizAnswers({...quizAnswers, q1: 'a'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q1 === 'a' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Ley de Tránsito</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, q1: 'b'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q1 === 'b' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Ley Karin</button>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">2. ¿Cuándo se pagan las remuneraciones?</p>
              <div className="flex gap-4">
                <button onClick={() => setQuizAnswers({...quizAnswers, q2: 'a'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q2 === 'a' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Mensualmente</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, q2: 'b'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q2 === 'b' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Semanalmente</button>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">3. ¿A quién debo informar un accidente laboral?</p>
              <div className="flex gap-4">
                <button onClick={() => setQuizAnswers({...quizAnswers, q3: 'a'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q3 === 'a' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>A nadie</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, q3: 'c'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q3 === 'c' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Jefatura Directa</button>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">4. ¿Qué unidad se encarga del desarrollo comunitario?</p>
              <div className="flex gap-4">
                <button onClick={() => setQuizAnswers({...quizAnswers, q4: 'a'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q4 === 'a' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>SECPLAN</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, q4: 'b'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q4 === 'b' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>DIDECO</button>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">5. ¿Cuál es el foco principal de la gestión municipal?</p>
              <div className="flex gap-4">
                <button onClick={() => setQuizAnswers({...quizAnswers, q5: 'a'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q5 === 'a' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Cobrar Multas</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, q5: 'b'})} className={`flex-1 p-3 rounded-xl border ${quizAnswers.q5 === 'b' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Calidad de Vida</button>
              </div>
            </div>
          </div>

          {quizError && (
            <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-xl text-center font-bold animate-pulse">
              Hay respuestas incorrectas. Inténtalo de nuevo.
            </div>
          )}

          <button onClick={handleQuizSubmit} className="w-full mt-8 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex justify-center gap-2">
            VALIDAR Y FINALIZAR <CheckCircle />
          </button>
        </div>
        <RadioPlayer />
        <SmartAssistant />
      </div>
    );

    // 12. CERTIFICADO FINAL
    case 12: return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2000')] bg-cover opacity-10"></div>
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] text-center max-w-2xl w-full relative z-10 shadow-2xl animate-bounce-slow">
          <Award size={100} className="mx-auto text-red-600 mb-6" />
          <h2 className="text-4xl font-black mb-4 uppercase">¡Inducción Aprobada!</h2>
          <p className="text-xl text-slate-500 mb-8">Has completado exitosamente la capacitación.</p>
          
          <div className="p-8 bg-slate-50 border-4 border-double border-slate-200 rounded-2xl mb-8">
            <p className="font-serif text-3xl text-slate-900 font-bold mb-2">{userData.nombres}</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Funcionario Habilitado - IMLS 2026</p>
            <p className="text-xs text-slate-400 mt-2">{userData.dept} - {userData.rut}</p>
            <div className="mt-4 w-32 h-1 bg-red-600 mx-auto"></div>
          </div>

          <button onClick={() => { setStep(0); setQuizAnswers({q1:'',q2:'',q3:'',q4:'',q5:''}); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-xl">
            Reiniciar Sistema
          </button>
        </div>
        <RadioPlayer />
        <SmartAssistant />
      </div>
    );
    default: return null;
  }
}
