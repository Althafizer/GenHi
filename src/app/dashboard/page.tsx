import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Get bank sampah milik user ini
  const { data: bank } = await supabase
    .from('bank_sampah')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Get statistik 6 bulan terakhir
  const { data: stats } = await supabase
    .from('statistik')
    .select('*')
    .eq('bank_sampah_id', bank?.id)
    .order('periode', { ascending: false })
    .limit(6);

  return <DashboardClient user={user} bank={bank} stats={stats || []} />;
}
