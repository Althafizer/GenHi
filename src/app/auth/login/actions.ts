'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(email: string, password: string): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return error.message;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'admin') redirect('/admin');
    if (profile?.role === 'nasabah') redirect('/nasabah');
  }

  redirect('/dashboard');
}
