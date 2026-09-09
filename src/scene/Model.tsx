import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Euler, Vector3, type Mesh, type MeshStandardMaterial } from 'three'
import type { ThreeElements } from '@react-three/fiber'

type ModelProps = Omit<ThreeElements['group'], 'rotation'> & {
  url: string
  /** Multiplies the material's base color (texture stays, just brighter/darker). 1 = untouched. */
  brightness?: number
  /** Applied to the model itself (before grounding), not the outer group — so the object still ends up resting flush on y=0 after rotating. */
  rotation?: [number, number, number]
}

/**
 * Generic loader for a downloaded Sketchfab .glb/.gltf placed under /public/models.
 * Automatically centers the model horizontally and rests it on y=0 (in its own
 * local space) so callers only need to worry about `scale`, `rotation`, and
 * where on the desk it should sit — no manual bounding-box math per model.
 *
 * `rotation` is baked into the model's own transform *before* the ground/center
 * offset is computed, so tipping a model over (e.g. laying headphones flat)
 * doesn't leave part of it sunk below the desk surface — the bounding box used
 * for grounding is measured in its final, rotated orientation.
 *
 * Usage: <Model url="/models/retro-keyboard.glb" scale={0.4} />
 */
export default function Model({ url, brightness, rotation, ...props }: ModelProps) {
  const { scene } = useGLTF(url)

  const groundOffset = useMemo(() => {
    scene.rotation.copy(rotation ? new Euler(...rotation) : new Euler())
    scene.updateMatrixWorld(true)
    const box = new Box3().setFromObject(scene)
    const center = new Vector3()
    box.getCenter(center)
    return [-center.x, -box.min.y, -center.z] as [number, number, number]
  }, [scene, rotation])

  useEffect(() => {
    if (brightness === undefined) return
    scene.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((mat) => {
        const standardMat = mat as MeshStandardMaterial
        if (standardMat.color) standardMat.color.setScalar(brightness)
      })
    })
  }, [scene, brightness])

  return (
    <group {...props}>
      <primitive object={scene} position={groundOffset} />
    </group>
  )
}

// Preload hint — call Model.preload('/models/your-model.glb') near app startup
// once you know which models are used, to avoid pop-in.
Model.preload = (url: string) => useGLTF.preload(url)
