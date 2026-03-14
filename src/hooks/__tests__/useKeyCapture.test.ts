import { describe, it, expect } from 'vitest';
import { normalizeKey } from '@/hooks/useKeyCapture';

/**
 * Helper to create a minimal KeyboardEvent-like object.
 */
function makeKeyEvent(overrides: Partial<KeyboardEvent> & { key: string }): KeyboardEvent {
  return {
    key: overrides.key,
    ctrlKey: overrides.ctrlKey ?? false,
    altKey: overrides.altKey ?? false,
    shiftKey: overrides.shiftKey ?? false,
    metaKey: overrides.metaKey ?? false,
    isComposing: overrides.isComposing ?? false,
    keyCode: overrides.keyCode ?? 0,
  } as KeyboardEvent;
}

describe('normalizeKey', () => {
  // Basic character keys
  it('normalizes single letter', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'a' }))).toBe('a');
  });

  it('normalizes uppercase letter', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'A' }))).toBe('A');
  });

  it('normalizes slash', () => {
    expect(normalizeKey(makeKeyEvent({ key: '/' }))).toBe('/');
  });

  it('normalizes colon', () => {
    expect(normalizeKey(makeKeyEvent({ key: ':' }))).toBe(':');
  });

  it('normalizes space', () => {
    expect(normalizeKey(makeKeyEvent({ key: ' ' }))).toBe(' ');
  });

  it('normalizes digits', () => {
    expect(normalizeKey(makeKeyEvent({ key: '3' }))).toBe('3');
  });

  // Special keys
  it('normalizes Escape to <Esc>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Escape' }))).toBe('<Esc>');
  });

  it('normalizes Enter to <Enter>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Enter' }))).toBe('<Enter>');
  });

  it('normalizes Backspace to <Backspace>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Backspace' }))).toBe('<Backspace>');
  });

  it('normalizes Tab to <Tab>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Tab' }))).toBe('<Tab>');
  });

  // Ctrl combos
  it('normalizes Ctrl-r to <C-r>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'r', ctrlKey: true }))).toBe('<C-r>');
  });

  it('normalizes Ctrl-f to <C-f>', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'f', ctrlKey: true }))).toBe('<C-f>');
  });

  // Modifier-only keys return null
  it('ignores Shift alone', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Shift' }))).toBeNull();
  });

  it('ignores Control alone', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Control' }))).toBeNull();
  });

  it('ignores Alt alone', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Alt' }))).toBeNull();
  });

  it('ignores Meta alone', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'Meta' }))).toBeNull();
  });

  // Arrow keys return null
  it('ignores ArrowLeft', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'ArrowLeft' }))).toBeNull();
  });

  it('ignores ArrowUp', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'ArrowUp' }))).toBeNull();
  });

  // Function keys return null
  it('ignores F1', () => {
    expect(normalizeKey(makeKeyEvent({ key: 'F1' }))).toBeNull();
  });

  // Special characters
  it('normalizes dollar sign', () => {
    expect(normalizeKey(makeKeyEvent({ key: '$' }))).toBe('$');
  });

  it('normalizes period', () => {
    expect(normalizeKey(makeKeyEvent({ key: '.' }))).toBe('.');
  });
});
