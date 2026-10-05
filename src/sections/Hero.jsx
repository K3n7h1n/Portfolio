import { useRef } from 'react'
import { gsap, SplitText, useGSAP, SCRAMBLE_CHARS } from '../lib/gsap'
import { identity } from '../data/content'

const GLYPHS = SCRAMBLE_CHARS.split('')

export default function Hero() {
  const root = useRef()

  useGSAP(
    () => {
      const giant = root.current.querySelector('.hero__giant')
      const split = SplitText.create(giant, { type: 'words,chars', charsClass: 'char' })

      // Chaque lettre reçoit un span interne : l'intro anime l'intérieur,
      // la dispersion anime l'extérieur → aucune collision de propriétés.
      // La largeur est figée pour que le scramble ne fasse pas « sauter » la ligne.
      // Elle est exprimée en em (et non en px) : la taille du titre étant en vw,
      // les lettres restent proportionnées après un redimensionnement / une rotation.
      // Toutes les mesures d'abord, puis toutes les écritures : alterner lecture
      // et écriture forçait une mise en page complète par lettre.
      const widths = split.chars.map((c) => c.getBoundingClientRect().width / parseFloat(getComputedStyle(c).fontSize))
      const inners = split.chars.map((c, i) => {
        const w = widths[i]
        const ch = c.textContent
        c.innerHTML = `<span class="char__in">${ch}</span>`
        c.style.width = `${w}em`
        c.dataset.char = ch
        return c.firstChild
      })

      // Intro au chargement
      gsap.from(inners, {
        yPercent: 110,
        rotateX: -80,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.035,
        delay: 0.15,
      })
      gsap.from('.hero__meta > *', { opacity: 0, y: 12, duration: 1, delay: 0.9, stagger: 0.1 })

      // Couche « duo » (Créatif Développeur / Art Director) : vide au départ
      const duoLines = gsap.utils.toArray('.duo__line', root.current)
      duoLines.forEach((l) => (l.textContent = ''))

      // Timeline scrubée, Hero épinglé
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'hero-pin',
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.3,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // 1 · Dispersion des lettres
      const vw = () => window.innerWidth
      const vh = () => window.innerHeight
      tl.to(
        split.chars,
        {
          x: () => gsap.utils.random(-0.55, 0.55) * vw(),
          y: () => gsap.utils.random(-0.6, 0.6) * vh(),
          rotation: () => gsap.utils.random(-140, 140),
          scale: () => gsap.utils.random(0.2, 1.8),
          opacity: 0,
          ease: 'power2.in',
          duration: 0.4,
          stagger: { amount: 0.18, from: 'center' },
        },
        0
      )

      // 2 · Scramble : pendant leur vol, les lettres changent de glyphe
      const proxy = { p: 0 }
      const n = split.chars.length
      tl.to(
        proxy,
        {
          p: 1,
          duration: 0.58,
          onUpdate() {
            split.chars.forEach((c, i) => {
              const local = proxy.p * 1.4 - (Math.abs(i - n / 2) / n) * 0.4
              const inner = c.firstChild
              const next = local > 0.04 && local < 0.96 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c.dataset.char
              if (inner.textContent !== next) inner.textContent = next
            })
          },
        },
        0
      )
      tl.to('.hero__meta', { opacity: 0, duration: 0.2 }, 0)

      // 3 · Recomposition « Créatif Développeur / Art Director »
      tl.set('.hero__duo', { autoAlpha: 1 }, 0.45)
      duoLines.forEach((line, i) => {
        tl.to(
          line,
          {
            duration: 0.32,
            scrambleText: { text: line.dataset.text, chars: SCRAMBLE_CHARS, revealDelay: 0.1, speed: 0.6 },
          },
          0.45 + i * 0.07
        )
      })
      tl.fromTo('.duo', { yPercent: 25 }, { yPercent: 0, duration: 0.55, ease: 'power2.out' }, 0.45)
      tl.to({}, { duration: 0.2 }) // respiration avant l'arrivée du rideau
    },
    { scope: root }
  )

  const [first, last] = identity.name
  const [dev1, dev2] = identity.roles.dev
  const [ad1, ad2] = identity.roles.ad

  return (
    <section id="hero" className="hero" ref={root}>
      <div className="hero__inner">
        <h1 className="hero__giant" aria-label={`${first} ${last}, ${dev1} ${dev2} & ${ad1} ${ad2}`}>
          <span className="hero__line hero__line--1">{first}</span>
          <span className="hero__line hero__line--2">{last}</span>
        </h1>

        <div className="hero__duo" aria-hidden="true">
          <p className="duo duo--dev">
            <span className="duo__line" data-text={dev1}>{dev1}</span>
            <span className="duo__line" data-text={dev2}>{dev2}</span>
          </p>
          <p className="duo duo--ad">
            <span className="duo__line" data-text={ad1}>{ad1}</span>
            <span className="duo__line" data-text={ad2}>{ad2}</span>
          </p>
        </div>

        <div className="hero__meta">
          <span>(01) {identity.alias}</span>
          <span className="hero__scroll">Scroll pour découvrir ↓</span>
          <span>
            {identity.location}, {identity.year}
          </span>
        </div>
      </div>
    </section>
  )
}
