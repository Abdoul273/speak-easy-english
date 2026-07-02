import { motion, AnimatePresence } from "framer-motion";
import { Word } from "@/data/courses/types";
import { Info } from "lucide-react";
import SpeakButton from "@/components/SpeakButton";

const cleanPhonetic = (phonetic: string): string => {
  return phonetic.replace(/^\/+|\/+$/g, "").trim();
};

interface WordCardProps {
  word: Word;
  gradient: string;
}

const WordCard = ({ word }: WordCardProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={word.en}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        {/* Word + Speak Button + Phonetic */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-display font-bold text-foreground flex-1">
              {word.en}
            </h3>
            <SpeakButton text={word.en} size="lg" />
          </div>
          {word.phonetic && (
            <p className="text-base text-primary font-medium tracking-wide">
              {cleanPhonetic(word.phonetic)}
            </p>
          )}
        </div>

        <p className="text-xl text-secondary font-semibold">{word.fr}</p>

        {word.context && (
          <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3.5">
            <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {word.context}
            </p>
          </div>
        )}

        {word.example && (
          <div className="pl-4 border-l-2 border-primary/40 space-y-2">
            <div className="flex items-start gap-2">
              <p className="text-base text-foreground/90 italic leading-relaxed flex-1">
                "{word.example}"
              </p>
              <SpeakButton text={word.example} size="sm" variant="ghost" />
            </div>
            <p className="text-sm text-muted-foreground">{word.exampleFr}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WordCard;
