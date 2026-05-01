// Catalog Section — GenHi Bank Sampah Directory
// Data di-fetch dari /content/bank-sampah.json (dikelola via DecapCMS)

const HARDCODED_BANKS = [
  { id:1, nama:"Bank Sampah Mandiri Sejahtera", alamat:"Jl. Malioboro No. 12, Gedongtengen", kecamatan:"Gedongtengen", spesialisasi:["Plastik","Kertas"], jam:"Sen–Jum 08:00–16:00", buka:true, wa:"081234567890", rating:4.8, reviews:124, lat:-7.7921, lng:110.3644, clr:"#1a5c2e" },
  { id:2, nama:"Bank Sampah Hijau Mandiri", alamat:"Jl. Kaliurang Km 5, Depok", kecamatan:"Depok", spesialisasi:["Botol Kaca","Elektronik"], jam:"Sen–Sab 07:00–15:00", buka:true, wa:"081345678901", rating:4.6, reviews:98, lat:-7.7611, lng:110.3917, clr:"#2d7a4f" },
  { id:3, nama:"Sahabat Sampah Kotagede", alamat:"Jl. Kemasan No. 5, Kotagede", kecamatan:"Kotagede", spesialisasi:["Logam","Plastik"], jam:"Sel–Sab 09:00–17:00", buka:false, wa:"081456789012", rating:4.5, reviews:77, lat:-7.8311, lng:110.4008, clr:"#1e6b3f" },
  { id:4, nama:"Bank Sampah Kraton Lestari", alamat:"Jl. Ngadisuryan No. 3, Kraton", kecamatan:"Kraton", spesialisasi:["Kertas","Kardus"], jam:"Sen–Jum 08:00–14:00", buka:true, wa:"081567890123", rating:4.7, reviews:156, lat:-7.8050, lng:110.3636, clr:"#0f4d27" },
  { id:5, nama:"Eco Bank Gondokusuman", alamat:"Jl. Suroto No. 8, Gondokusuman", kecamatan:"Gondokusuman", spesialisasi:["Plastik","Minyak Jelantah"], jam:"Sen–Sab 07:30–15:30", buka:true, wa:"081678901234", rating:4.9, reviews:201, lat:-7.7834, lng:110.3812, clr:"#245c38" },
  { id:6, nama:"Bank Sampah Umbulharjo Bersih", alamat:"Jl. Veteran No. 20, Umbulharjo", kecamatan:"Umbulharjo", spesialisasi:["Elektronik","Baterai"], jam:"Sel–Jum 08:00–16:00", buka:false, wa:"081789012345", rating:4.3, reviews:54, lat:-7.8178, lng:110.3876, clr:"#1b6b40" },
  { id:7, nama:"Sampah Jadi Berkah", alamat:"Jl. Raya Bantul Km 3, Bantul", kecamatan:"Mantrijeron", spesialisasi:["Kertas","Tekstil"], jam:"Sen–Sab 08:00–15:00", buka:true, wa:"081890123456", rating:4.4, reviews:89, lat:-7.8204, lng:110.3597, clr:"#2a7a52" },
  { id:8, nama:"Bank Sampah Jetis Lestari", alamat:"Jl. P. Diponegoro No. 14, Jetis", kecamatan:"Jetis", spesialisasi:["Plastik","Logam","Kertas"], jam:"Sen–Jum 09:00–16:00", buka:true, wa:"081901234567", rating:4.7, reviews:113, lat:-7.7853, lng:110.3701, clr:"#165c35" },
  { id:9, nama:"Greenbox Wirobrajan", alamat:"Jl. Hos Cokroaminoto No. 7, Wirobrajan", kecamatan:"Wirobrajan", spesialisasi:["Botol Kaca","Plastik"], jam:"Sen–Sab 08:00–14:00", buka:true, wa:"082012345678", rating:4.5, reviews:67, lat:-7.7994, lng:110.3567, clr:"#1e7043" },
  { id:10, nama:"Bank Sampah Danurejan Sejahtera", alamat:"Jl. Suryatmajan No. 2, Danurejan", kecamatan:"Danurejan", spesialisasi:["Kertas","Kardus","Plastik"], jam:"Sel–Sab 07:00–14:00", buka:false, wa:"082123456789", rating:4.2, reviews:42, lat:-7.7978, lng:110.3740, clr:"#157040" },
  { id:11, nama:"Pawon Sampah Tegalrejo", alamat:"Jl. Magelang Km 2, Tegalrejo", kecamatan:"Tegalrejo", spesialisasi:["Minyak Jelantah","Organik"], jam:"Sen–Jum 08:00–15:00", buka:true, wa:"082234567890", rating:4.6, reviews:91, lat:-7.7836, lng:110.3556, clr:"#286644" },
  { id:12, nama:"Bank Sampah Ngampilan Hijau", alamat:"Jl. KS. Tubun No. 9, Ngampilan", kecamatan:"Ngampilan", spesialisasi:["Plastik","Baterai"], jam:"Sen–Jum 09:00–15:00", buka:true, wa:"082345678901", rating:4.4, reviews:60, lat:-7.8003, lng:110.3605, clr:"#1e6b3c" },
  { id:13, nama:"Resik Bank Pakualaman", alamat:"Jl. Sultan Agung No. 11, Pakualaman", kecamatan:"Pakualaman", spesialisasi:["Elektronik","Logam"], jam:"Sel–Sab 08:30–15:30", buka:false, wa:"082456789012", rating:4.3, reviews:38, lat:-7.8020, lng:110.3766, clr:"#1f5e38" },
  { id:14, nama:"Bank Sampah Gondomanan Bersatu", alamat:"Jl. Brigjen Katamso No. 6, Gondomanan", kecamatan:"Gondomanan", spesialisasi:["Kertas","Kardus","Logam"], jam:"Sen–Jum 08:00–16:00", buka:true, wa:"082567890123", rating:4.8, reviews:178, lat:-7.8058, lng:110.3681, clr:"#145a30" },
  { id:15, nama:"Ijo Royo Bank Sampah", alamat:"Jl. Imogiri Timur Km 4, Mergangsan", kecamatan:"Mergangsan", spesialisasi:["Tekstil","Plastik","Organik"], jam:"Sen–Sab 07:00–14:30", buka:true, wa:"082678901234", rating:4.7, reviews:140, lat:-7.8122, lng:110.3749, clr:"#237044" },
];

const CLR_MAP = ["#1a5c2e","#2d7a4f","#1e6b3f","#0f4d27","#245c38","#1b6b40","#2a7a52","#165c35","#1e7043","#157040","#286644","#1e6b3c","#1f5e38","#145a30","#237044"];

// Initialize window.BANKS immediately with hardcoded data (updated after fetch)
window.BANKS = HARDCODED_BANKS;

// Normalize CMS data → internal format
function normalizeBank(b, i) {
  return {
    id: i + 1,
    nama: b.nama || '',
    alamat: b.alamat || '',
    kecamatan: b.kecamatan || '',
    spesialisasi: Array.isArray(b.spesialisasi) ? b.spesialisasi : [],
    jam: b.jam || '',
    buka: b.buka !== undefined ? b.buka : true,
    wa: b.wa || '',
    rating: parseFloat(b.rating) || 4.5,
    reviews: parseInt(b.reviews) || 0,
    lat: parseFloat(b.lat) || -7.8012,
    lng: parseFloat(b.lng) || 110.3644,
    foto: b.foto || null,
    deskripsi: b.deskripsi || '',
    clr: CLR_MAP[i % CLR_MAP.length],
  };
}

// Fetch banks from CMS JSON, fall back to hardcoded
async function fetchBanks() {
  try {
    const res = await fetch('/content/bank-sampah.json?t=' + Date.now());
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.bank_sampah || []);
    const active = list.filter(b => b.aktif !== false);
    return active.length > 0 ? active.map(normalizeBank) : HARDCODED_BANKS;
  } catch(e) {
    return HARDCODED_BANKS;
  }
}

const ALL_SPESIALISASI = ["Semua", "Plastik", "Kertas", "Kardus", "Logam", "Botol Kaca", "Elektronik", "Baterai", "Minyak Jelantah", "Tekstil", "Organik"];
const SORT_OPTIONS = ["Rating Tertinggi", "Ulasan Terbanyak", "Nama A–Z"];

const SPEC_ICONS = {
  "Plastik":"🧴","Kertas":"📄","Kardus":"📦","Logam":"🔩","Botol Kaca":"🍶","Elektronik":"📱","Baterai":"🔋","Minyak Jelantah":"🛢️","Tekstil":"👕","Organik":"🌿"
};

function StarRating({rating}) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return React.createElement('span', {style:{color:'#f59e0b',fontSize:'13px'}},
    '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half?1:0))
  );
}

function CardPlaceholder({id, clr}) {
  const patterns = [
    `repeating-linear-gradient(45deg, ${clr}22 0, ${clr}22 10px, transparent 10px, transparent 20px)`,
    `repeating-linear-gradient(-45deg, ${clr}22 0, ${clr}22 10px, transparent 10px, transparent 20px)`,
    `radial-gradient(circle at 30% 70%, ${clr}44 0, ${clr}11 60%)`,
  ];
  const icons = ['♻️','🌿','🏭','📦','⚡'];
  return React.createElement('div', {
    style:{
      height:'190px', background:`linear-gradient(135deg, ${clr}dd, ${clr}99)`,
      backgroundImage: patterns[(id-1)%3],
      display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
      gap:'8px', position:'relative', overflow:'hidden'
    }
  },
    React.createElement('div', {style:{fontSize:'48px', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'}}, icons[(id-1)%5]),
    React.createElement('div', {style:{color:'rgba(255,255,255,0.6)', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'monospace'}}, 'foto bank sampah')
  );
}

function BankCard({bank}) {
  const [hovered, setHovered] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter:()=>setHovered(true),
    onMouseLeave:()=>setHovered(false),
    style:{
      background:'#fff', borderRadius:'16px', overflow:'hidden',
      boxShadow: hovered ? '0 20px 60px rgba(26,92,46,0.18)' : '0 2px 16px rgba(26,92,46,0.08)',
      transition:'all 0.3s ease', transform: hovered ? 'translateY(-6px)' : 'none',
      cursor:'pointer', display:'flex', flexDirection:'column'
    }
  },
    React.createElement(CardPlaceholder, {id:bank.id, clr:bank.clr}),
    React.createElement('div', {style:{padding:'18px', flex:1, display:'flex', flexDirection:'column', gap:'8px'}},
      React.createElement('div', {style:{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px'}},
        React.createElement('h3', {style:{margin:0, fontSize:'15px', fontWeight:'700', color:'#0a1f0f', lineHeight:1.3, flex:1}}, bank.nama),
        React.createElement('span', {style:{
          background: bank.buka ? '#dcfce7' : '#fee2e2',
          color: bank.buka ? '#166534' : '#991b1b',
          fontSize:'11px', fontWeight:'600', padding:'2px 8px', borderRadius:'20px', whiteSpace:'nowrap', flexShrink:0
        }}, bank.buka ? 'Buka' : 'Tutup')
      ),
      React.createElement('div', {style:{display:'flex', alignItems:'center', gap:'4px', color:'#6b7280', fontSize:'13px'}},
        React.createElement('span', null, '📍'),
        React.createElement('span', null, bank.alamat)
      ),
      React.createElement('div', {style:{display:'flex', flexWrap:'wrap', gap:'4px'}},
        bank.spesialisasi.map(s => React.createElement('span', {
          key:s,
          style:{background:'#f0fdf4', color:'#166534', border:'1px solid #bbf7d0', fontSize:'11px', padding:'2px 8px', borderRadius:'20px', fontWeight:'500'}
        }, `${SPEC_ICONS[s]||''} ${s}`))
      ),
      React.createElement('div', {style:{display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#6b7280'}},
        React.createElement('span', null, '🕐'),
        React.createElement('span', null, bank.jam)
      ),
      React.createElement('div', {style:{display:'flex', alignItems:'center', gap:'6px', marginTop:'2px'}},
        React.createElement(StarRating, {rating:bank.rating}),
        React.createElement('span', {style:{fontSize:'13px', fontWeight:'600', color:'#374151'}}, bank.rating.toFixed(1)),
        React.createElement('span', {style:{fontSize:'12px', color:'#9ca3af'}}, `(${bank.reviews} ulasan)`)
      ),
      React.createElement('div', {style:{display:'flex', gap:'8px', marginTop:'auto', paddingTop:'12px'}},
        React.createElement('a', {
          href:`https://wa.me/62${bank.wa.slice(1)}`, target:'_blank',
          style:{
            flex:1, background:'#1a5c2e', color:'#fff', border:'none', borderRadius:'10px',
            padding:'9px', fontSize:'13px', fontWeight:'600', textAlign:'center', cursor:'pointer',
            textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'
          }
        }, '💬 Hubungi'),
        React.createElement('button', {
          style:{
            flex:1, background:'transparent', color:'#1a5c2e', border:'2px solid #1a5c2e', borderRadius:'10px',
            padding:'9px', fontSize:'13px', fontWeight:'600', cursor:'pointer'
          }
        }, '🗺️ Lokasi')
      )
    )
  );
}

function CatalogSection() {
  const [banks, setBanks] = React.useState(HARDCODED_BANKS);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [spec, setSpec] = React.useState('Semua');
  const [jamFilter, setJamFilter] = React.useState('Semua');
  const [sortBy, setSortBy] = React.useState('Rating Tertinggi');
  const [visible, setVisible] = React.useState(false);

  // Fetch dari CMS JSON
  React.useEffect(() => {
    fetchBanks().then(data => {
      setBanks(data);
      setLoading(false);
      // Expose ke window untuk MapSection
      window.BANKS = data;
    });
  }, []);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true); }, {threshold:0.1});
    const el = document.getElementById('katalog');
    if(el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  let filtered = banks.filter(b => {
    const matchSearch = b.nama.toLowerCase().includes(search.toLowerCase()) || b.kecamatan.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === 'Semua' || b.spesialisasi.includes(spec);
    const matchJam = jamFilter === 'Semua' || (jamFilter === 'Buka' ? b.buka : !b.buka);
    return matchSearch && matchSpec && matchJam;
  });

  if(sortBy === 'Rating Tertinggi') filtered.sort((a,b) => b.rating - a.rating);
  else if(sortBy === 'Ulasan Terbanyak') filtered.sort((a,b) => b.reviews - a.reviews);
  else filtered.sort((a,b) => a.nama.localeCompare(b.nama));

  return React.createElement('section', {id:'katalog', style:{background:'#f8fdf9', padding:'80px 0'}},
    React.createElement('div', {style:{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}},
      React.createElement('div', {style:{textAlign:'center', marginBottom:'48px'}},
        React.createElement('span', {style:{background:'#dcfce7', color:'#166534', fontSize:'13px', fontWeight:'600', padding:'6px 16px', borderRadius:'20px', letterSpacing:'0.05em'}}, 'DIREKTORI'),
        React.createElement('h2', {style:{margin:'16px 0 8px', fontSize:'clamp(32px,5vw,48px)', fontWeight:'800', color:'#0a1f0f', fontFamily:"'DM Serif Display', serif"}}, 'Katalog Bank Sampah'),
        React.createElement('p', {style:{color:'#6b7280', fontSize:'16px', maxWidth:'500px', margin:'0 auto'}}, 'Temukan bank sampah terdekat dengan spesialisasi yang sesuai kebutuhanmu')
      ),
      // Filter bar
      React.createElement('div', {style:{
        background:'#fff', borderRadius:'20px', padding:'20px 24px', marginBottom:'36px',
        boxShadow:'0 4px 24px rgba(26,92,46,0.08)'
      },className:'filter-inner-wrap'},
        React.createElement('div', {style:{
          display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center'
        }, className:'filter-inner'},
        React.createElement('div', {style:{flex:'1 1 220px', display:'flex', alignItems:'center', gap:'10px', background:'#f8fdf9', borderRadius:'12px', padding:'10px 16px', border:'1.5px solid #d1fae5'}},
          React.createElement('span', null, '🔍'),
          React.createElement('input', {
            placeholder:'Cari nama atau kecamatan…',
            value:search, onChange:e=>setSearch(e.target.value),
            style:{border:'none', outline:'none', background:'transparent', fontSize:'14px', width:'100%', color:'#0a1f0f'}
          })
        ),
        React.createElement('select', {
          value:spec, onChange:e=>setSpec(e.target.value),
          style:{background:'#f8fdf9', border:'1.5px solid #d1fae5', borderRadius:'12px', padding:'10px 14px', fontSize:'14px', color:'#0a1f0f', cursor:'pointer', outline:'none'}
        }, ALL_SPESIALISASI.map(s => React.createElement('option', {key:s, value:s}, s))),
        React.createElement('select', {
          value:jamFilter, onChange:e=>setJamFilter(e.target.value),
          style:{background:'#f8fdf9', border:'1.5px solid #d1fae5', borderRadius:'12px', padding:'10px 14px', fontSize:'14px', color:'#0a1f0f', cursor:'pointer', outline:'none'}
        }, ['Semua','Buka','Tutup'].map(s=>React.createElement('option',{key:s,value:s},s==='Semua'?'Jam: Semua':s))),
        React.createElement('select', {
          value:sortBy, onChange:e=>setSortBy(e.target.value),
          style:{background:'#f8fdf9', border:'1.5px solid #d1fae5', borderRadius:'12px', padding:'10px 14px', fontSize:'14px', color:'#0a1f0f', cursor:'pointer', outline:'none'}
        }, SORT_OPTIONS.map(s=>React.createElement('option',{key:s,value:s},s))),
        React.createElement('span', {style:{color:'#6b7280', fontSize:'14px', whiteSpace:'nowrap'}}, `${filtered.length} ditemukan`)
        ) // close filter-inner
      ), // close filter-inner-wrap
      // Loading skeleton
      loading ? React.createElement('div', {style:{
        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'24px'
      }},
        [...Array(6)].map((_,i) => React.createElement('div', {key:i, style:{
          background:'#fff', borderRadius:'16px', overflow:'hidden',
          boxShadow:'0 2px 16px rgba(26,92,46,0.06)'
        }},
          React.createElement('div', {style:{
            height:'190px',
            background:'linear-gradient(90deg, #e8f5ee 25%, #d1fae5 50%, #e8f5ee 75%)',
            backgroundSize:'400px 100%',
            animation:'shimmer 1.5s infinite'
          }}),
          React.createElement('div', {style:{padding:'18px', display:'flex', flexDirection:'column', gap:'10px'}},
            React.createElement('div', {style:{height:'16px', background:'#e8f5ee', borderRadius:'8px', width:'75%', animation:'shimmer 1.5s infinite'}}),
            React.createElement('div', {style:{height:'12px', background:'#e8f5ee', borderRadius:'8px', width:'90%', animation:'shimmer 1.5s infinite'}}),
            React.createElement('div', {style:{height:'12px', background:'#e8f5ee', borderRadius:'8px', width:'60%', animation:'shimmer 1.5s infinite'}})
          )
        ))
      ) :
      // Grid
      React.createElement('div', {style:{
        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'24px'
      }},
        filtered.map((bank, i) => React.createElement('div', {
          key:bank.id,
          style:{opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition:`all 0.5s ease ${i*0.06}s`}
        }, React.createElement(BankCard, {bank})))
      ),
      filtered.length === 0 && React.createElement('div', {style:{textAlign:'center', padding:'60px', color:'#9ca3af'}},
        React.createElement('div', {style:{fontSize:'48px', marginBottom:'12px'}}, '🔍'),
        React.createElement('p', {style:{fontSize:'16px'}}, 'Tidak ada bank sampah yang ditemukan')
      )
    )
  );
}

Object.assign(window, { CatalogSection, BANKS });
