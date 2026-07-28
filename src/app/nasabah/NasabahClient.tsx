'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { createClient } from '@/lib/supabase/client';
import type { NasabahProfile, Saldo, QrToken, BankSampah } from '@/lib/types';
import { FiSmartphone, FiMapPin, FiSearch, FiClipboard } from 'react-icons/fi';

type NearbyBank = Pick<BankSampah, 'id' | 'nama' | 'slug' | 'alamat' | 'kecamatan' | 'buka' | 'lat' | 'lng' | 'spesialisasi' | 'jam' | 'wa'> & { distance: number };

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function randomToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function secondsUntil(isoDate: string): number {
  return Math.max(0, Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000));
}

export default function NasabahClient({
  user,
  profile,
  saldo,
}: {
  user: any;
  profile: NasabahProfile | null;
  saldo: Saldo | null;
}) {
  const router = useRouter();
  const [activeToken, setActiveToken] = useState<QrToken | null>(null);
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentSaldo] = useState(saldo?.balance ?? 0);

  // Nearby bank state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyBanks, setNearbyBanks] = useState<NearbyBank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [radius, setRadius] = useState<number>(5);

  // Restore active token from DB on mount (if still valid)
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('qr_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setActiveToken(data);
          setCountdown(secondsUntil(data.expires_at));
        }
      });
  }, [user.id]);

  // Countdown timer
  useEffect(() => {
    if (!activeToken) return;
    if (countdown <= 0) { setActiveToken(null); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, activeToken]);

  const generateQR = async () => {
    setGenerating(true);
    const supabase = createClient();
    const token = randomToken();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('qr_tokens')
      .insert({ user_id: user.id, token, expires_at: expiresAt })
      .select()
      .single();

    if (!error && data) {
      setActiveToken(data);
      setCountdown(300);
    }
    setGenerating(false);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser kamu tidak mendukung geolokasi.');
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError('Izin lokasi ditolak. Aktifkan lokasi di pengaturan browser.');
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!userCoords) return;
    setBanksLoading(true);
    const supabase = createClient();
    supabase
      .from('bank_sampah')
      .select('id, nama, slug, alamat, kecamatan, buka, lat, lng, spesialisasi, jam, wa')
      .eq('aktif', true)
      .eq('verified', true)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .then(({ data }) => {
        if (!data) { setBanksLoading(false); return; }
        const withDistance: NearbyBank[] = (data as NearbyBank[])
          .map(b => ({ ...b, distance: haversineKm(userCoords.lat, userCoords.lng, b.lat!, b.lng!) }))
          .filter(b => b.distance <= radius)
          .sort((a, b) => a.distance - b.distance);
        setNearbyBanks(withDistance);
        setBanksLoading(false);
      });
  }, [userCoords, radius]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const countdownColor = countdown > 60 ? 'text-green-400' : countdown > 30 ? 'text-amber-400' : 'text-red-400';
  const countdownBg = countdown > 60 ? 'bg-green-500' : countdown > 30 ? 'bg-amber-500' : 'bg-red-500';
  const progressPercent = (countdown / 300) * 100;

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header */}
      <header className="bg-green-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white font-black font-serif">G</div>
          <div>
            <div className="font-black text-white text-sm font-serif">Dashboard Nasabah</div>
            <div className="text-green-400 text-xs">{profile?.full_name || user.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-xs text-white/40 hover:text-red-400 transition-colors font-semibold">Keluar</button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-5">

        {/* Saldo Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
          <div className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">Saldo Aktif</div>
          <div className="text-4xl font-black font-serif mt-1">{formatRupiah(currentSaldo)}</div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              {profile?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="text-sm font-semibold">{profile?.full_name}</div>
              <div className="text-green-200 text-xs">{profile?.phone_number || user.email}</div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-black font-serif">QR Code Setor Sampah</h2>
              <p className="text-white/40 text-xs mt-0.5">Tunjukkan QR ini ke scanner mesin deposit</p>
            </div>
            {activeToken && (
              <span className={`text-xs font-black tabular-nums ${countdownColor}`}>
                {Math.floor(countdown / 60).toString().padStart(2, '0')}:{(countdown % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>

          {activeToken ? (
            <div className="flex flex-col items-center gap-4">
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${countdownBg}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <QRCode
                  value={activeToken.token}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#14532d"
                />
              </div>

              <div className="text-center">
                <p className="text-white/40 text-xs">QR Code berlaku selama 5 menit</p>
                <p className="text-white/20 text-[10px] mt-1 font-mono break-all">{activeToken.token.slice(0, 16)}…</p>
              </div>

              <button
                onClick={generateQR}
                disabled={generating}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/[8%] text-white/50 hover:bg-white/[12%] hover:text-white/70 border border-white/10 transition-all">
                Buat QR Baru
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-24 h-24 rounded-2xl bg-white/[8%] border-2 border-dashed border-white/20 flex items-center justify-center">
                <FiSmartphone className="w-10 h-10 text-white/40" />
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm font-semibold">Belum ada QR Code aktif</p>
                <p className="text-white/30 text-xs mt-1">Klik tombol di bawah untuk membuat QR Code baru</p>
              </div>
              <button
                onClick={generateQR}
                disabled={generating}
                className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/25">
                {generating ? 'Membuat QR Code…' : 'Buat QR Code'}
              </button>
            </div>
          )}
        </div>

        {/* Cari Bank Sampah Terdekat */}
        <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-black font-serif">Bank Sampah Terdekat</h2>
              <p className="text-white/40 text-xs mt-0.5">Temukan bank sampah di sekitar lokasimu</p>
            </div>
            {userCoords && (
              <div className="flex gap-1">
                {[1, 3, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${radius === r ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            )}
          </div>

          {!userCoords ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[8%] border-2 border-dashed border-white/20 flex items-center justify-center">
                <FiMapPin className="w-7 h-7 text-white/40" />
              </div>
              {locationError && (
                <p className="text-red-400 text-xs text-center">{locationError}</p>
              )}
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/25"
              >
                {locationLoading ? 'Mendeteksi lokasi…' : 'Izinkan Akses Lokasi'}
              </button>
            </div>
          ) : banksLoading ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
              <p className="text-white/40 text-xs">Mencari bank sampah terdekat…</p>
            </div>
          ) : nearbyBanks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center gap-2">
              <FiSearch className="w-8 h-8 text-white/30" />
              <p className="text-white/40 text-sm">Tidak ada bank sampah dalam radius {radius} km</p>
              <p className="text-white/20 text-xs">Coba perbesar radius pencarian</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs">{nearbyBanks.length} bank ditemukan dalam radius {radius} km</p>
              {nearbyBanks.map(bank => (
                <div key={bank.id} className="bg-white/[6%] border border-white/[8%] rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm truncate">{bank.nama}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${bank.buka ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {bank.buka ? 'Buka' : 'Tutup'}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5 truncate">{bank.alamat}</p>
                      {bank.jam && <p className="text-white/30 text-[10px]">{bank.jam}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-green-400 font-black text-sm">{formatDistance(bank.distance)}</div>
                      <div className="text-white/30 text-[10px]">{bank.kecamatan}</div>
                    </div>
                  </div>
                  {bank.spesialisasi.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bank.spesialisasi.map(s => (
                        <span key={s} className="text-[10px] bg-white/[8%] text-white/50 px-1.5 py-0.5 rounded-md">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <a
                      href={`/bank-sampah/${bank.slug}`}
                      className="flex-1 py-2 text-xs font-bold text-center bg-white/[8%] hover:bg-white/[14%] text-white/70 rounded-lg transition-all"
                    >
                      Lihat Detail
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-xs font-bold text-center bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                    >
                      Petunjuk Arah
                    </a>
                    {bank.wa && (
                      <a
                        href={`https://wa.me/${bank.wa.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 text-xs font-bold bg-white/[8%] hover:bg-white/[14%] text-white/50 rounded-lg transition-all"
                      >
                        WA
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Riwayat placeholder */}
        <div className="bg-white/[7%] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-black font-serif mb-4">Riwayat Transaksi</h2>
          <div className="flex flex-col items-center py-8 text-center">
            <FiClipboard className="w-10 h-10 mx-auto mb-3 text-white/30" />
            <p className="text-white/40 text-sm">Belum ada riwayat transaksi</p>
            <p className="text-white/20 text-xs mt-1">Transaksi deposit akan muncul di sini</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white/[4%] border border-white/[8%] rounded-2xl p-4">
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Cara Setor Sampah</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { step: '1', text: 'Buat QR Code di halaman ini' },
              { step: '2', text: 'Datangi mesin deposit GenHi terdekat' },
              { step: '3', text: 'Tunjukkan QR Code ke scanner mesin' },
              { step: '4', text: 'Masukkan sampah plastik ke mesin' },
              { step: '5', text: 'Saldo otomatis masuk ke akunmu' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-black flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <span className="text-white/50 text-xs">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
