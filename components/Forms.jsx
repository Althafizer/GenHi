// Articles + Registration Form + Footer

const ARTICLES = [
  { id:1, tag:'Tips & Trik', title:'Cara Memilah Sampah yang Benar di Rumah', excerpt:'Pemilahan sampah di sumber adalah langkah pertama yang paling penting dalam sistem pengelolaan sampah modern. Pelajari cara yang mudah dan efektif.', date:'18 Apr 2026', readTime:'4 menit', clr:'#1a5c2e' },
  { id:2, tag:'Kisah Sukses', title:'Dari Sampah Jadi Rupiah: Cerita Bank Sampah Mandiri Sejahtera', excerpt:'Bagaimana sebuah komunitas kecil di Malioboro berhasil mengumpulkan jutaan rupiah dari sampah daur ulang dalam satu tahun terakhir.', date:'12 Apr 2026', readTime:'6 menit', clr:'#2d7a4f' },
  { id:3, tag:'Edukasi', title:'Kenali Jenis Sampah yang Bernilai Tinggi di Pasaran', excerpt:'Tidak semua sampah sama nilainya. Beberapa jenis material seperti tembaga, aluminium, dan plastik HDPE memiliki harga yang cukup tinggi di pengepul.', date:'5 Apr 2026', readTime:'5 menit', clr:'#0f4d27' },
];

function ArticleCard({ article }) {
  const [hov, setHov] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: hov ? '0 20px 60px rgba(26,92,46,0.15)' : '0 4px 20px rgba(26,92,46,0.07)', transition: 'all 0.3s ease', transform: hov ? 'translateY(-4px)' : 'none', cursor: 'pointer' }
  },
    React.createElement('div', {
      style: { height: '200px', background: `linear-gradient(135deg, ${article.clr}ee, ${article.clr}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }
    },
      React.createElement('div', { style: { fontSize: '52px' } }, ['📰','🏆','♻️'][article.id-1]),
      React.createElement('div', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em' } }, 'foto artikel')
    ),
    React.createElement('div', { style: { padding: '20px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
        React.createElement('span', { style: { background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' } }, article.tag),
        React.createElement('span', { style: { color: '#9ca3af', fontSize: '12px' } }, `📖 ${article.readTime}`)
      ),
      React.createElement('h3', { style: { margin: '0 0 10px', fontSize: '16px', fontWeight: '700', color: '#0a1f0f', lineHeight: 1.4 } }, article.title),
      React.createElement('p', { style: { margin: '0 0 14px', fontSize: '13px', color: '#6b7280', lineHeight: 1.6 } }, article.excerpt),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('span', { style: { color: '#9ca3af', fontSize: '12px' } }, article.date),
        React.createElement('span', { style: { color: '#1a5c2e', fontSize: '13px', fontWeight: '600' } }, 'Baca selengkapnya →')
      )
    )
  );
}

function ArticlesSection() {
  return React.createElement('section', { id: 'artikel', style: { background: '#fff', padding: '80px 0' } },
    React.createElement('div', { style: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' } },
        React.createElement('div', null,
          React.createElement('span', { style: { background: '#dcfce7', color: '#166534', fontSize: '13px', fontWeight: '600', padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.05em' } }, 'ARTIKEL'),
          React.createElement('h2', { style: { margin: '12px 0 0', fontSize: 'clamp(28px,4vw,42px)', fontWeight: '800', color: '#0a1f0f', fontFamily: "'DM Serif Display', serif" } }, 'Edukasi & Inspirasi')
        ),
        React.createElement('button', { style: { background: 'transparent', border: '2px solid #1a5c2e', color: '#1a5c2e', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' } }, 'Lihat Semua Artikel →')
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' } },
        ARTICLES.map(a => React.createElement(ArticleCard, { key: a.id, article: a }))
      )
    )
  );
}

function RegisterSection() {
  const [form, setForm] = React.useState({ nama: '', alamat: '', kecamatan: '', spesialisasi: [], wa: '', jam: '', email: '', deskripsi: '' });
  const [submitted, setSubmitted] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const specList = ['Plastik','Kertas','Kardus','Logam','Botol Kaca','Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'];
  
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpec = s => setForm(f => ({ ...f, spesialisasi: f.spesialisasi.includes(s) ? f.spesialisasi.filter(x => x !== s) : [...f.spesialisasi, s] }));

  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return React.createElement('section', { id: 'daftar', style: { background: 'linear-gradient(135deg, #0a1f0f, #1a5c2e)', padding: '80px 0' } },
    React.createElement('div', { style: { maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: '72px', marginBottom: '20px' } }, '🎉'),
      React.createElement('h2', { style: { color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 12px', fontFamily: "'DM Serif Display', serif" } }, 'Pendaftaran Terkirim!'),
      React.createElement('p', { style: { color: '#86efac', fontSize: '16px', lineHeight: 1.6 } }, 'Terima kasih telah mendaftar. Tim GenHi akan menghubungi Anda dalam 1-3 hari kerja untuk verifikasi akun bank sampah Anda.'),
      React.createElement('button', { onClick: () => { setSubmitted(false); setStep(1); setForm({ nama: '', alamat: '', kecamatan: '', spesialisasi: [], wa: '', jam: '', email: '', deskripsi: '' }); }, style: { marginTop: '24px', background: '#3fc96d', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' } }, 'Daftar Bank Sampah Lain')
    )
  );

  return React.createElement('section', { id: 'daftar', style: { background: 'linear-gradient(135deg, #0a1f0f, #1a5c2e)', padding: '80px 0' } },
    React.createElement('div', { style: { maxWidth: '720px', margin: '0 auto', padding: '0 24px' } },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '40px' } },
        React.createElement('span', { style: { background: 'rgba(255,255,255,0.1)', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.05em' } }, 'BERGABUNG'),
        React.createElement('h2', { style: { margin: '16px 0 8px', fontSize: 'clamp(28px,4vw,42px)', fontWeight: '800', color: '#fff', fontFamily: "'DM Serif Display', serif" } }, 'Daftarkan Bank Sampahmu'),
        React.createElement('p', { style: { color: '#86efac', fontSize: '16px' } }, 'Jadilah bagian dari ekosistem bank sampah digital GenHi')
      ),
      // Step indicator
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' } },
        [1,2].map(s => React.createElement('div', { key: s, style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          React.createElement('div', { style: { width: '28px', height: '28px', borderRadius: '50%', background: step >= s ? '#3fc96d' : 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', transition: 'all 0.3s' } }, s),
          React.createElement('span', { style: { color: step >= s ? '#a8f5c4' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600' } }, s===1?'Info Dasar':'Detail Operasional'),
          s < 2 && React.createElement('div', { style: { width: '32px', height: '2px', background: step > 1 ? '#3fc96d' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s' } })
        ))
      ),
      React.createElement('form', { onSubmit: handleSubmit, style: { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '36px', border: '1px solid rgba(255,255,255,0.12)' } },
        step === 1 ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
          ...[
            { label: 'Nama Bank Sampah *', key: 'nama', placeholder: 'Contoh: Bank Sampah Mandiri Sejahtera', type: 'text' },
            { label: 'Alamat Lengkap *', key: 'alamat', placeholder: 'Jl. Contoh No. 1, Kelurahan', type: 'text' },
            { label: 'Kecamatan *', key: 'kecamatan', placeholder: 'Pilih kecamatan', type: 'text' },
            { label: 'Email Organisasi *', key: 'email', placeholder: 'banksampah@email.com', type: 'email' },
          ].map(f => React.createElement('div', { key: f.key },
            React.createElement('label', { style: { display: 'block', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', marginBottom: '6px' } }, f.label),
            React.createElement('input', { type: f.type, placeholder: f.placeholder, value: form[f.key], onChange: e => update(f.key, e.target.value), required: true, style: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' } })
          )),
          React.createElement('button', { type: 'button', onClick: () => setStep(2), style: { background: '#3fc96d', color: '#0a1f0f', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' } }, 'Lanjut →')
        ) : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
          React.createElement('div', null,
            React.createElement('label', { style: { display: 'block', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', marginBottom: '10px' } }, 'Spesialisasi Sampah *'),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
              specList.map(s => React.createElement('button', { key: s, type: 'button', onClick: () => toggleSpec(s), style: { background: form.spesialisasi.includes(s) ? '#3fc96d' : 'rgba(255,255,255,0.08)', color: form.spesialisasi.includes(s) ? '#0a1f0f' : '#fff', border: `1.5px solid ${form.spesialisasi.includes(s) ? '#3fc96d' : 'rgba(255,255,255,0.15)'}`, borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' } }, s))
            )
          ),
          ...[
            { label: 'Nomor WhatsApp *', key: 'wa', placeholder: '08xxxxxxxxxx', type: 'tel' },
            { label: 'Jam Operasional *', key: 'jam', placeholder: 'Contoh: Senin–Jumat 08:00–16:00', type: 'text' },
          ].map(f => React.createElement('div', { key: f.key },
            React.createElement('label', { style: { display: 'block', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', marginBottom: '6px' } }, f.label),
            React.createElement('input', { type: f.type, placeholder: f.placeholder, value: form[f.key], onChange: e => update(f.key, e.target.value), required: true, style: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' } })
          )),
          React.createElement('div', null,
            React.createElement('label', { style: { display: 'block', color: '#a8f5c4', fontSize: '13px', fontWeight: '600', marginBottom: '6px' } }, 'Deskripsi Singkat'),
            React.createElement('textarea', { placeholder: 'Ceritakan sedikit tentang bank sampah Anda...', value: form.deskripsi, onChange: e => update('deskripsi', e.target.value), rows: 3, style: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: '12px' } },
            React.createElement('button', { type: 'button', onClick: () => setStep(1), style: { flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' } }, '← Kembali'),
            React.createElement('button', { type: 'submit', style: { flex: 2, background: '#3fc96d', color: '#0a1f0f', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' } }, '🌿 Daftarkan Sekarang')
          )
        )
      )
    )
  );
}

function Footer() {
  return React.createElement('footer', { id: 'kontak', style: { background: '#060f09', padding: '60px 0 32px', color: '#fff' } },
    React.createElement('div', { style: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' } },
        React.createElement('div', null,
          React.createElement('img', { src: 'uploads/assets-1776930587176.jpeg', alt: 'GenHi', style: { height: '60px', marginBottom: '16px', filter: 'brightness(1.1)' } }),
          React.createElement('p', { style: { color: '#6b9c7e', fontSize: '14px', lineHeight: 1.7, maxWidth: '260px' } }, 'Asosiasi bank sampah digital di Kota Yogyakarta. Menghubungkan masyarakat dengan pengelola sampah profesional.'),
          React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '16px' } },
            ['📘','📸','🐦','▶️'].map((icon, i) => React.createElement('a', { key: i, href: '#', style: { width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', textDecoration: 'none', transition: 'background 0.2s' } }, icon))
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { style: { color: '#a8f5c4', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '16px' } }, 'NAVIGASI'),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
            ['Tentang GenHi','Katalog Bank Sampah','Peta Interaktif','Artikel','Daftar Bank Sampah'].map(item =>
              React.createElement('a', { key: item, href: '#', style: { color: '#6b9c7e', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' } }, item)
            )
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { style: { color: '#a8f5c4', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '16px' } }, 'KONTAK'),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
            [
              { icon: '📧', text: 'info@genhi.id' },
              { icon: '📱', text: '+62 812-3456-7890' },
              { icon: '📍', text: 'Jl. Malioboro No. 1, Yogyakarta 55213' },
              { icon: '🕐', text: 'Senin–Jumat, 09:00–17:00 WIB' },
            ].map((c, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } },
              React.createElement('span', { style: { fontSize: '16px', marginTop: '1px' } }, c.icon),
              React.createElement('span', { style: { color: '#6b9c7e', fontSize: '14px', lineHeight: 1.5 } }, c.text)
            ))
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { style: { color: '#a8f5c4', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '16px' } }, 'NEWSLETTER'),
          React.createElement('p', { style: { color: '#6b9c7e', fontSize: '14px', marginBottom: '14px', lineHeight: 1.6 } }, 'Dapatkan update terbaru tentang bank sampah dan program GenHi.'),
          React.createElement('div', { style: { display: 'flex', gap: '8px' } },
            React.createElement('input', { type: 'email', placeholder: 'Email kamu…', style: { flex: 1, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none', minWidth: 0 } }),
            React.createElement('button', { style: { background: '#3fc96d', color: '#0a1f0f', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' } }, 'Subscribe')
          )
        )
      ),
      React.createElement('div', { style: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' } },
        React.createElement('p', { style: { color: '#3d5c48', fontSize: '13px', margin: 0 } }, '© 2026 GenHi — Gerakan Hijau Indonesia. All rights reserved.'),
        React.createElement('p', { style: { color: '#3d5c48', fontSize: '13px', margin: 0 } }, 'Made with 🌿 for Yogyakarta')
      )
    )
  );
}

Object.assign(window, { ArticlesSection, RegisterSection, Footer });
