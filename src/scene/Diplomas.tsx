import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { MathUtils, type Group } from 'three'

// Where an expanded diploma pops out to — centered and pulled well in front of
// the board (and the monitor) so the camera reads it up close, regardless of
// which spot on the board it started from.
const EXPANDED_POSITION: [number, number, number] = [0, 0.78, 1.75]
const EXPANDED_ROTATION_DEG = 0

interface DiplomaConfig {
  id: string
  position: [number, number, number]
  rotationDeg: number
  color: string
  title: string
  subtitle: string
  years?: string
  description: string
}

const DIPLOMAS: DiplomaConfig[] = [
  {
    id: 'sevilla',
    position: [-0.58, 1.14, 0.05],
    rotationDeg: -4,
    color: '#dff5ec',
    title: 'Grado en Ingeniería Informática',
    subtitle: 'Universidad de Sevilla',
    years: '2021 – 2025',
    description: 'Formación integral en desarrollo de software, algoritmos y arquitectura de sistemas.',
  },
  {
    id: 'europea',
    position: [0, 1.17, 0.05],
    rotationDeg: 3,
    color: '#fdeadd',
    title: 'Máster en Desarrollo de Aplicaciones Web',
    subtitle: 'Universidad Europea',
    years: '2025 – 2026 (en curso)',
    description: 'Especialización en tecnologías web modernas: React, Node.js, APIs y bases de datos.',
  },
  {
    id: 'cjc',
    position: [0.58, 1.12, 0.05],
    rotationDeg: -2,
    color: '#e8e4fb',
    title: 'Máster en Organizaciones y Analítica de Datos',
    subtitle: 'Universidad Camilo José Cela',
    years: '2025 – 2026 (en curso)',
    description: 'Gestión organizacional y analítica de datos aplicada a la toma de decisiones.',
  },
  {
    id: 'cambridge',
    position: [-0.48, 0.74, 0.05],
    rotationDeg: 5,
    color: '#fdf3d0',
    title: 'Cambridge English B2',
    subtitle: 'First Certificate in English (FCE)',
    description: 'Certificación oficial de nivel de inglés B2 emitida por Cambridge English.',
  },
  {
    id: 'figma',
    position: [0.3, 0.77, 0.05],
    rotationDeg: -3,
    color: '#fde0ea',
    title: 'Figma UI/UX Design Essentials',
    subtitle: 'Udemy',
    years: 'Junio 2026',
    description: 'Fundamentos de diseño UI/UX y prototipado de interfaces con Figma.',
  },
  {
    id: 'vibecoding',
    position: [0, 0.62, 0.06],
    rotationDeg: 4,
    color: '#dbe9fe',
    title: 'Vibe Coding Práctico: Desarrollo de Apps con IA desde Cero',
    subtitle: 'Udemy · Digital Life Academy',
    years: 'Septiembre 2026',
    description: 'Curso práctico de desarrollo de aplicaciones con inteligencia artificial ("vibe coding"), impartido por Gustavo Escobar Henríquez.',
  },
]

interface DiplomaProps extends DiplomaConfig {
  expanded: boolean
  dimmed: boolean
  onToggle: () => void
}

function Diploma({ position, rotationDeg, color, title, subtitle, years, description, expanded, dimmed, onToggle }: DiplomaProps) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    const [tx, ty, tz] = expanded ? EXPANDED_POSITION : position
    const targetRotZ = ((expanded ? EXPANDED_ROTATION_DEG : rotationDeg) * Math.PI) / 180
    const lambda = 8
    g.position.x = MathUtils.damp(g.position.x, tx, lambda, delta)
    g.position.y = MathUtils.damp(g.position.y, ty, lambda, delta)
    g.position.z = MathUtils.damp(g.position.z, tz, lambda, delta)
    g.rotation.z = MathUtils.damp(g.rotation.z, targetRotZ, lambda, delta)
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, (rotationDeg * Math.PI) / 180]}>
      <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'auto' }}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          style={{
            position: 'relative',
            width: expanded ? '260px' : '150px',
            padding: expanded ? '18px 20px 16px' : '10px 11px 9px',
            background: color,
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '3px',
            boxShadow: expanded ? '0 18px 44px rgba(0,0,0,0.5)' : '0 6px 14px rgba(0,0,0,0.3)',
            opacity: dimmed ? 0.35 : 1,
            fontFamily: 'Georgia, "Times New Roman", serif',
            textAlign: expanded ? 'left' : 'center',
            cursor: 'pointer',
            transition: 'width 0.2s ease, padding 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {expanded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                lineHeight: '18px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.12)',
                color: '#2a2a2a',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}

          <div
            style={{
              position: 'absolute',
              top: '-7px',
              left: expanded ? '20px' : '50%',
              transform: expanded ? 'none' : 'translateX(-50%)',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: '#e0455f',
              boxShadow: '0 2px 3px rgba(0,0,0,0.45)',
            }}
          />

          <div style={{ fontSize: expanded ? '16px' : '11px', fontWeight: 700, color: '#2a2a2a', lineHeight: 1.3 }}>
            {title}
          </div>
          <div style={{ fontSize: expanded ? '13px' : '9px', color: '#555', marginTop: '5px', lineHeight: 1.3 }}>
            {subtitle}
          </div>
          {years && <div style={{ fontSize: expanded ? '12px' : '8px', color: '#888', marginTop: '2px' }}>{years}</div>}

          {expanded && (
            <div style={{ fontSize: '12px', color: '#3a3a3a', marginTop: '12px', lineHeight: 1.55 }}>
              {description}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

/** Small non-interactive touches so the board reads as a real, lived-in bulletin board. */
function CorkDecorations() {
  return (
    <>
      {/* washi tape, top-left corner */}
      <group position={[-0.72, 1.32, 0.04]} rotation={[0, 0, (-30 * Math.PI) / 180]}>
        <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              width: '70px',
              height: '22px',
              background:
                'repeating-linear-gradient(45deg, rgba(216,180,254,0.75), rgba(216,180,254,0.75) 6px, rgba(196,181,253,0.6) 6px, rgba(196,181,253,0.6) 12px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </Html>
      </group>

      {/* loose pushpins scattered around */}
      {[
        { pos: [-0.75, 0.55, 0.03] as [number, number, number], color: '#5eb1e0' },
        { pos: [0.78, 0.5, 0.03] as [number, number, number], color: '#f2a65a' },
        { pos: [0.68, 1.28, 0.03] as [number, number, number], color: '#7bc97e' },
      ].map((pin, i) => (
        <group key={i} position={pin.pos}>
          <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: pin.color,
                boxShadow: '0 2px 3px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.5)',
              }}
            />
          </Html>
        </group>
      ))}
    </>
  )
}

/**
 * Cork board contents — render as a sibling of <CorkBoard /> inside the same
 * wrapping group, so positions here are relative to the board's own local
 * space (bottom-center origin, x spans roughly -0.9..0.9, y spans 0..1.35).
 */
export default function Diplomas() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <group>
      <CorkDecorations />
      {DIPLOMAS.map((d) => (
        <Diploma
          key={d.id}
          {...d}
          expanded={expandedId === d.id}
          dimmed={expandedId !== null && expandedId !== d.id}
          onToggle={() => setExpandedId((cur) => (cur === d.id ? null : d.id))}
        />
      ))}
    </group>
  )
}
