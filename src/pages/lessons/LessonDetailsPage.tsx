import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookMarked, Clock, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyCourses, dummyLessons, dummyModules } from '@/data/dummyData';

export default function LessonDetailsPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = dummyLessons.find((item) => item.id === lessonId);
  const module = lesson ? dummyModules.find((m) => m.id === lesson.moduleId) : undefined;
  const course = module ? dummyCourses.find((c) => c.id === module.courseId) : undefined;

  if (!lesson) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>The requested lesson is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/lessons">
              <Button>Back to Lessons</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>


      <div className="flex items-center gap-4 mb-6">
        <Link to="/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-gray-500 mt-1">Lesson overview and learning materials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Module</CardTitle>
            <CardDescription>Lesson grouping</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{module?.title ?? '—'}</p>
              <p className="text-sm text-gray-500">{course?.title ?? 'No course linked'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Duration</CardTitle>
            <CardDescription>Estimated study time</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-base font-semibold text-gray-900">{lesson.duration}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Sequence</CardTitle>
            <CardDescription>Order inside module</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              #{lesson.order}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <CardDescription>What learners will read or watch</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line leading-relaxed text-gray-700">{lesson.content}</p>
        </CardContent>
      </Card>

      {lesson.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Video Resource</CardTitle>
            <CardDescription>Supplementary explanation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Video className="h-4 w-4 text-gray-400" />
              <span>{lesson.videoUrl}</span>
            </div>
            <Button asChild variant="outline">
              <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                Open Video
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

