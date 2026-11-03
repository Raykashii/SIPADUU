import React, { useState } from 'react';
import type { ActiveRole, Mahasiswa, ParentAccessToken, TokenAccessLog, Ukt, Nilai } from '../types/sipadu';
import {
  mockMahasiswaList,
  mockNilai,
  mockJadwal,
  mockUktList,
  mockParentTokens,
  mockTokenLogs,
  mockUsers,
} from '../data/mockData';
import { Header } from '../components/common/Header';
import { MahasiswaDashboard } from '../components/mahasiswa/MahasiswaDashboard';
import { OrangTuaDashboard } from '../components/orangtua/OrangTuaDashboard';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const Dashboard: React.FC = () => {
  // Global Active Role state (Mahasiswa, Orang Tua, Admin)
  const [currentRole, setCurrentRole] = useState<ActiveRole>('mahasiswa');

  // Selected Mahasiswa Target
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa>(mockMahasiswaList[0]);

  // Reactive Mock State (Simulating Laravel Database)
  const [mahasiswaList] = useState<Mahasiswa[]>(mockMahasiswaList);
  const [tokens, setTokens] = useState<ParentAccessToken[]>(mockParentTokens);
  const [tokenLogs, setTokenLogs] = useState<TokenAccessLog[]>(mockTokenLogs);
  const [nilaiList] = useState<Nilai[]>(mockNilai);
  const [uktList, setUktList] = useState<Ukt[]>(mockUktList);

  // Generate Token Handler (FR-01, UC-03, SD-03a)
  const handleGenerateToken = (mahasiswaId: number): string => {
    const targetMhs = mahasiswaList.find((m) => m.id === mahasiswaId) || mahasiswaList[0];
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const tokenString = `TOKEN-PARENT-${targetMhs.nama.split(' ')[0].toUpperCase()}-2026-${randomHex}`;

    // Deactivate previous active tokens for this student
    const updatedTokens = tokens.map((t) =>
      t.mahasiswa_id === mahasiswaId ? { ...t, is_active: false, revoked_at: new Date().toISOString().replace('T', ' ').substring(0, 19) } : t
    );

    const newToken: ParentAccessToken = {
      id: Date.now(),
      mahasiswa_id: mahasiswaId,
      mahasiswa: targetMhs,
      created_by: 1, // Admin
      token: tokenString,
      is_active: true,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setTokens([newToken, ...updatedTokens]);

    // Record audit log
    const newLog: TokenAccessLog = {
      id: Date.now(),
      token_id: newToken.id,
      token_preview: tokenString.substring(0, 18) + '...',
      ip_address: '182.253.14.88',
      user_agent: navigator.userAgent,
      status: 'success',
      accessed_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setTokenLogs([newLog, ...tokenLogs]);

    return tokenString;
  };

  // Revoke Token Handler (FR-01, UC-03, SD-03b)
  const handleRevokeToken = (tokenId: number) => {
    setTokens((prev) =>
      prev.map((t) =>
        t.id === tokenId
          ? { ...t, is_active: false, revoked_at: new Date().toISOString().replace('T', ' ').substring(0, 19) }
          : t
      )
    );
  };

  // Update UKT Status (FR-10, UC-06)
  const handleUpdateUktStatus = (uktId: number, newStatus: 'lunas' | 'cicilan' | 'belum_bayar') => {
    setUktList((prev) =>
      prev.map((u) =>
        u.id === uktId
          ? {
              ...u,
              status: newStatus,
              tanggal_bayar: newStatus === 'lunas' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : u
      )
    );
  };

  // Switch to Parent View with specific student
  const handleSwitchToParentView = (mhs: Mahasiswa) => {
    setSelectedMahasiswa(mhs);
    setCurrentRole('orang_tua');
  };

  // Filter student-specific data
  const currentStudentNilai = nilaiList.filter((n) => n.mahasiswa_id === selectedMahasiswa.id);
  const currentStudentUkt = uktList.filter((u) => u.mahasiswa_id === selectedMahasiswa.id);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header with Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedMahasiswa={selectedMahasiswa}
        allMahasiswa={mahasiswaList}
        onMahasiswaChange={setSelectedMahasiswa}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentRole === 'mahasiswa' && (
          <MahasiswaDashboard
            mahasiswa={selectedMahasiswa}
            nilaiList={currentStudentNilai.length > 0 ? currentStudentNilai : mockNilai}
            jadwalList={mockJadwal}
            uktList={currentStudentUkt.length > 0 ? currentStudentUkt : mockUktList}
          />
        )}

        {currentRole === 'orang_tua' && (
          <OrangTuaDashboard
            mahasiswa={selectedMahasiswa}
            nilaiList={currentStudentNilai.length > 0 ? currentStudentNilai : mockNilai}
            uktList={currentStudentUkt.length > 0 ? currentStudentUkt : mockUktList}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            mahasiswaList={mahasiswaList}
            tokens={tokens}
            tokenLogs={tokenLogs}
            nilaiList={nilaiList}
            uktList={uktList}
            userList={mockUsers}
            onGenerateToken={handleGenerateToken}
            onRevokeToken={handleRevokeToken}
            onUpdateUktStatus={handleUpdateUktStatus}
            onSwitchToParentView={handleSwitchToParentView}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            SIPADU (Sistem Pantau Akademik Terpadu) • Implementasi FR-08
          </p>
          <p>
            Mata Kuliah Rekayasa Perangkat Lunak • UIN Syarif Hidayatullah Jakarta 2026
          </p>
          <p className="text-[11px] text-slate-400">
            Tim Pengembang: Rasya Vikran Annadief (1251420108), Rizki Mubarok (1251420042), Rasha Arrazi (1251420043), Rayhan Akmal Wibowo (1251420047)
          </p>
        </div>
      </footer>
    </div>
  );
};
