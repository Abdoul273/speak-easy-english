import { motion, AnimatePresence } from "framer-motion";
import { Word } from "@/data/courses/types";
import { Info } from "lucide-react";

const cleanPhonetic = (phonetic: string): string => {
  return phonetic.replace(/^\/+|\/+$/g, "").trim();
};

interface PhraseCardProps {
  phrase: Word;
  gradient: string;
}

const PhraseCard = ({ phrase, gradient }: PhraseCardProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phrase.en}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        <h3 className="text-2xl font-display font-bold text-foreground leading-snug">
          {phrase.en}
        </h3>

        {phrase.phonetic && (
          <p className="text-base text-primary font-medium tracking-wide">
            {cleanPhonetic(phrase.phonetic)}
          </p>
        )}

        <p className="text-xl text-secondary font-semibold">
          {phrase.fr}
        </p>

        {phrase.context && (
          <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3.5">
            <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {phrase.context}
            </p>
          </div>
        )}

        {phrase.example && (
          <div className="pl-4 border-l-2 border-primary/40 space-y-1">
            <p className="text-base text-foreground/90 italic leading-relaxed">
              "{phrase.example}"
            </p>
            <p className="text-sm text-muted-foreground">
              {phrase.exampleFr}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PhraseCard;
