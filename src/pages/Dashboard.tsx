import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, Code2Icon } from 'lucide-react';
import ProgressChart from '@/components/charts/ProgressChart';
import PerformanceChart from '@/components/charts/PerformanceChart';
import ActivityChart from '@/components/charts/ActivityChart';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import UsersTable from '@/components/tables/UsersTable';
import QuizzesTable from '@/components/tables/QuizzesTable';
import AssessmentsTable from '@/components/tables/AssessmentsTable';
import LeaderboardTable from '@/components/tables/LeaderboardTable';
import { useUsers } from '@/hooks/useUsers';
import { useCourses } from '@/hooks/useCourses';
import { useAssessments } from '@/hooks/useAssessments';
import { useFeedback } from '@/hooks/useFeedback';
import { formatDistanceToNow } from 'date-fns';
import Snowfall from '@/components/common/Snowfall';

export default function Dashboard() {
  const { users, fetchUsers } = useUsers();
  const { courses } = useCourses();
  const { assessments } = useAssessments();
  const { feedbackList, fetchFeedback } = useFeedback();

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchUsers();
    fetchFeedback();
  }, [fetchUsers, fetchFeedback]);

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: users.length > 0 ? '+12.5% from last month' : 'No data'
    },
    {
      title: 'Courses',
      value: courses.length.toString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: courses.length > 0 ? '+8.2% from last month' : 'No data'
    },
    {
      title: 'Assessments',
      value: assessments.length.toString(),
      icon: Code2Icon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: assessments.length > 0 ? '+15.3% from last month' : 'No data'
    },
    {
      title: 'Today',
      value: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: currentDate.toLocaleDateString('en-US', { weekday: 'long' })
    },
  ];

  // Generate recent activities from feedback and system data
  const recentActivities = (() => {
    const activities: Array<{ id: string; message: string; time: string }> = [];

    // Add feedback activities
    feedbackList
      .sort((a, b) => {
        const dateA = a.timestamp instanceof Date ? a.timestamp :
                      a.timestamp?.toDate ? a.timestamp.toDate() : new Date(0);
        const dateB = b.timestamp instanceof Date ? b.timestamp :
                      b.timestamp?.toDate ? b.timestamp.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3)
      .forEach((feedback) => {
        const timestamp = feedback.timestamp instanceof Date ? feedback.timestamp :
                         feedback.timestamp?.toDate ? feedback.timestamp.toDate() : new Date();

        activities.push({
          id: feedback.id || Math.random().toString(),
          message: `New feedback from ${feedback.username}: ${feedback.feedback.substring(0, 50)}${feedback.feedback.length > 50 ? '...' : ''}`,
          time: formatDistanceToNow(timestamp, { addSuffix: true })
        });
      });

    // Add user registration activities
    const recentUsers = users
      .filter(u => u.createdAt)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt :
                      a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt instanceof Date ? b.createdAt :
                      b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);

    recentUsers.forEach((user) => {
      const createdAt = user.createdAt instanceof Date ? user.createdAt :
                       user.createdAt?.toDate ? user.createdAt.toDate() : new Date();

      activities.push({
        id: `user-${user.id}`,
        message: `New user registered: ${user.username || user.email}`,
        time: formatDistanceToNow(createdAt, { addSuffix: true })
      });
    });

    // Return top 5 activities (already sorted by their respective queries)
    return activities.slice(0, 5);
  })();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to TechLaunch CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProgressChart />
        <PerformanceChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityChart />
        <AnalyticsChart />
      </div>

      {/* Recent Activities */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b border-border py-3 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Learners</h3>
            <span className="text-xs text-muted-foreground">users collection</span>
          </div>
          <UsersTable />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Quizzes</h3>
            <span className="text-xs text-muted-foreground">course_quiz collection</span>
          </div>
          <QuizzesTable />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Assessments</h3>
            <span className="text-xs text-muted-foreground">technical_assesment collection</span>
          </div>
          <AssessmentsTable />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
            <span className="text-xs text-muted-foreground">leaderboard collection</span>
          </div>
          <LeaderboardTable />
        </div>
      </div>
    </div>
  );
}
