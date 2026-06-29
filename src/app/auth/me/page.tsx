'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthMePage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // onAuthStateChange fires INITIAL_SESSION immediately with the stored session
    // — more reliable than getUser() right after a hard navigation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (!session?.user) {
          router.replace('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') router.replace('/admin');
        else if (profile?.role === 'nasabah') router.replace('/nasabah');
        else router.replace('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-black font-serif text-lg">G</div>
        <div className="text-green-400 text-sm font-semibold">Memuat…</div>
      </div>
    </div>
  );
}
