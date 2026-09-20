import { Html } from '@react-three/drei'

const PLAYLIST_ID = '6As42Z4boubzur4PbGiasM'

function dotStyle(color: string) {
  return {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }
}

interface MusicPlayerProps {
  /** Whether the card should currently be shown — the player itself stays
   * mounted (and playing) regardless, this only toggles visibility. */
  visible: boolean
  onClose: () => void
}

/**
 * A floating "player" card that pops up off the headphones, facing the
 * camera directly. Stays mounted for the whole session (only its CSS
 * visibility toggles) so closing it doesn't tear down the iframe — the
 * music keeps playing, same as minimizing a real player window. Embeds
 * Spotify's official playlist widget, which has its own play/pause and
 * volume controls built in (there's no public JS API for volume, so we
 * don't try to duplicate it — just let the embed's own controls do it).
 */
export default function MusicPlayer({ visible, onClose }: MusicPlayerProps) {
  return (
    <group position={[0, 0.58, 0.15]} scale={0.75}>
      <Html
        transform
        occlude={false}
        distanceFactor={1}
        style={{
          pointerEvents: visible ? 'auto' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{
            width: '380px',
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
              Música
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

          <iframe
            title="Spotify playlist"
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator`}
            width="100%"
            height="352"
            style={{ border: 'none', display: 'block' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </Html>
    </group>
  )
}
