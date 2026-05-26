'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-black text-lg font-serif">G</div>
            <span className="text-white font-black text-xl font-serif">GenHi</span>
          </Link>
          <h1 className="text-3xl font-black text-white font-serif mb-2">Masuk ke Akun</h1>
          <p className="text-green-400/70 text-sm">Kelola profil bank sampahmu</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-green-400 text-xs font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="email@banksampaхmu.com"
              className="w-full bg-white/[8%] border border-white/[12%] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder:text-white/25" />
          </div>
          <div>
            <label className="block text-green-400 text-xs font-bold mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full bg-white/[8%] border border-white/[12%] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder:text-white/25" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Memproses…' : 'Masuk →'}
          </button>
          <p className="text-center text-green-500/50 text-xs">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-green-400 hover:underline font-semibold">Daftar di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
