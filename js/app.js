import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Ganti dengan kredensial Supabase Anda
const supabaseUrl = 'https://wuargtxulaquxpziuzho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YXJndHh1bGFxdXhweml1emhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjMxNTYsImV4cCI6MjA5MDA5OTE1Nn0.EcVFAGh3ZgTDs8Paz9O_8MpkliKPF0vI7cAuuIsvb2U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fungsi untuk mengecek sesi login, redirect jika belum login
export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = 'login.html'
  }
  return user
}

// Fungsi untuk mengambil profil user (role)
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}
