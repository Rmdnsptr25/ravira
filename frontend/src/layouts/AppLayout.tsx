import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Kandidat' },
  { to: '/candidate/dashboard', label: 'Dashboard Kandidat' },
  { to: '/recruiter/dashboard', label: 'Recruiter' },
  { to: '/admin/dashboard', label: 'Admin' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="RAVIRA home">
          <span className="brand-mark">R</span>
          <span>
            <strong>RAVIRA</strong>
            <small>AI Job Matching</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
