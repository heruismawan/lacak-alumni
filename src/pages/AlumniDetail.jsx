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
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setAlumni(data);
        setFormData({
          ...data,
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
      const existingColumns = Object.keys(alumni);
      const dataToSave = {};
      const targetFields = ['tempat_kerja', 'jabatan', 'alamat', 'linkedin_url', 'email', 'nomor_wa', 'status_kerja'];
      
      targetFields.forEach(field => {
        if (existingColumns.includes(field)) {
          dataToSave[field] = formData[field];
        }
      });

      const { error } = await supabase
        .from('alumni')
        .update(dataToSave)
        .eq('id', id);

      if (error) throw error;

      alert('Berhasil simpan ke DB');
      setIsEditing(false);
      await fetchAlumniData();
    } catch (error) {
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '20px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <h2 style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Sinkronisasi profil alumni...</h2>
      </div>
    );
  }

  if (!alumni) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Data alumni tidak ditemukan.</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('/tracking')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}>
          <ArrowLeft size={16} /> Kembali ke Daftar
        </button>
      </div>

      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700 }}>
            {alumni.nama_lulusan?.charAt(0)}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-primary)' }}>{alumni.nama_lulusan}</h1>
            <p style={{ margin: '4px 0 0', fontWeight: 500, color: 'var(--text-secondary)' }}>NIM: {alumni.nim || '-'}</p>
          </div>
        </div>
        <div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                <X size={16} /> Batal
              </button>
              <button onClick={handleSave} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                <Save size={16} /> Simpan
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <Edit2 size={16} /> Edit Profil
            </button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <TrendingUp size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Magic Paste Vault</h3>
            </div>
            <textarea 
              placeholder="Tempel hasil pelacakan AI di sini..."
              className="form-control"
              style={{ height: '120px', resize: 'none', background: 'var(--bg-body)' }}
              onChange={(e) => handleMagicPaste(e.target.value)}
            ></textarea>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>Parser otomatis untuk: Perusahaan, Jabatan, Lokasi, LinkedIn, Email, WA, Status.</p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 600 }}>
              <Briefcase size={22} color="var(--primary)" /> Career Intelligence
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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

          <div className="card">
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 600 }}>
              <Mail size={22} color="var(--primary)" /> Network Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <InputGroup label="Email" field="email" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.email} />
              <InputGroup label="Nomor WhatsApp" field="nomor_wa" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.nomor_wa} />
              <div style={{ gridColumn: '1 / span 2' }}>
                <InputGroup label="LinkedIn URL" field="linkedin_url" formData={formData} setFormData={setFormData} isEditing={isEditing} highlight={highlights.linkedin_url} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
              <Globe size={20} color="var(--primary)" /> AI OSINT Helper
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleSearch} className="btn btn-secondary" style={{ width: '100%', height: '48px' }}>
                <Search size={16} /> Cari di Google
              </button>
              <button 
                onClick={() => {
                  const prompt = `Cari informasi terbaru tentang ${alumni.nama_lulusan} lulusan ${alumni.program_studi} dari ${alumni.fakultas}. Berikan data dalam 7 poin: 1.Perusahaan, 2.Jabatan, 3.Alamat, 4.LinkedIn, 5.Email, 6.WhatsApp, 7.Status Kerja. (jawab intinya saja, jangan berikan kalimat pembuka atau penutup)`;
                  navigator.clipboard.writeText(prompt);
                  alert('Prompt AI disalin!');
                }} 
                className="btn btn-primary" style={{ width: '100%', height: '48px' }}
              >
                Salin Prompt AI
              </button>
              <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>
                Klik tombol di atas, lalu tempel (paste) ke Grok AI atau Perplexity untuk mencari data otomatis.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Academic Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
    borderColor: 'var(--primary)', 
    background: 'rgba(99, 102, 241, 0.05)'
  } : {};

  if (isEditing) {
    if (type === 'select') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
          <select 
            className="form-control" 
            value={value} 
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            style={{ ...highlightStyle }}
          >
            <option value="">Pilih {label}...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
        <input 
          type="text" 
          className="form-control" 
          value={value} 
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          style={{ ...highlightStyle }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 500, 
        color: highlight ? 'var(--primary)' : 'var(--text-primary)',
        padding: highlight ? '8px' : '0',
        borderRadius: '8px',
        ...highlightStyle
      }}>
        {value || '-'}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value || '-'}</span>
    </div>
  );
}
