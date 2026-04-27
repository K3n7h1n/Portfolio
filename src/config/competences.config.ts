/**
 * 🎨 Configuration des compétences/logiciels
 * 
 * Liste de tous les logiciels à afficher dans la section compétences
 * avec leurs propriétés (logo, taille, couleur)
 */

export interface Competence {
  nom: string;
  logo: string;
  taille: 'small' | 'medium' | 'large';
  couleur: string;
  categorie: 'design' | 'dev' | 'video' | 'autre';
}

export const competences: Competence[] = [
  // Design & Graphisme
  {
    nom: 'Photoshop',
    logo: '/logos/photoshop.svg',
    taille: 'large',
    couleur: '#31A8FF',
    categorie: 'design'
  },

  {
    nom: 'Audition',
    logo: '/logos/audition.svg',
    taille: 'large',
    couleur: '#31A8FF',
    categorie: 'design'
  },

  {
    nom: 'Illustrator',
    logo: '/logos/illustrator.svg',
    taille: 'medium',
    couleur: '#FF9A00',
    categorie: 'design'
  },
  {
    nom: 'Figma',
    logo: '/logos/figma.svg',
    taille: 'medium',
    couleur: '#F24E1E',
    categorie: 'design'
  },

  {
    nom: 'Affinity',
    logo: '/logos/affinity.jpg',
    taille: 'medium',
    couleur: '#FF61F6',
    categorie: 'design'
  },

  {
    nom: 'InDesign',
    logo: '/logos/indesign.png',
    taille: 'medium',
    couleur: '#FF3366',
    categorie: 'design'
  },

  
  // Développement
  {
    nom: 'VS Code',
    logo: '/logos/vscode.svg',
    taille: 'medium',
    couleur: '#007ACC',
    categorie: 'dev'
  },
  {
    nom: 'Claude',
    logo: '/logos/claude.svg',
    taille: 'medium',
    couleur: '#7d7d7dff',
    categorie: 'dev'
  },
  {
    nom: 'ChatGPT',
    logo: '/logos/chatgpt.svg',
    taille: 'small',
    couleur: '#E572B0ff',
    categorie: 'dev'
  },
  {
    nom: 'Gemini',
    logo: '/logos/gemini.svg',
    taille: 'small',
    couleur: '#E572B0ff',
    categorie: 'dev'
  },


  {
    nom: 'HTML/CSS',
    logo: '/logos/html-css.svg',
    taille: 'small',
    couleur: '#E34F26',
    categorie: 'dev'
  },
  {
    nom: 'JavaScript',
    logo: '/logos/javascript.svg',
    taille: 'small',
    couleur: '#F7DF1E',
    categorie: 'dev'
  },

  {
    nom: 'Tailwind',
    logo: '/logos/tailwind.svg',
    taille: 'small',
    couleur: '#06B6D4',
    categorie: 'dev'
  },

  {
    nom: 'Astro',
    logo: '/logos/astro.jpg',
    taille: 'small',
    couleur: '#FF5D01',
    categorie: 'dev'
  },
  
  // Vidéo & Animation
  {
    nom: 'Premiere Pro',
    logo: '/logos/premiere.svg',
    taille: 'large',
    couleur: '#9999FF',
    categorie: 'video'
  },
  {
    nom: 'After Effects',
    logo: '/logos/after-effects.svg',
    taille: 'medium',
    couleur: '#9999FF',
    categorie: 'video'
  },
  {
    nom: 'DaVinci Resolve',
    logo: '/logos/davinci.svg',
    taille: 'small',
    couleur: '#FF2D55',
    categorie: 'video'
  },
  
  // Autres
  {
    nom: 'Notion',
    logo: '/logos/notion.png',
    taille: 'small',
    couleur: '#000000',
    categorie: 'autre'
  },
  {
    nom: 'Canva',
    logo: '/logos/canva.svg',
    taille: 'small',
    couleur: '#00C4CC',
    categorie: 'autre'
  },
  {
    nom: 'Github',
    logo: '/logos/github.svg',
    taille: 'small',
    couleur: '#F05032',
    categorie: 'dev'
  },
];

/**
 * Obtenir les compétences par catégorie
 */
export function getCompetencesByCategorie(categorie: Competence['categorie']) {
  return competences.filter(c => c.categorie === categorie);
}

/**
 * Obtenir toutes les catégories uniques
 */
export function getCategories() {
  return Array.from(new Set(competences.map(c => c.categorie)));
}

export default competences;
