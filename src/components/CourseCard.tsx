import { motion } from "framer-motion";
import { Course } from "@/data/courses";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  index: number;
}

const CourseCard = ({ course, onClick, index }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-6 ${course.gradient} ${course.glow} overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 group-hover:to-black/10 transition-all duration-300" />
      <div className="relative z-10">
        <span className="text-4xl mb-3 block">{course.emoji}</span>
        <h3 className="text-xl font-display font-bold text-primary-foreground mb-1">
          {course.title}
        </h3>
        <p className="text-sm font-medium text-primary-foreground/80 mb-3">
          {course.titleFr}
        </p>
        <p className="text-xs text-primary-foreground/70 mb-4">
          {course.descriptionFr}
        </p>
        <div className="flex items-center gap-2 text-primary-foreground/90">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">{course.lessons.length} leçons</span>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-white/10"
        whileHover={{ scale: 1.2 }}
      />
    </motion.div>
  );
};

export default CourseCard;
