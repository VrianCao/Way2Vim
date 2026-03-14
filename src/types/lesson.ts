import type { VimMode, CursorPosition } from './vim';

// === Validation ===

export interface StateMatchTarget {
  cursor?: Partial<CursorPosition>;
  lines?: string[];
  mode?: VimMode;
}

export type ValidationRule =
  | { type: 'STATE_MATCH'; targetState: StateMatchTarget }
  | { type: 'STATE_OR_COMMAND_SET'; targetState: StateMatchTarget; acceptedCommands: string[] }
  | { type: 'STRICT_KEY_SEQUENCE'; sequence: string[] };

// === Expected Actions (for tracking/analytics) ===

export interface ExpectedAction {
  type: 'MOVE_CURSOR' | 'ENTER_MODE' | 'EDIT_TEXT' | 'EXECUTE_COMMAND';
  description?: string;
}

// === Lesson Step ===

export interface LessonStep {
  id: string;
  instruction: string;
  hint?: string;
  explanation?: string;
  initialContent: string[];
  initialCursor: CursorPosition;
  initialMode: VimMode;
  expectedActions: ExpectedAction[];
  validation: ValidationRule;
  successMessage: string;
}

// === Lesson Definition ===

export interface LessonDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites?: string[];
  steps: LessonStep[];
}
