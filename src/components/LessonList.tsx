import { motion } from "framer-motion";
import { Lesson } from "@/data/courses";
import { ChevronRight } from "lucide-react";

interface LessonListProps {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
  gradient: string;
}

const LessonList = ({ lessons, onSelect, gradient }: LessonListProps) => {
  return (
    <div className="space-y-3">
      {lessons.map((lesson, i) => (
        <motion.button
          key={lesson.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(lesson)}
          className="w-full text-left bg-card hover:bg-muted rounded-xl p-4 flex items-center justify-between group transition-colors border border-border"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center text-primary-foreground font-display font-bold text-sm`}>
              {i + 1}
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground">{lesson.title}</h4>
              <p className="text-sm text-muted-foreground">{lesson.titleFr}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.button>
      ))}
    </div>
  );
};

export default LessonList;
