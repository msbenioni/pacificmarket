export default function HeroRegistry({ 
  title, 
  subtitle, 
  badge, 
  description, 
  showStats = false,
  stats = null,
  actions = null 
}) {
  return (
    <div className="bg-[#0a1628] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {badge && (
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00c4cc] mb-2 block pt-4">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold mb-2 pt-2">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mb-2">{subtitle}</p>}
        {description && <p className="text-gray-400 text-sm max-w-xl">{description}</p>}
        
        {showStats && stats && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color || "text-white"}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {actions && (
          <div className="mt-6 flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
