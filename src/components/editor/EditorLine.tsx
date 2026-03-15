'use client';

import React from 'react';
import type { CursorPosition, VisualSelection } from '@/types/vim';

interface EditorLineProps {
  lineIndex: number;
  content: string;
  isCurrentLine: boolean;
  visualSelection?: VisualSelection;
  searchMatches?: CursorPosition[];
  /** Cursor column on this line, -1 if cursor is not on this line */
  cursorCol: number;
  /** true for block cursor (NORMAL/VISUAL), false for bar (INSERT) */
  cursorBlock: boolean;
  /** true when editor is focused (enables blink animation) */
  cursorBlink: boolean;
}

/**
 * Determine if/how a character at (lineIndex, col) is within the visual selection.
 */
function isInSelection(
  lineIndex: number,
  col: number,
  selection: VisualSelection | undefined,
): boolean {
  if (!selection) return false;

  const { anchor, active, kind } = selection;

  if (kind === 'LINE') {
    const startLine = Math.min(anchor.line, active.line);
    const endLine = Math.max(anchor.line, active.line);
    return lineIndex >= startLine && lineIndex <= endLine;
  }

  // CHAR selection
  let startLine: number, startCol: number, endLine: number, endCol: number;
  if (
    anchor.line < active.line ||
    (anchor.line === active.line && anchor.col <= active.col)
  ) {
    startLine = anchor.line;
    startCol = anchor.col;
    endLine = active.line;
    endCol = active.col;
  } else {
    startLine = active.line;
    startCol = active.col;
    endLine = anchor.line;
    endCol = anchor.col;
  }

  if (lineIndex < startLine || lineIndex > endLine) return false;
  if (lineIndex === startLine && lineIndex === endLine) {
    return col >= startCol && col <= endCol;
  }
  if (lineIndex === startLine) return col >= startCol;
  if (lineIndex === endLine) return col <= endCol;
  return true; // Middle lines are fully selected
}

function isSearchMatch(
  lineIndex: number,
  col: number,
  matches: CursorPosition[] | undefined,
): boolean {
  if (!matches) return false;
  return matches.some(m => m.line === lineIndex && m.col === col);
}

const EditorLine = React.memo(function EditorLine({
  lineIndex,
  content,
  isCurrentLine,
  visualSelection,
  searchMatches,
  cursorCol,
  cursorBlock,
  cursorBlink,
}: EditorLineProps) {
  const gutterWidth = 3;

  // Render line content character by character for selection/search highlighting
  const chars = content.length === 0 ? [' '] : content.split('');

  return (
    <div className="flex vim-line font-mono text-sm" data-line={lineIndex}>
      {/* Gutter */}
      <span
        className={`vim-gutter flex-shrink-0 ${
          isCurrentLine ? 'vim-gutter--current' : ''
        }`}
        style={{ minWidth: `${gutterWidth}ch`, paddingRight: '1ch' }}
      >
        {lineIndex + 1}
      </span>

      {/* Line content */}
      <span className="flex-1">
        {chars.map((char, col) => {
          const selected = isInSelection(lineIndex, col, visualSelection);
          const matched = isSearchMatch(lineIndex, col, searchMatches);
          const isCursor = cursorCol >= 0 && col === cursorCol;

          let className = '';
          if (isCursor && cursorBlock) className += ' vim-cursor--block';
          if (isCursor && !cursorBlock) className += ' vim-cursor--bar';
          if (isCursor && cursorBlink) className += ' vim-cursor--blink';
          if (selected) className += ' vim-selection';
          if (matched) className += ' vim-search-match';

          return (
            <span key={col} className={className ? className.trim() : undefined}>
              {char}
            </span>
          );
        })}
        {/* INSERT cursor past end of line */}
        {cursorCol >= chars.length && !cursorBlock && (
          <span className={`vim-cursor--bar${cursorBlink ? ' vim-cursor--blink' : ''}`}>
            {'\u00A0'}
          </span>
        )}
      </span>
    </div>
  );
});

EditorLine.displayName = 'EditorLine';

export default EditorLine;
