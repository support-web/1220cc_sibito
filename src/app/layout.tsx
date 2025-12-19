import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "紫微財運占い | 紫微斗数による無料金運鑑定",
  description: "紫微斗数の伝統的な占術で金運・財運を詳細に鑑定。金運スコア、金運タイプ診断、10年運勢予測、適職分析を完全無料で提供。PDF鑑定書のダウンロードも可能。",
  keywords: "紫微斗数, 金運, 財運, 占い, 無料鑑定, 運勢, 財帛宮, 適職診断",
  openGraph: {
    title: "紫微財運占い | 紫微斗数による無料金運鑑定",
    description: "紫微斗数の伝統的な占術であなたの金運を詳細に鑑定。完全無料。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
