import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsap'
import { initLenis, lenis, sectionTop } from './lib/lenis'
import { createStory } from './lib/story'
import { store } from './lib/store'
import { loadProjects } from './lib/projects'
import Experience from './three/Experience'
import Nav, { SECTIONS } from './components/Nav'
import Hero from './sections/Hero'
import Parcours from './sections/Parcours'
import Toolkit from './sections/Toolkit'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import ProjectPage from './pages/ProjectPage'
import { PageTransition } from './components/PageTransition'
import Logo from './components/Logo'

const HOME_TITLE = 'Enzo Locatelli · K3nshin · Portfolio'

// Démarre la requête des projets dès le chargement du module, sans attendre React
loadProjects()

// Le site n'est monté qu'une fois les polices prêtes (SplitText mesure les lettres)
// et les projets chargés (les pins de l'accueil dépendent de la hauteur de la liste).
// Le loader « K3 » reste affiché pendant ce temps (au pire 5 s avant le repli local).
function useAppReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const fonts = ['500 1em "K3 Typo"', '500 1em "Instrument Sans Variable"']
    Promise.allSettled([...fonts.map((f) => document.fonts.load(f)), loadProjects()]).then(() => setReady(true))
  }, [])
  return ready
}

function Site({ layers }) {
  const [active, setActive] = useState('hero')
  const { hash } = useLocation()

  // Les sections (enfants) ont déjà créé leurs pins quand cet effet s'exécute :
  // les ScrollTriggers globaux sont donc calculés avec les bons pin-spacers.
  useLayoutEffect(() => {
    const stopLenis = initLenis()
    const stopStory = createStory(layers)

    const sections = SECTIONS.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActive(id),
      })
    )

    const onMouse = (e) => {
      store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      store.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMouse)

    // Retour depuis une page projet (/#projects) : on se place directement
    // sur la section, une fois les pin-spacers en place (refresh fait par createStory)
    const target = hash && document.getElementById(hash.slice(1))
    if (target) {
      lenis.scrollTo(sectionTop(target), { immediate: true, force: true })
      ScrollTrigger.update()
    }

    return () => {
      window.removeEventListener('pointermove', onMouse)
      sections.forEach((s) => s.kill())
      stopStory()
      stopLenis()
    }
  }, [layers]) // le hash n'est lu qu'au montage

  return (
    <>
      <Nav active={active} />
      <main className="story">
        <Hero />
        <Parcours />
        <Toolkit />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

// Page d'accueil : calques fixes (fond, rideau, canvas 3D) + sections.
// Tout est démonté en quittant la page, puis recréé au retour.
function Home() {
  const bg = useRef()
  const curtain = useRef()
  const webgl = useRef()
  const [layers, setLayers] = useState(null)

  useLayoutEffect(() => {
    document.title = HOME_TITLE
    window.scrollTo(0, 0)
    setLayers({ bg: bg.current, curtain: curtain.current, webgl: webgl.current })
  }, [])

  return (
    <>
      {/* Calques fixes : fond rouge → rideau noir → canvas 3D */}
      <div className="bg" ref={bg}>
        <div className="bg__blob bg__blob--a" />
        <div className="bg__blob bg__blob--b" />
        <div className="bg__blob bg__blob--c" />
      </div>
      <div className="curtain" ref={curtain} />
      <Experience ref={webgl} />

      {layers && <Site layers={layers} />}
    </>
  )
}

export default function App() {
  const ready = useAppReady()

  return (
    <PageTransition>
      {ready && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projets/:slug" element={<ProjectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      <div className="grain" aria-hidden="true" />
      <div className={`loader ${ready ? 'is-done' : ''}`} aria-hidden="true">
        <span>
          <Logo />
        </span>
      </div>
    </PageTransition>
  )
}
