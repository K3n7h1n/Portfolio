// ─────────────────────────────────────────────────────────────
//  Tout le texte du site est ici : remplace les valeurs par ton
//  histoire et tes outils. Les projets ont leur propre dossier :
//  src/content/projects/ (voir le README).
//  Source : docs/informations_enzo_locatelli.md
// ─────────────────────────────────────────────────────────────

export const identity = {
  brand: 'K3',
  name: ['Enzo', 'Locatelli'],
  alias: 'K3nshin',
  location: 'Belfort, FR',
  year: '2026',
  email: 'hello@ton-domaine.fr', // ← ton adresse de contact
  status: 'Recherche de stage',
  roles: {
    dev: ['Designer', 'Graphique'],
    ad: ['Motion', 'Designer'],
  },
}

export const nav = [
  { id: 'parcours', label: 'parcours' },
  { id: 'toolkit', label: 'toolkit' },
  { id: 'projects', label: 'projets' },
  { id: 'contact', label: 'contact' },
]

export const parcours = {
  intro: 'Des premières affiches au code, puis au motion design : le chemin qui m’a mené jusqu’en 3e année de BUT MMI à Montbéliard.',
  steps: [
    {
      year: '2019',
      title: 'Les débuts',
      text: 'Découverte de la typographie et premières créations graphiques. Naissance d’une passion pour le design visuel.',
    },
    {
      year: '2020',
      title: 'Premier code',
      text: 'Intérêt croissant pour le développement web. Premières lignes de HTML, CSS et JavaScript.',
    },
    {
      year: '2021',
      title: 'Projets perso',
      text: 'Réalisation des premiers projets personnels et exploration approfondie du design UI/UX.',
    },
    {
      year: '2024',
      title: 'Entrée en MMI',
      text: 'Intégration du BUT MMI. Découverte approfondie du design, de la communication et du développement web avancé.',
    },
    {
      year: '2025',
      title: 'Projets & communauté',
      text: 'Réalisation de projets associatifs et audiovisuels professionnels. Engagement pour une communauté.',
    },
    {
      year: '2026',
      title: 'Motion design & stage',
      text: 'Logos et animations en motion design. Premier stage : le monde du travail dans le numérique et le travail d’équipe en entreprise.',
    },
  ],
  outro: ['& la suite', 's’écrit ici'],
}

// Les cartes sont listées dans l'ordre de dévoilement au scroll :
// la première (signature K3) est au sommet du paquet, à droite de l'éventail,
// puis chaque carte suivante se pose à sa gauche.
// logo : fichier dans /public/logo (name sert de texte alternatif)
// theme : ink | ember | blood | paper | ash | red | signature
// (les logos sombres vont sur paper, ash ou red pour rester lisibles)
export const toolkit = {
  // sous-titre affiché pendant le dévoilement : groups[0] puis groups[1]
  groups: ['Design & Motion', 'Développement web'],
  // index de la première carte « dev » (le sous-titre bascule sur groups[1])
  splitAt: 7,
  cards: [
    { name: 'K3', tag: 'K3nshin', theme: 'signature' },
    { name: 'Figma', logo: '/logo/figma.svg', tag: 'UI / UX', theme: 'ink' },
    { name: 'Photoshop', logo: '/logo/photoshop.svg', tag: 'Retouche', theme: 'paper' },
    { name: 'Illustrator', logo: '/logo/illustrator.svg', tag: 'Vectoriel', theme: 'red' },
    { name: 'InDesign', logo: '/logo/indesign.png', tag: 'Mise en page', theme: 'ash' },
    { name: 'Premiere Pro', logo: '/logo/premiere.svg', tag: 'Montage vidéo', theme: 'paper' },
    { name: 'After Effects', logo: '/logo/after-effects.svg', tag: 'Motion design', theme: 'red' },
    { name: 'HTML & CSS', logo: '/logo/html-css.svg', tag: 'Intégration', theme: 'ink' },
    { name: 'JavaScript', logo: '/logo/javascript.svg', tag: 'Langage', theme: 'blood' },
    { name: 'Astro', logo: '/logo/astro.jpg', tag: 'Framework', theme: 'red' },
    { name: 'Tailwind CSS', logo: '/logo/tailwind.svg', tag: 'CSS utilitaire', theme: 'ember' },
    { name: 'GitHub', logo: '/logo/github.svg', tag: 'Versioning', theme: 'paper' },
  ],
}

// Les projets ne sont plus ici : un dossier par projet dans
// src/content/projects/<slug>/ (voir README, « Gérer les projets »).

export const contact = {
  curveA: 'Collaborons • Une idée ? • Créons l’inattendu • ',
  curveB: 'Parlons-en • Parlons-en • ',
  cta: ['Écris', 'moi'],
  socials: [
    { label: 'Instagram', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'GitHub', url: '#' },
    { label: 'Behance', url: '#' },
  ],
}
