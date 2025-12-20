'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import FortuneResult from '@/components/FortuneResult';
import { usePDFGenerator } from '@/components/PDFGenerator';
import { InputFormData, MingPan, FortuneResult as FortuneResultType } from '@/types';
import { createMingPan } from '@/lib/ziwei';
import { performFortuneTelling } from '@/lib/fortune';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [mingPan, setMingPan] = useState<MingPan | null>(null);
  const [fortuneResult, setFortuneResult] = useState<FortuneResultType | null>(null);
  const [nickname, setNickname] = useState<string>('');

  const handleSubmit = async (data: InputFormData) => {
    setIsLoading(true);
    setNickname(data.nickname || '');

    // 少し遅延を入れてローディング演出
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // 出生時刻が不明の場合は午時（12時）を使用
      const birthHour = data.birthHour === -1 ? 12 : data.birthHour;

      // 命盤を作成
      const newMingPan = createMingPan(
        data.birthYear,
        data.birthMonth,
        data.birthDay,
        birthHour,
        data.gender,
        data.calendarType
      );

      // 金運鑑定を実行
      const result = performFortuneTelling(newMingPan);

      setMingPan(newMingPan);
      setFortuneResult(result);
    } catch (error) {
      console.error('鑑定エラー:', error);
      alert('鑑定中にエラーが発生しました。入力内容を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMingPan(null);
    setFortuneResult(null);
    setNickname('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="stars-bg"></div>

      {/* ヘッダー */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          紫微財運占い
        </h1>
        <p className="text-gray-600 text-lg">
          紫微斗数で読み解く、あなたの金運・財運
        </p>
      </header>

      {/* メインコンテンツ */}
      {!mingPan || !fortuneResult ? (
        <div className="animate-fade-in-up">
          {/* サービス説明 */}
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <div className="fortune-card p-6 mb-6">
              <h2 className="text-xl font-bold gold-text mb-4">
                完全無料の本格金運鑑定
              </h2>
              <p className="text-gray-600 mb-4">
                紫微斗数は、中国で1000年以上の歴史を持つ本格的な命術です。
                <br />
                あなたの生年月日と出生時刻から、
                <br />
                財運・仕事運・資産運を詳細に鑑定します。
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-[#D4AF37]/10 rounded-full text-[#996515] border border-[#D4AF37]/30">
                  金運スコア
                </span>
                <span className="px-3 py-1 bg-[#D4AF37]/10 rounded-full text-[#996515] border border-[#D4AF37]/30">
                  金運タイプ診断
                </span>
                <span className="px-3 py-1 bg-[#D4AF37]/10 rounded-full text-[#996515] border border-[#D4AF37]/30">
                  10年運勢予測
                </span>
                <span className="px-3 py-1 bg-[#D4AF37]/10 rounded-full text-[#996515] border border-[#D4AF37]/30">
                  PDF鑑定書
                </span>
              </div>
            </div>
          </div>

          {/* 入力フォーム */}
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* 特徴説明 */}
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
            <div className="fortune-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">本格的な紫微斗数</h3>
              <p className="text-sm text-gray-600">
                十四主星・四化星・甲級星を完全網羅した本格的な命盤計算
              </p>
            </div>

            <div className="fortune-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">金運特化型鑑定</h3>
              <p className="text-sm text-gray-600">
                財帛宮・官禄宮・田宅宮を徹底分析し、金運を詳細に解説
              </p>
            </div>

            <div className="fortune-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">PDF鑑定書</h3>
              <p className="text-sm text-gray-600">
                鑑定結果を美しいPDFでダウンロード。いつでも見返せます
              </p>
            </div>
          </div>
        </div>
      ) : (
        <FortuneResultWrapper
          mingPan={mingPan}
          fortuneResult={fortuneResult}
          nickname={nickname}
          onReset={handleReset}
        />
      )}

      {/* フッター */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>紫微財運占い - 紫微斗数による金運鑑定サービス</p>
        <p className="mt-2">© 2024 All rights reserved.</p>
      </footer>
    </main>
  );
}

// PDF生成を含む結果表示ラッパー
function FortuneResultWrapper({
  mingPan,
  fortuneResult,
  nickname,
  onReset
}: {
  mingPan: MingPan;
  fortuneResult: FortuneResultType;
  nickname: string;
  onReset: () => void;
}) {
  const { generatePDF } = usePDFGenerator({ mingPan, fortuneResult, nickname });

  return (
    <FortuneResult
      mingPan={mingPan}
      fortuneResult={fortuneResult}
      nickname={nickname}
      onDownloadPDF={generatePDF}
      onReset={onReset}
    />
  );
}
