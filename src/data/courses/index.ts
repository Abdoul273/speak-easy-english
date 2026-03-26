// Import all courses here — add new courses by creating a new file and importing it
import { everydayCourse } from "./everyday";
import { slangCourse } from "./slang";
import { professionalCourse } from "./professional";
import { Course } from "./types";

export const allCourses: Course[] = [
  everydayCourse,
  slangCourse,
  professionalCourse,
];

export type { Course, Lesson, Word } from "./types";
