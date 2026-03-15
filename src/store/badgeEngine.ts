import type { ProgressState, BadgeDefinition } from '@/types/gamification';
import { allLessons } from '@/lessons/lessonRegistry';

// === Badge Definitions (8 badges per Plan §10.2) ===

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'beginner',
    name: '初学者',
    description: '完成第一课',
    icon: 'GraduationCap',
    condition: (s) => s.completedLessons.includes('lesson-01'),
  },
  {
    id: 'hjkl-master',
    name: 'HJKL大师',
    description: '完成第三课所有步骤',
    icon: 'Gamepad2',
    condition: (s) => s.completedLessons.includes('lesson-03'),
  },
  {
    id: 'insert-pro',
    name: '插入达人',
    description: '完成第四课所有步骤',
    icon: 'Keyboard',
    condition: (s) => s.completedLessons.includes('lesson-04'),
  },
  {
    id: 'command-expert',
    name: '命令行专家',
    description: '完成第五课和第八课',
    icon: 'Terminal',
    condition: (s) =>
      s.completedLessons.includes('lesson-05') && s.completedLessons.includes('lesson-08'),
  },
  {
    id: 'persistence-3d',
    name: '坚持不懈',
    description: '连续学习 3 天',
    icon: 'Flame',
    condition: (s) => s.currentStreakDays >= 3,
  },
  {
    id: 'vim-ninja',
    name: 'Vim忍者',
    description: '完成全部 12 课',
    icon: 'Swords',
    condition: (s) => {
      const allIds = allLessons.map((l) => l.id);
      return allIds.every((id) => s.completedLessons.includes(id));
    },
  },
  {
    id: 'speed-star',
    name: '速度之星',
    description: '任意课程在 2 分钟内完成',
    icon: 'Zap',
    condition: (s) => Object.values(s.lessonBestTimeMs).some((t) => t < 120_000),
  },
  {
    id: 'flawless',
    name: '零失误',
    description: '任意课程零错误完成',
    icon: 'Crown',
    condition: (s) =>
      s.completedLessons.some((id) => (s.lessonMistakeCount[id] ?? 0) === 0),
  },
];

/**
 * Check which badges should be newly unlocked based on current state.
 * Returns an array of badge IDs that are not yet unlocked but whose conditions are met.
 */
export function checkBadges(state: ProgressState): string[] {
  const newBadges: string[] = [];
  for (const badge of badgeDefinitions) {
    if (!state.unlockedBadges.includes(badge.id) && badge.condition(state)) {
      newBadges.push(badge.id);
    }
  }
  return newBadges;
}

/**
 * Get a badge definition by its ID.
 */
export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return badgeDefinitions.find((b) => b.id === badgeId);
}
