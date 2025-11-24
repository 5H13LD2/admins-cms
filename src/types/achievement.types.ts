export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  category: 'course' | 'quiz' | 'challenge' | 'streak' | 'special';
  criteria: AchievementCriteria;
  points: number;
  createdAt?: Date | any;
}

export interface AchievementCriteria {
  type: 'complete_course' | 'complete_quiz' | 'pass_assessment' | 'login_streak' | 'custom';
  target?: number;
  courseId?: string;
  quizId?: string;
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date | any;
  progress?: number;
}

export interface DailyProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'code' | 'quiz' | 'algorithm';
  content: string;
  solution?: string;
  hints?: string[];
  date: Date | any;
  points: number;
}
