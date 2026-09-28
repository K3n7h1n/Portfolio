import { Suspense, forwardRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import K3Model from './K3Model'

// Canvas plein écran, fixe, transparent : il flotte au-dessus du fond
// (rouge puis noir) et sous/au-dessus du contenu selon la section.
const Experience = forwardRef(function Experience(_, ref) {
  return (
    <div className="webgl" ref={ref} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 50 }}
      >
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
