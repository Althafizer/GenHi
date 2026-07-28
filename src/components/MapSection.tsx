'use client';
import { useEffect, useRef, useState } from 'react';
import type { BankSampah } from '@/lib/types';
import { loadGoogleMaps } from '@/lib/googleMaps';

export default function MapSection({ banks }: { banks: BankSampah[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
    if (!apiKey) { setError('NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set'); return; }
    if (!containerRef.current) return;

    let cancelled = false;

    loadGoogleMaps(apiKey).then(async () => {
      if (cancelled || !containerRef.current) return;
      const g = window.google.maps;
      const Map = g.Map;
      const AdvancedMarkerElement = g.marker?.AdvancedMarkerElement;
      const PinElement = g.marker?.PinElement;

      if (!AdvancedMarkerElement || !PinElement) {
        setError('Google Maps marker library failed to load. Check API key permissions.');
        return;
      }

      const map = new Map(containerRef.current, {
        center: { lat: -7.7956, lng: 110.3695 },
        zoom: 12,
        mapId: mapId || undefined,
        disableDefaultUI: false,
        clickableIcons: false,
      });

      const infoWindow = new window.google.maps.InfoWindow();

      banks
        .filter(b => b.lat != null && b.lng != null)
        .forEach(b => {
          const pin = new PinElement({
            background: '#1a5c2e',
            borderColor: '#0a1f0f',
            glyph: '♻',
            glyphColor: '#ffffff',
            scale: 1.2,
          });
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: Number(b.lat), lng: Number(b.lng) },
            title: b.nama,
            content: pin.element,
          });
          marker.addListener('click', () => {
            const escape = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
            const chips = (b.spesialisasi || []).map(s =>
              `<span style="display:inline-block;background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-right:6px;margin-bottom:4px;">${escape(s)}</span>`
            ).join('');
            const waLink = b.wa
              ? `https://wa.me/${b.wa.replace(/[^0-9]/g, '').replace(/^0/, '62')}`
              : '#';
            const buka = b.buka;
            infoWindow.setContent(`
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px 8px; min-width: 280px; max-width: 320px;">
                <div style="font-weight: 900; color: #0a1f0f; font-size: 18px; margin-bottom: 8px; line-height: 1.25;">${escape(b.nama)}</div>
                <div style="color: #374151; font-size: 13px; margin-bottom: 10px; display:flex; align-items:flex-start; gap:4px;">
                  <span>📍</span><span>${escape(b.alamat || '')}</span>
                </div>
                <div style="margin-bottom: 12px;">${chips}</div>
                <div style="color: #374151; font-size: 13px; margin-bottom: 8px; font-weight: 600;">
                  ⭐ ${b.rating ?? '-'} · ${escape(b.jam || 'Jam tidak tersedia')}
                </div>
                <div style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:${buka ? '#15803d' : '#991b1b'}; margin-bottom: 14px;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:999px;background:${buka ? '#22c55e' : '#ef4444'};box-shadow:0 0 0 3px ${buka ? '#bbf7d0' : '#fecaca'};"></span>
                  ${buka ? 'Buka Sekarang' : 'Tutup'}
                </div>
                <a href="${waLink}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1a5c2e;color:#fff;padding:12px 16px;border-radius:14px;font-size:14px;font-weight:800;text-decoration:none;border:2px solid #3fc96d;box-shadow:0 4px 12px rgba(26,92,46,0.3);">
                  💬 Hubungi via WhatsApp
                </a>
              </div>
            `);
            infoWindow.open({ map, anchor: marker });
          });
        });
    }).catch(err => {
      if (!cancelled) setError(err.message || 'Map failed to load');
    });

    return () => { cancelled = true; };
  }, [banks]);

  return (
    <section id="peta" className="bg-green-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-500/15 text-green-400 px-5 py-2 rounded-full text-xs font-bold tracking-widest mb-4">
            ● PETA INTERAKTIF
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white font-serif mb-3">Sebaran Bank Sampah</h2>
          <p className="text-green-400/70">Klik marker untuk melihat detail dan menghubungi bank sampah</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center text-red-300">
            {error}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-[560px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          />
        )}
      </div>
    </section>
  );
}
