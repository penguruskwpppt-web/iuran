import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Ganti dengan kredensial Supabase Anda
const supabaseUrl = 'https://wuargtxulaquxpziuzho.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YXJndHh1bGFxdXhweml1emhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjMxNTYsImV4cCI6MjA5MDA5OTE1Nn0.EcVFAGh3ZgTDs8Paz9O_8MpkliKPF0vI7cAuuIsvb2U'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = 'login.html'
  }
  return user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function checkAdmin() {
  const user = await requireAuth()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (error || !profile || profile.role !== 'admin') {
    alert('Akses ditolak. Halaman ini hanya untuk admin.')
    window.location.href = 'dashboard.html'
    return false
  }
  return true
}
