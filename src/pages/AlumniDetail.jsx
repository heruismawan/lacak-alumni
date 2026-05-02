import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Edit2, Save, Search, X, Loader2, Globe, Briefcase, Mail, TrendingUp } from 'lucide-react';

export default function AlumniDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State utama untuk form (Data Binding)
  const [formData, setFormData] = useState({
    tempat_kerja: '',
    jabatan: '',
    alamat: '',
    linkedin_url: '',
    email: '',
    nomor_wa: '',
    status_kerja: ''
  });
  const [highlights, setHighlights] = useState({});

  useEffect(() => {
    fetchAlumniData();
  }, [id]);

  const fetchAlumniData = async () => {
    setLoading(true);
    try {
      console.log('--- FETCHING DATA ---');
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        console.log('Data yang ditarik dari Supabase:', data);
        setAlumni(data);
        // Sinkronisasi data ke state formData untuk input
        setFormData({
          ...data,
          // Pastikan field yang mungkin null di DB diubah jadi string kosong
          tempat_kerja: data.tempat_kerja || '',
          jabatan: data.jabatan || '',
          alamat: data.alamat || '',
          linkedin_url: data.linkedin_url || '',
          email: data.email || '',
          nomor_wa: data.nomor_wa || '',
          status_kerja: data.status_kerja || ''
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
      alert('Gagal mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('--- SAVING DATA ---');
      console.log('Data yang akan dikirim (formData):', formData);

      // LOGIKA AMAN (Safe Update):
      // Kita hanya mengirim kolom yang benar-benar ada di database (berdasarkan hasil fetch)
      // Ini mencegah error "column does not exist" jika 'alamat' atau 'status_kerja' belum dibuat
      const existingColumns = Object.keys(alumni);
      const dataToSave = {};
      
      // Daftar field yang kita inginkan
      const targetFields = ['tempat_kerja', 'jabatan', 'alamat', 'linkedin_url', 'email', 'nomor_wa', 'status_kerja'];
      
      targetFields.forEach(field => {
        if (existingColumns.includes(field)) {
          dataToSave[field] = formData[field];
        }
      });

      console.log('Data final yang dikirim ke Supabase:', dataToSave);

      const { error } = await supabase
        .from('alumni')
        .update(dataToSave)
        .eq('id', id);

      if (error) throw error;

      alert('Berhasil simpan ke DB');
      setIsEditing(false);
      
      // Refresh data untuk memastikan tampilan sinkron
      await fetchAlumniData();
    } catch (error) {
      console.error('Save Error:', error.message);
      alert('Gagal simpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const query = encodeURIComponent(`LinkedIn ${alumni?.nama_lulusan} ${alumni?.program_studi || ''}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleMagicPaste = (text) => {
    if (!text) return;

    let updatedData = { ...formData };
    let updatedFields = {};

    const clean = (val) => {
      if (!val) return '';
      let cleaned = val.replace(/\*/g, '').trim();
      if (cleaned.toLowerCase().includes('belum ada') || cleaned.toLowerCase().includes('tidak ditemukan')) return '-';
      return cleaned;
    };

    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();
      const numberedMatch = trimmedLine.match(/^\*?\*?(\d)[\.:]\s*(.+)/);
      
      if (numberedMatch) {
        const num = numberedMatch[1];
        const content = numberedMatch[2];
        const val = clean(content);

        switch(num) {
          case '1': updatedData.tempat_kerja = val; updatedFields.tempat_kerja = true; break;
          case '2': updatedData.jabatan = val; updatedFields.jabatan = true; break;
          case '3': updatedData.alamat = val; updatedFields.alamat = true; break;
          case '4': 
            const urlMatch = val.match(/\((https?:\/\/[^\s\)]+)\)/) || val.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
              updatedData.linkedin_url = urlMatch[1] || urlMatch[0];
              updatedFields.linkedin_url = true;
            }
            break;
          case '5': updatedData.email = val; updatedFields.email = true; break;
          case '6': updatedData.nomor_wa = val.replace(/[^0-9\+]/g, ''); updatedFields.nomor_wa = true; break;
          case '7': 
            // Ambil maksimal 3 kata untuk status kerja agar rapi
            const words = val.split(' ');
            const shortStatus = words.length > 3 ? words.slice(0, 3).join(' ') + '...' : val;
            updatedData.status_kerja = shortStatus; 
            updatedFields.status_kerja = true; 
            break;
        }
      }
    });

    setFormData(updatedData);
    if (!isEditing) setIsEditing(true);
    setHighlights(updatedFields);
    setTimeout(() => setHighlights({}), 2000);
  };

  if (loading && !alumni) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px', background: '#F8FAFC' }}>
        <Loader2 className="animate-spin" size={60} color="var(--primary)" />
        <h2 style={{ color: 'var(--text-secondary)' }}>Memuat Data Alumni...</h2>
      </div>
    );
  }

  if (!alumni) return <div style={{ padding: '50px', textAlign: 'center' }}>Data alumni tidak ditemukan atau ID salah.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={() => navigate('/tracking')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowLeft size={20} /> Kembali ke List Tracking
        </button>
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
            {alumni.nama_lulusan?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{alumni.nama_lulusan}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', margin: '5px 0 0' }}>NIM: {alumni.nim || '-'}</p>
          </div>
        </div>
        <div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ height: '48px', padding: '0 25px' }}>
                <X size={18} /> Batal
              </button>
              <button onClick={handleSave} className="btn btn-primary" style={{ height: '48px', padding: '0 25px', boxShadow: '0 4px 6px -1px rgba(var(--primary-rgb), 0.3)' }}>
                <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan ke DB'}
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ height: '48px', padding: '0 25px' }}>
              <Edit2 size={18} /> Edit Data Alumni
            </button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Magic Paste Area */}
          <div className="card" style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', padding: '30px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <TrendingUp size={24} color="#15803D" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#15803D', margin: 0 }}>Magic Paste Auto-Fill</h3>
            </div>
            <textarea 
              placeholder="Tempel 7 poin dari AI di sini..."
              style={{ width: '100%', height: '120px', border: '2px solid #86EFAC', borderRadius: '16px', padding: '16px', fontSize: '15px', resize: 'none', background: 'white' }}
              onChange={(e) => handleMagicPaste(e.target.value)}
            ></textarea>
            <p style={{ fontSize: '13px', color: '#166534', marginTop: '12px', fontWeight: 500 }}>Sistem otomatis mendeteksi: Perusahaan, Jabatan, Alamat, LinkedIn, Email, WA, Status.</p>
          </div>

          <div className="card" style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Briefcase size={24} color="var(--primary)" /> Informasi Pekerjaan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <InputGroup label="Tempat Kerja" field="tempat_kerja" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.tempat_kerja} />
              <InputGroup label="Jabatan" field="jabatan" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.jabatan} />
              <div style={{ gridColumn: '1 / span 2' }}>
                <InputGroup label="Alamat / Lokasi" field="alamat" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.alamat} />
              </div>
              <InputGroup 
                label="Status Kerja" 
                field="status_kerja" 
                formData={formData} 
                setFormData={setFormData} 
                isEditing={isEditing} 
                highlight={highlights.status_kerja}
                type="select"
                options={['Bekerja', 'Wirausaha', 'Belum Bekerja', 'Lanjut Studi']}
              />
            </div>
          </div>

          <div className="card" style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Mail size={24} color="var(--primary)" /> Kontak & Sosmed
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <InputGroup label="Email" field="email" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.email} />
              <InputGroup label="Nomor WhatsApp" field="nomor_wa" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.nomor_wa} />
              <div style={{ gridColumn: '1 / span 2' }}>
                <InputGroup label="LinkedIn URL" field="linkedin_url" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.linkedin_url} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '30px', borderRadius: '24px', border: 'none' }}>
            <h3 style={{ color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
              <Globe size={24} color="#60A5FA" /> AI Search Helper
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={handleSearch} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', height: '50px' }}>
                <Search size={18} /> Cari di Google
              </button>
              <button 
                onClick={() => {
                  const prompt = `Cari informasi terbaru tentang ${alumni.nama_lulusan} lulusan ${alumni.program_studi} dari ${alumni.fakultas}. Berikan data dalam 7 poin: 1.Perusahaan, 2.Jabatan, 3.Alamat, 4.LinkedIn, 5.Email, 6.WhatsApp, 7.Status Kerja. (jawab intinya saja, jangan berikan kalimat pembuka atau penutup)`;
                  navigator.clipboard.writeText(prompt);
                  alert('Prompt AI disalin! Silakan tempel di Grok/ChatGPT.');
                }} 
                className="btn btn-primary" style={{ width: '100%', height: '50px', fontWeight: 700 }}
              >
                Salin Prompt AI
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Data Akademik</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <InfoRow label="Program Studi" value={alumni.program_studi} />
              <InfoRow label="Fakultas" value={alumni.fakultas} />
              <InfoRow label="Tahun Masuk" value={alumni.tahun_masuk} />
              <InfoRow label="Tanggal Lulus" value={alumni.tanggal_lulus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, field, formData, setFormData, isEditing, highlight, type = 'text', options = [] }) {
  const value = formData[field] || '';
  const highlightStyle = highlight ? { 
    borderColor: '#22C55E', 
    boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.2)', 
    background: '#F0FDF4',
    transition: 'all 0.3s ease' 
  } : { transition: 'all 0.3s ease' };

  if (isEditing) {
    if (type === 'select') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</label>
          <select 
            className="form-control" 
            value={value} 
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            style={{ width: '100%', height: '50px', borderRadius: '14px', border: '2px solid #E2E8F0', ...highlightStyle }}
          >
            <option value="">Pilih {label}...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</label>
        <input 
          type="text" 
          className="form-control" 
          value={value} 
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          style={{ width: '100%', height: '50px', borderRadius: '14px', border: '2px solid #E2E8F0', ...highlightStyle }}
          placeholder={`Isi ${label}...`}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ 
        fontSize: '17px', 
        fontWeight: 600, 
        color: highlight ? '#15803D' : 'var(--text-primary)',
        padding: highlight ? '10px' : '0',
        background: highlight ? '#F0FDF4' : 'transparent',
        borderRadius: '10px',
        minHeight: '28px',
        ...highlightStyle
      }}>
        {value || '-'}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{value || '-'}</span>
    </div>
  );
}
