/**
 * 🎨 Configuration de la page À Propos
 * 
 * Ce fichier centralise tous les paramètres personnalisables
 * de la page À propos pour faciliter les modifications.
 */

export const configAPropos = {
  // 🎨 Couleurs
  couleurs: {
    roseNeon: '#D019D0',
    bleuNeon: '#1974D1',
    noir: '#000000',
    gris: '#9CA3AF',
    blanc: '#FFFFFF',
  },

  // 📆 Données de la timeline
  parcours: [
    {
      annee: '2019',
      titre: 'Découverte de la typographie',
      description: 'Découverte de la typographie et premières créations graphiques',
      couleur: 'rose', // 'rose' ou 'bleu'
      icone: 'design', // 'design', 'code', 'communication', 'education'
    },
    {
      annee: '2020-2021',
      titre: 'Développement web',
      description: 'Intérêt croissant pour le développement web et premières lignes de code',
      couleur: 'bleu',
      icone: 'code',
    },
    {
      annee: '2024',
      titre: 'Entrée en MMI',
      description: 'Entrée en MMI, découverte approfondie du design et de la communication',
      couleur: 'rose',
      icone: 'education',
    },
    {
      annee: '2025',
      titre: 'Projets professionnels',
      description: 'Réalisation de projets associatifs et audiovisuels professionnels',
      couleur: 'bleu',
      icone: 'communication',
    },
  ],

  // 🧠 Compétences
  competences: [
    {
      titre: 'DESIGN',
      icone: 'design',
      couleurDossier: 'violet1', // violet1, violet2, violet3
    },
    {
      titre: 'DÉVELOPPEMENT',
      icone: 'code',
      couleurDossier: 'violet2',
    },
    {
      titre: 'COMMUNICATION',
      icone: 'megaphone',
      couleurDossier: 'violet3',
    },
  ],

  // 💡 Vidéos des passions
  videos: [
    {
      titre: 'TikTok Pour Le Compte MMI',
      fichier: 'tiktok-mmi.mp4', // Nom du fichier dans public/videos/
      couleurPlaceholder: 'red-pink', // Couleur si pas de vidéo
      vitesseParallaxe: 0.3, // 0.1 (lent) à 1.0 (rapide)
    },
    {
      titre: 'On Vous<br/>Les Animes "Parlons Au Vrai De Vue OR Du Serveur"',
      fichier: 'anime-server.mp4',
      couleurPlaceholder: 'blue-purple',
      vitesseParallaxe: 0.5,
    },
    {
      titre: 'Les Jeux Vidéos',
      fichier: 'jeux-video.mp4',
      couleurPlaceholder: 'purple-pink',
      vitesseParallaxe: 0.7,
    },
  ],

  // ✨ Paramètres des animations
  animations: {
    // Durée des transitions (en secondes)
    dureeFadeIn: 0.8,
    dureeHover: 0.4,
    dureeParallaxe: 0.1,

    // Délais entre les éléments (stagger)
    delaiStagger: 0.1, // secondes entre chaque élément

    // Seuil de détection pour l'Intersection Observer
    seuilVisibilite: 0.1, // 0 à 1 (pourcentage de l'élément visible)

    // Marge pour déclencher les animations avant que l'élément soit visible
    margeAvant: '0px 0px -100px 0px',

    // Vitesse de l'animation de la timeline
    vitesseTimeline: 3, // secondes pour un cycle complet
  },

  // 📱 Points de rupture responsive
  breakpoints: {
    mobile: 768, // px
    tablette: 1024, // px
    desktop: 1280, // px
  },

  // 🎭 Effets visuels
  effets: {
    // Intensité du blur des halos
    intensiteBlur: 3, // rem (1rem = 16px)

    // Opacité des halos
    opaciteHalo: 0.6, // 0 à 1

    // Intensité du box-shadow (glow)
    intensiteGlow: {
      normal: 40, // px
      hover: 60, // px
    },

    // Échelle des éléments au hover
    echelleHover: 1.02, // 1.0 = pas de changement

    // Perspective 3D des dossiers
    perspective3D: 1000, // px
  },

  // 🖼️ Images
  images: {
    photoProfil: '/pp-landingpage.webp',
    altPhotoProfil: 'Photo de Enzo Locatelli',
    // Effet sur la photo
    filtrePhoto: 'grayscale', // 'grayscale', 'none', 'sepia', etc.
    filtrePhotoHover: 'none', // Filtre au survol
  },

  // 📝 Textes de présentation
  textes: {
    intro: {
      prenom: 'Enzo',
      sousTitre: '✨ Étudiant en MMI & designer graphique',
      paragraphe1: `Passionné par le design graphique, la communication visuelle et le développement web, 
        je transforme les idées en créations visuelles modernes et impactantes.`,
      paragraphe2: `Mon objectif ? Allier esthétique et fonctionnalité pour créer des expériences 
        numériques qui marquent les esprits.`,
    },
    competences: {
      intro: `Grâce à ce parcours, j'ai développé des compétences en design, 
        développement web et communication digitale.`,
    },
    passions: {
      paragraphe1: `Au-delà de mes études, je suis passionné par les jeux vidéo, 
        un univers où je trouve une source d'inspiration inépuisable pour le 
        storytelling et la création visuelle.`,
      paragraphe2: `Je m'intéresse également à la création de contenu vidéo, 
        que ce soit pour des réseaux sociaux ou des projets associatifs. 
        Le montage et la réalisation me permettent d'exprimer ma créativité 
        tout en perfectionnant mes compétences techniques.`,
      paragraphe3: `L'intelligence artificielle est un autre domaine qui m'attire, 
        notamment pour son potentiel à révolutionner le design et la communication. 
        J'aime explorer comment ces nouvelles technologies peuvent enrichir mes projets 
        et ouvrir de nouvelles perspectives créatives.`,
      paragraphe4: `Ma curiosité naturelle me pousse à découvrir constamment 
        de nouveaux outils, techniques et tendances pour rester à la pointe de mon domaine 
        et proposer des solutions innovantes.`,
    },
  },

  // 🔗 Liens (si nécessaire)
  liens: {
    cv: '#', // Lien vers le CV
    linkedin: 'https://www.linkedin.com',
    tiktok: 'https://www.tiktok.com',
  },
};

// Export des icônes SVG pour faciliter la personnalisation
export const icones = {
  design: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>`,
  
  code: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>`,
  
  megaphone: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>`,
  
  education: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>`,
  
  communication: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`,
  
  play: `<path d="M8 5v14l11-7z"/>`,
};

// Export des dégradés de couleurs
export const degrades = {
  violet1: 'linear-gradient(135deg, #D019D0 0%, #8B008B 100%)',
  violet2: 'linear-gradient(135deg, #D019D0 0%, #9D4EDD 100%)',
  violet3: 'linear-gradient(135deg, #D019D0 0%, #C75FD0 100%)',
  
  'red-pink': 'linear-gradient(to bottom right, rgb(220 38 38 / 0.8), rgb(251 146 60 / 0.6))',
  'blue-purple': 'linear-gradient(to bottom right, rgb(37 99 235 / 0.8), rgb(168 85 247 / 0.6))',
  'purple-pink': 'linear-gradient(to bottom right, rgb(147 51 234 / 0.8), rgb(236 72 153 / 0.6))',
};

/**
 * 🎯 Comment utiliser cette configuration
 * 
 * 1. Importez le fichier dans votre composant Astro :
 *    ```astro
 *    ---
 *    import { configAPropos } from '../config/apropos.config.ts';
 *    ---
 *    ```
 * 
 * 2. Utilisez les valeurs dans votre template :
 *    ```astro
 *    <h1>{configAPropos.textes.intro.prenom}</h1>
 *    ```
 * 
 * 3. Modifiez les valeurs ici pour personnaliser toute la page
 *    sans toucher au code Astro !
 */

export default configAPropos;
