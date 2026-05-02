import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlumniContext } from '../context/AlumniContext';
import { Search, Save, Linkedin } from 'lucide-react';

export default function InputAlumni() {
  const { addAlumni } = useContext(AlumniContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', nim: '', tahunMasuk: '', tanggalLulus: '', fakultas: '', prodi: '',
    email: '', noHp: '', linkedin: '', instagram: '', facebook: '', tiktok: '',
    workPlace: '', workAddress: '', position: '', jobStatus: 'Swasta', workSocial: '',
    status: 'Teridentifikasi', query: '', evidence: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleRealFetch = async () => {
    if (!searchQuery) return alert('Silakan masukkan Nama atau NIM terlebih dahulu');
    setIsFetching(true);
    
    try {
      const response = await fetch(`http://localhost:5001/api/fetch-alumni?query=${encodeURIComponent(searchQuery)}`);
      const result = await response.json();

      if (result.success) {
        const { data } = result;
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          nim: data.nim || '',
          tahunMasuk: data.tahunMasuk || '',
          tanggalLulus: data.tanggalLulus || '',
          fakultas: data.fakultas || '',
          prodi: data.prodi || '',
          email: data.email || '',
          noHp: data.phone || '',
          linkedin: data.linkedin || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          tiktok: data.tiktok || '',
          workPlace: data.workPlace || '',
          workAddress: data.workAddress || '',
          position: data.position || '',
          jobStatus: data.jobStatus || 'Swasta',
          workSocial: data.workSocial || '',
          evidence: data.linkedin || data.facebook || '',
          status: 'Teridentifikasi',
          query: `Smart Search: ${searchQuery}`
        }));
        alert('Data alumni ditemukan dan diperkaya dengan informasi dari internet!');
      } else {
        alert(result.error || 'Data tidak ditemukan');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Gagal menghubungi backend. Pastikan server backend sudah berjalan di port 5001.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Nama harus diisi');
    addAlumni(formData);
    navigate('/tracking');
  };

  return (
    <>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Input Alumni</h1>
          <p>Tambahkan data pelacakan alumni baru ke dalam sistem secara manual atau otomatis</p>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Smart Search Card */}
        <div className="card" style={{ marginBottom: 0, border: '1px solid var(--accent-color)', backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} color="var(--accent-color)" />
            Pencarian Cerdas & OSINT
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Cari alumni berdasarkan <strong>Nama</strong> atau <strong>NIM</strong>. Sistem akan mencocokkan dengan database internal dan mencari data pekerjaan/sosial media terbaru di internet secara otomatis.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masukkan Nama Lengkap atau NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
              onKeyPress={(e) => e.key === 'Enter' && handleRealFetch()}
            />
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleRealFetch}
              disabled={isFetching}
              style={{ minWidth: '160px' }}
            >
              {isFetching ? 'Mencari...' : (
                <><Search size={16} /> Cari Alumni</>
              )}
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Data Pribadi
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Nama Alumni *</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>NIM</label><input type="text" className="form-control" name="nim" value={formData.nim} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Tahun Masuk</label><input type="text" className="form-control" name="tahunMasuk" value={formData.tahunMasuk} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Tanggal Lulus</label><input type="date" className="form-control" name="tanggalLulus" value={formData.tanggalLulus} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Fakultas</label><input type="text" className="form-control" name="fakultas" value={formData.fakultas} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Program Studi</label><input type="text" className="form-control" name="prodi" value={formData.prodi} onChange={handleChange} /></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Kontak & Sosial Media
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>No HP</label><input type="text" className="form-control" name="noHp" value={formData.noHp} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>LinkedIn URL</label><input type="url" className="form-control" name="linkedin" value={formData.linkedin} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Instagram URL</label><input type="url" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Facebook URL</label><input type="url" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Tiktok URL</label><input type="url" className="form-control" name="tiktok" value={formData.tiktok} onChange={handleChange} /></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Data Pekerjaan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Tempat Bekerja</label><input type="text" className="form-control" name="workPlace" value={formData.workPlace} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Posisi / Jabatan</label><input type="text" className="form-control" name="position" value={formData.position} onChange={handleChange} /></div>
              <div className="form-group" style={{ gridColumn: '1 / span 2', marginBottom: 0 }}><label>Alamat Lengkap Pekerjaan</label><input type="text" className="form-control" name="workAddress" value={formData.workAddress} onChange={handleChange} /></div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Status Pekerjaan</label>
                <select className="form-control" name="jobStatus" value={formData.jobStatus} onChange={handleChange}>
                  <option value="Swasta">Swasta</option>
                  <option value="PNS">PNS / BUMN</option>
                  <option value="Wirausaha">Wirausaha</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Link Informasi Tempat Kerja</label><input type="url" className="form-control" name="workSocial" value={formData.workSocial} onChange={handleChange} /></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Administrasi Pelacakan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Status Pelacakan</label>
                <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Teridentifikasi">Teridentifikasi</option>
                  <option value="Perlu Verifikasi">Perlu Verifikasi</option>
                  <option value="Belum Ditemukan">Belum Ditemukan</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}><label>Metode / Query Pelacakan</label><input type="text" className="form-control" name="query" value={formData.query} onChange={handleChange} /></div>
              <div className="form-group" style={{ gridColumn: '1 / span 2', marginBottom: 0 }}><label>Link Evidence / Bukti Sahih (Opsional)</label><input type="url" className="form-control" name="evidence" value={formData.evidence} onChange={handleChange} /></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', marginBottom: '64px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '16px', borderRadius: '8px' }}>
              <Save size={18} /> Simpan Data Alumni
            </button>
          </div>
        </form>

      </div>
    </>
  );
}
