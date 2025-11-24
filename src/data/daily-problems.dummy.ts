import { DailyProblem } from '@/types';

export const dummyDailyProblems: DailyProblem[] = [
  {
    id: 'dp-1',
    title: 'Reverse a String',
    description: 'Write a function that reverses a string without using built-in reverse methods.',
    difficulty: 'Easy',
    type: 'code',
    content: 'Given a string, return the reversed version. Example: "hello" -> "olleh"',
    solution: 'function reverseString(str) { return str.split("").reverse().join(""); }',
    hints: ['Think about converting to array', 'Use array methods', 'Join back to string'],
    date: new Date('2024-03-15'),
    points: 10,
  },
  {
    id: 'dp-2',
    title: 'Find Maximum Number',
    description: 'Write a function to find the maximum number in an array.',
    difficulty: 'Easy',
    type: 'algorithm',
    content: 'Given an array of numbers, return the largest one.',
    solution: 'function findMax(arr) { return Math.max(...arr); }',
    hints: ['Iterate through array', 'Keep track of largest so far', 'Or use built-in Math.max'],
    date: new Date('2024-03-14'),
    points: 10,
  },
  {
    id: 'dp-3',
    title: 'Palindrome Checker',
    description: 'Determine if a given string is a palindrome.',
    difficulty: 'Medium',
    type: 'algorithm',
    content: 'Return true if the string reads the same forwards and backwards.',
    solution: 'function isPalindrome(str) { return str === str.split("").reverse().join(""); }',
    hints: ['Compare string with its reverse', 'Handle case sensitivity', 'Ignore spaces and punctuation'],
    date: new Date('2024-03-13'),
    points: 15,
  },
];

