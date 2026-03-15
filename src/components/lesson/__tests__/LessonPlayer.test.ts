import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState, processKey, resetEngineState } from '@/engine/VimEngine';
import { validateStep } from '@/lessons/validationEngine';
import { getLessonById } from '@/lessons/lessonRegistry';
import type { EditorState } from '@/types/vim';
import type { LessonStep, LessonDefinition } from '@/types/lesson';

// Helpers

function buildStepState(step: LessonStep): EditorState {
  const state = createInitialState(step.initialContent, step.initialCursor);
  return { ...state, mode: step.initialMode };
}

function keys(state: EditorState, ...keyList: string[]): EditorState {
  let current = state;
  for (const k of keyList) {
    current = processKey(k, current);
  }
  return current;
}

// === Lesson 1 Integration Tests ===

describe('LessonPlayer integration - Lesson 1 (What is Vim?)', () => {
  let lesson: LessonDefinition;

  beforeEach(() => {
    resetEngineState();
    const l = getLessonById('lesson-01');
    expect(l).toBeDefined();
    lesson = l!;
  });

  it('has 5 steps', () => {
    expect(lesson.steps.length).toBe(5);
  });

  it('step 1: pressing j in NORMAL mode passes validation', () => {
    const step = lesson.steps[0];
    const state = buildStepState(step);
    const after = keys(state, 'j');
    expect(validateStep(step, after, ['j'])).toBe(true);
  });

  it('step 1: staying in NORMAL mode passes (STATE_MATCH on mode)', () => {
    const step = lesson.steps[0];
    const state = buildStepState(step);
    // Even moving with h/l should work since validation just checks mode = NORMAL
    const after = keys(state, 'l');
    expect(validateStep(step, after, ['l'])).toBe(true);
  });

  it('step 4: pressing i enters INSERT mode and passes', () => {
    const step = lesson.steps[3]; // step-4
    const state = buildStepState(step);
    const after = keys(state, 'i');
    expect(after.mode).toBe('INSERT');
    expect(validateStep(step, after, ['i'])).toBe(true);
  });

  it('step 4: staying in NORMAL mode does not pass', () => {
    const step = lesson.steps[3];
    const state = buildStepState(step);
    const after = keys(state, 'j');
    expect(after.mode).toBe('NORMAL');
    expect(validateStep(step, after, ['j'])).toBe(false);
  });

  it('step 5: pressing Esc from INSERT returns to NORMAL and passes', () => {
    const step = lesson.steps[4]; // step-5
    const state = buildStepState(step);
    expect(state.mode).toBe('INSERT');
    const after = keys(state, '<Esc>');
    expect(after.mode).toBe('NORMAL');
    expect(validateStep(step, after, ['<Esc>'])).toBe(true);
  });

  it('full lesson 1 walkthrough: all steps validate in sequence', () => {
    const stepKeys: string[][] = [
      ['j'],             // step 1: move down
      ['j'],             // step 2: move down
      ['j'],             // step 3: move down
      ['i'],             // step 4: enter INSERT
      ['<Esc>'],         // step 5: back to NORMAL
    ];

    for (let i = 0; i < lesson.steps.length; i++) {
      resetEngineState();
      const step = lesson.steps[i];
      const state = buildStepState(step);
      const after = keys(state, ...stepKeys[i]);
      expect(validateStep(step, after, stepKeys[i])).toBe(true);
    }
  });
});

// === Lesson 3 Integration Tests (HJKL Movement) ===

describe('LessonPlayer integration - Lesson 3 (hjkl movement)', () => {
  let lesson: LessonDefinition;

  beforeEach(() => {
    resetEngineState();
    const l = getLessonById('lesson-03');
    expect(l).toBeDefined();
    lesson = l!;
  });

  it('has steps', () => {
    expect(lesson.steps.length).toBeGreaterThan(0);
  });

  it('step 1: validates cursor movement with j/k', () => {
    const step = lesson.steps[0];
    const state = buildStepState(step);

    // Find what the target is
    const { validation } = step;
    if (validation.type === 'STATE_MATCH' && validation.targetState.cursor) {
      const target = validation.targetState.cursor;
      // Build key sequence to reach target position
      const keySeq: string[] = [];

      // Move to target line
      const targetLine = target.line ?? 0;
      const targetCol = target.col ?? 0;
      const dLine = targetLine - state.cursor.line;
      const dCol = targetCol - state.cursor.col;

      for (let d = 0; d < Math.abs(dLine); d++) {
        keySeq.push(dLine > 0 ? 'j' : 'k');
      }
      for (let d = 0; d < Math.abs(dCol); d++) {
        keySeq.push(dCol > 0 ? 'l' : 'h');
      }

      const after = keys(state, ...keySeq);
      expect(validateStep(step, after, keySeq)).toBe(true);
    }
  });
});

// === Lesson 6 Integration Tests (Delete & Undo) ===

describe('LessonPlayer integration - Lesson 6 (delete & undo)', () => {
  let lesson: LessonDefinition;

  beforeEach(() => {
    resetEngineState();
    const l = getLessonById('lesson-06');
    expect(l).toBeDefined();
    lesson = l!;
  });

  it('step 1: x deletes a character', () => {
    const step = lesson.steps[0];
    const state = buildStepState(step);
    const after = keys(state, 'x');
    // x should have deleted a character
    const originalLine = step.initialContent[step.initialCursor.line];
    expect(after.lines[step.initialCursor.line].length).toBeLessThan(originalLine.length);
  });
});

// === Step State Building ===

describe('buildStepState', () => {
  it('creates correct initial mode', () => {
    const step: LessonStep = {
      id: 'test',
      instruction: 'test',
      initialContent: ['hello'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'INSERT',
      expectedActions: [],
      validation: { type: 'STATE_MATCH', targetState: {} },
      successMessage: 'ok',
    };
    const state = buildStepState(step);
    expect(state.mode).toBe('INSERT');
    expect(state.lines).toEqual(['hello']);
  });

  it('creates correct initial cursor', () => {
    const step: LessonStep = {
      id: 'test',
      instruction: 'test',
      initialContent: ['hello', 'world'],
      initialCursor: { line: 1, col: 3 },
      initialMode: 'NORMAL',
      expectedActions: [],
      validation: { type: 'STATE_MATCH', targetState: {} },
      successMessage: 'ok',
    };
    const state = buildStepState(step);
    expect(state.cursor).toEqual({ line: 1, col: 3 });
  });
});

// === Key accumulation & validation workflow ===

describe('Validation workflow', () => {
  beforeEach(() => resetEngineState());

  it('accumulating keys and validating simulates LessonPlayer behavior', () => {
    const lesson = getLessonById('lesson-01')!;
    const step = lesson.steps[3]; // press i to enter INSERT
    const state = buildStepState(step);

    const accumulatedKeys: string[] = [];

    // Simulate keypresses that don't pass validation
    const afterJ = processKey('j', state);
    accumulatedKeys.push('j');
    expect(validateStep(step, afterJ, accumulatedKeys)).toBe(false);

    const afterK = processKey('k', afterJ);
    accumulatedKeys.push('k');
    expect(validateStep(step, afterK, accumulatedKeys)).toBe(false);

    // Now press i — should pass
    const afterI = processKey('i', afterK);
    accumulatedKeys.push('i');
    expect(validateStep(step, afterI, accumulatedKeys)).toBe(true);
  });

  it('resetEngineState clears module-level state between steps', () => {
    const lesson = getLessonById('lesson-01')!;

    // Step 4: press i
    const step4 = lesson.steps[3];
    let state = buildStepState(step4);
    state = processKey('i', state);
    expect(state.mode).toBe('INSERT');

    // Reset and move to step 5
    resetEngineState();
    const step5 = lesson.steps[4];
    state = buildStepState(step5);
    expect(state.mode).toBe('INSERT'); // step 5 starts in INSERT

    state = processKey('<Esc>', state);
    expect(state.mode).toBe('NORMAL');
    expect(validateStep(step5, state, ['<Esc>'])).toBe(true);
  });
});

// === All 12 lessons have valid structure ===

describe('All lessons have valid step data for LessonPlayer', () => {
  const lessonIds = [
    'lesson-01', 'lesson-02', 'lesson-03', 'lesson-04',
    'lesson-05', 'lesson-06', 'lesson-07', 'lesson-08',
    'lesson-09', 'lesson-10', 'lesson-11', 'lesson-12',
  ];

  for (const id of lessonIds) {
    it(`${id}: each step can build a valid initial EditorState`, () => {
      resetEngineState();
      const lesson = getLessonById(id)!;
      expect(lesson).toBeDefined();

      for (const step of lesson.steps) {
        const state = buildStepState(step);
        expect(state.lines.length).toBeGreaterThan(0);
        expect(state.cursor.line).toBeGreaterThanOrEqual(0);
        expect(state.cursor.col).toBeGreaterThanOrEqual(0);
        expect(state.cursor.line).toBeLessThan(state.lines.length);
        expect(state.mode).toBe(step.initialMode);
      }
    });
  }
});
