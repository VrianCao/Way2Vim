'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LessonDefinition } from '@/types/lesson';
import type { EditorState } from '@/types/vim';
import { createInitialState } from '@/engine/VimEngine';
import { validateStep } from '@/lessons/validationEngine';
import VimEditor from '@/components/editor/VimEditor';
import InstructionPanel from './InstructionPanel';
import HintSystem from './HintSystem';
import KeyVisualizer from './KeyVisualizer';
import StepCompletionOverlay from './StepCompletionOverlay';
import LessonNavigation from './LessonNavigation';

interface LessonPlayerProps {
  lesson: LessonDefinition;
  onComplete?: () => void;
  onExit?: () => void;
}

function buildStepState(lesson: LessonDefinition, stepIndex: number): EditorState {
  const step = lesson.steps[stepIndex];
  const state = createInitialState(step.initialContent, step.initialCursor);
  return {
    ...state,
    mode: step.initialMode,
  };
}

export default function LessonPlayer({
  lesson,
  onComplete,
  onExit,
}: LessonPlayerProps) {
  const t = useTranslations('lessonPlayer');
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    () => new Array(lesson.steps.length).fill(false),
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  // Accumulated keys for the current step (used by validation engine)
  const stepKeysRef = useRef<string[]>([]);

  const currentStep = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;

  // Build the editor state for the current step
  const editorState = useMemo(() => buildStepState(lesson, stepIndex), [lesson, stepIndex]);

  // Handle editor state changes — validate on every keypress
  const handleStateChange = useCallback(
    (state: EditorState, key: string) => {
      if (showOverlay || lessonFinished) return;

      stepKeysRef.current.push(key);
      setPressedKeys(prev => [...prev, key]);

      const passed = validateStep(currentStep, state, stepKeysRef.current);
      if (passed) {
        setCompletedSteps(prev => {
          const next = [...prev];
          next[stepIndex] = true;
          return next;
        });
        setShowOverlay(true);
      }
    },
    [currentStep, stepIndex, showOverlay, lessonFinished],
  );

  // Advance to the next step (or finish lesson)
  const handleNext = useCallback(() => {
    setShowOverlay(false);
    stepKeysRef.current = [];

    if (stepIndex + 1 >= totalSteps) {
      setLessonFinished(true);
      onComplete?.();
    } else {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex, totalSteps, onComplete]);

  // Go to previous step
  const handlePrev = useCallback(() => {
    if (stepIndex === 0) return;
    setShowOverlay(false);
    stepKeysRef.current = [];
    setStepIndex(stepIndex - 1);
  }, [stepIndex]);

  // Navigate to next step manually (only if current step completed)
  const handleNavNext = useCallback(() => {
    if (!completedSteps[stepIndex] || stepIndex + 1 >= totalSteps) return;
    setShowOverlay(false);
    stepKeysRef.current = [];
    setStepIndex(stepIndex + 1);
  }, [stepIndex, totalSteps, completedSteps]);

  // Restart lesson
  const handleRestart = useCallback(() => {
    setStepIndex(0);
    setCompletedSteps(new Array(lesson.steps.length).fill(false));
    setShowOverlay(false);
    setLessonFinished(false);
    setPressedKeys([]);
    stepKeysRef.current = [];
  }, [lesson.steps.length]);

  // Exit lesson
  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  // Lesson completed screen
  if (lessonFinished) {
    const completedCount = completedSteps.filter(Boolean).length;
    return (
      <div
        className="flex items-center justify-center rounded-lg p-8"
        style={{ backgroundColor: 'var(--bg)', minHeight: '500px' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center gap-6 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.2 }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(158, 206, 106, 0.2)' }}
          >
            <Trophy size={32} style={{ color: 'var(--green)' }} />
          </motion.div>

          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t('lessonComplete')}
          </h2>

          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('completedSteps', { title: lesson.title, completed: completedCount, total: totalSteps })}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--surface-hover)',
              }}
            >
              {t('restart')}
            </button>
            <button
              onClick={handleExit}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--green)',
                color: 'var(--bg)',
              }}
            >
              {t('backToList')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col lg:flex-row rounded-lg overflow-hidden border"
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--surface-hover)',
        minHeight: '500px',
      }}
    >
      {/* Left panel: instruction + hints */}
      <div
        className="lg:w-[35%] w-full flex flex-col border-b lg:border-b-0 lg:border-r"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--surface-hover)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`instruction-${stepIndex}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
          >
            <InstructionPanel
              lesson={lesson}
              step={currentStep}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
            />
          </motion.div>
        </AnimatePresence>

        <HintSystem
          key={currentStep.id}
          hint={currentStep.hint}
        />

        <div className="flex-1" />

        <LessonNavigation
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
          onPrev={handlePrev}
          onNext={handleNavNext}
          onRestart={handleRestart}
          onExit={handleExit}
          canGoNext={completedSteps[stepIndex] && stepIndex + 1 < totalSteps}
        />
      </div>

      {/* Right panel: editor + key visualizer */}
      <div className="lg:w-[65%] w-full flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <VimEditor
              initialState={editorState}
              onStateChange={handleStateChange}
              externalState={editorState}
            />
          </motion.div>
        </AnimatePresence>

        <KeyVisualizer keys={pressedKeys} />

        <StepCompletionOverlay
          visible={showOverlay}
          successMessage={currentStep.successMessage}
          isLastStep={stepIndex + 1 >= totalSteps}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
