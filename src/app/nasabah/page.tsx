'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import NasabahClient from './NasabahClient';
import type { NasabahProfile, Saldo } from '@/lib/types';

export default function NasabahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<NasabahProfile | null>(null);
  const [saldo, setSaldo] = useState<Saldo | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // getSession() reads directly from storage — no network call, always immediate
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return; }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileData?.role !== 'nasabah') { router.replace('/'); return; }

      const [{ data: nasabahProfile }, { data: saldoData }] = await Promise.all([
        supabase.from('nasabah_profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('saldo').select('*').eq('user_id', session.user.id).single(),
      ]);

      setUser(session.user);
      setProfile(nasabahProfile);
      setSaldo(saldoData);
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center">
      <div className="text-green-400 text-sm font-semibold">Memuat dashboard…</div>
    </div>
  );

  return <NasabahClient user={user} profile={profile} saldo={saldo} />;
}
