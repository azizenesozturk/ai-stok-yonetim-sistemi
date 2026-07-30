import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getProduct, getSalesHistory, getProductForecast } from '../api'

const trendIcons = {
  artan: TrendingUp,
  azalan: TrendingDown,
  stabil: Minus,
}

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProduct(id),
      getSalesHistory(id, 30),
      getProductForecast(id, 7),
    ])
      .then(([p, h, f]) => {
        setProduct(p)
        setHistory(h)
        setForecast(f)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-white/40">Yükleniyor...</p>
  if (!product) return <p className="text-error">Ürün bulunamadı</p>

  const TrendIcon = forecast?.has_enough_data ? trendIcons[forecast.trend] : Minus

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} />
        Ürünlere Dön
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{product.name}</h2>
          <p className="text-white/40 text-sm font-mono">{product.sku}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{product.current_stock} <span className="text-sm text-white/40">adet stokta</span></p>
          <p className="text-white/40 text-sm">{product.price.toLocaleString('tr-TR')} ₺ / adet</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-1">Kritik Stok Eşiği</p>
          <p className="text-xl font-bold text-white">{product.min_stock_level} adet</p>
        </div>

        {forecast?.has_enough_data ? (
          <>
            <div className="bg-surface/40 border border-primary/10 rounded-2xl p-5">
              <p className="text-white/40 text-xs mb-1">7 Günlük Tahmin</p>
              <p className="text-xl font-bold text-primary">{forecast.total_forecast} adet</p>
            </div>
            <div className="bg-surface/40 border border-primary/10 rounded-2xl p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                forecast.trend === 'artan' ? 'bg-success/10 border border-success/20' :
                forecast.trend === 'azalan' ? 'bg-error/10 border border-error/20' :
                'bg-white/5 border border-white/10'
              }`}>
                <TrendIcon size={18} className={
                  forecast.trend === 'artan' ? 'text-success' :
                  forecast.trend === 'azalan' ? 'text-error' : 'text-white/50'
                } />
              </div>
              <div>
                <p className="text-white/40 text-xs">Trend</p>
                <p className="text-white font-medium capitalize">{forecast.trend}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-surface/40 border border-primary/10 rounded-2xl p-5 col-span-2">
            <p className="text-white/40 text-sm">Tahmin için yeterli veri yok</p>
          </div>
        )}
      </div>

      <div className="bg-surface/40 border border-primary/10 rounded-2xl p-6">
        <h3 className="text-white font-medium mb-4">Son 30 Günlük Satış Geçmişi</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7E36E2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7E36E2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#ffffff60', fontSize: 11 }}
              tickFormatter={(d) => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
              interval={4}
            />
            <YAxis tick={{ fill: '#ffffff60', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0F2A2A', border: '1px solid #7E36E230', borderRadius: '12px' }}
              labelStyle={{ color: '#ffffff90' }}
              labelFormatter={(d) => new Date(d).toLocaleDateString('tr-TR')}
            />
            <Area type="monotone" dataKey="quantity" stroke="#7E36E2" strokeWidth={2} fill="url(#colorSales)" name="Satış Adedi" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ProductDetail