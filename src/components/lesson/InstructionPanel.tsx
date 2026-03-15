'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LessonStep, LessonDefinition } from '@/types/lesson';

interface InstructionPanelProps {
  lesson: LessonDefinition;
  step: LessonStep;
  stepIndex: number;
  totalSteps: number;
}

export default function InstructionPanel({
  lesson,
  step,
  stepIndex,
  totalSteps,
}: InstructionPanelProps) {
  const t = useTranslations('lessonPlayer');
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto">
      {/* Lesson header */}
      <div className="flex items-center gap-2 text-text-secondary text-xs">
        <BookOpen size={14} />
        <span>{lesson.title}</span>
      </div>

      {/* Step counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>
          {t('step')} {stepIndex + 1} / {totalSteps}
        </span>
        <span className="text-xs text-text-secondary">
          难度 {'★'.repeat(lesson.difficulty)}{'☆'.repeat(5 - lesson.difficulty)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--surface-hover)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((stepIndex + 1) / totalSteps) * 100}%`,
            backgroundColor: 'var(--green)',
          }}
        />
      </div>

      {/* Instruction */}
      <div
        className="text-sm leading-relaxed p-4 rounded-lg"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        aria-live="polite"
        aria-atomic="true"
      >
        {step.instruction}
      </div>

      {/* Explanation (collapsible) */}
      {step.explanation && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-expanded={showExplanation}
        >
          {showExplanation ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>{t('learnMore')}</span>
        </button>
      )}

      {showExplanation && step.explanation && (
        <div
          className="text-xs leading-relaxed p-3 rounded-lg border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--surface-hover)',
            color: 'var(--text-secondary)',
          }}
        >
          {step.explanation}
        </div>
      )}
    </div>
  );
}
