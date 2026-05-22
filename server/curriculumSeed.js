export const seedCurriculum = {
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
              videoUrl: '',
              videoTitle: 'How to Add Numbers',
              videoDescription: 'Watch how we combine two groups of objects to find the total.',
              lectureTitle: 'Understanding Addition',
              lectureParagraphs: [
                'Addition means putting groups together to find how many in all.',
                'When you see 2 + 3, start with 2 objects and add 3 more. You get 5!',
                'Use your fingers, blocks, or drawings to practice every day.',
              ],
              examples: [
                { title: '2 + 3', body: 'Draw 2 circles, then 3 more. Count all circles: 5.' },
                { title: '4 + 1', body: 'Start at 4 on a number line and hop forward 1. You land on 5.' },
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
              videoUrl: '',
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
              videoUrl: '',
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
              videoUrl: '',
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
              videoUrl: '',
              videoTitle: 'Fun with Words',
              videoDescription: 'Connect pictures to the right English words.',
              lectureTitle: 'Building Your Vocabulary',
              lectureParagraphs: [
                'New words help you read more books and stories.',
                'Say each word out loud and use it in a sentence.',
                'Practice a little every day to remember words forever!',
              ],
              examples: [
                { title: 'Cat', body: 'A small pet that says meow. The cat sits on the mat.' },
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
              videoUrl: '',
              videoTitle: 'Quick Sight Words',
              videoDescription: 'Practice reading the, and, is, and go.',
              lectureTitle: 'Words You Know by Heart',
              lectureParagraphs: [
                'Sight words appear in almost every sentence.',
                'Read them fast without sounding out each letter.',
              ],
              examples: [
                { title: 'the', body: 'The dog runs. The sun is bright.' },
              ],
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
              videoUrl: '',
              videoTitle: 'Build a Sentence',
              videoDescription: 'Learn subject, verb, and how they fit together.',
              lectureTitle: 'What Is a Sentence?',
              lectureParagraphs: [
                'A sentence tells a complete idea.',
                'It starts with a capital letter and ends with a period.',
              ],
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
              videoUrl: '',
              videoTitle: 'The Ukrainian Alphabet',
              videoDescription: 'Sing along and learn the first letters of the alphabet.',
              lectureTitle: 'Welcome to Ukrainian',
              lectureParagraphs: [
                'Українська мова має 33 літери.',
                'The letter А sounds like "a" in "father".',
                'Practice writing letters in a notebook every day!',
              ],
              examples: [
                { title: 'А', body: 'А як в слові "мама" — відкритий звук.' },
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
              videoUrl: '',
              videoTitle: 'Sounds of Ukrainian',
              videoDescription: 'Listen and repeat the first letter sounds.',
              lectureTitle: 'Listening Practice',
              lectureParagraphs: [
                'Soft sounds are gentle. Hard sounds are stronger.',
                'Repeat after the video to train your ear.',
              ],
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
              videoUrl: '',
              videoTitle: 'Привіт!',
              videoDescription: 'Learn Привіт, Доброго дня, and До побачення.',
              lectureTitle: 'Friendly Greetings',
              lectureParagraphs: [
                'Привіт! means Hi!',
                'Дякую means Thank you.',
              ],
              examples: [
                { title: 'Привіт', body: 'Use with friends: Привіт, як справи?' },
              ],
            },
          },
        ],
      },
    ],
  },
};

export const seedExercisesFull = [
  {
    id: 'math-addition-1',
    subject: 'math',
    title: 'Addition Practice',
    points: 15,
    questions: [
      { q: '2 + 3 = ?', options: ['4', '5', '6'], answer: 1 },
      { q: '1 + 4 = ?', options: ['4', '5', '6'], answer: 1 },
      { q: '3 + 3 = ?', options: ['5', '6', '7'], answer: 1 },
    ],
  },
  {
    id: 'math-subtraction-1',
    subject: 'math',
    title: 'Subtraction Practice',
    points: 15,
    questions: [
      { q: '5 - 2 = ?', options: ['2', '3', '4'], answer: 1 },
      { q: '7 - 4 = ?', options: ['2', '3', '4'], answer: 1 },
    ],
  },
  {
    id: 'math-multiplication-1',
    subject: 'math',
    title: 'Multiplication Practice',
    points: 20,
    questions: [
      { q: '2 × 3 = ?', options: ['5', '6', '7'], answer: 1 },
      { q: '4 × 2 = ?', options: ['6', '8', '10'], answer: 1 },
    ],
  },
  {
    id: 'math-shapes-1',
    subject: 'math',
    title: 'Basic Shapes',
    points: 15,
    questions: [{ q: 'How many sides does a triangle have?', options: ['2', '3', '4'], answer: 1 }],
  },
  {
    id: 'english-reading-1',
    subject: 'english',
    title: 'Word Match',
    points: 15,
    questions: [{ q: 'Which word means a furry pet that says meow?', options: ['Dog', 'Cat', 'Bird'], answer: 1 }],
  },
  {
    id: 'english-sight-1',
    subject: 'english',
    title: 'Sight Words',
    points: 15,
    questions: [{ q: 'Which word is "the"?', options: ['the', 'cat', 'run'], answer: 0 }],
  },
  {
    id: 'english-sentences-1',
    subject: 'english',
    title: 'Making Sentences',
    points: 15,
    questions: [{ q: 'Which is a complete sentence?', options: ['Dog run.', 'The dog runs.', 'Running dog'], answer: 1 }],
  },
  {
    id: 'ukrainian-letters-1',
    subject: 'ukrainian',
    title: 'Ukrainian Letters',
    points: 15,
    questions: [{ q: 'What is the first letter of the Ukrainian alphabet?', options: ['А', 'Б', 'В'], answer: 0 }],
  },
  {
    id: 'ukrainian-sounds-1',
    subject: 'ukrainian',
    title: 'Letter Sounds',
    points: 15,
    questions: [{ q: 'How many letters are in the Ukrainian alphabet?', options: ['26', '33', '30'], answer: 1 }],
  },
  {
    id: 'ukrainian-greetings-1',
    subject: 'ukrainian',
    title: 'Greetings',
    points: 15,
    questions: [{ q: 'What does "Привіт" mean?', options: ['Hi', 'Bye', 'Thanks'], answer: 0 }],
  },
];
