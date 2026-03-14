import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Search, FileText, History } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Input Alumni', path: '/input', icon: <Users size={18} /> },
    { name: 'Tracking Alumni', path: '/tracking', icon: <Search size={18} /> },
    { name: 'Evidence / Bukti', path: '/evidence', icon: <FileText size={18} /> },
    { name: 'Riwayat Tracking', path: '/history', icon: <History size={18} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <div className="logo-text">
              <h2 style={{ fontFamily: "'VT323', monospace", fontSize: '22px', color: '#39ff14', textShadow: '0 0 8px #39ff14', marginBottom: '2px', letterSpacing: '1px' }}>ALUMNI TRACKER</h2>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#2a6a2a', letterSpacing: '2px' }}>{'>> SISTEM PELACAKAN ALUMNI'}</p>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--sidebar-bg);
          border-right: 1px solid #1a3a1a;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          box-shadow: 4px 0 20px rgba(0, 200, 0, 0.05);
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #0a200a;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 16px 12px;
          gap: 4px;
          margin-top: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 0;
          color: #3a7a3a;
          font-family: 'VT323', monospace;
          font-size: 18px;
          letter-spacing: 1px;
          transition: all 0.15s ease;
          gap: 12px;
          border-left: 3px solid transparent;
          text-decoration: none;
          text-transform: uppercase;
        }

        .nav-item:hover {
          background: rgba(57, 255, 20, 0.05);
          color: #00cc00;
          border-left-color: #005500;
        }

        .nav-item.active {
          background: rgba(57, 255, 20, 0.07);
          color: #39ff14;
          border-left: 3px solid #39ff14;
          text-shadow: 0 0 8px #39ff14;
        }

        .nav-item::before {
          content: '> ';
          opacity: 0;
          transition: opacity 0.15s;
        }
        .nav-item:hover::before,
        .nav-item.active::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
