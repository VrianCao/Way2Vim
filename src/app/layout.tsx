import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "./LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Way2Vim - 交互式 Vim 学习平台',
    template: '%s - Way2Vim',
  },
  description:
    '通过浏览器内交互式课程，零基础学会 Vim 编辑器的核心操作与思维方式。12 节渐进课程，即时反馈，免费开源。',
  keywords: ['Vim', 'Vim教程', 'Vim学习', '交互式学习', '编辑器', 'Way2Vim', '命令行'],
  authors: [{ name: 'Way2Vim' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Way2Vim',
    title: 'Way2Vim - 交互式 Vim 学习平台',
    description: '通过浏览器内交互式课程，零基础学会 Vim 编辑器的核心操作与思维方式。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Way2Vim - 交互式 Vim 学习平台',
    description: '通过浏览器内交互式课程，零基础学会 Vim 编辑器的核心操作与思维方式。',
  },
  metadataBase: new URL('https://way2vim.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
