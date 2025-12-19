'use client';

import { MingPan, FortuneResult as FortuneResultType } from '@/types';
import ScoreMeter from './ScoreMeter';
import MingPanChart from './MingPanChart';
import FortuneGraph from './FortuneGraph';
import { FORTUNE_TYPES } from '@/lib/constants';

interface FortuneResultProps {
  mingPan: MingPan;
  fortuneResult: FortuneResultType;
  nickname?: string;
  onDownloadPDF: () => void;
  onReset: () => void;
}

export default function FortuneResult({
  mingPan,
  fortuneResult,
  nickname,
  onDownloadPDF,
  onReset
}: FortuneResultProps) {
  const fortuneTypeInfo = FORTUNE_TYPES[fortuneResult.fortuneType];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* LINE誘導バナー（上部） */}
      <div className="fortune-card p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-green-400">LINE登録で詳細鑑定プレゼント！</p>
            <p className="text-sm text-[#A0A0C0]">毎月の金運情報も無料で配信中</p>
          </div>
          <button className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-full font-bold transition-colors">
            今すぐ登録 →
          </button>
        </div>
      </div>

      {/* 金運スコア */}
      <div className="fortune-card p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
          {nickname ? `${nickname}さんの` : 'あなたの'}金運鑑定結果
        </h2>
        <p className="text-[#A0A0C0] mb-8">紫微斗数による金運総合評価</p>

        <div className="flex justify-center mb-8">
          <ScoreMeter score={fortuneResult.score} />
        </div>

        <div className="inline-block px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500">
          <span className="text-lg">あなたの金運タイプ: </span>
          <span className="text-xl font-bold gold-text">{fortuneResult.fortuneType}</span>
        </div>
      </div>

      {/* 金運タイプ解説 */}
      <div className="fortune-card p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text">
          {fortuneResult.fortuneType}とは？
        </h3>
        <p className="text-[#A0A0C0] mb-4">{fortuneTypeInfo.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-purple-400 mb-2">成功パターン</h4>
            <p className="text-sm text-[#A0A0C0]">{fortuneTypeInfo.successPattern}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-cyan-400 mb-2">向いている職業</h4>
            <div className="flex flex-wrap gap-2">
              {fortuneTypeInfo.jobs.map((job, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-cyan-500/20 rounded text-sm text-cyan-300"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 財帛宮解説 */}
      <div className="fortune-card p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text">財帛宮からみる金運</h3>
        <div className="whitespace-pre-line text-[#A0A0C0]">
          {fortuneResult.description.caibogong}
        </div>
      </div>

      {/* 成功パターン */}
      <div className="fortune-card p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text">成功パターン分析</h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500 font-bold gold-text">
            {fortuneResult.successPattern}
          </span>
        </div>
        <div className="whitespace-pre-line text-[#A0A0C0]">
          {fortuneResult.description.successPatternDesc}
        </div>
      </div>

      {/* 適職TOP5 */}
      <div className="fortune-card p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text">あなたに向いている職業 TOP5</h3>
        <div className="space-y-3">
          {fortuneResult.jobRecommendations.map((job, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  idx === 0
                    ? 'bg-yellow-500 text-black'
                    : idx === 1
                    ? 'bg-gray-400 text-black'
                    : idx === 2
                    ? 'bg-amber-700 text-white'
                    : 'bg-purple-500/50 text-white'
                }`}
              >
                {idx + 1}
              </span>
              <span className="text-lg">{job}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10年運勢グラフ */}
      <FortuneGraph yearlyFortune={fortuneResult.yearlyFortune} />

      {/* 命盤図 */}
      <MingPanChart mingPan={mingPan} />

      {/* 今年のアドバイス */}
      <div className="fortune-card p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text">
          {new Date().getFullYear()}年の金運アドバイス
        </h3>
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
          <p className="text-lg">{fortuneResult.yearlyFortune[0]?.description}</p>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={onDownloadPDF}
          className="fortune-button flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF鑑定書をダウンロード
        </button>
        <button
          onClick={onReset}
          className="px-8 py-4 rounded-xl border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 transition-colors font-bold"
        >
          もう一度鑑定する
        </button>
      </div>

      {/* LINE誘導（下部） */}
      <div className="fortune-card p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 gradient-text">
          もっと詳しい鑑定を受けたい方へ
        </h3>
        <p className="text-[#A0A0C0] mb-6">
          LINE公式アカウントでは、毎月の金運情報や<br />
          限定の開運アドバイスを無料でお届けしています
        </p>

        <div className="inline-block p-6 bg-white rounded-lg mb-6">
          {/* QRコードのプレースホルダー */}
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            QRコード
          </div>
        </div>

        <div className="space-y-2 text-sm text-[#A0A0C0]">
          <p>【LINE特典】</p>
          <ul className="inline-block text-left">
            <li>✓ 毎月の金運カレンダー</li>
            <li>✓ ラッキーカラー・ラッキーアイテム</li>
            <li>✓ 有料鑑定の割引クーポン</li>
            <li>✓ 金運アップ開運情報</li>
          </ul>
        </div>

        <button className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full font-bold text-lg transition-colors">
          LINE友達追加する
        </button>
      </div>

      {/* 免責事項 */}
      <div className="text-center text-xs text-[#A0A0C0] p-4">
        <p>
          ※ 本鑑定は紫微斗数に基づく占い結果であり、娯楽目的としてご利用ください。
          <br />
          投資・金融判断は自己責任で行ってください。
        </p>
      </div>
    </div>
  );
}
