import { gsap, ScrollTrigger } from './gsap'
import { store, computeCurtain } from './store'
import { SEGMENTS } from '../three/keyframes'

// Orchestration globale du scrollytelling.
// Appelé une fois que toutes les sections ont créé leurs propres
// ScrollTriggers (pins), pour que les positions tiennent compte des pin-spacers.
export function createStory({ bg, curtain, webgl }) {
  const ctx = gsap.context(() => {
    // 1 · Transition de fond Rouge → Noir profond, scrubée au scroll.
    //     Le fond se fond progressivement pendant qu'un rideau noir
    //     circulaire (masking) monte depuis le bas de l'écran.
    gsap.to(bg, {
      backgroundColor: '#0D0D0D',
      '--blob-opacity': 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: '#parcours',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    })

    const curtainST = ScrollTrigger.create({
      trigger: '#parcours',
      start: 'top bottom',
      end: 'top top',
    })

    // 2 · Le canvas passe derrière le contenu une fois le Hero quitté
    //     (dans le Hero, l'objet flotte devant le titre géant).
    ScrollTrigger.create({
      trigger: '#parcours',
      start: 'top top',
      onEnter: () => webgl.classList.add('is-behind'),
      onLeaveBack: () => webgl.classList.remove('is-behind'),
    })

    // 3 · Segments de la chorégraphie 3D (lus dans useFrame).
    store.segments = SEGMENTS.map((s) =>
      ScrollTrigger.create({ trigger: s.trigger, start: s.start, end: s.end, invalidateOnRefresh: true })
    )

    // 4 · Le rideau est recalculé à chaque tick : clip-path CSS + uniforms du shader.
    //     La taille du rideau (plein écran) n'est lue qu'au redimensionnement :
    //     lire clientWidth à chaque image, juste après avoir écrit le clip-path,
    //     forçait un recalcul de style/mise en page synchrone.
    //     Rien n'est recalculé tant que la progression et la taille ne changent pas.
    let w = curtain.clientWidth
    let h = curtain.clientHeight
    const ro = new ResizeObserver(() => {
      w = curtain.clientWidth
      h = curtain.clientHeight
    })
    ro.observe(curtain)
    let last = ''
    let lastKey = ''
    let covered = false
    const tick = () => {
      const p = curtainST.progress
      const key = `${p}|${w}|${h}`
      if (key === lastKey) return
      lastKey = key
      const c = computeCurtain(p, w, h)
      Object.assign(store.curtain, c)
      const clip = `circle(${c.r.toFixed(1)}px at ${c.cx.toFixed(1)}px ${c.cy.toFixed(1)}px)`
      if (clip !== last) {
        curtain.style.clipPath = clip
        last = clip
      }
      // Rideau entièrement monté : le fond rouge et ses halos animés sont
      // cachés dessous (et déjà fondus au noir) ; on cesse de les dessiner
      const full = p >= 1
      if (full !== covered) {
        covered = full
        bg.classList.toggle('is-covered', full)
      }
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      bg.classList.remove('is-covered')
    }
  })

  ScrollTrigger.refresh()

  return () => ctx.revert()
}
