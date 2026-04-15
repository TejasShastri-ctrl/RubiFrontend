export function StatCard({ label, value, change, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__change">{change}</div>
    </article>
  )
}