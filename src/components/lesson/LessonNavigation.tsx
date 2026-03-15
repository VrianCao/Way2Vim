'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';

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
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--surface-hover)' }}>
      {/* Left actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="退出课程"
        >
          <ArrowLeft size={14} />
          退出
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="重新开始"
        >
          <RotateCcw size={14} />
          重来
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
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
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={14} />
          上一步
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: 'var(--cyan)' }}
        >
          下一步
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
