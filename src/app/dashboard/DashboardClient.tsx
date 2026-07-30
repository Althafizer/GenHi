'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { BankSampah, JurnalPenimbangan } from '@/lib/types';
import LocationPicker from '@/components/LocationPicker';
import {
  FiCheck, FiClock, FiExternalLink, FiCamera, FiBarChart2, FiInstagram, FiFacebook, FiYoutube, FiGlobe,
  FiTrash2, FiPlus, FiLock, FiUser, FiMapPin, FiShare2, FiMoreVertical, FiSun, FiMoon, FiRefreshCw, FiLogOut,
} from 'react-icons/fi';

const todayStr = () => new Date().toISOString().slice(0, 10);

const THEME_KEY = 'genhi-dashboard-theme';

const SPESIALISASI = ['Plastik','Kertas','Kardus','Logam','Botol Kaca','Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'];
const KECAMATAN = ['Gedongtengen','Jetis','Gondokusuman','Danurejan','Pakualaman','Gondomanan','Ngampilan','Wirobrajan','Mantrijeron','Kraton','Mergangsan','Umbulharjo','Kotagede','Tegalrejo','Depok'];
const TABS = [
  { key: 'Profil', label: 'Profil', icon: FiUser, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' },
  { key: 'Lokasi', label: 'Lokasi', icon: FiMapPin, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
  { key: 'Foto & Media', label: 'Foto', icon: FiCamera, color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300' },
  { key: 'Sosial Media', label: 'Sosial', icon: FiShare2, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
  { key: 'Statistik', label: 'Statistik', icon: FiBarChart2, color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
  { key: 'Akun', label: 'Akun', icon: FiLock, color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' },
];

// Storage public URLs look like ".../object/public/bank-sampah-photos/<path>" — extract <path> for deletion.
function storagePathFromUrl(url: string): string | null {
  const marker = '/bank-sampah-photos/';
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export default function DashboardClient({ user, bank, stats, jurnal }: {
  user: any; bank: BankSampah | null; stats: any[]; jurnal: JurnalPenimbangan[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState('Profil');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(bank?.foto_url || null);
  const [galeri, setGaleri] = useState<string[]>(bank?.galeri || []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [localStats, setLocalStats] = useState(stats);
  const [jurnalList, setJurnalList] = useState(jurnal);
  const [jurnalForm, setJurnalForm] = useState({
    tanggal: todayStr(), nama_nasabah: '', jenis_sampah: SPESIALISASI[0],
    berat_kg: '', harga_per_kg: '', catatan: '',
  });
  const [jurnalSaving, setJurnalSaving] = useState(false);
  const [jurnalError, setJurnalError] = useState('');
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

  // Light mode is the default; only switch to dark if the user chose it previously.
  useEffect(() => {
    if (localStorage.getItem(THEME_KEY) === 'dark') setIsDark(true);
  }, []);
  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

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

  // Statistik (monthly aggregate) is auto-rolled-up from jurnal_penimbangan via a DB
  // trigger, so after any journal mutation we just re-pull that month's row.
  const refreshStatistikMonth = async (tanggal: string) => {
    if (!bank) return;
    const periode = `${tanggal.slice(0, 7)}-01`;
    const { data } = await supabase.from('statistik').select('*')
      .eq('bank_sampah_id', bank.id).eq('periode', periode).single();
    if (data) {
      setLocalStats(prev => [...prev.filter(s => s.periode !== periode), data]
        .sort((a, b) => b.periode.localeCompare(a.periode)));
    }
  };

  const handleAddJurnal = async () => {
    if (!bank) return;
    const berat = Number(jurnalForm.berat_kg);
    if (!berat || berat <= 0) { setJurnalError('Berat harus lebih dari 0 kg'); return; }
    setJurnalSaving(true);
    setJurnalError('');
    const { data, error } = await supabase.from('jurnal_penimbangan').insert({
      bank_sampah_id: bank.id,
      tanggal: jurnalForm.tanggal,
      nama_nasabah: jurnalForm.nama_nasabah.trim() || null,
      jenis_sampah: jurnalForm.jenis_sampah || null,
      berat_kg: berat,
      harga_per_kg: Number(jurnalForm.harga_per_kg) || 0,
      catatan: jurnalForm.catatan.trim() || null,
    }).select().single();
    setJurnalSaving(false);
    if (error) { setJurnalError('Gagal menyimpan entri'); return; }
    setJurnalList(prev => [data, ...prev]);
    setJurnalForm(f => ({ ...f, nama_nasabah: '', berat_kg: '', harga_per_kg: '', catatan: '' }));
    refreshStatistikMonth(data.tanggal);
  };

  const handleDeleteJurnal = async (entry: JurnalPenimbangan) => {
    const { error } = await supabase.from('jurnal_penimbangan').delete().eq('id', entry.id);
    if (error) return;
    setJurnalList(prev => prev.filter(j => j.id !== entry.id));
    refreshStatistikMonth(entry.tanggal);
  };

  const inputCls = "w-full bg-white dark:bg-white/[8%] border border-gray-300 dark:border-white/[12%] rounded-xl px-4 py-3 text-green-900 dark:text-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-white/30";
  const labelCls = "block text-green-700 dark:text-green-400 text-xs font-bold mb-1.5";

  return (
    <div className={isDark ? 'dark' : ''}>
    <div className="min-h-screen bg-gray-50 dark:bg-green-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-green-900/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white font-black font-serif shrink-0">G</div>
            <div className="min-w-0">
              <div className="font-black text-green-900 dark:text-white text-sm font-serif leading-tight truncate">{bank?.nama || 'Bank Sampah'}</div>
              <div className="text-green-600 dark:text-green-400 text-xs leading-tight">Dashboard Bank Sampah</div>
            </div>
          </div>

          {/* Kebab menu */}
          <div className="relative shrink-0">
            <button onClick={() => setMenuOpen(o => !o)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-green-700 dark:text-white/60 hover:bg-green-100 dark:hover:bg-white/10 transition-colors">
              <FiMoreVertical className="w-5 h-5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-green-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-gray-900/10 dark:shadow-green-900/10 overflow-hidden z-30">
                  <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/10">
                    <div className="font-bold text-green-900 dark:text-white text-sm truncate">{bank?.nama || 'Bank Sampah'}</div>
                    <div className="text-xs text-gray-400 dark:text-white/40 truncate">{user.email}</div>
                  </div>
                  <button onClick={() => setIsDark(d => !d)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/10">
                    <span className="text-sm font-semibold text-green-900 dark:text-white flex items-center gap-2">
                      {isDark ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />} Mode Gelap
                    </span>
                    <span className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${isDark ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
                    </span>
                  </button>
                  <button onClick={() => window.location.reload()}
                    className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/10 text-sm font-semibold text-green-900 dark:text-white">
                    <FiRefreshCw className="w-4 h-4" /> Refresh
                  </button>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-semibold text-red-500">
                    <FiLogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-2.5">
          {bank?.aktif ? (
            <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1.5 sm:py-1 rounded-full border border-green-300 dark:border-green-500/30 inline-flex items-center gap-1"><FiCheck className="w-3 h-3" /> Aktif di Katalog</span>
          ) : (
            <span className="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1.5 sm:py-1 rounded-full border border-amber-300 dark:border-amber-500/20 inline-flex items-center gap-1"><FiClock className="w-3 h-3" /> Menunggu Verifikasi</span>
          )}
          {bank?.slug && (
            <Link href={`/bank-sampah/${bank.slug}`} target="_blank"
              className="text-xs text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors font-semibold border border-green-300 dark:border-green-500/30 px-3 py-1.5 sm:py-1 rounded-full hover:bg-green-50 dark:hover:bg-green-500/10 inline-flex items-center gap-1">
              Lihat Profil <FiExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-5 sm:p-6 mb-6 text-white">
          <h1 className="text-xl sm:text-2xl font-black font-serif mb-1">Halo, {bank?.nama || user.email}!</h1>
          <p className="text-green-200 text-sm">Kelola profil bank sampahmu di sini. Perubahan akan langsung terlihat di website GenHi.</p>
          {!bank?.aktif && (
            <div className="mt-3 bg-white/10 rounded-xl px-4 py-2.5 text-xs text-green-200 flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 shrink-0" /> Profil kamu sedang dalam proses verifikasi oleh tim GenHi (1–2 hari kerja)
            </div>
          )}
        </div>

        {/* Stats mini */}
        {localStats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {[
              { label: 'Sampah Bulan Ini', val: `${localStats[0]?.sampah_kg || 0} kg` },
              { label: 'Pendapatan', val: `Rp ${(localStats[0]?.pendapatan || 0).toLocaleString('id')}` },
              { label: 'Nasabah Baru', val: localStats[0]?.nasabah_baru || 0 },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-white/[8%] rounded-2xl p-4 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex sm:block items-center justify-between">
                <div className="text-xs text-gray-400 dark:text-white/40 sm:mt-0.5 sm:order-2">{s.label}</div>
                <div className="text-xl font-black text-green-900 dark:text-white font-serif sm:order-1">{s.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs — icon-tile grid on mobile, no hidden/scrolled items */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 sm:hidden">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all
                ${tab === t.key ? 'bg-green-50 dark:bg-white/[10%] border-green-500 dark:border-green-400/60 shadow-sm dark:shadow-none' : 'bg-white dark:bg-white/[6%] border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none'}`}>
              {tab === t.key && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <FiCheck className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.color}`}>
                <t.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${tab === t.key ? 'text-green-900 dark:text-white' : 'text-gray-500 dark:text-white/60'}`}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs — pill row on larger screens */}
        <div className="hidden sm:flex gap-1.5 bg-white dark:bg-white/[6%] rounded-2xl p-1.5 mb-6 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${tab === t.key ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70'}`}>
              <t.icon className="w-3.5 h-3.5 shrink-0" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Profil */}
        {tab === 'Profil' && (
          <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 flex flex-col gap-5">
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
                  {KECAMATAN.map(k => <option key={k} value={k} className="bg-white dark:bg-green-900">{k}</option>)}
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
                        : 'bg-white dark:bg-white/[8%] text-gray-500 dark:text-white/60 border-gray-300 dark:border-white/15 hover:border-green-500/50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Deskripsi Singkat</label>
              <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)} rows={7}
                placeholder="Ceritakan tentang bank sampah kamu…"
                className={inputCls + ' resize-y'} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[6%] rounded-xl border border-gray-200 dark:border-white/10">
              <label className="text-sm font-bold text-green-900 dark:text-white">Status Operasional</label>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => update('buka', !form.buka)}
                  className={`relative w-11 h-6 rounded-full transition-colors overflow-hidden ${form.buka ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/20'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.buka ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-semibold w-10 ${form.buka ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/40'}`}>{form.buka ? 'Buka' : 'Tutup'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Lokasi */}
        {tab === 'Lokasi' && (
          <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6">
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
          <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 flex flex-col gap-6">
            <div>
              <label className={labelCls}>Foto Utama Bank Sampah</label>
              {fotoUrl && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-3 bg-green-50 dark:bg-white/10 group">
                  <img src={fotoUrl} alt="Foto" className="w-full h-full object-cover" />
                  <button type="button" onClick={handleDeleteMainPhoto}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-white/[4%] transition-all">
                <FiCamera className="w-8 h-8 mb-2 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{fotoUrl ? 'Ganti foto' : 'Klik untuk upload foto'}</span>
                <span className="text-xs text-gray-400 dark:text-white/30 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div>
              <label className={labelCls}>Galeri Foto</label>
              <p className="text-xs text-gray-400 dark:text-white/30 mb-3">Tambahkan beberapa foto suasana bank sampahmu — akan tampil di halaman profil publik.</p>
              <div className="grid grid-cols-3 gap-3">
                {galeri.map(url => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-green-50 dark:bg-white/10 group">
                    <img src={url} alt="Galeri" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleDeleteGalleryPhoto(url)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-white/[4%] transition-all">
                  {galleryUploading ? (
                    <span className="text-xs text-gray-400 dark:text-white/40">Mengupload…</span>
                  ) : (
                    <>
                      <FiPlus className="w-6 h-6 mb-1 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">Tambah</span>
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
          <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 flex flex-col gap-5">
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
            <p className="text-xs text-gray-400 dark:text-white/30">Media sosial akan tampil di kartu bank sampah di katalog GenHi</p>
          </div>
        )}

        {/* Tab: Statistik */}
        {tab === 'Statistik' && (
          <div className="flex flex-col gap-6">
            {/* Entry form */}
            <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6">
              <h3 className="font-bold text-green-900 dark:text-white mb-1">Catat Penimbangan</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 mb-4">Setiap kali ada nasabah setor sampah, catat di sini seperti jurnal transaksi. Ringkasan bulanan otomatis terhitung dari entri-entri ini.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tanggal *</label>
                  <input type="date" value={jurnalForm.tanggal}
                    onChange={e => setJurnalForm(f => ({ ...f, tanggal: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Jenis Sampah</label>
                  <select value={jurnalForm.jenis_sampah}
                    onChange={e => setJurnalForm(f => ({ ...f, jenis_sampah: e.target.value }))}
                    className={inputCls + ' cursor-pointer'}>
                    {SPESIALISASI.map(s => <option key={s} value={s} className="bg-white dark:bg-green-900">{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Nama Nasabah (opsional)</label>
                  <input value={jurnalForm.nama_nasabah}
                    onChange={e => setJurnalForm(f => ({ ...f, nama_nasabah: e.target.value }))}
                    placeholder="Boleh dikosongkan kalau tidak tercatat" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Berat (kg) *</label>
                  <input type="number" min="0" step="0.1" value={jurnalForm.berat_kg}
                    onChange={e => setJurnalForm(f => ({ ...f, berat_kg: e.target.value }))}
                    placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Harga per kg (Rp)</label>
                  <input type="number" min="0" value={jurnalForm.harga_per_kg}
                    onChange={e => setJurnalForm(f => ({ ...f, harga_per_kg: e.target.value }))}
                    placeholder="0" className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Catatan (opsional)</label>
                  <input value={jurnalForm.catatan}
                    onChange={e => setJurnalForm(f => ({ ...f, catatan: e.target.value }))}
                    placeholder="Misal: dibayar tunai, dsb." className={inputCls} />
                </div>
              </div>

              {jurnalError && <p className="text-xs text-red-500 dark:text-red-400 mt-3">{jurnalError}</p>}

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-white/10">
                <div>
                  <div className="text-xs text-gray-400 dark:text-white/40">Total</div>
                  <div className="text-lg font-black text-green-700 dark:text-green-400">
                    Rp {((Number(jurnalForm.berat_kg) || 0) * (Number(jurnalForm.harga_per_kg) || 0)).toLocaleString('id')}
                  </div>
                </div>
                <button type="button" onClick={handleAddJurnal} disabled={jurnalSaving}
                  className="px-6 py-3 rounded-2xl font-bold text-sm bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 inline-flex items-center gap-1.5">
                  <FiPlus className="w-4 h-4" /> {jurnalSaving ? 'Menyimpan…' : 'Tambah Entri'}
                </button>
              </div>
            </div>

            {/* Journal list */}
            <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6">
              <h3 className="font-bold text-green-900 dark:text-white mb-4">Riwayat Penimbangan</h3>
              {jurnalList.length === 0 ? (
                <div className="text-center py-10 text-gray-300 dark:text-white/30">
                  <FiBarChart2 className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-sm">Belum ada entri penimbangan</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {jurnalList.map(j => (
                    <div key={j.id} className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-white/[6%] rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-gray-500 dark:text-white/50">
                            {new Date(j.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {j.jenis_sampah && (
                            <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/15 px-2 py-0.5 rounded-full">{j.jenis_sampah}</span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-green-900 dark:text-white truncate">{j.nama_nasabah || 'Tanpa nama'}</div>
                        <div className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                          {j.berat_kg} kg &times; Rp {Number(j.harga_per_kg).toLocaleString('id')}/kg
                        </div>
                        {j.catatan && <div className="text-xs text-gray-400 dark:text-white/30 mt-1 italic truncate">{j.catatan}</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-green-600 dark:text-green-400 text-sm">Rp {Number(j.total).toLocaleString('id')}</div>
                        <button type="button" onClick={() => handleDeleteJurnal(j)}
                          className="mt-1.5 text-gray-300 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Monthly summary (auto-computed from the journal above) */}
            {localStats.length > 0 && (
              <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6">
                <h3 className="font-bold text-green-900 dark:text-white mb-1">Ringkasan Bulanan</h3>
                <p className="text-xs text-gray-400 dark:text-white/40 mb-4">Dihitung otomatis dari riwayat penimbangan — ini yang tampil di halaman publik GenHi.</p>
                <div className="flex flex-col gap-2">
                  {localStats.map((s, i) => (
                    <div key={i} className="flex gap-4 p-3.5 bg-gray-50 dark:bg-white/[6%] rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 dark:text-white/40 mb-1">{new Date(s.periode).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</div>
                        <div className="font-bold text-green-900 dark:text-white">{s.sampah_kg} kg sampah</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 dark:text-white/40 mb-1">Pendapatan</div>
                        <div className="font-bold text-green-600 dark:text-green-400">Rp {s.pendapatan?.toLocaleString('id')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Akun */}
        {tab === 'Akun' && (
          <div className="bg-white dark:bg-white/[7%] backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 flex flex-col gap-5 max-w-md">
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
            {pwError && <p className="text-xs text-red-500 dark:text-red-400">{pwError}</p>}
            <button type="button" onClick={handleChangePassword} disabled={pwSaving || !pwForm.password}
              className={`self-start px-6 py-3 rounded-2xl font-bold text-sm transition-all
                ${pwSaved ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
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
                ${saved ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25'}
                disabled:opacity-50`}>
              {saving ? 'Menyimpan…' : saved ? <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4" /> Tersimpan!</span> : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
