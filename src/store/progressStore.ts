import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressState } from '@/types/gamification';
import { checkBadges } from './badgeEngine';

// === Helper: today as YYYY-MM-DD ===

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// === Store interface ===

interface ProgressActions {
  completeStep: (lessonId: string, stepId: string) => void;
  completeLesson: (lessonId: string, timeMs: number, mistakeCount: number) => void;
  recordKeystroke: (count?: number) => void;
  recordMistake: (lessonId: string) => void;
  updateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  reset: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

const initialState: ProgressState = {
  completedLessons: [],
  completedSteps: {},
  currentStreakDays: 0,
  lastActiveDate: undefined,
  totalKeystrokes: 0,
  totalCommandsExecuted: 0,
  lessonBestTimeMs: {},
  lessonMistakeCount: {},
  unlockedBadges: [],
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      ...initialState,

      completeStep: (lessonId, stepId) =>
        set((state) => {
          const existing = state.completedSteps[lessonId] ?? [];
          if (existing.includes(stepId)) return state;
          return {
            completedSteps: {
              ...state.completedSteps,
              [lessonId]: [...existing, stepId],
            },
          };
        }),

      completeLesson: (lessonId, timeMs, mistakeCount) =>
        set((state) => {
          const alreadyCompleted = state.completedLessons.includes(lessonId);
          const prevBest = state.lessonBestTimeMs[lessonId];
          const bestTime = prevBest === undefined ? timeMs : Math.min(prevBest, timeMs);
          const prevMistakes = state.lessonMistakeCount[lessonId];
          const bestMistakes =
            prevMistakes === undefined ? mistakeCount : Math.min(prevMistakes, mistakeCount);

          return {
            completedLessons: alreadyCompleted
              ? state.completedLessons
              : [...state.completedLessons, lessonId],
            totalCommandsExecuted: state.totalCommandsExecuted + 1,
            lessonBestTimeMs: {
              ...state.lessonBestTimeMs,
              [lessonId]: bestTime,
            },
            lessonMistakeCount: {
              ...state.lessonMistakeCount,
              [lessonId]: bestMistakes,
            },
          };
        }),

      recordKeystroke: (count = 1) =>
        set((state) => ({
          totalKeystrokes: state.totalKeystrokes + count,
        })),

      recordMistake: (lessonId) =>
        set((state) => ({
          lessonMistakeCount: {
            ...state.lessonMistakeCount,
            [lessonId]: (state.lessonMistakeCount[lessonId] ?? 0) + 1,
          },
        })),

      updateStreak: () =>
        set((state) => {
          const today = todayStr();
          if (state.lastActiveDate === today) return state;

          // Check if yesterday was last active day
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

          const isConsecutive = state.lastActiveDate === yesterdayStr;

          return {
            currentStreakDays: isConsecutive ? state.currentStreakDays + 1 : 1,
            lastActiveDate: today,
          };
        }),

      unlockBadge: (badgeId) =>
        set((state) => {
          if (state.unlockedBadges.includes(badgeId)) return state;
          return {
            unlockedBadges: [...state.unlockedBadges, badgeId],
          };
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'way2vim-progress',
    },
  ),
);

// === Auto badge check on state changes ===

useProgressStore.subscribe((state) => {
  const newBadges = checkBadges(state);
  if (newBadges.length > 0) {
    for (const badgeId of newBadges) {
      state.unlockBadge(badgeId);
    }
  }
});

// === Selectors ===

export function isLessonCompleted(state: ProgressState, lessonId: string): boolean {
  return state.completedLessons.includes(lessonId);
}

export function getLessonProgress(
  state: ProgressState,
  lessonId: string,
  totalSteps: number,
): number {
  if (totalSteps === 0) return 0;
  const completed = state.completedSteps[lessonId] ?? [];
  return completed.length / totalSteps;
}

export function getUnlockedBadges(state: ProgressState): string[] {
  return state.unlockedBadges;
}
