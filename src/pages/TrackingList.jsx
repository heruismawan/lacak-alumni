import { useContext, useState } from 'react';
import { AlumniContext } from '../context/AlumniContext';
import { Trash2, ExternalLink, Search, Eye, X, Download } from 'lucide-react';

export default function TrackingList() {
  const { alumniData, removeAlumni } = useContext(AlumniContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
      removeAlumni(id);
    }
  };

  const filteredAlumni = alumniData.filter(a => {
    const term = searchTerm.toLowerCase();
    const nameMatch = a.name?.toLowerCase().includes(term);
    const nimMatch = a.nim?.toLowerCase().includes(term);
    
    if (statusFilter !== 'Semua' && a.status !== statusFilter) return false;
    
    return nameMatch || nimMatch;
  });

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Tracking Alumni</h1>
          <p>Daftar seluruh alumni yang telah atau sedang dilacak</p>
        </div>
      </header>

      <div className="card" style={{ padding: 0 }}>
        {/* Table Top Controls */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '600px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari berdasarkan Nama atau NIM..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <select 
              className="form-control" 
              style={{ width: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Teridentifikasi">Teridentifikasi</option>
              <option value="Perlu Verifikasi">Perlu Verifikasi</option>
              <option value="Belum Ditemukan">Belum Ditemukan</option>
            </select>
          </div>
          <button className="btn btn-secondary">
            <Download size={16} /> Export Data
          </button>
        </div>

        {/* Table */}
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Nama Alumni & NIM</th>
                <th>Posisi & Tempat Kerja</th>
                <th>Status Pelacakan</th>
                <th>Terakhir Diupdate</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 24px' }}>
                    {searchTerm ? 'Tidak ada data alumni yang cocok dengan pencarian.' : 'Belum ada data tracking alumni.'}
                  </td>
                </tr>
              ) : (
                filteredAlumni.map(alumni => (
                  <tr key={alumni.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{alumni.name}</strong>
                      <br />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{alumni.nim ? `NIM: ${alumni.nim}` : 'NIM: -'}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{alumni.position || '-'}</span>
                      <br />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{alumni.workPlace || '-'}</span>
                    </td>
                    <td>{getStatusBadge(alumni.status)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{alumni.date}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        <button
                          onClick={() => setSelectedAlumni(alumni)}
                          className="btn btn-tertiary"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(alumni.id)}
                          className="btn btn-tertiary"
                          style={{ color: 'var(--danger)' }}
                          title="Hapus Data"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlumni && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', justifyItems: 'center', alignItems: 'center', padding: '24px', overflowY: 'auto' }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', margin: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <button 
              onClick={() => setSelectedAlumni(null)}
              className="btn btn-tertiary"
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '4px' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '4px' }}>Detail Alumni</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              Informasi lengkap hasil pelacakan data alumni
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pribadi & Akademik</h4>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Nama Lengkap:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.name}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>NIM:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.nim || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Fakultas / Prodi:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.fakultas || '-'} / {selectedAlumni.prodi || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Tahun Masuk / Lulus:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.tahunMasuk || '-'} / {selectedAlumni.tanggalLulus || '-'}</div></div>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pekerjaan</h4>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Tempat Bekerja:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.workPlace || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Posisi / Jabatan:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.position || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Status:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.jobStatus || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Alamat Kerja:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.workAddress || '-'}</div></div>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kontak & Sosial Media</h4>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Email:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.email || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>No. HP:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.noHp || '-'}</div></div>
                {selectedAlumni.linkedin && (
                  <div style={{ marginTop: '12px' }}>
                    <a href={selectedAlumni.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><ExternalLink size={14} /> Profil LinkedIn</a>
                  </div>
                )}
                {selectedAlumni.instagram && (
                 <div style={{ marginTop: '8px' }}>
                    <a href={selectedAlumni.instagram} target="_blank" rel="noreferrer" style={{ color: '#E1306C', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><ExternalLink size={14} /> Instagram</a>
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Pelacakan</h4>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px', marginBottom: '4px' }}>Status:</small><div>{getStatusBadge(selectedAlumni.status)}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Tracking Query:</small><div style={{ fontWeight: 500 }}>{selectedAlumni.query || '-'}</div></div>
                <div style={{ marginBottom: '12px' }}><small style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '13px' }}>Link Evidence:</small>
                  <div style={{ fontWeight: 500 }}>
                    {selectedAlumni.evidence && selectedAlumni.evidence !== '-' ? (
                      <a href={selectedAlumni.evidence} target="_blank" rel="noreferrer" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Buka Evidence</a>
                    ) : '-'}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
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
