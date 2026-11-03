import React, { useState } from 'react';
import { TrendingUp, Award } from 'lucide-react';

interface SemesterGpa {
  semester: string;
  ips: number;
  ipk: number;
  sks: number;
}

interface IpkTrendChartProps {
  data: SemesterGpa[];
}

export const IpkTrendChart: React.FC<IpkTrendChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const minGpa = 3.0;
  const maxGpa = 4.0;
  const chartHeight = 180;
  const chartWidth = 520;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index * (chartWidth - 2 * paddingX)) / (data.length - 1 || 1);
  };

  const getY = (val: number) => {
    const clamped = Math.max(minGpa, Math.min(maxGpa, val));
    return chartHeight - paddingY - ((clamped - minGpa) / (maxGpa - minGpa)) * (chartHeight - 2 * paddingY);
  };

  const ipkPoints = data.map((d, i) => `${getX(i)},${getY(d.ipk)}`).join(' ');
  const ipsPoints = data.map((d, i) => `${getX(i)},${getY(d.ips)}`).join(' ');

  // Create area gradient path for IPK
  const areaPoints = `${getX(0)},${chartHeight - paddingY} ` +
    data.map((d, i) => `${getX(i)},${getY(d.ipk)}`).join(' ') +
    ` ${getX(data.length - 1)},${chartHeight - paddingY}`;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Grafik Perkembangan IPK & IPS</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Tren prestasi akademik mahasiswa dari semester ke semester (FR-09)</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
            <span className="text-slate-700">IPK (Kumulatif)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-700">IPS (Semester)</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 select-none">
          <defs>
            <linearGradient id="ipkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[3.0, 3.25, 3.5, 3.75, 4.0].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                  strokeDasharray={level === 3.5 ? '4 3' : undefined}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {level.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Area fill under IPK */}
          <polygon points={areaPoints} fill="url(#ipkGradient)" />

          {/* IPS Line (Emerald) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 3"
            points={ipsPoints}
          />

          {/* IPK Line (Indigo) */}
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={ipkPoints}
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const yIpk = getY(d.ipk);
            const yIps = getY(d.ips);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Vertical hover indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* IPS Point */}
                <circle
                  cx={x}
                  cy={yIps}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* IPK Point */}
                <circle
                  cx={x}
                  cy={yIpk}
                  r={isHovered ? 6.5 : 5}
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all shadow-md"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Semester labels */}
                <text
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold ${isHovered ? 'fill-indigo-600' : 'fill-slate-600'}`}
                >
                  {d.semester}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip/preview if hovered */}
        <div className="mt-3 grid grid-cols-4 gap-2 pt-3 border-t border-slate-100">
          {data.map((d, i) => (
            <div
              key={i}
              className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                hoveredIndex === i ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100/70'
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-xs font-semibold text-slate-700 block">{d.semester}</span>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-xs">
                <span className="text-indigo-600 font-bold">{d.ipk.toFixed(2)}</span>
                <span className="text-slate-300">/</span>
                <span className="text-emerald-600 font-medium">{d.ips.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{d.sks} SKS</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Status Predikat Terakhir: <strong className="text-slate-800">Dengan Pujian (Cum Laude)</strong></span>
        </div>
        <span>Target Kelulusan: 144 SKS</span>
      </div>
    </div>
  );
};
