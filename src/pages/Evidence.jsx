import { useContext } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { FileText, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function Evidence() {
  const { alumniData } = useContext(AlumniContext);

  const alumniWithEvidence = alumniData.filter(a => a.evidence && a.evidence !== '-');

  return (
    <>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Evidence / Bukti</h1>
          <p>Tautan referensi dan dokumen pembuktian pelacakan alumni</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {alumniWithEvidence.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 24px', backgroundColor: 'transparent', borderStyle: 'dashed' }}>
            <FileText size={48} style={{ color: 'var(--border-color)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Belum Ada Dokumen</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada bukti / evidence yang disematkan pada data alumni saat ini.</p>
          </div>
        ) : (
          alumniWithEvidence.map(alumni => (
            <div key={alumni.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 0 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{alumni.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: alumni.status === 'Teridentifikasi' ? '#10B981' : alumni.status === 'Perlu Verifikasi' ? '#F59E0B' : '#EF4444' }}></span>
                  {alumni.status}
                </p>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}>
                <LinkIcon size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{alumni.evidence}</span>
              </div>
              <a
                href={alumni.evidence}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Buka Tautan <ExternalLink size={16} />
              </a>
            </div>
          ))
        )}
      </div>
    </>
  );
}
