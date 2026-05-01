// MapSection — Google Maps
const GOOGLE_MAPS_KEY = 'AIzaSyAsj6An1AW-wbMFmgVLpH4Dx6ZUTdWk87c';
const GOOGLE_MAP_ID = 'd46836a28dac693bd56f100c';

function loadGoogleMaps() {
  if (window.__gmLoaded) return window.__gmLoaded;
  window.__gmLoaded = new Promise(resolve => {
    if (window.google && window.google.maps) { resolve(); return; }
    window.__gmInit = resolve;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&map_ids=${GOOGLE_MAP_ID}&libraries=marker&callback=__gmInit`;
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  });
  return window.__gmLoaded;
}



function MapSection() {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const [gmReady, setGmReady] = React.useState(!!(window.google && window.google.maps));
  const [activeBank, setActiveBank] = React.useState(null);

  React.useEffect(() => {
    loadGoogleMaps().then(() => setGmReady(true));
  }, []);

  React.useEffect(() => {
    if (!gmReady || !mapRef.current || mapInstance.current) return;
    const { Map, InfoWindow } = google.maps;
    const { AdvancedMarkerElement, PinElement } = google.maps.marker;

    const map = new Map(mapRef.current, {
      center: { lat: -7.8012, lng: 110.3644 },
      zoom: 13,
      mapId: GOOGLE_MAP_ID,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    const infoWindow = new InfoWindow();

    window.BANKS.forEach(b => {
      // Custom pin element
      const pin = new PinElement({
        background: '#3fc96d',
        borderColor: '#fff',
        glyphColor: '#0a1f0f',
        glyph: '♻',
        scale: 1.2,
      });

      const marker = new AdvancedMarkerElement({
        position: { lat: b.lat, lng: b.lng },
        map,
        content: pin.element,
        title: b.nama,
      });

      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:220px;padding:4px 2px">
            <div style="font-weight:800;font-size:14px;color:#0a1f0f;margin-bottom:6px;line-height:1.3">${b.nama}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px;display:flex;align-items:center;gap:4px">
              <span>📍</span><span>${b.alamat}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
              ${b.spesialisasi.map(s=>`<span style="background:#dcfce7;color:#166534;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600">${s}</span>`).join('')}
            </div>
            <div style="font-size:12px;color:#374151;margin-bottom:4px">⭐ ${b.rating} &nbsp;·&nbsp; ${b.jam}</div>
            <div style="font-size:12px;color:${b.buka?'#166534':'#991b1b'};font-weight:700;margin-bottom:10px">${b.buka?'🟢 Buka Sekarang':'🔴 Tutup'}</div>
            <a href="https://wa.me/62${b.wa.slice(1)}" target="_blank"
              style="display:block;background:#1a5c2e;color:#fff;text-align:center;padding:8px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none">
              💬 Hubungi via WhatsApp
            </a>
          </div>
        `);
        infoWindow.open({ map, anchor: marker });
      });
    });

    mapInstance.current = map;
  }, [gmReady]);

  return React.createElement('section', { id: 'peta', style: { background: '#0a1f0f', padding: '80px 0' } },
    React.createElement('div', { style: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' } },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '48px' } },
        React.createElement('span', { style: { background: 'rgba(255,255,255,0.1)', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.05em' } }, 'PETA INTERAKTIF'),
        React.createElement('h2', { style: { margin: '16px 0 8px', fontSize: 'clamp(32px,5vw,48px)', fontWeight: '800', color: '#fff', fontFamily: "'DM Serif Display', serif" } }, 'Sebaran Bank Sampah'),
        React.createElement('p', { style: { color: '#86efac', fontSize: '16px' } }, 'Klik marker untuk melihat detail dan menghubungi bank sampah')
      ),
      !gmReady
        ? React.createElement('div', { style: { width:'100%', height:'520px', borderRadius:'24px', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', color:'#86efac', fontSize:'16px' } },
            React.createElement('span', null, '🗺️ Memuat Google Maps…')
          )
        : React.createElement('div', {
            ref: mapRef,
            className: 'map-container',
            style: { width: '100%', height: '520px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }
          })
    )
  );
}

Object.assign(window, { MapSection });
