// ─────────────────────────────────────────────────────────────
//  Client Supabase (lecture seule côté site).
//  Clé publique (anon / publishable) uniquement : la RLS protège
//  les données. null si les variables ne sont pas configurées.
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Pas de session à garder : le site ne fait que lire des données publiques
export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null
export const BUCKET = 'projects'
