'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { VimMode } from '@/types/vim';

/**
 * Normalize a KeyboardEvent into a canonical key string understood by the engine.
 *
 * - Printable chars: 'a', '/', ':', ' ', etc.
 * - Special keys:    '<Esc>', '<Enter>', '<Backspace>', '<Tab>'
 * - Ctrl combos:     '<C-r>', '<C-f>', etc.
 */
export function normalizeKey(e: KeyboardEvent): string | null {
  // Ctrl combinations
  if (e.ctrlKey && e.key.length === 1) {
    return `<C-${e.key.toLowerCase()}>`;
  }

  switch (e.key) {
    case 'Escape':
      return '<Esc>';
    case 'Enter':
      return '<Enter>';
    case 'Backspace':
      return '<Backspace>';
    case 'Tab':
      return '<Tab>';
    case 'Shift':
    case 'Control':
    case 'Alt':
    case 'Meta':
    case 'CapsLock':
    case 'NumLock':
    case 'ScrollLock':
      return null; // Modifier-only presses are ignored
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
      return null; // Arrow keys are ignored (use hjkl)
    default:
      break;
  }

  // Single printable character
  if (e.key.length === 1) {
    return e.key;
  }

  // Function keys, etc. — not handled
  return null;
}

interface UseKeyCaptureOptions {
  /** Current Vim mode — used for IME filtering. */
  mode: VimMode;
  /** Callback with the normalized key. */
  onKey: (key: string) => void;
  /** Whether the editor is focused / should capture keys. */
  enabled?: boolean;
}

/**
 * Hook that attaches a `keydown` listener to a target element ref.
 * Returns a ref to attach to the container element.
 */
export function useKeyCapture({ mode, onKey, enabled = true }: UseKeyCaptureOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep latest callback/mode in refs to avoid re-subscribing on every render.
  const onKeyRef = useRef(onKey);
  const modeRef = useRef(mode);

  useEffect(() => { onKeyRef.current = onKey; }, [onKey]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // IME composition guard: in non-INSERT modes, ignore composition events
    if (e.isComposing || e.keyCode === 229) {
      if (modeRef.current !== 'INSERT') {
        return;
      }
      // In INSERT mode, allow composition events through
      // They'll be handled by compositionend
      return;
    }

    const key = normalizeKey(e);
    if (key === null) return;

    // Prevent browser defaults for keys we handle
    // Always prevent: Ctrl-r (reload), Tab (focus change), Escape, /
    const shouldPrevent =
      e.ctrlKey ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Backspace' ||
      e.key === '/' ||
      e.key === ':' ||
      e.key === 'Enter';

    if (shouldPrevent) {
      e.preventDefault();
    }

    onKeyRef.current(key);
  }, [enabled]);

  // Handle IME composition end in INSERT mode
  const handleCompositionEnd = useCallback((e: CompositionEvent) => {
    if (!enabled) return;
    if (modeRef.current !== 'INSERT') return;

    // Submit each composed character individually to the engine
    const text = e.data;
    if (text) {
      for (const char of text) {
        onKeyRef.current(char);
      }
    }
  }, [enabled]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      el.removeEventListener('keydown', handleKeyDown);
      el.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, [handleKeyDown, handleCompositionEnd]);

  return containerRef;
}
