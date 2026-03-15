'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  /** 0–1 ratio of completed steps */
  progress: number;
  /** Optional label, e.g. "3 / 5 步骤" */
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-hover)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--green)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
