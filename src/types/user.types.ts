export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date | any;
  lastLogin?: Date | any;
  status: 'online' | 'offline';
  coursesEnrolled: number;
  totalActivities: number;
  codingChallenges: ChallengeStats;
  quizzes: QuizStats;
  overallPassRate: number;
  role?: 'admin' | 'student' | 'instructor';
  bio?: string;
}

export interface ChallengeStats {
  attempted: number;
  passed: number;
  passRate: number;
}

export interface QuizStats {
  attempted: number;
  passed: number;
  passRate: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  assessmentScores: Record<string, number>;
  lastAccessedAt: Date | any;
  overallProgress: number;
}
