// ─────────────────────────────────────────────────────────────
//  Visualiseur 3D d'un projet (champ `model` : URL d'un .glb).
//  Glisser pour tourner. Si les pièces du GLB portent un décalage
//  `explode` dans leurs extras glTF (userData), un curseur « Vue
//  éclatée » les écarte, et le survol d'une pièce affiche son
//  `label` / `desc`. Décodeur Draco servi depuis /draco/ (local).
//  Chargé en lazy par ProjectPage, seulement à l'approche de l'écran.
// ─────────────────────────────────────────────────────────────
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'

const DRACO = '/draco/'
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pièces éclatables : enfants directs de la scène avec un décalage `explode`
function useParts(scene) {
  return useMemo(
    () =>
      scene.children
        .filter((o) => Array.isArray(o.userData?.explode))
        .map((o) => ({ object: o, base: o.position.clone(), offset: new THREE.Vector3(...o.userData.explode) })),
    [scene]
  )
}

// Boîte englobante de l'objet pour un taux d'éclatement t
function boundsAt(scene, parts, t) {
  parts.forEach((p) => p.object.position.copy(p.base).addScaledVector(p.offset, t))
  scene.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(scene)
}

function Model({ url, explode, onHover, onReady }) {
  const { scene } = useGLTF(url, DRACO)
  const parts = useParts(scene)
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const t = useRef(explode)

  // Cadrage : assemblé (t = 0) et éclaté (t = 1), interpolé selon t
  const frames = useMemo(() => {
    const fit = (box) => {
      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const dist = (sphere.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.05
      return { center: sphere.center.clone(), dist, floor: box.min.y }
    }
    const closed = fit(boundsAt(scene, parts, 0))
    const open = parts.length ? fit(boundsAt(scene, parts, 1)) : closed
    boundsAt(scene, parts, t.current)
    return { closed, open }
  }, [scene, parts, camera])

  // Position de départ : vue de trois quarts, légèrement plongeante
  useEffect(() => {
    const { center, dist } = frames.closed
    camera.position.copy(center).add(new THREE.Vector3(0.75, 0.35, 1).normalize().multiplyScalar(dist))
    camera.near = dist / 100
    camera.far = dist * 20
    camera.updateProjectionMatrix()
    controls?.target.copy(center)
    controls?.update()
    onReady?.(parts.length > 0, frames.closed.floor)
  }, [frames, camera, controls, parts, onReady])

  const center = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const prev = t.current
    t.current = reducedMotion() ? explode : THREE.MathUtils.damp(t.current, explode, 5, dt)
    if (Math.abs(t.current - prev) < 1e-4) return
    parts.forEach((p) => p.object.position.copy(p.base).addScaledVector(p.offset, t.current))
    // La caméra garde sa direction, recule et suit le centre de l'objet
    const { closed, open } = frames
    center.lerpVectors(closed.center, open.center, t.current)
    const dist = THREE.MathUtils.lerp(closed.dist, open.dist, t.current)
    if (controls) {
      const dir = camera.position.clone().sub(controls.target).normalize()
      controls.target.copy(center)
      camera.position.copy(center).addScaledVector(dir, dist)
      controls.update()
    }
  })

  // Survol : la pièce (enfant direct de la scène) qui porte un label
  const partOf = (o) => {
    while (o && o.parent !== scene) o = o.parent
    return o?.userData?.label ? o : null
  }

  return (
    <primitive
      object={scene}
      onPointerMove={(e) => {
        e.stopPropagation()
        const part = partOf(e.object)
        onHover(part ? { label: part.userData.label, desc: part.userData.desc || '' } : null)
      }}
      onPointerOut={() => onHover(null)}
    />
  )
}

export default function ModelViewer({ url, title }) {
  const [explode, setExplode] = useState(0)
  const [hover, setHover] = useState(null)
  const [explodable, setExplodable] = useState(false)
  const [floor, setFloor] = useState(0)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(false) // l'utilisateur a pris la main : plus de rotation auto
  const onReady = useMemo(() => (canExplode, y) => (setExplodable(canExplode), setFloor(y), setReady(true)), [])

  return (
    <div className="pp-model__viewer">
      <div className={`pp-model__stage ${hover ? 'is-hovering' : ''}`}>
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
          camera={{ fov: 30, position: [3, 2, 4] }}
          aria-label={`Modèle 3D de ${title}. Glisser pour le faire tourner.`}
          role="img"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.5} position={[0, 5, -3]} scale={[10, 3, 1]} />
            <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
            <Lightformer form="rect" intensity={1.5} color="#ff3020" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
            <Lightformer form="ring" intensity={1.5} position={[0, -3, 5]} scale={4} />
          </Environment>
          <Suspense fallback={null}>
            <Model url={url} explode={explode} onHover={setHover} onReady={onReady} />
            <ContactShadows position={[0, floor + 0.001, 0]} opacity={0.55} scale={5} blur={2.4} far={2} frames={1} />
          </Suspense>
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableDamping
            autoRotate={!active && !reducedMotion()}
            autoRotateSpeed={0.8}
            minPolarAngle={0.15}
            maxPolarAngle={Math.PI / 2 + 0.05}
            onStart={() => setActive(true)}
          />
        </Canvas>

        {!ready && <p className="pp-model__loading pp-model__loading--overlay">Chargement du modèle…</p>}
        <p className="pp-model__hint" aria-hidden="true">
          Glisser pour tourner
        </p>
        <p className="pp-model__part" aria-live="polite">
          {hover && (
            <>
              <strong>{hover.label}</strong>
              {hover.desc && <span>{hover.desc}</span>}
            </>
          )}
        </p>
      </div>

      {explodable && (
        <div className="pp-model__controls">
          <label className="pp-model__range">
            <span>Vue éclatée</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(explode * 100)}
              onChange={(e) => setExplode(e.target.value / 100)}
              style={{ '--p': `${explode * 100}%` }}
            />
          </label>
          <button className="pp-model__toggle" onClick={() => setExplode((v) => (v > 0.5 ? 0 : 1))}>
            {explode > 0.5 ? 'Assembler' : 'Éclater'} <span aria-hidden="true">{explode > 0.5 ? '↓' : '↑'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
