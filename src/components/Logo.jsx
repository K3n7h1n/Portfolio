// Logo K3 (même tracé que /public/logo/K3.svg), en ligne pour hériter
// de la couleur du texte (fill="currentColor") ; hauteur calée sur la taille de police.
export default function Logo({ className = 'k3-logo', title }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="443 -22 426 434"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M453-12H503V163L657-12H854L748 111C815 119 859 161 859 234C859 315 789 383 682 402L503 194V402H453Z M560 175L678 38H758L671 145C737 131 796 163 807 213C824 273 768 326 702 347Z"
      />
    </svg>
  )
}
