'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardClient from './DashboardClient';
import type { BankSampah, JurnalPenimbangan } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bank, setBank] = useState<BankSampah | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [jurnal, setJurnal] = useState<JurnalPenimbangan[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      setUser(user);

      const { data: bankData } = await supabase
        .from('bank_sampah')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setBank(bankData);

      if (bankData) {
        const [{ data: statsData }, { data: jurnalData }] = await Promise.all([
          supabase.from('statistik')
            .select('*')
            .eq('bank_sampah_id', bankData.id)
            .order('periode', { ascending: false })
            .limit(6),
          supabase.from('jurnal_penimbangan')
            .select('*')
            .eq('bank_sampah_id', bankData.id)
            .order('tanggal', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(50),
        ]);
        setStats(statsData || []);
        setJurnal(jurnalData || []);
      }

      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-green-600 font-semibold text-sm">Memuat dashboard…</div>
    </div>
  );

  return <DashboardClient user={user} bank={bank} stats={stats} jurnal={jurnal} />;
}
