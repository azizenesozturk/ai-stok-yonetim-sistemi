import { useState } from 'react'
import { User, Lock, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api'

function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ current: '', new: '', confirm: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (form.new !== form.confirm) {
      setError('Yeni şifreler eşleşmiyor')
      return
    }
    if (form.new.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalı')
      return
    }

    setSaving(true)
    try {
      await changePassword(form.current, form.new)
      setSuccess(true)
      setForm({ current: '', new: '', confirm: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Ayarlar</h2>
      <p className="text-white/40 text-sm mb-6">Hesap bilgilerinizi yönetin</p>

      <div className="max-w-lg space-y-6">
        {/* Profil Bilgisi */}
        <div className="bg-surface/40 border border-primary/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <h3 className="text-white font-medium text-sm">Profil Bilgisi</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-white/40 text-xs mb-1">Kullanıcı Adı</p>
              <p className="text-white text-sm">{user?.username}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">E-posta</p>
              <p className="text-white text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-surface/40 border border-primary/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Lock size={16} className="text-primary" />
            </div>
            <h3 className="text-white font-medium text-sm">Şifre Değiştir</h3>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 text-success text-sm rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
              <Check size={14} />
              Şifre başarıyla güncellendi
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              required
              placeholder="Mevcut Şifre"
              className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              type="password"
              value={form.new}
              onChange={(e) => setForm({ ...form, new: e.target.value })}
              required
              placeholder="Yeni Şifre"
              className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              placeholder="Yeni Şifre (Tekrar)"
              className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)] disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings