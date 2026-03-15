import type { LessonDefinition } from '../types/lesson';

import { lesson01 } from './data/lesson-01-what-is-vim';
import { lesson02 } from './data/lesson-02-enter-exit';
import { lesson03 } from './data/lesson-03-hjkl-movement';
import { lesson04 } from './data/lesson-04-insert-mode';
import { lesson05 } from './data/lesson-05-save-quit';
import { lesson06 } from './data/lesson-06-delete-undo';
import { lesson07 } from './data/lesson-07-copy-paste';
import { lesson08 } from './data/lesson-08-search-replace';
import { lesson09 } from './data/lesson-09-visual-mode';
import { lesson10 } from './data/lesson-10-advanced-movement';
import { lesson11 } from './data/lesson-11-compound-commands';
import { lesson12 } from './data/lesson-12-tips-config';

/**
 * Ordered list of all lessons.
 */
export const allLessons: LessonDefinition[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
];

/**
 * Get a lesson by its ID.
 */
export function getLessonById(id: string): LessonDefinition | undefined {
  return allLessons.find((l) => l.id === id);
}

/**
 * Get the next lesson after the given lesson ID.
 * Returns undefined if currentId is the last lesson or not found.
 */
export function getNextLesson(currentId: string): LessonDefinition | undefined {
  const idx = allLessons.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx === allLessons.length - 1) {
    return undefined;
  }
  return allLessons[idx + 1];
}

/**
 * Get the previous lesson before the given lesson ID.
 */
export function getPrevLesson(currentId: string): LessonDefinition | undefined {
  const idx = allLessons.findIndex((l) => l.id === currentId);
  if (idx <= 0) {
    return undefined;
  }
  return allLessons[idx - 1];
}

/**
 * Check whether a lesson is unlocked given the user's completed steps.
 * Rules:
 * - Lesson 1 is always unlocked.
 * - Other lessons require the previous lesson to have >= 80% of its steps completed.
 *
 * @param id              - Lesson ID to check
 * @param completedSteps  - Map of lessonId -> array of completed step IDs
 */
export function isLessonUnlocked(
  id: string,
  completedSteps: Record<string, string[]>,
): boolean {
  const idx = allLessons.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  if (idx === 0) return true;

  const prevLesson = allLessons[idx - 1];
  const prevCompleted = completedSteps[prevLesson.id] ?? [];
  const requiredCount = Math.ceil(prevLesson.steps.length * 0.8);
  return prevCompleted.length >= requiredCount;
}

/**
 * Get the index (1-based) of a lesson in the ordered list.
 */
export function getLessonNumber(id: string): number {
  const idx = allLessons.findIndex((l) => l.id === id);
  return idx + 1;
}
