// ─────────────────────────────────────────────────────────────
//  Modèle commun des projets (source Supabase ou fichiers locaux) :
//  logos d'outils, vidéos, Markdown, tri et visuel généré.
// ─────────────────────────────────────────────────────────────
import { marked } from 'marked'

// Logos disponibles dans /public/logo (clé = nom normalisé de l'outil)
export const LOGOS = {
  photoshop: 'photoshop.svg',
  illustrator: 'illustrator.svg',
  indesign: 'indesign.png',
  premiere: 'premiere.svg',
  premierepro: 'premiere.svg',
  aftereffects: 'after-effects.svg',
  audition: 'audition.svg',
  figma: 'figma.svg',
  affinity: 'affinity.svg',
  canva: 'canva.svg',
  davinci: 'davinci.svg',
  davinciresolve: 'davinci.svg',
  astro: 'astro.jpg',
  tailwind: 'tailwind.svg',
  tailwindcss: 'tailwind.svg',
  notion: 'notion.svg',
  react: 'react.svg',
  javascript: 'javascript.svg',
  js: 'javascript.svg',
  htmlcss: 'html-css.svg',
  html: 'html-css.svg',
  css: 'html-css.svg',
  git: 'git.svg',
  github: 'github.svg',
  vscode: 'vscode.svg',
  visualstudiocode: 'vscode.svg',
  chatgpt: 'chatgpt.svg',
  claude: 'claude.svg',
  gemini: 'gemini.svg',
}

// Couleurs du visuel généré quand un projet n'a pas encore d'image
export const PALETTE = [
  ['#FF0000', '#0D0D0D'],
  ['#f2f2f2', '#FF0000'],
  ['#FF0000', '#f2f2f2'],
  ['#0D0D0D', '#FF0000'],
  ['#0D0D0D', '#f2f2f2'],
  ['#1a1a1a', '#FF0000'],
]

export const normalize = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')

export const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean)

export function toTool(t) {
  const name = typeof t === 'string' ? t : t?.name
  if (!name) return null
  const file = typeof t === 'object' && t.logo ? t.logo : LOGOS[normalize(name)]
  return { name, logo: file ? (file.startsWith('/') ? file : `/logo/${file}`) : null }
}

// Une vidéo : fichier du dossier, fichier distant, YouTube ou TikTok
export function toVideo(v, files) {
  const src = typeof v === 'string' ? v : v?.src
  const title = (typeof v === 'object' && v?.title) || ''
  if (!src) return null

  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) {
    const vertical = src.includes('/shorts/')
    return { kind: 'embed', provider: 'youtube', vertical, title, src: `https://www.youtube-nocookie.com/embed/${yt[1]}` }
  }
  const tt = src.match(/tiktok\.com\/.*?(?:video|embed(?:\/v2)?)\/(\d+)/)
  if (tt) return { kind: 'embed', provider: 'tiktok', vertical: true, title, src: `https://www.tiktok.com/embed/v2/${tt[1]}` }

  if (files[src]) return { kind: 'file', title, src: files[src] }
  if (/^https?:\/\//.test(src)) return { kind: 'file', title, src }
  if (import.meta.env.DEV) console.warn(`[projets] vidéo introuvable : ${src}`)
  return null
}

// Liens externes du Markdown : ouverture dans un nouvel onglet
export const renderMarkdown = (md) =>
  marked.parse(md.trim()).replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')

// Tri, index et visuel généré : identique pour les deux sources
export const finalize = (items) =>
  items
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'))
    .map((p, i) => ({ ...p, index: i, visual: PALETTE[i % PALETTE.length] }))
