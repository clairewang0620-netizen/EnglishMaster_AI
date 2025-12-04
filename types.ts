export interface Word {
  id: string;
  english: string;
  chinese: string;
  ipa: string;
  exampleEn: string;
  exampleCn: string;
  levelId: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  lines: {
    speaker: string;
    english: string;
    chinese: string;
    avatar: string;
  }[];
}

export interface Level {
  id: string;
  title: string;
  subTitle: string; // "Foundation", "Advanced", etc. (No exam keywords)
  description: string;
  icon: string;
  isPremium: boolean;
  words: Word[];
  scenarios: Scenario[];
}

export interface QuizQuestion {
  wordId: string;
  type: 'multiple-choice' | 'spelling' | 'listening';
  question: string; // The prompt (e.g., Chinese definition, or Audio)
  options?: string[]; // For multiple choice
  correctAnswer: string;
}

export interface MistakeRecord {
  wordId: string;
  timestamp: number;
  count: number;
}