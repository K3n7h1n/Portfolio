import { identity, nav } from '../data/content'
import { scrollToSection } from '../lib/lenis'
import Logo from './Logo'

const SECTIONS = ['hero', ...nav.map((n) => n.id)]

export default function Nav({ active }) {
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToSection(id === 'hero' ? 0 : `#${id}`)
  }

  return (
    <>
      <a className="logo" href="#hero" onClick={go('hero')} aria-label={`${identity.brand}, retour en haut`}>
        <Logo />
      </a>

      <nav className="nav" aria-label="Navigation principale">
        <ul className="nav__pill">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={go(n.id)} className={`nav__link ${active === n.id ? 'is-active' : ''}`}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="status">
        <span className="status__dot" /> {identity.status}
      </p>

      {/* Indicateur de progression façon « règle » (bas gauche) */}
      <div className="indicator" aria-hidden="true">
        {SECTIONS.map((id) => (
          <button key={id} tabIndex={-1} className={active === id ? 'is-active' : ''} onClick={go(id)} />
        ))}
      </div>
    </>
  )
}

export { SECTIONS }
