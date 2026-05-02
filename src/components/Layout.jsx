import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, LogOut, UserCircle, GraduationCap, UserCheck } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Layout() {
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Tracking Alumni', path: '/tracking', icon: <Search size={20} /> },
    { name: 'Teridentifikasi', path: '/teridentifikasi', icon: <UserCheck size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>Lacak Alumni</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Administrative Portal</p>
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
            className="btn-logout"
          >
            <LogOut size={18} />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-info">
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Portal Pelacakan Alumni • <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>CDC University</span></span>
          </div>
          <div className="header-profile" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email?.split('@')[0] || 'Admin'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>System Administrator</div>
            </div>
            <UserCircle size={32} color="var(--primary)" strokeWidth={1.5} />
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
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
          padding: 24px 12px;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition);
          gap: 12px;
          text-decoration: none;
        }

        .nav-item:hover {
          color: #a5b4fc; /* Indigo 300 */
          background-color: rgba(99, 102, 241, 0.05);
        }

        .nav-item.active {
          background-color: rgba(99, 102, 241, 0.1);
          color: #818cf8; /* Indigo 400 */
          font-weight: 600;
        }

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition);
        }

        .btn-logout:hover {
          background-color: rgba(244, 63, 94, 0.05);
          color: #fb7185;
          border-color: #fb7185;
        }
      `}</style>
    </div>
  );
}
