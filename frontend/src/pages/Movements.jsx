import { useEffect, useState } from 'react'
import { Plus, ArrowUp, ArrowDown, RotateCcw, AlertOctagon } from 'lucide-react'
import { getStockMovements, getProducts } from '../api'
import AddMovementModal from '../components/AddMovementModal'

const typeConfig = {
  giris: { label: 'Giriş', icon: ArrowUp, color: 'text-success bg-success/10 border-success/20' },
  cikis: { label: 'Çıkış', icon: ArrowDown, color: 'text-error bg-error/10 border-error/20' },
  iade: { label: 'İade', icon: RotateCcw, color: 'text-primary bg-primary/10 border-primary/20' },
  fire: { label: 'Fire', icon: AlertOctagon, color: 'text-warning bg-warning/10 border-warning/20' },
}

function Movements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  function loadData() {
    setLoading(true)
    Promise.all([getStockMovements(), getProducts()])
      .then(([m, p]) => {
        setMovements(m)
        setProducts(p)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  function productName(id) {
    return products.find((p) => p.id === id)?.name || `Ürün #${id}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Stok Hareketleri</h2>
          <p className="text-white/40 text-sm">Tüm giriş, çıkış ve iade kayıtları</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Hareket Ekle
        </button>
      </div>

      <div className="bg-surface/40 border border-primary/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-white/40 text-left">
              <th className="px-5 py-3 font-medium">Ürün</th>
              <th className="px-5 py-3 font-medium">Tip</th>
              <th className="px-5 py-3 font-medium">Miktar</th>
              <th className="px-5 py-3 font-medium">Not</th>
              <th className="px-5 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-white/40">Yükleniyor...</td></tr>
            )}
            {!loading && movements.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-white/40">Henüz hareket yok</td></tr>
            )}
            {!loading && movements.map((m) => {
              const config = typeConfig[m.movement_type]
              const Icon = config.icon
              return (
                <tr key={m.id} className="border-b border-primary/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white">{productName(m.product_id)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${config.color}`}>
                      <Icon size={12} />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/80">{m.quantity}</td>
                  <td className="px-5 py-3 text-white/50">{m.note || '—'}</td>
                  <td className="px-5 py-3 text-white/40 text-xs">
                    {new Date(m.created_at).toLocaleString('tr-TR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AddMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}

export default Movements