import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search, ChevronLeft, ChevronRight, Loader2, UserCheck, Eye } from 'lucide-react';

export default function AlumniTeridentifikasi() {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  
  const itemsPerPage = 50;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchIdentifiedAlumni();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const fetchIdentifiedAlumni = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('alumni')
        .select('*', { count: 'exact' })
        .not('status_kerja', 'is', null)
        .neq('status_kerja', '')
        .neq('status_kerja', '-');

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
      console.error('Error fetching identified alumni:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserCheck size={28} color="var(--primary)" />
          <div>
            <h1 style={{ margin: 0 }}>Alumni Teridentifikasi</h1>
            <p>Data alumni dengan status kerja tervalidasi ({totalCount} record)</p>
          </div>
        </div>
      </header>

      <div className="card" style={{ padding: 0 }}>
        {/* Search Bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari data teridentifikasi..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              style={{ paddingLeft: '40px', background: 'var(--bg-body)' }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <th style={{ color: '#818cf8' }}>Nama Alumni</th>
                <th style={{ color: '#818cf8' }}>NIM</th>
                <th style={{ color: '#818cf8' }}>Program Studi</th>
                <th style={{ color: '#818cf8' }}>Tempat Kerja</th>
                <th style={{ color: '#818cf8' }}>Status Kerja</th>
                <th style={{ textAlign: 'center', color: '#818cf8' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Memfilter data tervalidasi...</span>
                    </div>
                  </td>
                </tr>
              ) : alumniData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Belum ada alumni yang teridentifikasi.
                  </td>
                </tr>
              ) : (
                alumniData.map(alumni => (
                  <tr key={alumni.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alumni.nama_lulusan}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{alumni.nim || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{alumni.program_studi || '-'}</td>
                    <td style={{ color: 'var(--text-primary)' }}>{alumni.tempat_kerja || '-'}</td>
                    <td>
                      <span 
                        className="badge-indigo"
                        style={{ 
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'bottom'
                        }}
                        title={alumni.status_kerja}
                      >
                        {alumni.status_kerja}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/tracking/${alumni.id}`)} 
                        style={{ color: '#818cf8', cursor: 'pointer', background: 'transparent', border: 'none' }}
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Menampilkan <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{alumniData.length}</span> profil tervalidasi
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || loading}
              style={{ background: '#0f172a', color: 'var(--text-secondary)', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', opacity: currentPage === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{ background: '#0f172a', color: 'var(--text-secondary)', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
