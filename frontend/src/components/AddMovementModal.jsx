import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createStockMovement, getProducts } from '../api'

const movementTypes = [
  { value: 'giris', label: 'Giriş (Stok Ekleme)' },
  { value: 'cikis', label: 'Çıkış (Satış)' },
  { value: 'iade', label: 'İade' },
  { value: 'fire', label: 'Fire / Kayıp' },
]

function AddMovementModal({ isOpen, onClose, onSuccess }) {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    product_id: '',
    movement_type: 'cikis',
    quantity: '',
    note: '',
  })

  useEffect(() => {
    if (isOpen) {
      getProducts().then(setProducts).catch(() => {})
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
      await createStockMovement({
        ...form,
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity),
      })
      onSuccess()
      onClose()
      setForm({ product_id: '', movement_type: 'cikis', quantity: '', note: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-primary/20 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Stok Hareketi Ekle</h3>
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
          <select
            name="product_id" value={form.product_id} onChange={handleChange} required
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
          >
            <option value="">Ürün Seç</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (Stok: {p.current_stock})</option>
            ))}
          </select>

          <select
            name="movement_type" value={form.movement_type} onChange={handleChange}
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
          >
            {movementTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <input
            name="quantity" value={form.quantity} onChange={handleChange} required
            type="number" min="1" placeholder="Miktar"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />

          <input
            name="note" value={form.note} onChange={handleChange}
            placeholder="Not (opsiyonel)"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />

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
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMovementModal