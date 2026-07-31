import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const BASE_URL = 'http://127.0.0.1:8000'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Geçersiz oturum')
          return res.json()
        })
        .then(setUser)
        .catch(() => {
          setToken(null)
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  async function login(username, password) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Giriş başarısız')
    }

    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    setToken(data.access_token)
  }

  async function register(username, email, password) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Kayıt başarısız')
    }

    // Kayıt sonrası otomatik giriş yap
    await login(username, password)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}