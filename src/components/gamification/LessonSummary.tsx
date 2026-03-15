'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Keyboard, AlertCircle, Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import type { BadgeDefinition } from '@/types/gamification';

interface LessonSummaryProps {
  visible: boolean;
  lessonTitle: string;
  durationMs: number;
  keystrokeCount: number;
  mistakeCount: number;
  /** Badges that were newly unlocked during this lesson */
  newBadges?: BadgeDefinition[];
  onNextLesson?: () => void;
  onBackToList?: () => void;
  onRestart?: () => void;
  /** Whether there is a next lesson available */
  hasNextLesson?: boolean;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}分${sec}秒` : `${sec}秒`;
}

export default function LessonSummary({
  visible,
  lessonTitle,
  durationMs,
  keystrokeCount,
  mistakeCount,
  newBadges = [],
  onNextLesson,
  onBackToList,
  onRestart,
  hasNextLesson = true,
}: LessonSummaryProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-5"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--surface-hover)',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Header with confetti-like decoration */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(158, 206, 106, 0.2)' }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.2 }}
              >
                <Trophy size={28} style={{ color: 'var(--green)' }} />
              </motion.div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                课程完成！
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lessonTitle}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={<Clock size={16} />} label="用时" value={formatDuration(durationMs)} />
              <StatCard
                icon={<Keyboard size={16} />}
                label="按键数"
                value={String(keystrokeCount)}
              />
              <StatCard
                icon={<AlertCircle size={16} />}
                label="错误数"
                value={String(mistakeCount)}
                highlight={mistakeCount === 0}
              />
            </div>

            {/* New badges */}
            {newBadges.length > 0 && (
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-medium" style={{ color: 'var(--yellow)' }}>
                  新获得勋章
                </p>
                <div className="flex gap-2">
                  {newBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'rgba(158, 206, 106, 0.15)',
                        color: 'var(--green)',
                        border: '1px solid rgba(158, 206, 106, 0.3)',
                      }}
                    >
                      <Trophy size={12} />
                      {badge.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--surface-hover)',
                  }}
                >
                  <RotateCcw size={14} />
                  重学
                </button>
              )}

              {onBackToList && (
                <button
                  onClick={onBackToList}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--surface-hover)',
                  }}
                >
                  课程列表
                </button>
              )}

              {hasNextLesson && onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--green)',
                    color: 'var(--bg)',
                  }}
                >
                  下一课
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// === Internal stat card ===

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-2.5 rounded-lg"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div style={{ color: highlight ? 'var(--green)' : 'var(--text-secondary)' }}>{icon}</div>
      <span
        className="text-base font-bold"
        style={{ color: highlight ? 'var(--green)' : 'var(--text-primary)' }}
      >
        {value}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
