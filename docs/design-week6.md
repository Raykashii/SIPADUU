## Kondisi gagal
Jika data transkrip tidak tersedia, sistem tidak menampilkan data kosong seolah-olah mahasiswa tidak memiliki nilai. Sistem menampilkan pesan bahwa data belum tersedia dan pengguna dapat mencoba kembali setelah data diperbarui.

## Keputusan Desain dan Alasan
1) Memisahkan Frontend dan Backend
Keputusan: menggunakan React + Vite + Tailwind CSS sebagai frontend dan Laravel sebagai backend.
Alasan: pemisahan ini membuat antarmuka dan logika bisnis memiliki tanggung jawab yang lebih jelas. Perubahan tampilan dapat dilakukan tanpa harus mengubah seluruh logika pengelolaan data di backend.
