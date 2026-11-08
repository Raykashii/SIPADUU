# SIPADU - Sistem Pantau Akademik Terpadu
**Implementasi Kebutuhan Fungsional FR-08 (Role-Based Dashboard)**

Proyek ini merupakan implementasi frontend berbasis web untuk aplikasi **SIPADU (Sistem Pantau Akademik Terpadu)** menggunakan **React**, **Vite**, **TypeScript**, dan **Tailwind CSS**. Implementasi ini berfokus pada pemenuhan kebutuhan fungsional **FR-08**, yaitu penyajian antarmuka dashboard terpadu yang disesuaikan secara spesifik berdasarkan tiga peran pengguna (*role*): **Mahasiswa**, **Orang Tua**, dan **Admin Fakultas**.

---

## 1. Identifikasi FR & Keterkaitan dengan Dokumen Rancangan

### 1.1 Deskripsi Kebutuhan
* **ID Kebutuhan**: `FR-08`
* **Nama Kebutuhan**: Tampilan dashboard disesuaikan dengan role (Admin dan User: Orang Tua & Mahasiswa).
* **Alasan Prioritas**: Lapisan UI/UX terpadu yang menyatukan seluruh turunan data akademik (`FR-01` s/d `FR-07`) agar pengguna dapat memantau data tanpa harus berpindah-pindah halaman (*single dashboard experience*).

### 1.2 Matriks Keterlacakan (Traceability Matrix)
Sesuai dengan dokumen *Software Requirement Specification* (SRS) Bab 4, 5, 6, dan 7:

| Elemen Rancangan | Referensi Label | Keterkaitan dalam Implementasi FR-08 |
| :--- | :--- | :--- |
| **Use Case (UC)** | `UC-01`, `UC-11` | • `UC-01` (Login): Membedakan akses Mahasiswa dan Admin.<br>• `UC-11` (Melihat Dashboard Akademik): Menampilkan ringkasan terpadu IPK, total SKS, jadwal kuliah, kehadiran, dan status UKT. |
| **Activity Diagram (AD)** | `AD-01`, `AD-11` | Alur inisialisasi sesi peran dan pemanggilan data akademik secara paralel (*forking-joining*) untuk mengisi kartu metrik dan grafik. |
| **Sequence Diagram (SD)** | `SD-01`, `SD-11` | Pertukaran pesan antara Frontend React, otentikasi role, dan visualisasi komponen layar. |
| **Entitas Basis Data (ENT)** | `ENT-01`, `ENT-06`, `ENT-08`, `ENT-09`, `ENT-10`, `ENT-11`, `ENT-12` | Merepresentasikan data pengguna (`users`), profil (`mahasiswa`), transkrip (`nilai`), absensi (`kehadiran`), keuangan (`ukt`), token orang tua (`parent_access_tokens`), serta log audit (`token_access_logs`). |

---

## 2. Karakteristik Dashboard Berdasarkan Role

1. **Dashboard Mahasiswa (Student View)**:
   * **Profil Akademik**: NIM, Nama, Semester, Program Studi, Dosen Pembimbing Akademik, dan Status Keaktifan.
   * **4 Kartu Metrik Utama**: IPK Kumulatif (3.82), Total SKS (78 SKS), Tingkat Presensi (92.8%), Status UKT (LUNAS).
   * **Visualisasi Grafik (FR-09)**: Grafik tren perkembangan IPK & IPS antar-semester.
   * **Tab Terpadu**: Transkrip Nilai & KHS (FR-04, FR-05), Jadwal Kuliah Mingguan (FR-07), Presensi Perkuliahan (UC-08), dan Riwayat Tagihan UKT (FR-06).

2. **Dashboard Orang Tua (Parent View - Token Based Read-Only)**:
   * **Akses Tanpa Akun (FR-03, UC-02)**: Masuk cukup dengan token akses unik yang terverifikasi.
   * **Strictly Read-Only (Hanya Baca)**: Antarmuka bersih, kontras tinggi, bebas tombol modifikasi, dirancang ramah bagi orang tua/pengguna non-teknis pada layar mobile maupun desktop (NFR-01, NFR-02).
   * **Fokus Informasi**: Pemantauan IPK anak, grafik kemajuan studi, rekap absensi kelas (Hadir, Sakit, Izin, Alfa), dan transparansi pelunasan UKT semester berjalan.

3. **Dashboard Admin Fakultas (Administrator View)**:
   * **Manajemen Token Orang Tua (FR-01, UC-03)**: Fitur *Generate Token Baru* (tampil 1x dengan tombol salin tautan) dan fitur *Revoke Token* (mencabut token aktif seketika).
   * **Log Percobaan Akses (FR-02, UC-10)**: Audit trail pencatatan IP, user agent, dan status validasi percobaan token untuk pencegahan brute force.
   * **Kelola Data Akademik & UKT (FR-10, UC-06)**: Panel pengubahan status pembayaran UKT mahasiswa yang langsung berefek reaktif ke dashboard mahasiswa/orang tua.
   * **Manajemen Akun Pengguna (FR-11, UC-09)**: Daftar akun login mahasiswa dan staf admin.

4. **Quick Demo Switcher Bar**:
   * Bar interaktif di bagian paling atas layar yang memungkinkan penguji/dosen berpindah role secara instan (1 klik) serta mengganti mahasiswa target saat demonstrasi.

---

## 3. Code Review & Refactoring

Berikut adalah dokumentasi hasil code review bersama terhadap komponen dashboard yang telah dibangun, mencakup identifikasi masalah dan hasil perbaikan (*before–after*):

### Temuan 1: Optimasi Kalkulasi Agregat Nilai dan SKS Menggunakan Memoization
* **Bagian Kode**: [`src/components/mahasiswa/MahasiswaDashboard.tsx`](file:///C:/laragon/www/SIPADU/SIPADUU/sistem-pantau-akademik/src/components/mahasiswa/MahasiswaDashboard.tsx)
* **Masalah**: 
  Penghitungan agregat `totalSksFiltered`, `totalMutu`, dan `calculatedIps` dieksekusi secara imperatif langsung di tubuh fungsi render komponen tanpa `useMemo`. Setiap kali komponen me-render ulang (misalnya saat navigasi tab atau toggle UI), fungsi `reduce` dijalankan kembali meskipun data `filteredNilai` tidak mengalami perubahan.
* **Perbaikan**: 
  Membungkus kalkulasi agregasi ke dalam hook `useMemo` sehingga perhitungan hanya dievaluasi ulang saat data `filteredNilai` berubah.

```tsx
// BEFORE:
const totalSksFiltered = filteredNilai.reduce((acc, curr) => acc + (curr.mata_kuliah?.sks || 0), 0);
const totalMutu = filteredNilai.reduce((acc, curr) => acc + (curr.bobot * (curr.mata_kuliah?.sks || 0)), 0);
const calculatedIps = totalSksFiltered > 0 ? (totalMutu / totalSksFiltered).toFixed(2) : '0.00';

// AFTER:
const { totalSksFiltered, calculatedIps } = useMemo(() => {
  const totalSks = filteredNilai.reduce((acc, curr) => acc + (curr.mata_kuliah?.sks || 0), 0);
  const totalMutu = filteredNilai.reduce((acc, curr) => acc + (curr.bobot * (curr.mata_kuliah?.sks || 0)), 0);
  return {
    totalSksFiltered: totalSks,
    calculatedIps: totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : '0.00',
  };
}, [filteredNilai]);
```

---

### Temuan 2: Isolasi Data Mahasiswa Terpilih dan Penghapusan Fallback Tidak Aman
* **Bagian Kode**: [`src/pages/Dashboard.tsx`](file:///C:/laragon/www/SIPADU/SIPADUU/sistem-pantau-akademik/src/pages/Dashboard.tsx)
* **Masalah**:
  Pengiriman props menggunakan ternary fallback `nilaiList={currentStudentNilai.length > 0 ? currentStudentNilai : mockNilai}` berpotensi menampilkan data nilai milik mahasiswa lain jika mahasiswa yang dipilih adalah mahasiswa baru yang belum memiliki nilai. Hal ini melanggar prinsip integritas dan isolasi data per mahasiswa.
* **Perbaikan**:
  Menghilangkan fallback silang dan mengelompokkan filtering data mahasiswa ke dalam memoized accessor agar data yang diteruskan murni milik mahasiswa yang sedang aktif/dipilih.

```tsx
// BEFORE:
<MahasiswaDashboard
  mahasiswa={selectedMahasiswa}
  nilaiList={currentStudentNilai.length > 0 ? currentStudentNilai : mockNilai}
  jadwalList={mockJadwal}
  uktList={currentStudentUkt.length > 0 ? currentStudentUkt : mockUktList}
/>

// AFTER:
const activeStudentNilai = useMemo(
  () => nilaiList.filter((n) => n.mahasiswa_id === selectedMahasiswa.id),
  [nilaiList, selectedMahasiswa.id]
);
const activeStudentUkt = useMemo(
  () => uktList.filter((u) => u.mahasiswa_id === selectedMahasiswa.id),
  [uktList, selectedMahasiswa.id]
);

<MahasiswaDashboard
  mahasiswa={selectedMahasiswa}
  nilaiList={activeStudentNilai}
  jadwalList={mockJadwal}
  uktList={activeStudentUkt}
/>
```

---

### Temuan 3: Aksesibilitas (a11y) dan Semantik Form pada Dialog Modal Admin
* **Bagian Kode**: [`src/components/admin/AdminDashboard.tsx`](file:///C:/laragon/www/SIPADU/SIPADUU/sistem-pantau-akademik/src/components/admin/AdminDashboard.tsx)
* **Masalah**:
  Tombol penutup modal hanya berisi karakter simbol `✕` tanpa atribut `aria-label`, sehingga pembaca layar (*screen reader*) tidak dapat mengidentifikasi fungsi tombol. Elemen `<label>` juga belum terhubung dengan elemen `<select>` melalui atribut `htmlFor` dan `id`.
* **Perbaikan**:
  Menambahkan semantik standar aksesibilitas web dengan atribut `aria-label`, `type="button"`, serta menghubungkan pasangan `htmlFor` dan `id`.

```tsx
// BEFORE:
<button
  onClick={() => setShowGenerateModal(false)}
  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
>
  ✕
</button>
<label className="block text-xs font-semibold text-slate-700 mb-1">
  Pilih Mahasiswa Target (ENT-06):
</label>
<select
  value={selectedMhsId}
  onChange={(e) => setSelectedMhsId(Number(e.target.value))}
  className="..."
>

// AFTER:
<button
  type="button"
  onClick={() => setShowGenerateModal(false)}
  aria-label="Tutup modal pembuatan token"
  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer p-1 rounded-md"
>
  ✕
</button>
<label htmlFor="target-mhs-select" className="block text-xs font-semibold text-slate-700 mb-1">
  Pilih Mahasiswa Target (ENT-06):
</label>
<select
  id="target-mhs-select"
  value={selectedMhsId}
  onChange={(e) => setSelectedMhsId(Number(e.target.value))}
  className="..."
>
```

---

## 4. Tabel Hasil Pengujian (Testing)

Pengujian dilakukan untuk memastikan fungsionalitas antarmuka dashboard sesuai dengan skenario Use Case yang dirancang pada SRS.

| No | Kebutuhan / FR | Langkah Pengujian (Steps) | Hasil yang Diharapkan (Expected Result) | Hasil Pengamatan (Actual Result) | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | **FR-08 (Mahasiswa)** | 1. Buka dashboard pada role default (Mahasiswa).<br>2. Periksa kartu profil, 4 metrik, dan tab-tab akademik. | Menampilkan ringkasan terpadu profil mahasiswa, IPK, SKS, presensi, jadwal, dan status UKT. | Seluruh data profil, 4 kartu ringkasan, dan tab navigasi tampil lengkap dan terpadu. | [x] Sesuai |
| 2 | **FR-08 (Orang Tua)** | 1. Klik tombol **Orang Tua (Token)** pada bar atas.<br>2. Periksa informasi dan elemen kontrol. | Tampilan berubah ke antarmuka pemantauan *read-only* tanpa tombol tambah/ubah data. | Tampil banner token terverifikasi, grafik nilai, kehadiran, dan UKT tanpa tombol aksi manipulasi. | [x] Sesuai |
| 3 | **FR-08 (Admin)** | 1. Klik tombol **Admin Fakultas** pada bar atas.<br>2. Navigasi ke tab Token, Log, Akademik, dan Users. | Menampilkan panel administratif lengkap untuk pengelolaan token, audit log, dan data UKT. | Tab manajemen token, tabel log akses, form ubah status UKT, dan daftar pengguna tampil dengan baik. | [x] Sesuai |
| 4 | **FR-01 (Generate/Revoke)** | 1. Pada Admin, klik **Generate Token Baru**.<br>2. Pilih mahasiswa lalu buat token.<br>3. Klik tombol **Revoke** pada token aktif. | Token acak 64-karakter terbuat dan dapat disalin; saat di-revoke, status berubah menjadi "DICABUT". | Token baru berhasil di-generate beserta tombol salin; status token lama berhasil berganti ke "DICABUT". | [x] Sesuai |
| 5 | **FR-06 & FR-10 (Reaktivitas UKT)** | 1. Di tab Admin Akademik, ubah status UKT mahasiswa dari "Lunas" ke "Belum Bayar".<br>2. Pindah role ke Mahasiswa / Orang Tua. | Perubahan status tagihan langsung ter-update secara reaktif di dashboard Mahasiswa dan Orang Tua. | Status UKT di dashboard Mahasiswa dan Orang Tua langsung menampilkan status "Belum Bayar" secara real-time. | [x] Sesuai |
| 6 | **FR-04 & FR-09 (Transkrip & Grafik)** | 1. Buka tab Nilai & Transkrip pada Mahasiswa.<br>2. Ubah dropdown semester ke Semester 3 atau Semua. | Grafik merender titik nilai IPK/IPS; tabel KHS memfilter mata kuliah dan menghitung IPS secara otomatis. | Grafik SVG menampilkan tren semester dengan jelas; tabel KHS memperbarui SKS dan rata-rata IPS secara akurat. | [x] Sesuai |

---

## 5. Cara Menjalankan Aplikasi

Pastikan Node.js sudah terpasang, kemudian jalankan langkah berikut di terminal:

```powershell
# 1. Masuk ke direktori aplikasi frontend
cd sistem-pantau-akademik

# 2. Jalankan server pengembang Vite
npm run dev
```

Buka peramban (browser) di alamat:
👉 **`http://localhost:5173`**
