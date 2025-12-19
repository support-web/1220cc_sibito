'use client';

import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MingPan, FortuneResult } from '@/types';
import { FORTUNE_TYPES, SUCCESS_PATTERNS } from '@/lib/constants';

interface PDFGeneratorProps {
  mingPan: MingPan;
  fortuneResult: FortuneResult;
  nickname?: string;
}

export function usePDFGenerator({ mingPan, fortuneResult, nickname }: PDFGeneratorProps) {
  const generatePDF = useCallback(async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // フォントサイズ設定
    const titleSize = 24;
    const subtitleSize = 16;
    const bodySize = 11;
    const smallSize = 9;

    // 色定義
    const purple = '#8B5CF6';
    const gold = '#FFD700';
    const darkBg = '#0F0F1A';

    let currentY = margin;

    // ヘルパー関数
    const addText = (text: string, x: number, y: number, size: number, color: string = '#333', align: 'left' | 'center' | 'right' = 'left') => {
      pdf.setFontSize(size);
      pdf.setTextColor(color);

      if (align === 'center') {
        pdf.text(text, pageWidth / 2, y, { align: 'center' });
      } else if (align === 'right') {
        pdf.text(text, pageWidth - margin, y, { align: 'right' });
      } else {
        pdf.text(text, x, y);
      }
    };

    const addPage = () => {
      pdf.addPage();
      currentY = margin;
    };

    const checkNewPage = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        addPage();
        return true;
      }
      return false;
    };

    // === Page 1: 表紙 ===
    // 背景色
    pdf.setFillColor(15, 15, 26);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // タイトル
    currentY = 50;
    addText('紫微財運占い', 0, currentY, titleSize, gold, 'center');
    currentY += 15;
    addText('金運鑑定書', 0, currentY, subtitleSize, '#FFFFFF', 'center');

    // 鑑定日
    currentY += 20;
    const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    addText(`鑑定日: ${today}`, 0, currentY, smallSize, '#A0A0C0', 'center');

    // ニックネーム
    if (nickname) {
      currentY += 10;
      addText(`${nickname} 様`, 0, currentY, subtitleSize, '#FFFFFF', 'center');
    }

    // 生年月日情報
    currentY += 20;
    const birthInfo = `${mingPan.birthDate.getFullYear()}年${mingPan.birthDate.getMonth() + 1}月${mingPan.birthDate.getDate()}日生`;
    addText(birthInfo, 0, currentY, bodySize, '#A0A0C0', 'center');
    currentY += 8;
    addText(`農暦 ${mingPan.lunarDate.year}年${mingPan.lunarDate.month}月${mingPan.lunarDate.day}日`, 0, currentY, smallSize, '#A0A0C0', 'center');

    // 金運スコア
    currentY += 30;
    pdf.setFillColor(139, 92, 246);
    pdf.circle(pageWidth / 2, currentY + 25, 30, 'F');
    pdf.setFillColor(15, 15, 26);
    pdf.circle(pageWidth / 2, currentY + 25, 22, 'F');
    addText(`${fortuneResult.score}`, 0, currentY + 28, 28, gold, 'center');
    addText('点', 0, currentY + 38, 12, '#A0A0C0', 'center');

    currentY += 70;
    addText(`金運タイプ: ${fortuneResult.fortuneType}`, 0, currentY, subtitleSize, purple, 'center');

    // フッター
    addText('紫微斗数による金運鑑定', 0, pageHeight - 20, smallSize, '#A0A0C0', 'center');

    // === Page 2: 金運詳細解説 ===
    addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    addText('金運詳細解説', margin, currentY, titleSize, purple);
    currentY += 15;

    // 金運タイプ解説
    addText(`【${fortuneResult.fortuneType}】`, margin, currentY, subtitleSize, '#333');
    currentY += 10;

    const fortuneTypeInfo = FORTUNE_TYPES[fortuneResult.fortuneType];
    const typeLines = pdf.splitTextToSize(fortuneTypeInfo.description, contentWidth);
    typeLines.forEach((line: string) => {
      checkNewPage(7);
      addText(line, margin, currentY, bodySize, '#666');
      currentY += 7;
    });

    currentY += 10;
    addText('成功パターン:', margin, currentY, bodySize, purple);
    currentY += 7;
    const successLines = pdf.splitTextToSize(fortuneTypeInfo.successPattern, contentWidth);
    successLines.forEach((line: string) => {
      checkNewPage(7);
      addText(line, margin, currentY, bodySize, '#666');
      currentY += 7;
    });

    // 財帛宮解説
    currentY += 15;
    checkNewPage(50);
    addText('財帛宮からみる金運', margin, currentY, subtitleSize, purple);
    currentY += 10;

    const caiboLines = pdf.splitTextToSize(fortuneResult.description.caibogong, contentWidth);
    caiboLines.forEach((line: string) => {
      checkNewPage(7);
      addText(line, margin, currentY, bodySize, '#666');
      currentY += 7;
    });

    // === Page 3: 適職・成功パターン ===
    addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    addText('適職・キャリア分析', margin, currentY, titleSize, purple);
    currentY += 15;

    addText('あなたに向いている職業 TOP5', margin, currentY, subtitleSize, '#333');
    currentY += 10;

    fortuneResult.jobRecommendations.forEach((job, idx) => {
      checkNewPage(10);
      addText(`${idx + 1}. ${job}`, margin + 5, currentY, bodySize, '#666');
      currentY += 8;
    });

    currentY += 15;
    addText('成功パターン分析', margin, currentY, subtitleSize, purple);
    currentY += 10;

    addText(`【${fortuneResult.successPattern}】`, margin, currentY, bodySize, '#333');
    currentY += 8;

    const successPatternInfo = SUCCESS_PATTERNS[fortuneResult.successPattern];
    const patternLines = pdf.splitTextToSize(successPatternInfo.description, contentWidth);
    patternLines.forEach((line: string) => {
      checkNewPage(7);
      addText(line, margin, currentY, bodySize, '#666');
      currentY += 7;
    });

    currentY += 8;
    addText('アドバイス:', margin, currentY, bodySize, purple);
    currentY += 7;
    const adviceLines = pdf.splitTextToSize(successPatternInfo.advice, contentWidth);
    adviceLines.forEach((line: string) => {
      checkNewPage(7);
      addText(line, margin, currentY, bodySize, '#666');
      currentY += 7;
    });

    currentY += 8;
    addText(`成功時期: ${successPatternInfo.timing}`, margin, currentY, bodySize, '#666');

    // === Page 4: 10年運勢 ===
    addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    addText('10年間の金運予測', margin, currentY, titleSize, purple);
    currentY += 15;

    fortuneResult.yearlyFortune.forEach((fortune) => {
      checkNewPage(25);

      // 年度ボックス
      pdf.setFillColor(245, 245, 255);
      pdf.roundedRect(margin, currentY - 5, contentWidth, 20, 3, 3, 'F');

      addText(`${fortune.year}年`, margin + 5, currentY + 5, subtitleSize, '#333');

      // スコア色
      let scoreColor = '#666';
      if (fortune.score >= 80) scoreColor = '#FFD700';
      else if (fortune.score >= 60) scoreColor = '#4CAF50';
      else if (fortune.score >= 40) scoreColor = '#2196F3';
      else if (fortune.score >= 20) scoreColor = '#FF9800';
      else scoreColor = '#F44336';

      addText(`${fortune.score}点`, pageWidth - margin - 20, currentY + 5, subtitleSize, scoreColor);

      currentY += 15;
      const descLines = pdf.splitTextToSize(fortune.description, contentWidth - 10);
      descLines.forEach((line: string) => {
        addText(line, margin + 5, currentY, smallSize, '#666');
        currentY += 5;
      });

      currentY += 10;
    });

    // === Page 5: 命盤情報 ===
    addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    addText('命盤情報', margin, currentY, titleSize, purple);
    currentY += 15;

    addText(`五行局: ${mingPan.wuXingJu}`, margin, currentY, bodySize, '#333');
    currentY += 8;
    addText(`年干支: ${mingPan.yearGanZhi.gan}${mingPan.yearGanZhi.zhi}`, margin, currentY, bodySize, '#333');
    currentY += 8;
    addText(`命宮位置: ${mingPan.mingGongPosition}`, margin, currentY, bodySize, '#333');
    currentY += 8;
    addText(`身宮位置: ${mingPan.shenGongPosition}`, margin, currentY, bodySize, '#333');
    currentY += 15;

    // 主要宮位の情報
    const importantPalaces = ['財帛宮', '官禄宮', '田宅宮', '福徳宮', '命宮'];
    importantPalaces.forEach((palaceName) => {
      checkNewPage(30);

      const palace = Object.values(mingPan.palaces).find(p => p.name === palaceName);
      if (palace) {
        pdf.setFillColor(245, 245, 255);
        pdf.roundedRect(margin, currentY - 3, contentWidth, 25, 3, 3, 'F');

        addText(palace.name, margin + 5, currentY + 5, subtitleSize, purple);
        currentY += 12;
        addText(`主星: ${palace.mainStars.join('、') || 'なし'}`, margin + 5, currentY, smallSize, '#666');
        currentY += 6;
        addText(`四化: ${palace.siHua.join('、') || 'なし'}`, margin + 5, currentY, smallSize, '#666');
        currentY += 15;
      }
    });

    // === Page 6: LINE誘導 ===
    addPage();
    pdf.setFillColor(15, 15, 26);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    currentY = 40;
    addText('もっと詳しい鑑定を', 0, currentY, titleSize, gold, 'center');
    currentY += 12;
    addText('受けたい方へ', 0, currentY, titleSize, gold, 'center');

    currentY += 30;
    addText('LINE公式アカウントでは', 0, currentY, bodySize, '#FFFFFF', 'center');
    currentY += 8;
    addText('毎月の金運情報や限定の開運アドバイスを', 0, currentY, bodySize, '#FFFFFF', 'center');
    currentY += 8;
    addText('無料でお届けしています', 0, currentY, bodySize, '#FFFFFF', 'center');

    currentY += 30;
    // QRコードプレースホルダー
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth / 2 - 30, currentY, 60, 60, 5, 5, 'F');
    addText('QRコード', 0, currentY + 35, bodySize, '#666', 'center');

    currentY += 80;
    addText('【LINE特典】', 0, currentY, subtitleSize, purple, 'center');
    currentY += 12;
    const benefits = [
      '毎月の金運カレンダー',
      'ラッキーカラー・ラッキーアイテム',
      '有料鑑定の割引クーポン',
      '金運アップ開運情報'
    ];
    benefits.forEach(benefit => {
      addText(`✓ ${benefit}`, 0, currentY, bodySize, '#FFFFFF', 'center');
      currentY += 8;
    });

    // フッター（免責事項）
    currentY = pageHeight - 30;
    addText('※ 本鑑定は紫微斗数に基づく占い結果であり、娯楽目的としてご利用ください。', 0, currentY, smallSize, '#A0A0C0', 'center');
    currentY += 6;
    addText('投資・金融判断は自己責任で行ってください。', 0, currentY, smallSize, '#A0A0C0', 'center');

    // PDFを保存
    const fileName = nickname ? `${nickname}_金運鑑定書.pdf` : '金運鑑定書.pdf';
    pdf.save(fileName);

  }, [mingPan, fortuneResult, nickname]);

  return { generatePDF };
}
