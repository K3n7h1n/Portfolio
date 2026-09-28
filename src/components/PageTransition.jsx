import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { lenis } from '../lib/lenis'
import Logo from './Logo'

// Transition entre les pages : un rideau rouge monte et recouvre l'écran,
// la route change pendant qu'il est fermé, puis il se retire vers le haut.
const TransitionContext = createContext(null)

export function PageTransition({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const veil = useRef()
  const busy = useRef(false)
  const pending = useRef(false)

  const go = useCallback(
    (to) => {
      if (busy.current) return
      busy.current = true
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap
        .timeline()
        .set(veil.current, { visibility: 'visible', y: 0, yPercent: 100 })
        .to(veil.current, { yPercent: 0, duration: reduced ? 0.01 : 0.75, ease: 'expo.inOut' })
        .add(() => {
          // Écran couvert : on repart du haut avant de changer de page
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
          else window.scrollTo(0, 0)
          pending.current = true
          navigate(to)
        })
    },
    [navigate]
  )

  // Nouvelle page montée (ses ScrollTriggers sont calculés) : le rideau se retire
  useEffect(() => {
    if (!pending.current) return
    pending.current = false
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        gsap.to(veil.current, {
          yPercent: -100,
          duration: 0.85,
          delay: 0.1,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(veil.current, { visibility: 'hidden' })
            busy.current = false
          },
        })
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [location])

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div className="veil" ref={veil} aria-hidden="true">
        <span className="veil__brand">
          <Logo />
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)

// Vrai lien <a href> (accessible, ouvrable dans un nouvel onglet) ;
// un clic simple passe par la transition.
export function TransitionLink({ to, onClick, ...props }) {
  const go = usePageTransition()
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || props.target) return
    e.preventDefault()
    go(to)
  }
  return <Link to={to} onClick={handle} {...props} />
}
