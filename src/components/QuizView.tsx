import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lesson, Word } from "@/data/courses";
import { Check, X, RotateCcw } from "lucide-react";

interface QuizViewProps {
  lesson: Lesson;
  gradient: string;
}

interface Question {
  word: Word;
  options: string[];
  correct: string;
  type: "en-to-fr" | "fr-to-en";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QuizView = ({ lesson, gradient }: QuizViewProps) => {
  const allWords = useMemo(() => [...lesson.words, ...lesson.phrases], [lesson]);

  const generateQuestions = (): Question[] => {
    const pool = shuffle(allWords).slice(0, Math.min(8, allWords.length));
    return pool.map((word) => {
      const type = Math.random() > 0.5 ? "en-to-fr" : "fr-to-en";
      const correct = type === "en-to-fr" ? word.fr : word.en;
      const others = shuffle(
        allWords.filter((w) => w.en !== word.en).map((w) => (type === "en-to-fr" ? w.fr : w.en))
      ).slice(0, 3);
      return {
        word,
        options: shuffle([correct, ...others]),
        correct,
        type,
      };
    });
  };

  const [questions, setQuestions] = useState<Question[]>(generateQuestions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const restart = () => {
    setQuestions(generateQuestions());
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
        <div className="text-6xl">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
        <h3 className="text-2xl font-display font-bold text-foreground">
          {score} / {questions.length}
        </h3>
        <p className="text-muted-foreground">
          {pct >= 80 ? "Excellent ! Tu gères !" : pct >= 50 ? "Pas mal ! Continue comme ça !" : "Continue à t'entraîner, tu vas y arriver !"}
        </p>
        <button onClick={restart} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${gradient} text-primary-foreground font-display font-semibold`}>
          <RotateCcw className="w-4 h-4" /> Recommencer
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${gradient} rounded-full`}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
          {q.type === "en-to-fr" ? "Traduis en français" : "Translate to English"}
        </p>
        <h3 className="text-2xl font-display font-bold text-foreground">
          {q.type === "en-to-fr" ? q.word.en : q.word.fr}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((option, i) => {
          let variant = "bg-card border border-border text-foreground hover:bg-muted";
          if (selected) {
            if (option === q.correct) variant = "bg-primary/20 border border-primary text-primary";
            else if (option === selected) variant = "bg-destructive/20 border border-destructive text-destructive";
          }
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all flex items-center justify-between ${variant}`}
            >
              <span>{option}</span>
              {selected && option === q.correct && <Check className="w-5 h-5" />}
              {selected && option === selected && option !== q.correct && <X className="w-5 h-5" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizView;
