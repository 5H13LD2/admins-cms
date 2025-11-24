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

export const analyticsStats: AnalyticsStat[] = [
  {
    id: 'stat-1',
    label: 'Active Learners',
    value: '1,234',
    change: 12,
    trend: 'up',
  },
  {
    id: 'stat-2',
    label: 'Course Completions',
    value: '312',
    change: 8,
    trend: 'up',
  },
  {
    id: 'stat-3',
    label: 'Avg. Quiz Score',
    value: '86%',
    change: -2,
    trend: 'down',
  },
  {
    id: 'stat-4',
    label: 'Daily Challenges',
    value: '78',
    change: 5,
    trend: 'up',
  },
];

export const engagementMetrics: EngagementMetric[] = [
  {
    id: 'eng-1',
    label: 'Weekly Active Users',
    description: 'Learners who engaged with any learning asset this week',
    current: 842,
    target: 900,
    change: 6,
  },
  {
    id: 'eng-2',
    label: 'Lesson Completion Rate',
    description: 'Percent of lessons that learners finish after starting',
    current: 78,
    target: 85,
    change: 3,
  },
  {
    id: 'eng-3',
    label: 'Assessment Pass Rate',
    description: 'Learners passing technical assessments on first try',
    current: 64,
    target: 70,
    change: -1,
  },
];

export const trafficSources: TrafficSource[] = [
  { id: 'src-1', channel: 'Direct', percentage: 42, change: 4 },
  { id: 'src-2', channel: 'Email Campaigns', percentage: 28, change: 2 },
  { id: 'src-3', channel: 'Partner Schools', percentage: 18, change: -3 },
  { id: 'src-4', channel: 'Community Events', percentage: 12, change: 1 },
];

export const courseCompletionMetrics: CourseCompletionMetric[] = [
  {
    id: 'cc-1',
    course: 'Python Foundations',
    completionRate: 82,
    activeLearners: 320,
  },
  {
    id: 'cc-2',
    course: 'Modern JavaScript',
    completionRate: 74,
    activeLearners: 280,
  },
  {
    id: 'cc-3',
    course: 'SQL for Analysts',
    completionRate: 69,
    activeLearners: 190,
  },
  {
    id: 'cc-4',
    course: 'React Mastery',
    completionRate: 61,
    activeLearners: 150,
  },
];

export const reportSummaries: ReportSummary[] = [
  {
    id: 'report-1',
    title: 'Weekly Learning Health',
    description: 'Engagement, retention, and completion snapshots for leadership.',
    lastGenerated: 'Mar 14, 2024',
    frequency: 'Weekly',
    owner: 'Growth Team',
    status: 'ready',
  },
  {
    id: 'report-2',
    title: 'Assessment Outcomes',
    description: 'Breakdown of technical assessment performance by cohort.',
    lastGenerated: 'Mar 12, 2024',
    frequency: 'Weekly',
    owner: 'Instruction',
    status: 'scheduled',
  },
  {
    id: 'report-3',
    title: 'Monthly Course Insights',
    description: 'Course-by-course deep dive with NPS, completions, and feedback.',
    lastGenerated: 'Mar 01, 2024',
    frequency: 'Monthly',
    owner: 'Program Ops',
    status: 'ready',
  },
  {
    id: 'report-4',
    title: 'Quarterly Accreditation Summary',
    description: 'Outcomes required for partner accreditation renewals.',
    lastGenerated: 'Feb 28, 2024',
    frequency: 'Quarterly',
    owner: 'Compliance',
    status: 'in-progress',
  },
];

