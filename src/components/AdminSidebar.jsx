import logo from "../assets/rubilogo.png";
import { Icon } from './Icon'

export function AdminSidebar({
  brand,
  queueItems,
  toolItems,
  activeQueue,
  activeTool,
  onQueueSelect,
  onToolSelect,
}) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand flex gap-1 items-center">
        <div className="brand-mark brand-mark--admin">
          <img src={logo} alt="logo here" className="size-4" />
        </div>
        HITL Workflow
      </div>

      <div className="admin-sidebar__group">
        <div className="sidebar__label">Queue</div>
        <nav className="sidebar__nav">
          {queueItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__item sidebar__item--${item.accent} ${
                activeQueue === item.id ? 'is-active' : ''
              }`}
              onClick={() => onQueueSelect(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              <span className="sidebar__count">{item.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar__group">
        <div className="sidebar__label">Tools</div>
        <nav className="sidebar__nav sidebar__nav--secondary">
          {toolItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__secondary ${
                activeTool === item.id ? 'is-active' : ''
              }`}
              onClick={() => onToolSelect(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar__footer">{brand}</div>
    </aside>
  )
}
