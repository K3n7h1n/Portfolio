import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { initLenis, lenis } from '../lib/lenis'
import { getNextProject, getProject } from '../lib/projects'
import { identity } from '../data/content'
import { TransitionLink } from '../components/PageTransition'
import Logo from '../components/Logo'

const pad = (n) => String(n).padStart(2, '0')

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

// ─── Lightbox plein écran ───
// L'image est toujours ajustée à l'espace libre (barre du haut + flèches déduites,
// en dvh) ; un clic (ou le bouton Zoom) l'affiche en grand dans une zone qui
// défile à la molette, au doigt ou en glissant à la souris. La page reste bloquée.
// Échap ferme, ←/→ naviguent, Tab reste dans la boîte de dialogue.
function Lightbox({ images, index, title, onClose, onChange }) {
  const root = useRef()
  const stage = useRef()
  const img = useRef()
  const closeBtn = useRef()
  const drag = useRef(null)
  const anchor = useRef(null) // point à garder sous le curseur au passage en zoom
  const [zoom, setZoom] = useState(0) // 0 = ajustée ; sinon largeur affichée en px
  const [zoomable, setZoomable] = useState(false)
  const n = images.length
  const prev = useCallback(() => onChange((index - 1 + n) % n), [index, n, onChange])
  const next = useCallback(() => onChange((index + 1) % n), [index, n, onChange])

  useEffect(() => {
    const opener = document.activeElement
    const html = document.documentElement
    lenis?.stop()
    html.classList.add('has-lightbox')
    // Visible avant le focus (un élément en visibility: hidden ne peut pas le recevoir)
    gsap.set(root.current, { visibility: 'visible' })
    closeBtn.current?.focus({ preventScroll: true })
    if (!reducedMotion()) gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    return () => {
      html.classList.remove('has-lightbox')
      lenis?.start()
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  // Zoom possible seulement si l'image a plus de détails que sa taille ajustée
  const measure = useCallback(() => {
    const el = img.current
    if (!el?.naturalWidth) return
    const r = el.getBoundingClientRect()
    setZoomable(el.naturalWidth > r.width * 1.15 || el.naturalHeight > r.height * 1.15)
  }, [])

  // Nouvelle image : retour en vue ajustée + petite entrée
  useLayoutEffect(() => {
    setZoom(0)
    setZoomable(false)
    if (img.current?.complete) measure()
    if (!reducedMotion()) {
      gsap.fromTo(img.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
    }
  }, [index, measure])

  useEffect(() => {
    if (zoom) return
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [zoom, measure])

  const toggleZoom = useCallback(
    (point) => {
      const el = img.current
      if (!el) return
      if (zoom) return setZoom(0)
      const r = el.getBoundingClientRect()
      // Au moins 2× la vue ajustée ou la largeur de l'écran, sans dépasser la taille réelle
      const width = Math.min(el.naturalWidth, Math.max(r.width * 2, window.innerWidth * 0.9))
      anchor.current = point
        ? { fx: (point.x - r.left) / r.width, fy: (point.y - r.top) / r.height, x: point.x, y: point.y }
        : { fx: 0.5, fy: 0, x: window.innerWidth / 2, y: stage.current.getBoundingClientRect().top } // bouton : haut de l'image
      setZoom(Math.round(width))
    },
    [zoom]
  )

  // Après le zoom : le point cliqué reste sous le curseur
  useLayoutEffect(() => {
    const box = stage.current
    const el = img.current
    const a = anchor.current
    anchor.current = null
    if (!zoom || !a || !box || !el) return
    const b = box.getBoundingClientRect()
    box.scrollLeft = el.offsetLeft + a.fx * el.offsetWidth - (a.x - b.left)
    box.scrollTop = el.offsetTop + a.fy * el.offsetHeight - (a.y - b.top)
  }, [zoom])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && n > 1) prev()
      else if (e.key === 'ArrowRight' && n > 1) next()
      else if (e.key === 'Tab') {
        const items = [...root.current.querySelectorAll(FOCUSABLE)]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || !root.current.contains(document.activeElement))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next, n])

  // Glisser pour se déplacer dans l'image zoomée (souris ; le tactile défile nativement)
  const onPointerDown = (e) => {
    if (!zoom || e.pointerType !== 'mouse' || e.button !== 0) return
    const box = stage.current
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: box.scrollLeft, top: box.scrollTop, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 5) return
    if (!d.moved) {
      d.moved = true
      stage.current.setPointerCapture(e.pointerId)
      stage.current.classList.add('is-dragging')
    }
    stage.current.scrollLeft = d.left - dx
    stage.current.scrollTop = d.top - dy
  }
  const onPointerUp = () => {
    stage.current?.classList.remove('is-dragging')
    if (!drag.current?.moved) drag.current = null
  }

  const onStageClick = (e) => {
    e.stopPropagation()
    if (drag.current?.moved) return (drag.current = null) // fin d'un glisser, pas un clic
    drag.current = null
    if (e.target === img.current) {
      if (zoom || zoomable) toggleZoom({ x: e.clientX, y: e.clientY })
    } else onClose() // clic sur le fond
  }

  return (
    <div
      className={`lightbox ${n > 1 ? '' : 'lightbox--single'}`}
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, galerie`}
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        className={`lightbox__stage ${zoom ? 'is-zoomed' : ''}`}
        ref={stage}
        onClick={onStageClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="lightbox__canvas">
          <img
            className={`lightbox__img ${zoomable ? 'is-zoomable' : ''}`}
            ref={img}
            src={images[index]}
            alt={`${title}, image ${index + 1} sur ${n}`}
            style={zoom ? { width: zoom } : undefined}
            onLoad={measure}
            draggable="false"
          />
        </div>
      </div>
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite">
          {pad(index + 1)} / {pad(n)}
        </p>
        <div className="lightbox__actions">
          {(zoomable || zoom > 0) && (
            <button className="lightbox__btn" onClick={(e) => (e.stopPropagation(), toggleZoom())} aria-pressed={zoom > 0}>
              {zoom ? 'Ajuster' : 'Zoom'} <span aria-hidden="true">{zoom ? '−' : '+'}</span>
            </button>
          )}
          <button className="lightbox__btn" ref={closeBtn} onClick={onClose} aria-label="Fermer la galerie">
            Fermer ✕
          </button>
        </div>
      </div>
      {n > 1 && (
        <>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => (e.stopPropagation(), prev())} aria-label="Image précédente">
            ←
          </button>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => (e.stopPropagation(), next())} aria-label="Image suivante">
            →
          </button>
        </>
      )}
    </div>
  )
}

// ─── Habillage de la couverture : un titre reste avec son contenu ───
// Le texte « À propos » s'enroule autour de la couverture flottante. Après chaque
// mise en page, on mesure les blocs qui commencent à côté de l'image : un titre
// sans la place pour lui + 3 lignes du bloc suivant, ou un paragraphe qui n'y
// mettrait qu'une ligne, passe sous l'image (classe .pp-clear = clear: left).
// Mesures relatives à .pp-body : insensibles au décalage de l'animation d'entrée.
const KEEP_LINES_AFTER_HEADING = 3
const MIN_LINES_BESIDE = 2

function layoutWrap(intro) {
  const cover = intro?.querySelector('.pp-cover')
  const body = intro?.querySelector('.pp-body')
  const blocks = body ? [...body.querySelectorAll('.pp-prose > *')] : []
  blocks.forEach((el) => el.classList.remove('pp-clear')) // toujours repartir de zéro
  if (!cover || !blocks.length || getComputedStyle(cover).float === 'none') return

  // Bas de la couverture (marge comprise), dans le repère de .pp-body
  // (- 1 : offsetTop est arrondi au pixel, les positions mesurées ne le sont pas)
  const floatBottom = cover.offsetTop + cover.offsetHeight + parseFloat(getComputedStyle(cover).marginBottom) - body.offsetTop - 1
  const top = (el) => el.getBoundingClientRect().top - body.getBoundingClientRect().top
  const lineHeight = (el) => parseFloat(getComputedStyle(el.querySelector('li') || el).lineHeight) || 24

  for (const el of blocks) {
    const y = top(el)
    if (y >= floatBottom) break // ce bloc et les suivants sont déjà sous l'image
    const next = el.nextElementSibling
    if (/^H[2-6]$/.test(el.tagName)) {
      if (!next || top(next) + KEEP_LINES_AFTER_HEADING * lineHeight(next) > floatBottom) el.classList.add('pp-clear')
    } else {
      const spans = y + el.getBoundingClientRect().height > floatBottom
      if (spans && floatBottom - y < MIN_LINES_BESIDE * lineHeight(el)) el.classList.add('pp-clear')
    }
  }
}

// Recalcul direct (pas de requestAnimationFrame : il est suspendu dans un onglet
// en arrière-plan). Les rappels de ResizeObserver et les effets passent après la
// mise en page, la lecture des positions y est sûre.
function useWrapLayout(ref, enabled) {
  const run = useCallback(() => layoutWrap(ref.current), [ref])
  useEffect(() => {
    const intro = ref.current
    if (!enabled || !intro) return
    let key = ''
    // Ne recalcule que si la largeur ou la hauteur d'écran change (pas quand
    // nos propres .pp-clear changent la hauteur du bloc : pas d'oscillation)
    const onResize = () => {
      const next = `${intro.clientWidth}x${window.innerHeight}`
      if (next === key) return
      key = next
      run()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(intro)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(run)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [ref, enabled, run])
  return run
}

function Video({ video, title }) {
  if (video.kind === 'file') {
    return (
      <figure className="pp-video">
        <video src={video.src} controls playsInline preload="metadata" />
        {video.title && <figcaption>{video.title}</figcaption>}
      </figure>
    )
  }
  return (
    <figure className={`pp-video pp-video--embed ${video.vertical ? 'is-vertical' : ''} is-${video.provider}`}>
      <div className="pp-video__frame">
        <iframe
          src={video.src}
          title={video.title || `${title}, vidéo ${video.provider === 'tiktok' ? 'TikTok' : 'YouTube'}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {video.title && <figcaption>{video.title}</figcaption>}
    </figure>
  )
}

function ProjectView({ project }) {
  const root = useRef()
  const next = getNextProject(project.slug)
  const [open, setOpen] = useState(-1)
  const [landscape, setLandscape] = useState(false) // couverture paysage : colonne image plus large
  const [coverFailed, setCoverFailed] = useState(false) // image injoignable : pas de cadre vide
  const { title, category, short, role, client, year, tools, links, videos, cover, gallery, html } = project
  const infos = [
    ['Rôle', role],
    ['Client', client],
    ['Année', year],
  ].filter(([, v]) => v)
  // Toutes les images de la lightbox : la couverture (si elle n'est pas déjà dans
  // la galerie) puis la galerie. La grille n'affiche pas la couverture une 2e fois.
  const shots = cover && !gallery.includes(cover) ? [cover, ...gallery] : gallery
  const rest = gallery.filter((src) => src !== cover)
  const showCover = Boolean(cover) && !coverFailed
  const intro = useRef()
  const relayoutWrap = useWrapLayout(intro, showCover && Boolean(html))
  useEffect(() => {
    relayoutWrap() // portrait ↔ paysage : la couverture change de largeur
  }, [landscape, relayoutWrap])

  // Page neuve : scroll en haut + smooth scroll Lenis (détruit au démontage)
  useLayoutEffect(() => {
    document.title = `${title} · ${identity.name.join(' ')}`
    window.scrollTo(0, 0)
    const stopLenis = initLenis()
    return stopLenis
  }, [title])

  useGSAP(
    () => {
      // Titre lettre par lettre
      const split = SplitText.create('.pp-hero__title', { type: 'words,chars', mask: 'words' })
      gsap.from(split.chars, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.03, delay: 0.35 })
      gsap.from('.pp-hero .reveal', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.6 })

      // Révélations au scroll
      gsap.utils.toArray('.pp-scroll-reveal', root.current).forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      // Couverture : dévoilement de bas en haut, l'image se resserre (le zoom est
      // posé sur le bouton : l'img a sa propre transition CSS de survol)
      if (root.current.querySelector('.pp-cover') && !reducedMotion()) {
        const scrollTrigger = { trigger: '.pp-intro', start: 'top 85%', once: true }
        gsap.from('.pp-cover', { clipPath: 'inset(100% 0% 0% 0% round 1rem)', duration: 1.5, ease: 'expo.inOut', scrollTrigger })
        gsap.from('.pp-cover__btn', { scale: 1.2, duration: 1.8, ease: 'expo.out', scrollTrigger })
      }
      gsap.from('.pp-next__title', {
        yPercent: 100,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pp-next', start: 'top 80%', once: true },
      })

      ScrollTrigger.refresh()
    },
    { scope: root }
  )

  // Les images chargées changent la hauteur de la page : on recalcule
  const refresh = useRef(null)
  const onImgLoad = () => {
    clearTimeout(refresh.current)
    refresh.current = setTimeout(() => ScrollTrigger.refresh(), 150)
  }
  useEffect(() => () => clearTimeout(refresh.current), [])

  const close = useCallback(() => setOpen(-1), [])

  return (
    <div className="pp" ref={root}>
      <header className="pp-bar">
        <TransitionLink className="logo" to="/" aria-label={`${identity.brand}, retour à l'accueil`}>
          <Logo />
        </TransitionLink>
        <TransitionLink className="pp-back" to="/#projects">
          <span aria-hidden="true">←</span> Tous les projets
        </TransitionLink>
      </header>

      <main>
        <section className="pp-hero">
          <span className="eyebrow reveal">(04) Projet · {pad(project.index + 1)}</span>
          <h1 className="pp-hero__title">{title}</h1>
          <div className="pp-hero__sub">
            {category && <p className="pp-hero__cat reveal">{category}</p>}
            {short && <p className="pp-hero__short reveal">{short}</p>}
          </div>
        </section>

        <section className="pp-infos pp-scroll-reveal" aria-label="Informations">
          {infos.map(([label, value]) => (
            <div className="pp-info" key={label}>
              <span className="pp-info__label">{label}</span>
              <p className="pp-info__value">{value}</p>
            </div>
          ))}
          {tools.length > 0 && (
            <div className="pp-info pp-info--wide">
              <span className="pp-info__label">Outils</span>
              <ul className="pp-tools">
                {tools.map((t) => (
                  <li className={`pp-tool ${t.logo ? '' : 'pp-tool--text'}`} key={t.name}>
                    {t.logo && <img src={t.logo} alt="" loading="lazy" />}
                    <span>{t.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {links.length > 0 && (
            <div className="pp-info pp-info--wide">
              <span className="pp-info__label">Liens</span>
              <ul className="pp-links">
                {links.map((l) => (
                  <li key={l.url}>
                    <a className="pp-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {(showCover || html) && (
          <div className={`pp-intro ${showCover ? '' : 'pp-intro--solo'} ${landscape ? 'is-landscape' : ''}`} ref={intro}>
            {showCover && (
              <figure className="pp-cover">
                <button className="pp-cover__btn" onClick={() => setOpen(shots.indexOf(cover))} aria-label={`Agrandir le visuel principal de ${title}`}>
                  <img
                    src={cover}
                    alt={`${title}, visuel principal`}
                    onLoad={(e) => {
                      setLandscape(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight * 1.2)
                      onImgLoad()
                      relayoutWrap() // la hauteur de l'image est connue
                    }}
                    onError={() => setCoverFailed(true)}
                  />
                </button>
              </figure>
            )}

            {html && (
              <section className="pp-body pp-scroll-reveal">
                <span className="eyebrow">À propos</span>
                <div className="pp-prose" dangerouslySetInnerHTML={{ __html: html }} />
              </section>
            )}
          </div>
        )}

        {rest.length > 0 && (
          <section className="pp-gallery">
            <header className="pp-section-head pp-scroll-reveal">
              <span className="eyebrow">Galerie</span>
              <h2 className="pp-section-title">
                Images<sup>({pad(shots.length)})</sup>
              </h2>
            </header>
            <ul className={`pp-grid pp-grid--${Math.min(rest.length, 3)}`}>
              {rest.map((src) => {
                const i = shots.indexOf(src)
                return (
                  <li className="pp-grid__item pp-scroll-reveal" key={src}>
                    <button className="pp-shot" onClick={() => setOpen(i)} aria-label={`Agrandir l'image ${i + 1} sur ${shots.length}`}>
                      <img src={src} alt={`${title}, image ${i + 1}`} loading="lazy" decoding="async" onLoad={onImgLoad} />
                      <span className="pp-shot__index" aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {videos.length > 0 && (
          <section className="pp-videos">
            <header className="pp-section-head pp-scroll-reveal">
              <span className="eyebrow">En mouvement</span>
              <h2 className="pp-section-title">
                Vidéos<sup>({pad(videos.length)})</sup>
              </h2>
            </header>
            <div className="pp-videos__list pp-scroll-reveal">
              {videos.map((v) => (
                <Video key={v.src} video={v} title={title} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="pp-foot">
        {next && (
          <TransitionLink className="pp-next" to={`/projets/${next.slug}`}>
            <span className="eyebrow">Projet suivant · {pad(next.index + 1)}</span>
            <span className="pp-next__wrap">
              <span className="pp-next__title">
                {next.title} <span className="pp-next__arrow" aria-hidden="true">→</span>
              </span>
            </span>
          </TransitionLink>
        )}
        <div className="pp-foot__bar">
          <TransitionLink className="pp-back pp-back--inline" to="/#projects">
            <span aria-hidden="true">←</span> Retour à la liste
          </TransitionLink>
          <span>
            © {identity.year} {identity.name.join(' ')} · {identity.alias}
          </span>
        </div>
      </footer>

      {open > -1 && <Lightbox images={shots} index={open} title={title} onClose={close} onChange={setOpen} />}
    </div>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <Navigate to="/" replace />
  // key : passer au projet suivant remonte entièrement la page
  return <ProjectView key={project.slug} project={project} />
}
