import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Clock, Plus } from 'lucide-react';

import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyCourses, dummyLessons, dummyModules } from '@/data/dummyData';

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  const metaLookup = useMemo(() => {
    const moduleMap = dummyModules.reduce<Record<string, { module: string; courseId: string }>>(
      (acc, module) => {
        acc[module.id] = { module: module.title, courseId: module.courseId };
        return acc;
      },
      {},
    );
    const courseMap = dummyCourses.reduce<Record<string, string>>((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
    return { moduleMap, courseMap };
  }, []);

  const filteredLessons = dummyLessons.filter((lesson) => {
    const moduleMeta = metaLookup.moduleMap[lesson.moduleId];
    const matchesModule = moduleFilter === 'all' || lesson.moduleId === moduleFilter;
    const matchesCourse =
      courseFilter === 'all' || (moduleMeta && moduleMeta.courseId === courseFilter);
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesCourse && matchesSearch;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lessons</h1>
          <p className="text-muted-foreground mt-1">Micro learning units across every module</p>
        </div>
        <Link to="/lessons/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar placeholder="Search lessons..." onSearch={setSearchQuery} className="max-w-md" />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {dummyCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {dummyModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={BookMarked}
              title="No lessons match your filters"
              description="Adjust the filters or create a new lesson to populate this list."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => {
            const moduleMeta = metaLookup.moduleMap[lesson.moduleId];
            const courseTitle = moduleMeta ? metaLookup.courseMap[moduleMeta.courseId] : '—';
            return (
              <Card key={lesson.id} className="hover:border-primary/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <CardDescription>
                    {moduleMeta?.module} • {courseTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{lesson.content}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {lesson.duration}
                    </span>
                    <Badge variant="secondary">Order {lesson.order}</Badge>
                  </div>
                  <Link to={`/lessons/${lesson.id}`}>
                    <Button variant="outline" className="w-full">
                      View Lesson
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

