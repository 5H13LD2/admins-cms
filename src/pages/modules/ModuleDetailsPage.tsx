import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, BookOpen, ListChecks, Loader2, AlertCircle, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { modulesService } from '@/services/modules.service';
import { coursesService } from '@/services/courses.service';
import { lessonsService } from '@/services/lessons.service';
import { Module, Course, Lesson } from '@/types';

export default function ModuleDetailsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (!moduleId) return;

      try {
        setLoading(true);
        // We need courseId to fetch the module, but we don't have it from the URL
        // We'll need to get all modules and find the one with matching id
        const allModules = await modulesService.getAll();
        const foundModule = allModules.find((m) => m.id === moduleId);

        if (foundModule) {
          setModule(foundModule);

          // Fetch course details
          const courseData = await coursesService.getById(foundModule.courseId);
          setCourse(courseData);

          // Fetch lessons for this module
          const lessonsData = await lessonsService.getByModuleId(foundModule.courseId, moduleId);
          setLessons(lessonsData.sort((a, b) => a.order - b.order));
        } else {
          setError('Module not found');
        }
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load module');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Module not found</CardTitle>
            <CardDescription>{error || 'The module you are looking for does not exist.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/modules">
              <Button>Back to Modules</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex items-center gap-4 mb-6">
        <Link to="/modules">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{module.title}</h1>
          <p className="text-muted-foreground mt-1">Module overview and lessons</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/modules/${moduleId}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link to={`/courses/${module.courseId}`}>
            <Button variant="outline">View Course</Button>
          </Link>
        </div>
      </div>

      {module.image && (
        <div className="h-64 overflow-hidden rounded-xl mb-6">
          <img src={module.image} alt={module.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Parent Course</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{course?.title ?? '—'}</p>
              <p className="text-sm text-muted-foreground">Course linkage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{module.duration}</p>
              <p className="text-sm text-muted-foreground">Estimated time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Lesson count</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{module.lessons}</p>
              <p className="text-sm text-muted-foreground">Published lessons</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Module Description</CardTitle>
          <CardDescription>What learners can expect to cover</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{module.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>Ordered learning content within this module</CardDescription>
          </div>
          <Link to="/lessons/create">
            <Button size="sm">Add Lesson</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lessons linked to this module yet.</p>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Lesson {lesson.order}: {lesson.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{lesson.duration}</Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

