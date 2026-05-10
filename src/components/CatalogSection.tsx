'use client';
import { useState, useEffect, useRef } from 'react';
import BankCard from './BankCard';
import type { BankSampah, Spesialisasi } from '@/lib/types';

const ALL_SPEC: (Spesialisasi | 'Semua')[] = [
  'Semua','Plastik','Kertas','Kardus','Logam','Botol Kaca',
  'Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'
];
const SORT_OPTIONS = ['Rating Tertinggi','Ulasan Terbanyak','Nama A–Z'];

export default function CatalogSection({ banks }: { banks: BankSampah[] }) {
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState<Spesialisasi | 'Semua'>('Semua');
  const [jamFilter, setJamFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('Rating Tertinggi');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  let filtered = banks.filter(b => {
    const matchSearch = b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.kecamatan.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === 'Semua' || b.spesialisasi.includes(spec as Spesialisasi);
    const matchJam = jamFilter === 'Semua' || (jamFilter === 'Buka' ? b.buka : !b.buka);
    return matchSearch && matchSpec && matchJam;
  });

  if (sortBy === 'Rating Tertinggi') filtered.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'Ulasan Terbanyak') filtered.sort((a, b) => b.reviews - a.reviews);
  else filtered.sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <section id="katalog" ref={ref} className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">DIREKTORI</span>
          <h2 className="text-4xl md:text-5xl font-black text-green-900 font-serif mt-4 mb-3">Katalog Bank Sampah</h2>
          <p className="text-gray-500 text-base">Temukan bank sampah terdekat dengan spesialisasi yang sesuai</p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-5 mb-9 shadow-lg shadow-green-900/6 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau kecamatan…"
              className="bg-transparent border-none outline-none text-sm w-full text-green-900 placeholder:text-gray-400" />
          </div>
          <select value={spec} onChange={e => setSpec(e.target.value as Spesialisasi | 'Semua')}
            className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-sm text-green-900 outline-none cursor-pointer">
            {ALL_SPEC.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={jamFilter} onChange={e => setJamFilter(e.target.value)}
            className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-sm text-green-900 outline-none cursor-pointer">
            {['Semua','Buka','Tutup'].map(s => <option key={s} value={s}>{s === 'Semua' ? 'Jam: Semua' : s}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-sm text-green-900 outline-none cursor-pointer">
            {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-gray-400 text-sm whitespace-nowrap">{filtered.length} ditemukan</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bank, i) => (
            <div key={bank.id}
              className="transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${i * 60}ms` }}>
              <BankCard bank={bank} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>Tidak ada bank sampah yang ditemukan</p>
          </div>
        )}
      </div>
    </section>
  );
}
