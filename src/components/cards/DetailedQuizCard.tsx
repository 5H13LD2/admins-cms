import { type Quiz } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DetailedQuizCardProps {
  quiz: Quiz;
}

export default function DetailedQuizCard({ quiz }: DetailedQuizCardProps) {
  return (
    <Card className="border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <Badge>{quiz.difficulty}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Time limit: {quiz.timeLimit ? `${quiz.timeLimit} mins` : 'None'}</span>
          <span>Passing score: {quiz.passingScore ?? 0}%</span>
          <span>{quiz.questions.length} questions</span>
        </div>
        <div className="my-4 h-px w-full bg-border dark:bg-gray-800" />
        <div className="max-h-64 space-y-4 overflow-y-auto pr-2 text-sm">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-lg bg-muted/30 p-4 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  Q{index + 1}: {question.question}
                </span>
                <Badge variant="outline">{question.points ?? 10} pts</Badge>
              </div>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {question.options.map((option, optionIndex) => (
                  <li
                    key={`${question.id}-${optionIndex}`}
                    className={
                      optionIndex === question.correctOptionIndex ? 'font-medium text-primary' : ''
                    }
                  >
                    {option}
                  </li>
                ))}
              </ul>
              {question.explanation && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Explanation: {question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

