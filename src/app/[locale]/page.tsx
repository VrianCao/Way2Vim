'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Gamepad2, Zap, Target, Monitor } from 'lucide-react';
import VimEditor from '@/components/editor/VimEditor';
import { createInitialState } from '@/engine';
import PageTransition from '@/components/layout/PageTransition';

export default function Home() {
  const t = useTranslations('landing');

  const demoText = [
    'Welcome to Way2Vim!',
    '',
    'Click this editor, then try:',
    '  h j k l  - move cursor',
    '  i        - enter insert mode',
    '  Esc      - return to normal mode',
    '  dd       - delete line',
    '  u        - undo',
  ];

  const demoState = createInitialState(demoText);

  const features = [
    { icon: BookOpen, color: 'var(--blue)' },
    { icon: Target, color: 'var(--green)' },
    { icon: Zap, color: 'var(--yellow)' },
    { icon: Monitor, color: 'var(--purple)' },
  ];
  return (
    <PageTransition>
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 lg:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t('heroTitle')}
          </h1>

          <p
            className="text-base sm:text-lg max-w-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('heroSubtitle')}
          </p>

          <div className="flex gap-3 mt-2">
            <Link
              href="/lessons"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}
            >
              {t('startLearning')}
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
              {t('freePractice')}
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
            {t('demoPrompt')}
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
            {t('featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, color }, idx) => (
              <motion.div
                key={idx}
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
                    {t(`feature${idx + 1}Title`)}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t(`feature${idx + 1}Desc`)}
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
          {t('ctaTitle')}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('ctaSubtitle')}
        </p>
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium no-underline transition-colors"
          style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}
        >
          {t('ctaButton')}
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
    </PageTransition>
  );
}
