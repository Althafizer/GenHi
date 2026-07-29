'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { BankSampah } from '@/lib/types';
import type { ComponentType } from 'react';
import {
  FiCheck, FiMapPin, FiClock, FiMessageCircle, FiSmartphone, FiBattery,
  FiDroplet, FiFileText, FiBox, FiTool, FiInstagram, FiFacebook, FiYoutube,
} from 'react-icons/fi';
import { IoShirtOutline, IoWineOutline, IoLeafOutline } from 'react-icons/io5';
import { BiRecycle } from 'react-icons/bi';

const SPEC_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Plastik: FiBox, Kertas: FiFileText, Kardus: FiBox, Logam: FiTool,
  'Botol Kaca': IoWineOutline, Elektronik: FiSmartphone, Baterai: FiBattery,
  'Minyak Jelantah': FiDroplet, Tekstil: IoShirtOutline, Organik: IoLeafOutline,
};

export default function BankCard({ bank }: { bank: BankSampah }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const waUrl = `https://wa.me/62${bank.wa?.replace(/^0/, '')}`;
  const detailHref = `/bank-sampah/${bank.slug}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(detailHref)}
      className={`bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
        ${hovered ? 'shadow-2xl shadow-green-900/15 -translate-y-1.5' : 'shadow-md shadow-green-900/6'}`}>
      {/* Photo */}
      <div className="h-48 bg-gradient-to-br from-green-700 to-green-500 relative overflow-hidden flex items-center justify-center">
        {bank.foto_url ? (
          <Image src={bank.foto_url} alt={bank.nama} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <BiRecycle className="w-12 h-12 text-white" />
            <span className="text-white/50 text-xs font-mono tracking-widest uppercase">foto bank sampah</span>
          </div>
        )}
        {bank.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <FiCheck className="w-3 h-3" /> Terverifikasi
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-green-900 leading-snug flex-1">{bank.nama}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0
            ${bank.buka ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {bank.buka ? 'Buka' : 'Tutup'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <FiMapPin className="w-3.5 h-3.5 shrink-0" /><span className="line-clamp-1">{bank.alamat}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 my-0.5">
          {bank.spesialisasi.map(s => {
            const SpecIcon = SPEC_ICONS[s];
            return (
              <span key={s} className="bg-green-50 text-green-700 border border-green-100 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                {SpecIcon && <SpecIcon className="w-3 h-3" />} {s}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <FiClock className="w-3.5 h-3.5 shrink-0" /><span>{bank.jam}</span>
        </div>

        {/* Social media */}
        {(bank.instagram || bank.facebook || bank.youtube) && (
          <div className="flex gap-2 mt-0.5">
            {bank.instagram && <a href={`https://instagram.com/${bank.instagram}`} target="_blank" onClick={e => e.stopPropagation()} className="text-xs text-pink-500 hover:underline inline-flex items-center gap-1"><FiInstagram className="w-3.5 h-3.5" /> IG</a>}
            {bank.facebook && <a href={bank.facebook} target="_blank" onClick={e => e.stopPropagation()} className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"><FiFacebook className="w-3.5 h-3.5" /> FB</a>}
            {bank.youtube && <a href={bank.youtube} target="_blank" onClick={e => e.stopPropagation()} className="text-xs text-red-500 hover:underline inline-flex items-center gap-1"><FiYoutube className="w-3.5 h-3.5" /> YT</a>}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-3">
          {bank.wa && (
            <a href={waUrl} target="_blank" onClick={e => e.stopPropagation()}
              className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-xs font-bold text-center hover:bg-green-500 transition-colors flex items-center justify-center gap-1.5">
              <FiMessageCircle className="w-3.5 h-3.5" /> Hubungi WA
            </a>
          )}
          <Link href={detailHref} onClick={e => e.stopPropagation()}
            className="flex-1 border-2 border-green-600 text-green-600 rounded-xl py-2.5 text-xs font-bold text-center hover:bg-green-50 transition-colors">
            Lihat Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
