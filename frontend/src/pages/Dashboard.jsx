import { useEffect, useState } from 'react'
import { Package, AlertTriangle, DollarSign, Boxes } from 'lucide-react'
import StatCard from '../components/StatCard'
import AIRecommendations from '../components/AIRecommendations'
import { getProducts, getLowStockProducts } from '../api'
import AnomalyAlerts from '../components/AnomalyAlerts'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [allProducts, lowStockProducts] = await Promise.all([
          getProducts(),
          getLowStockProducts(),
        ])
        setProducts(allProducts)
        setLowStock(lowStockProducts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalValue = products.reduce((sum, p) => sum + p.price * p.current_stock, 0)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Genel Bakış</h2>
      <p className="text-white/40 text-sm mb-6">Stok durumunuzun anlık özeti</p>

      {loading && <p className="text-white/40">Yükleniyor...</p>}
      {error && <p className="text-error">Hata: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon={Package} label="Toplam Ürün" value={products.length} accent="primary" />
            <StatCard icon={AlertTriangle} label="Kritik Stok" value={lowStock.length} accent="warning" />
            <StatCard
              icon={DollarSign}
              label="Toplam Envanter Değeri"
              value={totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              suffix="₺"
              accent="success"
            />
            <StatCard
              icon={Boxes}
              label="Toplam Stok Adedi"
              value={products.reduce((sum, p) => sum + p.current_stock, 0)}
              accent="primary"
            />
          </div>
          <AnomalyAlerts />
          <AIRecommendations />
        </>
      )}
    </div>
  )
}

export default Dashboard