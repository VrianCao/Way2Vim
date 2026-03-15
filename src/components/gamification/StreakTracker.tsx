'use client';

import { useMemo } from 'react';
import { Flame } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  lastActiveDate?: string;
  /** Dates the user was active (YYYY-MM-DD). Used to fill the heatmap. */
  activeDates?: string[];
}

/**
 * Generate past N days as YYYY-MM-DD strings.
 */
function pastDays(count: number, today: Date = new Date()): string[] {
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
  }
  return days;
}

export default function StreakTracker({
  currentStreak,
  lastActiveDate,
  activeDates = [],
}: StreakTrackerProps) {
  const activeSet = useMemo(() => new Set(activeDates), [activeDates]);

  // If we don't have explicit activeDates, derive from streak + lastActiveDate
  const effectiveActiveSet = useMemo(() => {
    if (activeDates.length > 0) return activeSet;
    if (!lastActiveDate || currentStreak === 0) return new Set<string>();

    const last = new Date(lastActiveDate + 'T00:00:00');
    const dates = new Set<string>();
    for (let i = 0; i < currentStreak; i++) {
      const d = new Date(last);
      d.setDate(d.getDate() - i);
      dates.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      );
    }
    return dates;
  }, [activeDates.length, activeSet, lastActiveDate, currentStreak]);

  const days = useMemo(() => pastDays(30), []);

  return (
    <div className="flex flex-col gap-3">
      {/* Streak counter */}
      <div className="flex items-center gap-2">
        <Flame
          size={20}
          style={{ color: currentStreak > 0 ? 'var(--yellow)' : 'var(--text-secondary)' }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {currentStreak > 0 ? `连续学习 ${currentStreak} 天` : '开始你的连续学习之旅'}
        </span>
      </div>

      {/* Heatmap grid: 30 days in a row of 7 columns */}
      <div className="flex flex-wrap gap-1">
        {days.map((day) => {
          const active = effectiveActiveSet.has(day);
          return (
            <div
              key={day}
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: active
                  ? 'var(--green)'
                  : 'var(--surface-hover)',
                opacity: active ? 1 : 0.4,
              }}
              title={day}
            />
          );
        })}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        最近 30 天学习记录
      </p>
    </div>
  );
}
