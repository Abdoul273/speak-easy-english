import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, ArrowRight, Zap } from "lucide-react";
import { Lesson } from "@/data/courses";
import { QuizQuestion, generateQuizQuestions } from "@/data/quizData";

interface QuizViewProps {
  lesson: Lesson;
  gradient: string;
  onComplete: (score: number, total: number) => void;
}

const quizTypeLabels: Record<string, string> = {
  "en-to-fr": "Traduis en français",
  "fr-to-en": "Traduis en anglais",
  "fill-blank": "Complète la phrase",
  "match-phrase": "Trouve la traduction",
};

const QuizView = ({ lesson, gradient, onComplete }: QuizViewProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuizQuestions(lesson, 10)
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[current];

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === q.correct;
    if (isCorrect) setScore((s) => s + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      onComplete(score, questions.length);
    }
  };

  const restart = () => {
    setQuestions(generateQuizQuestions(lesson, 10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setShowExplanation(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-10 space-y-6"
      >
        <div className="text-6xl">
          {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}
        </div>
        <h3 className="text-3xl font-display font-bold text-foreground">
          {score} / {questions.length}
        </h3>
        <p className="text-lg text-muted-foreground">
          {pct >= 80
            ? "Excellent ! Tu maîtrises ce sujet ! 🔥"
            : pct >= 50
            ? "Pas mal ! Encore un peu de pratique !"
            : "Continue à t'entraîner, tu vas y arriver !"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={restart}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${gradient} text-primary-foreground font-display font-semibold`}
          >
            <RotateCcw className="w-4 h-4" /> Recommencer
          </button>
        </div>
      </motion.div>
    );
  }

  if (!q) return null;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${gradient} rounded-full`}
            animate={{ width: `${((current) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {current + 1}/{questions.length}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-accent">{score} points</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-5"
        >
          {/* Question type badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${gradient} text-primary-foreground`}>
              {quizTypeLabels[q.type] || q.type}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-2xl font-display font-bold text-foreground text-center py-4">
            {q.prompt}
          </h3>

          {q.promptFr && (
            <p className="text-sm text-muted-foreground text-center -mt-2">{q.promptFr}</p>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => {
              let variant =
                "bg-card border border-border text-foreground hover:bg-muted cursor-pointer";
              if (selected) {
                if (option === q.correct)
                  variant = "bg-primary/20 border-2 border-primary text-primary";
                else if (option === selected)
                  variant = "bg-destructive/20 border-2 border-destructive text-destructive";
                else variant = "bg-card border border-border text-muted-foreground opacity-50";
              }
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                  className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all flex items-center justify-between ${variant}`}
                >
                  <span>{option}</span>
                  {selected && option === q.correct && (
                    <Check className="w-5 h-5" />
                  )}
                  {selected && option === selected && option !== q.correct && (
                    <X className="w-5 h-5" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (q.explanation || q.explanationFr) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 border border-border rounded-xl p-4"
            >
              {q.explanation && (
                <p className="text-sm text-foreground italic">"{q.explanation}"</p>
              )}
              {q.explanationFr && (
                <p className="text-xs text-muted-foreground mt-1">{q.explanationFr}</p>
              )}
            </motion.div>
          )}

          {/* Next button */}
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl ${gradient} text-primary-foreground font-display font-semibold`}
            >
              {current + 1 < questions.length ? (
                <>
                  Suivant <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                "Voir le résultat"
              )}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizView;
