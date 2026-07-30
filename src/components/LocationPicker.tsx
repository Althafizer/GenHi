'use client';
import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, YOGYA_CENTER, parseGoogleMapsCoords } from '@/lib/googleMaps';
import { FiMapPin, FiTrash2, FiAlertTriangle, FiCheck, FiArrowRight } from 'react-icons/fi';

// Recycle-glyph SVG (matches the BiRecycle icon used elsewhere) for the Google Maps pin,
// which requires a raw DOM Element/string rather than a React component.
const RECYCLE_GLYPH_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#ffffff">' +
  '<path d="m21.224 15.543-.813-1.464-1.748.972.812 1.461c.048.085.082.173.104.264a1.024 1.024 0 0 1-.014.5.988.988 0 0 1-.104.235 1 1 0 0 1-.347.352.978.978 0 0 1-.513.137H14v-2l-4 3 4 3v-2h4.601c.278 0 .552-.037.811-.109a2.948 2.948 0 0 0 1.319-.776c.178-.179.332-.38.456-.593a2.992 2.992 0 0 0 .336-2.215 3.163 3.163 0 0 0-.299-.764zM5.862 11.039l-2.31 4.62a3.06 3.06 0 0 0-.261.755 2.997 2.997 0 0 0 .851 2.735c.178.174.376.326.595.453A3.022 3.022 0 0 0 6.236 20H8v-2H6.236a1.016 1.016 0 0 1-.5-.13.974.974 0 0 1-.353-.349 1 1 0 0 1-.149-.468.933.933 0 0 1 .018-.245c.018-.087.048-.173.089-.256l2.256-4.512 1.599.923L8.598 8 4 9.964l1.862 1.075zm12.736 1.925L19.196 8l-1.638.945-2.843-5.117a2.95 2.95 0 0 0-1.913-1.459 3.227 3.227 0 0 0-.772-.083 3.003 3.003 0 0 0-1.498.433A2.967 2.967 0 0 0 9.41 3.944l-.732 1.464 1.789.895.732-1.465c.045-.09.101-.171.166-.242a.933.933 0 0 1 .443-.27 1.053 1.053 0 0 1 .53-.011.963.963 0 0 1 .63.485l2.858 5.146L14 11l4.598 1.964z"/>' +
  '</svg>';

export default function LocationPicker({
  lat,
  lng,
  onChange,
  onClear,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  onClear: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  // Keep a stable reference so map listeners always call the latest handler.
  const placeAtRef = useRef<(lat: number, lng: number, recenter?: boolean) => void>(() => {});

  const [error, setError] = useState('');
  const [searchAvailable, setSearchAvailable] = useState(false);
  const [locating, setLocating] = useState(false);
  const [link, setLink] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Moves the pin to a coordinate and reports it upward. Uses refs so it can be
  // called from map/marker listeners, the search box, geolocation, or link paste.
  placeAtRef.current = (la: number, ln: number, recenter = true) => {
    const marker = markerRef.current;
    const map = mapRef.current;
    if (marker && map) {
      const pos = { lat: la, lng: ln };
      marker.position = pos;
      marker.map = map;
      if (recenter) { map.setCenter(pos); map.setZoom(16); }
    }
    onChange(Number(la.toFixed(7)), Number(ln.toFixed(7)));
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
    if (!apiKey) { setError('NEXT_PUBLIC_GOOGLE_MAPS_KEY belum diatur'); return; }
    if (!containerRef.current) return;

    let cancelled = false;

    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !containerRef.current) return;
      const g = window.google.maps;
      const AdvancedMarkerElement = g.marker?.AdvancedMarkerElement;
      const PinElement = g.marker?.PinElement;

      if (!AdvancedMarkerElement || !PinElement) {
        setError('Library marker Google Maps gagal dimuat. Periksa izin API key.');
        return;
      }

      const hasPos = lat != null && lng != null;
      const start = hasPos ? { lat: Number(lat), lng: Number(lng) } : YOGYA_CENTER;

      const map = new g.Map(containerRef.current, {
        center: start,
        zoom: hasPos ? 16 : 13,
        mapId: mapId || undefined,
        disableDefaultUI: false,
        clickableIcons: false,
      });
      mapRef.current = map;

      const pin = new PinElement({
        background: '#1a5c2e',
        borderColor: '#0a1f0f',
        glyph: (() => {
          const el = document.createElement('div');
          el.innerHTML = RECYCLE_GLYPH_SVG;
          return el.firstElementChild as Element;
        })(),
        glyphColor: '#ffffff',
        scale: 1.2,
      });
      const marker = new AdvancedMarkerElement({
        map,
        position: start,
        gmpDraggable: true,
        content: pin.element,
      });
      markerRef.current = marker;
      if (!hasPos) marker.map = null; // hide until a position is chosen

      marker.addListener('dragend', () => {
        const p = marker.position;
        if (p) placeAtRef.current(p.lat, p.lng, false);
      });
      map.addListener('click', (e: any) => {
        if (e.latLng) placeAtRef.current(e.latLng.lat(), e.latLng.lng(), false);
      });

      // Places Autocomplete search (requires the Places API to be enabled on the key).
      if (searchRef.current && g.places?.Autocomplete) {
        try {
          const ac = new g.places.Autocomplete(searchRef.current, {
            fields: ['geometry'],
            componentRestrictions: { country: 'id' },
          });
          ac.bindTo('bounds', map);
          ac.addListener('place_changed', () => {
            const loc = ac.getPlace()?.geometry?.location;
            if (loc) placeAtRef.current(loc.lat(), loc.lng(), true);
          });
          setSearchAvailable(true);
        } catch {
          setSearchAvailable(false);
        }
      }
    }).catch(err => {
      if (!cancelled) setError(err.message || 'Peta gagal dimuat');
    });

    return () => { cancelled = true; };
    // Initialise once; later lat/lng changes are driven through the pin itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearLocation = () => {
    const marker = markerRef.current;
    if (marker) marker.map = null; // hide the pin
    setLink('');
    setLinkError('');
    onClear();
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { setError('Browser tidak mendukung geolokasi'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        placeAtRef.current(pos.coords.latitude, pos.coords.longitude, true);
      },
      () => {
        setLocating(false);
        setError('Gagal mendapatkan lokasi. Izinkan akses lokasi di browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const applyLink = async () => {
    setLinkError('');
    const raw = link.trim();
    if (!raw) return;

    // Full URLs often contain coords directly — try that first (no network call).
    const direct = parseGoogleMapsCoords(raw);
    if (direct) { placeAtRef.current(direct.lat, direct.lng, true); setLink(''); return; }

    // Otherwise (e.g. shortened maps.app.goo.gl links) resolve on the server.
    setLinkLoading(true);
    try {
      const res = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (!res.ok) { setLinkError(data.error || 'Gagal memproses link'); return; }
      placeAtRef.current(data.lat, data.lng, true);
      setLink('');
    } catch {
      setLinkError('Gagal menghubungi server');
    } finally {
      setLinkLoading(false);
    }
  };

  const labelCls = 'block text-green-700 dark:text-green-400 text-xs font-bold mb-1.5';
  const inputCls = 'w-full bg-white dark:bg-white/[8%] border border-gray-300 dark:border-white/[12%] rounded-xl px-4 py-3 text-green-900 dark:text-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-white/30';

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 dark:text-white/50">
        Tandai lokasi persis bank sampahmu — dipakai untuk pencarian bank sampah terdekat oleh nasabah.
      </p>

      {/* Search box (Places Autocomplete) */}
      <div>
        <label className={labelCls}>Cari nama tempat / alamat</label>
        <input
          ref={searchRef}
          type="text"
          placeholder="Ketik nama bank sampah, jalan, atau tempat…"
          className={inputCls}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
        {!searchAvailable && !error && (
          <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
            Jika saran pencarian tidak muncul, aktifkan <span className="text-gray-500 dark:text-white/50">Places API</span> di
            Google Cloud, atau gunakan cara paste link di bawah.
          </p>
        )}
      </div>

      {/* Paste Google Maps share link */}
      <div>
        <label className={labelCls}>Atau tempel link Google Maps</label>
        <div className="flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } }}
            placeholder="https://maps.app.goo.gl/…"
            className={inputCls}
          />
          <button type="button" onClick={applyLink} disabled={linkLoading || !link.trim()}
            className="shrink-0 text-xs font-bold text-white bg-green-500 hover:bg-green-400 px-4 rounded-xl transition-colors disabled:opacity-50">
            {linkLoading ? 'Memproses…' : 'Terapkan'}
          </button>
        </div>
        {linkError
          ? <p className="text-xs text-red-500 dark:text-red-400 mt-1">{linkError}</p>
          : <p className="text-xs text-gray-400 dark:text-white/30 mt-1 flex items-center gap-1 flex-wrap">Buka tempat di Google Maps <FiArrowRight className="w-3 h-3" /> Share <FiArrowRight className="w-3 h-3" /> Salin link, lalu tempel di sini.</p>}
      </div>

      {/* Map */}
      <div>
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <p className="text-xs text-gray-400 dark:text-white/40">Klik pada peta atau geser pin untuk menyesuaikan.</p>
          <button type="button" onClick={useMyLocation} disabled={locating}
            className="shrink-0 text-xs font-bold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30 px-3 py-2 rounded-full hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors disabled:opacity-50">
            {locating ? 'Mencari…' : <span className="inline-flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5" /> Gunakan lokasi saya</span>}
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 text-center text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        ) : (
          <div ref={containerRef}
            className="w-full h-[360px] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10" />
        )}
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Latitude</label>
            <input value={lat ?? ''} readOnly className={inputCls + ' opacity-70'} placeholder="Belum diatur" />
          </div>
          <div>
            <label className={labelCls}>Longitude</label>
            <input value={lng ?? ''} readOnly className={inputCls + ' opacity-70'} placeholder="Belum diatur" />
          </div>
        </div>
        {lat != null && lng != null && (
          <button type="button" onClick={clearLocation}
            className="shrink-0 text-xs font-bold text-red-500 dark:text-red-400 border border-red-300 dark:border-red-500/30 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors inline-flex items-center gap-1.5">
            <FiTrash2 className="w-3.5 h-3.5" /> Hapus lokasi
          </button>
        )}
      </div>

      {lat == null || lng == null ? (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5"><FiAlertTriangle className="w-3.5 h-3.5 shrink-0" /> Lokasi belum diatur — bank sampahmu tidak akan muncul di peta & pencarian terdekat.</p>
      ) : (
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5"><FiCheck className="w-3.5 h-3.5 shrink-0" /> Lokasi sudah ditandai. Jangan lupa klik &quot;Simpan Perubahan&quot;.</p>
      )}
    </div>
  );
}
