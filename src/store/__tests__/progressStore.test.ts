import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore, isLessonCompleted, getLessonProgress, getUnlockedBadges } from '../progressStore';

beforeEach(() => {
  useProgressStore.getState().reset();
});

describe('progressStore', () => {
  // === completeStep ===

  it('records a completed step', () => {
    const { completeStep } = useProgressStore.getState();
    completeStep('lesson-01', 'step-1');

    const state = useProgressStore.getState();
    expect(state.completedSteps['lesson-01']).toEqual(['step-1']);
  });

  it('does not duplicate completed steps', () => {
    const { completeStep } = useProgressStore.getState();
    completeStep('lesson-01', 'step-1');
    completeStep('lesson-01', 'step-1');

    const state = useProgressStore.getState();
    expect(state.completedSteps['lesson-01']).toEqual(['step-1']);
  });

  it('tracks steps per lesson independently', () => {
    const { completeStep } = useProgressStore.getState();
    completeStep('lesson-01', 'step-1');
    completeStep('lesson-02', 'step-a');

    const state = useProgressStore.getState();
    expect(state.completedSteps['lesson-01']).toEqual(['step-1']);
    expect(state.completedSteps['lesson-02']).toEqual(['step-a']);
  });

  // === completeLesson ===

  it('records a completed lesson with time and mistakes', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('lesson-01', 60000, 2);

    const state = useProgressStore.getState();
    expect(state.completedLessons).toEqual(['lesson-01']);
    expect(state.lessonBestTimeMs['lesson-01']).toBe(60000);
    expect(state.lessonMistakeCount['lesson-01']).toBe(2);
  });

  it('does not duplicate completed lessons', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('lesson-01', 60000, 2);
    completeLesson('lesson-01', 50000, 1);

    const state = useProgressStore.getState();
    expect(state.completedLessons).toEqual(['lesson-01']);
  });

  it('keeps best (lowest) time and mistake count on re-completion', () => {
    const { completeLesson } = useProgressStore.getState();
    completeLesson('lesson-01', 60000, 5);
    completeLesson('lesson-01', 40000, 3);

    const state = useProgressStore.getState();
    expect(state.lessonBestTimeMs['lesson-01']).toBe(40000);
    expect(state.lessonMistakeCount['lesson-01']).toBe(3);
  });

  // === recordKeystroke ===

  it('increments keystroke count', () => {
    const { recordKeystroke } = useProgressStore.getState();
    recordKeystroke();
    recordKeystroke(5);

    const state = useProgressStore.getState();
    expect(state.totalKeystrokes).toBe(6);
  });

  // === recordMistake ===

  it('increments mistake count for a lesson', () => {
    const { recordMistake } = useProgressStore.getState();
    recordMistake('lesson-03');
    recordMistake('lesson-03');

    const state = useProgressStore.getState();
    expect(state.lessonMistakeCount['lesson-03']).toBe(2);
  });

  // === updateStreak ===

  it('starts a new streak on first activity', () => {
    const { updateStreak } = useProgressStore.getState();
    updateStreak();

    const state = useProgressStore.getState();
    expect(state.currentStreakDays).toBe(1);
    expect(state.lastActiveDate).toBeDefined();
  });

  it('does not increment streak when called twice on the same day', () => {
    const { updateStreak } = useProgressStore.getState();
    updateStreak();
    updateStreak();

    const state = useProgressStore.getState();
    expect(state.currentStreakDays).toBe(1);
  });

  it('resets streak to 1 when lastActiveDate is not yesterday', () => {
    // Simulate a gap: set lastActiveDate to 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dateStr = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(threeDaysAgo.getDate()).padStart(2, '0')}`;

    useProgressStore.setState({ lastActiveDate: dateStr, currentStreakDays: 5 });
    useProgressStore.getState().updateStreak();

    const state = useProgressStore.getState();
    expect(state.currentStreakDays).toBe(1);
  });

  it('increments streak when lastActiveDate is yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    useProgressStore.setState({ lastActiveDate: dateStr, currentStreakDays: 3 });
    useProgressStore.getState().updateStreak();

    const state = useProgressStore.getState();
    expect(state.currentStreakDays).toBe(4);
  });

  // === unlockBadge ===

  it('unlocks a badge', () => {
    const { unlockBadge } = useProgressStore.getState();
    unlockBadge('beginner');

    const state = useProgressStore.getState();
    expect(state.unlockedBadges).toEqual(['beginner']);
  });

  it('does not duplicate unlocked badges', () => {
    const { unlockBadge } = useProgressStore.getState();
    unlockBadge('beginner');
    unlockBadge('beginner');

    const state = useProgressStore.getState();
    expect(state.unlockedBadges).toEqual(['beginner']);
  });

  // === reset ===

  it('resets all state to initial values', () => {
    const s = useProgressStore.getState();
    s.completeStep('lesson-01', 'step-1');
    s.completeLesson('lesson-01', 5000, 0);
    s.recordKeystroke(100);
    s.unlockBadge('beginner');
    s.updateStreak();

    useProgressStore.getState().reset();

    const state = useProgressStore.getState();
    expect(state.completedLessons).toEqual([]);
    expect(state.completedSteps).toEqual({});
    expect(state.totalKeystrokes).toBe(0);
    expect(state.unlockedBadges).toEqual([]);
    expect(state.currentStreakDays).toBe(0);
  });
});

// === Selectors ===

describe('selectors', () => {
  it('isLessonCompleted returns true for completed lesson', () => {
    useProgressStore.getState().completeLesson('lesson-01', 5000, 0);
    const state = useProgressStore.getState();
    expect(isLessonCompleted(state, 'lesson-01')).toBe(true);
    expect(isLessonCompleted(state, 'lesson-02')).toBe(false);
  });

  it('getLessonProgress returns correct ratio', () => {
    useProgressStore.getState().completeStep('lesson-01', 'step-1');
    useProgressStore.getState().completeStep('lesson-01', 'step-2');
    const state = useProgressStore.getState();
    expect(getLessonProgress(state, 'lesson-01', 5)).toBe(0.4);
  });

  it('getLessonProgress returns 0 when totalSteps is 0', () => {
    const state = useProgressStore.getState();
    expect(getLessonProgress(state, 'lesson-01', 0)).toBe(0);
  });

  it('getUnlockedBadges returns the badge list', () => {
    useProgressStore.getState().unlockBadge('beginner');
    useProgressStore.getState().unlockBadge('vim-ninja');
    const state = useProgressStore.getState();
    expect(getUnlockedBadges(state)).toEqual(['beginner', 'vim-ninja']);
  });
});
