'use client';

import React from 'react';
import type { VimMode, CursorPosition } from '@/types/vim';

interface CursorProps {
  cursor: CursorPosition;
  mode: VimMode;
  isFocused: boolean;
  /** Character width in pixels (for positioning) */
  charWidth: number;
  /** Line height in pixels */
  lineHeight: number;
  /** Gutter width in characters (for offset) */
  gutterChars: number;
}

/**
 * Renders the editor cursor.
 * - NORMAL / VISUAL: block cursor (full character width)
 * - INSERT: bar cursor (thin vertical line)
 * - COMMAND: hidden (cursor is in statusbar)
 */
const Cursor = React.memo(function Cursor({
  cursor,
  mode,
  isFocused,
  charWidth,
  lineHeight,
  gutterChars,
}: CursorProps) {
  if (mode === 'COMMAND') return null;

  const isBlock = mode === 'NORMAL' || mode === 'VISUAL';
  // +1ch for gutter padding-right
  const leftOffset = (gutterChars + 1) * charWidth + cursor.col * charWidth;
  const topOffset = cursor.line * lineHeight;

  return (
    <div
      className={`absolute pointer-events-none ${
        isFocused ? 'vim-cursor--blink' : ''
      } ${isBlock ? 'vim-cursor--block' : 'vim-cursor--bar'}`}
      style={{
        left: `${leftOffset}px`,
        top: `${topOffset}px`,
        width: isBlock ? `${charWidth}px` : '2px',
        height: `${lineHeight}px`,
      }}
      aria-hidden="true"
    />
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;
