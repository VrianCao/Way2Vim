// === Progress State (persisted in localStorage) ===

export interface ProgressState {
  completedLessons: string[];
  completedSteps: Record<string, string[]>; // lessonId -> stepIds[]
  currentStreakDays: number;
  lastActiveDate?: string; // YYYY-MM-DD
  totalKeystrokes: number;
  totalCommandsExecuted: number;
  lessonBestTimeMs: Record<string, number>;
  lessonMistakeCount: Record<string, number>;
  unlockedBadges: string[];
}

// === Badge System ===

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  condition: (state: ProgressState) => boolean;
}
