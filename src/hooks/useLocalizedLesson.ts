'use client';

import { useMessages } from 'next-intl';
import type { LessonDefinition } from '@/types/lesson';

interface LessonMessages {
  title: string;
  description: string;
  objectives: string[];
  steps: Array<{
    instruction: string;
    hint: string;
    explanation: string;
    initialContent: string[];
    successMessage: string;
  }>;
}

function localizeLesson(
  lesson: LessonDefinition,
  lessonsMessages: Record<string, LessonMessages>,
): LessonDefinition {
  // lesson.id = 'lesson-01' → key = 'lesson01'
  const key = lesson.id.replace('-', '');
  const content = lessonsMessages[key];

  if (!content) return lesson;

  return {
    ...lesson,
    title: content.title ?? lesson.title,
    description: content.description ?? lesson.description,
    objectives: content.objectives ?? lesson.objectives,
    steps: lesson.steps.map((step, i) => {
      const stepContent = content.steps?.[i];
      if (!stepContent) return step;
      return {
        ...step,
        instruction: stepContent.instruction || step.instruction,
        hint: stepContent.hint || step.hint,
        explanation: stepContent.explanation || step.explanation,
        initialContent: stepContent.initialContent ?? step.initialContent,
        successMessage: stepContent.successMessage || step.successMessage,
      };
    }),
  };
}

export function useLocalizedLesson(lesson: LessonDefinition | undefined): LessonDefinition | undefined {
  const messages = useMessages();
  const lessonsMessages = (messages.lessons ?? {}) as Record<string, LessonMessages>;
  if (!lesson) return undefined;
  return localizeLesson(lesson, lessonsMessages);
}

export function useLocalizedLessons(lessons: LessonDefinition[]): LessonDefinition[] {
  const messages = useMessages();
  const lessonsMessages = (messages.lessons ?? {}) as Record<string, LessonMessages>;
  return lessons.map((lesson) => localizeLesson(lesson, lessonsMessages));
}
