import { useRef } from 'react'
import { gsap, SplitText, useGSAP, SCRAMBLE_CHARS } from '../lib/gsap'
import { toolkit } from '../data/content'
import Logo from '../components/Logo'

export default function Toolkit() {
  const root = useRef()
  const { cards, groups, splitAt } = toolkit
  // cards est dans l'ordre de dévoilement : on l'inverse pour la disposition
  // (gauche → droite), la carte signature finit à droite, au sommet du paquet
  const deck = [...cards].reverse()

  useGSAP(
    () => {
      const slots = gsap.utils.toArray('.deck__slot', root.current)
      const n = slots.length

      // Positions de l'éventail (arc convexe + perspective)
      const fan = (i) => {
        const t = i / (n - 1) - 0.5 // -0.5 → 0.5
        const vw = window.innerWidth
        const small = vw < 768
        // Sur mobile, l'éventail tient dans l'écran : les cartes des bords
        // (largeur + rotation) ne sont plus coupées par le bord du viewport.
        const spread = small ? Math.min(vw * 0.78, vw - slots[0].offsetWidth * 1.35) : Math.min(vw * 0.72, 1250)
        return {
          x: t * spread,
          y: t * t * (small ? 120 : 200),
          rotation: t * 34,
          rotationY: t * -30,
        }
      }

      // Paquet empilé au centre : le dernier slot (signature) est au-dessus
      slots.forEach((s, i) => {
        gsap.set(s, {
          zIndex: i,
          x: gsap.utils.random(-6, 6),
          y: (n - i) * -2 + 30,
          rotation: gsap.utils.random(-5, 5),
          rotationY: 0,
        })
      })

      const title = SplitText.create('.toolkit__title', { type: 'chars', mask: 'chars' })
      gsap.from(title.chars, {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 60%', toggleActions: 'play none none reverse' },
      })

      // Deck of cards : épinglé, les cartes se dévoilent une par une au scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'toolkit-pin',
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.8,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      const sub = root.current.querySelector('.toolkit__sub')
      // Dévoilement de droite à gauche : du sommet du paquet vers le bas
      for (let i = n - 1; i >= 0; i--) {
        const step = n - 1 - i // rang dans toolkit.cards
        const at = step * 0.45
        // Valeurs fonctionnelles : recalculées au refresh (rotation, redimensionnement)
        tl.to(slots[i], { x: () => fan(i).x, y: () => fan(i).y, rotation: fan(i).rotation, rotationY: fan(i).rotationY, duration: 1, ease: 'power3.inOut' }, at)
        // Bascule du sous-titre sur le premier outil « dev »
        if (step === splitAt) {
          tl.to(sub, { duration: 0.6, scrambleText: { text: groups[1], chars: SCRAMBLE_CHARS } }, at)
        }
      }
      tl.to({}, { duration: 0.4 })

      // ─── Survol des cartes (géré en JS, une seule carte active) ───
      // Le slot (animé par l'éventail) ne bouge pas au survol et sert de zone
      // de hit ; la carte à l'intérieur (pointer-events: none) se soulève et
      // s'incline via GSAP. Le z-index de la carte qui redescend reste élevé
      // jusqu'à la fin de sa descente : plus de coupure brutale par la voisine.
      const deckEl = root.current.querySelector('.deck')
      const hover = slots.map((slot) => {
        const card = slot.firstElementChild
        return {
          slot,
          card,
          rx: gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' }),
          ry: gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' }),
        }
      })
      let active = null
      let leaveTimer = null

      const lift = (h) => {
        h.slot.classList.remove('is-leaving')
        h.slot.classList.add('is-active')
        gsap.to(h.card, { yPercent: -14, scale: 1.06, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
      }
      const drop = (h) => {
        h.slot.classList.remove('is-active')
        h.slot.classList.add('is-leaving')
        h.rx(0)
        h.ry(0)
        gsap.to(h.card, {
          yPercent: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => h.slot.classList.remove('is-leaving'),
        })
      }
      const setActive = (h) => {
        clearTimeout(leaveTimer)
        if (h === active) return
        if (active) drop(active)
        active = h
        if (h) lift(h)
      }

      // Slot sous le curseur : on garde la carte active tant que le curseur
      // reste dans sa zone (élargie vers le haut), sinon le slot le plus haut
      const pick = (x, y) => {
        const els = document.elementsFromPoint(x, y)
        if (active && els.includes(active.slot)) return active
        const el = els.find((e) => e.classList?.contains('deck__slot'))
        return el ? hover[slots.indexOf(el)] : null
      }

      const onMove = (e) => {
        const h = pick(e.clientX, e.clientY)
        if (!h) {
          // léger délai avant de relâcher : absorbe un passage bref hors zone
          clearTimeout(leaveTimer)
          leaveTimer = setTimeout(() => setActive(null), 90)
          return
        }
        setActive(h)
        // Inclinaison + reflet relatifs au slot (qui ne bouge pas au survol)
        const r = h.slot.getBoundingClientRect()
        const px = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width)
        const py = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height)
        h.ry((px - 0.5) * 22)
        h.rx((0.5 - py) * 22)
        h.card.style.setProperty('--gx', `${px * 100}%`)
        h.card.style.setProperty('--gy', `${py * 100}%`)
      }
      const onLeave = () => {
        clearTimeout(leaveTimer)
        leaveTimer = setTimeout(() => setActive(null), 90)
      }

      // Au scroll, l'éventail bouge sous le curseur : on relâche la carte
      const onScroll = () => active && setActive(null)

      deckEl.addEventListener('pointermove', onMove)
      deckEl.addEventListener('pointerleave', onLeave)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        clearTimeout(leaveTimer)
        deckEl.removeEventListener('pointermove', onMove)
        deckEl.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('scroll', onScroll)
      }
    },
    { scope: root }
  )

  return (
    <section id="toolkit" className="toolkit" ref={root}>
      <div className="toolkit__inner">
        <header className="toolkit__head">
          <span className="eyebrow">(03) Compétences</span>
          <h2 className="toolkit__title">Toolkit</h2>
          <p className="toolkit__sub">{groups[0]}</p>
        </header>

        <div className="deck">
          {deck.map((c) => (
            <div className="deck__slot" key={c.name}>
              <article className={`card card--${c.theme}`}>
                {c.logo ? (
                  <img className="card__logo" src={c.logo} alt={c.name} draggable={false} />
                ) : c.name === 'K3' ? (
                  <h3 className="card__name card__name--k3">
                    <Logo className="k3-logo card__k3-logo" title="K3" />
                  </h3>
                ) : (
                  <h3 className="card__name">
                    {c.name.split(/[\s-]/).map((part) => (
                      <span key={part}>{part}</span>
                    ))}
                  </h3>
                )}
                <span className="card__tag">{c.tag}</span>
                <span className="card__glare" aria-hidden="true" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
