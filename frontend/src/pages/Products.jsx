import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { getProducts } from '../api'
import AddProductModal from '../components/AddProductModal'
import { useNavigate } from 'react-router-dom'

function Products() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  function loadProducts() {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Ürünler</h2>
          <p className="text-white/40 text-sm">Tüm ürünlerinizi yönetin</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)] active:scale-95"
        >
          <Plus size={16} />
          Yeni Ürün
        </button>
      </div>

      <div className="relative w-80 mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün adı veya SKU ara..."
          className="w-full bg-surface/50 border border-primary/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
        />
      </div>

      <div className="bg-surface/40 border border-primary/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-white/40 text-left">
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Ürün Adı</th>
              <th className="px-5 py-3 font-medium">Fiyat</th>
              <th className="px-5 py-3 font-medium">Stok</th>
              <th className="px-5 py-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-white/40">Yükleniyor...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-white/40">Ürün bulunamadı</td></tr>
            )}
            {!loading && filtered.map((p) => {
              const isLow = p.current_stock <= p.min_stock_level
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.04] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-white/60 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-3 text-white">{p.name}</td>
                  <td className="px-5 py-3 text-white/80">{p.price.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-5 py-3 text-white/80">{p.current_stock}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs border ${
                      isLow ? 'bg-error/10 text-error border-error/20' : 'bg-success/10 text-success border-success/20'
                    }`}>
                      {isLow ? 'Kritik Stok' : 'Yeterli'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadProducts}
      />
    </div>
  )
}

export default Products