import { Link } from 'react-router-dom';
import { ClipboardCheck, Shield, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyModules, dummyQuizzes } from '@/data/dummyData';

const moduleMap = dummyModules.reduce<Record<string, string>>((acc, module) => {
  acc[module.id] = module.title;
  return acc;
}, {});

const reviewQueue = dummyQuizzes.slice(0, 3).map((quiz, index) => ({
  id: quiz.id,
  title: quiz.title,
  module: moduleMap[quiz.moduleId],
  due: ['Today', 'Tomorrow', 'In 3 days'][index] ?? 'Next week',
  status: index === 0 ? 'awaiting review' : 'scheduled',
}));

const qualitySignals = [
  {
    id: 'signal-1',
    title: 'Difficulty Calibration',
    description: 'Ensure question mix spans Bloom levels and difficulty tags.',
    icon: Shield,
    status: 'Stable',
  },
  {
    id: 'signal-2',
    title: 'Accessibility Checklist',
    description: 'Confirm alt text and keyboard navigation for quiz widgets.',
    icon: ClipboardCheck,
    status: 'Needs attention',
  },
  {
    id: 'signal-3',
    title: 'Version Control',
    description: 'Consolidate edits from instructors before publishing.',
    icon: RefreshCw,
    status: 'On track',
  },
];

export default function QuizManagementPage() {
  const stats = [
    { label: 'Active Quizzes', value: dummyQuizzes.length },
    { label: 'Avg. Pass Rate', value: '84%' },
    { label: 'Attempts Today', value: '192' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Management</h1>
          <p className="text-muted-foreground mt-1">Track quiz quality, reviews, and publishing cadence</p>
        </div>
        <Link to="/quizzes/create">
          <Button>New Quiz</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Review Queue</CardTitle>
              <CardDescription>Quizzes awaiting instructional QA</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/quizzes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewQueue.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-start justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{quiz.title}</p>
                  <p className="text-sm text-muted-foreground">{quiz.module}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1 capitalize">
                    {quiz.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Due {quiz.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Signals</CardTitle>
            <CardDescription>Operational checklist for quiz excellence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualitySignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-4"
                >
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{signal.title}</p>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                  <Badge variant="outline">{signal.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

