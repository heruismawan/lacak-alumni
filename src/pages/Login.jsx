import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Username atau password salah (Gunakan admin/admin)');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-color)', padding: '24px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', margin: '0 auto 20px' }}>
            <GraduationCap size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Login Sistem</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Masuk untuk mengelola data pelacakan alumni</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#B91C1C', borderLeft: '4px solid #EF4444', padding: '12px 16px', marginBottom: '24px', borderRadius: '4px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username Anda"
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
            <LogIn size={18} /> Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
