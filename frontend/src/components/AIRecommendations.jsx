import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Package } from 'lucide-react'
import { getReorderSuggestions } from '../api'

function AIRecommendations() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReorderSuggestions()
      .then(setSuggestions)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-surface/40 border border-primary/10 border-l-2 border-l-primary rounded-2xl p-5 shadow-[0_0_24px_-8px_rgba(126,54,226,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
          <Sparkles size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="text-white font-medium text-sm">AI Sipariş Önerileri</h3>
          <p className="text-white/40 text-xs">Talep tahminine dayalı öneriler</p>
        </div>
      </div>

      {loading && <p className="text-white/40 text-sm">Analiz ediliyor...</p>}

      {!loading && suggestions.length === 0 && (
        <div className="text-center py-6">
          <Package size={24} className="text-white/20 mx-auto mb-2" />
          <p className="text-white/40 text-sm">Şu an sipariş önerisi yok, stoklar yeterli 👍</p>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s) => (
            <div
              key={s.product_id}
              className="flex items-center justify-between bg-background/40 border border-warning/20 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
                  <TrendingUp size={16} className="text-warning" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{s.product_name}</p>
                  <p className="text-white/40 text-xs">{s.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-warning font-bold text-sm">{s.suggested_quantity} adet</p>
                <p className="text-white/30 text-xs">önerilen sipariş</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIRecommendations