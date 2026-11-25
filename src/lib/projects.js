// ─────────────────────────────────────────────────────────────
//  Projets : contenu statique, src/data/projects.json
//  (export de l'ancienne table Supabase `projects`, 2026-11-20).
//  Les médias sont dans public/projects/<slug>/… (servis tels quels),
//  les modèles 3D dans public/models/.
//
//  Ajouter / modifier un projet : éditer projects.json et déposer
//  les fichiers dans public/projects/<slug>/.
//  Champs : slug, title, sort_order, category, short, tag, role,
//  client, year, tools[], links[{label,url}], videos[{src,title}],
//  cover, gallery[], model, body (Markdown), draft,
//  status ("en-cours" : badge « En cours » dans la liste et la page).
// ─────────────────────────────────────────────────────────────
import rows from '../data/projects.json'
import { finalize, list, renderMarkdown, toTool, toVideo } from './project-model'

const media = (path) => (path && typeof path === 'string' ? path : null)

// Fichier local (/projects/…), YouTube ou TikTok
function videoFromRow(v) {
  const src = media(typeof v === 'string' ? v : v?.src)
  if (!src) return null
  return toVideo({ src, title: (typeof v === 'object' && v?.title) || '' }, { [src]: src })
}

function fromRow(row) {
  const tools = list(row.tools).map(toTool).filter(Boolean)
  const gallery = list(row.gallery).map(media).filter(Boolean)
  return {
    slug: row.slug,
    title: row.title ? String(row.title) : row.slug,
    order: typeof row.sort_order === 'number' ? row.sort_order : 999,
    category: row.category || '',
    short: row.short || '',
    tag: row.tag || tools.slice(0, 2).map((t) => t.name).join(' · '),
    role: row.role || '',
    client: row.client || '',
    year: row.year ? String(row.year) : '',
    tools,
    links: list(row.links)
      .filter((l) => l && l.url)
      .map((l) => ({ label: l.label || 'Voir le projet', url: l.url })),
    videos: list(row.videos).map(videoFromRow).filter(Boolean),
    cover: media(row.cover) || gallery[0] || null,
    gallery,
    model: media(row.model),
    html: row.body?.trim() ? renderMarkdown(row.body) : '',
    draft: row.draft === true,
    inProgress: row.status === 'en-cours',
  }
}

export const projects = finalize(rows.map(fromRow))
export const projectsSource = 'static'

// Gardé pour App.jsx (attendu avec le loader) : déjà prêt
export const loadProjects = () => Promise.resolve(projects)

export const getProject = (slug) => projects.find((p) => p.slug === slug) || null

// Projet suivant dans l'ordre (boucle)
export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return i === -1 || projects.length < 2 ? null : projects[(i + 1) % projects.length]
}
