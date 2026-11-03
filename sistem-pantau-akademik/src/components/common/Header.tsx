import React from 'react';
import { GraduationCap, ShieldCheck, Eye } from 'lucide-react';
import type { ActiveRole, Mahasiswa } from '../../types/sipadu';

interface HeaderProps {
  currentRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  selectedMahasiswa: Mahasiswa;
  allMahasiswa: Mahasiswa[];
  onMahasiswaChange: (mhs: Mahasiswa) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedMahasiswa,
  allMahasiswa,
  onMahasiswaChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Role Switcher for seamless demo */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
              FR-08 DEMO MODE
            </span>
            <span className="text-slate-300">Pilih Tampilan Role Dashboard:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => onRoleChange('mahasiswa')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'mahasiswa'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Mahasiswa
            </button>

            <button
              onClick={() => onRoleChange('orang_tua')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'orang_tua'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Orang Tua (Token)
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Fakultas
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">SIPADU</h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                UIN Jakarta
              </span>
            </div>
            <p className="text-xs text-slate-500">Sistem Pantau Akademik Terpadu • FST</p>
          </div>
        </div>

        {/* User / Monitored Profile */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {currentRole === 'admin' ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Admin Akademik FST</p>
                <p className="text-[11px] text-purple-600 font-medium">Petugas Fakultas</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {selectedMahasiswa.nama.charAt(0)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900">{selectedMahasiswa.nama}</p>
                  {currentRole === 'orang_tua' && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Anak
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  NIM: {selectedMahasiswa.nim} • Teknik Informatika
                </p>
              </div>

              {/* Student Switcher dropdown for quick testing */}
              <div className="border-l border-slate-200 pl-2 ml-1">
                <select
                  value={selectedMahasiswa.id}
                  onChange={(e) => {
                    const found = allMahasiswa.find((m) => m.id === Number(e.target.value));
                    if (found) onMahasiswaChange(found);
                  }}
                  className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  title="Ganti Mahasiswa Target"
                >
                  {allMahasiswa.map((mhs) => (
                    <option key={mhs.id} value={mhs.id}>
                      {mhs.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
