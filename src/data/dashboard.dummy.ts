import { type Course, type User } from '@/types';

export interface DashboardUserRow extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  status: User['status'];
  lastLogin: string;
  streak: number;
}

export interface DashboardQuizRow extends Record<string, unknown> {
  id: string;
  title: string;
  module: string;
  attempts: number;
  avgScore: number;
  passRate: number;
}

export interface DashboardAssessmentRow extends Record<string, unknown> {
  id: string;
  title: string;
  type: 'code_fix' | 'sql_query';
  category: string;
  status: 'active' | 'inactive';
  submissions: number;
  passRate: number;
}

export interface DashboardLeaderboardRow extends Record<string, unknown> {
  rank: number;
  username: string;
  totalPoints: number;
  quizzesPassed: number;
  assessmentsCleared: number;
  streakDays: number;
}

export interface CourseProgressPoint {
  courseId: Course['id'];
  courseName: string;
  completionRate: number;
  activeLearners: number;
}

export interface AssessmentPerformancePoint {
  category: string;
  passed: number;
  failed: number;
}

export interface ActivityPoint {
  date: string;
  logins: number;
  dailyProblems: number;
}

export interface FeedbackAnalyticsPoint {
  label: string;
  value: number;
}

export const dashboardUsersTable: DashboardUserRow[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    status: 'online',
    lastLogin: '5 min ago',
    streak: 7,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'student',
    status: 'online',
    lastLogin: '18 min ago',
    streak: 12,
  },
  {
    id: 'user-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'student',
    status: 'offline',
    lastLogin: '2 hrs ago',
    streak: 4,
  },
  {
    id: 'user-4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'instructor',
    status: 'online',
    lastLogin: '10 min ago',
    streak: 21,
  },
];

export const dashboardQuizzesTable: DashboardQuizRow[] = [
  {
    id: 'quiz-1',
    title: 'Python Basics Quiz',
    module: 'Intro to Python',
    attempts: 340,
    avgScore: 82,
    passRate: 74,
  },
  {
    id: 'quiz-2',
    title: 'Control Flow Quiz',
    module: 'Python Control Flow',
    attempts: 295,
    avgScore: 76,
    passRate: 68,
  },
  {
    id: 'quiz-3',
    title: 'React Hooks Quiz',
    module: 'React Fundamentals',
    attempts: 189,
    avgScore: 88,
    passRate: 81,
  },
];

export const dashboardAssessmentsTable: DashboardAssessmentRow[] = [
  {
    id: 'assessment-1',
    title: 'Fix the Async Function',
    type: 'code_fix',
    category: 'JavaScript',
    status: 'active',
    submissions: 142,
    passRate: 61,
  },
  {
    id: 'assessment-2',
    title: 'SQL JOIN Challenge',
    type: 'sql_query',
    category: 'SQL',
    status: 'active',
    submissions: 118,
    passRate: 72,
  },
  {
    id: 'assessment-3',
    title: 'List Comprehension Debug',
    type: 'code_fix',
    category: 'Python',
    status: 'inactive',
    submissions: 64,
    passRate: 55,
  },
];

export const dashboardLeaderboardTable: DashboardLeaderboardRow[] = [
  {
    rank: 1,
    username: 'jane_smith',
    totalPoints: 1250,
    quizzesPassed: 36,
    assessmentsCleared: 18,
    streakDays: 15,
  },
  {
    rank: 2,
    username: 'alice_brown',
    totalPoints: 1180,
    quizzesPassed: 32,
    assessmentsCleared: 17,
    streakDays: 12,
  },
  {
    rank: 3,
    username: 'john_doe',
    totalPoints: 1050,
    quizzesPassed: 28,
    assessmentsCleared: 15,
    streakDays: 10,
  },
  {
    rank: 4,
    username: 'charlie_wilson',
    totalPoints: 890,
    quizzesPassed: 24,
    assessmentsCleared: 14,
    streakDays: 8,
  },
];

export const courseProgressChartData: CourseProgressPoint[] = [
  { courseId: 'course-1', courseName: 'Python Foundations', completionRate: 82, activeLearners: 320 },
  { courseId: 'course-2', courseName: 'Modern JavaScript', completionRate: 74, activeLearners: 280 },
  { courseId: 'course-3', courseName: 'SQL for Analysts', completionRate: 69, activeLearners: 190 },
  { courseId: 'course-4', courseName: 'React Mastery', completionRate: 61, activeLearners: 150 },
];

export const assessmentPerformanceChartData: AssessmentPerformancePoint[] = [
  { category: 'Python', passed: 96, failed: 38 },
  { category: 'JavaScript', passed: 88, failed: 42 },
  { category: 'SQL', passed: 112, failed: 31 },
];

export const activityChartData: ActivityPoint[] = [
  { date: 'Mon', logins: 210, dailyProblems: 68 },
  { date: 'Tue', logins: 238, dailyProblems: 74 },
  { date: 'Wed', logins: 198, dailyProblems: 62 },
  { date: 'Thu', logins: 254, dailyProblems: 81 },
  { date: 'Fri', logins: 276, dailyProblems: 88 },
  { date: 'Sat', logins: 182, dailyProblems: 56 },
  { date: 'Sun', logins: 165, dailyProblems: 49 },
];

export const feedbackAnalyticsData: FeedbackAnalyticsPoint[] = [
  { label: 'Pending', value: 12 },
  { label: 'In Review', value: 8 },
  { label: 'Resolved', value: 34 },
  { label: 'Archived', value: 4 },
];





