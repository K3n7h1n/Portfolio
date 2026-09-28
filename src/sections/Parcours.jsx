import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { parcours } from '../data/content'

export default function Parcours() {
  const root = useRef()

  useGSAP(
    () => {
      const track = root.current.querySelector('.parcours__track')
      const distance = () => track.scrollWidth - window.innerWidth

      // Défilement horizontal piloté par le scroll vertical
      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'parcours-pin',
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      const sameRange = {
        trigger: root.current,
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: true,
        invalidateOnRefresh: true,
      }
      // Texte fantôme en arrière-plan : parallax plus lente
      gsap.to('.parcours__ghost', { xPercent: -35, ease: 'none', scrollTrigger: sameRange })
      gsap.to('.parcours__progress span', { scaleX: 1, ease: 'none', scrollTrigger: sameRange })

      // Titre d'intro : mot par mot quand la section monte
      const title = SplitText.create('.parcours__title', { type: 'words', mask: 'words' })
      gsap.from(title.words, {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 55%', toggleActions: 'play none none reverse' },
      })

      // Chaque étape se révèle quand elle entre dans l'écran (horizontalement)
      gsap.utils.toArray('.step', root.current).forEach((step) => {
        const year = step.querySelector('.step__year')
        const st = {
          trigger: step,
          containerAnimation: horizontal,
          start: 'left 82%',
          toggleActions: 'play none none reverse',
        }
        gsap.from(year, {
          duration: 1.1,
          scrambleText: { text: '0000', chars: '0123456789', speed: 0.5 },
          scrollTrigger: st,
        })
        gsap.from(step.querySelectorAll('.reveal'), {
          yPercent: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: st,
        })
      })
    },
    { scope: root }
  )

  return (
    <section id="parcours" className="parcours" ref={root}>
      <p className="parcours__ghost" aria-hidden="true">
        trajectoire · trajectoire · trajectoire ·
      </p>

      <div className="parcours__track">
        <div className="parcours__intro">
          <span className="eyebrow">(02) Trajectoire</span>
          <h2 className="parcours__title">
            Mon parcours<span className="red">…</span>
          </h2>
          <p className="parcours__lead">{parcours.intro}</p>
        </div>

        {parcours.steps.map((step) => (
          <article className="step" key={step.year}>
            <span className="step__year">{step.year}</span>
            <h3 className="step__title reveal">{step.title}</h3>
            <p className="step__text reveal">{step.text}</p>
          </article>
        ))}

        <div className="parcours__outro">
          <p>
            {parcours.outro[0]}
            <br />
            <span className="red">{parcours.outro[1]}</span>
          </p>
        </div>
      </div>

      <div className="parcours__progress" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
