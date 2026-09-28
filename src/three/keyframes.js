// Chorégraphie de l'objet 3D au fil de l'histoire.
// x / y : fraction de la largeur / hauteur visible (0 = centre)
// s     : échelle relative   rx / ry / rz : rotations en radians
import { ScrollTrigger } from '../lib/gsap'

const TAU = Math.PI * 2

export const KEYFRAMES = [
  /* 0 · Hero, au chargement   */ { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 0 },
  /* 1 · Hero, fin du pin      */ { x: 0.01, y: 0, s: 0.62, rx: 0.2, ry: TAU, rz: -0.35 },
  /* 2 · Rideau noir monté     */ { x: 0.27, y: -0.2, s: 0.6, rx: -0.25, ry: TAU + 0.5, rz: 0 },
  /* 3 · Parcours, fin         */ { x: -0.3, y: -0.2, s: 0.6, rx: -0.25, ry: TAU + 0.5, rz: TAU * 1.5 },
  /* 4 · Toolkit, arrivée      */ { x: 0, y: 0.04, s: 0.62, rx: 0.2, ry: TAU * 2, rz: TAU * 2 },
  /* 5 · Toolkit, fin du deck  */ { x: 0, y: 0.04, s: 0.62, rx: 0.2, ry: TAU * 3, rz: TAU * 2 },
  /* 6 · Projets, arrivée      */ { x: 0.36, y: 0, s: 0.9, rx: 0.15, ry: TAU * 3 + 0.7, rz: TAU * 2 + 0.25 },
  /* 7 · Projets, fin          */ { x: 0.36, y: -0.04, s: 0.9, rx: 0.3, ry: TAU * 4 + 0.7, rz: TAU * 2 + 0.25 },
  /* 8 · Contact, arrivée      */ { x: 0, y: 0.05, s: 0.46, rx: 0, ry: TAU * 5, rz: TAU * 2 },
  /* 9 · Contact, fin          */ { x: 0, y: 0.05, s: 0.48, rx: 0.1, ry: TAU * 5 + 0.3, rz: TAU * 2 },
]

// Écrans en portrait (téléphones, tablettes debout) : mêmes rotations,
// mais position / échelle revues pour que l'objet ne masque pas les titres
// (dans le Hero il passe sous le nom, au Contact il monte au-dessus des courbes).
export const KEYFRAMES_PORTRAIT = KEYFRAMES.map((k, i) => ({
  ...k,
  ...[
    /* 0 */ { x: 0, y: -0.2, s: 0.78 },
    /* 1 */ { x: 0, y: 0, s: 0.55 },
    /* 2 */ { x: 0.16, y: -0.21, s: 0.5 },
    /* 3 */ { x: -0.18, y: -0.21, s: 0.5 },
    /* 4 */ { x: 0, y: 0.04, s: 0.55 },
    /* 5 */ { x: 0, y: 0.04, s: 0.55 },
    /* 6 */ { x: 0.26, y: -0.08, s: 0.55 },
    /* 7 */ { x: 0.26, y: -0.12, s: 0.55 },
    /* 8 */ { x: 0, y: 0.33, s: 0.38 },
    /* 9 */ { x: 0, y: 0.33, s: 0.4 },
  ][i],
}))

const pinEnd = (id) => () => {
  const st = ScrollTrigger.getById(id)
  return st ? st.end : 'bottom top'
}

// Un segment = une portion de scroll qui interpole KEYFRAMES[i] → [i + 1].
export const SEGMENTS = [
  { trigger: '#hero', start: 'top top', end: pinEnd('hero-pin') },
  { trigger: '#parcours', start: 'top bottom', end: 'top top' },
  { trigger: '#parcours', start: 'top top', end: pinEnd('parcours-pin') },
  { trigger: '#toolkit', start: 'top bottom', end: 'top top' },
  { trigger: '#toolkit', start: 'top top', end: pinEnd('toolkit-pin') },
  { trigger: '#projects', start: 'top bottom', end: 'top 30%' },
  { trigger: '#projects', start: 'top 30%', end: 'bottom bottom' },
  { trigger: '#contact', start: 'top bottom', end: 'top top' },
  { trigger: '#contact', start: 'top top', end: pinEnd('contact-pin') },
]

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const KEYS = ['x', 'y', 's', 'rx', 'ry', 'rz']

// Replie les segments dans l'ordre : chaque segment terminé amène
// l'état à la keyframe suivante, le segment en cours interpole.
export function sampleKeyframes(segments, out, frames = KEYFRAMES) {
  for (const k of KEYS) out[k] = frames[0][k]
  for (let i = 0; i < segments.length; i++) {
    const p = ease(segments[i].progress)
    if (p === 0) continue
    const to = frames[i + 1]
    for (const k of KEYS) out[k] += (to[k] - out[k]) * p
  }
  return out
}
