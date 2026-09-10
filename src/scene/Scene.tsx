import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import DeskSetup, { PHONE_POSITION, DESK_TOP_Y, type SectionId } from './DeskSetup'
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

export default function Scene({ selected, onSelect }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const focused = selected === 'phone'

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
        focused={focused}
        controlsRef={controlsRef}
        focusPosition={PHONE_CAMERA_POSITION}
        focusTarget={PHONE_CAMERA_TARGET}
        defaultPosition={DEFAULT_CAMERA_POSITION}
        defaultTarget={DEFAULT_CAMERA_TARGET}
      />

      <OrbitControls
        ref={controlsRef}
        enabled={!focused}
        enablePan={false}
        minDistance={focused ? 0.15 : 1.8}
        maxDistance={5}
        maxPolarAngle={Math.PI / 1.9}
        target={DEFAULT_CAMERA_TARGET}
      />
    </Canvas>
  )
}
