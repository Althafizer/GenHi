'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ArtikelForm from '../../ArtikelForm';
import type { Artikel } from '@/lib/types';

export default function EditArtikelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('artikel')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => {
        if (!data) { router.replace('/admin/artikel'); return; }
        setArtikel(data);
        setLoading(false);
      });
  }, [params.id, router]);

  if (loading || !artikel) {
    return (
      <div className="p-8">
        <div className="text-slate-500 text-sm">Memuat artikel…</div>
      </div>
    );
  }

  return <ArtikelForm mode="edit" initialData={artikel} />;
}
