import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl font-black text-white font-serif mb-4">Pendaftaran Berhasil!</h1>
        <p className="text-green-400/70 text-base leading-relaxed mb-8">
          Terima kasih telah mendaftar. Cek email kamu untuk konfirmasi akun.
          Setelah diverifikasi oleh tim GenHi, profil bank sampahmu akan tampil di katalog.
        </p>
        <Link href="/" className="inline-block bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-base hover:bg-green-400 transition-colors">
          Kembali ke Beranda →
        </Link>
      </div>
    </div>
  );
}
