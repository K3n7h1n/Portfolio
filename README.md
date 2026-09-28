# K3 — Portfolio scrollytelling

Site one-page en React + Vite. Stack : **Three.js** (`@react-three/fiber` + `drei`), **GSAP** (ScrollTrigger, SplitText, ScrambleText) et **Lenis** pour le smooth scroll.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run projet:new -- "Nom du projet"   # crée un nouveau projet
```

Le site a deux types de pages (react-router-dom) : l'accueil `/` et une page par projet `/projets/<slug>`. Une URL inconnue renvoie à l'accueil.

## Tes ressources

| Ressource | Où la mettre | Fichier qui la charge |
|---|---|---|
| Typo principale | `public/mon_assets/ma_typo.woff2` | `src/styles/fonts.css` (`@font-face` « K3 Typo ») |
| Modèle 3D | `public/models/k3-black.glb` (déjà copié) | `src/three/K3Model.jsx` (`useGLTF`) |
| Projets (textes, images, vidéos) | Supabase (table `projects` + bucket `projects`), repli `src/content/projects/<slug>/` | `src/lib/projects.js` (voir « Gérer les projets ») |
| Autres textes | — | `src/data/content.js` (rempli depuis `docs/informations_enzo_locatelli.md`) |

Tant que `ma_typo.woff2` est absent, le site utilise Instrument Sans. Le fichier `k3-white.glb` (version verre) est copié dans `public/models/` mais n'est pas encore utilisé. Le shader de contraste génère lui-même la version blanche.

## Architecture

```
src/
├─ App.jsx               routes, accueil (calques fixes + sections), loader
├─ pages/ProjectPage.jsx page projet (infos, Markdown, galerie + lightbox, vidéos)
├─ components/
│  ├─ Nav.jsx            navigation de l'accueil
│  └─ PageTransition.jsx rideau rouge entre les pages + <TransitionLink>
├─ content/projects/     un dossier par projet (mode local et repli)
├─ lib/
│  ├─ projects.js        chargement des projets : Supabase, sinon repli local
│  ├─ supabase.js        client Supabase (clé publique)
│  ├─ project-model.js   modèle commun (logos, vidéos, Markdown, tri)
│  ├─ projects-local.js  lecture des dossiers projets (repli, import dynamique)
│  ├─ gsap.js            enregistrement des plugins GSAP
│  ├─ lenis.js           init du smooth scroll (branché sur le ticker GSAP)
│  ├─ story.js           transition rouge → noir, rideau circulaire, segments 3D
│  └─ store.js           état partagé DOM ↔ Three.js (souris, rideau, segments)
├─ three/
│  ├─ Experience.jsx     <Canvas>, lumières, environnement (Lightformers)
│  ├─ K3Model.jsx        modèle GLB + shader de contraste + parallax souris
│  └─ keyframes.js       trajectoire de l'objet au fil du scroll
├─ sections/             Hero · Parcours · Toolkit · Projects · Contact
└─ data/content.js       contenu éditable (hors projets)
scripts/new-project.js   modèle de nouveau projet local (npm run projet:new)
```

## Déroulé de l'histoire

1. **Hero (rouge pur)** : « Enzo Locatelli » en géant, animé lettre par lettre. Au scroll, les lettres se dispersent en brouillant leurs glyphes (scramble). « Créatif Développeur » et « Art Director » se recomposent autour du K3, qui fait un tour complet.
2. **Parcours** : un rideau noir circulaire monte pendant que le fond rouge s'assombrit (masquage + fondu). Le texte défile ensuite horizontalement et le K3 roule sous la frise.
3. **Toolkit** : le paquet de cartes s'ouvre en éventail au scroll. Au survol, une carte se soulève, s'incline en 3D et prend un reflet qui suit le curseur.
4. **Projets** : au survol, un dégradé rouge granuleux s'ouvre autour du nom et une vignette flottante (la couverture du projet) suit le curseur avec de l'inertie. Au clic, un rideau rouge recouvre l'écran et la page du projet s'ouvre. Le retour ramène directement à la section Projets.
5. **Contact** : deux lignes de texte glissent sur des courbes SVG serpentines. Le bouton est un cercle rouge vibrant, magnétique, qui grossit au survol.

**Liquid glass (début du Hero)** : tant qu'on n'a pas scrollé, survoler le K3 fait fondre sa matière noire depuis le point survolé et révèle une version en verre (`MeshTransmissionMaterial`) qui réfracte le titre avec une aberration chromatique. Le verre ne peut pas lire le DOM, donc `src/three/heroBackdrop.js` redessine le fond et les lettres dans un canvas aligné sur l'écran, qui sert de texture à réfracter.

**Effet avancé** : le shader du K3 (`K3Model.jsx`) reçoit la géométrie du rideau. Il se colore donc pixel par pixel : noir brillant sur le rouge, blanc nacré avec un liseré rouge sur le noir. Au moment où il traverse le bord du rideau, on voit les deux états sur le même objet.

## Pour ajuster

- **Trajectoire de l'objet** : `src/three/keyframes.js`. `x` et `y` sont en fraction de l'écran, les rotations en radians.
- **Durée des pins** : `end: '+=' + window.innerHeight * N` dans chaque section.
- **Couleurs** : les variables `:root` de `src/styles/global.css`, et les uniforms `uColorOnRed` / `uColorOnDark` pour l'objet.

## Gérer les projets

Les projets sont stockés dans **Supabase** : la table `projects` (textes, listes, ordre) et le bucket Storage public `projects` (images et vidéos, un dossier par projet). Le site les lit au démarrage, pendant le loader « K3 », puis monte les pages. Modifier un projet dans Supabase ne demande **aucun redéploiement**.

### Au quotidien (dashboard Supabase)

- **Ajouter** : Storage → bucket `projects` → crée le dossier `<slug>/` et envoie les images (`01-accueil.jpg`, …). Puis Table Editor → `projects` → Insert row : `slug` (devient l'URL `/projets/<slug>`), `title`, `sort_order`, et les champs voulus. `cover` et `gallery` contiennent des chemins du bucket (`<slug>/01-accueil.jpg`).
- **Modifier** : édite la ligne dans le Table Editor. `tools`, `links` et `videos` sont des tableaux JSON, `body` est la description en Markdown.
- **Remplacer une image** : envoie-la sous un **nouveau nom** (`01-accueil-v2.jpg`) et mets à jour `cover` / `gallery` (les médias sont mis en cache longtemps).
- **Masquer** sans supprimer : `draft = true`. **Supprimer** : supprime la ligne, puis le dossier dans Storage.

Débuter avec Supabase (où sont les images, comment ajouter un projet) : [docs/guide-supabase.md](docs/guide-supabase.md).

Pas à pas détaillé : [docs/supabase-setup.md](docs/supabase-setup.md). Choix du schéma et fonctionnement du front : [docs/migration-bdd-projets.md](docs/migration-bdd-projets.md).

| Colonne | Contenu |
|---|---|
| `slug`, `title`, `sort_order` | URL, nom, position (1 = en premier) |
| `category`, `short`, `tag`, `role`, `client`, `year` | textes ; vide = non affiché |
| `tools` | `["Photoshop", {"name":"Blender","logo":"/logo/blender.svg"}]` |
| `links` | `[{"label":"Voir le site","url":"https://…"}]` |
| `videos` | `[{"src":"<slug>/demo.mp4","title":""}]`, ou URL YouTube / TikTok |
| `cover`, `gallery` | chemins du bucket (`<slug>/01-accueil.jpg`) ; une valeur qui commence par `/` ou `http` est gardée telle quelle |
| `body` | description en Markdown |
| `draft` | `true` = masqué du site |

### Configuration

Variables (fichier `.env.local` en local, modèle dans `.env.example`) :

| Variable | Valeur |
|---|---|
| `VITE_SUPABASE_URL` | `https://<projet>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | la clé publique (anon / publishable) ; jamais la clé `service_role` / `sb_secret_` |
| `VITE_PROJECTS_SOURCE` | `supabase` (défaut) ou `local` pour forcer les fichiers de `src/content/projects/` |

Chez l'hébergeur, ajoute les trois mêmes variables : **Vercel** → Project → Settings → Environment Variables (Production et Preview), **Netlify** → Site configuration → Environment variables. Vite les écrit dans le JS au build : après un changement de variable, relance un déploiement.

### Repli local

Les dossiers `src/content/projects/<slug>/` sont gardés comme **copie de secours**. Si Supabase renvoie une erreur, ne répond pas en 5 s (projet en pause sur l'offre gratuite, par exemple), renvoie 0 projet ou n'est pas configuré, le site affiche ces projets locaux (message `[projets] … repli sur les fichiers locaux` dans la console). Pense à les tenir à jour si tu veux un repli fidèle.

Mode local forcé (`VITE_PROJECTS_SOURCE=local`) : un projet = un dossier, versionné avec le code.

```
src/content/projects/romance-world/
├─ project.md             infos (frontmatter) + description détaillée (Markdown)
├─ 01-accueil.jpg         images : galerie triée par nom de fichier,
├─ 02-planning-sorties.jpg          la 1re sert de couverture
└─ demo.mp4               vidéo locale éventuelle (.mp4 / .webm)
```

- **Ajouter** : `npm run projet:new -- "Nom du projet"` crée le dossier et un `project.md` modèle commenté. Remplis-le, puis dépose les images dans le dossier.
- **Modifier** : édite `project.md` ou remplace les images (le site se met à jour tout seul en `npm run dev`).
- **Supprimer** : supprime le dossier. **Masquer** : `draft: true` dans le frontmatter.

### Champs du frontmatter (mode local)

| Champ | Obligatoire | Rôle |
|---|---|---|
| `title` | oui | nom du projet |
| `order` | conseillé | position dans la liste (1 = en premier) |
| `category` | | sous-titre court (liste + page) |
| `short` | | description courte, en tête de page |
| `tag` | | texte à droite dans la liste (par défaut : les 2 premiers outils) |
| `role`, `client`, `year` | | bloc d'infos ; un champ vide n'est pas affiché |
| `tools` | | liste de noms. Logo ajouté automatiquement s'il existe dans `public/logo` (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, Figma, Astro, Tailwind, Notion, GitHub…), sinon pastille texte. Forme longue possible : `{ name: Blender, logo: /logo/blender.svg }` |
| `links` | | liste de `{ label, url }` (boutons rouges, nouvel onglet) |
| `videos` | | liste : fichier du dossier (`demo.mp4`), URL YouTube (vidéo intégrée 16:9, Shorts en vertical) ou URL TikTok (intégrée en 9:16) |
| `cover` | | nom de l'image de couverture (sinon la 1re image) |
| `gallery` | | liste de noms d'images pour choisir l'ordre / la sélection (sinon toutes les images du dossier) |
| `draft` | | `true` pour masquer le projet |

Sous le frontmatter, la description est écrite en **Markdown** (`## Titre`, `### Sous-titre`, listes `-`, `**gras**`, liens).

**Images** : `.jpg`, `.png`, `.webp`, `.avif`. Nomme-les `01-…`, `02-…` pour l'ordre et garde-les légères (≈ 2000 px de large, JPEG qualité 80 ; sur Mac : `sips -Z 2000 -s format jpeg -s formatOptions 80 capture.png --out 01-accueil.jpg`). Vite les copie avec un nom hashé au build. Sans image, la vignette de la liste affiche un visuel généré et la page s'affiche sans galerie.

## Déploiement

Le site est une SPA : les URL `/projets/...` doivent renvoyer `index.html`. C'est prévu pour Netlify (`public/_redirects`) et Vercel (`vercel.json`).

Pense à déclarer chez l'hébergeur les variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` et `VITE_PROJECTS_SOURCE` (voir « Gérer les projets » → Configuration). Sans elles, le site se replie sur les projets locaux.
