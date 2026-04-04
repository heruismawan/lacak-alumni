import { useContext } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { History as HistoryIcon, UserPlus, Trash2 } from 'lucide-react';

export default function History() {
  const { history } = useContext(AlumniContext);

  return (
    <>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Riwayat Tracking</h1>
          <p>Catatan dan log aktivitas penambahan serta penghapusan data</p>
        </div>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Tipe Aktivitas</th>
                <th>Target Alumni</th>
                <th>Waktu / Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '64px 24px' }}>
                    <HistoryIcon size={48} style={{ color: 'var(--border-color)', margin: '0 auto 16px', display: 'block' }} />
                    <p style={{ fontSize: '15px' }}>Belum ada log riwayat aktivitas di dalam sistem.</p>
                  </td>
                </tr>
              ) : (
                history.map((log, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: log.action === 'Added' ? '#ECFDF5' : '#FEF2F2',
                          color: log.action === 'Added' ? '#10B981' : '#EF4444'
                        }}>
                          {log.action === 'Added' ? <UserPlus size={16} /> : <Trash2 size={16} />}
                        </span>
                        <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)' }}>
                          {log.action === 'Added' ? 'Penambahan Data' : 'Penghapusan Data'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.target}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{log.date}</td>
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
