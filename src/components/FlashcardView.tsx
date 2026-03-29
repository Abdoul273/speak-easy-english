import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X, Eye, EyeOff, ArrowRight } from "lucide-react";

interface FlashcardEntry {
  en: string;
  fr: string;
  phonetic?: string;
  context?: string;
  courseId: string;
  lessonId: string;
}

interface FlashcardViewProps {
  cards: FlashcardEntry[];
  onReview: (en: string, quality: number) => void;
  onComplete: () => void;
}

const FlashcardView = ({ cards, onReview, onComplete }: FlashcardViewProps) => {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({ correct: 0, wrong: 0 });

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-display font-bold text-foreground">
          Pas de flashcards pour aujourd'hui !
        </h3>
        <p className="text-muted-foreground text-sm">
          Apprends de nouveaux mots dans les leçons pour les revoir ici demain.
        </p>
      </div>
    );
  }

  const card = cards[current];

  const handleAnswer = (quality: number) => {
    onReview(card.en, quality);
    if (quality >= 3) {
      setResults((r) => ({ ...r, correct: r.correct + 1 }));
    } else {
      setResults((r) => ({ ...r, wrong: r.wrong + 1 }));
    }

    if (current + 1 < cards.length) {
      setCurrent((c) => c + 1);
      setFlipped(false);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  if (finished) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-10 space-y-6"
      >
        <div className="text-5xl">🧠</div>
        <h3 className="text-2xl font-display font-bold text-foreground">
          Révision terminée !
        </h3>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{results.correct}</p>
            <p className="text-xs text-muted-foreground">Maîtrisés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">{results.wrong}</p>
            <p className="text-xs text-muted-foreground">À revoir</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-accent rounded-full"
            animate={{ width: `${((current) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {current + 1}/{cards.length}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer bg-card border border-border rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-3 right-3">
            {flipped ? (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {!flipped ? (
            <>
              <p className="text-3xl font-display font-bold text-foreground">{card.en}</p>
              {card.phonetic && (
                <p className="text-sm text-muted-foreground font-mono mt-2">/{card.phonetic}/</p>
              )}
              <p className="text-xs text-muted-foreground mt-4">Tapote pour voir la traduction</p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">{card.en}</p>
              <p className="text-3xl font-display font-bold text-primary">{card.fr}</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <button
            onClick={() => handleAnswer(1)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive hover:bg-destructive/30 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="text-xs font-medium">Pas su</span>
          </button>
          <button
            onClick={() => handleAnswer(3)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs font-medium">Difficile</span>
          </button>
          <button
            onClick={() => handleAnswer(5)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
          >
            <Check className="w-5 h-5" />
            <span className="text-xs font-medium">Facile</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardView;
