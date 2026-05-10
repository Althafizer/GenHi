import Link from 'next/link';

export default function RegisterSection() {
  return (
    <section id="daftar" className="py-20 bg-gradient-to-br from-green-950 to-green-700">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="bg-white/10 text-green-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">BERGABUNG</span>
        <h2 className="text-4xl font-black text-white font-serif mt-5 mb-4">Daftarkan Bank Sampahmu</h2>
        <p className="text-green-300 text-base mb-10">Jadilah bagian dari ekosistem bank sampah digital GenHi. Gratis selamanya.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon:'📝', title:'Daftar Akun', desc:'Buat akun dengan email & password' },
            { icon:'✏️', title:'Lengkapi Profil', desc:'Isi data, foto, dan spesialisasi bank sampah' },
            { icon:'✅', title:'Tampil di Katalog', desc:'Profil langsung muncul setelah diverifikasi' },
          ].map((s,i) => (
            <div key={i} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-bold text-white text-sm mb-1.5">{s.title}</div>
              <div className="text-green-300/70 text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <Link href="/auth/register"
          className="inline-block bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-green-400 transition-colors shadow-2xl shadow-green-500/30">
          🌿 Daftar Sekarang — Gratis
        </Link>
        <p className="text-green-400/50 text-xs mt-4">Sudah punya akun? <Link href="/auth/login" className="text-green-400 hover:underline">Masuk di sini</Link></p>
      </div>
    </section>
  );
}
