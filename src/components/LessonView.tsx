import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "@/data/courses";
import { ArrowLeft, BookOpen, MessageCircle, Lightbulb, Volume2 } from "lucide-react";
import QuizView from "./QuizView";

interface LessonViewProps {
  lesson: Lesson;
  gradient: string;
  onBack: () => void;
}

type Tab = "words" | "phrases" | "dialogue" | "quiz";

const LessonView = ({ lesson, gradient, onBack }: LessonViewProps) => {
  const [tab, setTab] = useState<Tab>("words");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "words", label: "Mots", icon: <BookOpen className="w-4 h-4" /> },
    { id: "phrases", label: "Phrases", icon: <MessageCircle className="w-4 h-4" /> },
    ...(lesson.dialogues ? [{ id: "dialogue" as Tab, label: "Dialogue", icon: <Volume2 className="w-4 h-4" /> }] : []),
    { id: "quiz", label: "Quiz", icon: <Lightbulb className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground">{lesson.titleFr}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? `${gradient} text-primary-foreground`
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tips */}
      {lesson.tips && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          {lesson.tips.map((tip, i) => (
            <p key={i} className="text-sm text-muted-foreground">{tip}</p>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {tab === "words" && (
          <motion.div key="words" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {lesson.words.map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-lg font-display font-bold text-foreground">{word.en}</span>
                  {word.phonetic && <span className="text-xs text-muted-foreground font-mono">/{word.phonetic}/</span>}
                </div>
                <p className="text-sm text-primary font-medium">{word.fr}</p>
                {word.example && (
                  <div className="mt-2 pl-3 border-l-2 border-primary/30">
                    <p className="text-sm text-foreground/90 italic">{word.example}</p>
                    <p className="text-xs text-muted-foreground">{word.exampleFr}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "phrases" && (
          <motion.div key="phrases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {lesson.phrases.map((phrase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <p className="text-foreground font-display font-semibold">{phrase.en}</p>
                <p className="text-sm text-primary mt-1">{phrase.fr}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "dialogue" && lesson.dialogues && (
          <motion.div key="dialogue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {lesson.dialogues.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: line.speaker === "A" || line.speaker === "You" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-xl p-4 max-w-[85%] ${
                  line.speaker === "A" || line.speaker === "You"
                    ? `${gradient} text-primary-foreground ml-0`
                    : "bg-card border border-border text-foreground ml-auto"
                }`}
              >
                <p className="text-xs font-bold uppercase mb-1 opacity-70">{line.speaker}</p>
                <p className="font-medium">{line.en}</p>
                <p className={`text-sm mt-1 ${
                  line.speaker === "A" || line.speaker === "You" ? "opacity-80" : "text-muted-foreground"
                }`}>{line.fr}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizView lesson={lesson} gradient={gradient} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonView;
