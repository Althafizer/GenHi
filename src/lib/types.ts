export type Kecamatan =
  | 'Gedongtengen' | 'Jetis' | 'Gondokusuman' | 'Danurejan'
  | 'Pakualaman' | 'Gondomanan' | 'Ngampilan' | 'Wirobrajan'
  | 'Mantrijeron' | 'Kraton' | 'Mergangsan' | 'Umbulharjo'
  | 'Kotagede' | 'Tegalrejo' | 'Depok';

export type Spesialisasi =
  | 'Plastik' | 'Kertas' | 'Kardus' | 'Logam' | 'Botol Kaca'
  | 'Elektronik' | 'Baterai' | 'Minyak Jelantah' | 'Tekstil' | 'Organik';

export interface BankSampah {
  id: string;
  user_id: string | null;
  nama: string;
  slug: string;
  alamat: string;
  kecamatan: Kecamatan;
  spesialisasi: Spesialisasi[];
  jam: string | null;
  buka: boolean;
  wa: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  rating: number;
  reviews: number;
  lat: number | null;
  lng: number | null;
  foto_url: string | null;
  galeri: string[];
  deskripsi: string | null;
  aktif: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Artikel {
  id: string;
  bank_sampah_id: string | null;
  user_id: string | null;
  judul: string;
  slug: string;
  konten: string | null;
  excerpt: string | null;
  thumbnail_url: string | null;
  tag: string | null;
  penulis: string;
  read_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  bank_sampah?: Pick<BankSampah, 'nama' | 'slug'>;
}

export interface JurnalPenimbangan {
  id: string;
  bank_sampah_id: string;
  tanggal: string;
  nama_nasabah: string | null;
  jenis_sampah: string | null;
  berat_kg: number;
  harga_per_kg: number;
  total: number;
  catatan: string | null;
  created_at: string;
}

export interface GlobalStats {
  total_bank_aktif: number;
  total_kecamatan: number;
  total_sampah_kg: number;
  total_nasabah: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'bank_sampah' | 'nasabah';
  created_at: string;
}

export interface NasabahProfile {
  id: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
}

export interface Saldo {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface QrToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}
