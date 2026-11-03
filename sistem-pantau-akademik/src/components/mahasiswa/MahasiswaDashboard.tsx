import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Filter,
  Layers,
  MapPin,
  User,
} from 'lucide-react';
import type { Mahasiswa, Nilai, Jadwal, Ukt } from '../../types/sipadu';
import { MetricCard } from '../common/MetricCard';
import { IpkTrendChart } from '../charts/IpkTrendChart';
import { AttendanceDonut } from '../charts/AttendanceDonut';
import { mockSemesterGpa, mockKehadiranSummary } from '../../data/mockData';

interface MahasiswaDashboardProps {
  mahasiswa: Mahasiswa;
  nilaiList: Nilai[];
  jadwalList: Jadwal[];
  uktList: Ukt[];
}

export const MahasiswaDashboard: React.FC<MahasiswaDashboardProps> = ({
  mahasiswa,
  nilaiList,
  jadwalList,
  uktList,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'nilai' | 'jadwal' | 'presensi' | 'ukt'>('ringkasan');
  const [selectedSemester, setSelectedSemester] = useState<number | 'semua'>('semua');

  // Filtered grades
  const filteredNilai = selectedSemester === 'semua'
    ? nilaiList
    : nilaiList.filter((n) => n.semester === selectedSemester);

  // Compute total SKS & IPS for filtered table
  const totalSksFiltered = filteredNilai.reduce((acc, curr) => acc + (curr.mata_kuliah?.sks || 0), 0);
  const totalMutu = filteredNilai.reduce((acc, curr) => acc + (curr.bobot * (curr.mata_kuliah?.sks || 0)), 0);
  const calculatedIps = totalSksFiltered > 0 ? (totalMutu / totalSksFiltered).toFixed(2) : '0.00';

  // Latest UKT
  const latestUkt = uktList.find((u) => u.semester === 4) || uktList[0];

  return (
    <div className="space-y-6">
      {/* Student Profile Identity Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {mahasiswa.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{mahasiswa.nama}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {mahasiswa.status.toUpperCase()}
                </span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Semester 4
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                NIM: <span className="font-mono font-medium text-white">{mahasiswa.nim}</span> • Teknik Informatika (S1)
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Dosen PA: {mahasiswa.dosen_pa}
                </span>
                <span>•</span>
                <span>Angkatan: {mahasiswa.angkatan}</span>
                <span>•</span>
                <span>Tahun Akademik: 2025/2026 Genap</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-right hidden md:block">
            <p className="text-xs text-slate-300 font-medium">Jalur Akses Terautentikasi</p>
            <p className="text-sm font-bold text-white">Akun Mahasiswa</p>
            <p className="text-[11px] text-emerald-300">● Sesi Aktif Terverifikasi</p>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="IPK Kumulatif (FR-09)"
          value="3.82"
          subtitle="IPS Semester Terakhir: 3.94"
          colorTheme="indigo"
          badge={{ text: 'Cum Laude', variant: 'success' }}
          icon={<GraduationCap className="w-6 h-6" />}
        />

        <MetricCard
          title="Total SKS Diambil (FR-05)"
          value="78 SKS"
          subtitle="Target Kelulusan: 144 SKS (54%)"
          colorTheme="blue"
          badge={{ text: 'On Track', variant: 'info' }}
          icon={<BookOpen className="w-6 h-6" />}
        />

        <MetricCard
          title="Tingkat Presensi (UC-08)"
          value={`${mockKehadiranSummary.persentase}%`}
          subtitle="52 Hadir dari 56 Pertemuan"
          colorTheme="emerald"
          badge={{ text: 'Aman UAS', variant: 'success' }}
          icon={<CheckCircle2 className="w-6 h-6" />}
        />

        <MetricCard
          title="Status UKT Sem 4 (FR-06)"
          value="LUNAS"
          subtitle={`Rp ${latestUkt.jumlah.toLocaleString('id-ID')}`}
          colorTheme="amber"
          badge={{ text: 'Terverifikasi', variant: 'success' }}
          icon={<CreditCard className="w-6 h-6" />}
        />
      </div>

      {/* Navigation Tabs (FR-08: Penyatuan Dasbor Terpadu) */}
      <div className="bg-white border-b border-slate-200 rounded-t-xl px-4 pt-2">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: 'ringkasan', label: 'Ringkasan Terpadu (UC-11)', icon: Layers },
            { id: 'nilai', label: 'Nilai & Transkrip (FR-04)', icon: BookOpen },
            { id: 'jadwal', label: 'Jadwal Kuliah (FR-07)', icon: Calendar },
            { id: 'presensi', label: 'Presensi (UC-08)', icon: CheckCircle2 },
            { id: 'ukt', label: 'Status UKT (FR-06)', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* Main Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IpkTrendChart data={mockSemesterGpa} />
            <AttendanceDonut data={mockKehadiranSummary} />
          </div>

          {/* Quick Schedule & UKT Status in Ringkasan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Schedule */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800">Jadwal Kuliah Semester Ini (FR-07)</h3>
                </div>
                <button
                  onClick={() => setActiveTab('jadwal')}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Lihat Selengkapnya →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {jadwalList.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center bg-blue-50 text-blue-700 py-1.5 rounded-lg border border-blue-100 font-medium">
                        <span className="text-xs font-bold block">{item.hari}</span>
                        <span className="text-[10px] text-blue-500 block">{item.jam_mulai}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{item.mata_kuliah?.nama_mk}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.ruang?.kode_ruang} ({item.ruang?.gedung})
                          </span>
                          <span>•</span>
                          <span>{item.dosen?.nama}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md shrink-0">
                      {item.mata_kuliah?.sks} SKS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick UKT Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-slate-800">Status Pembayaran UKT</h3>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-800">Semester 4 (Aktif)</span>
                    <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                      LUNAS
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900 mt-2">
                    Rp {latestUkt.jumlah.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Dibayar pada: {latestUkt.tanggal_bayar} via {latestUkt.metode_pembayaran}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Kelompok Tarif:</span>
                    <strong className="text-slate-800">Grade 5 (Reguler)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Virtual Account:</span>
                    <span className="font-mono text-slate-800">9881251420108000</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('ukt')}
                className="w-full mt-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                Riwayat Pembayaran Lengkap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nilai & Transkrip Tab */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Transkrip Nilai Akademik (FR-04)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar nilai hasil studi resmi yang tercatat di pangkalan data akademik</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value === 'semua' ? 'semua' : Number(e.target.value))}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 cursor-pointer"
                >
                  <option value="semua">Semua Semester</option>
                  <option value={4}>Semester 4 (Genap 2025/2026)</option>
                  <option value={3}>Semester 3 (Ganjil 2025/2026)</option>
                  <option value={2}>Semester 2 (Genap 2024/2025)</option>
                  <option value={1}>Semester 1 (Ganjil 2024/2025)</option>
                </select>
              </div>

              <button
                onClick={() => alert('Fitur unduh transkrip resmi (PDF) telah siap dipanggil.')}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh KHS
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Kode MK</th>
                  <th className="py-3 px-4">Nama Mata Kuliah</th>
                  <th className="py-3 px-4 text-center">Semester</th>
                  <th className="py-3 px-4 text-center">SKS</th>
                  <th className="py-3 px-4 text-center">Nilai Angka</th>
                  <th className="py-3 px-4 text-center">Nilai Huruf</th>
                  <th className="py-3 px-4 text-center">Bobot</th>
                  <th className="py-3 px-4 text-center">Mutu (SKS x Bobot)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {filteredNilai.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">{item.mata_kuliah?.kode_mk}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.mata_kuliah?.nama_mk}</td>
                    <td className="py-3 px-4 text-center font-medium">Sem {item.semester}</td>
                    <td className="py-3 px-4 text-center font-semibold">{item.mata_kuliah?.sks}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{item.nilai_angka}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 font-bold rounded-md bg-emerald-100 text-emerald-800">
                        {item.nilai_huruf}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{item.bobot.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                      {(item.bobot * (item.mata_kuliah?.sks || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-xs text-slate-800 border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-right">Total SKS / IPS:</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">{totalSksFiltered} SKS</td>
                  <td colSpan={3} className="py-3 px-4 text-right">Rata-Rata IPS:</td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-700 font-mono text-sm">{calculatedIps}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Jadwal Kuliah Tab */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Jadwal Kuliah Mingguan (FR-07)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tahun Akademik 2025/2026 Genap • Kampus FST UIN Syarif Hidayatullah Jakarta</p>
            </div>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {jadwalList.length} Mata Kuliah Terjadwal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jadwalList.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-md">
                    {item.hari}
                  </span>
                  <span className="text-xs font-mono text-slate-600 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.jam_mulai} - {item.jam_selesai} WIB
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-2">{item.mata_kuliah?.nama_mk}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{item.mata_kuliah?.kode_mk} • {item.mata_kuliah?.sks} SKS</p>

                <div className="mt-4 pt-3 border-t border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.ruang?.kode_ruang} ({item.ruang?.gedung})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.dosen?.nama}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presensi Tab */}
      {activeTab === 'presensi' && (
        <div className="space-y-6">
          <AttendanceDonut data={mockKehadiranSummary} />
        </div>
      )}

      {/* UKT Tab */}
      {activeTab === 'ukt' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Riwayat Pembayaran UKT (FR-06)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Status pelunasan Uang Kuliah Tunggal dari semester awal hingga berjalan</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Tahun Ajaran</th>
                  <th className="py-3 px-4">Jumlah Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4">Tanggal Pembayaran</th>
                  <th className="py-3 px-4">Kanal Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {uktList.map((ukt) => (
                  <tr key={ukt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">Semester {ukt.semester}</td>
                    <td className="py-3.5 px-4">{ukt.tahun_ajaran}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      Rp {ukt.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase text-[11px]">
                        {ukt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{ukt.jatuh_tempo}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-700">{ukt.tanggal_bayar || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{ukt.metode_pembayaran || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
