import type { EditorState } from '@/types/vim';
import { pushHistory, takeSnapshot } from './normalMode';

const TAB_SIZE = 2;

export function handleInsertMode(key: string, state: EditorState): EditorState {
  switch (key) {
    case '<Esc>': {
      // Return to NORMAL mode, cursor moves left by 1 (unless at col 0)
      const col = Math.max(0, state.cursor.col - 1);
      const maxCol = Math.max(0, (state.lines[state.cursor.line]?.length ?? 1) - 1);
      return {
        ...state,
        mode: 'NORMAL',
        cursor: { line: state.cursor.line, col: Math.min(col, maxCol) },
      };
    }

    case '<Enter>': {
      const s = pushHistory(state);
      const line = s.lines[s.cursor.line];
      const before = line.substring(0, s.cursor.col);
      const after = line.substring(s.cursor.col);
      const newLines = [...s.lines];
      newLines.splice(s.cursor.line, 1, before, after);
      return {
        ...s,
        lines: newLines,
        cursor: { line: s.cursor.line + 1, col: 0 },
        dirty: true,
      };
    }

    case '<Backspace>': {
      const { line, col } = state.cursor;

      // At start of first line, nothing to delete
      if (line === 0 && col === 0) return state;

      const s = pushHistory(state);
      const newLines = [...s.lines];

      if (col === 0) {
        // Merge with previous line
        const prevLine = newLines[line - 1];
        const currentLine = newLines[line];
        const mergeCol = prevLine.length;
        newLines[line - 1] = prevLine + currentLine;
        newLines.splice(line, 1);
        return {
          ...s,
          lines: newLines,
          cursor: { line: line - 1, col: mergeCol },
          dirty: true,
        };
      }

      // Delete character before cursor
      const lineStr = newLines[line];
      newLines[line] = lineStr.substring(0, col - 1) + lineStr.substring(col);
      return {
        ...s,
        lines: newLines,
        cursor: { line, col: col - 1 },
        dirty: true,
      };
    }

    case '<Tab>': {
      const s = pushHistory(state);
      const spaces = ' '.repeat(TAB_SIZE);
      const line = s.lines[s.cursor.line];
      const newLines = [...s.lines];
      newLines[s.cursor.line] = line.substring(0, s.cursor.col) + spaces + line.substring(s.cursor.col);
      return {
        ...s,
        lines: newLines,
        cursor: { line: s.cursor.line, col: s.cursor.col + TAB_SIZE },
        dirty: true,
      };
    }

    default: {
      // Ignore special keys in insert mode (except printable chars)
      if (key.startsWith('<') && key.endsWith('>')) {
        return state;
      }

      // Insert visible character
      if (key.length === 1) {
        const s = pushHistory(state);
        const line = s.lines[s.cursor.line];
        const newLines = [...s.lines];
        newLines[s.cursor.line] = line.substring(0, s.cursor.col) + key + line.substring(s.cursor.col);
        return {
          ...s,
          lines: newLines,
          cursor: { line: s.cursor.line, col: s.cursor.col + 1 },
          dirty: true,
          lastChange: {
            keys: ['i', key],
            beforeState: takeSnapshot(state),
          },
        };
      }

      return state;
    }
  }
}
