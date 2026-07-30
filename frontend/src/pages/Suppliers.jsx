import { useEffect, useState } from 'react'
import { Plus, Truck } from 'lucide-react'
import { getSuppliers, createSupplier } from '../api'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', contact_email: '', phone: '', lead_time_days: '7' })
  const [error, setError] = useState(null)

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Tedarikçiler</h2>
          <p className="text-white/40 text-sm">Ürün tedarikçilerinizi yönetin</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Yeni Tedarikçi
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-surface/40 border border-primary/10 rounded-2xl p-5 mb-6 space-y-3">
          {error && <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2">{error}</div>}
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

      <div className="grid grid-cols-3 gap-4">
        {loading && <p className="text-white/40">Yükleniyor...</p>}
        {!loading && suppliers.length === 0 && <p className="text-white/40">Henüz tedarikçi yok</p>}
        {!loading && suppliers.map((s) => (
          <div key={s.id} className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <Truck size={18} className="text-primary" />
            </div>
            <h3 className="text-white font-medium">{s.name}</h3>
            <p className="text-white/40 text-sm mt-1">{s.contact_email || 'E-posta yok'}</p>
            <p className="text-white/40 text-xs mt-1">Tedarik süresi: {s.lead_time_days} gün</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Suppliers