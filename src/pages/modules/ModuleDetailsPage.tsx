import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, ListChecks } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyCourses, dummyLessons, dummyModules } from '@/data/dummyData';

export default function ModuleDetailsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = dummyModules.find((item) => item.id === moduleId);
  const course = module ? dummyCourses.find((c) => c.id === module.courseId) : undefined;
  const relatedLessons = module
    ? dummyLessons.filter((lesson) => lesson.moduleId === module.id).sort((a, b) => a.order - b.order)
    : [];

  if (!module) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Module not found</CardTitle>
            <CardDescription>The module you are looking for does not exist.</CardDescription>
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
        <Link to={`/courses/${module.courseId}`}>
          <Button variant="outline">View Course</Button>
        </Link>
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
          {relatedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lessons linked to this module yet.</p>
          ) : (
            relatedLessons.map((lesson) => (
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

