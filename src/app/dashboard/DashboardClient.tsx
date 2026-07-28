'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { BankSampah } from '@/lib/types';
import LocationPicker from '@/components/LocationPicker';
import { FiCheck, FiClock, FiExternalLink, FiCamera, FiBarChart2, FiInstagram, FiFacebook, FiYoutube, FiGlobe, FiTrash2, FiPlus, FiLock } from 'react-icons/fi';

const SPESIALISASI = ['Plastik','Kertas','Kardus','Logam','Botol Kaca','Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'];
const KECAMATAN = ['Gedongtengen','Jetis','Gondokusuman','Danurejan','Pakualaman','Gondomanan','Ngampilan','Wirobrajan','Mantrijeron','Kraton','Mergangsan','Umbulharjo','Kotagede','Tegalrejo','Depok'];
const TABS = ['Profil','Lokasi','Foto & Media','Sosial Media','Statistik','Akun'];

// Storage public URLs look like ".../object/public/bank-sampah-photos/<path>" — extract <path> for deletion.
function storagePathFromUrl(url: string): string | null {
  const marker = '/bank-sampah-photos/';
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export default function DashboardClient({ user, bank, stats }: {
  user: any; bank: BankSampah | null; stats: any[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState('Profil');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(bank?.foto_url || null);
  const [galeri, setGaleri] = useState<string[]>(bank?.galeri || []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
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
    setFotoUrl(data.publicUrl);
  };

  const handleDeleteMainPhoto = async () => {
    if (!bank || !fotoUrl) return;
    const path = storagePathFromUrl(fotoUrl);
    if (path) await supabase.storage.from('bank-sampah-photos').remove([path]);
    await supabase.from('bank_sampah').update({ foto_url: null }).eq('user_id', user.id);
    setFotoUrl(null);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !bank) return;
    setGalleryUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/galeri/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('bank-sampah-photos').upload(path, file);
    if (upErr) { setGalleryUploading(false); return; }
    const { data } = supabase.storage.from('bank-sampah-photos').getPublicUrl(path);
    const nextGaleri = [...galeri, data.publicUrl];
    const { error } = await supabase.from('bank_sampah').update({ galeri: nextGaleri }).eq('user_id', user.id);
    setGalleryUploading(false);
    if (!error) setGaleri(nextGaleri);
  };

  const handleDeleteGalleryPhoto = async (url: string) => {
    if (!bank) return;
    const nextGaleri = galeri.filter(u => u !== url);
    const { error } = await supabase.from('bank_sampah').update({ galeri: nextGaleri }).eq('user_id', user.id);
    if (error) return;
    setGaleri(nextGaleri);
    const path = storagePathFromUrl(url);
    if (path) await supabase.storage.from('bank-sampah-photos').remove([path]);
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (pwForm.password.length < 6) { setPwError('Password minimal 6 karakter'); return; }
    if (pwForm.password !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.password });
    setPwSaving(false);
    if (error) { setPwError('Gagal mengubah password'); return; }
    setPwForm({ password: '', confirm: '' });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
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
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 inline-flex items-center gap-1"><FiCheck className="w-3 h-3" /> Aktif di Katalog</span>
          ) : (
            <span className="bg-amber-500/15 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1"><FiClock className="w-3 h-3" /> Menunggu Verifikasi</span>
          )}
          {bank?.slug && (
            <Link href={`/bank-sampah/${bank.slug}`} target="_blank"
              className="text-xs text-green-400 hover:text-green-300 transition-colors font-semibold border border-green-500/30 px-3 py-1 rounded-full hover:bg-green-500/10 inline-flex items-center gap-1">
              Lihat Profil <FiExternalLink className="w-3 h-3" />
            </Link>
          )}
          <button onClick={handleLogout} className="text-xs text-white/40 hover:text-red-400 transition-colors font-semibold">Keluar</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-black font-serif mb-1">Halo, {bank?.nama || user.email}!</h1>
          <p className="text-green-200 text-sm">Kelola profil bank sampahmu di sini. Perubahan akan langsung terlihat di website GenHi.</p>
          {!bank?.aktif && (
            <div className="mt-3 bg-white/10 rounded-xl px-4 py-2.5 text-xs text-green-200 flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 shrink-0" /> Profil kamu sedang dalam proses verifikasi oleh tim GenHi (1–2 hari kerja)
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
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div>
              <label className={labelCls}>Foto Utama Bank Sampah</label>
              {fotoUrl && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-3 bg-white/10 group">
                  <img src={fotoUrl} alt="Foto" className="w-full h-full object-cover" />
                  <button type="button" onClick={handleDeleteMainPhoto}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-white/[4%] transition-all">
                <FiCamera className="w-8 h-8 mb-2 text-green-400" />
                <span className="text-sm font-semibold text-green-400">{fotoUrl ? 'Ganti foto' : 'Klik untuk upload foto'}</span>
                <span className="text-xs text-white/30 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div>
              <label className={labelCls}>Galeri Foto</label>
              <p className="text-xs text-white/30 mb-3">Tambahkan beberapa foto suasana bank sampahmu — akan tampil di halaman profil publik.</p>
              <div className="grid grid-cols-3 gap-3">
                {galeri.map(url => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-white/10 group">
                    <img src={url} alt="Galeri" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleDeleteGalleryPhoto(url)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-white/[4%] transition-all">
                  {galleryUploading ? (
                    <span className="text-xs text-white/40">Mengupload…</span>
                  ) : (
                    <>
                      <FiPlus className="w-6 h-6 mb-1 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Tambah</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={galleryUploading} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Sosial Media */}
        {tab === 'Sosial Media' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            {[
              { label:'Instagram (username)', icon: FiInstagram, key:'instagram', placeholder:'@banksampaumu' },
              { label:'Facebook (URL halaman)', icon: FiFacebook, key:'facebook', placeholder:'https://facebook.com/...' },
              { label:'YouTube (URL channel)', icon: FiYoutube, key:'youtube', placeholder:'https://youtube.com/...' },
              { label:'Website', icon: FiGlobe, key:'website', placeholder:'https://banksampaumu.id' },
            ].map(f => (
              <div key={f.key}>
                <label className={labelCls + ' flex items-center gap-1.5'}><f.icon className="w-3.5 h-3.5" /> {f.label}</label>
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
                  <FiBarChart2 className="w-10 h-10 mx-auto mb-3" />
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

        {/* Tab: Akun */}
        {tab === 'Akun' && (
          <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 max-w-md">
            <div>
              <label className={labelCls + ' flex items-center gap-1.5'}><FiLock className="w-3.5 h-3.5" /> Password Baru</label>
              <input type="password" value={pwForm.password}
                onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Minimal 6 karakter" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Konfirmasi Password</label>
              <input type="password" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Ulangi password baru" className={inputCls} />
            </div>
            {pwError && <p className="text-xs text-red-400">{pwError}</p>}
            <button type="button" onClick={handleChangePassword} disabled={pwSaving || !pwForm.password}
              className={`self-start px-6 py-3 rounded-2xl font-bold text-sm transition-all
                ${pwSaved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
                disabled:opacity-50`}>
              {pwSaving ? 'Menyimpan…' : pwSaved ? <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4" /> Password diubah!</span> : 'Ubah Password'}
            </button>
          </div>
        )}

        {/* Save button */}
        {tab !== 'Statistik' && tab !== 'Foto & Media' && tab !== 'Akun' && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all
                ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
                disabled:opacity-50`}>
              {saving ? 'Menyimpan…' : saved ? <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4" /> Tersimpan!</span> : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
