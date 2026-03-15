import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '课程列表',
  description: 'Way2Vim 的 12 节交互式 Vim 课程。从零基础开始，循序渐进掌握 Vim 核心操作。',
  openGraph: {
    title: '课程列表 - Way2Vim',
    description: 'Way2Vim 的 12 节交互式 Vim 课程，循序渐进掌握 Vim。',
  },
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
