import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Clock, BookOpen, Plus, Loader2, AlertCircle } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import ModuleCard from '@/components/cards/ModuleCard';

const MODULES_PER_PAGE = 6;

export default function ModulesPage() {
  const { courses, loading: coursesLoading } = useCourses();
  const { modules, loading: modulesLoading, error } = useModules();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const courseLookup = useMemo(() => {
    return courses.reduce<Record<string, string>>((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
  }, [courses]);

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      (module.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (module.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || module.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.max(1, Math.ceil(filteredModules.length / MODULES_PER_PAGE));
  const firstItemIndex = (currentPage - 1) * MODULES_PER_PAGE;
  const paginatedModules = filteredModules.slice(firstItemIndex, firstItemIndex + MODULES_PER_PAGE);

  const quickStats = [
    {
      label: 'Total Modules',
      value: modules.length,
      icon: Layers,
    },
    {
      label: 'Active Courses',
      value: new Set(modules.map((module) => module.courseId)).size,
      icon: BookOpen,
    },
    {
      label: 'Avg. Duration',
      value: '3.1 hrs',
      icon: Clock,
    },
  ];

  if (modulesLoading || coursesLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p>Error loading modules: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modules</h1>
          <p className="text-muted-foreground mt-1">Organize learning paths inside each course</p>
        </div>
        <Link to="/modules/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar placeholder="Search modules..." onSearch={setSearchQuery} className="max-w-md" />

        <div className="flex items-center gap-4">
          <Select value={courseFilter} onValueChange={(value) => setCourseFilter(value)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedModules.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Layers}
              title="No modules found"
              description="Try adjusting your search or filters to find specific modules."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedModules.map((module) => (
            <ModuleCard key={module.id} module={module} courseName={courseLookup[module.courseId]} />
          ))}
        </div>
      )}

      {filteredModules.length > MODULES_PER_PAGE && (
        <Pagination
          className="mt-8"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

