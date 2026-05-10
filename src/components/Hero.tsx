'use client';
import { useState, useEffect } from 'react';
import type { GlobalStats } from '@/lib/types';

export default function Hero({ stats }: { stats: GlobalStats }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen bg-green-950 flex items-center overflow-hidden">
      {/* Blobs */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-green-600 blur-[80px] opacity-25 -top-24 -left-36 animate-float" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-green-500 blur-[80px] opacity-20 top-[60%] -right-20 animate-float2" />
      {/* Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(63,201,109,0.07)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-7
            ${loaded ? 'animate-fade-up' : 'opacity-0'}`}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="text-green-500 text-xs font-bold tracking-widest">PLATFORM BANK SAMPAH DIGITAL YOGYAKARTA</span>
          </div>

          {/* Headline */}
          <h1 className={`text-5xl md:text-7xl font-black text-white font-serif leading-[1.05] mb-6
            ${loaded ? 'animate-fade-up [animation-delay:150ms]' : 'opacity-0'}`}
            style={{ animationFillMode: 'forwards' }}>
            Temukan Bank Sampah Terbaik di{' '}
            <span className="text-green-500">Yogyakarta</span>
          </h1>

          {/* Tagline */}
          <p className={`text-lg text-white/60 leading-relaxed mb-10 max-w-xl
            ${loaded ? 'animate-fade-up [animation-delay:300ms]' : 'opacity-0'}`}
            style={{ animationFillMode: 'forwards' }}>
            Digital Collaboration · Social Empowerment · Sustainable Economy
            <br />
            <span className="text-sm text-white/40">Bergabunglah dan ubah sampah menjadi nilai ekonomi nyata</span>
          </p>

          {/* Search */}
          <div className={`flex gap-3 flex-wrap ${loaded ? 'animate-fade-up [animation-delay:450ms]' : 'opacity-0'}`}
            style={{ animationFillMode: 'forwards' }}>
            <div className="flex-1 min-w-[280px] flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-4">
              <span className="text-xl">🔍</span>
              <input placeholder="Cari bank sampah atau kecamatan…"
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/35"
                onKeyDown={e => { if(e.key==='Enter') document.getElementById('katalog')?.scrollIntoView({behavior:'smooth'}); }}
              />
            </div>
            <a href="#katalog"
              className="bg-green-500 text-white px-7 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-500/30 hover:bg-green-400 transition-colors whitespace-nowrap">
              Temukan Sekarang
            </a>
          </div>

          {/* Stats pills */}
          <div className={`flex gap-6 mt-9 flex-wrap ${loaded ? 'animate-fade-up [animation-delay:600ms]' : 'opacity-0'}`}
            style={{ animationFillMode: 'forwards' }}>
            {[
              ['🏦', `${stats.total_bank_aktif || 47} Bank Sampah`],
              ['🗺️', `${stats.total_kecamatan || 14} Kecamatan`],
              ['⭐', 'Rating Terverifikasi'],
            ].map(([icon, text]) => (
              <div key={String(text)} className="flex items-center gap-2 text-white/65 text-sm font-medium">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <svg className="absolute bottom-[-1px] left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0fdf4"/>
      </svg>
    </section>
  );
}
