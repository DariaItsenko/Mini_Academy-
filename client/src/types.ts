export interface Avatar {
  skin: string;
  hair: string;
  hairStyle: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
}

export interface UserStats {
  completedCount: number;
  subjectsCompleted: number;
  totalLevels: number;
  maxLevels: number;
  maxStars: number;
  accuracy: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  parentEmail?: string;
  age: number;
  grade: number;
  characterGender: 'boy' | 'girl';
  avatar: Avatar;
  points: number;
  stars: number;
  streak: number;
  ownedItems: string[];
  isAdmin: boolean;
  completedExercises: string[];
  stats: UserStats;
}

export interface ShopItem {
  id: string;
  category: string;
  label: string;
  cost: number;
  value: string;
}

export interface Exercise {
  id: string;
  subject: string;
  topic: string;
  title: string;
  points: number;
}

export interface ExerciseQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface ExerciseFull {
  id: string;
  subject: string;
  title: string;
  points: number;
  questions: ExerciseQuestion[];
}

export interface ExampleItem {
  title: string;
  body: string;
}

export interface SubtopicContent {
  assignmentId: string;
  videoUrl?: string;
  youtubeUrl?: string;
  videoTitle: string;
  videoDescription: string;
  lectureTitle: string;
  lectureParagraphs: string[];
  examples: ExampleItem[];
}

export interface Subtopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: SubtopicContent;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  subtopics: Subtopic[];
}

/** @deprecated legacy seed shape — normalized on load */
export interface LegacyTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: SubtopicContent;
}

/** @deprecated legacy seed shape — normalized on load */
export interface LegacySection {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: LegacyTopic[];
}

export interface SubjectCurriculum {
  id: string;
  titleKey: string;
  /** Display name for custom subjects (not in i18n) */
  label?: string;
  icon: string;
  gradientClass: string;
  /** Home page card style, e.g. math-card */
  cardClass?: string;
  topics: Topic[];
  sections?: LegacySection[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}
