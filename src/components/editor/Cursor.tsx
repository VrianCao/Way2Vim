'use client';

import React from 'react';
import type { VimMode, CursorPosition } from '@/types/vim';

/**
 * Check if a character is full-width (CJK, fullwidth forms, etc.).
 * Full-width characters occupy 2 columns in a monospace grid.
 */
function isFullWidth(char: string): boolean {
  const code = char.codePointAt(0);
  if (code === undefined) return false;
  return (
    (code >= 0x1100 && code <= 0x115F) || // Hangul Jamo
    (code >= 0x2E80 && code <= 0x303E) || // CJK Radicals, Kangxi, Symbols
    (code >= 0x3040 && code <= 0x33BF) || // Hiragana, Katakana, Bopomofo
    (code >= 0x3400 && code <= 0x4DBF) || // CJK Unified Ideographs Ext A
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
    (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
    (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
    (code >= 0xFE30 && code <= 0xFE4F) || // CJK Compatibility Forms
    (code >= 0xFF00 && code <= 0xFF60) || // Fullwidth Forms
    (code >= 0xFFE0 && code <= 0xFFE6) || // Fullwidth Signs
    (code >= 0x20000 && code <= 0x2FA1F)  // CJK Extensions B–F
  );
}

/** Calculate the visual column (in ch units) for a given character index */
function getVisualColumn(text: string, col: number): number {
  let visual = 0;
  for (let i = 0; i < col && i < text.length; i++) {
    visual += isFullWidth(text[i]) ? 2 : 1;
  }
  return visual;
}

interface CursorProps {
  cursor: CursorPosition;
  mode: VimMode;
  isFocused: boolean;
  /** Gutter width in characters (for offset) */
  gutterChars: number;
  /** Current line text (for full-width character width calculation) */
  lineContent: string;
}

/**
 * Renders the editor cursor.
 * - NORMAL / VISUAL: block cursor (full character width, 2ch for CJK)
 * - INSERT: bar cursor (thin vertical line)
 * - COMMAND: hidden (cursor is in statusbar)
 *
 * Uses CSS ch/em units (relative to its own font-mono text-sm)
 * to stay perfectly aligned with the monospace text.
 */
const Cursor = React.memo(function Cursor({
  cursor,
  mode,
  isFocused,
  gutterChars,
  lineContent,
}: CursorProps) {
  if (mode === 'COMMAND') return null;

  const isBlock = mode === 'NORMAL' || mode === 'VISUAL';
  const visualCol = getVisualColumn(lineContent, cursor.col);
  const charUnderCursor = lineContent[cursor.col] || ' ';
  const cursorWidthCh = isFullWidth(charUnderCursor) ? 2 : 1;

  return (
    <div
      className={`absolute pointer-events-none font-mono text-sm ${
        isFocused ? 'vim-cursor--blink' : ''
      } ${isBlock ? 'vim-cursor--block' : 'vim-cursor--bar'}`}
      style={{
        left: `${gutterChars + 1 + visualCol}ch`,
        top: `${cursor.line * 1.6}em`,
        width: isBlock ? `${cursorWidthCh}ch` : '2px',
        height: '1.6em',
      }}
      aria-hidden="true"
    />
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;
