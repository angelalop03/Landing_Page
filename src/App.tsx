import { useState } from 'react'
import Scene from './scene/Scene'
import type { SectionId } from './scene/DeskSetup'
import { CREDITS } from './credits'
import './App.css'

const CONTENT: Record<Exclude<SectionId, null>, { title: string; body: string }> = {
  projects: {
    title: 'Proyectos',
    body: 'Has hecho click en el monitor. Aquí va la lista/galería de proyectos.',
  },
  about: {
    title: 'Sobre mí',
    body: 'Has hecho click en el teclado. Aquí va tu bio y stack técnico.',
  },
  contact: {
    title: 'Contacto',
    body: 'Has hecho click en el ratón. Aquí van tus enlaces y formulario de contacto.',
  },
  music: {
    title: 'Música',
    body: 'Has hecho click en los cascos. Aquí puede ir tu playlist favorita o algo personal.',
  },
  notes: {
    title: 'Notas',
    body: 'Has hecho click en los cuadernos. Aquí puede ir un blog, apuntes o notas personales.',
  },
  phone: {
    title: 'Móvil',
    body: 'Has hecho click en el móvil. Aquí pueden ir tus redes sociales o formas de contacto.',
  },
}

function App() {
  const [selected, setSelected] = useState<SectionId>(null)
  const [showCredits, setShowCredits] = useState(false)

  return (
    <div className="app">
      <Scene onSelect={setSelected} />

      <div className="hint">Arrastra para girar la vista · haz click en un objeto del escritorio</div>

      {selected && (
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
