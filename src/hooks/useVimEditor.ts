'use client';

import { useState, useCallback } from 'react';
import type { EditorState, VimMode, CursorPosition, VisualSelection } from '@/types/vim';
import { processKey, resetEngineState } from '@/engine';

interface UseVimEditorReturn {
  state: EditorState;
  mode: VimMode;
  lines: string[];
  cursor: CursorPosition;
  statusMessage: string | undefined;
  commandBuffer: string;
  visualSelection: VisualSelection | undefined;
  searchQuery: string | undefined;
  searchMatches: CursorPosition[] | undefined;
  onKey: (key: string) => void;
  resetState: (newState: EditorState) => void;
}

export function useVimEditor(initialState: EditorState): UseVimEditorReturn {
  const [state, setState] = useState<EditorState>(initialState);

  const onKey = useCallback((key: string) => {
    setState(prev => processKey(key, prev));
  }, []);

  const resetState = useCallback((newState: EditorState) => {
    resetEngineState();
    setState(newState);
  }, []);

  return {
    state,
    mode: state.mode,
    lines: state.lines,
    cursor: state.cursor,
    statusMessage: state.statusMessage,
    commandBuffer: state.commandBuffer,
    visualSelection: state.visualSelection,
    searchQuery: state.searchQuery,
    searchMatches: state.searchMatches,
    onKey,
    resetState,
  };
}
