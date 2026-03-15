import type { EditorState } from '../types/vim';
import type { LessonStep, ValidationRule, StateMatchTarget } from '../types/lesson';

/**
 * Check whether a partial target state matches the actual editor state.
 * Only fields present in the target are compared.
 */
export function matchState(target: StateMatchTarget, state: EditorState): boolean {
  if (target.mode !== undefined && state.mode !== target.mode) {
    return false;
  }

  if (target.cursor !== undefined) {
    if (target.cursor.line !== undefined && state.cursor.line !== target.cursor.line) {
      return false;
    }
    if (target.cursor.col !== undefined && state.cursor.col !== target.cursor.col) {
      return false;
    }
  }

  if (target.lines !== undefined) {
    if (state.lines.length !== target.lines.length) {
      return false;
    }
    for (let i = 0; i < target.lines.length; i++) {
      if (state.lines[i] !== target.lines[i]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validate whether a step's completion condition is met.
 *
 * @param step     - The lesson step being validated
 * @param state    - The current editor state after the user's action
 * @param keys     - Accumulated key sequence since step started
 * @returns true if the step is completed
 */
export function validateStep(
  step: LessonStep,
  state: EditorState,
  keys: string[],
): boolean {
  return validateRule(step.validation, state, keys);
}

/**
 * Core validation dispatcher by rule type.
 */
export function validateRule(
  rule: ValidationRule,
  state: EditorState,
  keys: string[],
): boolean {
  switch (rule.type) {
    case 'STATE_MATCH':
      return matchState(rule.targetState, state);

    case 'STATE_OR_COMMAND_SET':
      return (
        matchState(rule.targetState, state) ||
        rule.acceptedCommands.some((cmd) => keys.includes(cmd))
      );

    case 'STRICT_KEY_SEQUENCE':
      return matchKeySequence(rule.sequence, keys);

    default:
      return false;
  }
}

/**
 * Check whether the accumulated keys end with the expected sequence.
 */
function matchKeySequence(expected: string[], actual: string[]): boolean {
  if (actual.length < expected.length) {
    return false;
  }
  const offset = actual.length - expected.length;
  for (let i = 0; i < expected.length; i++) {
    if (actual[offset + i] !== expected[i]) {
      return false;
    }
  }
  return true;
}
