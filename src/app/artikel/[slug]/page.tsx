import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiArrowLeft, FiBookOpen, FiUser, FiCalendar } from 'react-icons/fi';
import { BiRecycle } from 'react-icons/bi';

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: artikel } = await supabase
    .from('artikel')
    .select('*, bank_sampah(nama,slug)')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!artikel) notFound();

  return (
    <main>
      <Navbar />
      <article className="bg-white min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/artikel" className="text-sm text-green-700 font-semibold hover:text-green-500 transition-colors inline-flex items-center gap-1 mb-6">
            <FiArrowLeft className="w-4 h-4" /> Kembali ke Artikel
          </Link>

          {artikel.tag && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">{artikel.tag}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-green-900 font-serif mt-4 mb-4 leading-tight">{artikel.judul}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-8">
            <span className="flex items-center gap-1.5"><FiUser className="w-3.5 h-3.5" /> {artikel.penulis}</span>
            {artikel.published_at && (
              <span className="flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5" />
                {new Date(artikel.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1.5"><FiBookOpen className="w-3.5 h-3.5" /> {artikel.read_time} menit baca</span>
          </div>

          {artikel.thumbnail_url ? (
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-green-50 relative">
              <Image src={artikel.thumbnail_url} alt={artikel.judul} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center">
              <BiRecycle className="w-16 h-16 text-white/70" />
            </div>
          )}

          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {artikel.konten}
          </div>

          {artikel.bank_sampah && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Artikel dari</p>
              <Link href={`/bank-sampah/${artikel.bank_sampah.slug}`}
                className="text-green-700 font-bold hover:text-green-500 transition-colors">
                {artikel.bank_sampah.nama}
              </Link>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
}
