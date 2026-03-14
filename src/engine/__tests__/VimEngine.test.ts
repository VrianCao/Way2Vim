import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState, processKey, resetEngineState } from '@/engine/VimEngine';
import type { EditorState } from '@/types/vim';

function state(lines: string[], cursor?: { line: number; col: number }): EditorState {
  return createInitialState(lines, cursor);
}

function keys(s: EditorState, ...keyList: string[]): EditorState {
  let current = s;
  for (const k of keyList) {
    current = processKey(k, current);
  }
  return current;
}

describe('VimEngine', () => {
  beforeEach(() => {
    resetEngineState();
  });

  // ======================================================================
  // Factory & Initial State
  // ======================================================================

  describe('createInitialState', () => {
    it('should create state with given lines', () => {
      const s = state(['hello', 'world']);
      expect(s.lines).toEqual(['hello', 'world']);
      expect(s.cursor).toEqual({ line: 0, col: 0 });
      expect(s.mode).toBe('NORMAL');
    });

    it('should handle empty lines array', () => {
      const s = state([]);
      expect(s.lines).toEqual(['']);
    });

    it('should clamp cursor to valid range', () => {
      const s = state(['hi'], { line: 5, col: 10 });
      expect(s.cursor).toEqual({ line: 0, col: 1 });
    });

    it('should set initial mode to NORMAL', () => {
      const s = state(['test']);
      expect(s.mode).toBe('NORMAL');
      expect(s.dirty).toBe(false);
      expect(s.history).toEqual([]);
      expect(s.future).toEqual([]);
    });
  });

  // ======================================================================
  // Mode Routing
  // ======================================================================

  describe('Mode routing', () => {
    it('should route to insert mode when in INSERT', () => {
      let s = state(['hello']);
      s = processKey('i', s); // enter INSERT
      expect(s.mode).toBe('INSERT');
      s = processKey('X', s); // type character
      expect(s.lines[0]).toBe('Xhello');
    });

    it('should route to visual mode when v is pressed', () => {
      let s = state(['hello']);
      s = processKey('v', s);
      expect(s.mode).toBe('VISUAL');
    });

    it('should route to command mode when : is pressed', () => {
      let s = state(['hello']);
      s = processKey(':', s);
      expect(s.mode).toBe('COMMAND');
    });

    it('should route to search when / is pressed', () => {
      let s = state(['hello']);
      s = processKey('/', s);
      expect(s.mode).toBe('COMMAND');
      expect(s.statusMessage).toBe('/');
    });
  });

  // ======================================================================
  // Normal Mode - Basic Movement (h, j, k, l)
  // ======================================================================

  describe('Normal mode - hjkl movement', () => {
    it('h should move cursor left', () => {
      const s = keys(state(['hello'], { line: 0, col: 3 }), 'h');
      expect(s.cursor.col).toBe(2);
    });

    it('h should not move past col 0', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'h');
      expect(s.cursor.col).toBe(0);
    });

    it('l should move cursor right', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'l');
      expect(s.cursor.col).toBe(1);
    });

    it('l should not move past last character', () => {
      const s = keys(state(['hello'], { line: 0, col: 4 }), 'l');
      expect(s.cursor.col).toBe(4);
    });

    it('j should move cursor down', () => {
      const s = keys(state(['line1', 'line2'], { line: 0, col: 0 }), 'j');
      expect(s.cursor.line).toBe(1);
    });

    it('j should not move past last line', () => {
      const s = keys(state(['line1', 'line2'], { line: 1, col: 0 }), 'j');
      expect(s.cursor.line).toBe(1);
    });

    it('k should move cursor up', () => {
      const s = keys(state(['line1', 'line2'], { line: 1, col: 0 }), 'k');
      expect(s.cursor.line).toBe(0);
    });

    it('k should not move past first line', () => {
      const s = keys(state(['line1'], { line: 0, col: 0 }), 'k');
      expect(s.cursor.line).toBe(0);
    });
  });

  // ======================================================================
  // Normal Mode - Line Movement (0, $)
  // ======================================================================

  describe('Normal mode - line movement', () => {
    it('0 should move to start of line', () => {
      const s = keys(state(['hello world'], { line: 0, col: 5 }), '0');
      expect(s.cursor.col).toBe(0);
    });

    it('$ should move to end of line', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), '$');
      expect(s.cursor.col).toBe(4);
    });

    it('$ on empty line should stay at 0', () => {
      const s = keys(state([''], { line: 0, col: 0 }), '$');
      expect(s.cursor.col).toBe(0);
    });
  });

  // ======================================================================
  // Normal Mode - Document Movement (gg, G)
  // ======================================================================

  describe('Normal mode - document movement', () => {
    it('gg should move to first line', () => {
      const s = keys(state(['a', 'b', 'c'], { line: 2, col: 0 }), 'g', 'g');
      expect(s.cursor.line).toBe(0);
    });

    it('G should move to last line', () => {
      const s = keys(state(['a', 'b', 'c'], { line: 0, col: 0 }), 'G');
      expect(s.cursor.line).toBe(2);
    });
  });

  // ======================================================================
  // Normal Mode - Word Movement (w, b, e)
  // ======================================================================

  describe('Normal mode - word movement', () => {
    it('w should move to next word start', () => {
      const s = keys(state(['hello world'], { line: 0, col: 0 }), 'w');
      expect(s.cursor.col).toBe(6);
    });

    it('b should move to previous word start', () => {
      const s = keys(state(['hello world'], { line: 0, col: 6 }), 'b');
      expect(s.cursor.col).toBe(0);
    });

    it('e should move to end of current word', () => {
      const s = keys(state(['hello world'], { line: 0, col: 0 }), 'e');
      expect(s.cursor.col).toBe(4);
    });

    it('w at end of line should jump to next line', () => {
      const s = keys(state(['hi', 'there'], { line: 0, col: 1 }), 'w');
      expect(s.cursor.line).toBe(1);
      expect(s.cursor.col).toBe(0);
    });
  });

  // ======================================================================
  // Normal Mode - f/t char find
  // ======================================================================

  describe('Normal mode - f/t char find', () => {
    it('f should find character on current line', () => {
      const s = keys(state(['hello world'], { line: 0, col: 0 }), 'f', 'o');
      expect(s.cursor.col).toBe(4);
    });

    it('t should move to just before character', () => {
      const s = keys(state(['hello world'], { line: 0, col: 0 }), 't', 'o');
      expect(s.cursor.col).toBe(3);
    });

    it('f should not move if char not found', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'f', 'z');
      expect(s.cursor.col).toBe(0);
    });
  });

  // ======================================================================
  // Normal Mode - Delete (x, X, dd, dw, d$)
  // ======================================================================

  describe('Normal mode - delete', () => {
    it('x should delete character at cursor', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'x');
      expect(s.lines[0]).toBe('ello');
    });

    it('X should delete character before cursor', () => {
      const s = keys(state(['hello'], { line: 0, col: 2 }), 'X');
      expect(s.lines[0]).toBe('hllo');
      expect(s.cursor.col).toBe(1);
    });

    it('X at col 0 should do nothing', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'X');
      expect(s.lines[0]).toBe('hello');
    });

    it('dd should delete entire line', () => {
      const s = keys(state(['line1', 'line2', 'line3'], { line: 1, col: 0 }), 'd', 'd');
      expect(s.lines).toEqual(['line1', 'line3']);
    });

    it('dd on last remaining line should leave empty line', () => {
      const s = keys(state(['only line']), 'd', 'd');
      expect(s.lines).toEqual(['']);
    });

    it('dw should delete a word', () => {
      const s = keys(state(['hello world'], { line: 0, col: 0 }), 'd', 'w');
      expect(s.lines[0]).toBe('world');
    });

    it('d$ should delete to end of line', () => {
      const s = keys(state(['hello world'], { line: 0, col: 5 }), 'd', '$');
      expect(s.lines[0]).toBe('hello');
    });
  });

  // ======================================================================
  // Normal Mode - Change (cc, cw, c$)
  // ======================================================================

  describe('Normal mode - change', () => {
    it('cc should clear line and enter INSERT', () => {
      const s = keys(state(['hello', 'world']), 'c', 'c');
      expect(s.lines[0]).toBe('');
      expect(s.mode).toBe('INSERT');
    });

    it('cw should delete word and enter INSERT', () => {
      const s = keys(state(['hello world']), 'c', 'w');
      expect(s.lines[0]).toBe('world');
      expect(s.mode).toBe('INSERT');
    });

    it('c$ should delete to end of line and enter INSERT', () => {
      const s = keys(state(['hello world'], { line: 0, col: 5 }), 'c', '$');
      expect(s.lines[0]).toBe('hello');
      expect(s.mode).toBe('INSERT');
    });
  });

  // ======================================================================
  // Normal Mode - Yank (yy, yw, y$)
  // ======================================================================

  describe('Normal mode - yank', () => {
    it('yy should yank current line', () => {
      const s = keys(state(['hello', 'world']), 'y', 'y');
      expect(s.registers.unnamed.content).toBe('hello');
      expect(s.registers.unnamed.type).toBe('LINE');
      expect(s.registers.yank.content).toBe('hello');
    });

    it('yw should yank a word', () => {
      const s = keys(state(['hello world']), 'y', 'w');
      expect(s.registers.unnamed.content).toBe('hello ');
      expect(s.registers.unnamed.type).toBe('CHAR');
    });

    it('y$ should yank to end of line', () => {
      const s = keys(state(['hello world'], { line: 0, col: 6 }), 'y', '$');
      expect(s.registers.unnamed.content).toBe('world');
    });
  });

  // ======================================================================
  // Normal Mode - Paste (p, P)
  // ======================================================================

  describe('Normal mode - paste', () => {
    it('p should paste line below after yy', () => {
      let s = keys(state(['line1', 'line2']), 'y', 'y');
      s = keys(s, 'p');
      expect(s.lines).toEqual(['line1', 'line1', 'line2']);
    });

    it('P should paste line above after yy', () => {
      let s = keys(state(['line1', 'line2']), 'y', 'y');
      s = processKey('j', s);
      s = keys(s, 'P');
      expect(s.lines).toEqual(['line1', 'line1', 'line2']);
    });

    it('p should paste characters after cursor for char yank', () => {
      let s = keys(state(['hello world']), 'y', 'w');
      s = keys(s, '$');
      s = keys(s, 'p');
      expect(s.lines[0]).toContain('hello ');
    });
  });

  // ======================================================================
  // Normal Mode - Other (r, J)
  // ======================================================================

  describe('Normal mode - other commands', () => {
    it('r should replace single character', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'r', 'X');
      expect(s.lines[0]).toBe('Xello');
    });

    it('J should join current line with next', () => {
      const s = keys(state(['hello', 'world']), 'J');
      expect(s.lines).toEqual(['hello world']);
      expect(s.cursor.col).toBe(5);
    });

    it('J on last line should do nothing', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'J');
      expect(s.lines).toEqual(['hello']);
    });
  });

  // ======================================================================
  // Normal Mode - Count prefix
  // ======================================================================

  describe('Normal mode - count prefix', () => {
    it('3j should move down 3 lines', () => {
      const s = keys(state(['a', 'b', 'c', 'd', 'e']), '3', 'j');
      expect(s.cursor.line).toBe(3);
    });

    it('2w should move forward 2 words', () => {
      const s = keys(state(['one two three four']), '2', 'w');
      expect(s.cursor.col).toBe(8); // 'three'
    });

    it('2dd should delete 2 lines', () => {
      const s = keys(state(['a', 'b', 'c', 'd']), '2', 'd', 'd');
      expect(s.lines).toEqual(['c', 'd']);
    });

    it('3x should delete 3 characters', () => {
      const s = keys(state(['abcde']), '3', 'x');
      expect(s.lines[0]).toBe('de');
    });
  });

  // ======================================================================
  // Undo / Redo
  // ======================================================================

  describe('Undo/Redo', () => {
    it('u should undo last change', () => {
      let s = state(['hello']);
      s = keys(s, 'x');
      expect(s.lines[0]).toBe('ello');
      s = keys(s, 'u');
      expect(s.lines[0]).toBe('hello');
    });

    it('Ctrl-r should redo', () => {
      let s = state(['hello']);
      s = keys(s, 'x');
      s = keys(s, 'u');
      expect(s.lines[0]).toBe('hello');
      s = processKey('<C-r>', s);
      expect(s.lines[0]).toBe('ello');
    });

    it('u on empty history should show message', () => {
      const s = keys(state(['hello']), 'u');
      expect(s.statusMessage).toBe('Already at oldest change');
    });

    it('Ctrl-r on empty future should show message', () => {
      const s = processKey('<C-r>', state(['hello']));
      expect(s.statusMessage).toBe('Already at newest change');
    });

    it('multiple undo/redo should work', () => {
      let s = state(['hello']);
      s = keys(s, 'x'); // ello
      s = keys(s, 'x'); // llo
      s = keys(s, 'u'); // ello
      s = keys(s, 'u'); // hello
      expect(s.lines[0]).toBe('hello');
      s = processKey('<C-r>', s); // ello
      expect(s.lines[0]).toBe('ello');
    });
  });

  // ======================================================================
  // Insert Mode
  // ======================================================================

  describe('Insert mode', () => {
    it('i should enter insert mode', () => {
      const s = keys(state(['hello']), 'i');
      expect(s.mode).toBe('INSERT');
    });

    it('a should enter insert mode after cursor', () => {
      const s = keys(state(['hello'], { line: 0, col: 2 }), 'a');
      expect(s.mode).toBe('INSERT');
      expect(s.cursor.col).toBe(3);
    });

    it('I should enter insert mode at line start', () => {
      const s = keys(state(['hello'], { line: 0, col: 3 }), 'I');
      expect(s.mode).toBe('INSERT');
      expect(s.cursor.col).toBe(0);
    });

    it('A should enter insert mode at line end', () => {
      const s = keys(state(['hello'], { line: 0, col: 0 }), 'A');
      expect(s.mode).toBe('INSERT');
      expect(s.cursor.col).toBe(5);
    });

    it('o should open new line below and enter INSERT', () => {
      const s = keys(state(['hello']), 'o');
      expect(s.mode).toBe('INSERT');
      expect(s.lines).toEqual(['hello', '']);
      expect(s.cursor.line).toBe(1);
    });

    it('O should open new line above and enter INSERT', () => {
      const s = keys(state(['hello']), 'O');
      expect(s.mode).toBe('INSERT');
      expect(s.lines).toEqual(['', 'hello']);
      expect(s.cursor.line).toBe(0);
    });

    it('typing characters should insert text', () => {
      let s = keys(state(['hello']), 'i');
      s = keys(s, 'X', 'Y');
      expect(s.lines[0]).toBe('XYhello');
    });

    it('Enter should split the line', () => {
      let s = keys(state(['hello world'], { line: 0, col: 5 }), 'i');
      s = processKey('<Enter>', s);
      expect(s.lines).toEqual(['hello', ' world']);
      expect(s.cursor).toEqual({ line: 1, col: 0 });
    });

    it('Backspace should delete character before cursor', () => {
      let s = keys(state(['hello'], { line: 0, col: 3 }), 'i');
      s = processKey('<Backspace>', s);
      expect(s.lines[0]).toBe('helo');
    });

    it('Backspace at start of line should merge with previous', () => {
      let s = keys(state(['hello', 'world'], { line: 1, col: 0 }), 'i');
      s = processKey('<Backspace>', s);
      expect(s.lines).toEqual(['helloworld']);
      expect(s.cursor).toEqual({ line: 0, col: 5 });
    });

    it('Escape should return to NORMAL', () => {
      let s = keys(state(['hello']), 'i');
      s = processKey('<Esc>', s);
      expect(s.mode).toBe('NORMAL');
    });

    it('Escape should move cursor left by 1', () => {
      let s = keys(state(['hello'], { line: 0, col: 3 }), 'a');
      // cursor is at col 4 now (after 'l')
      s = processKey('<Esc>', s);
      expect(s.cursor.col).toBe(3);
    });

    it('Tab should insert spaces', () => {
      let s = keys(state(['hello']), 'i');
      s = processKey('<Tab>', s);
      expect(s.lines[0]).toBe('  hello');
    });
  });

  // ======================================================================
  // Visual Mode
  // ======================================================================

  describe('Visual mode', () => {
    it('v should enter char visual mode', () => {
      const s = keys(state(['hello']), 'v');
      expect(s.mode).toBe('VISUAL');
      expect(s.visualSelection?.kind).toBe('CHAR');
    });

    it('V should enter line visual mode', () => {
      const s = keys(state(['hello']), 'V');
      expect(s.mode).toBe('VISUAL');
      expect(s.visualSelection?.kind).toBe('LINE');
    });

    it('movement should extend selection', () => {
      let s = keys(state(['hello world']), 'v');
      s = keys(s, 'l', 'l', 'l');
      expect(s.visualSelection?.active.col).toBe(3);
      expect(s.visualSelection?.anchor.col).toBe(0);
    });

    it('d in visual mode should delete selection', () => {
      let s = keys(state(['hello world']), 'v');
      s = keys(s, 'l', 'l', 'l', 'l'); // select 'hello'
      s = keys(s, 'd');
      expect(s.lines[0]).toBe(' world');
      expect(s.mode).toBe('NORMAL');
    });

    it('y in visual mode should yank selection', () => {
      let s = keys(state(['hello world']), 'v');
      s = keys(s, 'l', 'l', 'l', 'l');
      s = keys(s, 'y');
      expect(s.registers.unnamed.content).toBe('hello');
      expect(s.mode).toBe('NORMAL');
    });

    it('V then d should delete entire line', () => {
      let s = keys(state(['line1', 'line2', 'line3']), 'V');
      s = keys(s, 'd');
      expect(s.lines).toEqual(['line2', 'line3']);
    });

    it('Escape should exit visual mode', () => {
      let s = keys(state(['hello']), 'v');
      s = processKey('<Esc>', s);
      expect(s.mode).toBe('NORMAL');
      expect(s.visualSelection).toBeUndefined();
    });

    it('c in visual should delete and enter INSERT', () => {
      let s = keys(state(['hello world']), 'v');
      s = keys(s, 'l', 'l', 'l', 'l');
      s = keys(s, 'c');
      expect(s.mode).toBe('INSERT');
      expect(s.lines[0]).toBe(' world');
    });
  });

  // ======================================================================
  // Command Mode
  // ======================================================================

  describe('Command mode', () => {
    it(': should enter command mode', () => {
      const s = keys(state(['hello']), ':');
      expect(s.mode).toBe('COMMAND');
    });

    it('Escape should exit command mode', () => {
      let s = keys(state(['hello']), ':');
      s = processKey('<Esc>', s);
      expect(s.mode).toBe('NORMAL');
    });

    it(':w should save (set dirty=false)', () => {
      let s = state(['hello']);
      s = keys(s, 'x'); // make dirty
      expect(s.dirty).toBe(true);
      s = keys(s, ':', 'w', '<Enter>');
      expect(s.dirty).toBe(false);
    });

    it(':q should warn on dirty buffer', () => {
      let s = state(['hello']);
      s = keys(s, 'x'); // make dirty
      s = keys(s, ':', 'q', '<Enter>');
      expect(s.statusMessage).toContain('未保存');
    });

    it(':q! should force quit', () => {
      let s = state(['hello']);
      s = keys(s, ':', 'q', '!', '<Enter>');
      expect(s.statusMessage).toContain('强制退出');
    });

    it(':wq should save and quit', () => {
      let s = state(['hello']);
      s = keys(s, ':', 'w', 'q', '<Enter>');
      expect(s.dirty).toBe(false);
      expect(s.statusMessage).toContain('保存并退出');
    });

    it(':<number> should jump to line', () => {
      const s = keys(state(['a', 'b', 'c', 'd']), ':', '3', '<Enter>');
      expect(s.cursor.line).toBe(2); // 0-indexed
    });

    it(':s/pat/rep/ should substitute on current line', () => {
      const s = keys(state(['hello world hello']), ':', 's', '/', 'h', 'e', 'l', 'l', 'o', '/', 'H', 'I', '/', '<Enter>');
      expect(s.lines[0]).toBe('HI world hello');
    });

    it(':s/pat/rep/g should substitute all on current line', () => {
      const s = keys(state(['hello world hello']), ':', 's', '/', 'h', 'e', 'l', 'l', 'o', '/', 'H', 'I', '/', 'g', '<Enter>');
      expect(s.lines[0]).toBe('HI world HI');
    });

    it('Backspace should delete last char in buffer', () => {
      let s = keys(state(['hello']), ':');
      s = keys(s, 'w', 'q');
      expect(s.commandBuffer).toBe('wq');
      s = processKey('<Backspace>', s);
      expect(s.commandBuffer).toBe('w');
    });

    it('Backspace on empty buffer should exit command mode', () => {
      let s = keys(state(['hello']), ':');
      s = processKey('<Backspace>', s);
      expect(s.mode).toBe('NORMAL');
    });
  });

  // ======================================================================
  // Search
  // ======================================================================

  describe('Search', () => {
    it('/pattern Enter should find matches', () => {
      const s = keys(state(['hello world', 'hello again']), '/', 'h', 'e', 'l', 'l', 'o', '<Enter>');
      expect(s.searchQuery).toBe('hello');
      expect(s.searchMatches?.length).toBe(2);
      expect(s.mode).toBe('NORMAL');
    });

    it('n should jump to next match', () => {
      let s = keys(state(['abc abc abc'], { line: 0, col: 0 }), '/', 'a', 'b', 'c', '<Enter>');
      expect(s.cursor.col).toBe(4); // first match after cursor
      s = keys(s, 'n');
      expect(s.cursor.col).toBe(8);
    });

    it('N should jump to previous match', () => {
      let s = keys(state(['abc abc abc'], { line: 0, col: 0 }), '/', 'a', 'b', 'c', '<Enter>');
      s = keys(s, 'n'); // go to col 8
      s = keys(s, 'N');
      expect(s.cursor.col).toBe(4);
    });

    it('search with no matches should show error', () => {
      const s = keys(state(['hello']), '/', 'x', 'y', 'z', '<Enter>');
      expect(s.statusMessage).toContain('Pattern not found');
    });

    it('Escape during search should cancel', () => {
      let s = keys(state(['hello']), '/');
      s = keys(s, 'a', 'b');
      s = processKey('<Esc>', s);
      expect(s.mode).toBe('NORMAL');
    });
  });

  // ======================================================================
  // Register System
  // ======================================================================

  describe('Register system', () => {
    it('dd should populate unnamed register with LINE type', () => {
      const s = keys(state(['hello', 'world']), 'd', 'd');
      expect(s.registers.unnamed.content).toBe('hello');
      expect(s.registers.unnamed.type).toBe('LINE');
    });

    it('yy should populate both unnamed and yank registers', () => {
      const s = keys(state(['hello']), 'y', 'y');
      expect(s.registers.unnamed.content).toBe('hello');
      expect(s.registers.yank.content).toBe('hello');
    });

    it('x should populate unnamed register with CHAR type', () => {
      const s = keys(state(['hello']), 'x');
      expect(s.registers.unnamed.content).toBe('h');
      expect(s.registers.unnamed.type).toBe('CHAR');
    });

    it('delete should not update yank register', () => {
      let s = keys(state(['hello', 'world']), 'y', 'y');
      expect(s.registers.yank.content).toBe('hello');
      s = processKey('j', s);
      s = keys(s, 'd', 'd');
      // yank register should still have 'hello', not 'world'
      expect(s.registers.yank.content).toBe('hello');
      expect(s.registers.unnamed.content).toBe('world');
    });
  });

  // ======================================================================
  // Edge cases
  // ======================================================================

  describe('Edge cases', () => {
    it('should handle empty document gracefully', () => {
      const s = state(['']);
      expect(() => processKey('x', s)).not.toThrow();
      expect(() => processKey('d', s)).not.toThrow();
      expect(() => processKey('j', s)).not.toThrow();
    });

    it('should handle single character line', () => {
      const s = keys(state(['a']), 'x');
      expect(s.lines[0]).toBe('');
    });

    it('unknown command should show message', () => {
      const s = keys(state(['hello']), 'Z');
      expect(s.statusMessage).toContain('暂未支持');
    });

    it('cursor should clamp after line deletion', () => {
      const s = keys(state(['short', 'very long line here'], { line: 1, col: 15 }), 'd', 'd');
      // After deleting line 1, cursor should be on line 0 with clamped col
      expect(s.cursor.line).toBe(0);
      expect(s.cursor.col).toBeLessThanOrEqual(4);
    });
  });
});
