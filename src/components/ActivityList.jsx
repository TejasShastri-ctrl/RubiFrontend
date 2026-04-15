export function ActivityList({ items }) {
  return (
    <div className="activity-list">
      {items.map((item) => (
        <article key={item.id} className="activity-item">
          <div className="activity-time">{item.time}</div>
          <div className="activity-title">{item.title}</div>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}