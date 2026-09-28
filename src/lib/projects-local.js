// ─────────────────────────────────────────────────────────────
//  Projets depuis src/content/projects/<slug>/ (mode local et REPLI).
//  Un dossier = un projet : project.md (frontmatter YAML + Markdown)
//  + ses images et vidéos, lus au build par Vite (import.meta.glob).
//  Chargé en import dynamique par projects.js seulement si besoin :
//  Vite le place dans un morceau séparé, avec les médias locaux.
// ─────────────────────────────────────────────────────────────
import { parse as parseYaml } from 'yaml'
import { list, renderMarkdown, toTool, toVideo } from './project-model'

const sources = import.meta.glob('../content/projects/*/project.md', { query: '?raw', import: 'default', eager: true })
const assets = import.meta.glob('../content/projects/*/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,mp4,webm,MP4,WEBM}', {
  query: '?url',
  import: 'default',
  eager: true,
})

const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i
const VIDEO = /\.(mp4|webm)$/i

// Sépare le frontmatter (entre deux lignes ---) du corps Markdown
function splitFrontmatter(raw) {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/)
  if (!m) return { data: {}, body: raw }
  return { data: parseYaml(m[1]) || {}, body: m[2] || '' }
}

function buildProject(path, raw) {
  const slug = path.split('/').at(-2)
  const { data, body } = splitFrontmatter(raw)

  // Médias du dossier, triés par nom de fichier
  const prefix = path.replace(/project\.md$/, '')
  const files = {}
  Object.keys(assets)
    .filter((p) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))
    .forEach((p) => (files[p.slice(prefix.length)] = assets[p]))
  const imageNames = Object.keys(files).filter((f) => IMAGE.test(f))

  const pick = (name) => (files[name] ? files[name] : /^(https?:)?\//.test(name) ? name : null)
  const galleryNames = data.gallery ? list(data.gallery) : imageNames
  const gallery = galleryNames.map(pick).filter(Boolean)
  const cover = (data.cover && pick(data.cover)) || gallery[0] || (imageNames[0] && files[imageNames[0]]) || null

  const tools = list(data.tools).map(toTool).filter(Boolean)
  const title = data.title ? String(data.title) : slug

  return {
    slug,
    title,
    order: typeof data.order === 'number' ? data.order : 999,
    category: data.category || '',
    short: data.short || '',
    tag: data.tag || tools.slice(0, 2).map((t) => t.name).join(' · '),
    role: data.role || '',
    client: data.client || '',
    year: data.year ? String(data.year) : '',
    tools,
    links: list(data.links).filter((l) => l && l.url).map((l) => ({ label: l.label || 'Voir le projet', url: l.url })),
    videos: list(data.videos).map((v) => toVideo(v, files)).filter(Boolean),
    cover,
    gallery,
    html: body.trim() ? renderMarkdown(body) : '',
    draft: data.draft === true,
  }
}

// Projets bruts : le tri et l'index sont faits par finalize() dans projects.js
export const localProjects = Object.entries(sources).map(([path, raw]) => buildProject(path, raw))
