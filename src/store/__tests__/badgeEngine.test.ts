import { describe, it, expect } from 'vitest';
import { checkBadges, badgeDefinitions, getBadgeById } from '../badgeEngine';
import type { ProgressState } from '@/types/gamification';

function makeProgress(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    completedLessons: [],
    completedSteps: {},
    currentStreakDays: 0,
    lastActiveDate: undefined,
    totalKeystrokes: 0,
    totalCommandsExecuted: 0,
    lessonBestTimeMs: {},
    lessonMistakeCount: {},
    unlockedBadges: [],
    ...overrides,
  };
}

const ALL_LESSON_IDS = Array.from({ length: 12 }, (_, i) =>
  `lesson-${String(i + 1).padStart(2, '0')}`,
);

describe('badgeDefinitions', () => {
  it('has exactly 8 badges', () => {
    expect(badgeDefinitions).toHaveLength(8);
  });

  it('all badges have unique IDs', () => {
    const ids = badgeDefinitions.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getBadgeById', () => {
  it('returns badge by ID', () => {
    const badge = getBadgeById('beginner');
    expect(badge).toBeDefined();
    expect(badge!.name).toBe('初学者');
  });

  it('returns undefined for unknown ID', () => {
    expect(getBadgeById('nonexistent')).toBeUndefined();
  });
});

describe('checkBadges', () => {
  it('returns empty when no conditions met', () => {
    const state = makeProgress();
    expect(checkBadges(state)).toEqual([]);
  });

  it('does not return already-unlocked badges', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      unlockedBadges: ['beginner'],
    });
    expect(checkBadges(state)).not.toContain('beginner');
  });
});

// === Individual badge conditions ===

describe('beginner badge', () => {
  it('unlocks when lesson-01 is completed', () => {
    const state = makeProgress({ completedLessons: ['lesson-01'] });
    expect(checkBadges(state)).toContain('beginner');
  });

  it('does not unlock without lesson-01', () => {
    const state = makeProgress({ completedLessons: ['lesson-02'] });
    expect(checkBadges(state)).not.toContain('beginner');
  });
});

describe('hjkl-master badge', () => {
  it('unlocks when lesson-03 is completed', () => {
    const state = makeProgress({ completedLessons: ['lesson-03'] });
    expect(checkBadges(state)).toContain('hjkl-master');
  });

  it('does not unlock without lesson-03', () => {
    const state = makeProgress({ completedLessons: ['lesson-01', 'lesson-02'] });
    expect(checkBadges(state)).not.toContain('hjkl-master');
  });
});

describe('insert-pro badge', () => {
  it('unlocks when lesson-04 is completed', () => {
    const state = makeProgress({ completedLessons: ['lesson-04'] });
    expect(checkBadges(state)).toContain('insert-pro');
  });
});

describe('command-expert badge', () => {
  it('unlocks when both lesson-05 and lesson-08 are completed', () => {
    const state = makeProgress({ completedLessons: ['lesson-05', 'lesson-08'] });
    expect(checkBadges(state)).toContain('command-expert');
  });

  it('does not unlock with only lesson-05', () => {
    const state = makeProgress({ completedLessons: ['lesson-05'] });
    expect(checkBadges(state)).not.toContain('command-expert');
  });

  it('does not unlock with only lesson-08', () => {
    const state = makeProgress({ completedLessons: ['lesson-08'] });
    expect(checkBadges(state)).not.toContain('command-expert');
  });
});

describe('persistence-3d badge', () => {
  it('unlocks at 3 day streak', () => {
    const state = makeProgress({ currentStreakDays: 3 });
    expect(checkBadges(state)).toContain('persistence-3d');
  });

  it('does not unlock at 2 day streak', () => {
    const state = makeProgress({ currentStreakDays: 2 });
    expect(checkBadges(state)).not.toContain('persistence-3d');
  });
});

describe('vim-ninja badge', () => {
  it('unlocks when all 12 lessons are completed', () => {
    const state = makeProgress({ completedLessons: ALL_LESSON_IDS });
    expect(checkBadges(state)).toContain('vim-ninja');
  });

  it('does not unlock with 11 lessons', () => {
    const state = makeProgress({ completedLessons: ALL_LESSON_IDS.slice(0, 11) });
    expect(checkBadges(state)).not.toContain('vim-ninja');
  });
});

describe('speed-star badge', () => {
  it('unlocks when any lesson completed under 2 minutes', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      lessonBestTimeMs: { 'lesson-01': 90_000 },
    });
    expect(checkBadges(state)).toContain('speed-star');
  });

  it('does not unlock when all times >= 2 minutes', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      lessonBestTimeMs: { 'lesson-01': 130_000 },
    });
    expect(checkBadges(state)).not.toContain('speed-star');
  });
});

describe('flawless badge', () => {
  it('unlocks when any completed lesson has 0 mistakes', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      lessonMistakeCount: { 'lesson-01': 0 },
    });
    expect(checkBadges(state)).toContain('flawless');
  });

  it('unlocks when mistake count is absent (implicit 0) for a completed lesson', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      lessonMistakeCount: {},
    });
    expect(checkBadges(state)).toContain('flawless');
  });

  it('does not unlock when all completed lessons have mistakes', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01'],
      lessonMistakeCount: { 'lesson-01': 3 },
    });
    expect(checkBadges(state)).not.toContain('flawless');
  });
});

describe('multiple badges at once', () => {
  it('returns multiple newly qualified badges', () => {
    const state = makeProgress({
      completedLessons: ['lesson-01', 'lesson-03'],
      lessonBestTimeMs: { 'lesson-01': 50_000 },
      lessonMistakeCount: { 'lesson-01': 0 },
    });
    const badges = checkBadges(state);
    expect(badges).toContain('beginner');
    expect(badges).toContain('hjkl-master');
    expect(badges).toContain('speed-star');
    expect(badges).toContain('flawless');
  });
});
