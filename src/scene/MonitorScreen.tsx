import { useRef, type CSSProperties } from 'react'
import { Html } from '@react-three/drei'

interface ProjectLink {
  label: string
  url: string
}

interface Project {
  title: string
  description: string
  tech: string
  links: ProjectLink[]
  /** Real screenshot when the repo has one; otherwise a placeholder banner is shown. */
  image?: string
  icon: string
  gradient: string
}

const PROJECTS: Project[] = [
  {
    title: 'App Tripeas',
    description:
      'Aplicación móvil de viajes — mi Trabajo de Fin de Máster. Incluye un backend propio que da soporte a la app.',
    tech: 'Expo · React Native · TypeScript',
    links: [
      { label: 'App', url: 'https://github.com/angelalop03/TripEAs-app' },
      { label: 'Backend', url: 'https://github.com/angelalop03/TripEAs-backend' },
    ],
    icon: '✈️',
    gradient: 'linear-gradient(135deg, #6ea8fe, #a78bfa)',
  },
  {
    title: 'Web de Tripeas',
    description: 'Versión web de Tripeas.',
    tech: 'React · Vite',
    links: [{ label: 'Repositorio', url: 'https://github.com/angelalop03/TripEAs-Web' }],
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #60c9c1, #6ea8fe)',
  },
  {
    title: 'Mi libreta',
    description:
      'Aplicación web de tareas con estética de libreta: organiza pendientes por categoría (Personal, Trabajo, Urgente) y lanza un aviso emergente de escritorio al iniciar Windows.',
    tech: 'React · Vite · Supabase · Vercel',
    links: [{ label: 'Repositorio', url: 'https://github.com/angelalop03/mi-libreta' }],
    image: 'https://raw.githubusercontent.com/angelalop03/mi-libreta/main/public/screenshots/pantalla-principal-tareas.png',
    icon: '📝',
    gradient: 'linear-gradient(135deg, #ffb3d1, #ffd3e6)',
  },
  {
    title: 'App Tiempo',
    description: 'Aplicación móvil del tiempo.',
    tech: 'Expo · React Native',
    links: [{ label: 'Repositorio', url: 'https://github.com/angelalop03/AppTiempo' }],
    icon: '⛅',
    gradient: 'linear-gradient(135deg, #93c5fd, #bfdbfe)',
  },
  {
    title: 'Movies App',
    description: 'Explora películas populares, consulta detalles y realiza búsquedas usando la API de TMDB.',
    tech: 'React · React Router · Vite · TMDB API',
    links: [{ label: 'Repositorio', url: 'https://github.com/angelalop03/movies-app' }],
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #f2a65a, #f4d35e)',
  },
]

interface MonitorScreenProps {
  onClose: () => void
}

/**
 * A desktop-sized "window" floating on the monitor's screen (which already
 * faces the camera, standing vertically) listing GitHub projects with
 * descriptions and screenshots where available. Facing the camera head-on —
 * same lesson learned from the phone screen — keeps the text crisp instead
 * of rendering it on a raking-angle 3D plane.
 */
export default function MonitorScreen({ onClose }: MonitorScreenProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const scrollBy = (amount: number) => {
    listRef.current?.scrollBy({ top: amount, behavior: 'smooth' })
  }

  return (
    <group position={[0, 0.58, 0.15]} scale={0.75}>
      <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'auto' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{
            width: '650px',
            background: '#f2f2f2',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 14px',
              background: '#e2e2e4',
            }}
          >
            <span style={dotStyle('#ff5f57')} />
            <span style={dotStyle('#febc2e')} />
            <span style={dotStyle('#28c840')} />
            <div style={{ flex: 1, textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#333' }}>
              Proyectos
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              aria-label="Cerrar"
              style={{
                width: '20px',
                height: '20px',
                lineHeight: '19px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.12)',
                color: '#333',
                fontSize: '11px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            onWheel={(e) => e.stopPropagation()}
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {PROJECTS.map((project) => (
              <div
                key={project.title}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '10px',
                  padding: '10px',
                  flexShrink: 0,
                }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{ width: '62px', height: '62px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '6px',
                      background: project.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {project.icon}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>{project.title}</div>
                  <div style={{ fontSize: '11px', lineHeight: 1.45, color: '#555' }}>{project.description}</div>
                  <div style={{ fontSize: '9.5px', color: '#999', fontStyle: 'italic' }}>{project.tech}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10px',
                          color: '#2563eb',
                          textDecoration: 'none',
                        }}
                      >
                        <span style={{ fontSize: '11px', flexShrink: 0 }}>💻</span>
                        <span style={{ wordBreak: 'break-all' }}>
                          {link.label}: {link.url.replace('https://github.com/', '')}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              padding: '8px',
              background: '#e2e2e4',
            }}
          >
            <button onClick={(e) => { e.stopPropagation(); scrollBy(-120) }} style={scrollButtonStyle} aria-label="Subir">
              ▲
            </button>
            <button onClick={(e) => { e.stopPropagation(); scrollBy(120) }} style={scrollButtonStyle} aria-label="Bajar">
              ▼
            </button>
          </div>
        </div>
      </Html>
    </group>
  )
}

function dotStyle(color: string): CSSProperties {
  return {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }
}

const scrollButtonStyle: CSSProperties = {
  width: '32px',
  height: '22px',
  borderRadius: '6px',
  border: 'none',
  background: '#fff',
  color: '#444',
  fontSize: '11px',
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
}
