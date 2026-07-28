'use client';
import { useEffect, useRef, useState } from 'react';
import type { GlobalStats } from '@/lib/types';
import { FiHome, FiMap, FiUsers } from 'react-icons/fi';
import { BiRecycle } from 'react-icons/bi';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let i = 0; const steps = 60; const dur = 1800;
      const timer = setInterval(() => {
        i++;
        setVal(parseFloat((target * (i / steps)).toFixed(target % 1 !== 0 ? 1 : 0)));
        if (i >= steps) clearInterval(timer);
      }, dur / steps);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function StatsSection({ stats }: { stats: GlobalStats }) {
  const items = [
    { icon: FiHome, val: stats.total_bank_aktif || 47, suf: '', label: 'Bank Sampah Aktif', sub: 'di Kota Yogyakarta' },
    { icon: BiRecycle, val: stats.total_sampah_kg ? stats.total_sampah_kg / 1000 : 2.4, suf: ' Ton', label: 'Sampah Terkumpul', sub: 'per bulan, seluruh jaringan' },
    { icon: FiMap, val: stats.total_kecamatan || 14, suf: '', label: 'Kecamatan', sub: 'tertangani di Yogyakarta' },
    { icon: FiUsers, val: stats.total_nasabah || 3200, suf: '+', label: 'Nasabah Aktif', sub: 'bergabung bersama GenHi' },
  ];
  return (
    <section className="bg-white pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 -mt-12 relative z-10">
          {items.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl shadow-green-900/8 border border-green-50 flex flex-col gap-1.5">
              <s.icon className="w-7 h-7 mb-1 text-green-600" />
              <div className="text-3xl font-black text-green-900 font-serif leading-none">
                <AnimatedNumber target={s.val} suffix={s.suf} />
              </div>
              <div className="font-bold text-sm text-green-600">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
