import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, Menu, LogOut } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import { useAuth } from '../context/AuthContext'

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-background/70 backdrop-blur-xl border-b border-primary/10 flex items-center justify-between px-4 md:px-6 gap-3">
      <button onClick={onMenuClick} className="md:hidden text-white/60 hover:text-white flex-shrink-0">
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Ara..."
          className="w-full bg-surface/50 border border-primary/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_16px_-4px_rgba(126,54,226,0.4)] transition-all"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <NotificationDropdown />

        <div className="relative pl-2 md:pl-3 border-l border-primary/10" ref={ref}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <User size={16} className="text-primary" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-primary/20 rounded-2xl shadow-2xl overflow-hidden animate-modal-in z-50">
              <div className="p-4 border-b border-primary/10">
                <p className="text-white text-sm font-medium">{user?.username}</p>
                <p className="text-white/40 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-error/10 hover:text-error transition-colors"
              >
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar