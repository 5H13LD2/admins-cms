import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';

const difficultyCopy: Record<string, { label: string; variant: 'default' | 'secondary'; color: string }> = {
  EASY: { label: 'Easy', variant: 'secondary', color: 'text-green-600' },
  NORMAL: { label: 'Normal', variant: 'default', color: 'text-blue-600' },
  HARD: { label: 'Hard', variant: 'default', color: 'text-red-600' },
};

const ITEMS_PER_PAGE = 10;

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { quizzes, loading: quizzesLoading } = useQuizzes();
  const { courses, loading: coursesLoading } = useCourses();
  const { modules, loading: modulesLoading } = useModules();

  // Map module IDs to titles and course IDs
  const moduleMap = useMemo(() => {
    return modules.reduce<Record<string, { title: string; courseId: string }>>((acc, module) => {
      acc[module.id] = { title: module.title, courseId: module.courseId };
      return acc;
    }, {});
  }, [modules]);

  // Map course IDs to titles
  const courseMap = useMemo(() => {
    return courses.reduce<Record<string, string>>((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
  }, [courses]);

  // Filter modules by selected course
  const filteredModules = useMemo(() => {
    if (courseFilter === 'all') return modules;
    return modules.filter(module => module.courseId === courseFilter);
  }, [modules, courseFilter]);

  // Filter quizzes by search, difficulty, course, and module
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
      const matchesCourse = courseFilter === 'all' || quiz.courseId === courseFilter;
      const matchesModule = moduleFilter === 'all' || quiz.moduleId === moduleFilter;
      return matchesSearch && matchesDifficulty && matchesCourse && matchesModule;
    });
  }, [quizzes, searchQuery, difficultyFilter, courseFilter, moduleFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const loading = quizzesLoading || coursesLoading || modulesLoading;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Assess understanding after each module</p>
        </div>
        <div className="flex gap-3">
          <Link to="/quizzes/manage">
            <Button variant="outline">Management Hub</Button>
          </Link>
          <Link to="/quizzes/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar
          placeholder="Search quizzes..."
          onSearch={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={courseFilter} onValueChange={(value) => {
            setCourseFilter(value);
            setModuleFilter('all');
            setCurrentPage(1);
          }}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={(value) => handleFilterChange(setDifficultyFilter, value)}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={(value) => handleFilterChange(setModuleFilter, value)}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {filteredModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Passing Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuizzes.map((quiz) => {
                const difficultyMeta = difficultyCopy[quiz.difficulty];
                const moduleData = moduleMap[quiz.moduleId];
                return (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{quiz.title}</div>
                      <div className="text-xs text-muted-foreground">{quiz.description ?? '—'}</div>
                    </TableCell>
                    <TableCell>{courseMap[quiz.courseId] || '—'}</TableCell>
                    <TableCell>{moduleData?.title || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={difficultyMeta.variant}>{difficultyMeta.label}</Badge>
                    </TableCell>
                    <TableCell>{quiz.questionCount ?? 0}</TableCell>
                    <TableCell>{quiz.passingScore ?? '—'}%</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/quizzes/${quiz.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredQuizzes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                    No quizzes found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && filteredQuizzes.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
