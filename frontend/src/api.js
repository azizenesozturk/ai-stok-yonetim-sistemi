const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products/`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Ürünler alınamadı')
  return res.json()
}

export async function getLowStockProducts() {
  const res = await fetch(`${BASE_URL}/products/?low_stock_only=true`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Kritik stok verisi alınamadı')
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories/`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Kategoriler alınamadı')
  return res.json()
}

export async function createProduct(product) {
  const res = await fetch(`${BASE_URL}/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Ürün eklenemedi')
  }
  return res.json()
}

export async function getSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers/`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Tedarikçiler alınamadı')
  return res.json()
}

export async function getStockMovements() {
  const res = await fetch(`${BASE_URL}/stock-movements/`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Stok hareketleri alınamadı')
  return res.json()
}

export async function createStockMovement(movement) {
  const res = await fetch(`${BASE_URL}/stock-movements/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(movement),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Hareket kaydedilemedi')
  }
  return res.json()
}

export async function createCategory(category) {
  const res = await fetch(`${BASE_URL}/categories/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(category),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Kategori eklenemedi')
  }
  return res.json()
}

export async function createSupplier(supplier) {
  const res = await fetch(`${BASE_URL}/suppliers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(supplier),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Tedarikçi eklenemedi')
  }
  return res.json()
}

export async function getReorderSuggestions() {
  const res = await fetch(`${BASE_URL}/forecast/`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('AI önerileri alınamadı')
  return res.json()
}

export async function getProductForecast(productId, days = 7) {
  const res = await fetch(`${BASE_URL}/forecast/${productId}?days=${days}`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Tahmin verisi alınamadı')
  return res.json()
}

export async function getSalesHistory(productId, days = 30) {
  const res = await fetch(`${BASE_URL}/forecast/${productId}/history?days=${days}`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Satış geçmişi alınamadı')
  return res.json()
}

export async function getProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Ürün bulunamadı')
  return res.json()
}

export async function getAllAnomalies() {
  const res = await fetch(`${BASE_URL}/forecast/anomalies/all`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Anomali verisi alınamadı')
  return res.json()
}

export async function updateProduct(productId, updates) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Ürün güncellenemedi')
  }
  return res.json()
}

export async function deleteProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Ürün silinemedi')
  }
  return res.json()
}

export async function updateCategory(categoryId, updates) {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Kategori güncellenemedi')
  }
  return res.json()
}

export async function deleteCategory(categoryId) {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Kategori silinemedi')
  }
  return res.json()
}

export async function updateSupplier(supplierId, updates) {
  const res = await fetch(`${BASE_URL}/suppliers/${supplierId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Tedarikçi güncellenemedi')
  }
  return res.json()
}

export async function deleteSupplier(supplierId) {
  const res = await fetch(`${BASE_URL}/suppliers/${supplierId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Tedarikçi silinemedi')
  }
  return res.json()
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Şifre değiştirilemedi')
  }
  return res.json()
}