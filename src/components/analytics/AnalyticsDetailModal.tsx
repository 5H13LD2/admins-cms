import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserActivityData, CourseEnrollmentData } from '@/types/analytics.types';
import { User } from '@/types';

interface AnalyticsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'active-learners' | 'course-completions' | 'quiz-scores' | 'assessments' | 'course-detail';
  data?: {
    userActivity?: UserActivityData;
    courseEnrollment?: CourseEnrollmentData[];
    activeUsers?: User[];
    courseName?: string;
    courseData?: CourseEnrollmentData;
  };
}

export default function AnalyticsDetailModal({
  isOpen,
  onClose,
  title,
  type,
  data
}: AnalyticsDetailModalProps) {
  const renderContent = () => {
    switch (type) {
      case 'active-learners':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.userActivity?.activeUsersThisWeek || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.userActivity?.activeUsersLastWeek || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active users</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Users</span>
                  <span className="font-semibold">{data?.userActivity?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Users with Courses</span>
                  <span className="font-semibold">{data?.userActivity?.usersWithCourses || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Quizzes Taken</span>
                  <span className="font-semibold">{data?.userActivity?.totalQuizzesTaken || 0}</span>
                </div>
              </CardContent>
            </Card>

            {data?.activeUsers && data.activeUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Active Users</CardTitle>
                  <CardDescription>Top active learners this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.activeUsers.slice(0, 10).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.username || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{user.totalXP || 0} XP</p>
                          <p className="text-xs text-muted-foreground">Level {user.level || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'course-completions':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.courseEnrollment?.reduce((sum, c) => sum + c.totalEnrolled, 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.courseEnrollment?.reduce((sum, c) => sum + c.completedCount, 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total completions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Breakdown</CardTitle>
                <CardDescription>Completion status by course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.courseEnrollment?.map((course) => (
                  <div key={course.courseName} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{course.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.completedCount} completed / {course.totalEnrolled} enrolled
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'quiz-scores':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Average quiz scores across all learners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Quizzes Taken</span>
                  <span className="font-semibold">{data?.userActivity?.totalQuizzesTaken || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average XP</span>
                  <span className="font-semibold">{Math.round(data?.userActivity?.averageXP || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total XP Earned</span>
                  <span className="font-semibold">{data?.userActivity?.totalXP || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Statistics</CardTitle>
                <CardDescription>Technical assessment completion data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Assessments Completed</span>
                  <span className="font-semibold">{data?.userActivity?.totalAssessmentsCompleted || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average per User</span>
                  <span className="font-semibold">
                    {data?.userActivity?.totalUsers && data?.userActivity?.totalAssessmentsCompleted
                      ? (data.userActivity.totalAssessmentsCompleted / data.userActivity.totalUsers).toFixed(1)
                      : '0'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'course-detail':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.courseData?.totalEnrolled || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">learners</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.courseData?.completedCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">learners</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.courseData?.inProgressCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">learners</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="font-semibold">{data?.courseData?.completionRate || 0}%</span>
                  </div>
                  <Progress value={data?.courseData?.completionRate || 0} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <p>No data available</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Detailed breakdown and insights
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
