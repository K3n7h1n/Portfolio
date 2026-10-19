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
  email: 'enzort70290@gmail.com', // ← ton adresse de contact
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

// Compétences rangées par domaine. Chaque outil est relié automatiquement
// aux projets qui le citent dans leur champ `tools` (Supabase ou local) :
// la comparaison ignore casse, accents et ponctuation (« after-effects »
// = « After Effects »). `aliases` : autres noms acceptés pour un outil.
// logo : fichier dans /public/logo ; sans logo, une pastille texte.
export const toolkit = {
  intro: 'Cinq domaines, une même façon de travailler : de l’idée au rendu final. Ouvre un domaine, puis survole ou touche un outil pour voir où je l’ai utilisé.',
  domains: [
    {
      title: 'Design graphique',
      text: 'Affiches, identités visuelles, mise en page et retouche : des supports de communication pensés pour être lus en un regard.',
      tools: [
        { name: 'Photoshop', logo: '/logo/photoshop.svg' },
        { name: 'Illustrator', logo: '/logo/illustrator.svg' },
        { name: 'InDesign', logo: '/logo/indesign.png' },
      ],
    },
    {
      title: 'Motion & vidéo',
      text: 'Montage, logos animés et contenus pour les réseaux : donner du rythme à une identité.',
      tools: [
        { name: 'After Effects', logo: '/logo/after-effects.svg' },
        { name: 'Premiere Pro', logo: '/logo/premiere.svg', aliases: ['Premiere'] },
      ],
    },
    {
      title: 'Web & développement',
      text: 'De la maquette à la mise en ligne : interfaces, intégration soignée et sites rapides, animés quand ça sert le propos.',
      tools: [
        { name: 'Figma', logo: '/logo/figma.svg' },
        { name: 'HTML & CSS', logo: '/logo/html-css.svg', aliases: ['HTML', 'CSS'] },
        { name: 'JavaScript', logo: '/logo/javascript.svg', aliases: ['JS'] },
        { name: 'React', logo: '/logo/react.svg' },
        { name: 'Astro', logo: '/logo/astro.jpg' },
        { name: 'Tailwind CSS', logo: '/logo/tailwind.svg', aliases: ['Tailwind'] },
        { name: 'GitHub', logo: '/logo/github.svg', aliases: ['Git'] },
      ],
    },
    {
      title: '3D & temps réel',
      text: 'Modélisation, objets interactifs pour le web et habillages animés en direct.',
      tools: [{ name: 'Blender' }, { name: 'Three.js' }, { name: 'Blockbench' }, { name: 'OBS Studio', aliases: ['OBS'] }],
    },
    {
      title: 'IA & assistants',
      text: 'Des assistants pour coder, déboguer et explorer des pistes plus vite. Je garde la direction artistique et je relis tout ce qui sort.',
      tools: [
        { name: 'Claude Code', logo: '/logo/claude.svg', aliases: ['Claude'] },
        { name: 'ChatGPT', logo: '/logo/chatgpt-icon.svg', aliases: ['OpenAI'] },
        { name: 'Gemini', logo: '/logo/gemini-icon.svg' },
      ],
    },
  ],
}

// Les projets ne sont plus ici : un dossier par projet dans
// src/content/projects/<slug>/ (voir README, « Gérer les projets »).

export const contact = {
  curveA: 'Collaborons • Une idée ? • Créons l’inattendu • ',
  curveB: 'Parlons-en • Parlons-en • ',
  cta: ['Écris', 'moi'],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/enzo-locatelli-a414b2337/' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@romance.wrld' },
    { label: 'Discord', url: 'https://discord.gg/dyK6xyFvks' },
  ],
}
