import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Snowfall from '@/components/common/Snowfall';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Loader2, MousePointerClick, ChevronRight } from 'lucide-react';
import AnalyticsDetailModal from '@/components/analytics/AnalyticsDetailModal';
import { StatTooltip, CourseTooltip } from '@/components/analytics/AnalyticsTooltip';
import { usersService } from '@/services/users.service';

type ModalType = 'active-learners' | 'course-completions' | 'quiz-scores' | 'assessments' | 'course-detail' | null;

export default function AnalyticsPage() {
  const { analyticsData, userActivityData, courseEnrollmentData, isLoading, error } = useAnalytics();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const handleStatClick = async (statId: string, label: string) => {
    setModalTitle(label);

    switch (statId) {
      case 'stat-1': // Active Learners
        setModalType('active-learners');
        // Fetch active users
        const users = await usersService.getAll();
        const now = Date.now();
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
        const recentUsers = users.filter(user => {
          const lastLogin = user.lastLogin;
          if (!lastLogin) return false;
          const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                           typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                           typeof lastLogin === 'number' ? lastLogin : 0;
          return loginTime >= sevenDaysAgo;
        }).sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
        setActiveUsers(recentUsers);
        break;
      case 'stat-2': // Course Completions
        setModalType('course-completions');
        break;
      case 'stat-3': // Quiz Scores
        setModalType('quiz-scores');
        break;
      case 'stat-4': // Assessments
        setModalType('assessments');
        break;
    }
    setModalOpen(true);
  };

  const handleCourseClick = (courseName: string) => {
    setSelectedCourse(courseName);
    setModalType('course-detail');
    setModalTitle(courseName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedCourse(null);
    setActiveUsers([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading analytics</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const { stats, engagementMetrics, trafficSources, courseCompletionMetrics } = analyticsData;

  const selectedCourseData = courseEnrollmentData.find(c => c.courseName === selectedCourse);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Pulse across learners, content, and growth
          <span className="inline-flex items-center gap-1 ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
            <MousePointerClick className="h-3 w-3" />
            Click cards for details
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          // Determine tooltip type based on stat ID
          const getTooltipType = (id: string) => {
            switch (id) {
              case 'stat-1': return 'active-learners' as const;
              case 'stat-2': return 'course-completions' as const;
              case 'stat-3': return 'quiz-scores' as const;
              case 'stat-4': return 'assessments' as const;
              default: return 'active-learners' as const;
            }
          };

          // Get appropriate data for tooltip
          const getTooltipData = (id: string) => {
            switch (id) {
              case 'stat-1':
              case 'stat-3':
              case 'stat-4':
                return userActivityData;
              case 'stat-2':
                return courseEnrollmentData;
              default:
                return null;
            }
          };

          return (
            <StatTooltip
              key={stat.id}
              type={getTooltipType(stat.id)}
              data={getTooltipData(stat.id)}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 relative group"
                onClick={() => handleStatClick(stat.id, stat.label)}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div
                    className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {stat.trend === 'up' ? '▲' : '▼'} {stat.change}% vs last week
                  </div>
                </CardContent>
              </Card>
            </StatTooltip>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Key health metrics for learner activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {engagementMetrics.map((metric) => (
              <div key={metric.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {metric.current}/{metric.target}
                  </div>
                </div>
                <Progress value={(metric.current / metric.target) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where new signups originate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{source.channel}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.change >= 0 ? '▲' : '▼'} {Math.abs(source.change)} pts vs week prior
                  </p>
                </div>
                <span className="text-lg font-semibold text-foreground">{source.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Completion</CardTitle>
          <CardDescription>Percent of learners completing each course (click for details)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseCompletionMetrics.length > 0 ? (
            courseCompletionMetrics.map((metric) => {
              // Find detailed course data
              const detailedCourseData = courseEnrollmentData.find(c => c.courseName === metric.course);

              return (
                <CourseTooltip
                  key={metric.id}
                  courseName={metric.course}
                  enrolledCount={detailedCourseData?.totalEnrolled || metric.activeLearners}
                  completedCount={detailedCourseData?.completedCount || 0}
                  completionRate={metric.completionRate}
                >
                  <div
                    className="rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 group"
                    onClick={() => handleCourseClick(metric.course)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          {metric.course}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </p>
                        <p className="text-xs text-muted-foreground">{metric.activeLearners} active learners</p>
                      </div>
                      <span className="text-lg font-semibold text-foreground">{metric.completionRate}%</span>
                    </div>
                    <Progress value={metric.completionRate} />
                  </div>
                </CourseTooltip>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No course completion data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {modalType && (
        <AnalyticsDetailModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={modalTitle}
          type={modalType}
          data={{
            userActivity: userActivityData || undefined,
            courseEnrollment: courseEnrollmentData,
            activeUsers: activeUsers,
            courseName: selectedCourse || undefined,
            courseData: selectedCourseData
          }}
        />
      )}
    </div>
  );
}
