import type { EditorState, CursorPosition, EditorSnapshot } from '@/types/vim';
import { parseKey, needsMotionArg, createIdlePending, type ParseResult } from './motionParser';
import { updateRegistersForDelete, updateRegistersForYank, updateRegistersForChange } from './registers';

// ============================================================
// Helper: cursor clamping
// ============================================================

export function clampCursor(lines: string[], cursor: CursorPosition): CursorPosition {
  const line = Math.max(0, Math.min(cursor.line, lines.length - 1));
  const maxCol = Math.max(0, (lines[line]?.length ?? 1) - 1);
  const col = Math.max(0, Math.min(cursor.col, maxCol));
  return { line, col };
}

// ============================================================
// Helper: snapshot for undo
// ============================================================

export function takeSnapshot(state: EditorState): EditorSnapshot {
  return {
    lines: [...state.lines],
    cursor: { ...state.cursor },
    mode: state.mode,
  };
}

export function pushHistory(state: EditorState): EditorState {
  return {
    ...state,
    history: [...state.history, takeSnapshot(state)],
    future: [], // clear redo stack on new change
  };
}

// ============================================================
// Word boundary helpers
// ============================================================

function isWordChar(ch: string): boolean {
  return /\w/.test(ch);
}

function findNextWordStart(lines: string[], cursor: CursorPosition): CursorPosition {
  let { line, col } = cursor;
  const currentLine = lines[line] || '';

  // If at end of line or past it, go to next line's first non-space
  if (col >= currentLine.length - 1) {
    if (line < lines.length - 1) {
      line++;
      const nextLine = lines[line];
      col = 0;
      while (col < nextLine.length && nextLine[col] === ' ') col++;
      return { line, col };
    }
    return { line, col: Math.max(0, currentLine.length - 1) };
  }

  // Skip current word
  const startIsWord = isWordChar(currentLine[col]);
  if (startIsWord) {
    while (col < currentLine.length && isWordChar(currentLine[col])) col++;
  } else if (currentLine[col] !== ' ') {
    while (col < currentLine.length && !isWordChar(currentLine[col]) && currentLine[col] !== ' ') col++;
  }

  // Skip spaces
  while (col < currentLine.length && currentLine[col] === ' ') col++;

  // If we went past line end, move to next line
  if (col >= currentLine.length) {
    if (line < lines.length - 1) {
      line++;
      col = 0;
      const nextLine = lines[line];
      while (col < nextLine.length && nextLine[col] === ' ') col++;
    } else {
      col = Math.max(0, currentLine.length - 1);
    }
  }

  return { line, col };
}

function findPrevWordStart(lines: string[], cursor: CursorPosition): CursorPosition {
  let { line, col } = cursor;

  // If at start of line, go to previous line's end
  if (col <= 0) {
    if (line > 0) {
      line--;
      col = Math.max(0, (lines[line]?.length ?? 1) - 1);
    }
    return { line, col };
  }

  const currentLine = lines[line] || '';
  col--;

  // Skip spaces
  while (col > 0 && currentLine[col] === ' ') col--;

  // Skip current word backwards
  if (col >= 0 && isWordChar(currentLine[col])) {
    while (col > 0 && isWordChar(currentLine[col - 1])) col--;
  } else if (col >= 0 && currentLine[col] !== ' ') {
    while (col > 0 && !isWordChar(currentLine[col - 1]) && currentLine[col - 1] !== ' ') col--;
  }

  return { line, col: Math.max(0, col) };
}

function findWordEnd(lines: string[], cursor: CursorPosition): CursorPosition {
  let { line, col } = cursor;
  const currentLine = lines[line] || '';

  // Move at least one char forward
  col++;

  // Skip spaces
  while (col < currentLine.length && currentLine[col] === ' ') col++;

  // If past end of line, move to next line
  if (col >= currentLine.length) {
    if (line < lines.length - 1) {
      line++;
      col = 0;
      const nextLine = lines[line];
      while (col < nextLine.length && nextLine[col] === ' ') col++;
    } else {
      return { line, col: Math.max(0, currentLine.length - 1) };
    }
  }

  const lineStr = lines[line] || '';

  // Find end of word
  if (isWordChar(lineStr[col])) {
    while (col < lineStr.length - 1 && isWordChar(lineStr[col + 1])) col++;
  } else {
    while (col < lineStr.length - 1 && !isWordChar(lineStr[col + 1]) && lineStr[col + 1] !== ' ') col++;
  }

  return { line, col };
}

// ============================================================
// Motion execution: returns new cursor position
// ============================================================

export function executeMotion(
  lines: string[],
  cursor: CursorPosition,
  motion: string,
  count: number,
  motionArg?: string,
): CursorPosition {
  let pos = { ...cursor };

  for (let i = 0; i < count; i++) {
    switch (motion) {
      case 'h':
        pos = { ...pos, col: Math.max(0, pos.col - 1) };
        break;
      case 'l':
        pos = { ...pos, col: Math.min((lines[pos.line]?.length ?? 1) - 1, pos.col + 1) };
        break;
      case 'j':
        pos = { ...pos, line: Math.min(lines.length - 1, pos.line + 1) };
        break;
      case 'k':
        pos = { ...pos, line: Math.max(0, pos.line - 1) };
        break;
      case '0':
        pos = { ...pos, col: 0 };
        break;
      case '$':
        pos = { ...pos, col: Math.max(0, (lines[pos.line]?.length ?? 1) - 1) };
        break;
      case 'G':
        pos = { line: lines.length - 1, col: 0 };
        break;
      case 'g':
        // 'gg' handled as single 'g' motion (second g already consumed)
        pos = { line: 0, col: 0 };
        break;
      case 'w':
        pos = findNextWordStart(lines, pos);
        break;
      case 'b':
        pos = findPrevWordStart(lines, pos);
        break;
      case 'e':
        pos = findWordEnd(lines, pos);
        break;
      case 'f':
        if (motionArg) {
          const lineStr = lines[pos.line] || '';
          const idx = lineStr.indexOf(motionArg, pos.col + 1);
          if (idx !== -1) pos = { ...pos, col: idx };
        }
        break;
      case 't':
        if (motionArg) {
          const lineStr = lines[pos.line] || '';
          const idx = lineStr.indexOf(motionArg, pos.col + 1);
          if (idx > 0) pos = { ...pos, col: idx - 1 };
        }
        break;
    }
  }

  return clampCursor(lines, pos);
}

// ============================================================
// Get text range for operator + motion
// ============================================================

interface TextRange {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

function getMotionRange(
  lines: string[],
  cursor: CursorPosition,
  motion: string,
  count: number,
  motionArg?: string,
): TextRange {
  const target = executeMotion(lines, cursor, motion, count, motionArg);

  // Ensure start <= end
  const startLine = Math.min(cursor.line, target.line);
  let endLine = Math.max(cursor.line, target.line);

  let startCol: number, endCol: number;
  if (cursor.line === target.line) {
    startCol = Math.min(cursor.col, target.col);
    endCol = Math.max(cursor.col, target.col);
  } else if (cursor.line < target.line) {
    startCol = cursor.col;
    endCol = target.col;
  } else {
    startCol = target.col;
    endCol = cursor.col;
  }

  // Exclusive motions: w, b - the target char is NOT included
  // Inclusive motions: e, $, f, t - the target char IS included
  const exclusiveMotions = new Set(['w', 'b']);
  if (exclusiveMotions.has(motion) && (startLine !== endLine || endCol > startCol)) {
    if (endCol > 0) {
      endCol--;
    } else if (endLine > startLine) {
      // Target is at col 0 of next line - use end of previous line
      endLine--;
      endCol = Math.max(0, (lines[endLine]?.length ?? 1) - 1);
    }
  }

  // $ motion: include to end of line
  if (motion === '$') {
    endCol = (lines[endLine]?.length ?? 1) - 1;
  }

  return { startLine, startCol, endLine, endCol };
}

function extractText(lines: string[], range: TextRange): string {
  if (range.startLine === range.endLine) {
    return lines[range.startLine].substring(range.startCol, range.endCol + 1);
  }
  const parts: string[] = [];
  parts.push(lines[range.startLine].substring(range.startCol));
  for (let i = range.startLine + 1; i < range.endLine; i++) {
    parts.push(lines[i]);
  }
  parts.push(lines[range.endLine].substring(0, range.endCol + 1));
  return parts.join('\n');
}

function deleteRange(lines: string[], range: TextRange): string[] {
  const newLines = [...lines];
  if (range.startLine === range.endLine) {
    const line = newLines[range.startLine];
    newLines[range.startLine] = line.substring(0, range.startCol) + line.substring(range.endCol + 1);
  } else {
    const before = newLines[range.startLine].substring(0, range.startCol);
    const after = newLines[range.endLine].substring(range.endCol + 1);
    newLines.splice(range.startLine, range.endLine - range.startLine + 1, before + after);
  }
  if (newLines.length === 0) newLines.push('');
  return newLines;
}

// ============================================================
// Normal mode handler
// ============================================================

// State for waiting on 'g' second key or f/t char arg
interface WaitingState {
  type: 'WAITING_G' | 'WAITING_F_CHAR' | 'WAITING_T_CHAR' | 'WAITING_R_CHAR';
  parseResult?: ParseResult;
}

let waitingState: WaitingState | null = null;

export function resetNormalWaiting(): void {
  waitingState = null;
}

export function handleNormalMode(key: string, state: EditorState): EditorState {
  // Handle waiting states first
  if (waitingState) {
    return handleWaiting(key, state);
  }

  // Special: 'g' needs a second key
  const pending = state.pendingOperation;

  // If we're in OPERATOR_PENDING and get 'g', wait for second key
  if (key === 'g' && pending.parserState !== 'OPERATOR_PENDING') {
    // Check if we're accumulating for gg
    waitingState = { type: 'WAITING_G' };
    return state;
  }

  // Parse through state machine
  const result = parseKey(key, pending);

  switch (result.type) {
    case 'INCOMPLETE':
      return { ...state, pendingOperation: result.pending };

    case 'MOTION': {
      if (needsMotionArg(result.motion!)) {
        waitingState = {
          type: result.motion === 'f' ? 'WAITING_F_CHAR' : 'WAITING_T_CHAR',
          parseResult: result,
        };
        return state;
      }
      const newCursor = executeMotion(state.lines, state.cursor, result.motion!, result.count || 1);
      return {
        ...state,
        cursor: newCursor,
        pendingOperation: createIdlePending(),
      };
    }

    case 'OPERATOR_MOTION': {
      if (needsMotionArg(result.motion!)) {
        waitingState = {
          type: result.motion === 'f' ? 'WAITING_F_CHAR' : 'WAITING_T_CHAR',
          parseResult: result,
        };
        return state;
      }
      return executeOperatorMotion(state, result);
    }

    case 'OPERATOR_LINE':
      return executeOperatorLine(state, result);

    case 'SIMPLE_COMMAND':
      return handleSimpleCommand(key, state, result.count || 1);

    case 'UNKNOWN':
      return {
        ...state,
        pendingOperation: createIdlePending(),
        statusMessage: `该命令暂未支持: ${key}`,
      };

    default:
      return state;
  }
}

function handleWaiting(key: string, state: EditorState): EditorState {
  const ws = waitingState!;
  waitingState = null;

  switch (ws.type) {
    case 'WAITING_G': {
      if (key === 'g') {
        // gg - go to first line
        const pending = state.pendingOperation;
        if (pending.parserState === 'IDLE') {
          return {
            ...state,
            cursor: { line: 0, col: 0 },
            pendingOperation: createIdlePending(),
          };
        }
        // count + gg (e.g., 5gg goes to line 5)
        if (pending.count) {
          const targetLine = Math.min(pending.count - 1, state.lines.length - 1);
          return {
            ...state,
            cursor: { line: Math.max(0, targetLine), col: 0 },
            pendingOperation: createIdlePending(),
          };
        }
        return {
          ...state,
          cursor: { line: 0, col: 0 },
          pendingOperation: createIdlePending(),
        };
      }
      // Unknown g-command
      return {
        ...state,
        pendingOperation: createIdlePending(),
        statusMessage: `该命令暂未支持: g${key}`,
      };
    }

    case 'WAITING_F_CHAR':
    case 'WAITING_T_CHAR': {
      const pr = ws.parseResult!;
      const motionKey = ws.type === 'WAITING_F_CHAR' ? 'f' : 't';

      if (pr.type === 'OPERATOR_MOTION') {
        // Operator + f/t + char
        return executeOperatorMotion(state, { ...pr, motionArg: key });
      }

      // Simple f/t motion
      const newCursor = executeMotion(state.lines, state.cursor, motionKey, pr.count || 1, key);
      return {
        ...state,
        cursor: newCursor,
        pendingOperation: createIdlePending(),
      };
    }

    case 'WAITING_R_CHAR': {
      // r<char> - replace single character
      const s = pushHistory(state);
      const line = s.lines[s.cursor.line];
      if (s.cursor.col < line.length) {
        const newLine = line.substring(0, s.cursor.col) + key + line.substring(s.cursor.col + 1);
        const newLines = [...s.lines];
        newLines[s.cursor.line] = newLine;
        return {
          ...s,
          lines: newLines,
          dirty: true,
          pendingOperation: createIdlePending(),
          lastChange: { keys: ['r', key], beforeState: takeSnapshot(state) },
        };
      }
      return { ...state, pendingOperation: createIdlePending() };
    }
  }
}

// ============================================================
// Operator + Motion execution (dw, cw, yw, d$, etc.)
// ============================================================

function executeOperatorMotion(state: EditorState, result: ParseResult): EditorState {
  const op = result.operator!;
  const motion = result.motion!;
  const count = result.count || 1;
  const motionArg = result.motionArg;

  const range = getMotionRange(state.lines, state.cursor, motion, count, motionArg);
  const text = extractText(state.lines, range);

  switch (op) {
    case 'd': {
      const s = pushHistory(state);
      const newLines = deleteRange(s.lines, range);
      const newCursor = clampCursor(newLines, { line: range.startLine, col: range.startCol });
      return {
        ...s,
        lines: newLines,
        cursor: newCursor,
        registers: updateRegistersForDelete(s.registers, text, 'CHAR'),
        dirty: true,
        pendingOperation: createIdlePending(),
        lastChange: { keys: [op, ...(motionArg ? [motion, motionArg] : [motion])], beforeState: takeSnapshot(state) },
      };
    }
    case 'c': {
      const s = pushHistory(state);
      const newLines = deleteRange(s.lines, range);
      const newCursor = clampCursor(newLines, { line: range.startLine, col: range.startCol });
      return {
        ...s,
        lines: newLines,
        cursor: { line: newCursor.line, col: range.startCol },
        mode: 'INSERT',
        registers: updateRegistersForChange(s.registers, text, 'CHAR'),
        dirty: true,
        pendingOperation: createIdlePending(),
        lastChange: { keys: [op, ...(motionArg ? [motion, motionArg] : [motion])], beforeState: takeSnapshot(state) },
      };
    }
    case 'y': {
      return {
        ...state,
        registers: updateRegistersForYank(state.registers, text, 'CHAR'),
        cursor: { line: range.startLine, col: range.startCol },
        pendingOperation: createIdlePending(),
        statusMessage: `${text.length} character(s) yanked`,
      };
    }
    default:
      return { ...state, pendingOperation: createIdlePending() };
  }
}

// ============================================================
// Operator + Line execution (dd, cc, yy with optional count)
// ============================================================

function executeOperatorLine(state: EditorState, result: ParseResult): EditorState {
  const op = result.operator!;
  const count = Math.min(result.count || 1, state.lines.length - state.cursor.line);
  const startLine = state.cursor.line;
  const endLine = startLine + count - 1;

  const yankedLines = state.lines.slice(startLine, endLine + 1);
  const yankedText = yankedLines.join('\n');

  switch (op) {
    case 'd': {
      const s = pushHistory(state);
      const newLines = [...s.lines];
      newLines.splice(startLine, count);
      if (newLines.length === 0) newLines.push('');
      const newCursor = clampCursor(newLines, { line: startLine, col: 0 });
      return {
        ...s,
        lines: newLines,
        cursor: newCursor,
        registers: updateRegistersForDelete(s.registers, yankedText, 'LINE'),
        dirty: true,
        pendingOperation: createIdlePending(),
        lastChange: { keys: ['d', 'd'], beforeState: takeSnapshot(state) },
      };
    }
    case 'c': {
      const s = pushHistory(state);
      const newLines = [...s.lines];
      newLines.splice(startLine, count, '');
      const newCursor = { line: startLine, col: 0 };
      return {
        ...s,
        lines: newLines,
        cursor: newCursor,
        mode: 'INSERT',
        registers: updateRegistersForChange(s.registers, yankedText, 'LINE'),
        dirty: true,
        pendingOperation: createIdlePending(),
        lastChange: { keys: ['c', 'c'], beforeState: takeSnapshot(state) },
      };
    }
    case 'y': {
      return {
        ...state,
        registers: updateRegistersForYank(state.registers, yankedText, 'LINE'),
        pendingOperation: createIdlePending(),
        statusMessage: `${count} line(s) yanked`,
      };
    }
    default:
      return { ...state, pendingOperation: createIdlePending() };
  }
}

// ============================================================
// Simple commands (x, X, p, P, u, i, a, o, etc.)
// ============================================================

function handleSimpleCommand(key: string, state: EditorState, count: number): EditorState {
  switch (key) {
    // --- Delete character ---
    case 'x': {
      const s = pushHistory(state);
      let newState = s;
      for (let i = 0; i < count; i++) {
        const line = newState.lines[newState.cursor.line];
        if (line.length === 0) break;
        const col = Math.min(newState.cursor.col, line.length - 1);
        const deleted = line[col];
        const newLine = line.substring(0, col) + line.substring(col + 1);
        const newLines = [...newState.lines];
        newLines[newState.cursor.line] = newLine;
        if (newLines[newState.cursor.line].length === 0 && newLines.length > 1) {
          // keep empty line
        }
        const newCursor = clampCursor(newLines, { line: newState.cursor.line, col });
        newState = {
          ...newState,
          lines: newLines,
          cursor: newCursor,
          registers: updateRegistersForDelete(newState.registers, deleted, 'CHAR'),
          dirty: true,
        };
      }
      return {
        ...newState,
        pendingOperation: createIdlePending(),
        lastChange: { keys: ['x'], beforeState: takeSnapshot(state) },
      };
    }

    case 'X': {
      if (state.cursor.col === 0) return { ...state, pendingOperation: createIdlePending() };
      const s = pushHistory(state);
      let newState = s;
      for (let i = 0; i < count; i++) {
        const line = newState.lines[newState.cursor.line];
        if (newState.cursor.col <= 0) break;
        const col = newState.cursor.col;
        const deleted = line[col - 1];
        const newLine = line.substring(0, col - 1) + line.substring(col);
        const newLines = [...newState.lines];
        newLines[newState.cursor.line] = newLine;
        const newCursor = { line: newState.cursor.line, col: col - 1 };
        newState = {
          ...newState,
          lines: newLines,
          cursor: newCursor,
          registers: updateRegistersForDelete(newState.registers, deleted, 'CHAR'),
          dirty: true,
        };
      }
      return {
        ...newState,
        pendingOperation: createIdlePending(),
        lastChange: { keys: ['X'], beforeState: takeSnapshot(state) },
      };
    }

    // --- Paste ---
    case 'p': {
      const reg = state.registers.unnamed;
      if (!reg.content) return { ...state, pendingOperation: createIdlePending() };
      const s = pushHistory(state);
      let newState = s;
      for (let i = 0; i < count; i++) {
        newState = pasteAfter(newState, reg);
      }
      return { ...newState, dirty: true, pendingOperation: createIdlePending() };
    }

    case 'P': {
      const reg = state.registers.unnamed;
      if (!reg.content) return { ...state, pendingOperation: createIdlePending() };
      const s = pushHistory(state);
      let newState = s;
      for (let i = 0; i < count; i++) {
        newState = pasteBefore(newState, reg);
      }
      return { ...newState, dirty: true, pendingOperation: createIdlePending() };
    }

    // --- Undo/Redo (also handled in VimEngine but simple command route) ---
    case 'u':
      return handleUndo(state);

    // --- Join lines ---
    case 'J': {
      if (state.cursor.line >= state.lines.length - 1) {
        return { ...state, pendingOperation: createIdlePending() };
      }
      const s = pushHistory(state);
      const newLines = [...s.lines];
      const currentLine = newLines[s.cursor.line];
      const nextLine = newLines[s.cursor.line + 1].trimStart();
      const joinCol = currentLine.length;
      newLines[s.cursor.line] = currentLine + (nextLine ? ' ' + nextLine : '');
      newLines.splice(s.cursor.line + 1, 1);
      return {
        ...s,
        lines: newLines,
        cursor: { line: s.cursor.line, col: joinCol },
        dirty: true,
        pendingOperation: createIdlePending(),
        lastChange: { keys: ['J'], beforeState: takeSnapshot(state) },
      };
    }

    // --- Replace char ---
    case 'r':
      waitingState = { type: 'WAITING_R_CHAR' };
      return state;

    // --- Dot repeat ---
    case '.':
      return handleDotRepeat(state);

    // --- Mode switches ---
    case 'i':
      return { ...state, mode: 'INSERT', pendingOperation: createIdlePending() };
    case 'I':
      return { ...state, mode: 'INSERT', cursor: { ...state.cursor, col: 0 }, pendingOperation: createIdlePending() };
    case 'a':
      return {
        ...state,
        mode: 'INSERT',
        cursor: { ...state.cursor, col: Math.min(state.cursor.col + 1, (state.lines[state.cursor.line]?.length ?? 0)) },
        pendingOperation: createIdlePending(),
      };
    case 'A':
      return {
        ...state,
        mode: 'INSERT',
        cursor: { ...state.cursor, col: state.lines[state.cursor.line]?.length ?? 0 },
        pendingOperation: createIdlePending(),
      };
    case 'o': {
      const s = pushHistory(state);
      const newLines = [...s.lines];
      newLines.splice(s.cursor.line + 1, 0, '');
      return {
        ...s,
        lines: newLines,
        mode: 'INSERT',
        cursor: { line: s.cursor.line + 1, col: 0 },
        dirty: true,
        pendingOperation: createIdlePending(),
      };
    }
    case 'O': {
      const s = pushHistory(state);
      const newLines = [...s.lines];
      newLines.splice(s.cursor.line, 0, '');
      return {
        ...s,
        lines: newLines,
        mode: 'INSERT',
        cursor: { line: s.cursor.line, col: 0 },
        dirty: true,
        pendingOperation: createIdlePending(),
      };
    }

    // --- Visual mode ---
    case 'v':
      return {
        ...state,
        mode: 'VISUAL',
        visualSelection: {
          anchor: { ...state.cursor },
          active: { ...state.cursor },
          kind: 'CHAR',
        },
        pendingOperation: createIdlePending(),
      };
    case 'V':
      return {
        ...state,
        mode: 'VISUAL',
        visualSelection: {
          anchor: { ...state.cursor },
          active: { ...state.cursor },
          kind: 'LINE',
        },
        pendingOperation: createIdlePending(),
      };

    // --- Command mode ---
    case ':':
      return {
        ...state,
        mode: 'COMMAND',
        commandBuffer: '',
        pendingOperation: createIdlePending(),
      };

    // --- Search ---
    case '/':
      return {
        ...state,
        mode: 'COMMAND',
        commandBuffer: '',
        pendingOperation: createIdlePending(),
        statusMessage: '/',
      };

    // --- Search navigation ---
    case 'n':
      return handleSearchNext(state, false);
    case 'N':
      return handleSearchNext(state, true);

    // --- Special keys ---
    case '<C-r>':
      return handleRedo(state);
    case '<Esc>':
      return {
        ...state,
        pendingOperation: createIdlePending(),
        statusMessage: undefined,
      };

    default:
      return {
        ...state,
        pendingOperation: createIdlePending(),
        statusMessage: `该命令暂未支持: ${key}`,
      };
  }
}

// ============================================================
// Paste helpers
// ============================================================

function pasteAfter(state: EditorState, reg: { content: string; type: 'CHAR' | 'LINE' }): EditorState {
  const newLines = [...state.lines];

  if (reg.type === 'LINE') {
    const pasteLines = reg.content.split('\n');
    newLines.splice(state.cursor.line + 1, 0, ...pasteLines);
    return {
      ...state,
      lines: newLines,
      cursor: { line: state.cursor.line + 1, col: 0 },
    };
  }

  // CHAR paste: insert after cursor
  const line = newLines[state.cursor.line];
  const col = state.cursor.col + 1;
  newLines[state.cursor.line] = line.substring(0, col) + reg.content + line.substring(col);
  return {
    ...state,
    lines: newLines,
    cursor: { line: state.cursor.line, col: col + reg.content.length - 1 },
  };
}

function pasteBefore(state: EditorState, reg: { content: string; type: 'CHAR' | 'LINE' }): EditorState {
  const newLines = [...state.lines];

  if (reg.type === 'LINE') {
    const pasteLines = reg.content.split('\n');
    newLines.splice(state.cursor.line, 0, ...pasteLines);
    return {
      ...state,
      lines: newLines,
      cursor: { line: state.cursor.line, col: 0 },
    };
  }

  // CHAR paste: insert before cursor
  const line = newLines[state.cursor.line];
  const col = state.cursor.col;
  newLines[state.cursor.line] = line.substring(0, col) + reg.content + line.substring(col);
  return {
    ...state,
    lines: newLines,
    cursor: { line: state.cursor.line, col: col + reg.content.length - 1 },
  };
}

// ============================================================
// Undo / Redo
// ============================================================

function handleUndo(state: EditorState): EditorState {
  if (state.history.length === 0) {
    return { ...state, statusMessage: 'Already at oldest change', pendingOperation: createIdlePending() };
  }
  const snapshot = state.history[state.history.length - 1];
  return {
    ...state,
    lines: [...snapshot.lines],
    cursor: { ...snapshot.cursor },
    history: state.history.slice(0, -1),
    future: [...state.future, takeSnapshot(state)],
    pendingOperation: createIdlePending(),
    statusMessage: undefined,
  };
}

function handleRedo(state: EditorState): EditorState {
  if (state.future.length === 0) {
    return { ...state, statusMessage: 'Already at newest change', pendingOperation: createIdlePending() };
  }
  const snapshot = state.future[state.future.length - 1];
  return {
    ...state,
    lines: [...snapshot.lines],
    cursor: { ...snapshot.cursor },
    future: state.future.slice(0, -1),
    history: [...state.history, takeSnapshot(state)],
    pendingOperation: createIdlePending(),
    statusMessage: undefined,
  };
}

// ============================================================
// Search next/prev
// ============================================================

function handleSearchNext(state: EditorState, reverse: boolean): EditorState {
  if (!state.searchQuery || !state.searchMatches || state.searchMatches.length === 0) {
    return {
      ...state,
      statusMessage: state.searchQuery ? 'Pattern not found' : 'No previous search pattern',
      pendingOperation: createIdlePending(),
    };
  }

  const matches = state.searchMatches;
  const { line, col } = state.cursor;

  if (reverse) {
    // Find previous match
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i];
      if (m.line < line || (m.line === line && m.col < col)) {
        return { ...state, cursor: { ...m }, pendingOperation: createIdlePending() };
      }
    }
    // Wrap around
    const last = matches[matches.length - 1];
    return {
      ...state,
      cursor: { ...last },
      statusMessage: 'search hit TOP, continuing at BOTTOM',
      pendingOperation: createIdlePending(),
    };
  } else {
    // Find next match
    for (const m of matches) {
      if (m.line > line || (m.line === line && m.col > col)) {
        return { ...state, cursor: { ...m }, pendingOperation: createIdlePending() };
      }
    }
    // Wrap around
    const first = matches[0];
    return {
      ...state,
      cursor: { ...first },
      statusMessage: 'search hit BOTTOM, continuing at TOP',
      pendingOperation: createIdlePending(),
    };
  }
}

// ============================================================
// Dot repeat
// ============================================================

function handleDotRepeat(state: EditorState): EditorState {
  if (!state.lastChange) {
    return { ...state, pendingOperation: createIdlePending() };
  }

  // Re-process the saved keys
  let s = state;
  for (const k of state.lastChange.keys) {
    s = handleNormalMode(k, s);
  }
  return s;
}
