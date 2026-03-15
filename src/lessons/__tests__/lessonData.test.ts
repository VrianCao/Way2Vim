import { describe, it, expect } from 'vitest';
import { allLessons } from '../lessonRegistry';

describe('Lesson Data Validation', () => {
  it('all lessons conform to LessonDefinition type', () => {
    expect(allLessons).toHaveLength(12);
    allLessons.forEach((lesson) => {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.difficulty).toBeGreaterThanOrEqual(1);
      expect(lesson.difficulty).toBeLessThanOrEqual(5);
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
      expect(lesson.objectives).toBeInstanceOf(Array);
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.steps).toBeInstanceOf(Array);
      expect(lesson.steps.length).toBeGreaterThan(0);
    });
  });

  it('step IDs are unique within each lesson', () => {
    allLessons.forEach((lesson) => {
      const stepIds = lesson.steps.map((s) => s.id);
      const uniqueIds = new Set(stepIds);
      expect(uniqueIds.size).toBe(stepIds.length);
    });
  });

  it('initial cursor positions are within content bounds', () => {
    allLessons.forEach((lesson) => {
      lesson.steps.forEach((step) => {
        const { initialCursor, initialContent } = step;
        expect(initialCursor.line).toBeGreaterThanOrEqual(0);
        expect(initialCursor.line).toBeLessThan(initialContent.length);
        expect(initialCursor.col).toBeGreaterThanOrEqual(0);
        expect(initialCursor.col).toBeLessThanOrEqual(initialContent[initialCursor.line].length);
      });
    });
  });

  it('prerequisites reference valid lesson IDs', () => {
    const lessonIds = new Set(allLessons.map((l) => l.id));
    allLessons.forEach((lesson) => {
      if (lesson.prerequisites) {
        lesson.prerequisites.forEach((prereqId) => {
          expect(lessonIds.has(prereqId)).toBe(true);
        });
      }
    });
  });

  it('lesson IDs follow naming convention', () => {
    allLessons.forEach((lesson, index) => {
      const expectedId = `lesson-${String(index + 1).padStart(2, '0')}`;
      expect(lesson.id).toBe(expectedId);
    });
  });

  it('all steps have required fields', () => {
    allLessons.forEach((lesson) => {
      lesson.steps.forEach((step) => {
        expect(step.id).toBeTruthy();
        expect(step.instruction).toBeTruthy();
        expect(step.initialContent).toBeInstanceOf(Array);
        expect(step.initialContent.length).toBeGreaterThan(0);
        expect(step.initialCursor).toBeTruthy();
        expect(step.initialMode).toBeTruthy();
        expect(step.expectedActions).toBeInstanceOf(Array);
        expect(step.validation).toBeTruthy();
        expect(step.successMessage).toBeTruthy();
      });
    });
  });
});
