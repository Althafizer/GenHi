'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FiGrid, FiHome, FiFileText, FiUsers, FiDollarSign, FiCpu, FiTag, FiGlobe, FiLogOut } from 'react-icons/fi';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: FiGrid, exact: true },
  { href: '/admin/bank-sampah', label: 'Bank Sampah', icon: FiHome, exact: false },
  { href: '/admin/artikel', label: 'Artikel', icon: FiFileText, exact: false },
];

const COMING_SOON = [
  { label: 'Nasabah', icon: FiUsers },
  { label: 'Penarikan Saldo', icon: FiDollarSign },
  { label: 'Mesin Deposit', icon: FiCpu },
  { label: 'Harga Sampah', icon: FiTag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 sticky top-0 h-screen">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 font-black text-base font-serif">G</div>
          <div>
            <div className="text-white text-sm font-black font-serif leading-tight">GenHi Admin</div>
            <div className="text-slate-500 text-xs">Panel Pengelola</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(n => {
          const isActive = n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + '/');
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <n.icon className="w-4 h-4 shrink-0" />
              {n.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          );
        })}

        {/* Phase 2 */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="px-3 mb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">Segera Hadir</div>
          {COMING_SOON.map(n => (
            <div key={n.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 cursor-not-allowed select-none">
              <n.icon className="w-4 h-4 shrink-0 opacity-50" />
              {n.label}
              <span className="ml-auto text-[10px] font-bold text-slate-700 bg-slate-800 px-2 py-0.5 rounded-full">Soon</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800 flex flex-col gap-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <FiGlobe className="w-4 h-4" /> Lihat Website
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
          <FiLogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
