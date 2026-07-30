import { useEffect, useState, useRef } from 'react'
import { Bell, AlertTriangle, AlertOctagon } from 'lucide-react'
import { getLowStockProducts, getAllAnomalies } from '../api'
import { useNavigate } from 'react-router-dom'

function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [lowStock, setLowStock] = useState([])
  const [anomalies, setAnomalies] = useState([])
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getLowStockProducts(), getAllAnomalies()])
      .then(([ls, an]) => {
        setLowStock(ls)
        setAnomalies(an)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalCount = lowStock.length + anomalies.length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
      >
        <Bell size={18} className="text-white/60" />
        {totalCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-primary/20 rounded-2xl shadow-2xl overflow-hidden animate-modal-in z-50">
          <div className="p-4 border-b border-primary/10">
            <h3 className="text-white font-medium text-sm">Bildirimler</h3>
            <p className="text-white/40 text-xs">{totalCount} yeni bildirim</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {totalCount === 0 && (
              <p className="text-white/40 text-sm text-center py-8">Yeni bildirim yok 👍</p>
            )}

            {lowStock.map((p) => (
              <button
                key={`low-${p.id}`}
                onClick={() => { navigate(`/products/${p.id}`); setOpen(false) }}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5"
              >
                <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm">{p.name}</p>
                  <p className="text-white/40 text-xs">Kritik stok: {p.current_stock} adet kaldı</p>
                </div>
              </button>
            ))}

            {anomalies.map((a) => (
              <button
                key={`anomaly-${a.product_id}`}
                onClick={() => { navigate(`/products/${a.product_id}`); setOpen(false) }}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5"
              >
                <AlertOctagon size={16} className="text-error mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm">{a.product_name}</p>
                  <p className="text-white/40 text-xs">Anomali tespit edildi</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown