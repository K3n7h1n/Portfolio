import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

export let lenis = null

// Smooth scroll : Lenis est piloté par le ticker GSAP pour que
// ScrollTrigger et le scroll lissé partagent exactement la même frame.
export function initLenis() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    lerp: reduced ? 1 : 0.09,
    wheelMultiplier: 1,
    smoothWheel: !reduced,
  })

  lenis.on('scroll', ScrollTrigger.update)
  if (import.meta.env.DEV) window.lenis = lenis

  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

// Position de départ d'une section, en px depuis le haut du document.
// On ne peut pas se fier à getBoundingClientRect() d'une section épinglée :
// une fois son pin dépassé, GSAP la décale en bas de son pin-spacer (fin du pin),
// et pendant le pin elle est en position fixe (top = 0). On lit donc le `start`
// de son ScrollTrigger de pin, ou à défaut le haut de son pin-spacer.
export function sectionTop(target) {
  if (typeof target === 'number') return target
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return null
  const pin = ScrollTrigger.getAll().find((st) => st.pin === el)
  if (pin) return pin.start
  const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
  return box.getBoundingClientRect().top + window.scrollY
}

export function scrollToSection(target) {
  const y = sectionTop(target)
  if (y == null) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (lenis) lenis.scrollTo(y, reduced ? { immediate: true } : { duration: 1.6 })
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
}
