import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Boxes, Truck, ArrowLeftRight, Settings } from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Package, label: 'Ürünler', path: '/products' },
  { icon: Boxes, label: 'Kategoriler', path: '/categories' },
  { icon: Truck, label: 'Tedarikçiler', path: '/suppliers' },
  { icon: ArrowLeftRight, label: 'Stok Hareketleri', path: '/movements' },
  { icon: Settings, label: 'Ayarlar', path: '/settings' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface/40 backdrop-blur-xl border-r border-primary/10 flex flex-col">
      <div className="p-6 border-b border-primary/10">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
         StokAI
        </h1>
      <p className="text-xs text-white/40 mt-1">Envanter Yönetimi</p>
    </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.label}
              to={item.path}
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
        <p className="text-xs text-white/30">v0.1.0 · Portföy Projesi</p>
      </div>
    </aside>
  )
}

export default Sidebar