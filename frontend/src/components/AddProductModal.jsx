import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createProduct, getCategories, getSuppliers } from '../api'

function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    cost: '',
    current_stock: '',
    min_stock_level: '10',
    category_id: '',
    supplier_id: '',
  })

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories).catch(() => {})
      getSuppliers().then(setSuppliers).catch(() => {})
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price) || 0,
        cost: parseFloat(form.cost) || 0,
        current_stock: parseInt(form.current_stock) || 0,
        min_stock_level: parseInt(form.min_stock_level) || 10,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        supplier_id: form.supplier_id ? parseInt(form.supplier_id) : null,
      })
      onSuccess()
      onClose()
      setForm({
        sku: '', name: '', description: '', price: '', cost: '',
        current_stock: '', min_stock_level: '10', category_id: '', supplier_id: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-primary/20 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Yeni Ürün Ekle</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="sku" value={form.sku} onChange={handleChange} required
              placeholder="SKU (örn. ELK-002)"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="Ürün Adı"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
          </div>

          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Açıklama (opsiyonel)"
            rows={2}
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price" value={form.price} onChange={handleChange} required
              type="number" step="0.01" placeholder="Satış Fiyatı (₺)"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              name="cost" value={form.cost} onChange={handleChange}
              type="number" step="0.01" placeholder="Maliyet (₺)"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="current_stock" value={form.current_stock} onChange={handleChange} required
              type="number" placeholder="Başlangıç Stoğu"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              name="min_stock_level" value={form.min_stock_level} onChange={handleChange}
              type="number" placeholder="Kritik Stok Eşiği"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              name="category_id" value={form.category_id} onChange={handleChange}
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
            >
              <option value="">Kategori Seç</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              name="supplier_id" value={form.supplier_id} onChange={handleChange}
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
            >
              <option value="">Tedarikçi Seç</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal