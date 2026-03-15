'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepCompletionOverlayProps {
  visible: boolean;
  successMessage: string;
  isLastStep: boolean;
  onNext: () => void;
  autoAdvanceMs?: number;
}

export default function StepCompletionOverlay({
  visible,
  successMessage,
  isLastStep,
  onNext,
  autoAdvanceMs = 1500,
}: StepCompletionOverlayProps) {
  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  // Auto-advance timer
  useEffect(() => {
    if (!visible || isLastStep) return;
    const timer = setTimeout(handleNext, autoAdvanceMs);
    return () => clearTimeout(timer);
  }, [visible, isLastStep, handleNext, autoAdvanceMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(26, 27, 38, 0.85)' }}
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-4 p-6 rounded-xl max-w-md text-center"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(158, 206, 106, 0.2)' }}
            >
              <Check size={24} style={{ color: 'var(--green)' }} />
            </motion.div>

            {/* Success message */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {successMessage}
            </p>

            {/* Button */}
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: isLastStep ? 'var(--green)' : 'var(--blue)',
                color: 'var(--bg)',
              }}
            >
              {isLastStep ? '完成课程' : '下一步'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
