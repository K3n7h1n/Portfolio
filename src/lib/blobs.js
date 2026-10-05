// ─────────────────────────────────────────────────────────────
//  Halos du fond (.bg__blob) : flou « précalculé ».
//  En CSS, `filter: blur(100px)` sur trois calques animés de 50-60vw
//  oblige le GPU à recalculer trois grands flous à chaque image
//  (le canvas 3D se redessine en continu), ce qui coûte cher sur les
//  GPU intégrés. Le résultat du flou ne change pourtant pas : seul le
//  calque bouge (transform). On dessine donc une fois le disque flouté
//  dans un <canvas> (même moteur de flou que le CSS), inséré dans le
//  blob ; le filtre CSS est retiré. L'animation (transform), l'opacité
//  et le rognage par .bg restent strictement les mêmes.
//  Sans support de ctx.filter (anciens Safari), le filtre CSS est conservé.
// ─────────────────────────────────────────────────────────────

// Résolution du bitmap par rapport aux px CSS : un flou de 100px ne contient
// aucun détail fin, la moitié suffit (l'agrandissement bilinéaire est invisible)
const SCALE = 0.5

function supportsCanvasFilter() {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx || !('filter' in ctx)) return false
  ctx.filter = 'blur(2px)'
  return ctx.filter === 'blur(2px)'
}

function bake(el) {
  // Rayon du flou lu dans la feuille de style (mémorisé : il est retiré ensuite)
  if (!el.dataset.blur) {
    const m = /blur\(([\d.]+)px\)/.exec(getComputedStyle(el).filter)
    if (!m) return
    el.dataset.blur = m[1]
  }
  const sigma = parseFloat(el.dataset.blur)
  const size = el.offsetWidth // indépendant du transform animé
  const color = getComputedStyle(el).backgroundColor
  if (!size) return

  // Marge de 3σ autour du disque : c'est l'étendue du flou CSS
  const pad = Math.ceil(sigma * 3)
  const full = size + pad * 2
  const px = Math.max(1, Math.round(full * SCALE))
  const k = px / full

  const canvas = el.querySelector('canvas') || document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, px, px)
  ctx.filter = `blur(${sigma * k}px)`
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(px / 2, px / 2, (size / 2) * k, 0, Math.PI * 2)
  ctx.fill()

  if (!canvas.parentNode) {
    // Taille en % + px : reste juste pendant un redimensionnement, avant le recalcul
    Object.assign(canvas.style, {
      position: 'absolute',
      left: `${-pad}px`,
      top: `${-pad}px`,
      width: `calc(100% + ${pad * 2}px)`,
      height: `calc(100% + ${pad * 2}px)`,
      pointerEvents: 'none',
    })
    canvas.setAttribute('aria-hidden', 'true')
    el.appendChild(canvas)
  }
  el.classList.add('is-baked')
}

export function bakeBlobs(bg) {
  if (!bg || !supportsCanvasFilter()) return () => {}
  const blobs = [...bg.querySelectorAll('.bg__blob')]
  const run = () => blobs.forEach(bake)

  // Hors du chemin critique : le flou CSS reste affiché jusqu'au remplacement,
  // qui est visuellement identique
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200))
  const cancelIdle = window.cancelIdleCallback || clearTimeout
  let id = idle(run, { timeout: 1500 })

  let timer
  let width = window.innerWidth
  let height = window.innerHeight
  const onResize = () => {
    if (window.innerWidth === width && window.innerHeight === height) return
    width = window.innerWidth
    height = window.innerHeight
    clearTimeout(timer)
    timer = setTimeout(run, 150)
  }
  window.addEventListener('resize', onResize)

  return () => {
    cancelIdle(id)
    clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    blobs.forEach((el) => {
      el.querySelector('canvas')?.remove()
      el.classList.remove('is-baked')
    })
  }
}
