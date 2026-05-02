import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Search, FileText, History, LogOut, UserCircle, GraduationCap } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Layout() {
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Input Alumni', path: '/input', icon: <Users size={20} /> },
    { name: 'Tracking Alumni', path: '/tracking', icon: <Search size={20} /> },
    { name: 'Evidence / Bukti', path: '/evidence', icon: <FileText size={20} /> },
    { name: 'Riwayat Tracking', path: '/history', icon: <History size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>Lacak Alumni</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sistem Pelacakan</p>
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
        
        <div style={{ marginTop: 'auto', padding: '24px' }}>
          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--border-color)' }}
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-search">
            {/* Area for breadcrumbs or global search */}
          </div>
          <div className="header-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email?.split('@')[0] || 'User'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email || 'Administrator'}</div>
            </div>
            <UserCircle size={36} color="var(--primary)" strokeWidth={1.5} />
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
          height: var(--header-height);
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition);
          gap: 12px;
          text-decoration: none;
        }

        .nav-item:hover {
          background-color: #F3F4F6;
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
