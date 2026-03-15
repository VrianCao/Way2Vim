'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { getLessonById, getNextLesson } from '@/lessons/lessonRegistry';
import { useProgressStore } from '@/store/progressStore';
import LessonPlayer from '@/components/lesson/LessonPlayer';
import LessonSummary from '@/components/gamification/LessonSummary';
import { badgeDefinitions } from '@/store/badgeEngine';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);

  const startTimeRef = useRef(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [keystrokeCount, setKeystrokeCount] = useState(0);

  const store = useProgressStore();

  const nextLesson = lesson ? getNextLesson(lesson.id) : undefined;

  // Track keystrokes from the lesson player
  const prevBadgesRef = useRef<string[]>([...store.unlockedBadges]);

  const handleComplete = useCallback(() => {
    if (!lesson) return;
    const elapsed = Date.now() - startTimeRef.current;
    const mistakes = store.lessonMistakeCount[lesson.id] ?? 0;

    // Record completion in progress store
    store.completeLesson(lesson.id, elapsed, mistakes);
    store.updateStreak();

    // Mark all steps as completed
    for (const step of lesson.steps) {
      store.completeStep(lesson.id, step.id);
    }

    setKeystrokeCount(store.totalKeystrokes);
    setShowSummary(true);
  }, [lesson, store]);

  const handleExit = useCallback(() => {
    router.push('/lessons');
  }, [router]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--red)' }}>
            课程未找到
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            课程 ID &quot;{lessonId}&quot; 不存在。
          </p>
          <button
            onClick={() => router.push('/lessons')}
            className="px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  // Calculate newly unlocked badges
  const newBadgeIds = store.unlockedBadges.filter(
    (id) => !prevBadgesRef.current.includes(id),
  );
  const newBadges = newBadgeIds
    .map((id) => badgeDefinitions.find((b) => b.id === id))
    .filter(Boolean) as typeof badgeDefinitions;

  return (
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
        durationMs={Date.now() - startTimeRef.current}
        keystrokeCount={keystrokeCount}
        mistakeCount={store.lessonMistakeCount[lesson.id] ?? 0}
        newBadges={newBadges}
        hasNextLesson={!!nextLesson}
        onNextLesson={
          nextLesson
            ? () => {
                setShowSummary(false);
                prevBadgesRef.current = [...store.unlockedBadges];
                startTimeRef.current = Date.now();
                router.push(`/lessons/${nextLesson.id}`);
              }
            : undefined
        }
        onBackToList={() => router.push('/lessons')}
        onRestart={() => {
          setShowSummary(false);
          prevBadgesRef.current = [...store.unlockedBadges];
          startTimeRef.current = Date.now();
          router.push(`/lessons/${lesson.id}`);
        }}
      />
    </div>
  );
}
