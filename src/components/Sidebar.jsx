import { Icon } from './Icon'

export function Sidebar({
  brand,
  navItems,
  secondaryItems,
  activeItem,
  onItemSelect,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark">
          <Icon name="grid" size={20} />
        </div>
        <div>
          <div className="brand-name">{brand}</div>
          <div className="brand-copy">HITL AI Review</div>
        </div>
      </div>

      <div className="sidebar__group">
        <div className="sidebar__label">Queue</div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__item sidebar__item--${item.accent} ${
                activeItem === item.id ? 'is-active' : ''
              }`}
              onClick={() => onItemSelect(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              <span className="sidebar__count">{item.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar__group">
        <div className="sidebar__label">Tools</div>
        <nav className="sidebar__nav sidebar__nav--secondary">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__secondary ${
                activeItem === item.id ? 'is-active' : ''
              }`}
              onClick={() => onItemSelect(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}