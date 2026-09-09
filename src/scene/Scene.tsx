import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import DeskSetup, { type SectionId } from './DeskSetup'

interface SceneProps {
  onSelect: (id: SectionId) => void
}

export default function Scene({ onSelect }: SceneProps) {
  return (
    <Canvas
      shadows
      gl={{ alpha: true }}
      camera={{ position: [0, 0.6, 3.2], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <pointLight position={[-2, 1, -1]} intensity={0.6} color="#7dd3fc" />

      <Suspense fallback={null}>
        <DeskSetup onSelect={onSelect} />
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

      <OrbitControls
        enablePan={false}
        minDistance={1.8}
        maxDistance={5}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, -0.1, 0]}
      />
    </Canvas>
  )
}
