'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getLessonById, getNextLesson } from '@/lessons/lessonRegistry';
import { useLocalizedLesson } from '@/hooks/useLocalizedLesson';
import { useProgressStore } from '@/store/progressStore';
import LessonPlayer from '@/components/lesson/LessonPlayer';
import LessonSummary from '@/components/gamification/LessonSummary';
import { badgeDefinitions } from '@/store/badgeEngine';
import PageTransition from '@/components/layout/PageTransition';

export default function LessonDetailPage() {
  const t = useTranslations('lessonPlayer');
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const rawLesson = getLessonById(lessonId);
  const lesson = useLocalizedLesson(rawLesson);

  const startTimeRef = useRef<number>(0);
  const [showSummary, setShowSummary] = useState(false);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [newBadges, setNewBadges] = useState<typeof badgeDefinitions>([]);

  const store = useProgressStore();

  const nextLesson = lesson ? getNextLesson(lesson.id) : undefined;

  const prevBadgeSnapshotRef = useRef<string[]>([]);

  // Initialize timing on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
    prevBadgeSnapshotRef.current = [...store.unlockedBadges];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleComplete() {
    if (!lesson) return;
    const elapsed = Date.now() - startTimeRef.current;
    const mistakes = store.lessonMistakeCount[lesson.id] ?? 0;

    const badgesBefore = [...prevBadgeSnapshotRef.current];

    // Record completion in progress store
    store.completeLesson(lesson.id, elapsed, mistakes);
    store.updateStreak();

    // Mark all steps as completed
    for (const step of lesson.steps) {
      store.completeStep(lesson.id, step.id);
    }

    // Calculate newly unlocked badges
    const newBadgeIds = store.unlockedBadges.filter(
      (id) => !badgesBefore.includes(id),
    );
    const badges = newBadgeIds
      .map((id) => badgeDefinitions.find((b) => b.id === id))
      .filter(Boolean) as typeof badgeDefinitions;

    setKeystrokeCount(store.totalKeystrokes);
    setDurationMs(elapsed);
    setNewBadges(badges);
    setShowSummary(true);
  }

  function handleExit() {
    router.push('/lessons');
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--red)' }}>
            {t('notFound')}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {lessonId}
          </p>
          <button
            onClick={() => router.push('/lessons')}
            className="px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          >
            {t('backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="max-w-6xl mx-auto px-4 py-6">
      <LessonPlayer
        key={lesson.id}
        lesson={lesson}
        onComplete={handleComplete}
        onExit={handleExit}
      />

      <LessonSummary
        visible={showSummary}
        lessonTitle={lesson.title}
        durationMs={durationMs}
        keystrokeCount={keystrokeCount}
        mistakeCount={store.lessonMistakeCount[lesson.id] ?? 0}
        newBadges={newBadges}
        hasNextLesson={!!nextLesson}
        onNextLesson={
          nextLesson
            ? () => {
                setShowSummary(false);
                prevBadgeSnapshotRef.current = [...store.unlockedBadges];
                startTimeRef.current = Date.now();
                router.push(`/lessons/${nextLesson.id}`);
              }
            : undefined
        }
        onBackToList={() => router.push('/lessons')}
        onRestart={() => {
          setShowSummary(false);
          prevBadgeSnapshotRef.current = [...store.unlockedBadges];
          startTimeRef.current = Date.now();
          router.push(`/lessons/${lesson.id}`);
        }}
      />
    </div>
    </PageTransition>
  );
}
