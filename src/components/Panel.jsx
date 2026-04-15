export function Panel({ title, subtitle, children }) {
  return (
    <section className="panel">
      <div className="panel__head">
        <div className="panel__title">{title}</div>
        {subtitle ? <div className="panel__subtitle">{subtitle}</div> : null}
      </div>
      <div className="panel__body">{children}</div>
    </section>
  )
}