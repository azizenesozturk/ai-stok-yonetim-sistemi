import { Search, User, Menu } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'

function Topbar({ onMenuClick }) {
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
        <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-primary/10">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar