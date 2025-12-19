'use client';

import { MingPan, DiZhi, PalaceInfo } from '@/types';
import { DI_ZHI } from '@/lib/constants';

interface MingPanChartProps {
  mingPan: MingPan;
}

// 命盤のグリッド配置（時計回りで宮を配置）
const GRID_POSITIONS: Record<DiZhi, { row: number; col: number }> = {
  '巳': { row: 0, col: 0 },
  '午': { row: 0, col: 1 },
  '未': { row: 0, col: 2 },
  '申': { row: 0, col: 3 },
  '辰': { row: 1, col: 0 },
  '酉': { row: 1, col: 3 },
  '卯': { row: 2, col: 0 },
  '戌': { row: 2, col: 3 },
  '寅': { row: 3, col: 0 },
  '丑': { row: 3, col: 1 },
  '子': { row: 3, col: 2 },
  '亥': { row: 3, col: 3 },
};

// 金運関連の宮
const FORTUNE_PALACES = ['財帛宮', '官禄宮', '田宅宮', '福徳宮'];

export default function MingPanChart({ mingPan }: MingPanChartProps) {
  const renderPalace = (zhi: DiZhi) => {
    const palace = mingPan.palaces[zhi];
    const isHighlight = FORTUNE_PALACES.includes(palace.name);
    const isMingGong = palace.isMingGong;
    const isShenGong = palace.isShenGong;

    let cellClass = 'palace-cell';
    if (isMingGong) cellClass += ' ming-gong';
    else if (isHighlight) cellClass += ' highlight';

    return (
      <div key={zhi} className={cellClass}>
        {/* 宮位名 */}
        <div className="text-[10px] text-[#A0A0C0] mb-1">
          {palace.name}
          {isMingGong && <span className="text-purple-400">★</span>}
          {isShenGong && <span className="text-cyan-400">☆</span>}
        </div>

        {/* 地支 */}
        <div className="text-[10px] text-yellow-500 mb-1">{zhi}</div>

        {/* 主星 */}
        <div className="flex flex-wrap justify-center gap-1">
          {palace.mainStars.map((star, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1 py-0.5 bg-purple-900/50 rounded text-purple-200"
            >
              {star}
            </span>
          ))}
        </div>

        {/* 四化 */}
        {palace.siHua.length > 0 && (
          <div className="flex gap-1 mt-1">
            {palace.siHua.map((sihua, idx) => (
              <span
                key={idx}
                className={`text-[9px] px-1 rounded ${
                  sihua === '化禄' ? 'text-green-400' :
                  sihua === '化権' ? 'text-blue-400' :
                  sihua === '化科' ? 'text-cyan-400' :
                  'text-red-400'
                }`}
              >
                {sihua.replace('化', '')}
              </span>
            ))}
          </div>
        )}

        {/* 副星（一部のみ表示） */}
        <div className="flex flex-wrap justify-center gap-0.5 mt-1">
          {palace.auxiliaryStars.slice(0, 3).map((star, idx) => (
            <span
              key={idx}
              className="text-[8px] text-[#A0A0C0]"
            >
              {star}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // グリッドを構築
  const grid: (DiZhi | null)[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  DI_ZHI.forEach((zhi) => {
    const pos = GRID_POSITIONS[zhi];
    grid[pos.row][pos.col] = zhi;
  });

  return (
    <div className="fortune-card p-4 md:p-6">
      <h3 className="text-xl font-bold text-center mb-4 gradient-text">
        命盤図
      </h3>

      {/* 基本情報 */}
      <div className="flex justify-center gap-4 mb-4 text-sm text-[#A0A0C0]">
        <span>五行局: <span className="text-yellow-500">{mingPan.wuXingJu}</span></span>
        <span>年干支: <span className="text-purple-400">{mingPan.yearGanZhi.gan}{mingPan.yearGanZhi.zhi}</span></span>
      </div>

      <div className="flex justify-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-purple-500/30 border border-purple-500 rounded"></span>
          命宮
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded"></span>
          金運関連宮
        </span>
      </div>

      {/* 命盤グリッド */}
      <div className="mingpan-grid max-w-xl mx-auto">
        {grid.flat().map((zhi, idx) => {
          if (zhi) {
            return renderPalace(zhi);
          }
          // 中央の空白部分
          return (
            <div
              key={idx}
              className="flex items-center justify-center bg-transparent"
            >
              {idx === 5 && (
                <div className="text-center">
                  <div className="text-xs text-[#A0A0C0]">命主</div>
                  <div className="text-lg gold-text font-bold">{mingPan.yearGanZhi.gan}{mingPan.yearGanZhi.zhi}年生</div>
                  <div className="text-xs text-[#A0A0C0] mt-1">
                    農暦 {mingPan.lunarDate.month}月{mingPan.lunarDate.day}日
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
