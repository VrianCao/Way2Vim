'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LessonNavigationProps {
  stepIndex: number;
  totalSteps: number;
  completedSteps: boolean[];
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  onExit: () => void;
  canGoNext: boolean;
}

export default function LessonNavigation({
  stepIndex,
  totalSteps,
  completedSteps,
  onPrev,
  onNext,
  onRestart,
  onExit,
  canGoNext,
}: LessonNavigationProps) {
  const t = useTranslations('lessonPlayer');
  return (
    <nav
      className="flex items-center justify-between px-5 py-3 border-t"
      style={{ borderColor: 'var(--surface-hover)' }}
      aria-label={t('step')}
    >
      {/* Left actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={t('exit')}
        >
          <ArrowLeft size={14} />
          {t('exit')}
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={t('restart')}
        >
          <RotateCcw size={14} />
          {t('restartShort')}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`${t('step')} ${stepIndex + 1} / ${totalSteps}`}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                completedSteps[i]
                  ? 'var(--green)'
                  : i === stepIndex
                    ? 'var(--cyan)'
                    : 'var(--surface-hover)',
              transform: i === stepIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={t('prevStep')}
        >
          <ChevronLeft size={14} />
          {t('prevStep')}
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          style={{ color: 'var(--cyan)' }}
          aria-label={t('nextStep')}
        >
          {t('nextStep')}
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}
