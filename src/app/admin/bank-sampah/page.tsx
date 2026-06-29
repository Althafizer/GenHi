'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { BankSampah } from '@/lib/types';

type Filter = 'semua' | 'pending' | 'terverifikasi' | 'nonaktif';

export default function AdminBankSampahPage() {
  const [banks, setBanks] = useState<BankSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('semua');
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchBanks = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('bank_sampah')
      .select('*')
      .order('created_at', { ascending: false });
    setBanks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBanks(); }, []);

  const filtered = banks.filter(b => {
    const matchSearch = search === '' ||
      b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.kecamatan.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'semua' ? true :
      filter === 'pending' ? !b.verified :
      filter === 'terverifikasi' ? b.verified :
      filter === 'nonaktif' ? !b.aktif : true;
    return matchSearch && matchFilter;
  });

  const counts = {
    semua: banks.length,
    pending: banks.filter(b => !b.verified).length,
    terverifikasi: banks.filter(b => b.verified).length,
    nonaktif: banks.filter(b => !b.aktif).length,
  };

  const toggleVerified = async (b: BankSampah) => {
    setProcessing(b.id);
    const supabase = createClient();
    await supabase
      .from('bank_sampah')
      .update({ verified: !b.verified })
      .eq('id', b.id);
    await fetchBanks();
    setProcessing(null);
  };

  const toggleAktif = async (b: BankSampah) => {
    setProcessing(b.id + '_aktif');
    const supabase = createClient();
    await supabase
      .from('bank_sampah')
      .update({ aktif: !b.aktif })
      .eq('id', b.id);
    await fetchBanks();
    setProcessing(null);
  };

  const TABS: { key: Filter; label: string }[] = [
    { key: 'semua', label: `Semua` },
    { key: 'pending', label: `Pending` },
    { key: 'terverifikasi', label: `Terverifikasi` },
    { key: 'nonaktif', label: `Nonaktif` },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white font-serif">Manajemen Bank Sampah</h1>
        <p className="text-slate-400 text-sm mt-1">Verifikasi pendaftaran dan kelola status Bank Sampah</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari nama atau kecamatan…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500/50 placeholder:text-slate-600 w-full sm:w-72 transition-colors"
        />
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${filter === t.key
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
              {t.label}
              <span className={`ml-1.5 text-[10px] ${filter === t.key ? 'text-slate-700' : 'text-slate-600'}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm py-10 text-center">Memuat data…</div>
      ) : (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Sampah</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kecamatan</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Daftar</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-sm">{b.nama}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{b.wa || '–'}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm hidden md:table-cell">{b.kecamatan}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {b.verified ? (
                        <span className="px-2 py-0.5 bg-green-500/15 text-green-400 text-xs font-bold rounded-full border border-green-500/25">✓ Terverifikasi</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 text-xs font-bold rounded-full border border-amber-500/25">⏳ Pending</span>
                      )}
                      {!b.aktif && (
                        <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-bold rounded-full border border-red-500/25">Nonaktif</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 justify-end flex-wrap">
                      <button
                        onClick={() => toggleVerified(b)}
                        disabled={processing === b.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40
                          ${b.verified
                            ? 'bg-slate-700/80 text-slate-300 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 border border-transparent'
                            : 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'}`}>
                        {processing === b.id ? '…' : b.verified ? 'Batalkan' : 'Verifikasi'}
                      </button>
                      <button
                        onClick={() => toggleAktif(b)}
                        disabled={processing === b.id + '_aktif'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 border border-transparent
                          ${b.aktif
                            ? 'bg-slate-700/80 text-slate-300 hover:bg-red-500/15 hover:text-red-400'
                            : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'}`}>
                        {processing === b.id + '_aktif' ? '…' : b.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <Link href={`/bank-sampah/${b.slug}`} target="_blank"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700/80 text-slate-300 hover:text-white border border-transparent transition-all">
                        ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-600 text-sm">
                    {search ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada data'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
