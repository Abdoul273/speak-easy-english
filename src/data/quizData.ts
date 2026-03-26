import { Word, Lesson } from "./courses/types";

export type QuizType = "en-to-fr" | "fr-to-en" | "fill-blank" | "match-phrase" | "listen-write";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  promptFr?: string;
  options: string[];
  correct: string;
  explanation?: string;
  explanationFr?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateEnToFr(word: Word, allWords: Word[]): QuizQuestion {
  const others = shuffle(allWords.filter((w) => w.en !== word.en)).slice(0, 3);
  return {
    id: `en-fr-${word.en}`,
    type: "en-to-fr",
    prompt: word.en,
    promptFr: "Quelle est la traduction en français ?",
    options: shuffle([word.fr, ...others.map((w) => w.fr)]),
    correct: word.fr,
    explanation: word.example,
    explanationFr: word.exampleFr,
  };
}

function generateFrToEn(word: Word, allWords: Word[]): QuizQuestion {
  const others = shuffle(allWords.filter((w) => w.fr !== word.fr)).slice(0, 3);
  return {
    id: `fr-en-${word.fr}`,
    type: "fr-to-en",
    prompt: word.fr,
    promptFr: "What's the English translation?",
    options: shuffle([word.en, ...others.map((w) => w.en)]),
    correct: word.en,
    explanation: word.example,
    explanationFr: word.exampleFr,
  };
}

function generateFillBlank(phrase: Word, allWords: Word[]): QuizQuestion {
  // Pick a word from the phrase to blank out
  const words = phrase.en.split(" ");
  if (words.length < 3) return generateEnToFr(phrase, allWords);
  
  const blankIdx = Math.floor(Math.random() * (words.length - 1)) + 1;
  const blankedWord = words[blankIdx].replace(/[.,!?]/g, "");
  const prompt = words.map((w, i) => (i === blankIdx ? "______" : w)).join(" ");

  const otherWords = shuffle(
    allWords
      .flatMap((w) => w.en.split(" "))
      .filter((w) => w.toLowerCase() !== blankedWord.toLowerCase() && w.length > 2)
  ).slice(0, 3);

  return {
    id: `fill-${phrase.en}`,
    type: "fill-blank",
    prompt,
    promptFr: `Complète la phrase (${phrase.fr})`,
    options: shuffle([blankedWord, ...otherWords]),
    correct: blankedWord,
    explanation: phrase.en,
    explanationFr: phrase.fr,
  };
}

function generateMatchPhrase(phrase: Word, allPhrases: Word[]): QuizQuestion {
  const others = shuffle(allPhrases.filter((p) => p.en !== phrase.en)).slice(0, 3);
  return {
    id: `match-${phrase.en}`,
    type: "match-phrase",
    prompt: phrase.en,
    promptFr: "Trouve la bonne traduction de cette phrase",
    options: shuffle([phrase.fr, ...others.map((p) => p.fr)]),
    correct: phrase.fr,
  };
}

export function generateQuizQuestions(lesson: Lesson, count: number = 10): QuizQuestion[] {
  const allWords = [...lesson.words, ...lesson.phrases];
  const questions: QuizQuestion[] = [];

  // Mix of quiz types
  const wordPool = shuffle(lesson.words);
  const phrasePool = shuffle(lesson.phrases);

  // EN→FR questions from words
  wordPool.slice(0, 3).forEach((w) => {
    questions.push(generateEnToFr(w, allWords));
  });

  // FR→EN questions from words
  wordPool.slice(3, 6).forEach((w) => {
    questions.push(generateFrToEn(w, allWords));
  });

  // Fill in the blank from phrases
  phrasePool.slice(0, 2).forEach((p) => {
    questions.push(generateFillBlank(p, allWords));
  });

  // Match phrase
  phrasePool.slice(2, 4).forEach((p) => {
    questions.push(generateMatchPhrase(p, lesson.phrases));
  });

  // Extra mixed from remaining
  const remaining = shuffle([...wordPool.slice(6), ...phrasePool.slice(4)]);
  remaining.slice(0, Math.max(0, count - questions.length)).forEach((w) => {
    if (Math.random() > 0.5) {
      questions.push(generateEnToFr(w, allWords));
    } else {
      questions.push(generateFrToEn(w, allWords));
    }
  });

  return shuffle(questions).slice(0, count);
}

export function generateDailyQuiz(
  allLessonsWords: { words: Word[]; phrases: Word[] }[],
  count: number = 15
): QuizQuestion[] {
  const allWords = allLessonsWords.flatMap((l) => [...l.words, ...l.phrases]);
  const pool = shuffle(allWords);
  const questions: QuizQuestion[] = [];

  pool.slice(0, count).forEach((w, i) => {
    const type = i % 4;
    switch (type) {
      case 0:
        questions.push(generateEnToFr(w, allWords));
        break;
      case 1:
        questions.push(generateFrToEn(w, allWords));
        break;
      case 2:
        questions.push(generateFillBlank(w, allWords));
        break;
      default:
        questions.push(generateMatchPhrase(w, allWords));
    }
  });

  return shuffle(questions);
}
