import { useEffect, useState } from 'react'
import { AlertOctagon, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { getAllAnomalies } from '../api'

function AnomalyAlerts() {
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllAnomalies()
      .then(setAnomalies)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (anomalies.length === 0) return null

  return (
    <div className="bg-surface/40 border border-error/20 border-l-2 border-l-error rounded-2xl p-5 mb-6 shadow-[0_0_24px_-8px_rgba(228,35,75,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-error/15 border border-error/20 flex items-center justify-center">
          <AlertOctagon size={16} className="text-error" />
        </div>
        <div>
          <h3 className="text-white font-medium text-sm">Anomali Uyarıları</h3>
          <p className="text-white/40 text-xs">Son 30 günde beklenenden sapan satış hareketleri</p>
        </div>
      </div>

      <div className="space-y-2">
        {anomalies.map((a) => {
          const isHigh = a.latest_anomaly.type === 'yüksek_satış'
          const Icon = isHigh ? ArrowUpCircle : ArrowDownCircle
          return (
            <div
              key={a.product_id}
              className="flex items-center justify-between bg-background/40 border border-error/10 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isHigh ? 'text-warning' : 'text-error'} />
                <div>
                  <p className="text-white text-sm font-medium">{a.product_name}</p>
                  <p className="text-white/40 text-xs">
                    {new Date(a.latest_anomaly.date).toLocaleDateString('tr-TR')} tarihinde{' '}
                    {a.latest_anomaly.quantity} adet satış (beklenen ort. {a.latest_anomaly.expected_average})
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg border ${
                isHigh
                  ? 'bg-warning/10 text-warning border-warning/20'
                  : 'bg-error/10 text-error border-error/20'
              }`}>
                z = {a.latest_anomaly.z_score}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AnomalyAlerts