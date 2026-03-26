import { useState, useEffect, useCallback } from "react";

interface LessonProgress {
  lessonId: string;
  courseId: string;
  currentStep: number; // 0 = words, 1 = phrases, 2 = dialogue, 3 = quiz
  completedSteps: number[];
  wordsLearned: string[]; // word.en keys
  quizScores: { date: string; score: number; total: number }[];
  completed: boolean;
  lastAccessed: string;
}

interface FlashcardEntry {
  en: string;
  fr: string;
  phonetic?: string;
  courseId: string;
  lessonId: string;
  nextReview: string; // ISO date
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}

interface UserProgress {
  lessons: Record<string, LessonProgress>;
  flashcards: FlashcardEntry[];
  dailyGoal: number;
  wordsLearnedToday: number;
  lastDailyReset: string;
  streak: number;
  totalWordsLearned: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  lessons: {},
  flashcards: [],
  dailyGoal: 10,
  wordsLearnedToday: 0,
  lastDailyReset: new Date().toISOString().split("T")[0],
  streak: 0,
  totalWordsLearned: 0,
};

const STORAGE_KEY = "speakusa-progress";

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const data = JSON.parse(raw) as UserProgress;
    // Reset daily counter if new day
    const today = new Date().toISOString().split("T")[0];
    if (data.lastDailyReset !== today) {
      if (data.wordsLearnedToday > 0) {
        data.streak += 1;
      }
      data.wordsLearnedToday = 0;
      data.lastDailyReset = today;
    }
    return data;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const getLessonProgress = useCallback(
    (courseId: string, lessonId: string): LessonProgress => {
      const key = `${courseId}__${lessonId}`;
      return (
        progress.lessons[key] || {
          lessonId,
          courseId,
          currentStep: 0,
          completedSteps: [],
          wordsLearned: [],
          quizScores: [],
          completed: false,
          lastAccessed: new Date().toISOString(),
        }
      );
    },
    [progress]
  );

  const updateLessonProgress = useCallback(
    (courseId: string, lessonId: string, update: Partial<LessonProgress>) => {
      setProgress((prev) => {
        const key = `${courseId}__${lessonId}`;
        const existing = prev.lessons[key] || {
          lessonId,
          courseId,
          currentStep: 0,
          completedSteps: [],
          wordsLearned: [],
          quizScores: [],
          completed: false,
          lastAccessed: new Date().toISOString(),
        };
        return {
          ...prev,
          lessons: {
            ...prev.lessons,
            [key]: { ...existing, ...update, lastAccessed: new Date().toISOString() },
          },
        };
      });
    },
    []
  );

  const markStepCompleted = useCallback(
    (courseId: string, lessonId: string, step: number) => {
      setProgress((prev) => {
        const key = `${courseId}__${lessonId}`;
        const existing = prev.lessons[key] || {
          lessonId,
          courseId,
          currentStep: 0,
          completedSteps: [],
          wordsLearned: [],
          quizScores: [],
          completed: false,
          lastAccessed: new Date().toISOString(),
        };
        const completedSteps = existing.completedSteps.includes(step)
          ? existing.completedSteps
          : [...existing.completedSteps, step];
        return {
          ...prev,
          lessons: {
            ...prev.lessons,
            [key]: {
              ...existing,
              completedSteps,
              currentStep: Math.max(existing.currentStep, step + 1),
              completed: completedSteps.length >= 4,
              lastAccessed: new Date().toISOString(),
            },
          },
        };
      });
    },
    []
  );

  const markWordLearned = useCallback((word: string) => {
    setProgress((prev) => ({
      ...prev,
      wordsLearnedToday: prev.wordsLearnedToday + 1,
      totalWordsLearned: prev.totalWordsLearned + 1,
    }));
  }, []);

  const addFlashcard = useCallback(
    (entry: Omit<FlashcardEntry, "nextReview" | "interval" | "easeFactor" | "repetitions">) => {
      setProgress((prev) => {
        const exists = prev.flashcards.some(
          (f) => f.en === entry.en && f.courseId === entry.courseId
        );
        if (exists) return prev;
        return {
          ...prev,
          flashcards: [
            ...prev.flashcards,
            {
              ...entry,
              nextReview: new Date().toISOString().split("T")[0],
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
        };
      });
    },
    []
  );

  const reviewFlashcard = useCallback(
    (en: string, quality: number) => {
      // SM-2 algorithm
      setProgress((prev) => {
        const flashcards = prev.flashcards.map((f) => {
          if (f.en !== en) return f;
          let { easeFactor, interval, repetitions } = f;
          if (quality >= 3) {
            if (repetitions === 0) interval = 1;
            else if (repetitions === 1) interval = 3;
            else interval = Math.round(interval * easeFactor);
            repetitions += 1;
          } else {
            repetitions = 0;
            interval = 1;
          }
          easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + interval);
          return {
            ...f,
            interval,
            easeFactor,
            repetitions,
            nextReview: nextDate.toISOString().split("T")[0],
          };
        });
        return { ...prev, flashcards };
      });
    },
    []
  );

  const getDueFlashcards = useCallback((): FlashcardEntry[] => {
    const today = new Date().toISOString().split("T")[0];
    return progress.flashcards.filter((f) => f.nextReview <= today);
  }, [progress.flashcards]);

  const addQuizScore = useCallback(
    (courseId: string, lessonId: string, score: number, total: number) => {
      setProgress((prev) => {
        const key = `${courseId}__${lessonId}`;
        const existing = prev.lessons[key];
        if (!existing) return prev;
        return {
          ...prev,
          lessons: {
            ...prev.lessons,
            [key]: {
              ...existing,
              quizScores: [
                ...existing.quizScores,
                { date: new Date().toISOString(), score, total },
              ],
            },
          },
        };
      });
    },
    []
  );

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons: number) => {
      const completedLessons = Object.values(progress.lessons).filter(
        (l) => l.courseId === courseId && l.completed
      ).length;
      return Math.round((completedLessons / totalLessons) * 100);
    },
    [progress.lessons]
  );

  return {
    progress,
    getLessonProgress,
    updateLessonProgress,
    markStepCompleted,
    markWordLearned,
    addFlashcard,
    reviewFlashcard,
    getDueFlashcards,
    addQuizScore,
    getCourseProgress,
  };
}
