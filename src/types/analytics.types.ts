export type TrendDirection = 'up' | 'down';

export interface AnalyticsStat {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: TrendDirection;
}

export interface EngagementMetric {
  id: string;
  label: string;
  description: string;
  current: number;
  target: number;
  change: number;
}

export interface TrafficSource {
  id: string;
  channel: string;
  percentage: number;
  change: number;
}

export interface CourseCompletionMetric {
  id: string;
  course: string;
  completionRate: number;
  activeLearners: number;
}

export interface ReportSummary {
  id: string;
  title: string;
  description: string;
  lastGenerated: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  owner: string;
  status: 'ready' | 'scheduled' | 'in-progress';
}

export interface AnalyticsData {
  stats: AnalyticsStat[];
  engagementMetrics: EngagementMetric[];
  trafficSources: TrafficSource[];
  courseCompletionMetrics: CourseCompletionMetric[];
  reportSummaries: ReportSummary[];
}

export interface UserActivityData {
  totalUsers: number;
  activeUsersThisWeek: number;
  activeUsersLastWeek: number;
  usersWithCourses: number;
  totalQuizzesTaken: number;
  totalAssessmentsCompleted: number;
  totalXP: number;
  averageXP: number;
}

export interface CourseEnrollmentData {
  courseName: string;
  totalEnrolled: number;
  completedCount: number;
  inProgressCount: number;
  completionRate: number;
}
