import { Link } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyDailyProblems } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';

export default function DailyProblemsPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Coding Problems</h1>
          <p className="text-muted-foreground mt-1">Keep streaks alive with fresh prompts</p>
        </div>
        <Link to="/daily-problems/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Problem
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyDailyProblems.map((problem) => (
          <Card key={problem.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription>{problem.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {problem.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{problem.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(problem.date)}
                </span>
                <span>{problem.points} pts</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Hints: {problem.hints?.join(' • ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

