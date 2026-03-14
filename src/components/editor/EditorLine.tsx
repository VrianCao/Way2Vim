'use client';

import React from 'react';
import type { CursorPosition, VisualSelection } from '@/types/vim';

interface EditorLineProps {
  lineIndex: number;
  content: string;
  isCurrentLine: boolean;
  visualSelection?: VisualSelection;
  searchMatches?: CursorPosition[];
  cursor?: CursorPosition;
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
}: EditorLineProps) {
  const gutterWidth = 3;

  // Render line content character by character for selection/search highlighting
  const chars = content.length === 0 ? [' '] : content.split('');

  return (
    <div className="flex vim-line" data-line={lineIndex}>
      {/* Gutter */}
      <span
        className={`vim-gutter font-mono text-sm flex-shrink-0 ${
          isCurrentLine ? 'vim-gutter--current' : ''
        }`}
        style={{ minWidth: `${gutterWidth}ch`, paddingRight: '1ch' }}
      >
        {lineIndex + 1}
      </span>

      {/* Line content */}
      <span className="font-mono text-sm flex-1">
        {chars.map((char, col) => {
          const selected = isInSelection(lineIndex, col, visualSelection);
          const matched = isSearchMatch(lineIndex, col, searchMatches);

          let className = '';
          if (selected) className += ' vim-selection';
          if (matched) className += ' vim-search-match';

          if (className) {
            return (
              <span key={col} className={className.trim()}>
                {char}
              </span>
            );
          }

          return <span key={col}>{char}</span>;
        })}
      </span>
    </div>
  );
});

EditorLine.displayName = 'EditorLine';

export default EditorLine;
