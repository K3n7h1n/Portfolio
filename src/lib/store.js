// État partagé entre le DOM (GSAP/ScrollTrigger) et la scène Three.js.
// Volontairement mutable et hors React : il est lu à chaque frame
// dans useFrame, sans provoquer de re-render.
export const store = {
  mouse: { x: 0, y: 0 }, // -1 → 1
  // Rideau noir circulaire qui monte sur le fond rouge (en px CSS).
  curtain: { p: 0, cx: 0, cy: 0, r: 0 },
  // ScrollTriggers « segments » : chacun fait passer l'objet 3D
  // d'une keyframe à la suivante (voir three/keyframes.js).
  segments: [],
}

// Géométrie du rideau : un grand cercle dont le centre remonte.
// p = 0 → sous l'écran, p = 1 → couvre tout le viewport.
// La même fonction alimente le clip-path CSS et le shader de l'objet,
// ce qui garantit que la bascule noir/blanc tombe pile sur le bord.
export function computeCurtain(p, w, h) {
  const r = Math.max(w, h) * 1.25
  const from = h + r
  const to = Math.sqrt(Math.max(r * r - (w * w) / 4, 0)) - 4
  return { p, cx: w / 2, cy: from + (to - from) * p, r }
}
