'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardClient from './DashboardClient';
import type { BankSampah } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bank, setBank] = useState<BankSampah | null>(null);
  const [stats, setStats] = useState<any[]>([]);

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
        const { data: statsData } = await supabase
          .from('statistik')
          .select('*')
          .eq('bank_sampah_id', bankData.id)
          .order('periode', { ascending: false })
          .limit(6);
        setStats(statsData || []);
      }

      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-green-600 font-semibold text-sm">Memuat dashboard…</div>
    </div>
  );

  return <DashboardClient user={user} bank={bank} stats={stats} />;
}
