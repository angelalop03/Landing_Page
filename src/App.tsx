import { useState } from 'react'
import Scene from './scene/Scene'
import type { SectionId } from './scene/DeskSetup'
import { CREDITS } from './credits'
import './App.css'

const CONTENT: Record<
  Exclude<SectionId, null | 'phone' | 'projects' | 'music' | 'notes' | 'photo'>,
  { title: string; body: string }
> = {
  about: {
    title: 'Sobre mí',
    body: 'Has hecho click en el teclado. Aquí va tu bio y stack técnico.',
  },
  contact: {
    title: 'Contacto',
    body: 'Has hecho click en el ratón. Aquí van tus enlaces y formulario de contacto.',
  },
}

function App() {
  const [selected, setSelected] = useState<SectionId>(null)
  const [showCredits, setShowCredits] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="app">
      <Scene selected={selected} onSelect={setSelected} />

      <div className="brand">
        Ángela López <span>· Portfolio</span>
      </div>

      <div className="hint">Arrastra para girar la vista · haz click en un objeto del escritorio</div>

      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-card">
            <h2>¡Bienvenida a mi escritorio! 👋</h2>
            <p>
              Esto es un escritorio 3D interactivo. Arrastra con el ratón para girar la
              vista, y haz click en los objetos — el monitor, el teclado, el ratón, los
              cascos, el móvil, los cuadernos o el corcho — para descubrir más sobre mí.
            </p>
            <button className="intro-start" onClick={() => setShowIntro(false)}>
              Empezar a explorar
            </button>
          </div>
        </div>
      )}

      {selected &&
        selected !== 'phone' &&
        selected !== 'projects' &&
        selected !== 'music' &&
        selected !== 'notes' &&
        selected !== 'photo' && (
        <div className="panel">
          <button className="close" onClick={() => setSelected(null)} aria-label="Cerrar">
            ✕
          </button>
          <h2>{CONTENT[selected].title}</h2>
          <p>{CONTENT[selected].body}</p>
        </div>
      )}

      <button className="credits-toggle" onClick={() => setShowCredits((v) => !v)}>
        Créditos 3D
      </button>

      {showCredits && (
        <div className="credits-panel">
          <button className="close" onClick={() => setShowCredits(false)} aria-label="Cerrar">
            ✕
          </button>
          <h2>Créditos de modelos 3D</h2>
          <ul>
            {CREDITS.map((c) => (
              <li key={c.title}>
                <a href={c.sourceUrl} target="_blank" rel="noreferrer">
                  {c.title}
                </a>{' '}
                por{' '}
                <a href={c.authorUrl} target="_blank" rel="noreferrer">
                  {c.author}
                </a>{' '}
                ({c.license})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
