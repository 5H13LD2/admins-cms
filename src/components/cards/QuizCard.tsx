import { Link } from 'react-router-dom';
import { HelpCircle, Timer, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Quiz } from '@/types';

interface QuizCardProps {
  quiz: Quiz;
}

const difficultyMap: Record<Quiz['difficulty'], { label: string; color: string }> = {
  EASY: { label: 'Easy', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  NORMAL: { label: 'Normal', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300' },
  HARD: { label: 'Hard', color: 'bg-red-500/10 text-red-600 dark:text-red-300' },
};

export default function QuizCard({ quiz }: QuizCardProps) {
  const difficulty = difficultyMap[quiz.difficulty];

  return (
    <Card className="flex h-full flex-col border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader>
        <Badge className={difficulty.color}>{difficulty.label}</Badge>
        <CardTitle className="mt-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          {quiz.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {quiz.description ?? 'Quiz description not provided.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          {quiz.timeLimit ? `${quiz.timeLimit} min limit` : 'No time limit'}
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Passing score: {quiz.passingScore ?? 0}%
        </div>
        <Link to={`/quizzes/${quiz.id}`}>
          <Button variant="outline" className="w-full">
            View Quiz
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

