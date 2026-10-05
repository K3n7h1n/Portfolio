import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { contact, identity } from '../data/content'

// Courbes serpentines : elles se prolongent loin à gauche de l'écran
// pour que le texte puisse y « glisser » sans jamais manquer de chemin.
const PATH_A = 'M-3200,380 C-2800,140 -2400,620 -2000,380 S-1200,140 -800,380 S-200,640 200,470 S760,40 1120,250 S1560,560 1900,420'
const PATH_B = 'M-3200,700 C-2800,900 -2400,460 -2000,700 S-1200,900 -800,700 S-150,420 260,640 S820,900 1140,660 S1560,380 1900,560'

// Longueur d'arc (multiple de 8) à laquelle le chemin franchit une abscisse donnée.
// Les courbes avancent toujours vers la droite (x croissant le long du tracé) :
// une recherche dichotomique sur les pas de 8 donne exactement le même résultat
// que le parcours pas à pas (~800 appels à getPointAtLength → ~12).
function lengthAtX(path, x) {
  const total = path.getTotalLength()
  let lo = 0
  let hi = Math.floor(total / 8)
  if (path.getPointAtLength(hi * 8).x < x) return total
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (path.getPointAtLength(mid * 8).x >= x) hi = mid
    else lo = mid + 1
  }
  return lo * 8
}

export default function Contact() {
  const root = useRef()
  const magnet = useRef()

  const { contextSafe } = useGSAP(
    () => {
      const [pathA, pathB] = root.current.querySelectorAll('.curve__path')
      const [textA, textB] = root.current.querySelectorAll('.curve__text')
      const [tpA, tpB] = root.current.querySelectorAll('textPath')

      // Ligne A : entre par la droite et serpente vers la gauche
      const rightA = lengthAtX(pathA, 1440)
      const lenA = textA.getComputedTextLength()
      // Ligne B : défile en sens inverse
      const leftB = lengthAtX(pathB, 0)
      const lenB = textB.getComputedTextLength()

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'contact-pin',
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.4,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      tl.fromTo(tpA, { attr: { startOffset: rightA - lenA * 0.12 } }, { attr: { startOffset: Math.max(rightA - lenA * 0.62, 0) } }, 0)
      tl.fromTo(tpB, { attr: { startOffset: Math.max(leftB - lenB * 0.75, 0) } }, { attr: { startOffset: leftB - lenB * 0.3 } }, 0)

      // Entrée : les courbes glissent depuis le bas pendant l'arrivée de la section
      gsap.fromTo(
        tpA,
        { attr: { startOffset: rightA + 200 } },
        {
          attr: { startOffset: rightA - lenA * 0.12 },
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true },
        }
      )
      // Animations CSS du bouton (vibration, ondes) en pause tant que la
      // section n'est pas à l'écran (voir .contact:not(.is-inview) dans global.css)
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'max',
        toggleClass: { targets: root.current, className: 'is-inview' },
      })

      gsap.from('.cta-wrap', {
        scale: 0,
        rotation: -90,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 40%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: root }
  )

  // Bouton magnétique
  const onMove = contextSafe((e) => {
    const r = magnet.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    gsap.to(magnet.current.firstChild, { x: dx * 0.35, y: dy * 0.35, duration: 0.6, ease: 'power3.out' })
  })
  const onLeave = contextSafe(() => {
    gsap.to(magnet.current.firstChild, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' })
  })

  return (
    <section id="contact" className="contact" ref={root}>
      <span className="eyebrow contact__eyebrow">(05) La suite</span>

      <svg className="contact__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path id="curve-a" className="curve__path" d={PATH_A} />
        <path id="curve-b" className="curve__path" d={PATH_B} />
        <text className="curve__text curve__text--a">
          <textPath href="#curve-a" startOffset="0">{contact.curveA.repeat(3)}</textPath>
        </text>
        <text className="curve__text curve__text--b">
          <textPath href="#curve-b" startOffset="0">{contact.curveB.repeat(6)}</textPath>
        </text>
      </svg>

      <div className="cta-wrap" ref={magnet} onPointerMove={onMove} onPointerLeave={onLeave}>
        <a className="cta" href={`mailto:${identity.email}`}>
          <span className="cta__disc" aria-hidden="true" />
          <span className="cta__label">
            {contact.cta[0]}-{contact.cta[1]} <span className="cta__arrow">↗</span>
          </span>
        </a>
      </div>

      <footer className="contact__footer">
        <a href={`mailto:${identity.email}`}>{identity.email}</a>
        <nav className="contact__socials">
          {contact.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
        <span>
          © {identity.year} {identity.name.join(' ')} · {identity.alias}
        </span>
      </footer>
    </section>
  )
}
