import { motion, AnimatePresence } from "framer-motion";
import { Word } from "@/data/courses/types";
import { Info } from "lucide-react";

// Clean IPA: remove slashes, convert to readable pronunciation
const cleanPhonetic = (phonetic: string): string => {
  return phonetic.replace(/^\/+|\/+$/g, "").trim();
};

interface WordCardProps {
  word: Word;
  gradient: string;
}

const WordCard = ({ word, gradient }: WordCardProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={word.en}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        {/* Word + Phonetic */}
        <div className="space-y-1">
          <h3 className="text-3xl font-display font-bold text-foreground">
            {word.en}
          </h3>
          {word.phonetic && (
            <p className="text-base text-primary font-medium tracking-wide">
              {cleanPhonetic(word.phonetic)}
            </p>
          )}
        </div>

        {/* Translation */}
        <p className="text-xl text-secondary font-semibold">
          {word.fr}
        </p>

        {/* Context */}
        {word.context && (
          <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3.5">
            <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {word.context}
            </p>
          </div>
        )}

        {/* Example */}
        {word.example && (
          <div className="pl-4 border-l-2 border-primary/40 space-y-1">
            <p className="text-base text-foreground/90 italic leading-relaxed">
              "{word.example}"
            </p>
            <p className="text-sm text-muted-foreground">
              {word.exampleFr}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WordCard;
