import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Pencil, Trash2, X } from 'lucide-react'
import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts'
import { getProduct, getSalesHistory, getProductForecast, updateProduct, deleteProduct, getCategories, getSuppliers } from '../api'

const trendIcons = {
  artan: TrendingUp,
  azalan: TrendingDown,
  stabil: Minus,
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [editForm, setEditForm] = useState({})
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function loadData() {
    setLoading(true)
    Promise.all([
      getProduct(id),
      getSalesHistory(id, 30),
      getProductForecast(id, 7),
    ])
      .then(([p, h, f]) => {
        setProduct(p)
        setHistory(h)
        setForecast(f)
        setEditForm({
          name: p.name,
          description: p.description || '',
          price: p.price,
          cost: p.cost,
          min_stock_level: p.min_stock_level,
          category_id: p.category_id || '',
          supplier_id: p.supplier_id || '',
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [id])

  function openEdit() {
    getCategories().then(setCategories).catch(() => {})
    getSuppliers().then(setSuppliers).catch(() => {})
    setEditOpen(true)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await updateProduct(id, {
        ...editForm,
        price: parseFloat(editForm.price),
        cost: parseFloat(editForm.cost),
        min_stock_level: parseInt(editForm.min_stock_level),
        category_id: editForm.category_id ? parseInt(editForm.category_id) : null,
        supplier_id: editForm.supplier_id ? parseInt(editForm.supplier_id) : null,
      })
      setEditOpen(false)
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteProduct(id)
      navigate('/products')
    } catch (err) {
      setError(err.message)
      setDeleteConfirmOpen(false)
    }
  }

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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{product.current_stock} <span className="text-sm text-white/40">adet stokta</span></p>
            <p className="text-white/40 text-sm">{product.price.toLocaleString('tr-TR')} ₺ / adet</p>
          </div>
          <button
            onClick={openEdit}
            className="p-2.5 rounded-xl bg-surface/60 border border-primary/10 text-white/60 hover:text-primary hover:border-primary/30 transition-colors"
            title="Düzenle"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="p-2.5 rounded-xl bg-surface/60 border border-error/10 text-white/60 hover:text-error hover:border-error/30 transition-colors"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2 mb-4">
          {error}
        </div>
      )}

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

      {/* Düzenleme Modalı */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-primary/20 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-modal-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Ürünü Düzenle</h3>
              <button onClick={() => setEditOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required
                placeholder="Ürün Adı"
                className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
              />
              <textarea
                value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Açıklama"
                rows={2}
                className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required
                  type="number" step="0.01" placeholder="Satış Fiyatı"
                  className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
                <input
                  value={editForm.cost} onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                  type="number" step="0.01" placeholder="Maliyet"
                  className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
                />
              </div>
              <input
                value={editForm.min_stock_level} onChange={(e) => setEditForm({ ...editForm, min_stock_level: e.target.value })}
                type="number" placeholder="Kritik Stok Eşiği"
                className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editForm.category_id} onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                  className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
                >
                  <option value="">Kategori Seç</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                  value={editForm.supplier_id} onChange={(e) => setEditForm({ ...editForm, supplier_id: e.target.value })}
                  className="bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40"
                >
                  <option value="">Tedarikçi Seç</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)] disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-error/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-modal-in">
            <h3 className="text-lg font-bold text-white mb-2">Ürünü Sil</h3>
            <p className="text-white/50 text-sm mb-5">
              <strong className="text-white">{product.name}</strong> adlı ürünü silmek istediğine emin misin? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
                İptal
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-sm bg-error hover:bg-error/90 text-white font-medium transition-colors">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail