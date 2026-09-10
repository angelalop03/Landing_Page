import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface CameraRigProps {
  focused: boolean
  controlsRef: RefObject<OrbitControlsImpl | null>
  focusPosition: [number, number, number]
  focusTarget: [number, number, number]
  defaultPosition: [number, number, number]
  defaultTarget: [number, number, number]
}

/**
 * Smoothly flies the camera to a close-up pose when `focused`, and back to the
 * default desk view otherwise. Only touches the camera while actively
 * transitioning (entering focus, or returning from it) — once it settles back
 * at the default pose it goes fully idle, otherwise it would fight the user's
 * free OrbitControls dragging every frame and keep snapping the view back.
 */
export default function CameraRig({ focused, controlsRef, focusPosition, focusTarget, defaultPosition, defaultTarget }: CameraRigProps) {
  const { camera } = useThree()
  const prevFocused = useRef(focused)
  const animating = useRef(focused)

  if (prevFocused.current !== focused) {
    prevFocused.current = focused
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
