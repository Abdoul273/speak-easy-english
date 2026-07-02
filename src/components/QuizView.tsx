import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, Zap } from "lucide-react";
import { Lesson } from "@/data/courses";
import { QuizQuestion, generateQuizQuestions } from "@/data/quizData";
import SpeakButton from "./SpeakButton";

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
  const [countdown, setCountdown] = useState<number | null>(null);

  const q = questions[current];

  const advance = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setCountdown(null);
    } else {
      setFinished(true);
      onComplete(score + (selected === q.correct ? 0 : 0), questions.length);
    }
  };

  // Auto-advance logic
  useEffect(() => {
    if (!selected) return;
    const isCorrect = selected === q.correct;

    if (isCorrect) {
      // Auto-advance quickly on correct
      const t = setTimeout(advance, 1200);
      return () => clearTimeout(t);
    } else {
      // Wait 7 seconds on wrong, with countdown
      let sec = 7;
      setCountdown(sec);
      const interval = setInterval(() => {
        sec -= 1;
        if (sec <= 0) {
          clearInterval(interval);
          advance();
        } else {
          setCountdown(sec);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === q.correct) setScore((s) => s + 1);
  };

  const restart = () => {
    setQuestions(generateQuizQuestions(lesson, 10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setCountdown(null);
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
        <button
          onClick={restart}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${gradient} text-primary-foreground font-display font-semibold`}
        >
          <RotateCcw className="w-4 h-4" /> Recommencer
        </button>
      </motion.div>
    );
  }

  if (!q) return null;

  // Determine if we can auto-speak the prompt (English text)
  const isEnglishPrompt = q.type === "en-to-fr" || q.type === "fill-blank" || q.type === "match-phrase";

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${gradient} rounded-full`}
            animate={{ width: `${(current / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {current + 1}/{questions.length}
        </span>
      </div>

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
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${gradient} text-primary-foreground`}>
              {quizTypeLabels[q.type] || q.type}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 py-4">
            <h3 className="text-2xl font-display font-bold text-foreground text-center">
              {q.prompt}
            </h3>
            {isEnglishPrompt && <SpeakButton text={q.prompt} size="md" />}
          </div>

          {q.promptFr && (
            <p className="text-sm text-muted-foreground text-center -mt-2">{q.promptFr}</p>
          )}

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => {
              let variant = "bg-card border border-border text-foreground hover:bg-muted cursor-pointer";
              if (selected) {
                if (option === q.correct)
                  variant = "bg-primary/20 border-2 border-primary text-primary";
                else if (option === selected)
                  variant = "bg-destructive/20 border-2 border-destructive text-destructive";
                else variant = "bg-card border border-border text-muted-foreground opacity-50";
              }
              // For fr-to-en quiz, options are English → speakable
              const isSpeakable = q.type === "fr-to-en";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`w-full rounded-xl font-medium transition-all flex items-center gap-2 ${variant}`}
                >
                  <button
                    onClick={() => handleSelect(option)}
                    disabled={!!selected}
                    className="flex-1 text-left px-5 py-4 flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {selected && option === q.correct && <Check className="w-5 h-5" />}
                    {selected && option === selected && option !== q.correct && (
                      <X className="w-5 h-5" />
                    )}
                  </button>
                  {isSpeakable && !selected && (
                    <div className="pr-3">
                      <SpeakButton text={option} size="sm" variant="ghost" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Feedback + countdown */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 ${
                selected === q.correct
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {selected === q.correct ? "✅ Correct !" : "❌ Incorrect"}
              </p>
              {selected !== q.correct && (
                <p className="text-sm text-muted-foreground">
                  La bonne réponse : <span className="font-semibold text-foreground">{q.correct}</span>
                </p>
              )}
              {q.explanation && (
                <p className="text-xs text-muted-foreground mt-2 italic">"{q.explanation}"</p>
              )}
              {countdown !== null && countdown > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Question suivante dans {countdown}s...
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizView;
