'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintSystemProps {
  hint?: string;
  /** Seconds before showing the hint button (default 10) */
  showButtonDelay?: number;
  /** Seconds before auto-revealing the hint (default 30) */
  autoRevealDelay?: number;
}

/**
 * HintSystem is designed to be remounted when the step changes.
 * Parent should use `key={stepId}` to ensure fresh state per step.
 */
export default function HintSystem({
  hint,
  showButtonDelay = 10,
  autoRevealDelay = 30,
}: HintSystemProps) {
  const [showButton, setShowButton] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Timer to show "need hint?" button
  useEffect(() => {
    if (!hint || revealed) return;
    const timer = setTimeout(() => setShowButton(true), showButtonDelay * 1000);
    return () => clearTimeout(timer);
  }, [hint, showButtonDelay, revealed]);

  // Timer to auto-reveal hint
  useEffect(() => {
    if (!hint || revealed) return;
    const timer = setTimeout(() => {
      setRevealed(true);
      setShowButton(false);
    }, autoRevealDelay * 1000);
    return () => clearTimeout(timer);
  }, [hint, autoRevealDelay, revealed]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setShowButton(false);
  }, []);

  if (!hint) return null;

  return (
    <div className="px-5">
      {showButton && !revealed && (
        <button
          onClick={handleReveal}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          style={{
            backgroundColor: 'rgba(224, 175, 104, 0.15)',
            color: 'var(--yellow)',
            border: '1px solid rgba(224, 175, 104, 0.3)',
          }}
        >
          <Lightbulb size={12} />
          需要提示吗？
        </button>
      )}

      {revealed && (
        <div
          className="flex items-start gap-2 text-xs p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(224, 175, 104, 0.1)',
            border: '1px solid rgba(224, 175, 104, 0.25)',
            color: 'var(--yellow)',
          }}
        >
          <Lightbulb size={14} className="shrink-0 mt-0.5" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}
