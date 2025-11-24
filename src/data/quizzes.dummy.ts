import { Quiz } from '@/types';

export const dummyQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    moduleId: 'module-1',
    title: 'Python Basics Quiz',
    description: 'Test your knowledge of Python fundamentals',
    difficulty: 'EASY',
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is the correct way to declare a variable in Python?',
        options: [
          'var x = 5',
          'x = 5',
          'int x = 5',
          'let x = 5'
        ],
        correctOptionIndex: 1,
        explanation: 'In Python, you simply use the variable name followed by = and the value.',
        points: 10,
      },
      {
        id: 'q2',
        question: 'Which data type is used to store text in Python?',
        options: [
          'text',
          'varchar',
          'string',
          'str'
        ],
        correctOptionIndex: 3,
        explanation: 'Python uses "str" as the data type for strings.',
        points: 10,
      },
      {
        id: 'q3',
        question: 'What does the print() function do?',
        options: [
          'Calculates a value',
          'Displays output to the console',
          'Stores data in a variable',
          'Deletes a variable'
        ],
        correctOptionIndex: 1,
        explanation: 'The print() function outputs information to the console.',
        points: 10,
      },
    ],
  },
  {
    id: 'quiz-2',
    moduleId: 'module-2',
    title: 'Control Flow & Functions Quiz',
    description: 'Test your understanding of Python control structures',
    difficulty: 'NORMAL',
    timeLimit: 20,
    passingScore: 75,
    questions: [
      {
        id: 'q4',
        question: 'Which keyword is used to define a function in Python?',
        options: [
          'function',
          'def',
          'func',
          'define'
        ],
        correctOptionIndex: 1,
        explanation: 'Python uses the "def" keyword to define functions.',
        points: 10,
      },
      {
        id: 'q5',
        question: 'What is the output of: for i in range(3): print(i)',
        options: [
          '1 2 3',
          '0 1 2',
          '1 2',
          '0 1 2 3'
        ],
        correctOptionIndex: 1,
        explanation: 'range(3) generates numbers from 0 to 2 (not including 3).',
        points: 10,
      },
    ],
  },
  {
    id: 'quiz-3',
    moduleId: 'module-4',
    title: 'JavaScript ES6+ Quiz',
    description: 'Test your knowledge of modern JavaScript features',
    difficulty: 'NORMAL',
    timeLimit: 25,
    passingScore: 75,
    questions: [
      {
        id: 'q6',
        question: 'What is the correct syntax for an arrow function?',
        options: [
          'function() => {}',
          '() => {}',
          '=> function() {}',
          'arrow() => {}'
        ],
        correctOptionIndex: 1,
        explanation: 'Arrow functions use the syntax: () => {}',
        points: 10,
      },
      {
        id: 'q7',
        question: 'Which keyword is used to declare a constant in JavaScript?',
        options: [
          'var',
          'let',
          'const',
          'constant'
        ],
        correctOptionIndex: 2,
        explanation: 'The "const" keyword is used for constants that cannot be reassigned.',
        points: 10,
      },
    ],
  },
  {
    id: 'quiz-4',
    moduleId: 'module-5',
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React basics',
    difficulty: 'HARD',
    timeLimit: 30,
    passingScore: 80,
    questions: [
      {
        id: 'q8',
        question: 'What is JSX?',
        options: [
          'A JavaScript framework',
          'A syntax extension for JavaScript',
          'A CSS preprocessor',
          'A database language'
        ],
        correctOptionIndex: 1,
        explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
        points: 15,
      },
      {
        id: 'q9',
        question: 'Which hook is used to manage state in functional components?',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctOptionIndex: 1,
        explanation: 'useState is the primary hook for managing component state.',
        points: 15,
      },
    ],
  },
];
