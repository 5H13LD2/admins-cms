import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

interface StatTooltipProps {
  type: 'active-learners' | 'course-completions' | 'quiz-scores' | 'assessments';
  data?: any;
  children: React.ReactNode;
}

export function StatTooltip({ type, data, children }: StatTooltipProps) {
  const renderTooltipContent = () => {
    switch (type) {
      case 'active-learners':
        return (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Active Users Breakdown</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Week:</span>
                <span className="font-medium">{data?.activeUsersThisWeek || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Week:</span>
                <span className="font-medium">{data?.activeUsersLastWeek || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users:</span>
                <span className="font-medium">{data?.totalUsers || 0}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Click for detailed user list
            </p>
          </div>
        );

      case 'course-completions':
        return (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Course Enrollments</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Enrolled:</span>
                <span className="font-medium">
                  {data?.reduce((sum: number, c: any) => sum + c.totalEnrolled, 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium">
                  {data?.reduce((sum: number, c: any) => sum + c.completedCount, 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Progress:</span>
                <span className="font-medium">
                  {data?.reduce((sum: number, c: any) => sum + c.inProgressCount, 0) || 0}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Click for course breakdown
            </p>
          </div>
        );

      case 'quiz-scores':
        return (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Quiz Performance</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quizzes:</span>
                <span className="font-medium">{data?.totalQuizzesTaken || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg XP:</span>
                <span className="font-medium">{Math.round(data?.averageXP || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total XP:</span>
                <span className="font-medium">{data?.totalXP || 0}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Click for more details
            </p>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Assessment Stats</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Completed:</span>
                <span className="font-medium">{data?.totalAssessmentsCompleted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg per User:</span>
                <span className="font-medium">
                  {data?.totalUsers && data?.totalAssessmentsCompleted
                    ? (data.totalAssessmentsCompleted / data.totalUsers).toFixed(1)
                    : '0'}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Click for detailed stats
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-64">
        {renderTooltipContent()}
      </HoverCardContent>
    </HoverCard>
  );
}

interface CourseTooltipProps {
  courseName: string;
  enrolledCount: number;
  completedCount: number;
  completionRate: number;
  children: React.ReactNode;
}

export function CourseTooltip({
  courseName,
  enrolledCount,
  completedCount,
  completionRate,
  children
}: CourseTooltipProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-72">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">{courseName}</p>
            <p className="text-xs text-muted-foreground">Course Performance</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Enrolled</span>
              <span className="font-medium">{enrolledCount} learners</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">{completedCount} learners</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-medium">{enrolledCount - completedCount} learners</span>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <p className="text-xs text-muted-foreground pt-1 border-t">
            Click for full breakdown
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
