import { useContext } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  const { history } = useContext(AlumniContext);

  return (
    <>
      <header className="page-header">
        <h1>Riwayat Tracking</h1>
        <p>Log aktivitas penambahan dan penghapusan data alumni</p>
      </header>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={thStyle}>Aksi</th>
                <th style={thStyle}>Target Alumni</th>
                <th style={thStyle}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px' }}>
                    <HistoryIcon size={32} style={{ opacity: 0.2, margin: '0 auto 8px', display: 'block' }} />
                    Belum ada riwayat aktivitas.
                  </td>
                </tr>
              ) : (
                history.map((log, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      <span style={{
                        color: log.action === 'Added' ? '#10b981' : '#ef4444',
                        backgroundColor: log.action === 'Added' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                      }}>
                        {log.action === 'Added' ? 'Ditambahkan' : 'Dihapus'}
                      </span>
                    </td>
                    <td style={tdStyle}><strong>{log.target}</strong></td>
                    <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{log.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const thStyle = { padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--card-border)' };
const tdStyle = { padding: '16px 24px', borderBottom: '1px solid var(--card-border)' };
