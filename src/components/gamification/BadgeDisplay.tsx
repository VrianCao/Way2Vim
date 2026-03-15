'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  GraduationCap,
  Gamepad2,
  Keyboard,
  Terminal,
  Flame,
  Swords,
  Zap,
  Crown,
} from 'lucide-react';
import type { BadgeDefinition } from '@/types/gamification';

// Map icon name -> component
const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  GraduationCap,
  Gamepad2,
  Keyboard,
  Terminal,
  Flame,
  Swords,
  Zap,
  Crown,
};

interface BadgeDisplayProps {
  badges: BadgeDefinition[];
  unlockedIds: string[];
  /** IDs of badges that were just unlocked (triggers glow animation) */
  newlyUnlockedIds?: string[];
}

export default function BadgeDisplay({
  badges,
  unlockedIds,
  newlyUnlockedIds = [],
}: BadgeDisplayProps) {
  const t = useTranslations('badges');
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const newSet = useMemo(() => new Set(newlyUnlockedIds), [newlyUnlockedIds]);

  return (
    <div className="grid grid-cols-4 gap-3">
      <AnimatePresence>
        {badges.map((badge) => {
          const unlocked = unlockedSet.has(badge.id);
          const isNew = newSet.has(badge.id);
          const Icon = iconMap[badge.icon];

          return (
            <motion.div
              key={badge.id}
              className="relative flex flex-col items-center gap-1.5 p-3 rounded-lg group cursor-default"
              style={{
                backgroundColor: unlocked
                  ? 'rgba(158, 206, 106, 0.1)'
                  : 'var(--surface)',
                border: `1px solid ${unlocked ? 'rgba(158, 206, 106, 0.3)' : 'var(--surface-hover)'}`,
              }}
              initial={isNew ? { scale: 0.5, opacity: 0 } : false}
              animate={
                isNew
                  ? {
                      scale: 1,
                      opacity: 1,
                      boxShadow: [
                        '0 0 0 0 rgba(158,206,106,0)',
                        '0 0 20px 4px rgba(158,206,106,0.4)',
                        '0 0 0 0 rgba(158,206,106,0)',
                      ],
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                isNew
                  ? { type: 'spring', stiffness: 300, damping: 15 }
                  : undefined
              }
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: unlocked
                    ? 'rgba(158, 206, 106, 0.2)'
                    : 'var(--surface-hover)',
                }}
              >
                {Icon && (
                  <Icon
                    size={20}
                    style={{
                      color: unlocked ? 'var(--green)' : 'var(--text-secondary)',
                      opacity: unlocked ? 1 : 0.4,
                    }}
                  />
                )}
              </div>

              <span
                className="text-xs text-center font-medium"
                style={{
                  color: unlocked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                {t(`${badge.id}.name`)}
              </span>

              {/* Hover tooltip */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                style={{
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--surface-hover)',
                }}
              >
                {t(`${badge.id}.description`)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
