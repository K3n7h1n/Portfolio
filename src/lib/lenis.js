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

export function scrollToSection(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}
