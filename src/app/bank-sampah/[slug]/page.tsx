import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SPEC_ICONS: Record<string, string> = {
  Plastik: '🧴', Kertas: '📄', Kardus: '📦', Logam: '🔩',
  'Botol Kaca': '🍶', Elektronik: '📱', Baterai: '🔋',
  'Minyak Jelantah': '🛢️', Tekstil: '👕', Organik: '🌿',
};

export default async function BankSampahProfilePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: bank } = await supabase
    .from('bank_sampah')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!bank) notFound();

  const { data: stats } = await supabase
    .from('statistik')
    .select('*')
    .eq('bank_sampah_id', bank.id)
    .order('periode', { ascending: false })
    .limit(6);

  const waUrl = `https://wa.me/62${bank.wa?.replace(/^0/, '')}`;
  const totalKg = stats?.reduce((s, r) => s + Number(r.sampah_kg || 0), 0) ?? 0;
  const totalPendapatan = stats?.reduce((s, r) => s + Number(r.pendapatan || 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-black font-serif text-sm">G</div>
          <span className="font-black text-green-800 font-serif text-base">GenHi</span>
        </Link>
        <Link href="/#katalog" className="text-sm text-green-700 font-semibold hover:text-green-500 transition-colors">
          ← Kembali ke Katalog
        </Link>
      </header>

      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-green-700 to-green-500 overflow-hidden">
        {bank.foto_url ? (
          <Image src={bank.foto_url} alt={bank.nama} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-9xl">♻️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {bank.verified && (
                <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ Terverifikasi</span>
              )}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bank.buka ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}>
                {bank.buka ? '🟢 Buka' : '🔴 Tutup'}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white font-serif leading-tight">{bank.nama}</h1>
            <p className="text-green-200 text-sm mt-1 flex items-center gap-1">
              <span>📍</span> {bank.alamat}, {bank.kecamatan}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Contact Strip */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap gap-3 items-center">
          {bank.wa && (
            <a href={waUrl} target="_blank"
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors">
              💬 Hubungi WhatsApp
            </a>
          )}
          {bank.email && (
            <a href={`mailto:${bank.email}`}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              ✉️ {bank.email}
            </a>
          )}
          {bank.website && (
            <a href={bank.website} target="_blank"
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              🌐 Website
            </a>
          )}
          {bank.jam && (
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
              <span>🕐</span><span className="font-medium">{bank.jam}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* About */}
            {bank.deskripsi && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-black text-green-800 font-serif text-lg mb-3">Tentang Kami</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{bank.deskripsi}</p>
              </div>
            )}

            {/* Specializations */}
            {bank.spesialisasi.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-black text-green-800 font-serif text-lg mb-4">Sampah yang Diterima</h2>
                <div className="flex flex-wrap gap-2">
                  {bank.spesialisasi.map((s: string) => (
                    <span key={s}
                      className="flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-100 text-sm px-4 py-2 rounded-full font-semibold">
                      {SPEC_ICONS[s] || '♻️'} {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            {stats && stats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-black text-green-800 font-serif text-lg mb-1">Statistik Sampah</h2>
                <p className="text-xs text-gray-400 mb-4">Data 6 bulan terakhir</p>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-black text-green-700">{totalKg.toLocaleString('id')} kg</div>
                    <div className="text-xs text-gray-500 mt-0.5">Total sampah terkumpul</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-black text-green-700">Rp {totalPendapatan.toLocaleString('id')}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Total pendapatan</div>
                  </div>
                </div>

                {/* Monthly breakdown */}
                <div className="flex flex-col gap-2">
                  {stats.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">
                        {new Date(s.periode).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex gap-4 text-sm font-semibold text-right">
                        <span className="text-gray-700">{Number(s.sampah_kg).toLocaleString('id')} kg</span>
                        <span className="text-green-600 w-32">Rp {Number(s.pendapatan).toLocaleString('id')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {bank.galeri && bank.galeri.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-black text-green-800 font-serif text-lg mb-4">Galeri Foto</h2>
                <div className="grid grid-cols-3 gap-2">
                  {bank.galeri.map((url: string, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Image src={url} alt={`Galeri ${i + 1}`} width={200} height={200} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
              <h3 className="font-black text-green-800 font-serif">Informasi</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-5">📍</span>
                  <div>
                    <div className="font-semibold text-gray-700">{bank.kecamatan}</div>
                    <div className="text-gray-500 text-xs">{bank.alamat}</div>
                  </div>
                </div>
                {bank.jam && (
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-5">🕐</span>
                    <span className="text-gray-600">{bank.jam}</span>
                  </div>
                )}
                {bank.wa && (
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-5">📱</span>
                    <span className="text-gray-600">{bank.wa}</span>
                  </div>
                )}
                {bank.email && (
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-5">✉️</span>
                    <span className="text-gray-600 break-all">{bank.email}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 pt-3 border-t border-gray-50">
                <span className="text-amber-400">{'★'.repeat(Math.floor(bank.rating))}</span>
                <span className="font-bold text-gray-800 text-sm">{Number(bank.rating).toFixed(1)}</span>
                <span className="text-gray-400 text-xs">({bank.reviews} ulasan)</span>
              </div>
            </div>

            {/* Social Media */}
            {(bank.instagram || bank.facebook || bank.youtube) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
                <h3 className="font-black text-green-800 font-serif">Media Sosial</h3>
                <div className="flex flex-col gap-2">
                  {bank.instagram && (
                    <a href={`https://instagram.com/${bank.instagram.replace('@', '')}`} target="_blank"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 hover:border-pink-200 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-base shrink-0">
                        📸
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors truncate">
                          {bank.instagram.startsWith('@') ? bank.instagram : `@${bank.instagram}`}
                        </div>
                        <div className="text-xs text-gray-400">Lihat feed di bawah ↓</div>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {bank.facebook && (
                    <a href={bank.facebook} target="_blank"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-200 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base shrink-0">📘</div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors truncate">Facebook</div>
                        <div className="text-xs text-gray-400">Halaman resmi</div>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {bank.youtube && (
                    <a href={bank.youtube} target="_blank"
                      className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 hover:border-red-200 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white text-base shrink-0">▶️</div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm group-hover:text-red-600 transition-colors truncate">YouTube</div>
                        <div className="text-xs text-gray-400">Channel video</div>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Instagram Feed */}
        {bank.instagram && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">News</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Recent Instagram Post</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <iframe
                src={`https://www.instagram.com/${bank.instagram.replace('@', '')}/embed`}
                className="w-full border-0"
                style={{ height: '720px', overflow: 'hidden' }}
                allowTransparency
                allow="encrypted-media"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-8 py-6 text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-green-600 transition-colors font-semibold">GenHi</Link>
        {' '}— Platform Bank Sampah Yogyakarta
      </footer>
    </div>
  );
}
