import Link from 'next/link';
import type { Artikel } from '@/lib/types';
import { FiFileText, FiAward, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { BiRecycle } from 'react-icons/bi';

const CARD_ICONS = [FiFileText, FiAward, BiRecycle];

export default function ArticlesSection({ artikels }: { artikels: Artikel[] }) {
  const fallback = [
    { id:'1', judul:'Cara Memilah Sampah yang Benar di Rumah', excerpt:'Pemilahan sampah di sumber adalah langkah pertama yang paling penting dalam sistem pengelolaan sampah modern.', tag:'Tips & Trik', read_time:4, published_at:'2026-04-18', thumbnail_url:null },
    { id:'2', judul:'Dari Sampah Jadi Rupiah: Cerita Bank Sampah Mandiri', excerpt:'Bagaimana sebuah komunitas kecil berhasil mengumpulkan jutaan rupiah dari sampah daur ulang.', tag:'Kisah Sukses', read_time:6, published_at:'2026-04-12', thumbnail_url:null },
    { id:'3', judul:'Kenali Jenis Sampah yang Bernilai Tinggi di Pasaran', excerpt:'Tidak semua sampah sama nilainya. Beberapa jenis material memiliki harga yang cukup tinggi di pengepul.', tag:'Edukasi', read_time:5, published_at:'2026-04-05', thumbnail_url:null },
  ];
  const items = artikels.length > 0 ? artikels : fallback;

  return (
    <section id="artikel" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">ARTIKEL</span>
            <h2 className="text-4xl font-black text-green-900 font-serif mt-4">Edukasi & Inspirasi</h2>
          </div>
          <Link href="/artikel" className="border-2 border-green-600 text-green-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors inline-flex items-center gap-1.5">
            Lihat Semua <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((a: any, i: number) => {
            const CardIcon = CARD_ICONS[i % CARD_ICONS.length];
            return (
              <div key={a.id} className="bg-white border border-green-50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-900/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`h-48 flex items-center justify-center
                  ${i===0?'bg-gradient-to-br from-green-700 to-green-500':i===1?'bg-gradient-to-br from-green-800 to-green-600':'bg-gradient-to-br from-green-600 to-green-400'}`}>
                  <CardIcon className="w-12 h-12 text-white" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{a.tag}</span>
                    <span className="text-gray-400 text-xs flex items-center gap-1"><FiBookOpen className="w-3.5 h-3.5" /> {a.read_time} menit</span>
                  </div>
                  <h3 className="font-bold text-base text-green-900 leading-snug mb-2">{a.judul}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{a.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{new Date(a.published_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">Baca <FiArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
