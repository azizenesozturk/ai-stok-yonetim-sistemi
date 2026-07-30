import { useEffect, useState } from 'react'
import { Plus, Boxes, Pencil, Trash2, X } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  function startEdit(c) {
    setEditingId(c.id)
    setEditForm({ name: c.name, description: c.description || '' })
  }

  async function handleEditSave(id) {
    setError(null)
    try {
      await updateCategory(id, editForm)
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    try {
      await deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
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
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)]"
        >
          <Plus size={16} />
          Yeni Kategori
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-surface/40 border border-primary/10 rounded-2xl p-5 mb-6 space-y-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-white/40">Yükleniyor...</p>}
        {!loading && categories.length === 0 && <p className="text-white/40">Henüz kategori yok</p>}
        {!loading && categories.map((c) => (
          <div key={c.id} className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
            {editingId === c.id ? (
              <div className="space-y-2">
                <input
                  value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary/40"
                />
                <input
                  value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Açıklama"
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleEditSave(c.id)} className="text-xs bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg">
                    Kaydet
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-white/50 hover:text-white px-3 py-1.5">
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Boxes size={18} className="text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-white/40 hover:text-primary hover:bg-white/5 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-white/40 hover:text-error hover:bg-white/5 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-medium">{c.name}</h3>
                <p className="text-white/40 text-sm mt-1">{c.description || 'Açıklama yok'}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-error/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-modal-in">
            <h3 className="text-lg font-bold text-white mb-2">Kategoriyi Sil</h3>
            <p className="text-white/50 text-sm mb-5">
              <strong className="text-white">{deleteTarget.name}</strong> kategorisini silmek istediğine emin misin?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white">
                İptal
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-sm bg-error hover:bg-error/90 text-white font-medium">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories