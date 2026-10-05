import { Suspense, forwardRef, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import K3Model from './K3Model'

// Résolution de rendu : plafonnée à 1,5× (au lieu de 2×) sur écran Retina,
// soit ~44 % de pixels en moins pour un rendu indiscernable (antialiasing MSAA
// actif, objet lisse sans texture). Les machines qui décrochent réellement
// (< 40 fps soutenus, mesurés par <PerformanceMonitor>) descendent par paliers
// vers 1×, puis remontent dès que ça redevient fluide.
const MAX_DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1
const MIN_DPR = Math.min(1, MAX_DPR)
const perfBounds = () => [40, 58]

// Canvas plein écran, fixe, transparent : il flotte au-dessus du fond
// (rouge puis noir) et sous/au-dessus du contenu selon la section.
const Experience = forwardRef(function Experience(_, ref) {
  const [dpr, setDpr] = useState(MAX_DPR)
  const onPerf = useCallback(({ factor }) => {
    // Paliers de 0,25 pour ne pas réallouer le canvas à chaque variation
    const next = Math.round((MIN_DPR + (MAX_DPR - MIN_DPR) * factor) * 4) / 4
    setDpr((d) => (d === next ? d : next))
  }, [])

  return (
    <div className="webgl" ref={ref} aria-hidden="true">
      <Canvas
        dpr={dpr}
        // 'default' (et non 'high-performance') : sur les portables à double GPU,
        // le navigateur reste sur le GPU intégré au lieu d'allumer le GPU dédié
        // (gros consommateur d'énergie) pour une scène d'un seul objet.
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 50 }}
      >
        <PerformanceMonitor factor={1} bounds={perfBounds} onChange={onPerf} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#ff2a00" />

        {/* Environnement « studio » généré localement : aucun HDR à télécharger.
            Ce sont ces panneaux qui se reflètent dans le vernis de l'objet. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, -4]} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={4} color="#ff1a00" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#ff5a7a" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="ring" intensity={2} position={[0, -3, 5]} scale={4} />
        </Environment>

        <Suspense fallback={null}>
          <K3Model />
        </Suspense>
      </Canvas>
    </div>
  )
})

export default Experience
