function StatCard({ icon: Icon, label, value, accent = 'primary', suffix = '' }) {
  const accentClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
  }

  const staticGlow = {
    primary: 'shadow-[0_0_20px_-6px_rgba(126,54,226,0.3)]',
    success: 'shadow-[0_0_20px_-6px_rgba(0,191,166,0.25)]',
    warning: 'shadow-[0_0_20px_-6px_rgba(245,206,10,0.2)]',
    error: 'shadow-[0_0_20px_-6px_rgba(228,35,75,0.25)]',
  }

  const glowClasses = {
    primary: 'hover:glow-primary',
    success: 'hover:glow-success',
    warning: 'hover:glow-warning',
    error: 'hover:glow-error',
  }

  return (
    <div className={`bg-surface/40 backdrop-blur-xl border border-primary/10 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-primary/25 hover:-translate-y-0.5 ${staticGlow[accent]} ${glowClasses[accent]}`}>
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-white/40 text-xs mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-white">
          {value}<span className="text-sm text-white/40 ml-1">{suffix}</span>
        </p>
      </div>
    </div>
  )
}

export default StatCard