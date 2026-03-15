'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface KeyVisualizerProps {
  keys: string[];
  maxDisplay?: number;
}

function formatKeyLabel(key: string): string {
  switch (key) {
    case '<Esc>': return 'Esc';
    case '<Enter>': return 'Enter';
    case '<Backspace>': return 'Bksp';
    case '<Tab>': return 'Tab';
    case '<C-r>': return 'Ctrl+R';
    case ' ': return 'Space';
    default: return key;
  }
}

export default function KeyVisualizer({ keys, maxDisplay = 8 }: KeyVisualizerProps) {
  const t = useTranslations('lessonPlayer');
  const visible = keys.slice(-maxDisplay);

  return (
    <div className="flex items-center gap-1.5 px-5 py-2 min-h-[36px] flex-wrap">
      <span className="text-xs mr-1" style={{ color: 'var(--text-secondary)' }}>
        {t('keys')}:
      </span>
      <AnimatePresence mode="popLayout">
        {visible.map((key, i) => {
          const uniqueKey = `${keys.length - visible.length + i}-${key}`;
          return (
            <motion.span
              key={uniqueKey}
              initial={{ scale: 1.3, opacity: 0, y: -4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-mono"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(192, 202, 245, 0.15)',
                minWidth: '24px',
              }}
            >
              {formatKeyLabel(key)}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
