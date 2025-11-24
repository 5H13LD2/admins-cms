import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, HelpCircle, Award } from 'lucide-react';
import ProgressChart from '@/components/charts/ProgressChart';
import PerformanceChart from '@/components/charts/PerformanceChart';
import ActivityChart from '@/components/charts/ActivityChart';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import UsersTable from '@/components/tables/UsersTable';
import QuizzesTable from '@/components/tables/QuizzesTable';
import AssessmentsTable from '@/components/tables/AssessmentsTable';
import LeaderboardTable from '@/components/tables/LeaderboardTable';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Courses',
      value: '156',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Quizzes',
      value: '89',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Assessments',
      value: '45',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'User John Doe completed Module: Introduction to Python',
      time: '5 minutes ago',
    },
    {
      id: 2,
      message: 'New quiz "Advanced JavaScript Concepts" was created',
      time: '1 hour ago',
    },
    {
      id: 3,
      message: '5 new users registered today',
      time: '2 hours ago',
    },
    {
      id: 4,
      message: 'Assessment "SQL Database Design" was updated',
      time: '3 hours ago',
    },
    {
      id: 5,
      message: 'User Jane Smith achieved "Perfect Score" badge',
      time: '4 hours ago',
    },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
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
                  +20.1% from last month
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
