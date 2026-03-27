import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "@/data/courses";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, BookOpen, MessageCircle, Volume2, Lightbulb, CheckCircle2, Plus, Info } from "lucide-react";
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
  onAddFlashcard: (word: { en: string; fr: string; phonetic?: string }) => void;
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
  courseId,
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

  const goNext = () => {
    const currentIdx = availableSteps.findIndex((s) => s.id === currentStep);
    if (currentIdx < availableSteps.length - 1) {
      onStepComplete(currentStep);
      setCurrentStep(availableSteps[currentIdx + 1].id);
    }
  };

  const goPrev = () => {
    const currentIdx = availableSteps.findIndex((s) => s.id === currentStep);
    if (currentIdx > 0) {
      setCurrentStep(availableSteps[currentIdx - 1].id);
    }
  };

  const isLastStep = availableSteps.findIndex((s) => s.id === currentStep) === availableSteps.length - 1;
  const isFirstStep = availableSteps.findIndex((s) => s.id === currentStep) === 0;

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
      <div className="flex items-center gap-1">
        {availableSteps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

      {/* Content */}
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
                  }
                }}
                disabled={wordIndex === lesson.words.length - 1}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-medium disabled:opacity-30 transition-colors ${gradient} text-primary-foreground`}
              >
                Suivant <ChevronRight className="w-4 h-4" />
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
                  }
                }}
                disabled={phraseIndex === lesson.phrases.length - 1}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-medium disabled:opacity-30 transition-colors ${gradient} text-primary-foreground`}
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* DIALOGUE */}
        {currentStep === 2 && lesson.dialogues && (
          <DialogueChat dialogues={lesson.dialogues} gradient={gradient} />
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step navigation (not for quiz) */}
      {currentStep !== 3 && (
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
          <button
            onClick={goPrev}
            disabled={isFirstStep}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Étape précédente
          </button>
          <button
            onClick={() => {
              onStepComplete(currentStep);
              goNext();
            }}
            disabled={isLastStep}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${gradient} text-primary-foreground`}
          >
            Étape suivante <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonView;
