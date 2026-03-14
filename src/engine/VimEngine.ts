import type { EditorState, CursorPosition, CommandResult } from '@/types/vim';
import { createInitialRegisters } from './registers';
import { createIdlePending } from './motionParser';
import { handleNormalMode, clampCursor, resetNormalWaiting } from './normalMode';
import { handleInsertMode } from './insertMode';
import { handleVisualMode } from './visualMode';
import { handleCommandMode, handleSearchInput } from './commandMode';

// ============================================================
// Factory
// ============================================================

export function createInitialState(
  lines: string[],
  cursor?: CursorPosition,
): EditorState {
  const safeLines = lines.length === 0 ? [''] : [...lines];
  const safeCursor = cursor
    ? clampCursor(safeLines, cursor)
    : { line: 0, col: 0 };

  return {
    lines: safeLines,
    cursor: safeCursor,
    mode: 'NORMAL',
    commandBuffer: '',
    pendingKeys: [],
    pendingOperation: createIdlePending(),
    registers: createInitialRegisters(),
    history: [],
    future: [],
    dirty: false,
  };
}

// ============================================================
// Track whether we entered search via '/'
// ============================================================

let isSearchMode = false;

// ============================================================
// Main entry: processKey
// ============================================================

export function processKey(key: string, state: EditorState): EditorState {
  let newState: EditorState;

  switch (state.mode) {
    case 'NORMAL':
      // Check if '/' is triggering search mode
      if (key === '/') {
        isSearchMode = true;
        newState = {
          ...state,
          mode: 'COMMAND',
          commandBuffer: '',
          statusMessage: '/',
        };
      } else {
        newState = handleNormalMode(key, state);
      }
      break;

    case 'INSERT':
      newState = handleInsertMode(key, state);
      break;

    case 'VISUAL':
      newState = handleVisualMode(key, state);
      break;

    case 'COMMAND': {
      if (isSearchMode) {
        newState = handleSearchInput(key, state);
        if (newState.mode !== 'COMMAND') {
          isSearchMode = false;
        }
      } else {
        const result: CommandResult = handleCommandMode(key, state);
        newState = result.state;
      }
      break;
    }

    default:
      newState = state;
  }

  // Finalize: clamp cursor to valid range
  // In INSERT mode, cursor can be at line.length (past last char for appending)
  if (newState.mode === 'INSERT') {
    const line = Math.max(0, Math.min(newState.cursor.line, newState.lines.length - 1));
    const maxCol = newState.lines[line]?.length ?? 0;
    const col = Math.max(0, Math.min(newState.cursor.col, maxCol));
    newState = { ...newState, cursor: { line, col } };
  } else {
    newState = {
      ...newState,
      cursor: clampCursor(newState.lines, newState.cursor),
    };
  }

  return newState;
}

// Reset engine internal state (useful when switching between lessons)
export function resetEngineState(): void {
  isSearchMode = false;
  resetNormalWaiting();
}
