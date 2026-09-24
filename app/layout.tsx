import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'temstream · Moonlight + Sunshine 中文指南',
  description:
    'temstream 是一个非官方 Moonlight + Sunshine 中文站点，提供 Windows / Android 客户端与 Windows 服务端的下载、教程与常见问题。',
  metadataBase: new URL('https://temstream.example.com'),
  openGraph: {
    title: 'temstream · Moonlight + Sunshine 中文指南',
    description:
      '开源、低延迟、自托管的游戏串流方案。Windows / Android 客户端 + Windows 服务端一键下载。',
    type: 'website',
    locale: 'zh_CN',
  },
};

// Root layout is intentionally empty: the [locale]/layout.tsx renders the
// <html> and <body> per locale (required pattern for next-intl + static
// export).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}