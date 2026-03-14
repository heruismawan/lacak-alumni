import { useContext } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { Trash2, ExternalLink } from 'lucide-react';

export default function TrackingList() {
  const { alumniData, removeAlumni } = useContext(AlumniContext);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
      removeAlumni(id);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1>Tracking Alumni</h1>
        <p>Daftar seluruh alumni yang telah atau sedang dilacak</p>
      </header>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={thStyle}>Nama Alumni</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Bukti</th>
                <th style={thStyle}>Terakhir Diupdate</th>
                <th style={{ ...thStyle, width: 80 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alumniData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px' }}>
                    Belum ada data tracking alumni.
                  </td>
                </tr>
              ) : (
                alumniData.map(alumni => (
                  <tr key={alumni.id}>
                    <td style={tdStyle}>
                      <strong>{alumni.name}</strong>
                      <br />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{alumni.query}</span>
                    </td>
                    <td style={tdStyle}>{getStatusBadge(alumni.status)}</td>
                    <td style={tdStyle}>
                      {alumni.evidence && alumni.evidence !== '-' ? (
                        <a href={alumni.evidence} target="_blank" rel="noreferrer" style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Lihat <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Tidak ada</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{alumni.date}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(alumni.id)}
                        className="btn btn-danger"
                        style={{ padding: '8px', display: 'flex' }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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

function getStatusBadge(status) {
  let color = '#94a3b8';
  let bg = 'rgba(148, 163, 184, 0.1)';

  if (status === 'Teridentifikasi') { color = '#10b981'; bg = 'rgba(16, 185, 129, 0.1)'; }
  else if (status === 'Perlu Verifikasi') { color = '#38bdf8'; bg = 'rgba(56, 189, 248, 0.1)'; }
  else if (status === 'Belum Ditemukan') { color = '#ef4444'; bg = 'rgba(239, 68, 68, 0.1)'; }

  return (
    <span style={{ color, backgroundColor: bg, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
      {status}
    </span>
  );
}
