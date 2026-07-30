import { useEffect, useState } from 'react'
import { Plus, Truck, Pencil, Trash2 } from 'lucide-react'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', contact_email: '', phone: '', lead_time_days: '7' })
  const [error, setError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  function loadData() {
    setLoading(true)
    getSuppliers().then(setSuppliers).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await createSupplier({ ...form, lead_time_days: parseInt(form.lead_time_days) || 7 })
      setForm({ name: '', contact_email: '', phone: '', lead_time_days: '7' })
      setFormOpen(false)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(s) {
    setEditingId(s.id)
    setEditForm({
      name: s.name,
      contact_email: s.contact_email || '',
      phone: s.phone || '',
      lead_time_days: s.lead_time_days,
    })
  }

  async function handleEditSave(id) {
    setError(null)
    try {
      await updateSupplier(id, { ...editForm, lead_time_days: parseInt(editForm.lead_time_days) || 7 })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    try {
      await deleteSupplier(deleteTarget.id)
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
          <h2 className="text-2xl font-bold text-white mb-1">Tedarikçiler</h2>
          <p className="text-white/40 text-sm">Ürün tedarikçilerinizi yönetin</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)]"
        >
          <Plus size={16} />
          Yeni Tedarikçi
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
            placeholder="Tedarikçi Adı"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              placeholder="E-posta"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Telefon"
              className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
          </div>
          <input
            value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })}
            type="number" placeholder="Tedarik Süresi (gün)"
            className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          />
          <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium">
            Kaydet
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-white/40">Yükleniyor...</p>}
        {!loading && suppliers.length === 0 && <p className="text-white/40">Henüz tedarikçi yok</p>}
        {!loading && suppliers.map((s) => (
          <div key={s.id} className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
            {editingId === s.id ? (
              <div className="space-y-2">
                <input
                  value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary/40"
                />
                <input
                  value={editForm.contact_email} onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                  placeholder="E-posta"
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
                <input
                  value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Telefon"
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
                <input
                  value={editForm.lead_time_days} onChange={(e) => setEditForm({ ...editForm, lead_time_days: e.target.value })}
                  type="number" placeholder="Tedarik Süresi"
                  className="w-full bg-background/50 border border-primary/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleEditSave(s.id)} className="text-xs bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg">
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
                    <Truck size={18} className="text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg text-white/40 hover:text-primary hover:bg-white/5 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-white/40 hover:text-error hover:bg-white/5 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-medium">{s.name}</h3>
                <p className="text-white/40 text-sm mt-1">{s.contact_email || 'E-posta yok'}</p>
                <p className="text-white/40 text-xs mt-1">Tedarik süresi: {s.lead_time_days} gün</p>
              </>
            )}
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-error/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-modal-in">
            <h3 className="text-lg font-bold text-white mb-2">Tedarikçiyi Sil</h3>
            <p className="text-white/50 text-sm mb-5">
              <strong className="text-white">{deleteTarget.name}</strong> tedarikçisini silmek istediğine emin misin?
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

export default Suppliers