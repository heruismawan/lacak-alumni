import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function TrackingList() {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  
  const itemsPerPage = 50;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAlumni();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('alumni')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`nama_lulusan.ilike.%${searchTerm}%,nim.ilike.%${searchTerm}%`);
      }

      const { data, count, error } = await query
        .order('nama_lulusan', { ascending: true })
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) throw error;

      setAlumniData(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching alumni:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) return;
    const { error } = await supabase.from('alumni').delete().eq('id', id);
    if (error) alert('Gagal menghapus: ' + error.message);
    else fetchAlumni();
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Tracking Alumni</h1>
          <p>Mengelola {totalCount.toLocaleString()} data alumni terlacak</p>
        </div>
      </header>

      <div className="card" style={{ padding: 0 }}>
        {/* Search Bar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari berdasarkan Nama Lengkap atau NIM..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              style={{ paddingLeft: '44px', height: '48px', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIM</th>
                <th>Angkatan</th>
                <th>Program Studi</th>
                <th>Status Kerja</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Mengambil data...</span>
                    </div>
                  </td>
                </tr>
              ) : alumniData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)', fontSize: '15px' }}>
                    Data alumni tidak ditemukan.
                  </td>
                </tr>
              ) : (
                alumniData.map(alumni => (
                  <tr key={alumni.id}>
                    <td style={{ fontWeight: 600 }}>{alumni.nama_lulusan}</td>
                    <td>{alumni.nim || '-'}</td>
                    <td>{alumni.tahun_masuk || '-'}</td>
                    <td>{alumni.program_studi || '-'}</td>
                    <td style={{ maxWidth: '180px' }}>
                      <div 
                        className="truncate" 
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} 
                        title={alumni.status_kerja}
                      >
                        {alumni.status_kerja || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => navigate(`/tracking/${alumni.id}`)} 
                          className="btn btn-secondary" 
                          style={{ borderRadius: '8px', fontSize: '12px', padding: '6px 12px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                          Detail
                        </button>
                        <button 
                          onClick={() => handleDelete(alumni.id)} 
                          className="btn btn-tertiary" 
                          style={{ color: 'var(--danger)', borderRadius: '8px', padding: '6px' }}
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

        {/* Pagination Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Menampilkan <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alumniData.length}</span> dari {totalCount.toLocaleString()} data
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || loading}
              style={{ borderRadius: '8px', padding: '8px 16px' }}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{ borderRadius: '8px', padding: '8px 16px' }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
