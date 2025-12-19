// 紫微斗数の型定義

export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';

// 天干
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// 地支
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 時辰
export type ShiChen = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 五行局
export type WuXingJu = '水二局' | '木三局' | '金四局' | '土五局' | '火六局';

// 十二宮
export type Palace =
  | '命宮' | '兄弟宮' | '夫妻宮' | '子女宮'
  | '財帛宮' | '疾厄宮' | '遷移宮' | '交友宮'
  | '官禄宮' | '田宅宮' | '福徳宮' | '父母宮';

// 十四主星
export type MainStar =
  | '紫微' | '天機' | '太陽' | '武曲' | '天同' | '廉貞'
  | '天府' | '太陰' | '貪狼' | '巨門' | '天相' | '天梁' | '七殺' | '破軍';

// 四化
export type SiHua = '化禄' | '化権' | '化科' | '化忌';

// 吉星・煞星
export type AuxiliaryStar =
  | '左輔' | '右弼' | '文昌' | '文曲' | '天魁' | '天鉞'
  | '禄存' | '天馬' | '擎羊' | '陀羅' | '火星' | '鈴星' | '地空' | '地劫';

// 宮位情報
export interface PalaceInfo {
  name: Palace;
  position: DiZhi;
  mainStars: MainStar[];
  auxiliaryStars: AuxiliaryStar[];
  siHua: SiHua[];
  isMingGong: boolean;
  isShenGong: boolean;
}

// 命盤
export interface MingPan {
  birthDate: Date;
  lunarDate: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
  yearGanZhi: {
    gan: TianGan;
    zhi: DiZhi;
  };
  monthBranch: number;
  hourBranch: ShiChen;
  gender: Gender;
  wuXingJu: WuXingJu;
  mingGongPosition: DiZhi;
  shenGongPosition: DiZhi;
  palaces: Record<DiZhi, PalaceInfo>;
}

// 金運タイプ
export type FortuneType =
  | '帝王財運型' | '実業家型' | '蓄財型' | '投機型'
  | '知識財型' | '名声財型' | '不動産財型' | '開拓者型';

// 成功パターン
export type SuccessPattern =
  | 'コツコツ積み上げ型' | '一攫千金型' | '人脈活用型' | '専門技能型' | '資産運用型';

// 金運鑑定結果
export interface FortuneResult {
  score: number;
  fortuneType: FortuneType;
  successPattern: SuccessPattern;
  jobRecommendations: string[];
  yearlyFortune: YearlyFortune[];
  description: {
    overview: string;
    caibogong: string;
    successPatternDesc: string;
    advice: string;
  };
}

// 年間運勢
export interface YearlyFortune {
  year: number;
  score: number;
  description: string;
}

// 入力フォームデータ
export interface InputFormData {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: Gender;
  calendarType: CalendarType;
  nickname?: string;
}
