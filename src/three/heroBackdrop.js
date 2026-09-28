import * as THREE from 'three'

// Le canvas WebGL ne peut pas « voir » le DOM qui est derrière lui.
// Pour que le verre réfracte le titre du Hero, on redessine ce qui se
// trouve derrière l'objet (fond rouge + halos + lettres) dans un canvas 2D,
// aligné pixel pour pixel sur l'écran. Cette texture sert de « buffer »
// au MeshTransmissionMaterial.
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export const heroBackdrop = new THREE.CanvasTexture(canvas)
heroBackdrop.colorSpace = THREE.SRGBColorSpace

export function drawHeroBackdrop() {
  const w = window.innerWidth
  const h = window.innerHeight
  const s = Math.min(window.devicePixelRatio, 1.5)
  canvas.width = Math.round(w * s)
  canvas.height = Math.round(h * s)
  ctx.setTransform(s, 0, 0, s, 0, 0)

  // Fond : la couleur courante du calque .bg + ses halos flous
  const bg = document.querySelector('.bg')
  ctx.fillStyle = bg ? getComputedStyle(bg).backgroundColor : '#ff0000'
  ctx.fillRect(0, 0, w, h)
  document.querySelectorAll('.bg__blob').forEach((blob) => {
    const r = blob.getBoundingClientRect()
    const cs = getComputedStyle(blob)
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r.width * 0.65)
    g.addColorStop(0, cs.backgroundColor)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = parseFloat(cs.opacity) || 0
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
  ctx.globalAlpha = 1

  // Lettres du titre, placées sur leur position réelle à l'écran
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  document.querySelectorAll('.hero__giant .char').forEach((c) => {
    const inner = c.firstElementChild
    if (!inner || parseFloat(getComputedStyle(c).opacity) < 0.5) return
    const cs = getComputedStyle(c)
    const size = parseFloat(cs.fontSize)
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const m = ctx.measureText(inner.textContent)
    const r = c.getBoundingClientRect()
    // Position de la ligne de base dans une boîte inline-block (demi-interlignage CSS)
    const lineHeight = parseFloat(cs.lineHeight) || size
    const baseline = r.top + (lineHeight - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent
    ctx.fillText(inner.textContent, r.left, baseline)
  })

  heroBackdrop.needsUpdate = true
}
