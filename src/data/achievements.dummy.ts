import { Achievement } from '@/types';

export const dummyAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    badge: '/badges/first-steps.png',
    category: 'course',
    criteria: {
      type: 'complete_course',
      target: 1,
    },
    points: 10,
  },
  {
    id: 'ach-2',
    title: 'Quiz Master',
    description: 'Pass 10 quizzes with 100% score',
    icon: '🏆',
    badge: '/badges/quiz-master.png',
    category: 'quiz',
    criteria: {
      type: 'complete_quiz',
      target: 10,
    },
    points: 50,
  },
  {
    id: 'ach-3',
    title: 'Code Warrior',
    description: 'Complete 25 coding challenges',
    icon: '⚔️',
    badge: '/badges/code-warrior.png',
    category: 'challenge',
    criteria: {
      type: 'pass_assessment',
      target: 25,
    },
    points: 100,
  },
  {
    id: 'ach-4',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    badge: '/badges/streak-7.png',
    category: 'streak',
    criteria: {
      type: 'login_streak',
      target: 7,
    },
    points: 30,
  },
  {
    id: 'ach-5',
    title: 'Perfect Score',
    description: 'Get 100% on a hard difficulty quiz',
    icon: '💯',
    badge: '/badges/perfect-score.png',
    category: 'quiz',
    criteria: {
      type: 'complete_quiz',
      target: 1,
    },
    points: 75,
  },
];

