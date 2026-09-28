import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { projects } from '../lib/projects'
import { TransitionLink } from '../components/PageTransition'

// Curseur « Voir » : petite pastille rouge qui remplace le pointeur au survol
// de la liste (souris uniquement, voir global.css). Les couvertures des projets
// restent dans les données : elles ne sont simplement plus affichées ici.
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Projects() {
  const root = useRef()
  const preview = useRef()
  const [active, setActive] = useState(0)

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0 })

      gsap.from('.project', {
        yPercent: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.projects__list', start: 'top 85%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.projects__title', {
        yPercent: 100,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: root }
  )

  // Pastille qui suit le curseur avec un léger lissage (immédiate si mouvement réduit)
  const follow = useRef(null)
  const onMove = contextSafe((e) => {
    if (!follow.current) {
      const duration = reducedMotion() ? 0 : 0.35
      follow.current = {
        x: gsap.quickTo(preview.current, 'x', { duration, ease: 'power3' }),
        y: gsap.quickTo(preview.current, 'y', { duration, ease: 'power3' }),
      }
      gsap.set(preview.current, { x: e.clientX, y: e.clientY })
    }
    follow.current.x(e.clientX)
    follow.current.y(e.clientY)

    const row = e.target.closest('.project__link')
    if (row) {
      const r = row.getBoundingClientRect()
      row.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    }
  })
  // L'entrée d'historique de l'accueil pointe sur #projects :
  // le bouton « retour » du navigateur ramène donc à la liste.
  const rememberSection = () => window.history.replaceState(window.history.state, '', '/#projects')

  // Pas de pastille si la liste est vide ou sur écran tactile
  const show = contextSafe(
    (v) =>
      projects.length &&
      finePointer() &&
      gsap.to(preview.current, { scale: v ? 1 : 0, duration: reducedMotion() ? 0 : 0.45, ease: 'expo.out' })
  )

  return (
    <section id="projects" className="projects" ref={root}>
      <header className="projects__head">
        <span className="eyebrow">(04) Réalisations</span>
        <div className="projects__titlewrap">
          <h2 className="projects__title">
            Projets<sup>({String(projects.length).padStart(2, '0')})</sup>
          </h2>
        </div>
      </header>

      <ul className="projects__list" onPointerMove={onMove} onPointerEnter={() => show(true)} onPointerLeave={() => show(false)}>
        {projects.length === 0 && <li className="project project--empty">Projets bientôt en ligne.</li>}
        {projects.map((p, i) => (
          <li className="project" key={p.slug} onPointerEnter={() => setActive(i)}>
            <TransitionLink className="project__link" to={`/projets/${p.slug}`} onClick={rememberSection}>
              <span className="project__glow" aria-hidden="true" />
              <span className="project__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project__title">
                <span className="project__name">{p.title}</span>
                <span className="project__cat">{p.category}</span>
              </span>
              <span className="project__tag">{p.tag}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      <div className="preview" ref={preview} aria-hidden="true">
        <span className="preview__index">{String(active + 1).padStart(2, '0')}</span>
        <span className="preview__label">Voir</span>
        <span className="preview__arrow">↗</span>
      </div>
    </section>
  )
}
