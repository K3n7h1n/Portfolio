// ─────────────────────────────────────────────────────────────
//  Projets : Supabase si configuré, sinon (ou en cas d'erreur)
//  les dossiers locaux src/content/projects/<slug>/.
//  loadProjects() est appelé une fois, pendant le loader (App.jsx).
//  Ensuite projects / getProject / getNextProject sont synchrones.
//  VITE_PROJECTS_SOURCE=local force les fichiers locaux.
// ─────────────────────────────────────────────────────────────
import { BUCKET, supabase } from './supabase'
import { finalize, list, renderMarkdown, toTool, toVideo } from './project-model'

const SOURCE = (import.meta.env.VITE_PROJECTS_SOURCE || 'supabase').trim().toLowerCase()
const TIMEOUT = 5000 // au-delà, on passe au repli local

const COLUMNS =
  'slug,title,sort_order,category,short,tag,role,client,year,tools,links,videos,cover,gallery,body,draft'

// Liaison vivante : les composants qui importent `projects` voient la liste chargée
export let projects = []
export let projectsSource = 'none' // 'supabase' | 'local' | 'none'
let loading = null

// Chemin du bucket (slug/fichier) → URL publique ; URL et chemins absolus (/logo/…) gardés tels quels
const mediaUrl = (path) => {
  if (!path || typeof path !== 'string') return null
  if (/^(https?:)?\//.test(path)) return path
  return supabase.storage.from(BUCKET).getPublicUrl(path.replace(/^\/+/, '')).data.publicUrl
}

// Une vidéo de la table : fichier du bucket → URL publique, puis même logique
// qu'en local (YouTube, TikTok, fichier). Le 2e argument sert de table des
// fichiers connus, pour accepter aussi les chemins de public/ (/videos/…).
function videoFromRow(v) {
  const src = mediaUrl(typeof v === 'string' ? v : v?.src)
  if (!src) return null
  return toVideo({ src, title: (typeof v === 'object' && v?.title) || '' }, { [src]: src })
}

// Une ligne de la table → le même objet que buildProject() en local
function fromRow(row) {
  const tools = list(row.tools).map(toTool).filter(Boolean)
  const gallery = list(row.gallery).map(mediaUrl).filter(Boolean)
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
    cover: mediaUrl(row.cover) || gallery[0] || null,
    gallery,
    html: row.body?.trim() ? renderMarkdown(row.body) : '',
    draft: row.draft === true,
  }
}

async function fetchRemote() {
  // Délai maximum : un projet en pause peut laisser la requête pendue
  const ctrl = new AbortController()
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      ctrl.abort()
      reject(new Error(`délai de ${TIMEOUT / 1000} s dépassé`))
    }, TIMEOUT)
  })
  const query = supabase
    .from('projects')
    .select(COLUMNS)
    .eq('draft', false) // utile si on est connecté en admin : la RLS montrerait aussi les brouillons
    .order('sort_order')
    .abortSignal(ctrl.signal)
  try {
    const { data, error } = await Promise.race([query, timeout])
    if (error) throw error
    return (data || []).map(fromRow)
  } finally {
    clearTimeout(timer)
  }
}

async function fetchLocal() {
  const { localProjects } = await import('./projects-local')
  return localProjects
}

// Appelé une seule fois (la promesse est gardée) : Supabase, sinon repli local
export function loadProjects() {
  loading ??= (async () => {
    if (SOURCE !== 'local') {
      if (!supabase) {
        console.warn('[projets] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY absents : repli sur les fichiers locaux')
      } else {
        try {
          const remote = await fetchRemote()
          if (remote.length) {
            projects = finalize(remote)
            projectsSource = 'supabase'
            return projects
          }
          console.warn('[projets] Supabase ne renvoie aucun projet : repli sur les fichiers locaux')
        } catch (err) {
          console.warn('[projets] Supabase indisponible (erreur, pause ou délai dépassé) : repli sur les fichiers locaux', err)
        }
      }
    }
    try {
      projects = finalize(await fetchLocal())
      projectsSource = 'local'
    } catch (err) {
      console.error('[projets] Impossible de charger les projets', err)
      projects = []
    }
    return projects
  })()
  return loading
}

export const getProject = (slug) => projects.find((p) => p.slug === slug) || null

// Projet suivant dans l'ordre (boucle)
export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return i === -1 || projects.length < 2 ? null : projects[(i + 1) % projects.length]
}
