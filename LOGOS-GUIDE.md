# 🎨 Guide d'intégration des logos - Section Compétences

## 📁 Où placer les logos

Placez tous vos logos dans le dossier : **`public/logos/`**

## 🖼️ Format des logos recommandé

### Format idéal
- **Type** : SVG (vectoriel - recommandé) ou PNG avec fond transparent
- **Taille** : 512x512px minimum pour PNG
- **Poids** : < 50 KB par logo
- **Fond** : Transparent

### Formats acceptés
1. **.svg** (meilleur choix - scalable, léger)
2. **.png** (avec transparence)
3. **.webp** (moderne, bon compromis)

## 📋 Liste des logos à télécharger

### Design & Graphisme (4 logos)
- `photoshop.svg` - Adobe Photoshop
- `illustrator.svg` - Adobe Illustrator  
- `figma.svg` - Figma
- `indesign.svg` - Adobe InDesign

### Développement (6 logos)
- `vscode.svg` - Visual Studio Code
- `html-css.svg` - HTML5 + CSS3
- `javascript.svg` - JavaScript
- `react.svg` - React
- `tailwind.svg` - Tailwind CSS
- `git.svg` - Git

### Vidéo & Animation (3 logos)
- `premiere.svg` - Adobe Premiere Pro
- `after-effects.svg` - Adobe After Effects
- `davinci.svg` - DaVinci Resolve

### Autres (3 logos)
- `notion.svg` - Notion
- `canva.svg` - Canva
- `github.svg` - GitHub (optionnel)

**Total : 15-16 logos**

## 🔍 Où télécharger les logos

### Sites recommandés (gratuits)

#### 1. **Simple Icons** (le meilleur pour les logos tech)
- 🔗 https://simpleicons.org/
- Format SVG, libres de droits
- Couvrent tous les logiciels populaires
- Comment faire :
  1. Chercher le nom du logiciel (ex: "Photoshop")
  2. Cliquer sur l'icône
  3. Télécharger le SVG
  4. Renommer selon la liste ci-dessus

#### 2. **Worldvectorlogo**
- 🔗 https://worldvectorlogo.com/
- Logos vectoriels gratuits
- Qualité professionnelle

#### 3. **Seeklogo**
- 🔗 https://seeklogo.com/
- Grande base de données
- Formats SVG et PNG

#### 4. **Logopng**
- 🔗 https://logopng.com.br/
- PNG avec transparence
- Bonne qualité

### Sites officiels
Pour certains logiciels, vous pouvez aussi télécharger depuis leurs sites :
- Adobe : https://www.adobe.com/fr/brandportal.html
- Figma : https://www.figma.com/community/
- VS Code : https://code.visualstudio.com/brand

## 🎨 Optimisation des logos

### Si vous avez des PNG
Convertissez-les en SVG pour de meilleures performances :
- **Outil en ligne** : https://convertio.co/fr/png-svg/
- **Vectorizer.ai** : https://vectorizer.ai/ (IA pour vectoriser)

### Compresser les SVG
Si vos SVG sont lourds :
- **SVGOMG** : https://jakearchibald.github.io/svgomg/
- Permet de réduire la taille jusqu'à 80%

## 📝 Nommage des fichiers

### Règles importantes
✅ **Correct** :
- `photoshop.svg`
- `html-css.svg`
- `after-effects.svg`

❌ **Incorrect** :
- `Photoshop.svg` (majuscule)
- `photoshop logo.svg` (espace)
- `photoshop_2024.svg` (version)

### Convention
- Tout en **minuscules**
- **Tirets** pour les espaces (`-`)
- Pas de caractères spéciaux
- Extension en minuscule

## ⚙️ Configuration

### Modifier la liste des compétences

Éditez le fichier `src/config/competences.config.ts` :

```typescript
export const competences: Competence[] = [
  {
    nom: 'Nom du logiciel',
    logo: '/logos/nom-du-fichier.svg',
    taille: 'small', // 'small', 'medium', ou 'large'
    couleur: '#FF0000', // Couleur de la marque (hex)
    categorie: 'design' // 'design', 'dev', 'video', 'autre'
  },
  // Ajouter plus de compétences ici...
];
```

### Tailles disponibles

- **`small`** : Carte 1x1 (carrée standard)
- **`medium`** : Carte 2x1 (rectangle horizontal)
- **`large`** : Carte 2x2 (grand carré)

### Couleurs recommandées

Les couleurs doivent correspondre à la palette de la marque :

| Logiciel | Couleur hex |
|----------|-------------|
| Photoshop | `#31A8FF` |
| Illustrator | `#FF9A00` |
| Figma | `#F24E1E` |
| VS Code | `#007ACC` |
| HTML/CSS | `#E34F26` |
| JavaScript | `#F7DF1E` |
| React | `#61DAFB` |
| Tailwind | `#06B6D4` |
| Premiere Pro | `#9999FF` |
| After Effects | `#9999FF` |
| Git | `#F05032` |
| Notion | `#000000` |
| Canva | `#00C4CC` |

## 🎯 Ajouter une nouvelle compétence

### Étape 1 : Télécharger le logo
1. Télécharger depuis Simple Icons ou autre site
2. Renommer correctement (ex: `blender.svg`)
3. Placer dans `public/logos/`

### Étape 2 : Ajouter dans la config
Ouvrir `src/config/competences.config.ts` et ajouter :

```typescript
{
  nom: 'Blender',
  logo: '/logos/blender.svg',
  taille: 'medium',
  couleur: '#F5792A',
  categorie: 'design'
},
```

### Étape 3 : Vérifier
1. Sauvegarder le fichier
2. Recharger la page dans le navigateur
3. Le logo devrait apparaître !

## 🖼️ Créer un logo personnalisé

Si vous ne trouvez pas un logo spécifique, vous pouvez :

### Option 1 : Créer dans Figma
1. Créer un carré 512x512px
2. Ajouter le texte/icône du logiciel
3. Exporter en SVG

### Option 2 : Utiliser une initiale
```html
<!-- Créer un SVG simple avec une lettre -->
<svg width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="240" fill="#D019D0"/>
  <text x="256" y="340" text-anchor="middle" 
        font-size="280" font-weight="bold" fill="white">
    L
  </text>
</svg>
```

## 🎨 Exemples de disposition

La mosaïque s'adapte automatiquement selon les tailles :

```
┌─────┬─────┬─────────┬─────┐
│  S  │  S  │    M    │  S  │
├─────┴─────┤         ├─────┤
│     L     │─────────┤  S  │
│           ├─────┬───┴─────┤
│           │  S  │    M    │
└───────────┴─────┴─────────┘

S = small (1x1)
M = medium (2x1)
L = large (2x2)
```

## 🚀 Après ajout des logos

### Test rapide
1. Vérifier que tous les logos s'affichent
2. Tester l'effet hover (agrandissement)
3. Vérifier le responsive (mobile)
4. S'assurer que les couleurs correspondent

### Optimisation
1. Compresser les logos si nécessaires
2. Vérifier les performances (Lighthouse)
3. Tester sur différents navigateurs

## 🐛 Problèmes courants

### Logo ne s'affiche pas
- ✅ Vérifier le nom du fichier (sensible à la casse)
- ✅ Vérifier le chemin (`/logos/...`)
- ✅ Vérifier que le fichier est bien dans `public/logos/`
- ✅ Recharger la page (Ctrl+F5)

### Logo trop petit/grand
- ✅ Ajuster la taille dans le composant SkillCard
- ✅ Vérifier que le SVG a un viewBox correct

### Couleur ne s'applique pas
- ✅ Vérifier le format hex (`#FF0000`)
- ✅ Le SVG doit avoir `currentColor` ou être monochrome

### Layout cassé
- ✅ Vérifier que vous avez le bon nombre de cartes
- ✅ Équilibrer les tailles (pas que des large)
- ✅ Tester sur différentes résolutions

## 📊 Checklist finale

Avant de valider :

- [ ] Tous les 15 logos sont téléchargés
- [ ] Tous les logos sont au format SVG
- [ ] Les fichiers sont bien nommés (minuscules, tirets)
- [ ] Les logos sont placés dans `public/logos/`
- [ ] La configuration est à jour dans `competences.config.ts`
- [ ] Les couleurs correspondent aux marques
- [ ] L'effet hover fonctionne
- [ ] Le responsive est OK sur mobile
- [ ] Les performances sont bonnes (< 100KB total)

## 💡 Conseils pro

1. **Cohérence** : Utilisez le même style pour tous les logos (outline ou fill)
2. **Couleurs** : Respectez les couleurs officielles des marques
3. **Équilibre** : Mélangez les tailles pour un effet dynamique
4. **Ordre** : Placez les plus importants en taille large
5. **Qualité** : Privilégiez toujours le SVG au PNG

## 🎉 Résultat attendu

Une fois tous les logos ajoutés :
- ✨ Mosaïque dynamique et moderne
- 🎨 Effet hover avec agrandissement
- 📱 100% responsive
- ⚡ Chargement rapide
- 🎯 Visuel professionnel

---

**Besoin d'aide ?** Consultez la documentation complète dans `INDEX-DOCS.md`

**Astuce :** Commencez par ajouter 3-4 logos pour tester, puis ajoutez les autres !
