'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Gamepad2, Zap, Target, Monitor } from 'lucide-react';
import VimEditor from '@/components/editor/VimEditor';
import { createInitialState } from '@/engine';

const demoText = [
  '欢迎来到 Way2Vim！',
  '',
  '点击此编辑器，然后试试：',
  '  h j k l  - 移动光标',
  '  i        - 进入插入模式',
  '  Esc      - 返回普通模式',
  '  dd       - 删除整行',
  '  u        - 撤销',
];

const demoState = createInitialState(demoText);

const features = [
  {
    icon: BookOpen,
    title: '12 节交互课程',
    desc: '从零基础到组合命令，循序渐进掌握 Vim 核心操作',
    color: 'var(--blue)',
  },
  {
    icon: Target,
    title: '即时验证反馈',
    desc: '每一步都有明确目标和实时反馈，支持多种正确路径',
    color: 'var(--green)',
  },
  {
    icon: Zap,
    title: '浏览器内模拟器',
    desc: '无需安装，纯浏览器运行的 Vim 编辑器，随时随地练习',
    color: 'var(--yellow)',
  },
  {
    icon: Monitor,
    title: '进度追踪与勋章',
    desc: '学习天数、完成进度、勋章成就，激励持续学习',
    color: 'var(--purple)',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 lg:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>掌握 </span>
            <span style={{ color: 'var(--green)' }}>Vim</span>
            <span style={{ color: 'var(--text-primary)' }}> 的最佳方式</span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            通过交互式课程和浏览器内模拟器，
            零基础学会 Vim 编辑器的核心操作与思维方式。
          </p>

          <div className="flex gap-3 mt-2">
            <Link
              href="/lessons"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}
            >
              开始学习
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/playground"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm no-underline transition-colors"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--surface-hover)',
              }}
            >
              <Gamepad2 size={16} />
              自由练习
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Demo Editor */}
      <section className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <p
            className="text-sm text-center mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            试试看 — 点击下方编辑器开始体验
          </p>
          <VimEditor initialState={demoState} />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ color: 'var(--text-primary)' }}
          >
            为什么选择 Way2Vim？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 p-5 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--surface-hover)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          准备好了吗？
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          12 节课程，从零开始，轻松掌握 Vim。
        </p>
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium no-underline transition-colors"
          style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}
        >
          开始第一课
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
