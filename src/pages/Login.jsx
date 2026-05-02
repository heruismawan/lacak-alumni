import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Gagal login. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-premium" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '440px', width: '100%', position: 'relative' }}>
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '120px', height: '120px', background: 'var(--primary-light)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.6, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '120px', height: '120px', background: '#BAE6FD', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.6, zIndex: 0 }}></div>

        <div className="card" style={{ padding: '48px 40px', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #0d9488 100%)', 
              color: 'white', 
              width: '72px', 
              height: '72px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '20px', 
              margin: '0 auto 24px',
              boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.3)'
            }}>
              <GraduationCap size={40} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.025em' }}>Lacak Alumni</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>Silakan masuk ke akun Anda untuk mengelola data penelusuran alumni.</p>
          </div>

          {/* Demo Account Info Box */}
          <div style={{ 
            background: '#F0F9FF', 
            border: '1px solid #BAE6FD', 
            borderRadius: '16px', 
            padding: '16px', 
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#0EA5E9', color: 'white', padding: '4px', borderRadius: '6px' }}>
                <AlertCircle size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0369A1' }}>Informasi Akun Demo</span>
            </div>
            <div style={{ fontSize: '13px', color: '#0369A1', lineHeight: 1.5 }}>
              Email: <code style={{ fontWeight: 700 }}>admin@gmail.com</code><br />
              Password: <code style={{ fontWeight: 700 }}>1234</code>
            </div>
            <button 
              type="button"
              onClick={() => {
                setEmail('admin@gmail.com');
                setPassword('1234');
              }}
              style={{ 
                background: '#E0F2FE', 
                color: '#0369A1', 
                border: 'none', 
                padding: '8px 12px', 
                borderRadius: '10px', 
                fontSize: '12px', 
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Gunakan Akun Demo
            </button>
          </div>

          {error && (
            <div style={{ 
              background: '#FEF2F2', 
              color: '#B91C1C', 
              padding: '14px 16px', 
              marginBottom: '32px', 
              borderRadius: '12px', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid #FEE2E2'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.ac.id"
                  style={{ paddingLeft: '44px', height: '48px', borderRadius: '12px' }}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>Lupa password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '44px', height: '48px', borderRadius: '12px' }}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', height: '52px', fontSize: '16px', borderRadius: '14px', fontWeight: 600 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <><LogIn size={20} /> Masuk Sekarang</>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Belum memiliki akses? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Hubungi IT Support</a>
          </div>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
          © 2026 Lacak Alumni - Career Development Center
        </p>
      </div>
    </div>
  );
}
