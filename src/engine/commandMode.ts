import type { EditorState, CursorPosition, CommandResult } from '@/types/vim';
import { pushHistory } from './normalMode';

export function handleCommandMode(key: string, state: EditorState): CommandResult {
  switch (key) {
    case '<Esc>':
      return {
        state: {
          ...state,
          mode: 'NORMAL',
          commandBuffer: '',
          statusMessage: undefined,
        },
        consumed: true,
      };

    case '<Backspace>': {
      if (state.commandBuffer.length === 0) {
        return {
          state: {
            ...state,
            mode: 'NORMAL',
            commandBuffer: '',
            statusMessage: undefined,
          },
          consumed: true,
        };
      }
      const newBuffer = state.commandBuffer.slice(0, -1);
      return {
        state: {
          ...state,
          commandBuffer: newBuffer,
          statusMessage: ':' + newBuffer,
        },
        consumed: true,
      };
    }

    case '<Enter>':
      return executeCommand(state);

    default: {
      // Append character to buffer
      if (key.length === 1) {
        const newBuffer = state.commandBuffer + key;
        return {
          state: {
            ...state,
            commandBuffer: newBuffer,
            statusMessage: ':' + newBuffer,
          },
          consumed: true,
        };
      }
      return { state, consumed: false };
    }
  }
}

function executeCommand(state: EditorState): CommandResult {
  const cmd = state.commandBuffer.trim();
  const baseState = {
    ...state,
    mode: 'NORMAL' as const,
    commandBuffer: '',
  };

  // Empty command
  if (!cmd) {
    return {
      state: { ...baseState, statusMessage: undefined },
      consumed: true,
    };
  }

  // :w - save
  if (cmd === 'w') {
    return {
      state: {
        ...baseState,
        dirty: false,
        statusMessage: '已保存',
      },
      consumed: true,
      saved: true,
    };
  }

  // :q - quit
  if (cmd === 'q') {
    if (state.dirty) {
      return {
        state: {
          ...baseState,
          mode: 'NORMAL',
          statusMessage: '未保存的更改！使用 :q! 强制退出或 :wq 保存后退出',
        },
        consumed: true,
      };
    }
    return {
      state: { ...baseState, statusMessage: '退出' },
      consumed: true,
      quit: true,
    };
  }

  // :q! - force quit
  if (cmd === 'q!') {
    return {
      state: { ...baseState, statusMessage: '强制退出' },
      consumed: true,
      quit: true,
    };
  }

  // :wq - save and quit
  if (cmd === 'wq') {
    return {
      state: { ...baseState, dirty: false, statusMessage: '保存并退出' },
      consumed: true,
      saved: true,
      quit: true,
    };
  }

  // :<number> - jump to line
  const lineNumMatch = cmd.match(/^(\d+)$/);
  if (lineNumMatch) {
    const targetLine = Math.max(0, Math.min(parseInt(lineNumMatch[1], 10) - 1, state.lines.length - 1));
    return {
      state: {
        ...baseState,
        cursor: { line: targetLine, col: 0 },
        statusMessage: undefined,
      },
      consumed: true,
    };
  }

  // :s/pat/rep/g - substitute
  const subMatch = cmd.match(/^s\/([^/]+)\/([^/]*)(?:\/(g?))?$/);
  if (subMatch) {
    const [, pattern, replacement, globalFlag] = subMatch;
    return executeSubstitute(state, baseState, pattern, replacement, globalFlag === 'g');
  }

  // Unknown command
  return {
    state: {
      ...baseState,
      statusMessage: `未知命令: :${cmd}`,
    },
    consumed: true,
  };
}

function executeSubstitute(
  state: EditorState,
  baseState: EditorState,
  pattern: string,
  replacement: string,
  global: boolean,
): CommandResult {
  const s = pushHistory(state);
  const newLines = [...s.lines];
  const currentLine = newLines[s.cursor.line];

  try {
    const regex = global ? new RegExp(pattern, 'g') : new RegExp(pattern);
    const newLine = currentLine.replace(regex, replacement);

    if (newLine === currentLine) {
      return {
        state: {
          ...baseState,
          statusMessage: 'Pattern not found: ' + pattern,
        },
        consumed: true,
      };
    }

    newLines[s.cursor.line] = newLine;
    return {
      state: {
        ...baseState,
        lines: newLines,
        history: s.history,
        future: [],
        dirty: true,
        statusMessage: '替换完成',
      },
      consumed: true,
    };
  } catch {
    return {
      state: {
        ...baseState,
        statusMessage: '无效的正则表达式: ' + pattern,
      },
      consumed: true,
    };
  }
}

// ============================================================
// Search handler (entered via / from Normal mode)
// ============================================================

export function handleSearchInput(key: string, state: EditorState): EditorState {
  switch (key) {
    case '<Esc>':
      return {
        ...state,
        mode: 'NORMAL',
        commandBuffer: '',
        statusMessage: undefined,
      };

    case '<Backspace>': {
      if (state.commandBuffer.length === 0) {
        return {
          ...state,
          mode: 'NORMAL',
          commandBuffer: '',
          statusMessage: undefined,
        };
      }
      const newBuffer = state.commandBuffer.slice(0, -1);
      return {
        ...state,
        commandBuffer: newBuffer,
        statusMessage: '/' + newBuffer,
      };
    }

    case '<Enter>': {
      const query = state.commandBuffer;
      if (!query) {
        return {
          ...state,
          mode: 'NORMAL',
          commandBuffer: '',
          statusMessage: undefined,
        };
      }

      const matches = findAllMatches(state.lines, query);
      if (matches.length === 0) {
        return {
          ...state,
          mode: 'NORMAL',
          commandBuffer: '',
          searchQuery: query,
          searchMatches: [],
          statusMessage: 'Pattern not found: ' + query,
        };
      }

      // Jump to the first match after current cursor
      let target = matches[0];
      for (const m of matches) {
        if (m.line > state.cursor.line || (m.line === state.cursor.line && m.col > state.cursor.col)) {
          target = m;
          break;
        }
      }

      return {
        ...state,
        mode: 'NORMAL',
        commandBuffer: '',
        cursor: { ...target },
        searchQuery: query,
        searchMatches: matches,
        statusMessage: `/${query} [${matches.length} match(es)]`,
      };
    }

    default: {
      if (key.length === 1) {
        const newBuffer = state.commandBuffer + key;
        return {
          ...state,
          commandBuffer: newBuffer,
          statusMessage: '/' + newBuffer,
        };
      }
      return state;
    }
  }
}

function findAllMatches(lines: string[], query: string): CursorPosition[] {
  const matches: CursorPosition[] = [];
  try {
    const regex = new RegExp(escapeRegex(query), 'g');
    for (let line = 0; line < lines.length; line++) {
      let match;
      while ((match = regex.exec(lines[line])) !== null) {
        matches.push({ line, col: match.index });
        // Safeguard: prevent infinite loop on zero-width matches (e.g., ^, $, \b)
        if (match[0].length === 0) {
          regex.lastIndex++;
          if (regex.lastIndex > lines[line].length) break;
        }
      }
    }
  } catch {
    // Invalid regex, try literal match
    for (let line = 0; line < lines.length; line++) {
      let idx = 0;
      while ((idx = lines[line].indexOf(query, idx)) !== -1) {
        matches.push({ line, col: idx });
        idx++;
      }
    }
  }
  return matches;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
