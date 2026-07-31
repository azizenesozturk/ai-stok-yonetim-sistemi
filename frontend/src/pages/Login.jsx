import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
            StokAI
          </h1>
          <p className="text-white/40 text-sm mt-1">Envanter Yönetimi</p>
        </div>

        <div className="bg-surface/40 backdrop-blur-xl border border-primary/10 rounded-2xl p-6 shadow-[0_0_30px_-8px_rgba(126,54,226,0.2)]">
          <div className="flex gap-2 mb-6 bg-background/50 rounded-xl p-1">
            <button
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-primary text-white' : 'text-white/50'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-primary text-white' : 'text-white/50'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              placeholder="Kullanıcı Adı"
              className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />

            {mode === 'register' && (
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                type="email"
                placeholder="E-posta"
                className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
              />
            )}

            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              type="password"
              placeholder="Şifre"
              className="w-full bg-background/50 border border-primary/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_-4px_rgba(126,54,226,0.6)] disabled:opacity-50 mt-2"
            >
              {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
              {loading ? 'Yükleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login