import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle, ChevronRight, Radio, Music, Award, ChevronDown 
} from 'lucide-react';

// Componente del reproductor inferior (estático)
const RadioPlayer = () => (
  <div className="radio-player">
    <div className="radio-info">
      <div className="pulse-icon"><Radio size={16} /></div>
      <div>
        <p className="radio-title">Radio Digital La Serena</p>
        <p className="radio-subtitle">Transmisión Oficial RDMLS</p>
      </div>
    </div>
    <div className="smart-city-tag">Smart City IMLS 2026</div>
    <Music size={20} />
  </div>
);

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ nombres: '', dept: '' });
  const [canAdvance, setCanAdvance] = useState(false);
  const scrollRef = useRef(null);

  const totalSteps = 15;
  const progress = (step / totalSteps) * 100;

  // Función para validar que el usuario leyó o llegó al final
  const checkProgress = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (isAtBottom || el.scrollHeight <= el.clientHeight) setCanAdvance(true);
    }
  };

  useEffect(() => {
    // Liberar botón automáticamente en pasos de video o registro
    if (step === 0 || step === 1 || step >= 14) setCanAdvance(true);
    else {
      setCanAdvance(false);
      setTimeout(checkProgress, 800);
    }
  }, [step]);

  // --- PLANTILLA DE CAPÍTULOS ---
  const ChapterLayout = ({ title, subtitle, content, image, youtubeId = null }) => (
    <div className="full-layout">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="left-panel">
        <div className="step-header">
          <p className="step-count">CAPÍTULO {step} DE {totalSteps}</p>
          <h2 className="main-title">{title}</h2>
          <h3 className="sub-title">{subtitle}</h3>
        </div>
        <div ref={scrollRef} onScroll={checkProgress} className="scroll-content">
          {content}
          <div style={{ height: '100px' }}></div>
        </div>
        <div className="nav-footer">
          <div className="status-indicator">
            {canAdvance ? <span className="text-success"><CheckCircle size={16}/> Validado</span> : <span className="text-alert"><ChevronDown size={16}/> Baja para avanzar</span>}
          </div>
          <button disabled={!canAdvance} onClick={() => setStep(s => s + 1)} className="next-btn">
            Siguiente <ChevronRight size={16}/>
          </button>
        </div>
      </div>
      <div className="right-panel">
        {youtubeId ? (
          <iframe className="video-frame" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} frameBorder="0" allowFullScreen></iframe>
        ) : (
          <img src={image} className="bg-image" alt="IMLS" />
        )}
      </div>
      <RadioPlayer />
    </div>
  );

  // --- LÓGICA DE NAVEGACIÓN (SWITCH) ---
  switch (step) {
    case 0: return (
      <div className="full-layout">
        <div className="sidebar-brand">
          <div className="brand-content">
            <h1>IMLS 2026</h1>
            <p>PORTAL DE INDUCCIÓN</p>
          </div>
        </div>
        <div className="form-container">
          <div className="form-box">
            <h2>Ficha del Funcionario</h2>
            <p>Completa tus datos para iniciar el proceso.</p>
            <input placeholder="Nombres" onChange={e => setUserData({...userData, nombres: e.target.value})} className="custom-input" />
            <select onChange={e => setUserData({...userData, dept: e.target.value})} className="custom-input">
              <option value="">Selecciona tu Departamento...</option>
              <option value="Alcaldía">Alcaldía</option>
              <option value="DIDECO">DIDECO</option>
            </select>
            <button disabled={!userData.nombres || !userData.dept} onClick={() => setStep(1)} className="start-btn">
              Ingresar al Portal <ChevronRight />
            </button>
          </div>
        </div>
        <RadioPlayer />
      </div>
    );

    case 1: return <ChapterLayout title="Bienvenida" subtitle="Daniela Norambuena, Alcaldesa" youtubeId="yA_86g9Bq_U" content={<p>¡Hola! Soy Serenito y te doy la bienvenida a la Municipalidad más innovadora de Chile.</p>} />;
    case 2: return <ChapterLayout title="¿Qué es la IMLS?" subtitle="Misión y Visión" image="PINTURA_LA_SERENA.jpg" content={<p>Somos la segunda ciudad más antigua de Chile, con la mente en el futuro.</p>} />;
    case 3: return <ChapterLayout title="Valores y Estrategia" subtitle="La Lucha Municipalidad" image="ESTRATEGIA_IMLS.png" content={<p>Priorizamos la eficiencia y la cercanía con los vecinos de La Serena.</p>} />;
    
    // Aquí van tus casos del 4 al 14...

    case 15: return (
      <div className="final-screen">
        <div className="cert-box">
          <Award size={80} />
          <h2>¡Excelente Trabajo!</h2>
          <p>Felicidades, {userData.nombres}. Has completado la inducción.</p>
          <button onClick={() => setStep(0)} className="restart-btn">Reiniciar Sistema</button>
        </div>
        <RadioPlayer />
      </div>
    );
    default: return null;
  }
}

export default App;
