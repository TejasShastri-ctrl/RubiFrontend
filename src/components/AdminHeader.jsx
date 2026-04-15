import { Icon } from './Icon'
import { useNavigate } from 'react-router-dom'

export function AdminHeader({
  reviewer,
  searchValue,
  onSearchChange,
  showSearch = false,
  backLabel,
  onBack,
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = user ? user.name : reviewer ? reviewer.name : "Admin";
  const displayRole = user ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : reviewer ? reviewer.role : "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        {showSearch ? (
          <label className="admin-searchbar" htmlFor="admin-search">
            <Icon name="search" size={14} />
            <input
              id="admin-search"
              type="search"
              placeholder="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
        ) : null}

        {!showSearch && onBack ? (
          <button className="admin-back" type="button" onClick={onBack}>
            <Icon name="arrow-left" size={16} />
            <span>{backLabel}</span>
          </button>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="reviewer-chip reviewer-chip--compact">
          <div className="reviewer-avatar reviewer-avatar--compact">
            <Icon name="user" size={14} />
          </div>
          <div>
            <div className="reviewer-name reviewer-name--compact">{displayName}</div>
            <div className="reviewer-role">{displayRole}</div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ef4444', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
