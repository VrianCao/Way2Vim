'use client';

import Link from 'next/link';
import { Lock, CheckCircle, Star, Clock } from 'lucide-react';
import { allLessons, isLessonUnlocked, getLessonNumber } from '@/lessons/lessonRegistry';
import { useProgressStore, isLessonCompleted, getLessonProgress } from '@/store/progressStore';
import ProgressBar from '@/components/gamification/ProgressBar';
import PageTransition from '@/components/layout/PageTransition';

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          style={{
            color: i < difficulty ? 'var(--yellow)' : 'var(--surface-hover)',
          }}
          fill={i < difficulty ? 'var(--yellow)' : 'none'}
        />
      ))}
    </div>
  );
}

export default function LessonsPage() {
  const state = useProgressStore();
  const completedCount = state.completedLessons.length;

  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          课程列表
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          共 {allLessons.length} 节课程，已完成 {completedCount} 节
        </p>
        <div className="mt-3">
          <ProgressBar
            progress={allLessons.length > 0 ? completedCount / allLessons.length : 0}
            label={`${completedCount} / ${allLessons.length} 课程`}
          />
        </div>
      </div>

      {/* Welcome guide when no progress */}
      {completedCount === 0 && (
        <div
          className="mb-6 p-4 rounded-xl text-sm"
          style={{
            backgroundColor: 'rgba(122, 162, 247, 0.08)',
            border: '1px solid rgba(122, 162, 247, 0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--blue)' }}>
            欢迎来到 Way2Vim！
          </p>
          <p>从第 1 课开始，循序渐进地学习 Vim 的核心操作。完成每节课 80% 以上步骤即可解锁下一课。</p>
        </div>
      )}

      {/* Lessons list */}
      <div className="flex flex-col gap-3" role="list" aria-label="课程列表">
        {allLessons.map((lesson) => {
          const num = getLessonNumber(lesson.id);
          const unlocked = isLessonUnlocked(lesson.id, state.completedSteps);
          const completed = isLessonCompleted(state, lesson.id);
          const progress = getLessonProgress(state, lesson.id, lesson.steps.length);

          return (
            <LessonCard
              key={lesson.id}
              lessonId={lesson.id}
              number={num}
              title={lesson.title}
              description={lesson.description}
              difficulty={lesson.difficulty}
              estimatedMinutes={lesson.estimatedMinutes}
              stepCount={lesson.steps.length}
              unlocked={unlocked}
              completed={completed}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
    </PageTransition>
  );
}

function LessonCard({
  lessonId,
  number,
  title,
  description,
  difficulty,
  estimatedMinutes,
  stepCount,
  unlocked,
  completed,
  progress,
}: {
  lessonId: string;
  number: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  stepCount: number;
  unlocked: boolean;
  completed: boolean;
  progress: number;
}) {
  const content = (
    <div
      className="flex gap-4 p-4 rounded-xl transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        border: completed
          ? '1px solid var(--green)'
          : '1px solid var(--surface-hover)',
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      {/* Number badge */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
        style={{
          backgroundColor: completed
            ? 'rgba(158, 206, 106, 0.2)'
            : 'var(--bg)',
          color: completed ? 'var(--green)' : 'var(--text-secondary)',
        }}
      >
        {completed ? <CheckCircle size={20} /> : unlocked ? number : <Lock size={16} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
          <DifficultyStars difficulty={difficulty} />
        </div>

        <p
          className="text-xs mb-2 line-clamp-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            {estimatedMinutes} 分钟
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {stepCount} 步骤
          </span>
          {progress > 0 && !completed && (
            <div className="flex-1 max-w-[100px]">
              <ProgressBar progress={progress} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!unlocked) {
    return <div className="cursor-not-allowed" role="listitem" aria-label={`${title} - 未解锁`}>{content}</div>;
  }

  return (
    <Link href={`/lessons/${lessonId}`} className="no-underline block hover:brightness-110 transition-all" role="listitem" aria-label={`${title}${completed ? ' - 已完成' : ''}`}>
      {content}
    </Link>
  );
}
