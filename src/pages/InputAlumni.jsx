import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlumniContext } from '../context/AlumniContext';

export default function InputAlumni() {
  const { addAlumni } = useContext(AlumniContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'Teridentifikasi',
    query: '',
    evidence: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Nama harus diisi');
    addAlumni(formData);
    navigate('/tracking'); // Redirect after saving
  };

  return (
    <>
      <header className="page-header">
        <h1>Input Alumni</h1>
        <p>Tambahkan data pelacakan alumni baru ke dalam sistem</p>
      </header>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Alumni</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status Pelacakan</label>
            <select 
              className="form-control"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Teridentifikasi">Teridentifikasi</option>
              <option value="Perlu Verifikasi">Perlu Verifikasi</option>
              <option value="Belum Ditemukan">Belum Ditemukan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Query / Cara Melacak</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Contoh: Pencarian LinkedIn nama + angkatan"
              value={formData.query}
              onChange={e => setFormData({...formData, query: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Link Evidence / Bukti (opsional)</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://..."
              value={formData.evidence}
              onChange={e => setFormData({...formData, evidence: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary btn-glow">Simpan Data Alumni</button>
          </div>
        </form>
      </div>
    </>
  );
}
