import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookMarked, Clock, Video, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { lessonsService } from '@/services/lessons.service';
import { modulesService } from '@/services/modules.service';
import { coursesService } from '@/services/courses.service';
import { Course, Lesson, Module } from '@/types';

export default function LessonDetailsPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get('courseId');
  const moduleIdParam = searchParams.get('moduleId');

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const loadLesson = async () => {
      setLoading(true);
      setError(null);

      try {
        let lessonData: Lesson | null = null;

        if (courseIdParam && moduleIdParam) {
          lessonData = await lessonsService.getById(courseIdParam, moduleIdParam, lessonId);
        }

        if (!lessonData) {
          const allLessons = await lessonsService.getAll();
          lessonData = allLessons.find((item) => item.id === lessonId) ?? null;
        }

        if (!lessonData) {
          setError('Lesson not found');
          return;
        }

        setLesson(lessonData);

        const resolvedCourseId = lessonData.courseId || courseIdParam;
        const resolvedModuleId = lessonData.moduleId || moduleIdParam;

        if (resolvedCourseId) {
          const courseData = await coursesService.getById(resolvedCourseId);
          setCourse(courseData);
        }

        if (resolvedCourseId && resolvedModuleId) {
          const moduleData = await modulesService.getById(resolvedCourseId, resolvedModuleId);
          if (moduleData) {
            setModule(moduleData);
          }
        }
      } catch (err) {
        console.error('Error loading lesson details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, courseIdParam, moduleIdParam]);

  const parentModuleLink = useMemo(() => {
    if (module?.id) {
      return `/modules/${module.id}`;
    }
    if (courseIdParam && moduleIdParam) {
      return `/courses/${courseIdParam}/modules/${moduleIdParam}`;
    }
    return '/lessons';
  }, [module?.id, courseIdParam, moduleIdParam]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>{error || 'The requested lesson is unavailable.'}</CardDescription>
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
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
          <p className="text-muted-foreground mt-1">
            Lesson overview and resources inside {module?.title ?? 'module'}
          </p>
        </div>
        <Link to={parentModuleLink}>
          <Button variant="outline">View Module</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Module</CardTitle>
            <CardDescription>Lesson grouping</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{module?.title ?? '—'}</p>
              <p className="text-sm text-muted-foreground">{course?.title ?? 'No course linked'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Parent Course</CardTitle>
            <CardDescription>Where this lesson lives</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-base font-semibold text-foreground">{course?.title ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Sequence</CardTitle>
            <CardDescription>Duration & order</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-base font-semibold text-foreground">{lesson.duration || '—'}</span>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              #{lesson.order}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
          <CardDescription>Concept overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{lesson.explanation}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <CardDescription>Extended reading material</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{lesson.content}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
          <CardDescription>Practical walkthrough</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-lg bg-muted p-4 text-sm overflow-auto">{lesson.codeExample}</pre>
        </CardContent>
      </Card>

      {lesson.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Video Resource</CardTitle>
            <CardDescription>Supplementary explanation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="break-all">{lesson.videoUrl}</span>
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

