# Guide des Effets et Animations - Page À Propos

## 🎭 Vue d'ensemble des animations

La page "À propos" utilise plusieurs types d'animations et d'effets pour créer une expérience immersive et fluide.

## 📜 Animations au scroll (Scroll Reveal)

### Principe
Les éléments apparaissent progressivement lorsqu'ils entrent dans le viewport.

### Éléments concernés
- Titres de sections
- Cartes de la timeline
- Dossiers de compétences
- Vidéos et textes des passions

### Code utilisé
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});
```

### CSS associé
```css
.scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.scroll-reveal.animate-fade-in {
    opacity: 1;
    transform: translateY(0);
}
```

## 🌊 Effet Parallaxe

### Principe
Les vidéos bougent à une vitesse différente du scroll, créant un effet de profondeur.

### Configuration
Chaque élément a un attribut `data-speed` :
- `0.3` = mouvement lent (vidéo 1)
- `0.5` = mouvement moyen (vidéo 2)
- `0.7` = mouvement rapide (vidéo 3)

### Code JavaScript
```javascript
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxItems = document.querySelectorAll('.parallax-item');
    
    parallaxItems.forEach((item) => {
        const speed = parseFloat(item.dataset.speed || '0.3');
        const rect = item.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementBottom = elementTop + rect.height;
        
        if (elementBottom > scrolled && elementTop < scrolled + window.innerHeight) {
            const yPos = -(scrolled - elementTop) * speed;
            item.style.transform = `translateY(${yPos}px)`;
        }
    });
}
```

### Optimisation
Utilise `requestAnimationFrame` pour des performances optimales :
```javascript
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleParallax();
            ticking = false;
        });
        ticking = true;
    }
});
```

## 🌈 Timeline animée

### Effet de vague
La ligne de connexion entre les cartes utilise un dégradé animé.

### CSS
```css
.timeline-wave {
    background: linear-gradient(90deg, 
        #D019D0 0%, 
        #1974D1 25%, 
        #D019D0 50%, 
        #1974D1 75%, 
        #D019D0 100%);
    background-size: 200% 100%;
    animation: waveFlow 3s linear infinite;
}

@keyframes waveFlow {
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 200% 0%;
    }
}
```

## 📁 Effet Dossier 3D

### Principe
Les dossiers ont un effet de profondeur et s'illuminent au survol.

### Structure HTML
```html
<div class="folder-3d">
    <div class="folder-tab"></div>
    <div class="folder-body">
        <!-- Contenu -->
    </div>
</div>
```

### CSS
```css
.folder-3d {
    perspective: 1000px;
    transition: transform 0.4s ease;
}

.folder-card:hover .folder-3d {
    transform: translateY(-10px);
}

.folder-body {
    background: linear-gradient(135deg, #D019D0 0%, #8B008B 100%);
    box-shadow: 
        0 10px 40px rgba(208, 25, 208, 0.4),
        0 0 60px rgba(139, 0, 139, 0.3);
    transition: all 0.4s ease;
}

.folder-card:hover .folder-body {
    box-shadow: 
        0 20px 60px rgba(208, 25, 208, 0.6),
        0 0 80px rgba(139, 0, 139, 0.5);
    transform: translateZ(20px);
}
```

## ✨ Effet Glow/Halo

### Photo de profil
Halo rose/bleu animé avec pulsation.

```css
.animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(208, 25, 208, 0.4), 
                    0 0 40px rgba(25, 116, 209, 0.2);
    }
    50% {
        box-shadow: 0 0 30px rgba(208, 25, 208, 0.6), 
                    0 0 60px rgba(25, 116, 209, 0.4);
    }
}
```

### Texte néon
```css
.neon-pink {
    color: #D019D0;
    text-shadow: 0 0 10px #D019D0, 
                 0 0 20px #D019D0, 
                 0 0 30px #D019D0;
}

.neon-blue {
    color: #1974D1;
    text-shadow: 0 0 10px #1974D1, 
                 0 0 20px #1974D1, 
                 0 0 30px #1974D1;
}
```

## 🎯 Hover Effects

### Cartes de la timeline
```css
.timeline-card .card {
    transition: all 0.3s ease;
}

.timeline-card:hover .card {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(208, 25, 208, 0.6);
}
```

### Vidéos
```css
.video-card {
    transition: transform 0.3s ease;
}

.video-card:hover {
    transform: scale(1.02);
}

.video-card .group-hover\:scale-110 {
    transition: transform 0.5s ease;
}
```

## 🔄 Délais d'animation (Stagger)

Les éléments apparaissent de façon échelonnée pour un effet plus naturel.

```astro
<!-- Exemple dans le code -->
<div class="scroll-reveal" style="animation-delay: 0.1s;">...</div>
<div class="scroll-reveal" style="animation-delay: 0.2s;">...</div>
<div class="scroll-reveal" style="animation-delay: 0.3s;">...</div>
<div class="scroll-reveal" style="animation-delay: 0.4s;">...</div>
```

## 📱 Responsive Adaptations

### Mobile
- Timeline verticale (pas de ligne horizontale)
- Parallaxe désactivé sur petits écrans
- Animations simplifiées

### Tablette
- Layout adapté en grille
- Espacement réduit
- Effets maintenus

### Desktop
- Tous les effets actifs
- Timeline horizontale
- Parallaxe complet

## ♿ Accessibilité

### Respect des préférences utilisateur
```css
@media (prefers-reduced-motion: reduce) {
    .scroll-reveal,
    .parallax-item {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
```

Cela désactive toutes les animations pour les utilisateurs ayant activé "réduire les mouvements" dans leurs paramètres système.

## 🎨 Personnalisation

### Modifier la vitesse d'apparition
```css
.scroll-reveal {
    transition: opacity 1.2s ease, transform 1.2s ease; /* Au lieu de 0.8s */
}
```

### Modifier l'intensité du parallaxe
```html
<!-- Plus rapide = plus de mouvement -->
<div class="parallax-item" data-speed="1.0">

<!-- Plus lent = moins de mouvement -->
<div class="parallax-item" data-speed="0.1">
```

### Modifier les couleurs du glow
```css
/* Exemple : glow vert/cyan au lieu de rose/bleu */
.folder-body {
    background: linear-gradient(135deg, #00FF00 0%, #00FFFF 100%);
    box-shadow: 
        0 10px 40px rgba(0, 255, 0, 0.4),
        0 0 60px rgba(0, 255, 255, 0.3);
}
```

## 🚀 Performance

### Optimisations appliquées
1. **will-change** : Pré-optimise les transformations
2. **requestAnimationFrame** : Synchronise avec le refresh du navigateur
3. **Intersection Observer** : Détecte uniquement les éléments visibles
4. **CSS Transform** : Utilise l'accélération GPU
5. **Debouncing** : Limite les calculs pendant le scroll

### Métriques cibles
- **FPS** : 60 (fluide)
- **Paint time** : < 16ms par frame
- **Layout shift** : Minimal

## 📊 Outils de débogage

### Chrome DevTools
- **Performance tab** : Analyser les animations
- **Rendering** : Visualiser les repaints
- **Layers** : Voir les couches GPU

### Commandes utiles
```javascript
// Mesurer le FPS
const fps = [];
let lastTime = performance.now();

function measureFPS() {
    const now = performance.now();
    fps.push(1000 / (now - lastTime));
    lastTime = now;
    
    if (fps.length > 60) {
        console.log('FPS moyen:', fps.reduce((a, b) => a + b) / fps.length);
        fps.length = 0;
    }
    
    requestAnimationFrame(measureFPS);
}

measureFPS();
```

## 💡 Astuces

1. **Testez sur mobile** : Les animations peuvent être plus lentes
2. **Vérifiez le contraste** : Les effets néon doivent rester lisibles
3. **Gardez la cohérence** : Même durée/courbe pour effets similaires
4. **Testez l'accessibilité** : Activez "reduce motion" dans votre OS

## 🔗 Ressources

- [MDN - Intersection Observer](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API)
- [MDN - requestAnimationFrame](https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame)
- [CSS Tricks - Parallax](https://css-tricks.com/parallax-effect/)
- [Web.dev - Animations](https://web.dev/animations/)
