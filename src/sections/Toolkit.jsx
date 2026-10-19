import { useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, SCRAMBLE_CHARS } from '../lib/gsap'
import { toolkit } from '../data/content'
import { projects } from '../lib/projects'
import { normalize } from '../lib/project-model'
import { TransitionLink } from '../components/PageTransition'

const pad = (n) => String(n).padStart(2, '0')
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Domaines → outils → projets qui citent l'outil dans leur champ `tools`.
// Calculé une fois au montage : les projets sont chargés avant l'accueil.
function useDomains() {
  return useMemo(
    () =>
      toolkit.domains.map((d) => {
        const tools = d.tools.map((t) => {
          const keys = new Set([t.name, ...(t.aliases || [])].map(normalize))
          const used = projects.filter((p) => p.tools.some((pt) => keys.has(normalize(pt.name)))).map((p) => p.slug)
          return { ...t, used }
        })
        const slugs = new Set(tools.flatMap((t) => t.used))
        return { ...d, tools, projects: projects.filter((p) => slugs.has(p.slug)) }
      }),
    []
  )
}

export default function Toolkit() {
  const root = useRef()
  const domains = useDomains()
  const [open, setOpen] = useState(0)
  // Survol croisé : un outil allume ses projets, un projet allume ses outils
  const [lit, setLit] = useState(null) // { tool } | { slug } | null

  useGSAP(
    () => {
      const title = SplitText.create('.toolkit__title', { type: 'chars', mask: 'chars' })
      gsap.from(title.chars, {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.toolkit__intro, .domain', {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.toolkit__list', start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: root }
  )

  const toggle = (i) => {
    setLit(null)
    setOpen((o) => (o === i ? -1 : i))
    // Le nom du domaine ouvert se recompose (scramble), comme les titres du Hero
    const name = root.current.querySelectorAll('.domain__name')[i]
    if (name && open !== i && !reducedMotion()) {
      gsap.to(name, { duration: 0.7, scrambleText: { text: domains[i].title, chars: SCRAMBLE_CHARS, speed: 0.6 } })
    }
  }

  // La hauteur de la section change : les déclencheurs suivants (Projets, Contact,
  // chorégraphie 3D) sont recalculés une fois l'ouverture terminée
  const onPanelEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows') ScrollTrigger.refresh()
  }

  const toolLit = (t) => lit && (lit.tool ? lit.tool === t.name : t.used.includes(lit.slug))
  const projectLit = (p, d) => lit && (lit.slug ? lit.slug === p.slug : d.tools.find((t) => t.name === lit.tool)?.used.includes(p.slug))

  return (
    <section id="toolkit" className="toolkit" ref={root}>
      <header className="toolkit__head">
        <span className="eyebrow">(03) Compétences</span>
        <h2 className="toolkit__title">Toolkit</h2>
        <p className="toolkit__intro">{toolkit.intro}</p>
      </header>

      <ul className="toolkit__list">
        {domains.map((d, i) => {
          const isOpen = open === i
          const id = `domain-${i}`
          return (
            <li className={`domain ${isOpen ? 'is-open' : ''}`} key={d.title}>
              <h3 className="domain__heading">
                <button
                  className="domain__toggle"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => toggle(i)}
                  onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                  }}
                >
                  <span className="domain__glow" aria-hidden="true" />
                  <span className="domain__index">{pad(i + 1)}</span>
                  <span className="domain__name">{d.title}</span>
                  <span className="domain__count">
                    {d.tools.length} outils
                    {d.projects.length > 0 && ` · ${d.projects.length} projet${d.projects.length > 1 ? 's' : ''}`}
                  </span>
                  <span className="domain__icon" aria-hidden="true" />
                </button>
              </h3>

              <div className="domain__panel" id={id} role="region" aria-label={d.title} inert={!isOpen} onTransitionEnd={onPanelEnd}>
                <div className="domain__clip">
                  <div className="domain__body" onPointerLeave={() => setLit(null)}>
                    <div className="domain__about">
                      <p className="domain__text">{d.text}</p>
                      <ul className={`domain__tools ${lit ? 'is-filtering' : ''}`} aria-label={`Outils · ${d.title}`}>
                        {d.tools.map((t) => (
                          <li key={t.name}>
                            <button
                              type="button"
                              className={`tool ${t.logo ? '' : 'tool--text'} ${toolLit(t) ? 'is-lit' : ''}`}
                              aria-pressed={lit?.tool === t.name}
                              onPointerEnter={(e) => e.pointerType === 'mouse' && setLit({ tool: t.name })}
                              onFocus={() => setLit({ tool: t.name })}
                              onClick={() => setLit((l) => (l?.tool === t.name ? null : { tool: t.name }))}
                            >
                              {t.logo && <img src={t.logo} alt="" loading="lazy" draggable={false} />}
                              <span>{t.name}</span>
                              {t.used.length > 0 && <sup>{t.used.length}</sup>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {d.projects.length > 0 && (
                      <div className="domain__proof">
                        <span className="domain__label">Vu dans</span>
                        <ul className={`domain__projects ${lit ? 'is-filtering' : ''}`}>
                          {d.projects.map((p) => (
                            <li key={p.slug}>
                              <TransitionLink
                                className={`proof ${projectLit(p, d) ? 'is-lit' : ''}`}
                                to={`/projets/${p.slug}`}
                                onPointerEnter={(e) => e.pointerType === 'mouse' && setLit({ slug: p.slug })}
                                onFocus={() => setLit({ slug: p.slug })}
                                onClick={() => window.history.replaceState(window.history.state, '', '/#toolkit')}
                              >
                                <span className="proof__name">{p.title}</span>
                                <span className="proof__arrow" aria-hidden="true">
                                  ↗
                                </span>
                              </TransitionLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
