'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Artikel } from '@/lib/types';
import { FiFileText, FiArrowRight } from 'react-icons/fi';

export default function AdminArtikelPage() {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'semua' | 'published' | 'draft'>('semua');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArtikels = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: false });
    setArtikels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArtikels(); }, []);

  const filtered = artikels.filter(a =>
    filter === 'semua' ? true :
    filter === 'published' ? a.published :
    !a.published
  );

  const togglePublished = async (a: Artikel) => {
    setProcessing(a.id);
    const supabase = createClient();
    await supabase
      .from('artikel')
      .update({
        published: !a.published,
        published_at: !a.published ? new Date().toISOString() : null,
      })
      .eq('id', a.id);
    await fetchArtikels();
    setProcessing(null);
  };

  const handleDelete = async (a: Artikel) => {
    if (!confirm(`Hapus artikel "${a.judul}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(a.id);
    const supabase = createClient();
    await supabase.from('artikel').delete().eq('id', a.id);
    await fetchArtikels();
    setDeleting(null);
  };

  const counts = {
    semua: artikels.length,
    published: artikels.filter(a => a.published).length,
    draft: artikels.filter(a => !a.published).length,
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white font-serif">Manajemen Artikel</h1>
          <p className="text-slate-400 text-sm mt-1">Buat, edit, dan kelola konten artikel GenHi</p>
        </div>
        <Link href="/admin/artikel/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-xl transition-colors shrink-0">
          + Artikel Baru
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(['semua', 'published', 'draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all capitalize
              ${filter === f
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
            {f === 'semua' ? 'Semua' : f === 'published' ? 'Publik' : 'Draft'}
            <span className={`ml-1.5 text-[10px] ${filter === f ? 'text-slate-700' : 'text-slate-600'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm py-10 text-center">Memuat data…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl py-16 text-center">
          <FiFileText className="w-10 h-10 mx-auto mb-3 text-slate-500" />
          <p className="text-slate-400 text-sm font-semibold">Belum ada artikel</p>
          <Link href="/admin/artikel/new"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/15 text-amber-400 text-sm font-bold rounded-xl border border-amber-500/25 hover:bg-amber-500/25 transition-colors">
            Buat artikel pertama <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Artikel</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Tag</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-sm line-clamp-1">{a.judul}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.penulis} · {a.read_time} menit baca</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {a.tag ? (
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">{a.tag}</span>
                    ) : (
                      <span className="text-slate-600 text-xs">–</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full border
                      ${a.published
                        ? 'bg-green-500/15 text-green-400 border-green-500/25'
                        : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                      {a.published ? 'Publik' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                    {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => togglePublished(a)}
                        disabled={processing === a.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 border border-transparent
                          ${a.published
                            ? 'bg-slate-700/80 text-slate-300 hover:bg-amber-500/15 hover:text-amber-400'
                            : 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25'}`}>
                        {processing === a.id ? '…' : a.published ? 'Jadikan Draft' : 'Publikasi'}
                      </button>
                      <Link href={`/admin/artikel/${a.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700/80 text-slate-300 hover:text-white border border-transparent transition-all">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(a)}
                        disabled={deleting === a.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700/80 text-slate-300 hover:bg-red-500/15 hover:text-red-400 border border-transparent transition-all disabled:opacity-40">
                        {deleting === a.id ? '…' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
