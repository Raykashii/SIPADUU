// ENT-01: Users
export interface User {
  id: number;
  username: string; // NIM atau Admin username
  role: 'admin' | 'mahasiswa';
  created_at: string;
}

// ENT-02: Prodi
export interface Prodi {
  id: number;
  kode: string;
  nama: string;
}

// ENT-03: Dosen
export interface Dosen {
  id: number;
  nidn: string;
  nama: string;
}

// ENT-04: Ruang
export interface Ruang {
  id: number;
  kode_ruang: string;
  gedung: string;
  kapasitas: number;
}

// ENT-05: Mata Kuliah
export interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
}

// ENT-06: Mahasiswa
export interface Mahasiswa {
  id: number;
  user_id?: number;
  prodi_id: number;
  nim: string;
  nama: string;
  angkatan: number;
  status: 'aktif' | 'cuti' | 'lulus' | 'nonaktif';
  dosen_pa?: string;
  foto?: string;
}

// ENT-07: Jadwal
export interface Jadwal {
  id: number;
  mata_kuliah_id: number;
  mata_kuliah?: MataKuliah;
  dosen_id: number;
  dosen?: Dosen;
  ruang_id: number;
  ruang?: Ruang;
  tahun_ajaran: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  jam_mulai: string;
  jam_selesai: string;
}

// ENT-08: Nilai
export interface Nilai {
  id: number;
  mahasiswa_id: number;
  mata_kuliah_id: number;
  mata_kuliah?: MataKuliah;
  semester: number;
  tahun_ajaran: string;
  nilai_angka: number;
  nilai_huruf: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E';
  bobot: number;
}

// ENT-09: Kehadiran
export interface Kehadiran {
  id: number;
  mahasiswa_id: number;
  jadwal_id: number;
  mata_kuliah_nama?: string;
  tanggal: string;
  pertemuan_ke: number;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
}

// ENT-10: UKT
export interface Ukt {
  id: number;
  mahasiswa_id: number;
  semester: number;
  tahun_ajaran: string;
  jumlah: number;
  status: 'lunas' | 'cicilan' | 'belum_bayar';
  jatuh_tempo: string;
  tanggal_bayar?: string;
  metode_pembayaran?: string;
}

// ENT-11: Parent Access Tokens
export interface ParentAccessToken {
  id: number;
  mahasiswa_id: number;
  mahasiswa?: Mahasiswa;
  created_by: number;
  token: string;
  is_active: boolean;
  created_at: string;
  revoked_at?: string;
  last_used_at?: string;
}

// ENT-12: Token Access Logs
export interface TokenAccessLog {
  id: number;
  token_id: number;
  token_preview: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'invalid' | 'expired' | 'revoked';
  accessed_at: string;
}

export type ActiveRole = 'mahasiswa' | 'orang_tua' | 'admin';
