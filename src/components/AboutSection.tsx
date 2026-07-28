import { FiMonitor, FiUsers, FiDollarSign, FiAward } from 'react-icons/fi';
import { BiRecycle } from 'react-icons/bi';

export default function AboutSection() {
  const pillars = [
    { icon: FiMonitor, title: 'Digital Platform', desc: 'Sistem digital yang menghubungkan nasabah dengan bank sampah terdekat secara real-time.' },
    { icon: FiUsers, title: 'Social Empowerment', desc: 'Memberdayakan komunitas lokal melalui jaringan bank sampah yang solid dan transparan.' },
    { icon: FiDollarSign, title: 'Sustainable Economy', desc: 'Sampah menjadi sumber penghasilan nyata bagi masyarakat dan pengelola bank sampah.' },
  ];
  return (
    <section id="tentang" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-green-950 to-green-700 p-10 min-h-[400px] flex items-center justify-center relative">
              <BiRecycle className="w-[120px] h-[120px] opacity-20 select-none text-white" />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(63,201,109,0.07)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="absolute top-[12%] -right-4 bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl z-10 flex items-center gap-1.5">
                <FiAward className="w-4 h-4" /> Eco Certified
              </div>
              <div className="absolute bottom-[14%] -left-4 bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl z-10 flex items-center gap-1.5">
                <BiRecycle className="w-4 h-4" /> 47 Bank Aktif
              </div>
            </div>
          </div>
          {/* Text */}
          <div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">TENTANG KAMI</span>
            <h2 className="text-4xl font-black text-green-900 font-serif mt-5 mb-5 leading-tight">
              Mengasosiasi Bank Sampah<br />
              <span className="text-green-500">Seluruh Yogyakarta</span>
            </h2>
            <p className="text-green-700/70 text-base leading-relaxed mb-8">
              GenHi adalah organisasi yang mengasosiasi dan mendigitalkan puluhan bank sampah di Kota Yogyakarta.
              Setiap bank sampah memiliki spesialisasi tersendiri. Visi kami adalah menyadarkan masyarakat bahwa
              sampah bukan sekadar limbah, melainkan aset bernilai yang dapat diuangkan.
            </p>
            <div className="flex flex-col gap-4">
              {pillars.map((p, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-green-50 border border-green-100">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center shrink-0"><p.icon className="w-5 h-5 text-green-700" /></div>
                  <div>
                    <div className="font-bold text-sm text-green-900 mb-1">{p.title}</div>
                    <div className="text-xs text-green-700/60 leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
