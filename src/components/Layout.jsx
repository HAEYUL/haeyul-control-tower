import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/store', label: '매장 운영' },
  { to: '/marketing', label: '마케팅·SNS' },
  { to: '/roadmap', label: '로드맵' },
  { to: '/settings', label: '설정' },
]

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">해율푸드 관제탑</span>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `app-nav-item${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Layout
