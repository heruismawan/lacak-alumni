import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlumniContext } from '../context/AlumniContext';
import { Users, CheckCircle, Search, HelpCircle, FileText, ArrowRight, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const { alumniData } = useContext(AlumniContext);

  const total = alumniData.length;
  const identified = alumniData.filter(a => a.status === 'Teridentifikasi').length;
  const verifying = alumniData.filter(a => a.status === 'Perlu Verifikasi').length;
  const notFound = alumniData.filter(a => a.status === 'Belum Ditemukan').length;

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan data pelacakan alumni</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/input" className="btn btn-primary">
            <UserPlus size={16} /> Tambah Alumni
          </Link>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard color="#3B82F6" bg="#EFF6FF" icon={<Users size={24} color="#3B82F6"/>} number={total} label="Total Alumni" />
        <StatCard color="#10B981" bg="#ECFDF5" icon={<CheckCircle size={24} color="#10B981"/>} number={identified} label="Teridentifikasi" />
        <StatCard color="#F59E0B" bg="#FFFBEB" icon={<Search size={24} color="#F59E0B"/>} number={verifying} label="Perlu Verifikasi" />
        <StatCard color="#EF4444" bg="#FEF2F2" icon={<HelpCircle size={24} color="#EF4444"/>} number={notFound} label="Belum Ditemukan" />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              Aktivitas Tracking Terbaru
            </h2>
            <Link to="/history" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Alumni</th>
                  <th>Query Digunakan</th>
                  <th>Status</th>
                  <th>Waktu Update</th>
                </tr>
              </thead>
              <tbody>
                {alumniData.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px', fontSize: '14px' }}>
                      Belum ada aktivitas tracking.<br />
                      <Link to="/input" style={{ color: 'var(--primary)', marginTop: '8px', display: 'inline-block', fontWeight: 500 }}>Mulai tracking sekarang</Link>
                    </td>
                  </tr>
                ) : (
                  alumniData.slice(0, 5).map(alumni => (
                    <tr key={alumni.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{alumni.name}</div>
                      </td>
                      <td>
                        <span style={{ background: '#F3F4F6', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {alumni.query || '-'}
                        </span>
                      </td>
                      <td>{getStatusBadge(alumni.status)}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{alumni.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', gap: '16px' }}>
        <Link to="/tracking" className="btn btn-secondary">
          <Search size={16} /> Cari Alumni Terlacak
        </Link>
        <Link to="/evidence" className="btn btn-secondary">
          <FileText size={16} /> Kelola Evidence Data
        </Link>
      </section>
    </>
  );
}

function StatCard({ color, bg, icon, number, label }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', marginBottom: 0 }}>
      <div style={{ background: bg, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{number}</div>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  let badgeClass = 'badge-neutral';
  if (status === 'Teridentifikasi') badgeClass = 'badge-success';
  else if (status === 'Perlu Verifikasi') badgeClass = 'badge-info';
  else if (status === 'Belum Ditemukan') badgeClass = 'badge-danger';

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
}
