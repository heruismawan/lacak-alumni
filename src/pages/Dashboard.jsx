import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlumniContext } from '../context/AlumniContext';
import { Users, CheckCircle, Search, HelpCircle, FileText } from 'lucide-react';

export default function Dashboard() {
  const { alumniData } = useContext(AlumniContext);

  const total = alumniData.length;
  const identified = alumniData.filter(a => a.status === 'Teridentifikasi').length;
  const verifying = alumniData.filter(a => a.status === 'Perlu Verifikasi').length;
  const notFound = alumniData.filter(a => a.status === 'Belum Ditemukan').length;

  return (
    <>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Ringkasan data pelacakan alumni</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard accent="linear-gradient(90deg, #818cf8, #a78bfa)" icon={<Users size={24} color="#818cf8"/>} number={total} label="Total Alumni" numClass="glow-blue" />
        <StatCard accent="linear-gradient(90deg, #34d399, #10b981)" icon={<CheckCircle size={24} color="#10b981"/>} number={identified} label="Teridentifikasi" numClass="glow-green" />
        <StatCard accent="linear-gradient(90deg, #38bdf8, #818cf8)" icon={<Search size={24} color="#06b6d4"/>} number={verifying} label="Perlu Verifikasi" numClass="glow-cyan" />
        <StatCard accent="linear-gradient(90deg, #f43f5e, #fb923c)" icon={<HelpCircle size={24} color="#ef4444"/>} number={notFound} label="Belum Ditemukan" numClass="glow-red" />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📈 Aktivitas Tracking Terbaru
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ALUMNI</th>
                  <th style={thStyle}>QUERY DIGUNAKAN</th>
                  <th style={thStyle}>HASIL</th>
                  <th style={thStyle}>WAKTU</th>
                </tr>
              </thead>
              <tbody>
                {alumniData.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px', fontSize: '14px' }}>
                      Belum ada aktivitas tracking.{' '}
                      <Link to="/input" style={{ color: '#818cf8', textDecoration: 'underline' }}>Mulai tracking</Link>
                    </td>
                  </tr>
                ) : (
                  alumniData.slice(0, 5).map(alumni => (
                    <tr key={alumni.id}>
                      <td style={tdStyle}>{alumni.name}</td>
                      <td style={tdStyle}>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {alumni.query || '-'}
                        </span>
                      </td>
                      <td style={tdStyle}>{alumni.status}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{alumni.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/input" className="btn btn-primary btn-glow">
          <span>+</span> Tambah Alumni Baru
        </Link>
        <Link to="/tracking" className="btn" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
          <Search size={16} /> Mulai Tracking
        </Link>
        <Link to="/evidence" className="btn" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
          <FileText size={16} /> Lihat Evidence
        </Link>
      </section>
    </>
  );
}

function StatCard({ accent, icon, number, label, numClass }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent }} />
      <div style={{ marginBottom: '16px', marginTop: '8px' }}>{icon}</div>
      <div className={numClass} style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', lineHeight: 1 }}>{number}</div>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

const thStyle = { padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--card-border)' };
const tdStyle = { padding: '16px 24px', borderBottom: '1px solid var(--card-border)' };
