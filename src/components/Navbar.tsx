'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#peta', label: 'Peta' },
  { href: '#artikel', label: 'Artikel' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const light = menuOpen || !scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 h-16 flex items-center justify-between transition-all duration-300
        ${menuOpen ? 'bg-green-950' : scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-lg font-serif">G</div>
          <div>
            <div className={`font-black text-[17px] font-serif leading-tight ${light ? 'text-white' : 'text-green-900'}`}>GenHi</div>
            <div className={`text-[9px] font-semibold tracking-widest ${light ? 'text-white/50' : 'text-green-500'}`}>BANK SAMPAH YOGYAKARTA</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className={`text-sm font-semibold transition-colors ${scrolled ? 'text-green-700 hover:text-green-500' : 'text-white/85 hover:text-green-400'}`}>
              {l.label}
            </a>
          ))}
          <a href="#daftar"
            className="bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30">
            Mulai Gratis →
          </a>
          <Link href="/auth/login"
            className={`text-sm font-semibold transition-colors ${scrolled ? 'text-green-700' : 'text-white/70'}`}>
            Masuk
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2 z-10">
          <span className={`block w-6 h-0.5 bg-white rounded transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 bg-green-950 flex flex-col items-center justify-center gap-8 transition-transform duration-500
        ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
            className="text-white text-3xl font-black font-serif">
            {l.label}
          </a>
        ))}
        <a href="#daftar" onClick={() => setMenuOpen(false)}
          className="bg-green-500 text-white px-9 py-4 rounded-2xl text-xl font-black mt-2">
          Mulai Gratis →
        </a>
        <Link href="/auth/login" onClick={() => setMenuOpen(false)}
          className="text-white/60 text-base font-semibold">
          Sudah punya akun? Masuk
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/97 backdrop-blur-xl border-t border-green-100 flex justify-around items-center py-2 pb-safe shadow-lg">
        {[
          { href: '#', icon: '🏠', label: 'Home' },
          { href: '#katalog', icon: '📋', label: 'Katalog' },
          { href: '#peta', icon: '🗺️', label: 'Peta' },
          { href: '#artikel', icon: '📰', label: 'Artikel' },
          { href: '#daftar', icon: '➕', label: 'Daftar' },
        ].map(item => (
          <a key={item.href} href={item.href}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:bg-green-50">
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold text-gray-400">{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
