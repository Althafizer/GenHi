'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Counts {
  totalBanks: number;
  pendingBanks: number;
  verifiedBanks: number;
  totalArtikel: number;
  publishedArtikel: number;
}

interface PendingBank {
  id: string;
  nama: string;
  kecamatan: string;
  wa: string | null;
  created_at: string;
}

interface RecentArtikel {
  id: string;
  judul: string;
  published: boolean;
  created_at: string;
  penulis: string;
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Counts>({
    totalBanks: 0, pendingBanks: 0, verifiedBanks: 0, totalArtikel: 0, publishedArtikel: 0,
  });
  const [recentPending, setRecentPending] = useState<PendingBank[]>([]);
  const [recentArtikel, setRecentArtikel] = useState<RecentArtikel[]>([]);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from('bank_sampah').select('*', { count: 'exact', head: true }),
      supabase.from('bank_sampah').select('*', { count: 'exact', head: true }).eq('verified', false),
      supabase.from('bank_sampah').select('*', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('artikel').select('*', { count: 'exact', head: true }),
      supabase.from('artikel').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('bank_sampah').select('id, nama, kecamatan, wa, created_at').eq('verified', false).order('created_at', { ascending: false }).limit(5),
      supabase.from('artikel').select('id, judul, published, created_at, penulis').order('created_at', { ascending: false }).limit(5),
    ]).then(([
      { count: totalBanks },
      { count: pendingBanks },
      { count: verifiedBanks },
      { count: totalArtikel },
      { count: publishedArtikel },
      { data: pendingData },
      { data: artikelData },
    ]) => {
      setCounts({
        totalBanks: totalBanks ?? 0,
        pendingBanks: pendingBanks ?? 0,
        verifiedBanks: verifiedBanks ?? 0,
        totalArtikel: totalArtikel ?? 0,
        publishedArtikel: publishedArtikel ?? 0,
      });
      setRecentPending((pendingData as PendingBank[]) || []);
      setRecentArtikel((artikelData as RecentArtikel[]) || []);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Total Bank Sampah', value: counts.totalBanks, sub: 'terdaftar', color: 'text-white', bg: 'bg-slate-800/50' },
    { label: 'Menunggu Verifikasi', value: counts.pendingBanks, sub: 'perlu ditinjau', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
    { label: 'Terverifikasi', value: counts.verifiedBanks, sub: 'aktif di katalog', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
    { label: 'Total Artikel', value: counts.totalArtikel, sub: `${counts.publishedArtikel} dipublikasi`, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white font-serif">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Ringkasan seluruh aktivitas platform GenHi</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 border border-slate-700/50 ${s.bg}`}>
            <div className={`text-4xl font-black font-serif ${s.color}`}>{loading ? '…' : s.value}</div>
            <div className="text-white text-sm font-semibold mt-2">{s.label}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              {counts.pendingBanks > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
              <h2 className="text-white font-bold text-sm">Bank Sampah Pending</h2>
            </div>
            <Link href="/admin/bank-sampah" className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Kelola semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-700/30">
            {loading ? (
              <div className="px-5 py-8 text-center text-slate-600 text-sm">Memuat…</div>
            ) : recentPending.length > 0 ? recentPending.map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <div className="text-white text-sm font-semibold">{b.nama}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{b.kecamatan} · {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 text-xs font-bold rounded-full border border-amber-500/25">Pending</span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-slate-600 text-sm">Tidak ada pendaftaran pending</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <h2 className="text-white font-bold text-sm">Artikel Terbaru</h2>
            <Link href="/admin/artikel" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Kelola semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-700/30">
            {loading ? (
              <div className="px-5 py-8 text-center text-slate-600 text-sm">Memuat…</div>
            ) : recentArtikel.length > 0 ? recentArtikel.map(a => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{a.judul}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{a.penulis} · {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                </div>
                <span className={`ml-3 shrink-0 px-2 py-0.5 text-xs font-bold rounded-full border
                  ${a.published
                    ? 'bg-green-500/15 text-green-400 border-green-500/25'
                    : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                  {a.published ? 'Publik' : 'Draft'}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-slate-600 text-sm">Belum ada artikel</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
