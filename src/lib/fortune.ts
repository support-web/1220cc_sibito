// 金運鑑定ロジック

import {
  MingPan, FortuneType, SuccessPattern, FortuneResult,
  YearlyFortune, PalaceInfo, MainStar, AuxiliaryStar, SiHua
} from '@/types';
import {
  getCaiBoPalace, getGuanLuPalace, getTianZhaiPalace, getFuDePalace,
  getPalaceByName
} from './ziwei';
import { FORTUNE_TYPES, SUCCESS_PATTERNS, STAR_FORTUNE_TRAITS } from './constants';
import { getYearGanZhiFromYear } from './calendar';
import { SHENG_NIAN_SI_HUA } from './constants';

// 財星
const WEALTH_STARS: MainStar[] = ['武曲', '天府', '太陰', '貪狼'];
// 吉星
const LUCKY_STARS: MainStar[] = ['紫微', '天相', '天梁', '天同'];
// 煞星
const EVIL_STARS: AuxiliaryStar[] = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫'];

/**
 * 宮位を評価
 */
function evaluatePalace(palace: PalaceInfo | null): number {
  if (!palace) return 0;

  let score = 0;

  // 主星評価
  palace.mainStars.forEach(star => {
    if (WEALTH_STARS.includes(star)) score += 15;
    else if (LUCKY_STARS.includes(star)) score += 10;
    else score += 5;
  });

  // 四化評価
  palace.siHua.forEach(siHua => {
    switch (siHua) {
      case '化禄': score += 20; break;
      case '化権': score += 10; break;
      case '化科': score += 8; break;
      case '化忌': score -= 15; break;
    }
  });

  // 副星評価
  palace.auxiliaryStars.forEach(star => {
    if (EVIL_STARS.includes(star)) {
      score -= 8;
    } else if (['左輔', '右弼', '天魁', '天鉞'].includes(star)) {
      score += 5;
    } else if (['文昌', '文曲'].includes(star)) {
      score += 4;
    } else if (star === '禄存') {
      score += 12;
    } else if (star === '天馬') {
      score += 6;
    }
  });

  return score;
}

/**
 * 金運スコアを計算
 */
export function calculateFortuneScore(mingPan: MingPan): number {
  let score = 50; // 基準点

  // 財帛宮の評価（最重要）
  const caiBo = getCaiBoPalace(mingPan);
  score += evaluatePalace(caiBo);

  // 官禄宮の評価（仕事運）
  const guanLu = getGuanLuPalace(mingPan);
  score += evaluatePalace(guanLu) * 0.3;

  // 田宅宮の評価（資産運）
  const tianZhai = getTianZhaiPalace(mingPan);
  score += evaluatePalace(tianZhai) * 0.2;

  // 福徳宮の評価（投資センス）
  const fuDe = getFuDePalace(mingPan);
  score += evaluatePalace(fuDe) * 0.2;

  // 命宮の評価
  const mingGong = getPalaceByName(mingPan, '命宮');
  score += evaluatePalace(mingGong) * 0.15;

  // スコアを0-100に正規化
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 金運タイプを判定
 */
export function determineFortuneType(mingPan: MingPan): FortuneType {
  const caiBo = getCaiBoPalace(mingPan);
  const tianZhai = getTianZhaiPalace(mingPan);

  if (!caiBo) return '実業家型';

  const mainStars = caiBo.mainStars;
  const hasHuaLu = caiBo.siHua.includes('化禄');
  const hasZuoYou = caiBo.auxiliaryStars.includes('左輔') && caiBo.auxiliaryStars.includes('右弼');

  // 帝王財運型
  if (mainStars.includes('紫微') || (hasHuaLu && hasZuoYou)) {
    return '帝王財運型';
  }

  // 実業家型
  if (mainStars.includes('武曲')) {
    return '実業家型';
  }

  // 蓄財型
  if (mainStars.includes('天府')) {
    return '蓄財型';
  }

  // 投機型
  if (mainStars.includes('貪狼')) {
    return '投機型';
  }

  // 知識財型
  if (mainStars.includes('天機') ||
      caiBo.auxiliaryStars.includes('文昌') ||
      caiBo.auxiliaryStars.includes('文曲')) {
    return '知識財型';
  }

  // 名声財型
  if (mainStars.includes('太陽')) {
    return '名声財型';
  }

  // 不動産財型
  if (mainStars.includes('太陰')) {
    return '不動産財型';
  }

  // 開拓者型
  if (mainStars.includes('七殺') || mainStars.includes('破軍')) {
    return '開拓者型';
  }

  // デフォルト
  return '実業家型';
}

/**
 * 成功パターンを判定
 */
export function determineSuccessPattern(mingPan: MingPan): SuccessPattern {
  const caiBo = getCaiBoPalace(mingPan);
  const tianZhai = getTianZhaiPalace(mingPan);

  if (!caiBo) return 'コツコツ積み上げ型';

  const mainStars = caiBo.mainStars;
  const hasHuaLu = caiBo.siHua.includes('化禄');
  const evilStarCount = caiBo.auxiliaryStars.filter(s => EVIL_STARS.includes(s)).length;

  // 資産運用型
  if (tianZhai) {
    const tianZhaiStars = tianZhai.mainStars;
    if (tianZhaiStars.includes('太陰') || tianZhaiStars.includes('天府')) {
      if (tianZhai.siHua.includes('化禄')) {
        return '資産運用型';
      }
    }
  }

  // 一攫千金型
  if ((mainStars.includes('貪狼') || mainStars.includes('破軍')) && hasHuaLu) {
    return '一攫千金型';
  }

  // 人脈活用型
  const hasKuiYue = caiBo.auxiliaryStars.includes('天魁') || caiBo.auxiliaryStars.includes('天鉞');
  const hasZuoYou = caiBo.auxiliaryStars.includes('左輔') || caiBo.auxiliaryStars.includes('右弼');
  if ((mainStars.includes('太陽') || mainStars.includes('紫微')) && (hasKuiYue || hasZuoYou)) {
    return '人脈活用型';
  }

  // 専門技能型
  const hasWenXing = caiBo.auxiliaryStars.includes('文昌') || caiBo.auxiliaryStars.includes('文曲');
  if ((mainStars.includes('天機') || mainStars.includes('巨門')) && hasWenXing) {
    return '専門技能型';
  }

  // コツコツ積み上げ型
  if ((mainStars.includes('武曲') || mainStars.includes('天府') || mainStars.includes('天相')) &&
      evilStarCount <= 1) {
    return 'コツコツ積み上げ型';
  }

  return 'コツコツ積み上げ型';
}

/**
 * 適職を推薦
 */
export function recommendJobs(mingPan: MingPan): string[] {
  const guanLu = getGuanLuPalace(mingPan);
  const caiBo = getCaiBoPalace(mingPan);
  const mingGong = getPalaceByName(mingPan, '命宮');

  const jobs: string[] = [];
  const starSet = new Set<MainStar>();

  [guanLu, caiBo, mingGong].forEach(palace => {
    if (palace) {
      palace.mainStars.forEach(star => starSet.add(star));
    }
  });

  const stars = Array.from(starSet);

  // 星に基づいて職業を推薦
  if (stars.includes('武曲') || stars.includes('天府')) {
    jobs.push('銀行員', '会計士', 'ファイナンシャルプランナー');
  }
  if (stars.includes('紫微') || stars.includes('七殺')) {
    jobs.push('経営者', '起業家', 'CEO');
  }
  if (stars.includes('天機') || stars.includes('巨門')) {
    jobs.push('ITエンジニア', 'コンサルタント', '研究者');
  }
  if (stars.includes('貪狼')) {
    jobs.push('営業職', 'マーケター', 'クリエイター');
  }
  if (stars.includes('太陽')) {
    jobs.push('弁護士', '政治家', 'マネージャー');
  }
  if (stars.includes('太陰')) {
    jobs.push('不動産業', '資産運用', 'インテリアデザイナー');
  }
  if (stars.includes('天同') || stars.includes('天梁')) {
    jobs.push('公務員', '教師', '医療従事者');
  }
  if (stars.includes('破軍')) {
    jobs.push('フリーランス', 'プロジェクトマネージャー', '改革推進者');
  }

  // 重複を除去して上位5つを返す
  return [...new Set(jobs)].slice(0, 5);
}

/**
 * 10年間の運勢を計算
 */
export function calculateYearlyFortune(mingPan: MingPan, startYear: number): YearlyFortune[] {
  const fortunes: YearlyFortune[] = [];

  for (let i = 0; i < 10; i++) {
    const year = startYear + i;
    const yearGanZhi = getYearGanZhiFromYear(year);
    const siHuaConfig = SHENG_NIAN_SI_HUA[yearGanZhi.gan];

    // 基本スコアから流年の影響を計算
    let score = calculateFortuneScore(mingPan);

    // 流年四化の影響（簡略化版）
    const caiBo = getCaiBoPalace(mingPan);
    if (caiBo) {
      // 化禄の星が財帛宮にあれば加点
      if (caiBo.mainStars.includes(siHuaConfig.化禄 as MainStar)) {
        score += 15;
      }
      // 化忌の星が財帛宮にあれば減点
      if (caiBo.mainStars.includes(siHuaConfig.化忌 as MainStar)) {
        score -= 15;
      }
    }

    // 太歳の影響
    const yearZhiIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(yearGanZhi.zhi);
    const mingGongIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(mingPan.mingGongPosition);
    const distance = (yearZhiIndex - mingGongIndex + 12) % 12;

    // 相合・相沖の簡略計算
    if (distance === 0) score += 5; // 伏吟
    else if (distance === 6) score -= 5; // 反吟

    // ランダム性を加えて自然な変動を演出（シード付き）
    const seed = year * 1000 + (mingPan.lunarDate.month * 100) + mingPan.lunarDate.day;
    const pseudoRandom = Math.sin(seed) * 10000;
    const variation = (pseudoRandom - Math.floor(pseudoRandom)) * 10 - 5;
    score += variation;

    // 0-100に正規化
    score = Math.max(0, Math.min(100, Math.round(score)));

    // 運勢の説明を生成
    let description: string;
    if (score >= 80) {
      description = '大吉。財運が大きく開ける年です。投資や事業拡大のチャンス。';
    } else if (score >= 60) {
      description = '吉。安定した金運。堅実に資産を増やせます。';
    } else if (score >= 40) {
      description = '平。大きな変動はありませんが、地道な努力が実を結びます。';
    } else if (score >= 20) {
      description = '注意。出費が増えやすい時期。慎重な金銭管理を。';
    } else {
      description = '要注意。財運に試練あり。大きな投資は避けましょう。';
    }

    fortunes.push({ year, score, description });
  }

  return fortunes;
}

/**
 * 財帛宮の解説を生成
 */
function generateCaiBaoDescription(caiBo: PalaceInfo | null): string {
  if (!caiBo || caiBo.mainStars.length === 0) {
    return 'あなたの財帛宮は空宮です。副星や飛星の影響を受けやすく、環境や時期によって金運が大きく変動する傾向があります。';
  }

  const mainStar = caiBo.mainStars[0];
  const trait = STAR_FORTUNE_TRAITS[mainStar];

  let desc = `あなたの財帛宮には${mainStar}が座しています。\n\n`;
  desc += `${trait.description}\n\n`;
  desc += `【金運の傾向】\n${trait.fortuneTrait}\n\n`;

  // 四化の影響
  if (caiBo.siHua.includes('化禄')) {
    desc += '化禄が財帛宮に入り、金運が大きく開けています。収入源が増え、財を得やすい配置です。\n';
  }
  if (caiBo.siHua.includes('化権')) {
    desc += '化権が財帛宮に入り、財を得る力と競争力が増しています。積極的に稼ぐ力があります。\n';
  }
  if (caiBo.siHua.includes('化忌')) {
    desc += '化忌が財帛宮に入っているため、金銭面で苦労しやすい傾向があります。慎重な資金管理が必要です。\n';
  }

  return desc;
}

/**
 * 総合的な金運鑑定を実行
 */
export function performFortuneTelling(mingPan: MingPan): FortuneResult {
  const score = calculateFortuneScore(mingPan);
  const fortuneType = determineFortuneType(mingPan);
  const successPattern = determineSuccessPattern(mingPan);
  const jobRecommendations = recommendJobs(mingPan);
  const currentYear = new Date().getFullYear();
  const yearlyFortune = calculateYearlyFortune(mingPan, currentYear);

  const caiBo = getCaiBoPalace(mingPan);
  const fortuneTypeInfo = FORTUNE_TYPES[fortuneType];
  const successPatternInfo = SUCCESS_PATTERNS[successPattern];

  // 総合解説を生成
  let overview = '';
  if (score >= 80) {
    overview = '素晴らしい金運の持ち主です！財運に恵まれた命盤で、大きな財を築く可能性を秘めています。';
  } else if (score >= 60) {
    overview = '良好な金運をお持ちです。堅実に努力を重ねることで、安定した財を築いていくことができます。';
  } else if (score >= 40) {
    overview = '平均的な金運です。特定の分野や時期に集中することで、より大きな成果を得られるでしょう。';
  } else {
    overview = '金運に課題がありますが、適切な対策と時期を見極めることで改善できます。';
  }

  return {
    score,
    fortuneType,
    successPattern,
    jobRecommendations,
    yearlyFortune,
    description: {
      overview,
      caibogong: generateCaiBaoDescription(caiBo),
      successPatternDesc: `【${successPattern}】\n${successPatternInfo.description}\n\n【成功へのアドバイス】\n${successPatternInfo.advice}\n\n【成功時期の傾向】\n${successPatternInfo.timing}`,
      advice: `あなたは「${fortuneType}」タイプです。\n\n${fortuneTypeInfo.description}\n\n【成功パターン】\n${fortuneTypeInfo.successPattern}`
    }
  };
}
