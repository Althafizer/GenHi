'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { BankSampah } from '@/lib/types';

const SPESIALISASI = ['Plastik','Kertas','Kardus','Logam','Botol Kaca','Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'];
const TABS = ['Profil','Foto & Media','Sosial Media','Statistik'];

export default function DashboardClient({ user, bank, stats }: {
  user: any; bank: BankSampah | null; stats: any[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState('Profil');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nama: bank?.nama || '',
    alamat: bank?.alamat || '',
    kecamatan: bank?.kecamatan || '',
    wa: bank?.wa || '',
    email: bank?.email || '',
    jam: bank?.jam || '',
    deskripsi: bank?.deskripsi || '',
    buka: bank?.buka ?? true,
    spesialisasi: bank?.spesialisasi || [],
    instagram: bank?.instagram || '',
    facebook: bank?.facebook || '',
    youtube: bank?.youtube || '',
    website: bank?.website || '',
  });

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpec = (s: string) => setForm(f => ({
    ...f,
    spesialisasi: f.spesialisasi.includes(s as any)
      ? f.spesialisasi.filter(x => x !== (s as any))
      : [...f.spesialisasi, s as any]
  }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('bank_sampah')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bank) return;
    const ext = file.name.split('.').pop();
    const path = `${user.id}/foto-utama.${ext}`;
    const { error: upErr } = await supabase.storage.from('bank-sampah-photos').upload(path, file, { upsert: true });
    if (upErr) return;
    const { data } = supabase.storage.from('bank-sampah-photos').getPublicUrl(path);
    await supabase.from('bank_sampah').update({ foto_url: data.publicUrl }).eq('user_id', user.id);
    router.refresh();
  };

  const inputCls = "w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-900 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all";
  const labelCls = "block text-green-700 text-xs font-bold mb-1.5";

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-black font-serif">G</div>
          <div>
            <div className="font-black text-green-900 text-sm font-serif">Dashboard GenHi</div>
            <div className="text-green-500 text-xs">{bank?.nama || 'Bank Sampah'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {bank?.aktif ? (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ Aktif di Katalog</span>
          ) : (
            <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full">⏳ Menunggu Verifikasi</span>
          )}
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-semibold">Keluar</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-black font-serif mb-1">Halo, {bank?.nama || user.email}! 👋</h1>
          <p className="text-green-200 text-sm">Kelola profil bank sampahmu di sini. Perubahan akan langsung terlihat di website GenHi.</p>
          {!bank?.aktif && (
            <div className="mt-3 bg-white/10 rounded-xl px-4 py-2.5 text-xs text-green-200">
              ⏳ Profil kamu sedang dalam proses verifikasi oleh tim GenHi (1–2 hari kerja)
            </div>
          )}
        </div>

        {/* Stats mini */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Sampah Bulan Ini', val: `${stats[0]?.sampah_kg || 0} kg` },
              { label: 'Pendapatan', val: `Rp ${(stats[0]?.pendapatan || 0).toLocaleString('id')}` },
              { label: 'Nasabah Baru', val: stats[0]?.nasabah_baru || 0 },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-green-50">
                <div className="text-xl font-black text-green-900 font-serif">{s.val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-green-100/50 rounded-2xl p-1 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-white text-green-700 shadow-sm' : 'text-green-500 hover:text-green-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab: Profil */}
        {tab === 'Profil' && (
          <div className="bg-white rounded-2xl p-6 border border-green-50 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Nama Bank Sampah *</label>
                <input value={form.nama} onChange={e => update('nama', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nomor WhatsApp *</label>
                <input value={form.wa} onChange={e => update('wa', e.target.value)} className={inputCls} placeholder="08xxxxxxxxxx" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Alamat Lengkap *</label>
                <input value={form.alamat} onChange={e => update('alamat', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Jam Operasional</label>
                <input value={form.jam} onChange={e => update('jam', e.target.value)} className={inputCls} placeholder="Sen–Jum 08:00–16:00" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Spesialisasi Sampah *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SPESIALISASI.map(s => (
                  <button key={s} type="button" onClick={() => toggleSpec(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                      ${form.spesialisasi.includes(s as any)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-green-50 text-green-600 border-green-100 hover:border-green-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Deskripsi Singkat</label>
              <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)} rows={3}
                placeholder="Ceritakan tentang bank sampah kamu…"
                className={inputCls + ' resize-none'} />
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <label className="text-sm font-bold text-green-900">Status Operasional</label>
              <button type="button" onClick={() => update('buka', !form.buka)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.buka ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.buka ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className={`text-sm font-semibold ${form.buka ? 'text-green-600' : 'text-gray-400'}`}>{form.buka ? 'Buka' : 'Tutup'}</span>
            </div>
          </div>
        )}

        {/* Tab: Foto & Media */}
        {tab === 'Foto & Media' && (
          <div className="bg-white rounded-2xl p-6 border border-green-50 flex flex-col gap-5">
            <div>
              <label className={labelCls}>Foto Utama Bank Sampah</label>
              {bank?.foto_url && (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 bg-green-50">
                  <img src={bank.foto_url} alt="Foto" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-green-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <span className="text-3xl mb-2">📸</span>
                <span className="text-sm font-semibold text-green-600">Klik untuk upload foto</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        )}

        {/* Tab: Sosial Media */}
        {tab === 'Sosial Media' && (
          <div className="bg-white rounded-2xl p-6 border border-green-50 flex flex-col gap-5">
            {[
              { label:'📸 Instagram (username)', key:'instagram', placeholder:'@banksampaumu' },
              { label:'📘 Facebook (URL halaman)', key:'facebook', placeholder:'https://facebook.com/...' },
              { label:'▶️ YouTube (URL channel)', key:'youtube', placeholder:'https://youtube.com/...' },
              { label:'🌐 Website', key:'website', placeholder:'https://banksampaumu.id' },
            ].map(f => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} className={inputCls} />
              </div>
            ))}
            <p className="text-xs text-gray-400">Media sosial akan tampil di kartu bank sampah di katalog GenHi</p>
          </div>
        )}

        {/* Tab: Statistik */}
        {tab === 'Statistik' && (
          <div className="bg-white rounded-2xl p-6 border border-green-50">
            <p className="text-sm text-gray-500 mb-4">Catat sampah yang terkumpul setiap bulan untuk ditampilkan di dashboard publik GenHi.</p>
            <div className="flex flex-col gap-4">
              {stats.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-sm">Belum ada data statistik</p>
                </div>
              )}
              {stats.map((s, i) => (
                <div key={i} className="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">{new Date(s.periode).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</div>
                    <div className="font-bold text-green-900">{s.sampah_kg} kg sampah</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Pendapatan</div>
                    <div className="font-bold text-green-600">Rp {s.pendapatan?.toLocaleString('id')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        {tab !== 'Statistik' && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all
                ${saved ? 'bg-green-100 text-green-600' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
                disabled:opacity-50`}>
              {saving ? 'Menyimpan…' : saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
