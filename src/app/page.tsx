import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import CatalogSection from '@/components/CatalogSection';
import MapSection from '@/components/MapSection';
import ArticlesSection from '@/components/ArticlesSection';
import RegisterSection from '@/components/RegisterSection';
import Footer from '@/components/Footer';
import type { BankSampah, Artikel, GlobalStats } from '@/lib/types';

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const supabase = createClient();

  // Fetch all data in parallel
  const [banksRes, artikelRes, statsRes] = await Promise.all([
    supabase.from('bank_sampah').select('*').eq('aktif', true).order('rating', { ascending: false }),
    supabase.from('artikel').select('*, bank_sampah(nama,slug)').eq('published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('global_stats').select('*').single(),
  ]);

  const banks: BankSampah[] = banksRes.data || [];
  const artikels: Artikel[] = artikelRes.data || [];
  const stats: GlobalStats = statsRes.data || {
    total_bank_aktif: 0, total_kecamatan: 0, total_sampah_kg: 0, total_nasabah: 0
  };

  return (
    <main>
      <Navbar />
      <Hero stats={stats} />
      <StatsSection stats={stats} />
      <AboutSection />
      <CatalogSection banks={banks} />
      <MapSection banks={banks} />
      <ArticlesSection artikels={artikels} />
      <RegisterSection />
      <Footer />
    </main>
  );
}
