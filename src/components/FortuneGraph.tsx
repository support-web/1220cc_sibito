'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { YearlyFortune } from '@/types';

interface FortuneGraphProps {
  yearlyFortune: YearlyFortune[];
}

export default function FortuneGraph({ yearlyFortune }: FortuneGraphProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#FFD700';
    if (score >= 60) return '#4CAF50';
    if (score >= 40) return '#2196F3';
    if (score >= 20) return '#FF9800';
    return '#F44336';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="fortune-card p-4 text-sm">
          <p className="font-bold text-lg gold-text">{data.year}年</p>
          <p className="text-2xl font-bold mt-2" style={{ color: getScoreColor(data.score) }}>
            {data.score}点
          </p>
          <p className="text-gray-600 mt-2 max-w-xs">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="fortune-card p-4 md:p-6">
      <h3 className="text-xl font-bold text-center mb-6 gradient-text">
        10年間の金運グラフ
      </h3>

      {/* 凡例 */}
      <div className="flex justify-center gap-4 mb-4 text-xs flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFD700' }}></span>
          絶好調 (80+)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4CAF50' }}></span>
          好調 (60-79)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2196F3' }}></span>
          普通 (40-59)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9800' }}></span>
          注意 (20-39)
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={yearlyFortune}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.2)" />
            <XAxis
              dataKey="year"
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={60} stroke="#4CAF50" strokeDasharray="5 5" />
            <ReferenceLine y={40} stroke="#FF9800" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#D4AF37"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isCurrentYear = payload.year === currentYear;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isCurrentYear ? 8 : 5}
                    fill={getScoreColor(payload.score)}
                    stroke={isCurrentYear ? '#fff' : 'none'}
                    strokeWidth={isCurrentYear ? 2 : 0}
                  />
                );
              }}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 年別詳細 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
        {yearlyFortune.map((fortune) => (
          <div
            key={fortune.year}
            className={`p-3 rounded-lg text-center ${
              fortune.year === currentYear
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]'
                : 'bg-gray-50'
            }`}
          >
            <div className="text-sm text-gray-600">{fortune.year}年</div>
            <div
              className="text-xl font-bold"
              style={{ color: getScoreColor(fortune.score) }}
            >
              {fortune.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
