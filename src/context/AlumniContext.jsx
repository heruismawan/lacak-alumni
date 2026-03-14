import { createContext, useState, useEffect } from 'react';

const initialAlumni = [
  {
    id: '1',
    name: 'Andi Saputra',
    status: 'Teridentifikasi',
    query: 'Nama + Tahun Lulus',
    evidence: 'https://linkedin.com/in/andi',
    date: '2026-03-14 10:00',
  },
  {
    id: '2',
    name: 'Siti Aminah',
    status: 'Perlu Verifikasi',
    query: 'Nama + Jurusan',
    evidence: '-',
    date: '2026-03-13 14:30',
  }
];

export const AlumniContext = createContext();

export function AlumniProvider({ children }) {
  const [alumniData, setAlumniData] = useState(() => {
    // Try loading from local storage
    const saved = localStorage.getItem('alumniData');
    if (saved) return JSON.parse(saved);
    return initialAlumni;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('alumniHistory');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('alumniData', JSON.stringify(alumniData));
    localStorage.setItem('alumniHistory', JSON.stringify(history));
  }, [alumniData, history]);

  const addAlumni = (alumni) => {
    const newAlumni = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('id-ID'),
      ...alumni
    };
    setAlumniData([newAlumni, ...alumniData]);
    setHistory([{ action: 'Added', target: alumni.name, date: new Date().toLocaleString('id-ID') }, ...history]);
  };

  const removeAlumni = (id) => {
    const target = alumniData.find(a => a.id === id);
    if(target) {
      setAlumniData(alumniData.filter(a => a.id !== id));
      setHistory([{ action: 'Deleted', target: target.name, date: new Date().toLocaleString('id-ID') }, ...history]);
    }
  };

  return (
    <AlumniContext.Provider value={{ alumniData, history, addAlumni, removeAlumni }}>
      {children}
    </AlumniContext.Provider>
  );
}
