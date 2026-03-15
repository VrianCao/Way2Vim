import { describe, it, expect } from 'vitest';
import { matchState, validateStep, validateRule } from '../../lessons/validationEngine';
import { createInitialState } from '../../engine/VimEngine';
import type { EditorState } from '../../types/vim';
import type { LessonStep, ValidationRule as VRule } from '../../types/lesson';

// Helper to create a minimal state
function makeState(overrides: Partial<EditorState> = {}): EditorState {
  return { ...createInitialState(['hello', 'world']), ...overrides };
}

// Helper to create a minimal lesson step with a given validation rule
function makeStep(validation: VRule): LessonStep {
  return {
    id: 'test-step',
    instruction: 'test',
    initialContent: ['hello'],
    initialCursor: { line: 0, col: 0 },
    initialMode: 'NORMAL',
    expectedActions: [],
    validation,
    successMessage: 'ok',
  };
}

// === matchState ===

describe('matchState', () => {
  it('returns true when target is empty (matches everything)', () => {
    const state = makeState();
    expect(matchState({}, state)).toBe(true);
  });

  it('matches mode', () => {
    const state = makeState({ mode: 'INSERT' });
    expect(matchState({ mode: 'INSERT' }, state)).toBe(true);
    expect(matchState({ mode: 'NORMAL' }, state)).toBe(false);
  });

  it('matches cursor line', () => {
    const state = makeState({ cursor: { line: 2, col: 0 } });
    expect(matchState({ cursor: { line: 2 } }, state)).toBe(true);
    expect(matchState({ cursor: { line: 0 } }, state)).toBe(false);
  });

  it('matches cursor col', () => {
    const state = makeState({ cursor: { line: 0, col: 5 } });
    expect(matchState({ cursor: { col: 5 } }, state)).toBe(true);
    expect(matchState({ cursor: { col: 0 } }, state)).toBe(false);
  });

  it('matches cursor line and col together', () => {
    const state = makeState({ cursor: { line: 1, col: 3 } });
    expect(matchState({ cursor: { line: 1, col: 3 } }, state)).toBe(true);
    expect(matchState({ cursor: { line: 1, col: 0 } }, state)).toBe(false);
    expect(matchState({ cursor: { line: 0, col: 3 } }, state)).toBe(false);
  });

  it('matches lines exactly', () => {
    const state = makeState({ lines: ['foo', 'bar'] });
    expect(matchState({ lines: ['foo', 'bar'] }, state)).toBe(true);
    expect(matchState({ lines: ['foo'] }, state)).toBe(false);
    expect(matchState({ lines: ['foo', 'baz'] }, state)).toBe(false);
  });

  it('matches mode + cursor + lines combined', () => {
    const state = makeState({
      mode: 'NORMAL',
      cursor: { line: 0, col: 2 },
      lines: ['abc', 'def'],
    });
    expect(
      matchState({ mode: 'NORMAL', cursor: { line: 0, col: 2 }, lines: ['abc', 'def'] }, state),
    ).toBe(true);
  });
});

// === validateRule - STATE_MATCH ===

describe('validateRule - STATE_MATCH', () => {
  it('validates when state matches target', () => {
    const rule: VRule = { type: 'STATE_MATCH', targetState: { mode: 'INSERT' } };
    const state = makeState({ mode: 'INSERT' });
    expect(validateRule(rule, state, [])).toBe(true);
  });

  it('fails when state does not match', () => {
    const rule: VRule = { type: 'STATE_MATCH', targetState: { mode: 'INSERT' } };
    const state = makeState({ mode: 'NORMAL' });
    expect(validateRule(rule, state, [])).toBe(false);
  });

  it('validates cursor position', () => {
    const rule: VRule = {
      type: 'STATE_MATCH',
      targetState: { cursor: { line: 2, col: 8 } },
    };
    const state = makeState({ cursor: { line: 2, col: 8 } });
    expect(validateRule(rule, state, [])).toBe(true);
  });

  it('validates lines content', () => {
    const rule: VRule = {
      type: 'STATE_MATCH',
      targetState: { lines: ['modified line'] },
    };
    const state = makeState({ lines: ['modified line'] });
    expect(validateRule(rule, state, [])).toBe(true);
  });
});

// === validateRule - STATE_OR_COMMAND_SET ===

describe('validateRule - STATE_OR_COMMAND_SET', () => {
  it('passes when state matches', () => {
    const rule: VRule = {
      type: 'STATE_OR_COMMAND_SET',
      targetState: { mode: 'NORMAL' },
      acceptedCommands: ['dd'],
    };
    const state = makeState({ mode: 'NORMAL' });
    expect(validateRule(rule, state, [])).toBe(true);
  });

  it('passes when command is in accepted set', () => {
    const rule: VRule = {
      type: 'STATE_OR_COMMAND_SET',
      targetState: { mode: 'VISUAL' },
      acceptedCommands: ['d', 'x'],
    };
    const state = makeState({ mode: 'NORMAL' }); // state doesn't match
    expect(validateRule(rule, state, ['v', 'l', 'd'])).toBe(true);
  });

  it('passes when command matches but state does not', () => {
    const rule: VRule = {
      type: 'STATE_OR_COMMAND_SET',
      targetState: { cursor: { line: 99 } },
      acceptedCommands: ['x'],
    };
    const state = makeState();
    expect(validateRule(rule, state, ['x'])).toBe(true);
  });

  it('fails when neither state nor command matches', () => {
    const rule: VRule = {
      type: 'STATE_OR_COMMAND_SET',
      targetState: { mode: 'INSERT' },
      acceptedCommands: ['dd'],
    };
    const state = makeState({ mode: 'NORMAL' });
    expect(validateRule(rule, state, ['x', 'x'])).toBe(false);
  });
});

// === validateRule - STRICT_KEY_SEQUENCE ===

describe('validateRule - STRICT_KEY_SEQUENCE', () => {
  it('matches exact sequence at the end', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: [':', 'w', 'q', '<Enter>'],
    };
    expect(validateRule(rule, makeState(), [':', 'w', 'q', '<Enter>'])).toBe(true);
  });

  it('matches when extra keys precede the sequence', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: [':', 'q', '<Enter>'],
    };
    expect(validateRule(rule, makeState(), ['j', 'k', ':', 'q', '<Enter>'])).toBe(true);
  });

  it('fails when sequence is incomplete', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: [':', 'w', 'q', '<Enter>'],
    };
    expect(validateRule(rule, makeState(), [':', 'w', 'q'])).toBe(false);
  });

  it('fails when sequence does not match', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: [':', 'w', '<Enter>'],
    };
    expect(validateRule(rule, makeState(), [':', 'q', '<Enter>'])).toBe(false);
  });

  it('fails when keys list is empty', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: ['i'],
    };
    expect(validateRule(rule, makeState(), [])).toBe(false);
  });

  it('matches single key sequence', () => {
    const rule: VRule = {
      type: 'STRICT_KEY_SEQUENCE',
      sequence: ['i'],
    };
    expect(validateRule(rule, makeState(), ['i'])).toBe(true);
  });
});

// === validateStep (integration) ===

describe('validateStep', () => {
  it('delegates to the correct rule type', () => {
    const step = makeStep({
      type: 'STATE_MATCH',
      targetState: { mode: 'INSERT' },
    });
    const state = makeState({ mode: 'INSERT' });
    expect(validateStep(step, state, [])).toBe(true);
  });

  it('uses keys parameter for STRICT_KEY_SEQUENCE', () => {
    const step = makeStep({
      type: 'STRICT_KEY_SEQUENCE',
      sequence: ['Z', 'Z'],
    });
    expect(validateStep(step, makeState(), ['Z', 'Z'])).toBe(true);
    expect(validateStep(step, makeState(), ['Z'])).toBe(false);
  });

  it('uses keys parameter for STATE_OR_COMMAND_SET', () => {
    const step = makeStep({
      type: 'STATE_OR_COMMAND_SET',
      targetState: { mode: 'VISUAL' },
      acceptedCommands: ['Vd'],
    });
    const state = makeState({ mode: 'NORMAL' });
    expect(validateStep(step, state, ['V', 'd', 'Vd'])).toBe(true);
  });
});
