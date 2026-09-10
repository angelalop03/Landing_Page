import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface CameraRigProps {
  /** Identifies which focus target is active (e.g. 'phone', 'projects'), or null for the default desk view. */
  focusKey: string | null
  controlsRef: RefObject<OrbitControlsImpl | null>
  focusPosition: [number, number, number]
  focusTarget: [number, number, number]
  defaultPosition: [number, number, number]
  defaultTarget: [number, number, number]
}

/**
 * Smoothly flies the camera to a close-up pose when `focusKey` is set, and
 * back to the default desk view otherwise. Only touches the camera while
 * actively transitioning — once it settles at the default pose it goes fully
 * idle, otherwise it would fight the user's free OrbitControls dragging every
 * frame and keep snapping the view back. Restarts the transition whenever
 * `focusKey` itself changes, including switching directly between two
 * different focus targets (e.g. phone → monitor) without passing through null.
 */
export default function CameraRig({ focusKey, controlsRef, focusPosition, focusTarget, defaultPosition, defaultTarget }: CameraRigProps) {
  const { camera } = useThree()
  const prevKey = useRef(focusKey)
  // Start true unconditionally (not just when focused) so the very first mount
  // also animates — from wherever the Canvas's initial camera pose is — into
  // the default view, giving the app a small "swooping in" entrance.
  const animating = useRef(true)
  const focused = focusKey !== null

  if (prevKey.current !== focusKey) {
    prevKey.current = focusKey
    animating.current = true
  }

  useFrame((_, delta) => {
    if (!animating.current) return

    const [px, py, pz] = focused ? focusPosition : defaultPosition
    const [tx, ty, tz] = focused ? focusTarget : defaultTarget
    const lambda = 4.5

    camera.position.x = MathUtils.damp(camera.position.x, px, lambda, delta)
    camera.position.y = MathUtils.damp(camera.position.y, py, lambda, delta)
    camera.position.z = MathUtils.damp(camera.position.z, pz, lambda, delta)

    const controls = controlsRef.current
    if (controls) {
      controls.target.x = MathUtils.damp(controls.target.x, tx, lambda, delta)
      controls.target.y = MathUtils.damp(controls.target.y, ty, lambda, delta)
      controls.target.z = MathUtils.damp(controls.target.z, tz, lambda, delta)
      controls.update()
    }

    // Once we've settled back at the default pose, stop touching the camera
    // entirely so OrbitControls has full, uncontested control again. While
    // focused we keep tracking (in case of float drift), that's cheap either way.
    if (!focused) {
      const dx = camera.position.x - px
      const dy = camera.position.y - py
      const dz = camera.position.z - pz
      if (dx * dx + dy * dy + dz * dz < 0.0005) {
        animating.current = false
      }
    }
  })

  return null
}
