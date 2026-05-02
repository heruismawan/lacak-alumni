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
      setError(err.message || 'Gagal login. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ 
          background: '#1e293b', 
          border: '1px solid #334155', 
          borderRadius: '16px', 
          padding: '40px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              background: '#6366f1', 
              color: 'white', 
              width: '56px', 
              height: '56px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '12px', 
              margin: '0 auto 20px'
            }}>
              <GraduationCap size={32} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Lacak Alumni</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sistem Informasi Penelusuran Alumni</p>
          </div>

          {/* Demo Account Box */}
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.05)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            borderRadius: '12px', 
            padding: '16px', 
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <AlertCircle size={14} color="#818cf8" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#818cf8' }}>Demo Access</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>
              Email: <span style={{ color: '#e2e8f0' }}>admin@gmail.com</span> | Pass: <span style={{ color: '#e2e8f0' }}>1234</span>
            </p>
            <button 
              type="button"
              onClick={() => { setEmail('admin@gmail.com'); setPassword('1234'); }}
              style={{ width: '100%', marginTop: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Gunakan Akun Demo
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', padding: '12px', marginBottom: '20px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 12px 10px 36px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 12px 10px 36px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ width: '100%', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
