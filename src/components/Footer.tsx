import Link from 'next/link';

export default function Footer() {
  const nav = ['Tentang GenHi','Katalog Bank Sampah','Peta Interaktif','Artikel','Daftar Bank Sampah'];
  const kontak = [
    { icon:'📧', text:'info@genhi.id' },
    { icon:'📱', text:'+62 812-3456-7890' },
    { icon:'📍', text:'Jl. Malioboro No. 1, Yogyakarta 55213' },
    { icon:'🕐', text:'Senin–Jumat, 09:00–17:00 WIB' },
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
            <div className="flex gap-3 mt-4">
              {['📘','📸','🐦','▶️'].map((icon,i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/6 rounded-lg flex items-center justify-center text-base hover:bg-white/12 transition-colors">{icon}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-green-400 text-xs font-bold tracking-widest mb-4">NAVIGASI</h4>
            <div className="flex flex-col gap-2.5">
              {nav.map(item => (
                <a key={item} href="#" className="text-green-700 text-sm hover:text-green-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-green-400 text-xs font-bold tracking-widest mb-4">KONTAK</h4>
            <div className="flex flex-col gap-3">
              {kontak.map((c,i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-base mt-0.5">{c.icon}</span>
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
          <p className="text-green-800 text-xs">Made with 🌿 for Yogyakarta</p>
        </div>
      </div>
    </footer>
  );
}
