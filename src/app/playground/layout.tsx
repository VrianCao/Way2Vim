import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '练习场',
  description: '在 Way2Vim 练习场中自由练习 Vim 命令，无课程限制，随时随地提升你的 Vim 技能。',
  openGraph: {
    title: '练习场 - Way2Vim',
    description: '自由练习 Vim 命令，无课程限制。',
  },
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
