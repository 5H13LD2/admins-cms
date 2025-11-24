import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dummyCourses, dummyModules, dummyUsers } from '@/data/dummyData';

export default function UserProgressPage() {
  const { userId } = useParams<{ userId: string }>();
  const user = dummyUsers.find((item) => item.id === userId);

  if (!user) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>The requested user is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/users">
              <Button>Back to Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const learningPath = [
    {
      id: 'lp-1',
      course: dummyCourses[0]?.title ?? 'Python Foundations',
      completion: 82,
      focus: 'Python fundamentals',
    },
    {
      id: 'lp-2',
      course: dummyCourses[1]?.title ?? 'Modern JavaScript',
      completion: 64,
      focus: 'React + async JS',
    },
  ];

  const recentModules = dummyModules.slice(0, 3).map((module) => ({
    id: module.id,
    title: module.title,
    completion: Math.min(100, module.lessons * 8),
    lessons: module.lessons,
  }));

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="flex items-center gap-4 mb-6">
        <Link to={`/users/${user.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.firstName}'s Progress</h1>
          <p className="text-muted-foreground mt-1">Learning trajectory and milestone tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Pass Rate</CardTitle>
            <CardDescription>Across quizzes and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{user.overallPassRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
            <CardDescription>Passed vs attempted</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {user.codingChallenges.passed}/{user.codingChallenges.attempted}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
            <CardDescription>Passed vs attempted</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {user.quizzes.passed}/{user.quizzes.attempted}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
            <CardDescription>Course-level completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningPath.map((path) => (
              <div key={path.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{path.course}</p>
                    <p className="text-xs text-muted-foreground">{path.focus}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{path.completion}%</span>
                </div>
                <Progress value={path.completion} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Modules</CardTitle>
            <CardDescription>Module completion snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentModules.map((module) => (
              <div key={module.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{module.title}</p>
                    <p className="text-xs text-muted-foreground">Lessons: {module.lessons}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{module.completion}%</span>
                </div>
                <Progress value={module.completion} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Growth Notes</CardTitle>
          <CardDescription>Coaching opportunities & wins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Momentum</p>
              <p className="text-sm text-muted-foreground">
                Consistently active with 4 lessons completed this week and multiple quiz retries logged.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Next Target</p>
              <p className="text-sm text-muted-foreground">
                Encourage completing the React Fundamentals module to unlock the capstone project.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

