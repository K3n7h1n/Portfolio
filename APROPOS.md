# Page À Propos - Documentation

## 🎨 Vue d'ensemble

La page "À propos" (`/A-propos`) est une page immersive et professionnelle qui présente le parcours, les compétences et les passions d'Enzo Locatelli.

## 📋 Structure de la page

### 1. Section d'introduction (`#intro`)
- **Titre principal** : "Enchanté, moi c'est Enzo"
- **Sous-titre** : "Étudiant en MMI & designer graphique"
- **Photo** : Image en noir et blanc avec halo rose/bleu circulaire
- **Animations** : Fade-in et zoom-in au chargement

### 2. Section Mon parcours (`#parcours`)
- **Timeline horizontale** animée avec 4 étapes clés
- **Années** : 2019, 2020-2021, 2024, 2025
- **Ligne de connexion** : Animation de vague avec dégradé rose/bleu
- **Cartes flottantes** : Effet hover avec glow

### 3. Section Mes compétences (`#competences`)
- **3 dossiers stylisés en 3D** :
  - Design
  - Développement
  - Communication
- **Effet hover** : Illumination et élévation
- **Style** : Dossiers violets avec icônes blanches

### 4. Section Mes passions (`#passions`)
- **Colonne gauche** : 3 vidéos/placeholders avec effet parallaxe
  - TikTok pour le compte MMI
  - Participation au serveur vocal d'anime
  - Les jeux vidéo
- **Colonne droite** : Texte explicatif sur les passions
- **Effet parallaxe** : Défilement fluide des vidéos au scroll

## 🎯 Fonctionnalités techniques

### Animations
- **Scroll reveal** : Apparition progressive des sections au défilement
- **Parallaxe** : Effet de profondeur sur les vidéos (vitesse variable)
- **Timeline animée** : Vague de couleur en mouvement continu
- **Hover effects** : Glow et élévation sur les cartes

### Effets visuels
- **Halo néon** : Autour de la photo de profil
- **Dégradés lumineux** : Rose/bleu sur les éléments interactifs
- **Dossiers 3D** : Perspective et ombres pour effet de profondeur
- **Border glow** : Bordures illuminées au survol

### Responsive Design
- **Mobile** : Layout en colonne, timeline verticale
- **Tablette** : Adaptation des espacements
- **Desktop** : Timeline horizontale, grid 2 colonnes

## 🎨 Palette de couleurs

- **Rose néon** : `#D019D0`
- **Bleu néon** : `#1974D1`
- **Noir** : `#000000`
- **Gris** : Différentes nuances pour le texte

## 📱 Points d'attention

### Performance
- Les animations utilisent `requestAnimationFrame` pour la fluidité
- Les effets parallaxe sont optimisés avec `will-change`
- Les observers utilisent des seuils pour limiter les calculs

### Accessibilité
- Support de `prefers-reduced-motion` pour désactiver les animations
- Contraste élevé pour la lisibilité
- Structure sémantique HTML5

### Personnalisation

Pour ajouter de vraies vidéos :
```astro
<!-- Remplacer le placeholder par -->
<video autoplay muted loop playsinline class="w-full h-full object-cover">
  <source src="/videos/votre-video.mp4" type="video/mp4">
</video>
```

Pour modifier la vitesse du parallaxe :
```html
<!-- Ajuster data-speed (0.1 = lent, 1.0 = rapide) -->
<div class="parallax-item" data-speed="0.5">
```

## 🔧 Technologies utilisées

- **Astro** : Framework principal
- **TailwindCSS** : Styles utilitaires
- **DaisyUI** : Composants UI
- **JavaScript/TypeScript** : Animations et interactions
- **Intersection Observer API** : Détection du scroll
- **RequestAnimationFrame** : Animations fluides

## 🚀 Améliorations possibles

1. **Vidéos réelles** : Remplacer les placeholders par de vraies vidéos
2. **Modal pour les compétences** : Détails au clic sur les dossiers
3. **Galerie interactive** : Projets liés aux passions
4. **Animation GSAP** : Pour des effets plus complexes
5. **Dark/Light mode** : Toggle de thème
6. **i18n** : Support multilingue

## 📞 Contact

Pour toute question sur cette page, contactez Enzo Locatelli via le formulaire de contact du portfolio.
