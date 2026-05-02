import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AlumniContext = createContext();

export function AlumniProvider({ children }) {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('alumniHistory');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Fetch alumni from Supabase on mount
  useEffect(() => {
    fetchAlumni();
  }, []);

  // Save history to local storage (keeping it local for now as not specified)
  useEffect(() => {
    localStorage.setItem('alumniHistory', JSON.stringify(history));
  }, [history]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      // Fetch only the 10 most recent records for "Recent Activity"
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching alumni:', error);
      } else {
        // Map Supabase columns (snake_case) to application fields (camelCase)
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.nama_lulusan,
          nim: item.nim,
          tahunMasuk: item.tahun_masuk,
          tanggalLulus: item.tanggal_lulus,
          fakultas: item.fakultas,
          prodi: item.program_studi,
          email: item.email,
          noHp: item.no_hp,
          linkedin: item.linkedin_url,
          workPlace: item.tempat_kerja,
          position: item.posisi,
          jobStatus: item.status_kerja,
          workSocial: item.sosmed_kantor,
          // Keeping administration fields
          status: item.status || 'Teridentifikasi',
          query: item.query || '',
          evidence: item.evidence || '',
          date: item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : ''
        }));
        setAlumniData(mappedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAlumni = async (alumni) => {
    // Map application fields (camelCase) back to Supabase columns (snake_case)
    const newRecord = {
      nama_lulusan: alumni.name,
      nim: alumni.nim,
      tahun_masuk: alumni.tahunMasuk,
      tanggal_lulus: alumni.tanggalLulus,
      fakultas: alumni.fakultas,
      program_studi: alumni.prodi,
      email: alumni.email,
      no_hp: alumni.noHp,
      linkedin_url: alumni.linkedin,
      tempat_kerja: alumni.workPlace,
      posisi: alumni.position,
      status_kerja: alumni.jobStatus,
      sosmed_kantor: alumni.workSocial,
      status: alumni.status,
      query: alumni.query,
      evidence: alumni.evidence
    };

    try {
      const { data, error } = await supabase
        .from('alumni')
        .insert([newRecord])
        .select();

      if (error) {
        console.error('Error adding alumni:', error);
        alert('Gagal menyimpan ke Supabase: ' + error.message);
      } else {
        await fetchAlumni(); // Refresh the list
        setHistory([{ 
          action: 'Added', 
          target: alumni.name, 
          date: new Date().toLocaleString('id-ID') 
        }, ...history]);
      }
    } catch (err) {
      console.error('Unexpected error adding alumni:', err);
    }
  };

  const removeAlumni = async (id) => {
    const target = alumniData.find(a => a.id === id);
    try {
      const { error } = await supabase
        .from('alumni')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing alumni:', error);
        alert('Gagal menghapus dari Supabase: ' + error.message);
      } else {
        setAlumniData(alumniData.filter(a => a.id !== id));
        if (target) {
          setHistory([{ 
            action: 'Deleted', 
            target: target.name, 
            date: new Date().toLocaleString('id-ID') 
          }, ...history]);
        }
      }
    } catch (err) {
      console.error('Unexpected error removing alumni:', err);
    }
  };

  return (
    <AlumniContext.Provider value={{ 
      alumniData, 
      loading, 
      history, 
      addAlumni, 
      removeAlumni,
      refreshData: fetchAlumni 
    }}>
      {children}
    </AlumniContext.Provider>
  );
}
