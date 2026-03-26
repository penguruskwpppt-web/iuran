export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID')
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

export function getMonthName(date) {
  return new Date(date).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
}

export function showToast(message, type = 'info') {
  // Implementasi sederhana alert, bisa pakai library toast
  alert(message)
}
