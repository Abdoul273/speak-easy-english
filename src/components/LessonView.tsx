import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "@/data/courses";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Volume2,
  Lightbulb,
  CheckCircle2,
  Plus,
} from "lucide-react";
import QuizView from "./QuizView";
import WordCard from "./lesson/WordCard";
import PhraseCard from "./lesson/PhraseCard";
import DialogueChat from "./lesson/DialogueChat";

interface LessonViewProps {
  lesson: Lesson;
  gradient: string;
  courseId: string;
  onBack: () => void;
  completedSteps: number[];
  onStepComplete: (step: number) => void;
  onQuizComplete: (score: number, total: number) => void;
  onAddFlashcard: (word: { en: string; fr: string; phonetic?: string; context?: string }) => void;
}

const STEPS = [
  { id: 0, label: "Mots", icon: BookOpen },
  { id: 1, label: "Phrases", icon: MessageCircle },
  { id: 2, label: "Dialogue", icon: Volume2 },
  { id: 3, label: "Quiz", icon: Lightbulb },
];

const LessonView = ({
  lesson,
  gradient,
  onBack,
  completedSteps,
  onStepComplete,
  onQuizComplete,
  onAddFlashcard,
}: LessonViewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const hasDialogue = !!lesson.dialogues && lesson.dialogues.length > 0;
  const availableSteps = STEPS.filter((s) => s.id !== 2 || hasDialogue);

  // For the words/phrases section: last item advances step; for dialogue, button = next step
  const goToNextStep = () => {
    const idx = availableSteps.findIndex((s) => s.id === currentStep);
    onStepComplete(currentStep);
    if (idx < availableSteps.length - 1) {
      setCurrentStep(availableSteps[idx + 1].id);
      setWordIndex(0);
      setPhraseIndex(0);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-card hover:bg-muted transition-colors border border-border"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-display font-bold text-foreground truncate">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground truncate">{lesson.titleFr}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {availableSteps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? `${gradient} text-primary-foreground`
                  : isDone
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {isDone && !isActive ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Tips */}
      {lesson.tips && currentStep === 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          {lesson.tips.map((tip, i) => (
            <p key={i} className="text-sm text-muted-foreground">{tip}</p>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* WORDS */}
        {currentStep === 0 && (
          <motion.div
            key="words"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                Mot {wordIndex + 1} / {lesson.words.length}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full mx-4 overflow-hidden">
                <div
                  className={`h-full ${gradient} rounded-full transition-all`}
                  style={{ width: `${((wordIndex + 1) / lesson.words.length) * 100}%` }}
                />
              </div>
            </div>

            <WordCard word={lesson.words[wordIndex]} gradient={gradient} />

            <button
              onClick={() => onAddFlashcard(lesson.words[wordIndex])}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter aux flashcards
            </button>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setWordIndex((i) => Math.max(0, i - 1))}
                disabled={wordIndex === 0}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button
                onClick={() => {
                  if (wordIndex < lesson.words.length - 1) {
                    setWordIndex((i) => i + 1);
                  } else {
                    goToNextStep();
                  }
                }}
                className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium transition-colors ${gradient} text-primary-foreground`}
              >
                {wordIndex < lesson.words.length - 1 ? (
                  <>Suivant <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Passer aux phrases <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* PHRASES */}
        {currentStep === 1 && (
          <motion.div
            key="phrases"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                Phrase {phraseIndex + 1} / {lesson.phrases.length}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full mx-4 overflow-hidden">
                <div
                  className={`h-full ${gradient} rounded-full transition-all`}
                  style={{ width: `${((phraseIndex + 1) / lesson.phrases.length) * 100}%` }}
                />
              </div>
            </div>

            <PhraseCard phrase={lesson.phrases[phraseIndex]} gradient={gradient} />

            <button
              onClick={() => onAddFlashcard(lesson.phrases[phraseIndex])}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter aux flashcards
            </button>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setPhraseIndex((i) => Math.max(0, i - 1))}
                disabled={phraseIndex === 0}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button
                onClick={() => {
                  if (phraseIndex < lesson.phrases.length - 1) {
                    setPhraseIndex((i) => i + 1);
                  } else {
                    goToNextStep();
                  }
                }}
                className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium transition-colors ${gradient} text-primary-foreground`}
              >
                {phraseIndex < lesson.phrases.length - 1 ? (
                  <>Suivant <ChevronRight className="w-4 h-4" /></>
                ) : hasDialogue ? (
                  <>Passer au dialogue <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Passer au quiz <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* DIALOGUE */}
        {currentStep === 2 && lesson.dialogues && (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
          >
            <DialogueChat dialogues={lesson.dialogues} gradient={gradient} />
            <button
              onClick={goToNextStep}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-semibold transition-colors ${gradient} text-primary-foreground`}
            >
              Passer au quiz <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* QUIZ */}
        {currentStep === 3 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <QuizView
              lesson={lesson}
              gradient={gradient}
              onComplete={(score, total) => {
                onQuizComplete(score, total);
                onStepComplete(3);
              }}
            />
            {/* "Terminer" button appears once quiz is done via completedSteps */}
            {completedSteps.includes(3) && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onBack}
                className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl ${gradient} text-primary-foreground font-display font-bold`}
              >
                <CheckCircle2 className="w-5 h-5" /> Terminer la leçon
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonView;
