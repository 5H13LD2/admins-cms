import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyUsers } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';

export default function UserDetailsPage() {
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

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="flex items-center gap-4 mb-6">
        <Link to="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h1>
          <p className="text-muted-foreground mt-1">@{user.username}</p>
        </div>
        <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>{user.status}</Badge>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={user.avatar}
            alt={user.username}
            className="h-28 w-28 rounded-2xl object-cover border border-border"
          />
          <div className="flex-1 space-y-4">
            <p className="text-muted-foreground">{user.bio}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {user.email}
              </div>
              <div className="text-muted-foreground">
                Joined {formatDate(user.createdAt)} • Last login {formatDate(user.lastLogin)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Courses enrolled</p>
            <p className="text-2xl font-bold text-foreground">{user.coursesEnrolled}</p>
            <p className="text-sm text-muted-foreground">Total activities</p>
            <p className="text-2xl font-bold text-foreground">{user.totalActivities}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coding Challenges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Attempted</p>
            <p className="text-2xl font-bold text-foreground">{user.codingChallenges.attempted}</p>
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="text-2xl font-bold text-foreground">{user.codingChallenges.passRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Attempted</p>
            <p className="text-2xl font-bold text-foreground">{user.quizzes.attempted}</p>
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="text-2xl font-bold text-foreground">{user.quizzes.passRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>High-level look at their journey</CardDescription>
          </div>
          <Link to={`/users/${user.id}/progress`}>
            <Button size="sm" variant="outline">
              Open Progress View
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Overall pass rate</p>
            <p className="text-2xl font-bold text-foreground">{user.overallPassRate}%</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Coding challenges</p>
            <p className="text-lg font-semibold text-foreground">
              {user.codingChallenges.passed}/{user.codingChallenges.attempted} passed
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Quiz streak</p>
            <p className="text-lg font-semibold text-foreground">
              {user.quizzes.passed}/{user.quizzes.attempted} passed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

