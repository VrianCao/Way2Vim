'use client';

import React from 'react';
import type { VimMode, CursorPosition } from '@/types/vim';

interface CursorProps {
  cursor: CursorPosition;
  mode: VimMode;
  isFocused: boolean;
  /** Gutter width in characters (for offset) */
  gutterChars: number;
}

/**
 * Renders the editor cursor.
 * - NORMAL / VISUAL: block cursor (full character width)
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
}: CursorProps) {
  if (mode === 'COMMAND') return null;

  const isBlock = mode === 'NORMAL' || mode === 'VISUAL';

  return (
    <div
      className={`absolute pointer-events-none font-mono text-sm ${
        isFocused ? 'vim-cursor--blink' : ''
      } ${isBlock ? 'vim-cursor--block' : 'vim-cursor--bar'}`}
      style={{
        left: `${gutterChars + 1 + cursor.col}ch`,
        top: `${cursor.line * 1.6}em`,
        width: isBlock ? '1ch' : '2px',
        height: '1.6em',
      }}
      aria-hidden="true"
    />
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;
