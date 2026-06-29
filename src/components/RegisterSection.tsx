import Link from 'next/link';

export default function RegisterSection() {
  return (
    <section id="daftar" className="py-20 bg-gradient-to-br from-green-950 to-green-700">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="bg-white/10 text-green-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">BERGABUNG</span>
        <h2 className="text-4xl font-black text-white font-serif mt-5 mb-4">Mulai Perjalananmu di GenHi</h2>
        <p className="text-green-300 text-base mb-10">Dua cara untuk bergabung — pilih yang sesuai denganmu.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Nasabah Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-left flex flex-col gap-4 hover:bg-white/15 transition-colors">
            <div className="text-4xl">♻️</div>
            <div>
              <div className="text-white font-black text-lg font-serif">Saya ingin setor sampah</div>
              <div className="text-green-300/80 text-sm mt-1.5 leading-relaxed">
                Daftar sebagai <strong className="text-green-300">Nasabah</strong>. Setor sampah di mesin deposit GenHi, kumpulkan saldo, dan cairkan kapan saja.
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {['Daftar gratis dalam 1 menit', 'Hasilkan QR Code untuk mesin deposit', 'Pantau saldo & riwayat setoran'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-green-200/70">
                  <span className="text-green-400">✓</span> {t}
                </div>
              ))}
            </div>
            <Link href="/auth/register/nasabah"
              className="mt-auto w-full text-center bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-500/20 text-sm">
              Daftar sebagai Nasabah →
            </Link>
          </div>

          {/* Bank Sampah Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-left flex flex-col gap-4 hover:bg-white/15 transition-colors">
            <div className="text-4xl">🏦</div>
            <div>
              <div className="text-white font-black text-lg font-serif">Saya pengelola Bank Sampah</div>
              <div className="text-green-300/80 text-sm mt-1.5 leading-relaxed">
                Daftarkan <strong className="text-green-300">Bank Sampah</strong> ke direktori GenHi. Kelola profil, jam operasional, dan statistik bulanan secara mandiri.
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {['Tampil di katalog & peta GenHi', 'Kelola profil & foto bank sampah', 'Pantau statistik bulananmu'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-green-200/70">
                  <span className="text-green-400">✓</span> {t}
                </div>
              ))}
            </div>
            <Link href="/auth/register"
              className="mt-auto w-full text-center bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-colors border border-white/20 text-sm">
              Daftar sebagai Bank Sampah →
            </Link>
          </div>
        </div>

        <p className="text-green-400/50 text-xs">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-green-400 hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </section>
  );
}
