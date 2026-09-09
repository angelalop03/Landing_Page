import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import type { ThreeElements } from '@react-three/fiber'

type FbxModelProps = ThreeElements['group'] & {
  url: string
}

/**
 * Loader for models downloaded from Sketchfab in "Original" (FBX) format.
 * Usage: <FbxModel url="/models/monitor/Monitor.fbx" scale={0.01} />
 */
export default function FbxModel({ url, ...props }: FbxModelProps) {
  const fbx = useLoader(FBXLoader, url)
  return <primitive object={fbx} {...props} />
}
