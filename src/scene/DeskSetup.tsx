import { useState } from 'react'
import Model from './Model'
import Diplomas from './Diplomas'
import PhoneScreen from './PhoneScreen'
import MonitorScreen from './MonitorScreen'
import MusicPlayer from './MusicPlayer'

export type SectionId = 'about' | 'projects' | 'contact' | 'music' | 'notes' | 'phone' | null

export const DESK_TOP_Y = -0.71
export const PHONE_POSITION: [number, number, number] = [0.9, DESK_TOP_Y, 0.4]
export const MONITOR_POSITION: [number, number, number] = [0, DESK_TOP_Y, -0.4]
export const HEADPHONES_POSITION: [number, number, number] = [1.15, DESK_TOP_Y, -0.05]
// Real (post-load) bounding box is ~2 wide x 0.86 tall x 0.9 deep scene units
// — the glTF's declared accessor min/max metadata is stale/wrong, so this was
// measured from the loaded geometry itself rather than trusted from the file.
const DESK_MODEL_SCALE = 1.7
const DESK_MODEL_HEIGHT = 0.8632 * DESK_MODEL_SCALE
const DESK_FLOOR_Y = DESK_TOP_Y - DESK_MODEL_HEIGHT

// Deskmat's real (post-load) thickness, scaled — objects resting "on the mat"
// need to sit this far above the desk surface, or their bottom faces are
// exactly coplanar with the mat's top and z-fight (flicker on top of it),
// which becomes very visible the instant either one's hover-scale nudges it.
const MAT_THICKNESS = 0.17573 * 0.076

// Rotation arrays passed to <Model> must be stable references: Model's
// ground-offset calculation depends on `rotation` and mutates the loaded
// scene's transform to measure it, so a new array literal every render
// (e.g. inline in JSX) re-triggers that on every hover-driven re-render —
// which was making rotated models (like the headphones) visibly jitter.
const LYING_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0]
const MAT_ROTATION: [number, number, number] = [0, Math.PI / 2, 0]

interface HotspotProps {
  position: [number, number, number]
  color: string
  id: SectionId
  hovered: SectionId
  onHover: (id: SectionId) => void
  onSelect: (id: SectionId) => void
  /** While true, hover no longer scales the group up — used once this hotspot's own panel/screen is open, so hovering over it doesn't grow the open content. */
  suppressHoverScale?: boolean
  children: React.ReactNode
}

/**
 * Wraps a placeholder mesh with hover/click behaviour.
 * Swap the `children` primitive for a loaded Sketchfab <Model url="..." />
 * and keep this wrapper for the interactivity.
 */
function Hotspot({ position, color, id, hovered, onHover, onSelect, suppressHoverScale, children }: HotspotProps) {
  const isHovered = hovered === id && !suppressHoverScale

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      scale={isHovered ? 1.08 : 1}
    >
      {children}
      {/* fallback tint so hover is visible even before real models are swapped in */}
      <meshStandardMaterial attach="material" color={color} />
    </group>
  )
}

function Monitor() {
  return <Model url="/models/monitor/scene.gltf" scale={0.44} />
}

function Keyboard() {
  return <Model url="/models/keyboard2/scene.gltf" scale={0.22} />
}

function Headphones() {
  return <Model url="/models/headphones/scene.gltf" scale={0.075} rotation={LYING_ROTATION} />
}

function Mouse() {
  return <Model url="/models/mouse/scene.gltf" scale={2.3} />
}

function Phone() {
  return <Model url="/models/iphone/scene.gltf" scale={1.46} rotation={LYING_ROTATION} />
}

function Mug() {
  return <Model url="/models/coffee-cup/scene.gltf" scale={1.4} />
}

function Notebooks() {
  return <Model url="/models/notebooks/scene.gltf" scale={0.6} />
}

function CorkBoard() {
  return <Model url="/models/corkboard/scene.gltf" scale={0.45} />
}

function Deskmat() {
  return <Model url="/models/deskmat/scene.gltf" scale={0.076} rotation={MAT_ROTATION} />
}

function Desk() {
  return (
    <Model
      url="/models/desk/scene.gltf"
      scale={DESK_MODEL_SCALE}
      position={[0, DESK_FLOOR_Y, 0]}
      brightness={1.6}
    />
  )
}

interface DeskSetupProps {
  selected: SectionId
  onSelect: (id: SectionId) => void
}

/**
 * Placeholder computer setup built from primitives.
 *
 * To replace a piece with a real Sketchfab model:
 * 1. Download the .glb from Sketchfab (check the license first).
 * 2. Drop it in /public/models/your-model.glb
 * 3. Swap the placeholder mesh below for <Model url="/models/your-model.glb" />
 *    (see src/scene/Model.tsx) inside the matching <Hotspot>.
 */
export default function DeskSetup({ selected, onSelect }: DeskSetupProps) {
  const [hovered, setHovered] = useState<SectionId>(null)

  return (
    <group>
      <Desk />

      {/* decorative, non-interactive prop — hangs on the "wall" behind the monitor */}
      <group position={[0, DESK_TOP_Y + 0.55, -0.9]}>
        <CorkBoard />
        <Diplomas />
      </group>

      {/* decorative, non-interactive prop */}
      <group position={[0, DESK_TOP_Y, 0.3]}>
        <Deskmat />
      </group>

      <Hotspot
        position={MONITOR_POSITION}
        color={hovered === 'projects' ? '#7dd3fc' : '#111116'}
        id="projects"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
        suppressHoverScale={selected === 'projects'}
      >
        <Monitor />
        {selected === 'projects' && <MonitorScreen onClose={() => onSelect(null)} />}
      </Hotspot>

      <Hotspot
        position={[0, DESK_TOP_Y + MAT_THICKNESS, 0.3]}
        color={hovered === 'about' ? '#c4b5fd' : '#1c1c22'}
        id="about"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
      >
        <Keyboard />
      </Hotspot>

      <Hotspot
        position={[0.65, DESK_TOP_Y + MAT_THICKNESS, 0.3]}
        color={hovered === 'contact' ? '#fca5a5' : '#1c1c22'}
        id="contact"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
      >
        <Mouse />
      </Hotspot>

      {/* decorative, non-interactive prop */}
      <group position={[-1.1, DESK_TOP_Y, -0.05]}>
        <Mug />
      </group>

      <Hotspot
        position={HEADPHONES_POSITION}
        color={hovered === 'music' ? '#fbcfe8' : '#2a2a2a'}
        id="music"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
        suppressHoverScale={selected === 'music'}
      >
        <Headphones />
        <MusicPlayer visible={selected === 'music'} onClose={() => onSelect(null)} />
      </Hotspot>

      <Hotspot
        position={[-0.68, DESK_TOP_Y, 0.4]}
        color={hovered === 'notes' ? '#fde68a' : '#3a3a3a'}
        id="notes"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
      >
        <Notebooks />
      </Hotspot>

      <Hotspot
        position={PHONE_POSITION}
        color={hovered === 'phone' ? '#a7f3d0' : '#111116'}
        id="phone"
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
        suppressHoverScale={selected === 'phone'}
      >
        <Phone />
        {selected === 'phone' && <PhoneScreen onClose={() => onSelect(null)} />}
      </Hotspot>
    </group>
  )
}
