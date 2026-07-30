import { useEffect, useState } from 'react'
import { Plus, Boxes } from 'lucide-react'
import { getCategories, createCategory } from '../api'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  function loadData() {
    setLoading(true)
    getCategories().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await createCategory(form)
      setForm({ name: '', description: '' })
      setFormOpen(false)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Kategoriler</h2>
          <p className="text-white/40 text-sm">Ürünlerinizi kategorilere ayırın</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Yeni Kategori
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-surface/40 border border-primary/10 rounded-2xl p-5 mb-6 space-y-3">
          {error && <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2">{error}</div>}
          <input
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            placeholder="Kategori Adı"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />
          <input
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Açıklama (opsiyonel)"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />
          <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium">
            Kaydet
          </button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {loading && <p className="text-white/40">Yükleniyor...</p>}
        {!loading && categories.length === 0 && <p className="text-white/40">Henüz kategori yok</p>}
        {!loading && categories.map((c) => (
          <div key={c.id} className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <Boxes size={18} className="text-primary" />
            </div>
            <h3 className="text-white font-medium">{c.name}</h3>
            <p className="text-white/40 text-sm mt-1">{c.description || 'Açıklama yok'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories