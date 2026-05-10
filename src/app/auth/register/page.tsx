'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const KECAMATAN = [
  'Gedongtengen','Jetis','Gondokusuman','Danurejan','Pakualaman',
  'Gondomanan','Ngampilan','Wirobrajan','Mantrijeron','Kraton',
  'Mergangsan','Umbulharjo','Kotagede','Tegalrejo','Depok',
];
const SPESIALISASI = [
  'Plastik','Kertas','Kardus','Logam','Botol Kaca',
  'Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik',
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nama: '', alamat: '', kecamatan: '', wa: '',
    spesialisasi: [] as string[], jam: '', deskripsi: '',
  });

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpec = (s: string) => setForm(f => ({
    ...f,
    spesialisasi: f.spesialisasi.includes(s)
      ? f.spesialisasi.filter(x => x !== s)
      : [...f.spesialisasi, s]
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Password tidak cocok'); return; }
    if (form.spesialisasi.length === 0) { setError('Pilih minimal 1 spesialisasi'); return; }
    setLoading(true); setError('');

    // 1. Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.nama } }
    });
    if (authError) { setError(authError.message); setLoading(false); return; }

    // 1b. Ensure we have a session (email-confirmation flow returns no session)
    if (!authData.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email, password: form.password,
      });
      if (signInError) {
        setError('Akun dibuat, silakan cek email untuk konfirmasi lalu login dan lengkapi profil bank sampah.');
        setLoading(false);
        return;
      }
    }

    // 2. Create bank_sampah record
    const slug = form.nama.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const { error: dbError } = await supabase.from('bank_sampah').insert({
      user_id: authData.user?.id,
      nama: form.nama,
      slug,
      alamat: form.alamat,
      kecamatan: form.kecamatan,
      wa: form.wa,
      spesialisasi: form.spesialisasi,
      jam: form.jam,
      deskripsi: form.deskripsi,
      aktif: false, // Menunggu verifikasi admin
    });

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    router.push('/auth/success');
  };

  const inputCls = "w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder:text-white/25";

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-black text-lg font-serif">G</div>
            <span className="text-white font-black text-xl font-serif">GenHi</span>
          </Link>
          <h1 className="text-3xl font-black text-white font-serif mb-2">Daftar Bank Sampah</h1>
          <p className="text-green-400/70 text-sm">Bergabung dengan jaringan GenHi — gratis!</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-3 mb-8">
          {[1,2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step >= s ? 'bg-green-500 text-white' : 'bg-white/15 text-white/40'}`}>{s}</div>
              <span className={`text-xs font-semibold ${step >= s ? 'text-green-400' : 'text-white/30'}`}>
                {s === 1 ? 'Akun' : 'Profil Bank'}
              </span>
              {s < 2 && <div className={`w-8 h-0.5 ${step > 1 ? 'bg-green-500' : 'bg-white/15'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col gap-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

          {step === 1 ? (
            <>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Email *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="email@banksampaumu.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required placeholder="Min. 8 karakter" minLength={8} className={inputCls} />
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Konfirmasi Password *</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required placeholder="Ulangi password" className={inputCls} />
              </div>
              <button type="button" onClick={() => {
                if (!form.email || !form.password) { setError('Email dan password wajib diisi'); return; }
                if (form.password !== form.confirmPassword) { setError('Password tidak cocok'); return; }
                setError(''); setStep(2);
              }} className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-400 transition-colors">
                Lanjut →
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Nama Bank Sampah *</label>
                <input type="text" value={form.nama} onChange={e => update('nama', e.target.value)} required placeholder="Contoh: Bank Sampah Mandiri Sejahtera" className={inputCls} />
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Alamat Lengkap *</label>
                <input type="text" value={form.alamat} onChange={e => update('alamat', e.target.value)} required placeholder="Jl. Contoh No. 1, Kelurahan" className={inputCls} />
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Kecamatan *</label>
                <select value={form.kecamatan} onChange={e => update('kecamatan', e.target.value)} required
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500">
                  <option value="" className="bg-green-950">Pilih kecamatan…</option>
                  {KECAMATAN.map(k => <option key={k} value={k} className="bg-green-950">{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-3">Spesialisasi Sampah *</label>
                <div className="flex flex-wrap gap-2">
                  {SPESIALISASI.map(s => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                        ${form.spesialisasi.includes(s)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white/8 text-white/60 border-white/15 hover:border-green-500/50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Nomor WhatsApp *</label>
                <input type="tel" value={form.wa} onChange={e => update('wa', e.target.value)} required placeholder="08xxxxxxxxxx" className={inputCls} />
              </div>
              <div>
                <label className="block text-green-400 text-xs font-bold mb-2">Jam Operasional</label>
                <input type="text" value={form.jam} onChange={e => update('jam', e.target.value)} placeholder="Senin–Jumat 08:00–16:00" className={inputCls} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-white/15 transition-colors border border-white/10">
                  ← Kembali
                </button>
                <button type="submit" disabled={loading}
                  className="flex-[2] bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-400 transition-colors disabled:opacity-50">
                  {loading ? 'Mendaftar…' : '🌿 Daftar Sekarang'}
                </button>
              </div>
            </>
          )}
          <p className="text-center text-green-500/50 text-xs">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-green-400 hover:underline font-semibold">Masuk di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
