import { BookMarked, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  onView?: (lessonId: string) => void;
}

export default function LessonCard({ lesson, onView }: LessonCardProps) {
  return (
    <Card className="h-full border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="space-y-2">
        <Badge variant="outline" className="w-fit">
          Lesson {lesson.order}
        </Badge>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-primary" />
          {lesson.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {lesson.content}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {lesson.duration}
        </div>
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(lesson.id)}>
            View Lesson
          </Button>
        )}
      </CardContent>
    </Card>
  );
}





