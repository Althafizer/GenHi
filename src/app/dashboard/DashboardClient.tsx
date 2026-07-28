'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { BankSampah } from '@/lib/types';
import LocationPicker from '@/components/LocationPicker';

const SPESIALISASI = ['Plastik','Kertas','Kardus','Logam','Botol Kaca','Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'];
const KECAMATAN = ['Gedongtengen','Jetis','Gondokusuman','Danurejan','Pakualaman','Gondomanan','Ngampilan','Wirobrajan','Mantrijeron','Kraton','Mergangsan','Umbulharjo','Kotagede','Tegalrejo','Depok'];
const TABS = ['Profil','Lokasi','Foto & Media','Sosial Media','Statistik'];

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
    kecamatan: bank?.kecamatan || 'Gedongtengen',
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
    lat: bank?.lat ?? null as number | null,
    lng: bank?.lng ?? null as number | null,
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

  const inputCls = "w-full bg-white/[8%] border border-white/[12%] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-white/30";
  const labelCls = "block text-green-400 text-xs font-bold mb-1.5";

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header */}
      <header className="bg-green-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white font-black font-serif">G</div>
          <div>
            <div className="font-black text-white text-sm font-serif">Dashboard GenHi</div>
            <div className="text-green-400 text-xs">{bank?.nama || 'Bank Sampah'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {bank?.aktif ? (
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">✓ Aktif di Katalog</span>
          ) : (
            <span className="bg-amber-500/15 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">⏳ Menunggu Verifikasi</span>
          )}
          {bank?.slug && (
            <Link href={`/bank-sampah/${bank.slug}`} target="_blank"
              className="text-xs text-green-400 hover:text-green-300 transition-colors font-semibold border border-green-500/30 px-3 py-1 rounded-full hover:bg-green-500/10">
              Lihat Profil ↗
            </Link>
          )}
          <button onClick={handleLogout} className="text-xs text-white/40 hover:text-red-400 transition-colors font-semibold">Keluar</button>
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
              <div key={i} className="bg-white/[8%] rounded-2xl p-4 border border-white/10">
                <div className="text-xl font-black text-white font-serif">{s.val}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[6%] rounded-2xl p-1 mb-6 border border-white/10">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'text-white/40 hover:text-white/70'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab: Profil */}
        {tab === 'Profil' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
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
                <label className={labelCls}>Kecamatan *</label>
                <select value={form.kecamatan} onChange={e => update('kecamatan', e.target.value)}
                  className={inputCls + ' cursor-pointer'}>
                  {KECAMATAN.map(k => <option key={k} value={k} className="bg-green-900">{k}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Jam Operasional</label>
                <input value={form.jam} onChange={e => update('jam', e.target.value)} className={inputCls} placeholder="Sen–Jum 08:00–16:00" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} />
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
                        : 'bg-white/[8%] text-white/60 border-white/15 hover:border-green-500/50'}`}>
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
            <div className="flex items-center justify-between p-4 bg-white/[6%] rounded-xl border border-white/10">
              <label className="text-sm font-bold text-white">Status Operasional</label>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => update('buka', !form.buka)}
                  className={`relative w-11 h-6 rounded-full transition-colors overflow-hidden ${form.buka ? 'bg-green-500' : 'bg-white/20'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.buka ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-semibold w-10 ${form.buka ? 'text-green-400' : 'text-white/40'}`}>{form.buka ? 'Buka' : 'Tutup'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Lokasi */}
        {tab === 'Lokasi' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <LocationPicker
              lat={form.lat}
              lng={form.lng}
              onChange={(lat, lng) => setForm(f => ({ ...f, lat, lng }))}
              onClear={() => setForm(f => ({ ...f, lat: null, lng: null }))}
            />
          </div>
        )}

        {/* Tab: Foto & Media */}
        {tab === 'Foto & Media' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <label className={labelCls}>Foto Utama Bank Sampah</label>
              {bank?.foto_url && (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 bg-white/10">
                  <img src={bank.foto_url} alt="Foto" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-white/[4%] transition-all">
                <span className="text-3xl mb-2">📸</span>
                <span className="text-sm font-semibold text-green-400">Klik untuk upload foto</span>
                <span className="text-xs text-white/30 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        )}

        {/* Tab: Sosial Media */}
        {tab === 'Sosial Media' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
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
            <p className="text-xs text-white/30">Media sosial akan tampil di kartu bank sampah di katalog GenHi</p>
          </div>
        )}

        {/* Tab: Statistik */}
        {tab === 'Statistik' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-white/50 mb-4">Catat sampah yang terkumpul setiap bulan untuk ditampilkan di dashboard publik GenHi.</p>
            <div className="flex flex-col gap-4">
              {stats.length === 0 && (
                <div className="text-center py-10 text-white/30">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-sm">Belum ada data statistik</p>
                </div>
              )}
              {stats.map((s, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/[6%] rounded-xl border border-white/10">
                  <div className="flex-1">
                    <div className="text-xs text-white/40 mb-1">{new Date(s.periode).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</div>
                    <div className="font-bold text-white">{s.sampah_kg} kg sampah</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40 mb-1">Pendapatan</div>
                    <div className="font-bold text-green-400">Rp {s.pendapatan?.toLocaleString('id')}</div>
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
                ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
                disabled:opacity-50`}>
              {saving ? 'Menyimpan…' : saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
