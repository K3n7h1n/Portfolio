# 🎠 Carrousel 3D Coverflow

## 📖 Description

Implémentation d'un **effet Coverflow 3D** inspiré d'Apple iTunes où vous êtes positionné au centre et les cartes de projets tournent autour de vous dans l'espace 3D.

## ✨ Caractéristiques

### Effet 3D
- **Perspective augmentée** : 2500px pour une profondeur maximale
- **Vous êtes au centre** : Les cartes sont disposées en cercle autour de vous
- **Rayon du cercle** : 800px (distance des cartes par rapport au centre)
- **Rotation fluide** : Animation de 0.7s avec effet bounce

### Transformations 3D
```css
transform: 
  translateX() /* Position horizontale sur le cercle */
  translateZ() /* Profondeur - distance vers/depuis vous */
  rotateY()    /* Rotation pour que les cartes "regardent" vers le centre */
  scale()      /* Échelle basée sur la distance */
```

### Visibilité dynamique
- **Cartes devant vous** : Opacité 1, grande taille (scale 1.2)
- **Cartes sur les côtés** : Opacité réduite, taille moyenne
- **Cartes derrière** : Opacité 0-0.3, petite taille (scale 0.5)

### Carte active (centrale)
- Bordure **neon rose** (`#D019D0`)
- Effet de **glow** avec multiples ombres
- Scale augmenté à **1.05** (1.08 au hover)
- **Interactions activées** (pointer-events: auto)
- Z-index élevé pour être au-dessus

### Navigation
- **Boutons Prev/Next** : Rotation du carrousel entier
- **Flèches clavier** : ← et → pour naviguer
- **Indicateurs** : Points cliquables en bas
- **Responsive** : Adapté mobile/tablette/desktop

## 🎨 Calculs mathématiques

### Positionnement sur le cercle
```javascript
const angle = angleIncrement * index + currentRotation;
const radians = (angle * Math.PI) / 180;
const x = Math.sin(radians) * radius;  // Position horizontale
const z = Math.cos(radians) * radius;  // Profondeur
```

### Distance normalisée (0 à 1)
```javascript
const normalizedDistance = (z + radius) / (radius * 2);
// 0 = complètement derrière
// 0.5 = sur les côtés
// 1 = devant vous (face à face)
```

### Échelle progressive
```javascript
const scale = 0.5 + (normalizedDistance * 0.7);
// De 0.5 (derrière) à 1.2 (devant)
```

### Opacité conditionnelle
```javascript
if (normalizedDistance < 0.4) {
  opacity = normalizedDistance / 0.4 * 0.3; // Fade out derrière
} else if (normalizedDistance > 0.6) {
  opacity = Math.min(1, (normalizedDistance - 0.5) * 2); // Fade in devant
}
```

## 🎯 Utilisation

### Navigation
- **Clic gauche** : Carte précédente (rotation vers la droite)
- **Clic droite** : Carte suivante (rotation vers la gauche)
- **Clavier** : ← et → pour naviguer
- **Indicateurs** : Clic direct sur un point pour aller à cette carte

### Rotation
Le carrousel entier tourne autour de vous :
- **Next** : `currentRotation -= angleIncrement` (sens horaire vu de dessus)
- **Prev** : `currentRotation += angleIncrement` (sens anti-horaire)

## 📐 Configuration

Variables modifiables dans `initCarousel3D()` :

```javascript
const radius = 800;          // Distance des cartes (800px par défaut)
const angleIncrement = 360 / totalItems; // Angle entre chaque carte
```

Variables CSS modifiables :

```css
perspective: 2500px;         /* Intensité de la perspective */
transform: rotateX(-5deg);   /* Inclinaison du carrousel */
```

## 🎬 Animation

- **Durée** : 0.7s
- **Easing** : `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce effect)
- **Propriétés animées** :
  - Transform (position, rotation, scale)
  - Opacity
  - Z-index (recalculé dynamiquement)

## 💡 Effet "Vous êtes au centre"

L'illusion est créée par :

1. **perspective-origin: 50% 50%** : Point de vue centré
2. **Cartes tournées vers vous** : `rotateY(-angle)`
3. **Distribution circulaire** : Sin/Cos pour le positionnement
4. **Z-index basé sur la distance** : Les cartes proches sont au-dessus
5. **Échelle et opacité dynamiques** : Effet de profondeur naturel

## 🔧 Compatibilité

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile/Tablette (avec ajustements responsive)

## 📱 Responsive

```css
/* Tablette (≤768px) */
.carousel-item {
  width: 380px;
  height: 520px;
}

/* Mobile (≤480px) */
.carousel-item {
  width: 320px;
  height: 470px;
}
```

## 🎨 Personnalisation

### Couleurs neon
- Rose : `#D019D0` (bordure active)
- Bleu : `#1974D1` (tags technologies)
- Dégradés : Rose → Bleu sur les titres

### Ombres et glow
```css
box-shadow: 
  0 0 80px rgba(208, 25, 208, 0.8),    /* Glow rose intense */
  0 0 120px rgba(208, 25, 208, 0.4),   /* Glow rose étendu */
  0 30px 90px rgba(0, 0, 0, 0.7);      /* Ombre portée */
```

---

**Créé le** : 17 octobre 2025  
**Type d'effet** : Coverflow 3D / Carrousel cylindrique  
**Technologies** : CSS 3D Transforms, JavaScript ES6+, Astro
