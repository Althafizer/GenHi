'use client';
import { useEffect, useRef, useState } from 'react';
import type { BankSampah } from '@/lib/types';
import { loadGoogleMaps } from '@/lib/googleMaps';

// Inline icon SVGs matching react-icons/fi (FiMapPin, FiMessageCircle, FiStar) for use
// inside raw HTML strings (Google Maps InfoWindow content / marker glyph don't render React).
const SVG_RECYCLE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#ffffff">' +
  '<path d="m21.224 15.543-.813-1.464-1.748.972.812 1.461c.048.085.082.173.104.264a1.024 1.024 0 0 1-.014.5.988.988 0 0 1-.104.235 1 1 0 0 1-.347.352.978.978 0 0 1-.513.137H14v-2l-4 3 4 3v-2h4.601c.278 0 .552-.037.811-.109a2.948 2.948 0 0 0 1.319-.776c.178-.179.332-.38.456-.593a2.992 2.992 0 0 0 .336-2.215 3.163 3.163 0 0 0-.299-.764zM5.862 11.039l-2.31 4.62a3.06 3.06 0 0 0-.261.755 2.997 2.997 0 0 0 .851 2.735c.178.174.376.326.595.453A3.022 3.022 0 0 0 6.236 20H8v-2H6.236a1.016 1.016 0 0 1-.5-.13.974.974 0 0 1-.353-.349 1 1 0 0 1-.149-.468.933.933 0 0 1 .018-.245c.018-.087.048-.173.089-.256l2.256-4.512 1.599.923L8.598 8 4 9.964l1.862 1.075zm12.736 1.925L19.196 8l-1.638.945-2.843-5.117a2.95 2.95 0 0 0-1.913-1.459 3.227 3.227 0 0 0-.772-.083 3.003 3.003 0 0 0-1.498.433A2.967 2.967 0 0 0 9.41 3.944l-.732 1.464 1.789.895.732-1.465c.045-.09.101-.171.166-.242a.933.933 0 0 1 .443-.27 1.053 1.053 0 0 1 .53-.011.963.963 0 0 1 .63.485l2.858 5.146L14 11l4.598 1.964z"/>' +
  '</svg>';
const SVG_MAP_PIN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">' +
  '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' +
  '</svg>';
const SVG_MESSAGE_CIRCLE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
  '</svg>';
const SVG_STAR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' +
  '</svg>';

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
          const glyphEl = document.createElement('div');
          glyphEl.innerHTML = SVG_RECYCLE;
          const pin = new PinElement({
            background: '#1a5c2e',
            borderColor: '#0a1f0f',
            glyph: glyphEl.firstElementChild as Element,
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
                  <span>${SVG_MAP_PIN}</span><span>${escape(b.alamat || '')}</span>
                </div>
                <div style="margin-bottom: 12px;">${chips}</div>
                <div style="color: #374151; font-size: 13px; margin-bottom: 8px; font-weight: 600; display:flex; align-items:center; gap:4px;">
                  ${SVG_STAR} ${b.rating ?? '-'} · ${escape(b.jam || 'Jam tidak tersedia')}
                </div>
                <div style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:${buka ? '#15803d' : '#991b1b'}; margin-bottom: 14px;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:999px;background:${buka ? '#22c55e' : '#ef4444'};box-shadow:0 0 0 3px ${buka ? '#bbf7d0' : '#fecaca'};"></span>
                  ${buka ? 'Buka Sekarang' : 'Tutup'}
                </div>
                <a href="${waLink}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1a5c2e;color:#fff;padding:12px 16px;border-radius:14px;font-size:14px;font-weight:800;text-decoration:none;border:2px solid #3fc96d;box-shadow:0 4px 12px rgba(26,92,46,0.3);">
                  ${SVG_MESSAGE_CIRCLE} Hubungi via WhatsApp
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
