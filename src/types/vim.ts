// === Core Vim Types ===

export type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';

export interface CursorPosition {
  line: number;
  col: number;
}

export interface VisualSelection {
  anchor: CursorPosition;
  active: CursorPosition;
  kind: 'CHAR' | 'LINE';
}

// === Register System ===

export interface RegisterEntry {
  content: string;
  type: 'CHAR' | 'LINE';
}

export interface RegisterState {
  unnamed: RegisterEntry;       // " register: last yank/delete/change
  yank: RegisterEntry;          // 0 register: last yank only
  named: Record<string, RegisterEntry>; // a-z registers (reserved for future)
}

// === Undo/Redo ===

export interface EditorSnapshot {
  lines: string[];
  cursor: CursorPosition;
  mode: VimMode;
}

// === Dot Repeat ===

export interface RepeatableChange {
  keys: string[];
  beforeState: EditorSnapshot;
}

// === Parser State ===

export type ParserState = 'IDLE' | 'COUNT_PENDING' | 'OPERATOR_PENDING';

export type OperatorType = 'd' | 'c' | 'y';

export interface PendingOperation {
  parserState: ParserState;
  count?: number;
  operator?: OperatorType;
  operatorCount?: number;
}

// === Editor State ===

export interface EditorState {
  lines: string[];
  cursor: CursorPosition;
  mode: VimMode;
  commandBuffer: string;           // COMMAND mode input, e.g. 'wq'
  pendingKeys: string[];           // parser buffer for NORMAL mode
  pendingOperation: PendingOperation;
  visualSelection?: VisualSelection;
  registers: RegisterState;
  searchQuery?: string;
  searchMatches?: CursorPosition[];
  lastChange?: RepeatableChange;
  history: EditorSnapshot[];
  future: EditorSnapshot[];
  statusMessage?: string;
  dirty: boolean;                  // whether content changed since last :w
}

// === Command Result ===

export type FeedbackType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface CommandFeedback {
  type: FeedbackType;
  message: string;
}

export interface CommandResult {
  state: EditorState;
  consumed: boolean;
  feedback?: CommandFeedback;
  quit?: boolean;       // :q/:wq/:q! triggered quit
  saved?: boolean;      // :w/:wq triggered save
}
