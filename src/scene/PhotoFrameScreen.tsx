import { Html } from '@react-three/drei'

const TRAITS = ['Trabajo en equipo', 'Empatía', 'Aprendizaje constante', 'Creatividad']

interface PhotoFrameScreenProps {
  onClose: () => void
}

/**
 * A "Sobre mí" card that floats beside the photo frame once the camera has
 * zoomed in on it (see Scene.tsx) — offset to the side rather than
 * overlapping the photo itself.
 */
export default function PhotoFrameScreen({ onClose }: PhotoFrameScreenProps) {
  return (
    <group position={[0.26, 0.3, 0.3]}>
      <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'auto' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '210px',
            background: '#fdf8ec',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            position: 'relative',
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
              top: '10px',
              right: '10px',
              width: '18px',
              height: '18px',
              lineHeight: '17px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.1)',
              color: '#3a2f28',
              fontSize: '10px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: '14px', fontWeight: 700, color: '#3a2f28', marginBottom: '2px' }}>
            Ángela López
          </div>
          <div style={{ fontSize: '10px', color: '#8a7a68', marginBottom: '10px' }}>Software Engineer</div>

          <div style={{ fontSize: '11px', lineHeight: 1.55, color: '#4a3f36' }}>
            Graduada en Ingeniería Informática por la Universidad de Sevilla y actualmente cursando el Máster en
            Desarrollo de Aplicaciones Web. Persona responsable, comunicativa y con muchas ganas de aprender,
            buscando seguir creciendo como desarrolladora de software.
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '12px' }}>
            {TRAITS.map((trait) => (
              <span
                key={trait}
                style={{
                  fontSize: '9px',
                  color: '#6e4a5a',
                  background: '#f3dce6',
                  borderRadius: '999px',
                  padding: '3px 8px',
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}
