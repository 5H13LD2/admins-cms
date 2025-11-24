import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Timer, Award, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyModules, dummyQuizzes } from '@/data/dummyData';

const difficultyColors: Record<
  string,
  { badge: 'default' | 'secondary'; label: string; tone: string }
> = {
  EASY: { badge: 'secondary', label: 'Easy', tone: 'text-green-600' },
  NORMAL: { badge: 'default', label: 'Normal', tone: 'text-blue-600' },
  HARD: { badge: 'default', label: 'Hard', tone: 'text-red-600' },
};

export default function QuizDetailsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const quiz = dummyQuizzes.find((item) => item.id === quizId);
  const module = quiz ? dummyModules.find((m) => m.id === quiz.moduleId) : undefined;

  if (!quiz) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Quiz not found</CardTitle>
            <CardDescription>The requested quiz is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quizzes">
              <Button>Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const difficultyMeta = difficultyColors[quiz.difficulty];

  return (
    <div>


      <div className="flex items-center gap-4 mb-6">
        <Link to="/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-500 mt-1">Detailed view with question bank</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Module</CardTitle>
            <CardDescription>Where learners encounter this quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold text-gray-900">{module?.title ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Difficulty</CardTitle>
            <CardDescription>Relative challenge level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`font-semibold ${difficultyMeta?.tone ?? ''}`}>
              {difficultyMeta?.label ?? quiz.difficulty}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Passing Score</CardTitle>
            <CardDescription>Required to unlock completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold text-gray-900">
              {quiz.passingScore ?? '—'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Quiz Summary</CardTitle>
            <CardDescription>{quiz.description ?? 'No description provided'}</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            <span>{quiz.timeLimit ?? 0} mins</span>
          </div>
        </CardHeader>
        <CardContent className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <Badge variant={difficultyMeta?.badge ?? 'default'}>{difficultyMeta?.label}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>Each question with answer key and rationale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HelpCircle className="h-4 w-4" />
                <span>Question {index + 1}</span>
              </div>
              <p className="font-semibold text-gray-900">{question.question}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {question.options.map((option, idx) => (
                  <li
                    key={`${question.id}-option-${idx}`}
                    className={idx === question.correctOptionIndex ? 'font-semibold text-primary' : ''}
                  >
                    {option}
                  </li>
                ))}
              </ol>
              {question.explanation && (
                <p className="text-sm text-gray-500">
                  Explanation: {question.explanation}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

