import React, { useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  CreditCard,
  HeartHandshake,
  Lock,
  Info,
} from 'lucide-react';
import type { Mahasiswa, Nilai, Ukt } from '../../types/sipadu';
import { MetricCard } from '../common/MetricCard';
import { IpkTrendChart } from '../charts/IpkTrendChart';
import { mockSemesterGpa, mockKehadiranSummary } from '../../data/mockData';

interface OrangTuaDashboardProps {
  mahasiswa: Mahasiswa;
  nilaiList: Nilai[];
  uktList: Ukt[];
}

export const OrangTuaDashboard: React.FC<OrangTuaDashboardProps> = ({
  mahasiswa,
  nilaiList,
  uktList,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(4);

  // Filter semester grades
  const semesterGrades = nilaiList.filter((n) => n.semester === selectedSemester);
  const totalSks = semesterGrades.reduce((sum, n) => sum + (n.mata_kuliah?.sks || 0), 0);
  const totalMutu = semesterGrades.reduce((sum, n) => sum + (n.bobot * (n.mata_kuliah?.sks || 0)), 0);
  const ips = totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : '0.00';

  const latestUkt = uktList.find((u) => u.semester === 4) || uktList[0];

  return (
    <div className="space-y-6">
      {/* Official Parent Token Access Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Portal Pantau Orang Tua / Wali
                </span>
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Akses Token (Read-Only)
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Pemantauan Studi: {mahasiswa.nama}
              </h2>
              <p className="text-xs text-emerald-100/80 mt-1">
                NIM: <strong className="text-white font-mono">{mahasiswa.nim}</strong> • Program Studi S1 Teknik Informatika • Semester 4
              </p>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-right w-full md:w-auto">
            <div className="flex items-center justify-start md:justify-end gap-1.5 text-emerald-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Token Akses Resmi Aktif</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">Mode Baca Saja (Tanpa Akun & Password)</p>
          </div>
        </div>

        {/* Notice Bar for Parents */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-100/90">
          <Info className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>
            Halaman ini khusus disediakan bagi orang tua untuk memantau kemajuan nilai, kehadiran kelas, dan pelunasan UKT mahasiswa secara transparan.
          </span>
        </div>
      </div>

      {/* 4 Summary Cards specifically worded for parents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Indeks Prestasi (IPK)"
          value="3.82"
          subtitle="Kategori: Sangat Memuaskan (Cum Laude)"
          colorTheme="indigo"
          badge={{ text: 'Sangat Baik', variant: 'success' }}
          icon={<GraduationCap className="w-6 h-6" />}
        />

        <MetricCard
          title="Total SKS Diselesaikan"
          value="78 SKS"
          subtitle="Kemajuan studi berjalan normal"
          colorTheme="blue"
          badge={{ text: 'Lancar', variant: 'info' }}
          icon={<BookOpen className="w-6 h-6" />}
        />

        <MetricCard
          title="Kehadiran di Kelas"
          value={`${mockKehadiranSummary.persentase}%`}
          subtitle={`${mockKehadiranSummary.hadir} dari 56 sesi (0 Alfa)`}
          colorTheme="emerald"
          badge={{ text: 'Disiplin', variant: 'success' }}
          icon={<CheckCircle2 className="w-6 h-6" />}
        />

        <MetricCard
          title="Status UKT Mahasiswa"
          value="LUNAS"
          subtitle="Semester 4 telah terbayar"
          colorTheme="amber"
          badge={{ text: 'Aman', variant: 'success' }}
          icon={<CreditCard className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid for Parents: Charts & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Progress */}
        <div className="space-y-4">
          <IpkTrendChart data={mockSemesterGpa} />
        </div>

        {/* Attendance Monitoring */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-800">Catatan Kehadiran Perkuliahan</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Tingkat Kehadiran: {mockKehadiranSummary.persentase}%
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Rekapitulasi absensi mahasiswa selama perkuliahan semester berjalan:
            </p>

            <div className="grid grid-cols-4 gap-3 text-center mb-5">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs text-slate-500 font-medium block">Hadir</span>
                <span className="text-xl font-bold text-emerald-600">{mockKehadiranSummary.hadir}</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-xs text-slate-500 font-medium block">Izin</span>
                <span className="text-xl font-bold text-blue-600">{mockKehadiranSummary.izin}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs text-slate-500 font-medium block">Sakit</span>
                <span className="text-xl font-bold text-amber-600">{mockKehadiranSummary.sakit}</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <span className="text-xs text-slate-500 font-medium block">Alfa</span>
                <span className="text-xl font-bold text-rose-600">{mockKehadiranSummary.alfa}</span>
              </div>
            </div>

            {/* Attendance bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Kehadiran Tiap Mata Kuliah:
              </h4>
              {mockKehadiranSummary.perMataKuliah.map((mk, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-800">{mk.nama_mk}</span>
                    <span className="font-semibold text-emerald-700">{mk.persentase}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${mk.persentase}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-xs text-emerald-800">
            ✓ <strong>Keterangan untuk Orang Tua:</strong> Mahasiswa memiliki catatan disiplin yang sangat baik dan memenuhi syarat batas absensi kampus (minimal 75%).
          </div>
        </div>
      </div>

      {/* Rincian Nilai Semester & Status Tagihan UKT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transkrip Nilai Ringkas */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800">Rincian Nilai Mata Kuliah (FR-03, FR-04)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Nilai akademik resmi yang diperoleh mahasiswa per semester</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Pilih Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer"
              >
                <option value={4}>Semester 4 (2025/2026)</option>
                <option value={3}>Semester 3 (2025/2026)</option>
                <option value={2}>Semester 2 (2024/2025)</option>
                <option value={1}>Semester 1 (2024/2025)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Nama Mata Kuliah</th>
                  <th className="py-2.5 px-3 text-center">Beban SKS</th>
                  <th className="py-2.5 px-3 text-center">Nilai Angka</th>
                  <th className="py-2.5 px-3 text-center">Predikat</th>
                  <th className="py-2.5 px-3 text-center">Mutu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {semesterGrades.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-500">{n.mata_kuliah?.kode_mk}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{n.mata_kuliah?.nama_mk}</td>
                    <td className="py-2.5 px-3 text-center">{n.mata_kuliah?.sks} SKS</td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold">{n.nilai_angka}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {n.nilai_huruf}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {(n.bobot * (n.mata_kuliah?.sks || 0)).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-slate-800 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-right">Rangkuman Semester:</td>
                  <td className="py-2.5 px-3 text-center text-blue-600 font-bold">{totalSks} SKS</td>
                  <td colSpan={2} className="py-2.5 px-3 text-right">IPS Semester:</td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 text-sm font-mono">{ips}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Status UKT untuk Orang Tua */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-slate-800">Status Pembayaran UKT</h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Konfirmasi status tagihan uang kuliah semester aktif dari bagian keuangan fakultas:
            </p>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">Semester 4 (Berjalan)</span>
                <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  LUNAS
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-950 mt-2">
                Rp {latestUkt.jumlah.toLocaleString('id-ID')}
              </p>
              <div className="mt-2 text-xs text-emerald-800 space-y-1">
                <p>✓ Tanggal Bayar: <strong>{latestUkt.tanggal_bayar}</strong></p>
                <p>✓ Metode: <strong>{latestUkt.metode_pembayaran}</strong></p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Riwayat Sem 1:</span>
                <span className="text-emerald-600 font-semibold">LUNAS</span>
              </div>
              <div className="flex justify-between">
                <span>Riwayat Sem 2:</span>
                <span className="text-emerald-600 font-semibold">LUNAS</span>
              </div>
              <div className="flex justify-between">
                <span>Riwayat Sem 3:</span>
                <span className="text-emerald-600 font-semibold">LUNAS</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            * Tidak ada tunggakan keuangan pada semester berjalan.
          </div>
        </div>
      </div>
    </div>
  );
};
