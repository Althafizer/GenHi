import Link from 'next/link';
import { FiMail, FiSmartphone, FiMapPin, FiClock } from 'react-icons/fi';
import { IoLeafOutline } from 'react-icons/io5';

export default function Footer() {
  const nav = [
    { label: 'Tentang GenHi', href: '/#tentang' },
    { label: 'Katalog Bank Sampah', href: '/#katalog' },
    { label: 'Peta Interaktif', href: '/#peta' },
    { label: 'Artikel', href: '/artikel' },
    { label: 'Daftar Bank Sampah', href: '/auth/register' },
  ];
  const kontak = [
    { icon: FiMail, text:'info@genhi.id' },
    { icon: FiSmartphone, text:'+62 812-3456-7890' },
    { icon: FiMapPin, text:'Jl. Malioboro No. 1, Yogyakarta 55213' },
    { icon: FiClock, text:'Senin–Jumat, 09:00–17:00 WIB' },
  ];
  return (
    <footer id="kontak" className="bg-green-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-lg font-serif">G</div>
              <span className="text-white font-black font-serif text-xl">GenHi</span>
            </div>
            <p className="text-green-700 text-sm leading-relaxed max-w-[240px]">Asosiasi bank sampah digital di Kota Yogyakarta.</p>
          </div>
          <div>
            <h4 className="text-green-400 text-xs font-bold tracking-widest mb-4">NAVIGASI</h4>
            <div className="flex flex-col gap-2.5">
              {nav.map(item => (
                <Link key={item.label} href={item.href} className="text-green-700 text-sm hover:text-green-400 transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-green-400 text-xs font-bold tracking-widest mb-4">KONTAK</h4>
            <div className="flex flex-col gap-3">
              {kontak.map((c,i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <c.icon className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  <span className="text-green-700 text-sm leading-snug">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-green-400 text-xs font-bold tracking-widest mb-4">NEWSLETTER</h4>
            <p className="text-green-700 text-sm mb-4 leading-relaxed">Dapatkan update terbaru tentang bank sampah & program GenHi.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email kamu…" className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none placeholder:text-green-700 min-w-0" />
              <button className="bg-green-500 text-white rounded-xl px-3 py-2.5 text-xs font-bold whitespace-nowrap hover:bg-green-400 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex justify-between flex-wrap gap-3">
          <p className="text-green-800 text-xs">© 2026 GenHi — Gerakan Hijau Indonesia. All rights reserved.</p>
          <p className="text-green-800 text-xs flex items-center gap-1">Made with <IoLeafOutline className="w-3.5 h-3.5" /> for Yogyakarta</p>
        </div>
      </div>
    </footer>
  );
}
