// 紫微斗数 命盤計算メインロジック

import {
  TianGan, DiZhi, ShiChen, WuXingJu, Palace, MainStar,
  AuxiliaryStar, SiHua, PalaceInfo, MingPan, Gender, CalendarType
} from '@/types';
import {
  TIAN_GAN, DI_ZHI, PALACES, NA_YIN_TABLE, ZI_WEI_POSITION,
  TIAN_FU_FROM_ZI_WEI, SHENG_NIAN_SI_HUA, LU_CUN_POSITION,
  TIAN_MA_POSITION, KUI_YUE_POSITION
} from '../constants';
import { solarToLunar, useLunarDate, getShiChen, getYearGanZhi, isYangGan, getZhiIndex } from '../calendar';

/**
 * 命宮の位置を計算
 * 寅宮を起点とし、生月を順行、生時を逆行
 */
function calculateMingGong(lunarMonth: number, shiChen: ShiChen): DiZhi {
  // 寅 = index 2
  const yinIndex = 2;
  // 命宮位置 = 寅 + (月-1) - 時辰
  let position = (yinIndex + (lunarMonth - 1) - shiChen + 12) % 12;
  if (position < 0) position += 12;
  return DI_ZHI[position];
}

/**
 * 身宮の位置を計算
 * 寅宮を起点とし、生月と生時を共に順行
 */
function calculateShenGong(lunarMonth: number, shiChen: ShiChen): DiZhi {
  const yinIndex = 2;
  const position = (yinIndex + (lunarMonth - 1) + shiChen) % 12;
  return DI_ZHI[position];
}

/**
 * 五行局を決定
 * 命宮の地支と生年天干の組み合わせから納音五行を参照
 */
function calculateWuXingJu(mingGongZhi: DiZhi, yearGan: TianGan): WuXingJu {
  // 命宮の干を求める（寅から起算）
  const zhiIndex = getZhiIndex(mingGongZhi);
  const ganIndex = TIAN_GAN.indexOf(yearGan);

  // 五虎遁を使って命宮の天干を計算
  // 甲己の年は寅が丙、乙庚の年は寅が戊...
  const baseGanMap: Record<number, number> = {
    0: 2, // 甲 -> 丙
    5: 2, // 己 -> 丙
    1: 4, // 乙 -> 戊
    6: 4, // 庚 -> 戊
    2: 6, // 丙 -> 庚
    7: 6, // 辛 -> 庚
    3: 8, // 丁 -> 壬
    8: 8, // 壬 -> 壬
    4: 0, // 戊 -> 甲
    9: 0  // 癸 -> 甲
  };

  const baseGan = baseGanMap[ganIndex];
  const mingGongGanIndex = (baseGan + zhiIndex - 2 + 10) % 10;
  const mingGongGan = TIAN_GAN[mingGongGanIndex];

  const key = mingGongGan + mingGongZhi;
  return NA_YIN_TABLE[key] || '土五局';
}

/**
 * 十二宮を配置
 */
function arrangePalaces(mingGongZhi: DiZhi): Record<DiZhi, Palace> {
  const result: Record<string, Palace> = {};
  const mingGongIndex = getZhiIndex(mingGongZhi);

  // 命宮から反時計回りに配置
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (mingGongIndex - i + 12) % 12;
    result[DI_ZHI[palaceIndex]] = PALACES[i];
  }

  return result as Record<DiZhi, Palace>;
}

/**
 * 紫微星の位置から紫微星系を配置
 */
function placeZiWeiSeries(ziWeiPosition: DiZhi): Record<DiZhi, MainStar[]> {
  const result: Record<string, MainStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const ziWeiIndex = getZhiIndex(ziWeiPosition);

  // 紫微星系の配置（紫微から逆行）
  const ziWeiSeriesOffsets: [MainStar, number][] = [
    ['紫微', 0],
    ['天機', -1],
    ['太陽', -3],
    ['武曲', -4],
    ['天同', -5],
    ['廉貞', -8]
  ];

  ziWeiSeriesOffsets.forEach(([star, offset]) => {
    let pos = (ziWeiIndex + offset + 12) % 12;
    // 空宮を飛ばすロジック（簡略化）
    result[DI_ZHI[pos]].push(star);
  });

  return result as Record<DiZhi, MainStar[]>;
}

/**
 * 天府星の位置から天府星系を配置
 */
function placeTianFuSeries(tianFuPosition: DiZhi): Record<DiZhi, MainStar[]> {
  const result: Record<string, MainStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const tianFuIndex = getZhiIndex(tianFuPosition);

  // 天府星系の配置（天府から順行）
  const tianFuSeriesOffsets: [MainStar, number][] = [
    ['天府', 0],
    ['太陰', 1],
    ['貪狼', 2],
    ['巨門', 3],
    ['天相', 4],
    ['天梁', 5],
    ['七殺', 6],
    ['破軍', 10]
  ];

  tianFuSeriesOffsets.forEach(([star, offset]) => {
    const pos = (tianFuIndex + offset) % 12;
    result[DI_ZHI[pos]].push(star);
  });

  return result as Record<DiZhi, MainStar[]>;
}

/**
 * 左輔・右弼を配置
 */
function placeZuoYou(lunarMonth: number): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  // 左輔：辰宮起点、月数順行
  const zuoFuPos = (4 + lunarMonth - 1) % 12; // 辰=4
  result[DI_ZHI[zuoFuPos]].push('左輔');

  // 右弼：戌宮起点、月数逆行
  const youBiPos = (10 - lunarMonth + 1 + 12) % 12; // 戌=10
  result[DI_ZHI[youBiPos]].push('右弼');

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 文昌・文曲を配置
 */
function placeWenChangQu(shiChen: ShiChen): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  // 文昌：戌宮起点、時辰逆行
  const wenChangPos = (10 - shiChen + 12) % 12;
  result[DI_ZHI[wenChangPos]].push('文昌');

  // 文曲：辰宮起点、時辰順行
  const wenQuPos = (4 + shiChen) % 12;
  result[DI_ZHI[wenQuPos]].push('文曲');

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 禄存・擎羊・陀羅を配置
 */
function placeLuCunYangTuo(yearGan: TianGan): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const luCunZhi = LU_CUN_POSITION[yearGan];
  const luCunIndex = getZhiIndex(luCunZhi);

  result[luCunZhi].push('禄存');
  result[DI_ZHI[(luCunIndex + 1) % 12]].push('擎羊');
  result[DI_ZHI[(luCunIndex - 1 + 12) % 12]].push('陀羅');

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 天馬を配置
 */
function placeTianMa(yearZhi: DiZhi): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const tianMaZhi = TIAN_MA_POSITION[yearZhi];
  if (tianMaZhi) {
    result[tianMaZhi].push('天馬');
  }

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 天魁・天鉞を配置
 */
function placeKuiYue(yearGan: TianGan): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const kuiYue = KUI_YUE_POSITION[yearGan];
  if (kuiYue) {
    result[kuiYue.天魁].push('天魁');
    result[kuiYue.天鉞].push('天鉞');
  }

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 火星・鈴星を配置（簡略化）
 */
function placeHuoLing(yearZhi: DiZhi, shiChen: ShiChen): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  // 火星：生年支と生時から決定（簡略化版）
  const huoXingBase: Record<string, number> = {
    '寅': 2, '午': 2, '戌': 2,
    '申': 3, '子': 3, '辰': 3,
    '巳': 1, '酉': 1, '丑': 1,
    '亥': 9, '卯': 9, '未': 9
  };
  const huoBase = huoXingBase[yearZhi] || 0;
  const huoPos = (huoBase + shiChen) % 12;
  result[DI_ZHI[huoPos]].push('火星');

  // 鈴星：別の計算（簡略化）
  const lingPos = (10 - shiChen + 12) % 12;
  result[DI_ZHI[lingPos]].push('鈴星');

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 地空・地劫を配置
 */
function placeKongJie(shiChen: ShiChen): Record<DiZhi, AuxiliaryStar[]> {
  const result: Record<string, AuxiliaryStar[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  // 地空：亥宮起点、時辰逆行
  const kongPos = (11 - shiChen + 12) % 12;
  result[DI_ZHI[kongPos]].push('地空');

  // 地劫：亥宮起点、時辰順行
  const jiePos = (11 + shiChen) % 12;
  result[DI_ZHI[jiePos]].push('地劫');

  return result as Record<DiZhi, AuxiliaryStar[]>;
}

/**
 * 四化星を適用
 */
function applySiHua(
  yearGan: TianGan,
  starPositions: Record<DiZhi, MainStar[]>
): Record<DiZhi, SiHua[]> {
  const result: Record<string, SiHua[]> = {};
  DI_ZHI.forEach(zhi => result[zhi] = []);

  const siHuaConfig = SHENG_NIAN_SI_HUA[yearGan];

  const siHuaTypes: SiHua[] = ['化禄', '化権', '化科', '化忌'];

  siHuaTypes.forEach(siHua => {
    const targetStar = siHuaConfig[siHua];
    // 該当する星がある宮を探す
    for (const zhi of DI_ZHI) {
      if (starPositions[zhi].includes(targetStar as MainStar)) {
        result[zhi].push(siHua);
        break;
      }
    }
  });

  return result as Record<DiZhi, SiHua[]>;
}

/**
 * 命盤を作成
 */
export function createMingPan(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: Gender,
  calendarType: CalendarType
): MingPan {
  // 暦変換
  const lunarInfo = calendarType === 'solar'
    ? solarToLunar(birthYear, birthMonth, birthDay)
    : useLunarDate(birthYear, birthMonth, birthDay);

  // 時辰を計算
  const shiChen = getShiChen(birthHour);

  // 年干支を取得
  const yearGanZhi = getYearGanZhi(lunarInfo.year);

  // 命宮・身宮の位置を計算
  const mingGongZhi = calculateMingGong(Math.abs(lunarInfo.month), shiChen);
  const shenGongZhi = calculateShenGong(Math.abs(lunarInfo.month), shiChen);

  // 五行局を決定
  const wuXingJu = calculateWuXingJu(mingGongZhi, yearGanZhi.gan);

  // 十二宮を配置
  const palaceArrangement = arrangePalaces(mingGongZhi);

  // 紫微星の位置を決定
  const ziWeiZhi = ZI_WEI_POSITION[wuXingJu][lunarInfo.day] || '子';

  // 天府星の位置を決定
  const tianFuZhi = TIAN_FU_FROM_ZI_WEI[ziWeiZhi];

  // 主星を配置
  const ziWeiStars = placeZiWeiSeries(ziWeiZhi);
  const tianFuStars = placeTianFuSeries(tianFuZhi);

  // 主星を統合
  const mainStars: Record<DiZhi, MainStar[]> = {} as Record<DiZhi, MainStar[]>;
  DI_ZHI.forEach(zhi => {
    mainStars[zhi] = [...(ziWeiStars[zhi] || []), ...(tianFuStars[zhi] || [])];
  });

  // 副星を配置
  const zuoYou = placeZuoYou(Math.abs(lunarInfo.month));
  const wenChangQu = placeWenChangQu(shiChen);
  const luCunYangTuo = placeLuCunYangTuo(yearGanZhi.gan);
  const tianMa = placeTianMa(yearGanZhi.zhi);
  const kuiYue = placeKuiYue(yearGanZhi.gan);
  const huoLing = placeHuoLing(yearGanZhi.zhi, shiChen);
  const kongJie = placeKongJie(shiChen);

  // 副星を統合
  const auxiliaryStars: Record<DiZhi, AuxiliaryStar[]> = {} as Record<DiZhi, AuxiliaryStar[]>;
  DI_ZHI.forEach(zhi => {
    auxiliaryStars[zhi] = [
      ...(zuoYou[zhi] || []),
      ...(wenChangQu[zhi] || []),
      ...(luCunYangTuo[zhi] || []),
      ...(tianMa[zhi] || []),
      ...(kuiYue[zhi] || []),
      ...(huoLing[zhi] || []),
      ...(kongJie[zhi] || [])
    ];
  });

  // 四化を適用
  const siHua = applySiHua(yearGanZhi.gan, mainStars);

  // 各宮の情報を構築
  const palaces: Record<DiZhi, PalaceInfo> = {} as Record<DiZhi, PalaceInfo>;
  DI_ZHI.forEach(zhi => {
    palaces[zhi] = {
      name: palaceArrangement[zhi],
      position: zhi,
      mainStars: mainStars[zhi],
      auxiliaryStars: auxiliaryStars[zhi],
      siHua: siHua[zhi],
      isMingGong: zhi === mingGongZhi,
      isShenGong: zhi === shenGongZhi
    };
  });

  return {
    birthDate: new Date(birthYear, birthMonth - 1, birthDay),
    lunarDate: {
      year: lunarInfo.year,
      month: Math.abs(lunarInfo.month),
      day: lunarInfo.day,
      isLeapMonth: lunarInfo.isLeapMonth
    },
    yearGanZhi,
    monthBranch: Math.abs(lunarInfo.month),
    hourBranch: shiChen,
    gender,
    wuXingJu,
    mingGongPosition: mingGongZhi,
    shenGongPosition: shenGongZhi,
    palaces
  };
}

/**
 * 特定の宮を取得
 */
export function getPalaceByName(mingPan: MingPan, palaceName: Palace): PalaceInfo | null {
  for (const zhi of DI_ZHI) {
    if (mingPan.palaces[zhi].name === palaceName) {
      return mingPan.palaces[zhi];
    }
  }
  return null;
}

/**
 * 財帛宮を取得
 */
export function getCaiBoPalace(mingPan: MingPan): PalaceInfo | null {
  return getPalaceByName(mingPan, '財帛宮');
}

/**
 * 官禄宮を取得
 */
export function getGuanLuPalace(mingPan: MingPan): PalaceInfo | null {
  return getPalaceByName(mingPan, '官禄宮');
}

/**
 * 田宅宮を取得
 */
export function getTianZhaiPalace(mingPan: MingPan): PalaceInfo | null {
  return getPalaceByName(mingPan, '田宅宮');
}

/**
 * 福徳宮を取得
 */
export function getFuDePalace(mingPan: MingPan): PalaceInfo | null {
  return getPalaceByName(mingPan, '福徳宮');
}
