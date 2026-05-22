export interface TopicContent {
  assignmentId: string;
  videoTitle: string;
  videoDescription: string;
  lectureTitle: string;
  lectureParagraphs: string[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: TopicContent;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: Topic[];
}

export interface SubjectCurriculum {
  id: string;
  titleKey: string;
  icon: string;
  gradientClass: string;
  sections: Section[];
}

export const curriculum: Record<string, SubjectCurriculum> = {
  math: {
    id: 'math',
    titleKey: 'math',
    icon: '🔢',
    gradientClass: 'math-bg',
    sections: [
      {
        id: 'numbers-operations',
        title: 'Numbers & Operations',
        description: 'Learn about numbers and how to work with them!',
        icon: '🔢',
        topics: [
          {
            id: 'addition',
            name: 'Addition',
            icon: '+',
            description: 'Add numbers together step by step.',
            content: {
              assignmentId: 'math-addition-1',
              videoTitle: 'How to Add Numbers',
              videoDescription: 'Watch how we combine two groups of objects to find the total.',
              lectureTitle: 'Understanding Addition',
              lectureParagraphs: [
                'Addition means putting groups together to find how many in all.',
                'When you see 2 + 3, start with 2 objects and add 3 more. You get 5!',
                'Use your fingers, blocks, or drawings to practice every day.',
              ],
            },
          },
          {
            id: 'subtraction',
            name: 'Subtraction',
            icon: '−',
            description: 'Take numbers away and find what is left.',
            content: {
              assignmentId: 'math-subtraction-1',
              videoTitle: 'Subtracting Numbers',
              videoDescription: 'Learn to take away and discover how many remain.',
              lectureTitle: 'Understanding Subtraction',
              lectureParagraphs: [
                'Subtraction means taking away from a group.',
                'If you have 5 apples and eat 2, you subtract: 5 − 2 = 3.',
                'Subtraction is the opposite of addition.',
              ],
            },
          },
          {
            id: 'multiplication',
            name: 'Multiplication',
            icon: '×',
            description: 'Multiply numbers using equal groups.',
            content: {
              assignmentId: 'math-multiplication-1',
              videoTitle: 'Introduction to Multiplication',
              videoDescription: 'See how equal groups help you multiply faster.',
              lectureTitle: 'Understanding Multiplication',
              lectureParagraphs: [
                'Multiplication is repeated addition.',
                '3 × 4 means three groups of four: 4 + 4 + 4 = 12.',
                'Arrays and pictures make multiplication easy to see.',
              ],
            },
          },
        ],
      },
      {
        id: 'shapes-geometry',
        title: 'Shapes & Geometry',
        description: 'Explore shapes, patterns, and spatial reasoning.',
        icon: '◆',
        topics: [
          {
            id: 'basic-shapes',
            name: 'Basic Shapes',
            icon: '◆',
            description: 'Learn circles, squares, triangles, and more.',
            content: {
              assignmentId: 'math-shapes-1',
              videoTitle: 'Meet the Shapes',
              videoDescription: 'Explore circles, squares, rectangles, and triangles.',
              lectureTitle: 'Learning Basic Shapes',
              lectureParagraphs: [
                'Shapes are everywhere around us!',
                'A circle is round with no corners. A square has 4 equal sides.',
                'A triangle has 3 sides. Look for shapes in your home and playground.',
              ],
            },
          },
        ],
      },
    ],
  },
  english: {
    id: 'english',
    titleKey: 'english',
    icon: '📖',
    gradientClass: 'english-bg',
    sections: [
      {
        id: 'reading-basics',
        title: 'Reading Basics',
        description: 'Build vocabulary and reading skills.',
        icon: '📖',
        topics: [
          {
            id: 'word-match',
            name: 'Word Match',
            icon: '📝',
            description: 'Match words with pictures and meanings.',
            content: {
              assignmentId: 'english-reading-1',
              videoTitle: 'Fun with Words',
              videoDescription: 'Connect pictures to the right English words.',
              lectureTitle: 'Building Your Vocabulary',
              lectureParagraphs: [
                'New words help you read more books and stories.',
                'Say each word out loud and use it in a sentence.',
                'Practice a little every day to remember words forever!',
              ],
            },
          },
          {
            id: 'sight-words',
            name: 'Sight Words',
            icon: '👁️',
            description: 'Learn common words you see every day.',
            content: {
              assignmentId: 'english-sight-1',
              videoTitle: 'Quick Sight Words',
              videoDescription: 'Practice reading the, and, is, and go.',
              lectureTitle: 'Words You Know by Heart',
              lectureParagraphs: ['Sight words appear in almost every sentence.'],
            },
          },
        ],
      },
      {
        id: 'grammar-writing',
        title: 'Grammar & Writing',
        description: 'Write clear sentences and use correct grammar.',
        icon: '✏️',
        topics: [
          {
            id: 'sentences',
            name: 'Making Sentences',
            icon: '📄',
            description: 'Put words in order to make a sentence.',
            content: {
              assignmentId: 'english-sentences-1',
              videoTitle: 'Build a Sentence',
              videoDescription: 'Learn subject, verb, and how they fit together.',
              lectureTitle: 'What Is a Sentence?',
              lectureParagraphs: ['A sentence tells a complete idea.'],
            },
          },
        ],
      },
    ],
  },
  ukrainian: {
    id: 'ukrainian',
    titleKey: 'ukrainian',
    icon: '🌍',
    gradientClass: 'ukrainian-bg',
    sections: [
      {
        id: 'alphabet',
        title: 'Ukrainian Alphabet',
        description: 'Learn letters and sounds of the Ukrainian language.',
        icon: 'А',
        topics: [
          {
            id: 'letters',
            name: 'Ukrainian Letters',
            icon: 'А',
            description: 'Discover the Ukrainian alphabet from А to Я.',
            content: {
              assignmentId: 'ukrainian-letters-1',
              videoTitle: 'The Ukrainian Alphabet',
              videoDescription: 'Sing along and learn the first letters of the alphabet.',
              lectureTitle: 'Welcome to Ukrainian',
              lectureParagraphs: [
                'Українська мова має 33 літери.',
                'The letter А sounds like "a" in "father".',
                'Practice writing letters in a notebook every day!',
              ],
            },
          },
          {
            id: 'sounds',
            name: 'Letter Sounds',
            icon: '🔊',
            description: 'Hear and practice how each letter sounds.',
            content: {
              assignmentId: 'ukrainian-sounds-1',
              videoTitle: 'Sounds of Ukrainian',
              videoDescription: 'Listen and repeat the first letter sounds.',
              lectureTitle: 'Listening Practice',
              lectureParagraphs: ['Repeat after the video to train your ear.'],
            },
          },
        ],
      },
      {
        id: 'everyday-words',
        title: 'Everyday Words',
        description: 'Learn useful words for daily conversations.',
        icon: '💬',
        topics: [
          {
            id: 'greetings',
            name: 'Greetings',
            icon: '👋',
            description: 'Say hello and goodbye in Ukrainian.',
            content: {
              assignmentId: 'ukrainian-greetings-1',
              videoTitle: 'Привіт!',
              videoDescription: 'Learn Привіт, Доброго дня, and До побачення.',
              lectureTitle: 'Friendly Greetings',
              lectureParagraphs: ['Привіт! means Hi!'],
            },
          },
        ],
      },
    ],
  },
};

export function findTopic(subjectId: string, sectionId: string, topicId: string) {
  const subject = curriculum[subjectId];
  if (!subject) return null;
  const section = subject.sections.find((s) => s.id === sectionId);
  if (!section) return null;
  const topic = section.topics.find((t) => t.id === topicId);
  if (!topic) return null;
  return { subject, section, topic };
}
