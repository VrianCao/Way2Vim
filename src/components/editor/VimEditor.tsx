'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { EditorState } from '@/types/vim';
import { useKeyCapture } from '@/hooks/useKeyCapture';
import { useVimEditor } from '@/hooks/useVimEditor';
import EditorLine from './EditorLine';
import Cursor from './Cursor';
import StatusBar from './StatusBar';
import './editor.css';

interface VimEditorProps {
  initialState: EditorState;
  /** Called on every state change (for lesson validation, etc.) */
  onStateChange?: (state: EditorState, key: string) => void;
  /** External control: reset the editor state */
  externalState?: EditorState;
}

// Monospace char measurement constants
const CHAR_WIDTH_PX = 8.4; // approximate for JetBrains Mono 14px
const LINE_HEIGHT_PX = 22.4; // 14px * 1.6 line-height
const GUTTER_CHARS = 3;

export default function VimEditor({
  initialState,
  onStateChange,
  externalState,
}: VimEditorProps) {
  const { state, mode, lines, cursor, statusMessage, commandBuffer, visualSelection, searchMatches, onKey, resetState } =
    useVimEditor(initialState);
  const [isFocused, setIsFocused] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [charWidth, setCharWidth] = useState(CHAR_WIDTH_PX);
  const [lineHeight, setLineHeight] = useState(LINE_HEIGHT_PX);

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

  // Measure actual character dimensions after mount
  useEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      if (rect.width > 0) setCharWidth(rect.width);
      if (rect.height > 0) setLineHeight(rect.height);
    }
  }, []);

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
      {/* Hidden measurement span */}
      <span
        ref={measureRef}
        className="font-mono text-sm absolute opacity-0 pointer-events-none whitespace-pre"
        style={{ lineHeight: '1.6' }}
        aria-hidden="true"
      >
        M
      </span>

      {/* Editor content area */}
      <div className="relative p-2" style={{ minHeight: 'calc(400px - 32px)' }}>
        {/* Cursor layer */}
        <Cursor
          cursor={cursor}
          mode={mode}
          isFocused={isFocused}
          charWidth={charWidth}
          lineHeight={lineHeight}
          gutterChars={GUTTER_CHARS}
        />

        {/* Lines */}
        {lines.map((line, idx) => (
          <EditorLine
            key={idx}
            lineIndex={idx}
            content={line}
            isCurrentLine={idx === cursor.line}
            visualSelection={visualSelection}
            searchMatches={searchMatches}
            cursor={cursor}
          />
        ))}
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
