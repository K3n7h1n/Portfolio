// ─────────────────────────────────────────────────────────────
//  Client Supabase (lecture seule côté site).
//  Clé publique (anon / publishable) uniquement : la RLS protège
//  les données. null si les variables ne sont pas configurées.
//
//  Le site ne fait qu'une lecture de table (PostgREST) et construit
//  des URL publiques du Storage : un simple fetch suffit. On évite
//  ainsi d'embarquer @supabase/supabase-js (auth, realtime, storage…),
//  soit ~800 Ko de sources dans le bundle principal. Les requêtes
//  envoyées sont les mêmes que celles du client officiel
//  (en-têtes apikey + Authorization: Bearer <clé>).
//  Les scripts Node (scripts/*.js) continuent d'utiliser supabase-js.
// ─────────────────────────────────────────────────────────────
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const BUCKET = 'projects'

function baseUrl() {
  if (!url || !anonKey || !/^https?:\/\//i.test(url)) return null
  try {
    return new URL(url.endsWith('/') ? url : `${url}/`)
  } catch {
    return null
  }
}

function createClient(base) {
  const rest = new URL('rest/v1', base).href
  const storage = new URL('storage/v1', base).href
  const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }

  return {
    // Équivalent de supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    publicUrl: (bucket, path) => encodeURI(`${storage}/object/public/${bucket}/${path.replace(/^\/+/, '')}`),

    // GET /rest/v1/<table>?<params> → lignes (lève une erreur si la requête échoue)
    async select(table, params, { signal } = {}) {
      const query = new URLSearchParams(params)
      const res = await fetch(`${rest}/${table}?${query}`, { headers, signal })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        const err = new Error(body?.message || `HTTP ${res.status}`)
        Object.assign(err, body, { status: res.status })
        throw err
      }
      return body
    },
  }
}

const base = baseUrl()
export const supabase = base ? createClient(base) : null
