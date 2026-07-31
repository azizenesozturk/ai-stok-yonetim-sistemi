import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Boxes, Truck, ArrowLeftRight, Settings, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Package, label: 'Ürünler', path: '/products' },
  { icon: Boxes, label: 'Kategoriler', path: '/categories' },
  { icon: Truck, label: 'Tedarikçiler', path: '/suppliers' },
  { icon: ArrowLeftRight, label: 'Stok Hareketleri', path: '/movements' },
  { icon: Settings, label: 'Ayarlar', path: '/settings' },
]

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobilde karartma arka planı - sidebar açıkken içeriğin üstüne gelir */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface/40 backdrop-blur-xl border-r border-primary/10 flex flex-col z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-6 border-b border-primary/10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
              StokAI
            </h1>
            <p className="text-xs text-white/40 mt-1">Envanter Yönetimi</p>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-primary/15 text-primary border border-primary/20 glow-primary'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary/10">
  {user && (
    <div className="flex items-center justify-between mb-3 px-1">
      <div>
        <p className="text-sm text-white/80 font-medium">{user.username}</p>
        <p className="text-xs text-white/30">{user.email}</p>
      </div>
      <button
        onClick={logout}
        className="p-1.5 rounded-lg text-white/40 hover:text-error hover:bg-white/5 transition-colors"
        title="Çıkış Yap"
      >
        <LogOut size={16} />
      </button>
    </div>
  )}
  <p className="text-xs text-white/30">v0.1.0 · Portföy Projesi</p>
</div>
      </aside>
    </>
  )
}

export default Sidebar