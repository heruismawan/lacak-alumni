import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Users, CheckCircle, TrendingUp, Calendar, ArrowRight, UserPlus, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    identified: 0,
    employmentRate: 0,
    latestYear: '-'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealtimeStats();
  }, []);

  const fetchRealtimeStats = async () => {
    setLoading(true);
    try {
      // 1. Hitung Total Alumni
      const { count: total, error: e1 } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true });

      // 2. Hitung Teridentifikasi (Tempat Kerja atau LinkedIn tidak kosong)
      // Supabase count doesn't easily support OR in a single head query for count, 
      // but we can filter where either is not null.
      const { count: identified, error: e2 } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .or('tempat_kerja.not.is.null,linkedin_url.not.is.null');

      // 3. Hitung Alumni yang Bekerja (untuk Tingkat Kepekerjaan)
      const { count: working, error: e3 } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .not('tempat_kerja', 'is', null);

      // 4. Ambil Tahun Akademik Terbaru
      const { data: latestData, error: e4 } = await supabase
        .from('alumni')
        .select('tahun_masuk')
        .order('tahun_masuk', { ascending: false })
        .limit(1);

      if (e1 || e2 || e3 || e4) throw e1 || e2 || e3 || e4;

      const rate = total > 0 ? Math.round((working / total) * 100) : 0;
      const year = latestData?.[0]?.tahun_masuk || '-';

      setStats({
        total: total || 0,
        identified: identified || 0,
        employmentRate: rate,
        latestYear: year
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Statistik real-time penelusuran data alumni</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/input" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 20px' }}>
            <UserPlus size={18} /> Tambah Data
          </Link>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard color="var(--primary)" bg="var(--primary-light)" icon={<Users size={24} color="var(--primary)"/>} number={loading ? '...' : stats.total.toLocaleString()} label="Total Alumni" />
        <StatCard color="#10B981" bg="#D1FAE5" icon={<CheckCircle size={24} color="#10B981"/>} number={loading ? '...' : stats.identified.toLocaleString()} label="Teridentifikasi" />
        <StatCard color="#F59E0B" bg="#FEF3C7" icon={<TrendingUp size={24} color="#F59E0B"/>} number={loading ? '...' : `${stats.employmentRate}%`} label="Tingkat Kepekerjaan" />
        <StatCard color="#3B82F6" bg="#DBEAFE" icon={<Calendar size={24} color="#3B82F6"/>} number={loading ? '...' : stats.latestYear} label="Tahun Akademik" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Optimasi Pencarian</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Sistem sekarang terhubung langsung ke Supabase. Pencarian 26.000+ data dilakukan secara instan di sisi server untuk menghemat memori perangkat Anda.
          </p>
          <Link to="/tracking" className="btn btn-secondary" style={{ borderRadius: '10px' }}>
            Buka Tracking List <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card" style={{ padding: '32px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', border: 'none' }}>
          <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>Status Koneksi</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
            <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Terhubung ke Supabase Cloud</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
            Semua perubahan data akan langsung tersimpan secara aman di database pusat.
          </p>
        </div>
      </div>
    </>
  );
}

function StatCard({ bg, icon, number, label }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', marginBottom: 0, borderRadius: '16px' }}>
      <div style={{ background: bg, width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{number}</div>
      </div>
    </div>
  );
}
