'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { EditorState } from '@/types/vim';
import { useKeyCapture } from '@/hooks/useKeyCapture';
import { useVimEditor } from '@/hooks/useVimEditor';
import EditorLine from './EditorLine';
import StatusBar from './StatusBar';
import './editor.css';

interface VimEditorProps {
  initialState: EditorState;
  /** Called on every state change (for lesson validation, etc.) */
  onStateChange?: (state: EditorState, key: string) => void;
  /** External control: reset the editor state */
  externalState?: EditorState;
}

export default function VimEditor({
  initialState,
  onStateChange,
  externalState,
}: VimEditorProps) {
  const { state, mode, lines, cursor, statusMessage, commandBuffer, visualSelection, searchMatches, onKey, resetState } =
    useVimEditor(initialState);
  const [isFocused, setIsFocused] = useState(false);

  // Handle external state resets (e.g., lesson step changes)
  useEffect(() => {
    if (externalState) {
      resetState(externalState);
    }
  }, [externalState, resetState]);

  // Track last key for onStateChange callback
  const lastKeyRef = useRef<string>('');
  const prevStateRef = useRef(state);
  const handleKey = useCallback(
    (key: string) => {
      lastKeyRef.current = key;
      onKey(key);
    },
    [onKey],
  );

  // Notify parent of state changes
  useEffect(() => {
    if (prevStateRef.current !== state && onStateChange && lastKeyRef.current) {
      onStateChange(state, lastKeyRef.current);
    }
    prevStateRef.current = state;
  }, [state, onStateChange]);

  const containerRef = useKeyCapture({
    mode,
    onKey: handleKey,
    enabled: isFocused,
  });

  const modeClass =
    mode === 'NORMAL'
      ? 'vim-editor--normal'
      : mode === 'INSERT'
        ? 'vim-editor--insert'
        : mode === 'VISUAL'
          ? 'vim-editor--visual'
          : 'vim-editor--command';

  const isBlockCursor = mode === 'NORMAL' || mode === 'VISUAL';

  return (
    <div
      ref={containerRef}
      className={`vim-editor relative border-2 rounded-lg overflow-hidden ${modeClass}`}
      style={{
        minHeight: '400px',
        backgroundColor: 'var(--bg)',
        outline: 'none',
      }}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="textbox"
      aria-label="Vim 编辑器"
      aria-roledescription="Vim editor"
    >
      {/* Editor content area */}
      <div className="p-2" style={{ minHeight: 'calc(400px - 32px)' }}>
        {lines.map((line, idx) => {
          const isCursorLine = idx === cursor.line;
          return (
            <EditorLine
              key={idx}
              lineIndex={idx}
              content={line}
              isCurrentLine={isCursorLine}
              visualSelection={visualSelection}
              searchMatches={searchMatches}
              cursorCol={isCursorLine && mode !== 'COMMAND' ? cursor.col : -1}
              cursorBlock={isCursorLine ? isBlockCursor : false}
              cursorBlink={isCursorLine ? isFocused : false}
            />
          );
        })}
      </div>

      {/* Status bar */}
      <StatusBar
        mode={mode}
        commandBuffer={commandBuffer}
        statusMessage={statusMessage}
        cursorLine={cursor.line}
        cursorCol={cursor.col}
        pendingKeys={state.pendingKeys}
      />

      {/* Click overlay to show focus hint when unfocused */}
      {!isFocused && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={() => containerRef.current?.focus()}
          aria-hidden="true"
        >
          <span className="text-text-secondary text-sm px-4 py-2 rounded bg-surface/80">
            点击此处开始编辑
          </span>
        </div>
      )}
    </div>
  );
}
