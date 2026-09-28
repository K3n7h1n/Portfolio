// Crée un nouveau projet LOCAL : npm run projet:new -- "Nom du projet"
// → src/content/projects/<slug>/project.md (modèle commenté)
//
// Par défaut, le site lit ses projets dans Supabase (table `projects`,
// bucket Storage `projects`) : ce script ne sert alors qu'au mode local
// (VITE_PROJECTS_SOURCE=local) et au repli automatique si Supabase ne répond pas.
// En mode Supabase, on ajoute un projet depuis le dashboard : Table Editor →
// table projects → Insert row, et les médias dans Storage → projects/<slug>/
// (voir docs/supabase-setup.md).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'projects')
const title = process.argv.slice(2).join(' ').trim()

if (!title) {
  console.error('Donne un nom au projet : npm run projet:new -- "Nom du projet"')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const dir = join(root, slug)
if (existsSync(dir)) {
  console.error(`Le dossier existe déjà : src/content/projects/${slug}`)
  process.exit(1)
}

// Place le nouveau projet à la fin de la liste
let order = 1
if (existsSync(root)) {
  for (const name of readdirSync(root)) {
    const file = join(root, name, 'project.md')
    if (!existsSync(file)) continue
    const m = readFileSync(file, 'utf8').match(/^order:\s*(\d+)/m)
    if (m) order = Math.max(order, Number(m[1]) + 1)
  }
}

const template = `---
# ─── Infos du projet ───────────────────────────────────────────
# Les lignes qui commencent par # sont des commentaires (ignorés).
# Un champ laissé vide n'est pas affiché sur la page.

title: ${JSON.stringify(title)}
order: ${order}            # position dans la liste (1 = en premier)
category:            # sous-titre court, ex. Identité visuelle
short:               # description courte (1 à 2 phrases)

role:                # ex. Designer graphique
client:              # ex. Association X
year:                # ex. 2026

# Outils : un logo est ajouté automatiquement s'il existe dans /public/logo
# (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, Figma,
# Astro, Tailwind, Notion, GitHub...), sinon une pastille texte.
tools:
  # - Photoshop
  # - Figma

# Liens (boutons rouges, ouverts dans un nouvel onglet)
links:
  # - label: Voir le site
  #   url: https://exemple.fr

# Vidéos : un fichier du dossier (ex. demo.mp4) ou une URL YouTube / TikTok
videos:
  # - demo.mp4
  # - https://www.youtube.com/watch?v=XXXXXXXXXXX
  # - https://www.tiktok.com/@compte/video/1234567890

# Images : toutes les images du dossier, triées par nom de fichier
# (01-xxx.jpg, 02-xxx.jpg...). La 1re sert de couverture.
# Décommente pour choisir la couverture ou l'ordre de la galerie :
# cover: 03-affiche.jpg
# gallery:
#   - 01-accueil.jpg
#   - 02-detail.jpg

draft: false         # true = projet masqué du site (sans le supprimer)
---

## Contexte

Présente le projet ici, en Markdown.

## Ce que j'ai fait

- Première mission
- Deuxième mission
`

mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'project.md'), template)
console.log(`✓ Projet créé : src/content/projects/${slug}/project.md`)
console.log('  Complète le fichier et ajoute tes images (01-xxx.jpg...) dans ce dossier.')
