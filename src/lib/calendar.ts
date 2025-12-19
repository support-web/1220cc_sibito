// 暦変換ロジック
import { Solar, Lunar } from 'lunar-javascript';
import { TianGan, DiZhi, ShiChen } from '@/types';
import { TIAN_GAN, DI_ZHI } from './constants';

export interface LunarDateInfo {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearGan: TianGan;
  yearZhi: DiZhi;
  monthGan: TianGan;
  monthZhi: DiZhi;
}

/**
 * 新暦（グレゴリオ暦）から旧暦（農暦）に変換
 */
export function solarToLunar(year: number, month: number, day: number): LunarDateInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  // 年干支を取得
  const yearGanIndex = (lunar.getYear() - 4) % 10;
  const yearZhiIndex = (lunar.getYear() - 4) % 12;

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0, // 閏月の場合は負の値
    yearGan: TIAN_GAN[yearGanIndex >= 0 ? yearGanIndex : yearGanIndex + 10],
    yearZhi: DI_ZHI[yearZhiIndex >= 0 ? yearZhiIndex : yearZhiIndex + 12],
    monthGan: TIAN_GAN[0], // 後で計算
    monthZhi: DI_ZHI[Math.abs(lunar.getMonth()) + 1] // 月の地支
  };
}

/**
 * 旧暦をそのまま使用
 */
export function useLunarDate(year: number, month: number, day: number): LunarDateInfo {
  // 年干支を計算
  const yearGanIndex = (year - 4) % 10;
  const yearZhiIndex = (year - 4) % 12;

  return {
    year,
    month,
    day,
    isLeapMonth: false,
    yearGan: TIAN_GAN[yearGanIndex >= 0 ? yearGanIndex : yearGanIndex + 10],
    yearZhi: DI_ZHI[yearZhiIndex >= 0 ? yearZhiIndex : yearZhiIndex + 12],
    monthGan: TIAN_GAN[0],
    monthZhi: DI_ZHI[(month + 1) % 12]
  };
}

/**
 * 時刻から時辰（2時間区切り）を取得
 */
export function getShiChen(hour: number): ShiChen {
  // 23:00〜00:59 = 子時(0)
  // 01:00〜02:59 = 丑時(1)
  // ...
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2) as ShiChen;
}

/**
 * 時辰から地支を取得
 */
export function getHourBranch(shiChen: ShiChen): DiZhi {
  return DI_ZHI[shiChen];
}

/**
 * 年の干支を計算
 */
export function getYearGanZhi(year: number): { gan: TianGan; zhi: DiZhi } {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: TIAN_GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10],
    zhi: DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12]
  };
}

/**
 * 天干が陽か陰かを判定
 */
export function isYangGan(gan: TianGan): boolean {
  const yangGan: TianGan[] = ['甲', '丙', '戊', '庚', '壬'];
  return yangGan.includes(gan);
}

/**
 * 地支のインデックスを取得
 */
export function getZhiIndex(zhi: DiZhi): number {
  return DI_ZHI.indexOf(zhi);
}

/**
 * 天干のインデックスを取得
 */
export function getGanIndex(gan: TianGan): number {
  return TIAN_GAN.indexOf(gan);
}

/**
 * 西暦年から流年の干支を取得
 */
export function getYearGanZhiFromYear(year: number): { gan: TianGan; zhi: DiZhi } {
  return getYearGanZhi(year);
}
