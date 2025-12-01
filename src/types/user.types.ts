export interface CourseEnrollment {
  category: string;
  courseId: string;
  courseName: string;
  difficulty: string;
  enrolledAt: number;
}

export interface User {
  id: string;
  userId?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  profilePhotoBase64?: string;
  createdAt: Date | any;
  lastLogin?: Date | any;
  status?: 'online' | 'offline';
  coursesEnrolled?: number;
  totalActivities?: number;
  codingChallenges?: ChallengeStats;
  quizzes?: QuizStats;
  overallPassRate?: number;
  role?: 'admin' | 'student' | 'instructor';
  bio?: string;

  // Fields from old logic
  courseTaken?: CourseEnrollment[];
  achievementsUnlocked?: string[];
  currentBadge?: string;
  isEnrolled?: boolean;
  level?: number;
  quizzesTaken?: number;
  technicalAssessmentsCompleted?: number;
  totalXP?: number;
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
