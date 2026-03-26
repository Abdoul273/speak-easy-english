import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allCourses, Course, Lesson } from "@/data/courses";
import CourseCard from "@/components/CourseCard";
import LessonList from "@/components/LessonList";
import LessonView from "@/components/LessonView";
import { ArrowLeft, Flame, Zap } from "lucide-react";

type View = "home" | "course" | "lesson";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setView("course");
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView("lesson");
  };

  const goHome = () => {
    setView("home");
    setSelectedCourse(null);
    setSelectedLesson(null);
  };

  const goToCourse = () => {
    setView("course");
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center pt-6 space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
                >
                  <Flame className="w-4 h-4 text-neon-orange" />
                  <span className="text-sm font-medium text-muted-foreground">Real American English</span>
                </motion.div>
                <h1 className="text-4xl font-display font-bold text-foreground">
                  Speak<span className="text-gradient-primary"> USA</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Apprends le vrai anglais américain — celui qu'on parle vraiment dans la rue, au bureau et entre amis 🇺🇸
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-foreground">{allCourses.length}</p>
                  <p className="text-xs text-muted-foreground">Thèmes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-foreground">
                    {allCourses.reduce((acc, c) => acc + c.lessons.length, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Leçons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-foreground">
                    {allCourses.reduce((acc, c) => acc + c.lessons.reduce((a, l) => a + l.words.length + l.phrases.length, 0), 0)}+
                  </p>
                  <p className="text-xs text-muted-foreground">Mots & Phrases</p>
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-display font-bold text-foreground">Choisis ton thème</h2>
                </div>
                <div className="grid gap-4">
                  {allCourses.map((course, i) => (
                    <CourseCard key={course.id} course={course} onClick={() => openCourse(course)} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === "course" && selectedCourse && (
            <motion.div
              key="course"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <button onClick={goHome} className="p-2 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    {selectedCourse.emoji} {selectedCourse.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedCourse.titleFr}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{selectedCourse.descriptionFr}</p>

              <LessonList
                lessons={selectedCourse.lessons}
                onSelect={openLesson}
                gradient={selectedCourse.gradient}
              />
            </motion.div>
          )}

          {view === "lesson" && selectedLesson && selectedCourse && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <LessonView
                lesson={selectedLesson}
                gradient={selectedCourse.gradient}
                onBack={goToCourse}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
