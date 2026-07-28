'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Artikel } from '@/lib/types';
import { FiArrowLeft, FiImage } from 'react-icons/fi';

const TAGS = ['Tips & Trik', 'Kisah Sukses', 'Edukasi', 'Berita', 'Program'];

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

interface Props {
  initialData?: Artikel;
  mode: 'create' | 'edit';
}

export default function ArtikelForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const [form, setForm] = useState({
    judul: initialData?.judul || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    konten: initialData?.konten || '',
    tag: initialData?.tag || '',
    penulis: initialData?.penulis || 'Tim GenHi',
    read_time: initialData?.read_time || 5,
    thumbnail_url: initialData?.thumbnail_url || '',
    published: initialData?.published || false,
  });

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleJudulChange = (val: string) => {
    setForm(f => ({
      ...f,
      judul: val,
      slug: mode === 'create' ? toSlug(val) : f.slug,
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('artikel-thumbnails')
      .upload(path, file, { upsert: false });
    if (!upErr) {
      const { data } = supabase.storage.from('artikel-thumbnails').getPublicUrl(path);
      update('thumbnail_url', data.publicUrl);
    }
    setThumbnailUploading(false);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.judul.trim()) { setError('Judul wajib diisi.'); return; }
    if (!form.slug.trim()) { setError('Slug wajib diisi.'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const payload = {
      ...form,
      published: publish,
      published_at: publish ? (initialData?.published_at || new Date().toISOString()) : null,
      tag: form.tag || null,
    };

    if (mode === 'create') {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: err } = await supabase
        .from('artikel')
        .insert({ ...payload, user_id: user?.id });
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('artikel')
        .update(payload)
        .eq('id', initialData!.id);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    router.push('/admin/artikel');
    router.refresh();
  };

  const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-600";
  const labelCls = "block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider";

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-1"><FiArrowLeft className="w-4 h-4" /> Kembali</button>
        <h1 className="text-2xl font-black text-white font-serif">
          {mode === 'create' ? 'Artikel Baru' : 'Edit Artikel'}
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Judul */}
        <div>
          <label className={labelCls}>Judul *</label>
          <input
            value={form.judul}
            onChange={e => handleJudulChange(e.target.value)}
            placeholder="Judul artikel…"
            className={inputCls}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>Slug (URL) *</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-sm shrink-0">/artikel/</span>
            <input
              value={form.slug}
              onChange={e => update('slug', toSlug(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className={labelCls}>Thumbnail</label>
          {form.thumbnail_url && (
            <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-700">
              <img src={form.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 border-dashed rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors">
            <FiImage className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400 font-semibold">
              {thumbnailUploading ? 'Mengupload…' : 'Upload gambar thumbnail'}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
          </label>
          <input
            value={form.thumbnail_url}
            onChange={e => update('thumbnail_url', e.target.value)}
            placeholder="Atau masukkan URL gambar langsung…"
            className={inputCls + ' mt-2'}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelCls}>Ringkasan (Excerpt)</label>
          <textarea
            value={form.excerpt}
            onChange={e => update('excerpt', e.target.value)}
            rows={2}
            placeholder="Ringkasan singkat artikel untuk ditampilkan di daftar…"
            className={inputCls + ' resize-none'}
          />
        </div>

        {/* Konten */}
        <div>
          <label className={labelCls}>Konten *</label>
          <textarea
            value={form.konten}
            onChange={e => update('konten', e.target.value)}
            rows={14}
            placeholder="Isi artikel di sini…"
            className={inputCls + ' resize-y font-mono text-xs leading-relaxed'}
          />
        </div>

        {/* Row: Tag + Penulis + Read Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tag</label>
            <select value={form.tag} onChange={e => update('tag', e.target.value)} className={inputCls + ' cursor-pointer'}>
              <option value="" className="bg-slate-900">– Pilih tag –</option>
              {TAGS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Penulis</label>
            <input value={form.penulis} onChange={e => update('penulis', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Estimasi Baca (menit)</label>
            <input
              type="number" min={1} max={60}
              value={form.read_time}
              onChange={e => update('read_time', Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-40">
            {saving ? 'Menyimpan…' : 'Simpan Draft'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-40 shadow-lg shadow-amber-500/20">
            {saving ? 'Menyimpan…' : form.published ? 'Perbarui & Publikasi' : 'Publikasikan'}
          </button>
        </div>
      </div>
    </div>
  );
}
