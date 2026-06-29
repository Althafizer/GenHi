'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterNasabahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) { setError('Nama lengkap wajib diisi.'); return; }
    if (!form.email.trim()) { setError('Email wajib diisi.'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (form.password !== form.confirmPassword) { setError('Password tidak cocok.'); return; }

    setLoading(true);
    setError('');
    const supabase = createClient();

    // Sign up — pass role in metadata so handle_new_user trigger sets it correctly
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: 'nasabah',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    // Explicitly set role to 'nasabah' — don't rely solely on trigger
    await supabase.from('profiles').update({ role: 'nasabah' }).eq('id', userId);

    // Create nasabah_profiles record
    const { error: profileError } = await supabase
      .from('nasabah_profiles')
      .insert({
        id: userId,
        full_name: form.full_name,
        phone_number: form.phone_number || null,
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // Create saldo record with 0 balance
    await supabase.from('saldo').insert({ user_id: userId, balance: 0 });

    window.location.href = '/auth/me';
  };

  const inputCls = "w-full bg-white/[8%] border border-white/[12%] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-white/30";
  const labelCls = "block text-green-400 text-xs font-bold mb-1.5";

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-black text-xl font-serif mx-auto mb-3">G</div>
          <h1 className="text-2xl font-black text-white font-serif">Daftar sebagai Nasabah</h1>
          <p className="text-green-400/70 text-sm mt-1">Setor sampah, kumpulkan saldo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Nama Lengkap *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              placeholder="Nama sesuai KTP"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Nomor WhatsApp / Telepon</label>
            <input
              type="tel"
              value={form.phone_number}
              onChange={e => update('phone_number', e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="email@kamu.com"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Minimal 6 karakter"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Konfirmasi Password *</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              placeholder="Ulangi password"
              className={inputCls}
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/25 mt-1">
            {loading ? 'Mendaftar…' : 'Daftar Sekarang'}
          </button>

          <p className="text-center text-white/30 text-xs">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
              Masuk di sini
            </Link>
          </p>
        </form>

        <p className="text-center text-white/20 text-xs mt-4">
          Daftar sebagai Bank Sampah?{' '}
          <Link href="/auth/register" className="text-white/40 hover:text-white/60 transition-colors">
            Klik di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
