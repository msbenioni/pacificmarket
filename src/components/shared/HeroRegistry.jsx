export default function HeroRegistry({
  title,
  subtitle,
  badge,
  description,
  showStats = false,
  stats = null,
  actions = null,
  compact = false,
}) {
  const wrapperCls = compact
    ? "pt-20 pb-8 sm:pt-24 sm:pb-12"
    : "pt-24 pb-12 sm:pt-28 sm:pb-14";

  const titleCls = compact
    ? "text-2xl sm:text-3xl"
    : "text-3xl sm:text-4xl";

  const actionsCls = compact ? "mt-4 sm:mt-6" : "mt-6";

  return (
    <div className={`bg-[#0a1628] text-white ${wrapperCls}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {badge && (
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#00c9cc]">
            {badge}
          </span>
        )}

        <h1 className={`font-bold mb-2 ${titleCls}`}>{title}</h1>

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
          <div className={`${actionsCls} flex items-center gap-4`}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}