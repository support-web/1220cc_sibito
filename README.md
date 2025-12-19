# 紫微財運占い

紫微斗数の伝統的な占術を用いて、金運・財運を詳細に鑑定する無料Webサービスです。

## 機能

- **金運スコア診断**: 100点満点で金運を評価
- **金運タイプ診断**: 8つの金運タイプ（帝王財運型、実業家型、蓄財型など）
- **10年運勢予測**: グラフで視覚的に運勢の推移を表示
- **適職診断**: 向いている職業TOP5を提案
- **命盤表示**: 紫微斗数の命盤を視覚的に表示
- **PDF鑑定書**: 鑑定結果をPDFでダウンロード可能

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **グラフ**: Recharts
- **暦変換**: lunar-javascript
- **PDF生成**: jsPDF

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

開発サーバーは http://localhost:3000 で起動します。

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # メインページ
│   ├── layout.tsx          # レイアウト
│   └── globals.css         # グローバルスタイル
├── components/             # Reactコンポーネント
│   ├── InputForm.tsx       # 入力フォーム
│   ├── FortuneResult.tsx   # 結果表示
│   ├── MingPanChart.tsx    # 命盤表示
│   ├── FortuneGraph.tsx    # 運勢グラフ
│   ├── ScoreMeter.tsx      # スコアメーター
│   └── PDFGenerator.tsx    # PDF生成
├── lib/                    # ビジネスロジック
│   ├── ziwei/              # 紫微斗数計算
│   ├── calendar.ts         # 暦変換
│   ├── constants.ts        # 定数
│   ├── fortune.ts          # 金運鑑定ロジック
│   └── utils.ts            # ユーティリティ
└── types/                  # TypeScript型定義
    └── index.ts
```

## 紫微斗数について

紫微斗数は中国で1000年以上の歴史を持つ命術です。生年月日と出生時刻から命盤を作成し、十四主星・四化星などの配置から運勢を読み解きます。

## ライセンス

All rights reserved.
