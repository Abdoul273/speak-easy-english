import { motion } from "framer-motion";
import { Lesson } from "@/data/courses";
import { ChevronRight, CheckCircle2, Lock } from "lucide-react";

interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
  onSelect: (lesson: Lesson) => void;
  gradient: string;
  completedLessons: string[];
}

const LessonList = ({ lessons, courseId, onSelect, gradient, completedLessons }: LessonListProps) => {
  return (
    <div className="space-y-3">
      {lessons.map((lesson, i) => {
        const isCompleted = completedLessons.includes(`${courseId}__${lesson.id}`);
        const isLocked = i > 0 && !completedLessons.includes(`${courseId}__${lessons[i - 1].id}`) && i > 1;

        return (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => !isLocked && onSelect(lesson)}
            disabled={isLocked}
            className={`w-full text-left rounded-xl p-4 flex items-center justify-between group transition-colors border ${
              isLocked
                ? "bg-muted/50 border-border opacity-50 cursor-not-allowed"
                : isCompleted
                ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                : "bg-card border-border hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                  isCompleted
                    ? "bg-primary/20 text-primary"
                    : isLocked
                    ? "bg-muted text-muted-foreground"
                    : `${gradient} text-primary-foreground`
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground">{lesson.title}</h4>
                <p className="text-sm text-muted-foreground">{lesson.titleFr}</p>
              </div>
            </div>
            {!isLocked && (
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default LessonList;
