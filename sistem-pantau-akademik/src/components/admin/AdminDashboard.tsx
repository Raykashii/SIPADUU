import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  Database,
  Plus,
  Trash2,
  Copy,
  Check,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import type { Mahasiswa, ParentAccessToken, TokenAccessLog, Nilai, Ukt, User } from '../../types/sipadu';
import { MetricCard } from '../common/MetricCard';

interface AdminDashboardProps {
  mahasiswaList: Mahasiswa[];
  tokens: ParentAccessToken[];
  tokenLogs: TokenAccessLog[];
  nilaiList: Nilai[];
  uktList: Ukt[];
  userList: User[];
  onGenerateToken: (mahasiswaId: number) => string;
  onRevokeToken: (tokenId: number) => void;
  onUpdateUktStatus: (uktId: number, newStatus: 'lunas' | 'cicilan' | 'belum_bayar') => void;
  onSwitchToParentView: (mahasiswa: Mahasiswa) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  mahasiswaList,
  tokens,
  tokenLogs,
  nilaiList,
  uktList,
  userList,
  onGenerateToken,
  onRevokeToken,
  onUpdateUktStatus,
  onSwitchToParentView,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'logs' | 'akademik' | 'users'>('tokens');

  // Generate Token Modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedMhsId, setSelectedMhsId] = useState<number>(mahasiswaList[0]?.id || 1);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Stats calculation
  const activeTokensCount = tokens.filter((t) => t.is_active).length;
  const lunasUktCount = uktList.filter((u) => u.status === 'lunas').length;

  const handleGenerate = () => {
    const newToken = onGenerateToken(selectedMhsId);
    setGeneratedResult(newToken);
    setCopied(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Admin Faculty Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Fakultas
                </span>
                <span className="text-xs text-slate-400">Teknik Informatika • FST UIN Jakarta</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Panel Manajemen & Pengawasan SIPADU
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Kelola hak akses token orang tua (FR-01), pemantauan log keamanan (FR-02), dan data akademik mahasiswa (FR-10).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowGenerateModal(true);
              setGeneratedResult(null);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Token Orang Tua
          </button>
        </div>
      </div>

      {/* Admin Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Token Akses Aktif (FR-01)"
          value={`${activeTokensCount} Token`}
          subtitle={`Dari total ${tokens.length} token diterbitkan`}
          colorTheme="purple"
          badge={{ text: 'Terkendali', variant: 'info' }}
          icon={<KeyRound className="w-6 h-6" />}
        />

        <MetricCard
          title="Total Mahasiswa Aktif"
          value={`${mahasiswaList.length} Mahasiswa`}
          subtitle="Teknik Informatika Angkatan 2024"
          colorTheme="blue"
          badge={{ text: '100% Aktif', variant: 'success' }}
          icon={<Users className="w-6 h-6" />}
        />

        <MetricCard
          title="Log Keamanan Akses (FR-02)"
          value={`${tokenLogs.length} Percobaan`}
          subtitle="Audit log tercatat di pangkalan data"
          colorTheme="amber"
          badge={{ text: 'Dipantau', variant: 'warning' }}
          icon={<Activity className="w-6 h-6" />}
        />

        <MetricCard
          title="Kelunasan UKT Mahasiswa"
          value={`${Math.round((lunasUktCount / uktList.length) * 100)}%`}
          subtitle={`${lunasUktCount} dari ${uktList.length} tagihan lunas`}
          colorTheme="emerald"
          badge={{ text: 'Normal', variant: 'success' }}
          icon={<CreditCard className="w-6 h-6" />}
        />
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 rounded-t-xl px-4 pt-2">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: 'tokens', label: 'Manajemen Token Orang Tua (FR-01)', icon: KeyRound },
            { id: 'logs', label: 'Log Percobaan Akses (FR-02 / UC-10)', icon: Activity },
            { id: 'akademik', label: 'Kelola Data Akademik & UKT (FR-10)', icon: Database },
            { id: 'users', label: 'Kelola Akun Pengguna (FR-11)', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-purple-600 text-purple-700 font-semibold'
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

      {/* Tab: Token Management (FR-01, UC-03) */}
      {activeTab === 'tokens' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Daftar Token Akses Orang Tua (ENT-11)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Token akses unik yang dibuat admin untuk orang tua melihat nilai, kehadiran, dan status UKT mahasiswa tanpa akun.
              </p>
            </div>

            <button
              onClick={() => {
                setShowGenerateModal(true);
                setGeneratedResult(null);
              }}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate Token Baru
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mahasiswa Terkait</th>
                  <th className="py-3 px-4">Token Akses (Hash / String)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Dibuat Pada</th>
                  <th className="py-3 px-4">Terakhir Digunakan</th>
                  <th className="py-3 px-4 text-center">Aksi (FR-01)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tokens.map((tok) => {
                  const mhs = mahasiswaList.find((m) => m.id === tok.mahasiswa_id) || tok.mahasiswa;
                  return (
                    <tr key={tok.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{mhs?.nama || 'Mahasiswa #' + tok.mahasiswa_id}</div>
                        <div className="text-[11px] text-slate-500 font-mono">NIM: {mhs?.nim}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 max-w-xs truncate">
                        {tok.token}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {tok.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <XCircle className="w-3 h-3" /> DICABUT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{tok.created_at}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{tok.last_used_at || 'Belum pernah'}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {tok.is_active && (
                            <button
                              onClick={() => {
                                if (confirm(`Cabut (Revoke) token akses orang tua untuk ${mhs?.nama}? Orang tua tidak akan bisa lagi mengakses data menggunakan token ini.`)) {
                                  onRevokeToken(tok.id);
                                }
                              }}
                              className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Revoke / Cabut Token"
                            >
                              <Trash2 className="w-3 h-3" />
                              Revoke
                            </button>
                          )}
                          {mhs && (
                            <button
                              onClick={() => onSwitchToParentView(mhs)}
                              className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Uji Tampilan Orang Tua"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Pratinjau
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Token Access Logs (FR-02, ENT-12) */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Log Percobaan Akses Token (ENT-12)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit riwayat seluruh upaya verifikasi token oleh Orang Tua / luar sistem guna mendeteksi ancaman brute-force (FR-02)
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Rate Limit Proteksi: Maksimal 5x Percobaan Gagal / IP
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu Percobaan</th>
                  <th className="py-3 px-4">Alamat IP</th>
                  <th className="py-3 px-4">Token Digunakan</th>
                  <th className="py-3 px-4">User Agent / Perangkat</th>
                  <th className="py-3 px-4 text-center">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tokenLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-slate-600">{log.accessed_at}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">{log.ip_address}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{log.token_preview}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.user_agent}>
                      {log.user_agent}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {log.status === 'success' && (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                          SUCCESS (200)
                        </span>
                      )}
                      {log.status === 'revoked' && (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[10px]">
                          REVOKED TOKEN (401)
                        </span>
                      )}
                      {log.status === 'invalid' && (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 text-[10px]">
                          INVALID / BLOCKED (401)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Academic & UKT Management (FR-10) */}
      {activeTab === 'akademik' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-8">
          {/* Section 1: UKT */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kelola Status Pembayaran UKT (FR-10, ENT-10)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin fakultas dapat memperbarui status tagihan UKT (efeknya langsung tercermin di dashboard mahasiswa dan orang tua)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Mahasiswa</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4 text-center">Status Pembayaran</th>
                    <th className="py-3 px-4 text-center">Ubah Status Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {uktList.map((item) => {
                    const mhs = mahasiswaList.find((m) => m.id === item.mahasiswa_id);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{mhs?.nama}</span>
                          <span className="text-[11px] text-slate-500 font-mono">NIM: {mhs?.nim}</span>
                        </td>
                        <td className="py-3 px-4 font-medium">Semester {item.semester} ({item.tahun_ajaran})</td>
                        <td className="py-3 px-4 font-mono font-semibold">Rp {item.jumlah.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-4 text-slate-500">{item.jatuh_tempo}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                              item.status === 'lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.status}
                            onChange={(e) => onUpdateUktStatus(item.id, e.target.value as any)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700 cursor-pointer"
                          >
                            <option value="lunas">Lunas</option>
                            <option value="cicilan">Cicilan</option>
                            <option value="belum_bayar">Belum Bayar</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Nilai Overview (FR-10, ENT-08) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Ringkasan Data Nilai Akademik Terinput (ENT-08)</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Daftar rekapan nilai mahasiswa yang siap dipantau orang tua dan mahasiswa</p>
              </div>
              <span className="text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-full">
                Total {nilaiList.length} Nilai Tercatat
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Mahasiswa ID</th>
                    <th className="py-2.5 px-3">Mata Kuliah</th>
                    <th className="py-2.5 px-3 text-center">Semester</th>
                    <th className="py-2.5 px-3 text-center">Nilai Angka</th>
                    <th className="py-2.5 px-3 text-center">Nilai Huruf</th>
                    <th className="py-2.5 px-3 text-center">Bobot SKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {nilaiList.slice(0, 6).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-500">Mhs #{item.mahasiswa_id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.mata_kuliah?.nama_mk}</td>
                      <td className="py-2.5 px-3 text-center">Sem {item.semester}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold">{item.nilai_angka}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {item.nilai_huruf}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{item.bobot.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: User Management (FR-11) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manajemen Akun Pengguna (FR-11, ENT-01)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar akun login mahasiswa dan staf administrator fakultas</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Username / Kredensial</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4 text-center">Role Akses</th>
                  <th className="py-3 px-4">Tanggal Pendaftaran</th>
                  <th className="py-3 px-4 text-center">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userList.map((usr) => {
                  const mhs = mahasiswaList.find((m) => m.nim === usr.username);
                  return (
                    <tr key={usr.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono text-slate-400">{usr.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{usr.username}</td>
                      <td className="py-3 px-4 font-medium">{usr.role === 'admin' ? 'Staf Akademik FST' : mhs?.nama}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            usr.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{usr.created_at}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full font-bold text-emerald-700 bg-emerald-50 text-[10px]">
                          AKTIF
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Generate Token Baru (FR-01, UC-03) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Generate Token Orang Tua Baru</h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Sesuai skenario <strong>UC-03</strong> dan <strong>SD-03a</strong>, token ini akan menghubungkan orang tua dengan data akademik mahasiswa terkait secara read-only.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Mahasiswa Target (ENT-06):
              </label>
              <select
                value={selectedMhsId}
                onChange={(e) => setSelectedMhsId(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 cursor-pointer"
              >
                {mahasiswaList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} (NIM: {m.nim})
                  </option>
                ))}
              </select>
            </div>

            {generatedResult ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Token Berhasil Dibuat! (Hanya tampil satu kali)
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-emerald-100 font-mono text-xs text-slate-800 break-all select-all">
                  {generatedResult}
                </div>

                <button
                  onClick={() => copyToClipboard(generatedResult)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Tautan Token Berhasil Disalin!' : 'Salin Token Akses'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                Buat Token Sekarang
              </button>
            )}

            <div className="pt-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
