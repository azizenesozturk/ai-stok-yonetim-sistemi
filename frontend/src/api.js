const BASE_URL = 'http://127.0.0.1:8000'

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products/`)
  if (!res.ok) throw new Error('Ürünler alınamadı')
  return res.json()
}

export async function getLowStockProducts() {
  const res = await fetch(`${BASE_URL}/products/?low_stock_only=true`)
  if (!res.ok) throw new Error('Kritik stok verisi alınamadı')
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories/`)
  if (!res.ok) throw new Error('Kategoriler alınamadı')
  return res.json()
}

export async function createProduct(product) {
  const res = await fetch(`${BASE_URL}/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Ürün eklenemedi')
  }
  return res.json()
}

export async function getSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers/`)
  if (!res.ok) throw new Error('Tedarikçiler alınamadı')
  return res.json()
}

export async function getStockMovements() {
  const res = await fetch(`${BASE_URL}/stock-movements/`)
  if (!res.ok) throw new Error('Stok hareketleri alınamadı')
  return res.json()
}

export async function createStockMovement(movement) {
  const res = await fetch(`${BASE_URL}/stock-movements/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Tedarikçi eklenemedi')
  }
  return res.json()
}

export async function getReorderSuggestions() {
  const res = await fetch(`${BASE_URL}/forecast/`)
  if (!res.ok) throw new Error('AI önerileri alınamadı')
  return res.json()
}

export async function getProductForecast(productId, days = 7) {
  const res = await fetch(`${BASE_URL}/forecast/${productId}?days=${days}`)
  if (!res.ok) throw new Error('Tahmin verisi alınamadı')
  return res.json()
}

export async function getSalesHistory(productId, days = 30) {
  const res = await fetch(`${BASE_URL}/forecast/${productId}/history?days=${days}`)
  if (!res.ok) throw new Error('Satış geçmişi alınamadı')
  return res.json()
}

export async function getProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`)
  if (!res.ok) throw new Error('Ürün bulunamadı')
  return res.json()
}

export async function getAllAnomalies() {
  const res = await fetch(`${BASE_URL}/forecast/anomalies/all`)
  if (!res.ok) throw new Error('Anomali verisi alınamadı')
  return res.json()
}