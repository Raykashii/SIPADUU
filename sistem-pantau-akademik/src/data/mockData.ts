import type {
  Mahasiswa,
  Prodi,
  Dosen,
  Ruang,
  MataKuliah,
  Jadwal,
  Nilai,
  Ukt,
  ParentAccessToken,
  TokenAccessLog,
  User,
} from '../types/sipadu';

export const mockUsers: User[] = [
  { id: 1, username: 'admin', role: 'admin', created_at: '2024-01-15 08:00:00' },
  { id: 2, username: '1251420108', role: 'mahasiswa', created_at: '2024-08-20 09:30:00' },
  { id: 3, username: '1251420042', role: 'mahasiswa', created_at: '2024-08-20 09:31:00' },
  { id: 4, username: '1251420043', role: 'mahasiswa', created_at: '2024-08-20 09:32:00' },
  { id: 5, username: '1251420047', role: 'mahasiswa', created_at: '2024-08-20 09:33:00' },
];

export const mockProdi: Prodi[] = [
  { id: 1, kode: 'TIF', nama: 'Teknik Informatika' },
  { id: 2, kode: 'SI', nama: 'Sistem Informasi' },
];

export const mockDosen: Dosen[] = [
  { id: 1, nidn: '0412058001', nama: 'Luh Kesuma Wardhani, S.T., M.T.' },
  { id: 2, nidn: '0418097502', nama: 'Dr. Dewi Khairani, M.Sc.' },
  { id: 3, nidn: '0422038101', nama: 'Prof. Dr. Ir. Herman, M.Kom.' },
  { id: 4, nidn: '0405108403', nama: 'Faisal Akbar, M.T., Ph.D.' },
];

export const mockRuang: Ruang[] = [
  { id: 1, kode_ruang: 'LAB-KOM-401', gedung: 'Gedung FST Lt. 4', kapasitas: 40 },
  { id: 2, kode_ruang: 'RK-302', gedung: 'Gedung FST Lt. 3', kapasitas: 50 },
  { id: 3, kode_ruang: 'RK-201', gedung: 'Gedung FST Lt. 2', kapasitas: 45 },
];

export const mockMahasiswaList: Mahasiswa[] = [
  {
    id: 1,
    user_id: 2,
    prodi_id: 1,
    nim: '1251420108',
    nama: 'Rasya Vikran Annadief',
    angkatan: 2024,
    status: 'aktif',
    dosen_pa: 'Luh Kesuma Wardhani, S.T., M.T.',
  },
  {
    id: 2,
    user_id: 3,
    prodi_id: 1,
    nim: '1251420042',
    nama: 'Rizki Mubarok',
    angkatan: 2024,
    status: 'aktif',
    dosen_pa: 'Dr. Dewi Khairani, M.Sc.',
  },
  {
    id: 3,
    user_id: 4,
    prodi_id: 1,
    nim: '1251420043',
    nama: 'Rasha Arrazi',
    angkatan: 2024,
    status: 'aktif',
    dosen_pa: 'Faisal Akbar, M.T., Ph.D.',
  },
  {
    id: 4,
    user_id: 5,
    prodi_id: 1,
    nim: '1251420047',
    nama: 'Rayhan Akmal Wibowo',
    angkatan: 2024,
    status: 'aktif',
    dosen_pa: 'Prof. Dr. Ir. Herman, M.Kom.',
  },
];

export const mockMataKuliah: MataKuliah[] = [
  { id: 1, kode_mk: 'TIF201', nama_mk: 'Rekayasa Perangkat Lunak', sks: 3 },
  { id: 2, kode_mk: 'TIF202', nama_mk: 'Basis Data Terdistribusi', sks: 3 },
  { id: 3, kode_mk: 'TIF203', nama_mk: 'Pemrograman Web Berbasis Komponen', sks: 3 },
  { id: 4, kode_mk: 'TIF204', nama_mk: 'Jaringan Komputer & Komunikasi Data', sks: 3 },
  { id: 5, kode_mk: 'TIF205', nama_mk: 'Kecerdasan Buatan & Sistem Pakar', sks: 3 },
  { id: 6, kode_mk: 'TIF206', nama_mk: 'Struktur Data & Algoritma', sks: 4 },
  { id: 7, kode_mk: 'TIF101', nama_mk: 'Algoritma & Pemrograman Dasar', sks: 4 },
  { id: 8, kode_mk: 'TIF102', nama_mk: 'Matematika Diskrit', sks: 3 },
];

export const mockNilai: Nilai[] = [
  // Semester 4 (Berjalan)
  { id: 1, mahasiswa_id: 1, mata_kuliah_id: 1, mata_kuliah: mockMataKuliah[0], semester: 4, tahun_ajaran: '2025/2026', nilai_angka: 88, nilai_huruf: 'A', bobot: 4.0 },
  { id: 2, mahasiswa_id: 1, mata_kuliah_id: 2, mata_kuliah: mockMataKuliah[1], semester: 4, tahun_ajaran: '2025/2026', nilai_angka: 85, nilai_huruf: 'A', bobot: 4.0 },
  { id: 3, mahasiswa_id: 1, mata_kuliah_id: 3, mata_kuliah: mockMataKuliah[2], semester: 4, tahun_ajaran: '2025/2026', nilai_angka: 92, nilai_huruf: 'A', bobot: 4.0 },
  { id: 4, mahasiswa_id: 1, mata_kuliah_id: 4, mata_kuliah: mockMataKuliah[3], semester: 4, tahun_ajaran: '2025/2026', nilai_angka: 82, nilai_huruf: 'A-', bobot: 3.7 },
  { id: 5, mahasiswa_id: 1, mata_kuliah_id: 5, mata_kuliah: mockMataKuliah[4], semester: 4, tahun_ajaran: '2025/2026', nilai_angka: 86, nilai_huruf: 'A', bobot: 4.0 },
  // Semester 3
  { id: 6, mahasiswa_id: 1, mata_kuliah_id: 6, mata_kuliah: mockMataKuliah[5], semester: 3, tahun_ajaran: '2025/2026', nilai_angka: 87, nilai_huruf: 'A', bobot: 4.0 },
  { id: 7, mahasiswa_id: 1, mata_kuliah_id: 2, mata_kuliah: mockMataKuliah[1], semester: 3, tahun_ajaran: '2025/2026', nilai_angka: 80, nilai_huruf: 'A-', bobot: 3.7 },
  { id: 8, mahasiswa_id: 1, mata_kuliah_id: 3, mata_kuliah: mockMataKuliah[2], semester: 3, tahun_ajaran: '2025/2026', nilai_angka: 89, nilai_huruf: 'A', bobot: 4.0 },
  // Semester 2
  { id: 9, mahasiswa_id: 1, mata_kuliah_id: 7, mata_kuliah: mockMataKuliah[6], semester: 2, tahun_ajaran: '2024/2025', nilai_angka: 84, nilai_huruf: 'A-', bobot: 3.7 },
  { id: 10, mahasiswa_id: 1, mata_kuliah_id: 8, mata_kuliah: mockMataKuliah[7], semester: 2, tahun_ajaran: '2024/2025', nilai_angka: 81, nilai_huruf: 'A-', bobot: 3.7 },
  // Semester 1
  { id: 11, mahasiswa_id: 1, mata_kuliah_id: 7, mata_kuliah: mockMataKuliah[6], semester: 1, tahun_ajaran: '2024/2025', nilai_angka: 85, nilai_huruf: 'A', bobot: 4.0 },
  { id: 12, mahasiswa_id: 1, mata_kuliah_id: 8, mata_kuliah: mockMataKuliah[7], semester: 1, tahun_ajaran: '2024/2025', nilai_angka: 78, nilai_huruf: 'B+', bobot: 3.3 },
];

export const mockJadwal: Jadwal[] = [
  {
    id: 1,
    mata_kuliah_id: 1,
    mata_kuliah: mockMataKuliah[0],
    dosen_id: 1,
    dosen: mockDosen[0],
    ruang_id: 1,
    ruang: mockRuang[0],
    tahun_ajaran: '2025/2026 Genap',
    hari: 'Senin',
    jam_mulai: '08:00',
    jam_selesai: '10:30',
  },
  {
    id: 2,
    mata_kuliah_id: 3,
    mata_kuliah: mockMataKuliah[2],
    dosen_id: 2,
    dosen: mockDosen[1],
    ruang_id: 1,
    ruang: mockRuang[0],
    tahun_ajaran: '2025/2026 Genap',
    hari: 'Senin',
    jam_mulai: '13:00',
    jam_selesai: '15:30',
  },
  {
    id: 3,
    mata_kuliah_id: 2,
    mata_kuliah: mockMataKuliah[1],
    dosen_id: 4,
    dosen: mockDosen[3],
    ruang_id: 2,
    ruang: mockRuang[1],
    tahun_ajaran: '2025/2026 Genap',
    hari: 'Selasa',
    jam_mulai: '09:30',
    jam_selesai: '12:00',
  },
  {
    id: 4,
    mata_kuliah_id: 5,
    mata_kuliah: mockMataKuliah[4],
    dosen_id: 3,
    dosen: mockDosen[2],
    ruang_id: 3,
    ruang: mockRuang[2],
    tahun_ajaran: '2025/2026 Genap',
    hari: 'Rabu',
    jam_mulai: '10:00',
    jam_selesai: '12:30',
  },
  {
    id: 5,
    mata_kuliah_id: 4,
    mata_kuliah: mockMataKuliah[3],
    dosen_id: 4,
    dosen: mockDosen[3],
    ruang_id: 2,
    ruang: mockRuang[1],
    tahun_ajaran: '2025/2026 Genap',
    hari: 'Kamis',
    jam_mulai: '13:30',
    jam_selesai: '16:00',
  },
];

export const mockKehadiranSummary = {
  totalPertemuan: 56,
  hadir: 52,
  sakit: 2,
  izin: 2,
  alfa: 0,
  persentase: 92.8,
  perMataKuliah: [
    { nama_mk: 'Rekayasa Perangkat Lunak', hadir: 11, total: 12, persentase: 91.6 },
    { nama_mk: 'Basis Data Terdistribusi', hadir: 12, total: 12, persentase: 100 },
    { nama_mk: 'Pemrograman Web Berbasis Komponen', hadir: 11, total: 11, persentase: 100 },
    { nama_mk: 'Jaringan Komputer & Komunikasi Data', hadir: 9, total: 10, persentase: 90 },
    { nama_mk: 'Kecerdasan Buatan & Sistem Pakar', hadir: 9, total: 11, persentase: 81.8 },
  ],
};

export const mockUktList: Ukt[] = [
  {
    id: 1,
    mahasiswa_id: 1,
    semester: 4,
    tahun_ajaran: '2025/2026 Genap',
    jumlah: 6500000,
    status: 'lunas',
    jatuh_tempo: '2026-02-15',
    tanggal_bayar: '2026-02-10',
    metode_pembayaran: 'Virtual Account BSI',
  },
  {
    id: 2,
    mahasiswa_id: 1,
    semester: 3,
    tahun_ajaran: '2025/2026 Ganjil',
    jumlah: 6500000,
    status: 'lunas',
    jatuh_tempo: '2025-08-15',
    tanggal_bayar: '2025-08-12',
    metode_pembayaran: 'Virtual Account Mandiri',
  },
  {
    id: 3,
    mahasiswa_id: 1,
    semester: 2,
    tahun_ajaran: '2024/2025 Genap',
    jumlah: 6500000,
    status: 'lunas',
    jatuh_tempo: '2025-02-15',
    tanggal_bayar: '2025-02-14',
    metode_pembayaran: 'Virtual Account BNI',
  },
  {
    id: 4,
    mahasiswa_id: 1,
    semester: 1,
    tahun_ajaran: '2024/2025 Ganjil',
    jumlah: 6500000,
    status: 'lunas',
    jatuh_tempo: '2024-08-20',
    tanggal_bayar: '2024-08-18',
    metode_pembayaran: 'Virtual Account BSI',
  },
];

export const mockSemesterGpa = [
  { semester: 'Sem 1', ips: 3.65, ipk: 3.65, sks: 20 },
  { semester: 'Sem 2', ips: 3.75, ipk: 3.70, sks: 21 },
  { semester: 'Sem 3', ips: 3.85, ipk: 3.76, sks: 22 },
  { semester: 'Sem 4', ips: 3.94, ipk: 3.82, sks: 19 },
];

export const mockParentTokens: ParentAccessToken[] = [
  {
    id: 1,
    mahasiswa_id: 1,
    mahasiswa: mockMahasiswaList[0],
    created_by: 1,
    token: 'TOKEN-PARENT-RASYA-2026-9f82ab71c4e0',
    is_active: true,
    created_at: '2026-01-10 10:15:00',
    last_used_at: '2026-03-02 18:45:00',
  },
  {
    id: 2,
    mahasiswa_id: 2,
    mahasiswa: mockMahasiswaList[1],
    created_by: 1,
    token: 'TOKEN-PARENT-RIZKI-2026-3d71fe92a10c',
    is_active: true,
    created_at: '2026-01-11 11:20:00',
    last_used_at: '2026-02-28 09:12:00',
  },
  {
    id: 3,
    mahasiswa_id: 3,
    mahasiswa: mockMahasiswaList[2],
    created_by: 1,
    token: 'TOKEN-PARENT-RASHA-2026-1b42cd88e990',
    is_active: false,
    created_at: '2026-01-05 14:00:00',
    revoked_at: '2026-02-01 16:30:00',
    last_used_at: '2026-01-28 20:00:00',
  },
];

export const mockTokenLogs: TokenAccessLog[] = [
  {
    id: 1,
    token_id: 1,
    token_preview: 'TOKEN-PARENT-RASYA-...',
    ip_address: '182.253.14.88',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
    status: 'success',
    accessed_at: '2026-03-02 18:45:00',
  },
  {
    id: 2,
    token_id: 1,
    token_preview: 'TOKEN-PARENT-RASYA-...',
    ip_address: '182.253.14.88',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
    status: 'success',
    accessed_at: '2026-03-01 21:10:00',
  },
  {
    id: 3,
    token_id: 3,
    token_preview: 'TOKEN-PARENT-RASHA-...',
    ip_address: '36.85.120.45',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0',
    status: 'revoked',
    accessed_at: '2026-02-15 11:05:00',
  },
  {
    id: 4,
    token_id: 99,
    token_preview: 'TOKEN-INVALID-ATTEMPT...',
    ip_address: '114.124.200.12',
    user_agent: 'python-requests/2.31.0',
    status: 'invalid',
    accessed_at: '2026-02-20 03:14:00',
  },
];
