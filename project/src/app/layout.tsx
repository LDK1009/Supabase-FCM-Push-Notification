// 임포트
import type { Metadata, Viewport } from "next";

// 뷰포트 & 메타 데이터 정의
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Supabase-FCM-Push-Notification",
  description: "Supabase-FCM-Push-Notification",
  manifest: "/manifest.json",
  icons: {
    icon: "/img/app-icon-192.png",
    apple: "/img/app-icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* PWA 관련 메타 태그 추가 */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/img/app-icon-192.png(아이콘 경로)" />
      </head>
      {/* PWA 관련 메타 태그 추가 END */}
      <body>{children}</body>
    </html>
  );
}
