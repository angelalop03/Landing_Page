import type { CSSProperties } from 'react'
import { Html } from '@react-three/drei'

interface PhoneScreenProps {
  onClose: () => void
}

// The card's true footprint (world-space, matches the phone screen) is tiny —
// rendering text directly at that CSS size looks blurry once the camera zooms
// in and magnifies it (upscaling already-small rasterized text). Instead we
// lay out the content at SCALE× those dimensions (crisp, normal-sized fonts)
// and shrink the whole thing back down with a CSS transform, so the browser
// rasterizes text at a comfortable size first and only ever downscales it.
const WIDTH = 68
const HEIGHT = 138
const SCALE = 7

/**
 * Rendered lying flat on top of the phone model, matching its screen orientation
 * (the phone itself lies face-up on the desk). Legible once the camera flies in
 * close via CameraRig, same as looking at a real phone up close.
 */
export default function PhoneScreen({ onClose }: PhoneScreenProps) {
  return (
    <group position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Html transform occlude={false} distanceFactor={1} style={{ pointerEvents: 'auto' }}>
        <div style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, overflow: 'hidden' }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `${WIDTH * SCALE}px`,
              height: `${HEIGHT * SCALE}px`,
              transform: `scale(${1 / SCALE})`,
              transformOrigin: 'top left',
              background: 'linear-gradient(160deg, #26262b, #0a0a0c)',
              borderRadius: `${7 * SCALE}px`,
              boxShadow: `inset 0 0 0 ${1.5 * SCALE}px rgba(255,255,255,0.08)`,
              color: '#fff',
              fontFamily: 'system-ui, sans-serif',
              padding: `${9 * SCALE}px ${5 * SCALE}px ${6 * SCALE}px`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
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
                top: `${3 * SCALE}px`,
                right: `${3 * SCALE}px`,
                width: `${10 * SCALE}px`,
                height: `${10 * SCALE}px`,
                lineHeight: `${9 * SCALE}px`,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: `${6 * SCALE}px`,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕
            </button>

            <div
              style={{
                width: `${22 * SCALE}px`,
                height: `${22 * SCALE}px`,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${8 * SCALE}px`,
                fontWeight: 700,
                color: '#2a2a2a',
                margin: `${6 * SCALE}px 0 ${5 * SCALE}px`,
              }}
            >
              ÁL
            </div>
            <div style={{ fontSize: `${6.5 * SCALE}px`, fontWeight: 700, lineHeight: 1.2 }}>Ángela López Oliva</div>
            <div style={{ fontSize: `${5 * SCALE}px`, color: 'rgba(255,255,255,0.5)', marginBottom: `${7 * SCALE}px` }}>
              Software Engineer
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${3 * SCALE}px` }}>
              <div style={rowStyle}>
                <span style={iconStyle}>📧</span>
                <span style={textStyle}>angelalopezoliva03@gmail.com</span>
              </div>
              <div style={rowStyle}>
                <span style={iconStyle}>📱</span>
                <span style={textStyle}>601 319 645</span>
              </div>
              <div style={rowStyle}>
                <span style={iconStyle}>💻</span>
                <span style={textStyle}>github.com/angelalop03</span>
              </div>
              <div style={rowStyle}>
                <span style={iconStyle}>📍</span>
                <span style={textStyle}>Sanlúcar de Barrameda</span>
              </div>
            </div>

            <div
              style={{
                width: `${24 * SCALE}px`,
                height: `${2 * SCALE}px`,
                borderRadius: `${1 * SCALE}px`,
                background: 'rgba(255,255,255,0.3)',
                marginTop: 'auto',
              }}
            />
          </div>
        </div>
      </Html>
    </group>
  )
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: `${3 * SCALE}px`,
  background: 'rgba(255,255,255,0.08)',
  borderRadius: `${3 * SCALE}px`,
  padding: `${3 * SCALE}px`,
  textAlign: 'left',
}

const iconStyle: CSSProperties = {
  fontSize: `${5.5 * SCALE}px`,
  flexShrink: 0,
}

const textStyle: CSSProperties = {
  fontSize: `${4.3 * SCALE}px`,
  lineHeight: 1.2,
  color: 'rgba(255,255,255,0.85)',
  wordBreak: 'break-all',
}
