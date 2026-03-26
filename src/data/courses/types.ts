export interface Word {
  en: string;
  fr: string;
  phonetic?: string;
  example?: string;
  exampleFr?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  words: Word[];
  phrases: Word[];
  dialogues?: { speaker: string; en: string; fr: string }[];
  tips?: string[];
}

export interface Course {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  emoji: string;
  gradient: "gradient-primary" | "gradient-accent" | "gradient-warm";
  glow: "glow-primary" | "glow-accent" | "glow-warm";
  lessons: Lesson[];
}
