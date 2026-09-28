import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { store } from '../lib/store'
import { KEYFRAMES, KEYFRAMES_PORTRAIT, sampleKeyframes } from './keyframes'
import { heroBackdrop, drawHeroBackdrop } from './heroBackdrop'

const MODEL_URL = '/models/k3-black.glb'

// Shader injecté dans le MeshPhysicalMaterial :
// chaque pixel de l'objet teste s'il se trouve sous le rideau noir
// (même cercle que le clip-path CSS). Sur le rouge → noir brillant,
// sur le noir → blanc nacré avec un liseré rouge (fresnel).
// uDissolve fait fondre la matière noire depuis le point survolé
// pour révéler la version « liquid glass » placée juste dessous.
function useContrastMaterial() {
  return useMemo(() => {
    const uniforms = {
      uCurtain: { value: new THREE.Vector3(0, 99999, 0) },
      uViewport: { value: new THREE.Vector3(1, 1, 1) },
      uColorOnRed: { value: new THREE.Color('#050709') },
      uColorOnDark: { value: new THREE.Color('#f4f1ee') },
      uRimOnRed: { value: new THREE.Color('#ff3b1f').multiplyScalar(0.35) },
      uRimOnDark: { value: new THREE.Color('#ff0000').multiplyScalar(1.2) },
      uDissolve: { value: 0 },
      uHit: { value: new THREE.Vector3() },
      uTime: { value: 0 },
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: '#050709',
      roughness: 0.19,
      metalness: 0.08,
      clearcoat: 0.7,
      clearcoatRoughness: 0.07,
      side: THREE.DoubleSide,
    })

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vK3Pos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvK3Pos = position;')
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          /* glsl */ `#include <common>
          uniform vec3 uCurtain;   // cx, cy, rayon (px CSS, origine en haut)
          uniform vec3 uViewport;  // largeur, hauteur (px CSS), devicePixelRatio
          uniform vec3 uColorOnRed;
          uniform vec3 uColorOnDark;
          uniform vec3 uRimOnRed;
          uniform vec3 uRimOnDark;
          uniform float uDissolve;
          uniform vec3 uHit;
          uniform float uTime;
          varying vec3 vK3Pos;

          float k3Hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
          }
          float k3Noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(k3Hash(i), k3Hash(i + vec3(1, 0, 0)), f.x), mix(k3Hash(i + vec3(0, 1, 0)), k3Hash(i + vec3(1, 1, 0)), f.x), f.y),
              mix(mix(k3Hash(i + vec3(0, 0, 1)), k3Hash(i + vec3(1, 0, 1)), f.x), mix(k3Hash(i + vec3(0, 1, 1)), k3Hash(i + vec3(1, 1, 1)), f.x), f.y),
              f.z);
          }

          float k3DarkMask() {
            vec2 p = gl_FragCoord.xy / uViewport.z;
            p.y = uViewport.y - p.y;
            float d = distance(p, uCurtain.xy);
            return 1.0 - smoothstep(uCurtain.z - 1.5, uCurtain.z + 1.5, d);
          }`
        )
        .replace(
          '#include <color_fragment>',
          /* glsl */ `#include <color_fragment>
          float k3Dark = k3DarkMask();
          diffuseColor.rgb = mix(uColorOnRed, uColorOnDark, k3Dark);

          // Dissolution « liquide » : front qui part du curseur, bord bruité
          float k3Edge = 0.0;
          if (uDissolve > 0.0) {
            vec3 q = vK3Pos * 2.4 + vec3(0.0, uTime * 0.35, 0.0);
            float k3Field = distance(vK3Pos, uHit) * 0.3 + (k3Noise(q) * 0.65 + k3Noise(q * 2.3) * 0.35) * 0.45;
            float k3Cut = uDissolve * 1.55 - 0.08;
            if (k3Field < k3Cut) discard;
            k3Edge = 1.0 - smoothstep(0.0, 0.07, k3Field - k3Cut);
          }`
        )
        .replace(
          '#include <roughnessmap_fragment>',
          /* glsl */ `#include <roughnessmap_fragment>
          roughnessFactor = mix(0.19, 0.3, k3Dark);`
        )
        .replace(
          '#include <emissivemap_fragment>',
          /* glsl */ `#include <emissivemap_fragment>
          float k3Fresnel = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 3.5);
          totalEmissiveRadiance += mix(uRimOnRed, uRimOnDark, k3Dark) * k3Fresnel;
          totalEmissiveRadiance += vec3(1.0, 0.92, 0.95) * k3Edge * 2.2;`
        )
    }
    material.customProgramCacheKey = () => 'k3-contrast'

    return { material, uniforms }
  }, [])
}

const damp = THREE.MathUtils.damp
const target = { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 0 }
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

export default function K3Model() {
  const { nodes } = useGLTF(MODEL_URL)
  const group = useRef()
  const mesh = useRef()
  const glass = useRef()
  const glassState = useRef({ value: 0, hovered: false })
  const { material, uniforms } = useContrastMaterial()
  const viewport = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  const geometry = useMemo(() => {
    const source = Object.values(nodes).find((n) => n.isMesh)
    const g = source.geometry.clone()
    g.center()
    return g
  }, [nodes])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const { mouse, curtain } = store
    const g = group.current
    if (!g) return

    // Uniforms du shader de contraste
    uniforms.uCurtain.value.set(curtain.cx, curtain.cy, curtain.r)
    uniforms.uViewport.value.set(size.width, size.height, state.gl.getPixelRatio())
    uniforms.uTime.value = t

    // Keyframe courante, déduite de la position de scroll
    // (chorégraphie dédiée en portrait : voir KEYFRAMES_PORTRAIT)
    const portrait = viewport.aspect < 1
    sampleKeyframes(store.segments, target, portrait ? KEYFRAMES_PORTRAIT : KEYFRAMES)

    const base = (Math.min(viewport.width, viewport.height) * (portrait ? 0.55 : 0.44)) / 3.05
    const tx = target.x * viewport.width + mouse.x * viewport.width * 0.012
    const ty = target.y * viewport.height + Math.sin(t * 0.9) * viewport.height * 0.008 - mouse.y * viewport.height * 0.01
    const ts = target.s * base

    const k = 5
    g.position.x = damp(g.position.x, tx, k, delta)
    g.position.y = damp(g.position.y, ty, k, delta)
    g.scale.setScalar(damp(g.scale.x, ts, k, delta))
    g.rotation.x = damp(g.rotation.x, target.rx, k, delta)
    g.rotation.y = damp(g.rotation.y, target.ry, k, delta)
    g.rotation.z = damp(g.rotation.z, target.rz, k, delta)

    // Parallax souris + respiration, appliqués au mesh interne
    const m = mesh.current
    m.rotation.y = damp(m.rotation.y, mouse.x * 0.45, 3, delta)
    m.rotation.x = damp(m.rotation.x, -mouse.y * 0.3 + Math.sin(t * 0.6) * 0.05, 3, delta)
    m.rotation.z = Math.sin(t * 0.45) * 0.04

    // Liquid glass : uniquement au tout début du Hero, au survol du logo
    const gs = glassState.current
    const atHeroStart = window.scrollY < 4 && (store.segments[0]?.progress ?? 0) < 0.002
    let hovered = false
    if (canHover && atHeroStart) {
      pointer.set(mouse.x, -mouse.y)
      raycaster.setFromCamera(pointer, state.camera)
      const hit = raycaster.intersectObject(m, false)[0]
      hovered = !!hit
      if (hovered && !gs.hovered && gs.value < 0.05) {
        // Nouveau survol : on redessine le décor à réfracter et on part du point touché
        drawHeroBackdrop()
        uniforms.uHit.value.copy(m.worldToLocal(hit.point.clone()))
      }
    }
    gs.hovered = hovered
    gs.value = damp(gs.value, hovered ? 1 : 0, hovered ? 2.6 : 3.4, delta)
    if (gs.value < 0.002) gs.value = 0
    uniforms.uDissolve.value = gs.value
    if (glass.current) glass.current.visible = gs.value > 0
  })

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material}>
        {/* Version verre liquide, révélée quand la matière noire se dissout */}
        <mesh ref={glass} geometry={geometry} scale={0.996} visible={false}>
          <MeshTransmissionMaterial
            buffer={heroBackdrop}
            transmission={1}
            thickness={0.9}
            ior={1.32}
            roughness={0.02}
            chromaticAberration={1}
            anisotropicBlur={0.08}
            distortion={0.35}
            distortionScale={0.45}
            temporalDistortion={0.18}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={0.6}
            samples={8}
            color="#ffffff"
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>
    </group>
  )
}

useGLTF.preload(MODEL_URL)
