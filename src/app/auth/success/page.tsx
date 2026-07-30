import Link from 'next/link';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <FiCheckCircle className="w-16 h-16 mb-6 mx-auto text-green-400" />
        <h1 className="text-4xl font-black text-white font-serif mb-4">Pendaftaran Berhasil!</h1>
        <p className="text-green-400/70 text-base leading-relaxed mb-8">
          Terima kasih telah mendaftar. Kamu sudah bisa login menggunakan akun yang baru saja dibuat.
          Setelah profil diverifikasi oleh tim GenHi, bank sampahmu akan tampil di katalog.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-base hover:bg-green-400 transition-colors">
          Kembali ke Beranda <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
