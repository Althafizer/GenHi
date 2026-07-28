import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Artikel } from '@/lib/types';
import { FiFileText, FiAward, FiBookOpen } from 'react-icons/fi';
import { BiRecycle } from 'react-icons/bi';

export const revalidate = 60;

const CARD_ICONS = [FiFileText, FiAward, BiRecycle];

export default async function ArtikelListPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('artikel')
    .select('*, bank_sampah(nama,slug)')
    .eq('published', true)
    .order('published_at', { ascending: false });

  const artikels: Artikel[] = data || [];

  return (
    <main>
      <Navbar />
      <section className="bg-white py-16 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">ARTIKEL</span>
          <h1 className="text-4xl font-black text-green-900 font-serif mt-4 mb-10">Edukasi & Inspirasi</h1>

          {artikels.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FiFileText className="w-10 h-10 mx-auto mb-3" />
              <p className="text-sm">Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artikels.map((a, i) => {
                const CardIcon = CARD_ICONS[i % CARD_ICONS.length];
                return (
                  <Link key={a.id} href={`/artikel/${a.slug}`}
                    className="bg-white border border-green-50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-900/8 hover:-translate-y-1 transition-all duration-300">
                    <div className={`h-48 flex items-center justify-center overflow-hidden
                      ${i % 3 === 0 ? 'bg-gradient-to-br from-green-700 to-green-500' : i % 3 === 1 ? 'bg-gradient-to-br from-green-800 to-green-600' : 'bg-gradient-to-br from-green-600 to-green-400'}`}>
                      {a.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.thumbnail_url} alt={a.judul} className="w-full h-full object-cover" />
                      ) : (
                        <CardIcon className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between mb-3">
                        {a.tag && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{a.tag}</span>}
                        <span className="text-gray-400 text-xs flex items-center gap-1"><FiBookOpen className="w-3.5 h-3.5" /> {a.read_time} menit</span>
                      </div>
                      <h2 className="font-bold text-base text-green-900 leading-snug mb-2">{a.judul}</h2>
                      {a.excerpt && <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">{a.excerpt}</p>}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">
                          {a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                        <span className="text-green-600 text-xs font-bold">Baca</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
