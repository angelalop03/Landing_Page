import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import DeskSetup, { PHONE_POSITION, MONITOR_POSITION, HEADPHONES_POSITION, DESK_TOP_Y, type SectionId } from './DeskSetup'
import CameraRig from './CameraRig'

interface SceneProps {
  selected: SectionId
  onSelect: (id: SectionId) => void
}

const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 0.6, 3.2]
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, -0.1, 0]

// Where the camera starts on mount — CameraRig always animates toward the
// default pose from here, giving the page a small "swooping in" entrance.
const INTRO_CAMERA_POSITION: [number, number, number] = [0, 2.1, 6.2]

// Near-top-down so the (flat, screen-up) phone reads like looking straight at
// it rather than at a steep angle — text on a tilted plane renders visibly
// distorted/soft under a 3D perspective transform, independent of resolution.
const PHONE_CAMERA_POSITION: [number, number, number] = [
  PHONE_POSITION[0] + 0.02,
  PHONE_POSITION[1] + 0.7,
  PHONE_POSITION[2] + 0.1,
]
const PHONE_CAMERA_TARGET: [number, number, number] = [PHONE_POSITION[0], DESK_TOP_Y + 0.03, PHONE_POSITION[2]]

// The monitor's screen already stands vertical, facing the camera — approach
// it head-on (same X/Y for camera and target, only Z differs) so the "window"
// reads straight-on instead of at a tilt, avoiding the same blur we saw when
// the phone's card was viewed at an angle.
const MONITOR_CAMERA_TARGET: [number, number, number] = [MONITOR_POSITION[0], DESK_TOP_Y + 0.55, MONITOR_POSITION[2]]
const MONITOR_CAMERA_POSITION: [number, number, number] = [
  MONITOR_POSITION[0],
  DESK_TOP_Y + 0.55,
  MONITOR_POSITION[2] + 1.72,
]

// The music player pops up off the headphones facing the camera (same
// reasoning as the monitor) — the Spotify embed has its own real controls,
// so it needs to read straight-on rather than on a raking plane.
const MUSIC_CAMERA_TARGET: [number, number, number] = [HEADPHONES_POSITION[0], DESK_TOP_Y + 0.58, HEADPHONES_POSITION[2]]
const MUSIC_CAMERA_POSITION: [number, number, number] = [
  HEADPHONES_POSITION[0],
  DESK_TOP_Y + 0.58,
  HEADPHONES_POSITION[2] + 1.7,
]

const FOCUS_CAMERA: Record<'phone' | 'projects' | 'music', { position: [number, number, number]; target: [number, number, number] }> = {
  phone: { position: PHONE_CAMERA_POSITION, target: PHONE_CAMERA_TARGET },
  projects: { position: MONITOR_CAMERA_POSITION, target: MONITOR_CAMERA_TARGET },
  music: { position: MUSIC_CAMERA_POSITION, target: MUSIC_CAMERA_TARGET },
}

export default function Scene({ selected, onSelect }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  const focusKey = selected === 'phone' || selected === 'projects' || selected === 'music' ? selected : null
  const focus = focusKey ? FOCUS_CAMERA[focusKey] : null
  const focusPosition = focus ? focus.position : DEFAULT_CAMERA_POSITION
  const focusTarget = focus ? focus.target : DEFAULT_CAMERA_TARGET

  return (
    <Canvas
      shadows
      gl={{ alpha: true }}
      camera={{ position: INTRO_CAMERA_POSITION, fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <pointLight position={[-2, 1, -1]} intensity={0.6} color="#7dd3fc" />

      <Suspense fallback={null}>
        <DeskSetup selected={selected} onSelect={onSelect} />
        <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={6} blur={2.5} far={2} />

        {/* Synthetic (locally-rendered) environment so PBR materials get proper
            reflections without fetching an external HDRI file. */}
        <Environment resolution={256}>
          <Lightformer intensity={2} color="#fff5f8" position={[0, 6, 0]} scale={[10, 10, 1]} rotation={[-Math.PI / 2, 0, 0]} />
          <Lightformer intensity={1.2} color="#ffffff" position={[-5, 2, 3]} scale={[8, 8, 1]} rotation={[0, Math.PI / 2, 0]} />
          <Lightformer intensity={1.2} color="#ffffff" position={[5, 2, 3]} scale={[8, 8, 1]} rotation={[0, -Math.PI / 2, 0]} />
          <Lightformer intensity={0.8} color="#ffd3e6" position={[0, 1, -5]} scale={[10, 5, 1]} />
        </Environment>
      </Suspense>

      <CameraRig
        focusKey={focusKey}
        controlsRef={controlsRef}
        focusPosition={focusPosition}
        focusTarget={focusTarget}
        defaultPosition={DEFAULT_CAMERA_POSITION}
        defaultTarget={DEFAULT_CAMERA_TARGET}
      />

      <OrbitControls
        ref={controlsRef}
        enabled={focusKey === null}
        enablePan={false}
        minDistance={focusKey !== null ? 0.15 : 1.8}
        maxDistance={5}
        maxPolarAngle={Math.PI / 1.9}
        target={DEFAULT_CAMERA_TARGET}
      />
    </Canvas>
  )
}
