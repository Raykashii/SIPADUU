import React from 'react';
import { UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AttendanceSummaryProps {
  totalPertemuan: number;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  persentase: number;
  perMataKuliah: Array<{
    nama_mk: string;
    hadir: number;
    total: number;
    persentase: number;
  }>;
}

export const AttendanceDonut: React.FC<{ data: AttendanceSummaryProps }> = ({ data }) => {
  const isSafe = data.persentase >= 75;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Statistik Kehadiran Kuliah</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              isSafe ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {isSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {isSafe ? 'Memenuhi Syarat UAS (>75%)' : 'Rentan Kurang Kehadiran'}
          </span>
        </div>

        {/* Ring & Overview */}
        <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl mb-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray={`${data.persentase}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-bold text-slate-800">{data.persentase}%</span>
              <span className="block text-[9px] uppercase font-semibold text-slate-400">Kehadiran</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Hadir</span>
              <p className="text-base font-bold text-emerald-600">{data.hadir} <span className="text-[11px] font-normal text-slate-400">sesi</span></p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Izin</span>
              <p className="text-base font-bold text-blue-600">{data.izin} <span className="text-[11px] font-normal text-slate-400">sesi</span></p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Sakit</span>
              <p className="text-base font-bold text-amber-600">{data.sakit} <span className="text-[11px] font-normal text-slate-400">sesi</span></p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Alfa</span>
              <p className="text-base font-bold text-rose-600">{data.alfa} <span className="text-[11px] font-normal text-slate-400">sesi</span></p>
            </div>
          </div>
        </div>

        {/* Per-Mata Kuliah Breakdown */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            Rincian Kehadiran Per Mata Kuliah
          </h4>
          <div className="space-y-2.5">
            {data.perMataKuliah.map((mk, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700 truncate max-w-[240px]">{mk.nama_mk}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{mk.hadir}/{mk.total} Sesi</span>
                    <span className={`font-semibold ${mk.persentase >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mk.persentase}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mk.persentase >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${mk.persentase}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        Batas minimal kehadiran untuk mengikuti Ujian Akhir Semester adalah 75% dari total pertemuan.
      </p>
    </div>
  );
};
