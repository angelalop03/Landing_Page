import { Html } from '@react-three/drei'

interface ExperienceEntry {
  role: string
  company: string
  location: string
  description: string
}

// Real entries from the CV — one per page. Add more here as they come in.
const EXPERIENCE: ExperienceEntry[] = [
  {
    role: 'Prácticas en desarrollo de software sanitario',
    company: 'Dedalus Healthcare',
    location: 'Sevilla, España',
    description:
      'Colaboración en proyectos de software sanitario, apoyo en desarrollo y pruebas. Participación en reuniones de equipo técnico.',
  },
  {
    role: 'Beca Discover',
    company: 'Airbus',
    location: 'Marzo 2026 – Febrero 2027',
    description: 'Automatización de procesos repetitivos en el departamento de logística.',
  },
]

// The notebook's real open-page footprint (world-space, lying flat on the
// desk) is tiny — same lesson as the phone/monitor screens: rendering text
// directly at that CSS size looks blurry once the camera magnifies it. Lay
// the content out at SCALE× the real dimensions (crisp, normal-sized fonts)
// and shrink the whole thing back down with a CSS transform.
const WIDTH = 300
const HEIGHT = 168
const SCALE = 20

function ExperiencePage({ entry }: { entry: ExperienceEntry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${4 * SCALE}px` }}>
      <div style={{ fontSize: `${11 * SCALE}px`, fontWeight: 700, color: '#2a2a2a' }}>{entry.role}</div>
      <div style={{ fontSize: `${9 * SCALE}px`, fontStyle: 'italic', color: '#4a4a4a' }}>
        {entry.company}
        {entry.location ? ` · ${entry.location}` : ''}
      </div>
      <div style={{ fontSize: `${9.5 * SCALE}px`, lineHeight: 1.45, color: '#333' }}>{entry.description}</div>
    </div>
  )
}

interface NotebookScreenProps {
  onClose: () => void
}

/**
 * Writes the experience entries directly onto the real notebook model's own
 * open pages — a thin, borderless, (mostly) transparent overlay sized and
 * positioned to match the model's actual page spread, rather than a separate
 * floating "card" that covered it up. Lying flat in the same plane as the
 * notebook (same reasoning as the phone/monitor screens: a raking angle
 * blurs text), so the near-top-down camera in Scene.tsx reads it straight-on.
 */
export default function NotebookScreen({ onClose }: NotebookScreenProps) {
  return (
    <group position={[0.008, 0.03, 0.032]} rotation={[-Math.PI / 2, 0, 0]} scale={0.7}>
      <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'auto' }}>
        <div style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, overflow: 'visible' }}>
          <div
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{
              width: `${WIDTH * SCALE}px`,
              height: `${HEIGHT * SCALE}px`,
              transform: `scale(${1 / SCALE})`,
              transformOrigin: 'top left',
              display: 'flex',
              fontFamily: 'Georgia, "Times New Roman", serif',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: `${3 * SCALE}px`,
                right: `${3 * SCALE}px`,
                width: `${13 * SCALE}px`,
                height: `${13 * SCALE}px`,
                lineHeight: `${12 * SCALE}px`,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: `${7 * SCALE}px`,
                cursor: 'pointer',
                padding: 0,
                zIndex: 3,
              }}
            >
              ✕
            </button>

            {/* left page */}
            <div
              style={{
                width: '48%',
                padding: `${6 * SCALE}px ${8 * SCALE}px`,
                boxSizing: 'border-box',
              }}
            >
              <ExperiencePage entry={EXPERIENCE[0]} />
            </div>

            <div style={{ width: '4%', flexShrink: 0 }} />

            {/* right page */}
            <div
              style={{
                width: '48%',
                padding: `${6 * SCALE}px ${8 * SCALE}px`,
                boxSizing: 'border-box',
              }}
            >
              <ExperiencePage entry={EXPERIENCE[1]} />
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
