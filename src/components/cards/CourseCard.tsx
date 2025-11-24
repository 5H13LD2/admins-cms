import { Link } from 'react-router-dom';
import { CalendarDays, Layers, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {course.image && (
        <div className="h-40 overflow-hidden rounded-t-lg">
          <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardHeader>
        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
          {course.status ?? 'draft'}
        </Badge>
        <CardTitle className="mt-3">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          {course.moduleCount ?? 0} modules
        </div>
        {course.duration && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {course.duration}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Updated {new Date(course.updatedAt).toLocaleDateString()}
        </div>
        <Link to={`/courses/${course.id}`}>
          <Button variant="outline" className="w-full">
            View Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

