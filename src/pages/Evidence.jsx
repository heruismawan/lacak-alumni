import { useContext } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { FileText, ExternalLink } from 'lucide-react';

export default function Evidence() {
  const { alumniData } = useContext(AlumniContext);
  
  const alumniWithEvidence = alumniData.filter(a => a.evidence && a.evidence !== '-');

  return (
    <>
      <header className="page-header">
        <h1>Evidence / Bukti</h1>
        <p>Tautan dan dokumen yang membuktikan pekerjaan atau status alumni saat ini</p>
      </header>

      <div className="summary-cards">
        {alumniWithEvidence.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '64px 24px' }}>
            <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Belum ada bukti yang disematkan pada data alumni.</p>
          </div>
        ) : (
          alumniWithEvidence.map(alumni => (
            <div key={alumni.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{alumni.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Status: {alumni.status}</p>
              </div>
              <a 
                href={alumni.evidence} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary"
                style={{ justifyContent: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                Buka Tautan <ExternalLink size={14} />
              </a>
            </div>
          ))
        )}
      </div>
    </>
  );
}
