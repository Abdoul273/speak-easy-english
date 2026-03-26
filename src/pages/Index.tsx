import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allCourses, Course, Lesson } from "@/data/courses";
import { useProgress } from "@/hooks/useProgress";
import CourseCard from "@/components/CourseCard";
import LessonList from "@/components/LessonList";
import LessonView from "@/components/LessonView";
import FlashcardView from "@/components/FlashcardView";
import { ArrowLeft, Flame, Zap, Brain, Trophy, Target } from "lucide-react";

type View = "home" | "course" | "lesson" | "flashcards";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const {
    progress,
    getLessonProgress,
    markStepCompleted,
    markWordLearned,
    addFlashcard,
    reviewFlashcard,
    getDueFlashcards,
    addQuizScore,
    getCourseProgress,
  } = useProgress();

  const dueFlashcards = getDueFlashcards();

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setView("course");
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView("lesson");
  };

  const goHome = () => {
    setView("home");
    setSelectedCourse(null);
    setSelectedLesson(null);
  };

  const goToCourse = () => {
    setView("course");
    setSelectedLesson(null);
  };

  const completedLessonKeys = Object.entries(progress.lessons)
    .filter(([, v]) => v.completed)
    .map(([k]) => k);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* HOME */}
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center pt-4 space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
                >
                  <Flame className="w-4 h-4 text-neon-orange" />
                  <span className="text-sm font-medium text-muted-foreground">Real American English</span>
                </motion.div>
                <h1 className="text-4xl font-display font-bold text-foreground">
                  Speak<span className="text-gradient-primary"> USA</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Apprends le vrai anglais américain — étape par étape 🇺🇸
                </p>
              </div>

              {/* Daily Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-xl font-display font-bold text-foreground">{progress.streak}</p>
                  <p className="text-[10px] text-muted-foreground">Jours de suite</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-display font-bold text-foreground">
                    {progress.wordsLearnedToday}/{progress.dailyGoal}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Mots aujourd'hui</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Brain className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-xl font-display font-bold text-foreground">{progress.totalWordsLearned}</p>
                  <p className="text-[10px] text-muted-foreground">Mots appris</p>
                </div>
              </div>

              {/* Daily progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Objectif quotidien</span>
                  <span>{Math.min(100, Math.round((progress.wordsLearnedToday / progress.dailyGoal) * 100))}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (progress.wordsLearnedToday / progress.dailyGoal) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Flashcard CTA */}
              {dueFlashcards.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setView("flashcards")}
                  className="w-full gradient-accent glow-accent rounded-xl p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-secondary-foreground">
                        🧠 {dueFlashcards.length} flashcards à réviser
                      </p>
                      <p className="text-xs text-secondary-foreground/80 mt-0.5">
                        Révise tes mots du jour pour ne rien oublier
                      </p>
                    </div>
                    <Brain className="w-6 h-6 text-secondary-foreground/80" />
                  </div>
                </motion.button>
              )}

              {/* Courses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-display font-bold text-foreground">Tes cours</h2>
                </div>
                <div className="grid gap-4">
                  {allCourses.map((course, i) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => openCourse(course)}
                      index={i}
                      progressPct={getCourseProgress(course.id, course.lessons.length)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* COURSE */}
          {view === "course" && selectedCourse && (
            <motion.div
              key="course"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <button onClick={goHome} className="p-2 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    {selectedCourse.emoji} {selectedCourse.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedCourse.titleFr}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{selectedCourse.descriptionFr}</p>

              <LessonList
                lessons={selectedCourse.lessons}
                courseId={selectedCourse.id}
                onSelect={openLesson}
                gradient={selectedCourse.gradient}
                completedLessons={completedLessonKeys}
              />
            </motion.div>
          )}

          {/* LESSON */}
          {view === "lesson" && selectedLesson && selectedCourse && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <LessonView
                lesson={selectedLesson}
                gradient={selectedCourse.gradient}
                courseId={selectedCourse.id}
                onBack={goToCourse}
                completedSteps={getLessonProgress(selectedCourse.id, selectedLesson.id).completedSteps}
                onStepComplete={(step) => markStepCompleted(selectedCourse.id, selectedLesson.id, step)}
                onQuizComplete={(score, total) => {
                  addQuizScore(selectedCourse.id, selectedLesson.id, score, total);
                }}
                onAddFlashcard={(word) => {
                  addFlashcard({
                    en: word.en,
                    fr: word.fr,
                    phonetic: word.phonetic,
                    courseId: selectedCourse.id,
                    lessonId: selectedLesson.id,
                  });
                  markWordLearned(word.en);
                }}
              />
            </motion.div>
          )}

          {/* FLASHCARDS */}
          {view === "flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <button onClick={goHome} className="p-2 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">🧠 Flashcards du jour</h2>
                  <p className="text-sm text-muted-foreground">Révision par répétition espacée</p>
                </div>
              </div>

              <FlashcardView
                cards={dueFlashcards}
                onReview={reviewFlashcard}
                onComplete={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
