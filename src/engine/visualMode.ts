import type { EditorState, CursorPosition, VisualSelection } from '@/types/vim';
import { executeMotion, clampCursor, pushHistory, takeSnapshot } from './normalMode';
import { updateRegistersForDelete, updateRegistersForYank, updateRegistersForChange } from './registers';

function getSelectionRange(sel: VisualSelection): {
  start: CursorPosition;
  end: CursorPosition;
} {
  const { anchor, active } = sel;
  if (anchor.line < active.line || (anchor.line === active.line && anchor.col <= active.col)) {
    return { start: anchor, end: active };
  }
  return { start: active, end: anchor };
}

function getSelectedText(lines: string[], sel: VisualSelection): string {
  const { start, end } = getSelectionRange(sel);

  if (sel.kind === 'LINE') {
    return lines.slice(start.line, end.line + 1).join('\n');
  }

  if (start.line === end.line) {
    return lines[start.line].substring(start.col, end.col + 1);
  }

  const parts: string[] = [];
  parts.push(lines[start.line].substring(start.col));
  for (let i = start.line + 1; i < end.line; i++) {
    parts.push(lines[i]);
  }
  parts.push(lines[end.line].substring(0, end.col + 1));
  return parts.join('\n');
}

function deleteSelection(lines: string[], sel: VisualSelection): { newLines: string[]; cursor: CursorPosition } {
  const { start, end } = getSelectionRange(sel);

  if (sel.kind === 'LINE') {
    const newLines = [...lines];
    newLines.splice(start.line, end.line - start.line + 1);
    if (newLines.length === 0) newLines.push('');
    const cursor = clampCursor(newLines, { line: start.line, col: 0 });
    return { newLines, cursor };
  }

  const newLines = [...lines];
  if (start.line === end.line) {
    const line = newLines[start.line];
    newLines[start.line] = line.substring(0, start.col) + line.substring(end.col + 1);
  } else {
    const before = newLines[start.line].substring(0, start.col);
    const after = newLines[end.line].substring(end.col + 1);
    newLines.splice(start.line, end.line - start.line + 1, before + after);
  }

  if (newLines.length === 0) newLines.push('');
  const cursor = clampCursor(newLines, { line: start.line, col: start.col });
  return { newLines, cursor };
}

const VISUAL_MOTIONS = new Set(['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$']);

export function handleVisualMode(key: string, state: EditorState): EditorState {
  const sel = state.visualSelection;
  if (!sel) {
    // Shouldn't happen, but fall back to normal
    return { ...state, mode: 'NORMAL' };
  }

  // Escape - exit visual
  if (key === '<Esc>') {
    return {
      ...state,
      mode: 'NORMAL',
      visualSelection: undefined,
    };
  }

  // Movement - extend selection
  if (VISUAL_MOTIONS.has(key)) {
    const newActive = executeMotion(state.lines, sel.active, key, 1);
    return {
      ...state,
      cursor: newActive,
      visualSelection: {
        ...sel,
        active: newActive,
      },
    };
  }

  // gg - go to top (handled by waiting state in normalMode, ignore single 'g')
  if (key === 'g') {
    // Return state unchanged - let the waiting state mechanism handle 'gg'
    return state;
  }

  // G - go to bottom
  if (key === 'G') {
    const newActive = { line: state.lines.length - 1, col: 0 };
    return {
      ...state,
      cursor: newActive,
      visualSelection: { ...sel, active: newActive },
    };
  }

  // Delete selection
  if (key === 'd') {
    const text = getSelectedText(state.lines, sel);
    const s = pushHistory(state);
    const { newLines, cursor } = deleteSelection(s.lines, sel);
    const regType = sel.kind === 'LINE' ? 'LINE' as const : 'CHAR' as const;
    return {
      ...s,
      lines: newLines,
      cursor,
      mode: 'NORMAL',
      visualSelection: undefined,
      registers: updateRegistersForDelete(s.registers, text, regType),
      dirty: true,
      lastChange: { keys: ['d'], beforeState: takeSnapshot(state) },
    };
  }

  // Yank selection
  if (key === 'y') {
    const text = getSelectedText(state.lines, sel);
    const { start } = getSelectionRange(sel);
    const regType = sel.kind === 'LINE' ? 'LINE' as const : 'CHAR' as const;
    return {
      ...state,
      cursor: { ...start },
      mode: 'NORMAL',
      visualSelection: undefined,
      registers: updateRegistersForYank(state.registers, text, regType),
      statusMessage: sel.kind === 'LINE'
        ? `${Math.abs(sel.active.line - sel.anchor.line) + 1} line(s) yanked`
        : `${text.length} character(s) yanked`,
    };
  }

  // Change selection
  if (key === 'c') {
    const text = getSelectedText(state.lines, sel);
    const s = pushHistory(state);
    const { newLines, cursor } = deleteSelection(s.lines, sel);
    const regType = sel.kind === 'LINE' ? 'LINE' as const : 'CHAR' as const;
    return {
      ...s,
      lines: newLines,
      cursor,
      mode: 'INSERT',
      visualSelection: undefined,
      registers: updateRegistersForChange(s.registers, text, regType),
      dirty: true,
      lastChange: { keys: ['c'], beforeState: takeSnapshot(state) },
    };
  }

  return state;
}
