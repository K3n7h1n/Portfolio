import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Précharge dès le HTML ce que l'accueil attend avant de s'afficher (voir useAppReady
// dans App.jsx) : les chunks importés dynamiquement (3D, page projet) et la police
// principale (latin). Sans cela, ils ne seraient demandés qu'après l'exécution du
// JS principal, en cascade.
function preloadCritical() {
  return {
    name: 'k3-preload-critical',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        const tags = []
        for (const file of Object.values(bundle)) {
          if (file.type === 'chunk' && file.isDynamicEntry && /^(Experience|ProjectPage)$/.test(file.name)) {
            const deps = [file.fileName, ...(file.imports || []).filter((f) => !bundle[f]?.isEntry)]
            for (const dep of deps) tags.push({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: true, href: `/${dep}` }, injectTo: 'head' })
          }
          if (file.type === 'asset' && /instrument-sans-latin-wght-normal-.*\.woff2$/.test(file.fileName)) {
            tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: `/${file.fileName}` }, injectTo: 'head' })
          }
        }
        // Doublons possibles (dépendances partagées) : une seule balise par URL
        const seen = new Set()
        return tags.filter((t) => !seen.has(t.attrs.href) && seen.add(t.attrs.href))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadCritical()],
  assetsInclude: ['**/*.glb'],
})
