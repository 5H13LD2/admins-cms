import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
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
import { useModules } from '@/hooks/useModules';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useCourses } from '@/hooks/useCourses';

const difficultyCopy: Record<string, { label: string; variant: 'default' | 'secondary'; color: string }> = {
  EASY: { label: 'Easy', variant: 'secondary', color: 'text-green-600' },
  NORMAL: { label: 'Normal', variant: 'default', color: 'text-blue-600' },
  HARD: { label: 'Hard', variant: 'default', color: 'text-red-600' },
};

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch courses, modules and quizzes from Firestore
  const { courses } = useCourses();
  const { modules } = useModules();
  const { quizzes, loading: quizzesLoading, hasMore, fetchQuizzes, loadMore } = useQuizzes();

  useEffect(() => {
    fetchQuizzes(10, false);
  }, []);

  // Map module IDs to titles
  const moduleMap = useMemo(() => {
    return modules.reduce<Record<string, string>>((acc, module) => {
      acc[module.id] = module.title;
      return acc;
    }, {});
  }, [modules]);

  // Get unique module IDs from quizzes (only modules that have quizzes)
  const modulesWithQuizzes = useMemo(() => {
    const uniqueModuleIds = new Set(quizzes.map(quiz => quiz.moduleId));
    return modules.filter(module => uniqueModuleIds.has(module.id));
  }, [modules, quizzes]);

  // Filter modules by selected course
  const filteredModules = useMemo(() => {
    if (courseFilter === 'all') return modulesWithQuizzes;
    return modulesWithQuizzes.filter(module => module.courseId === courseFilter);
  }, [modulesWithQuizzes, courseFilter]);

  // Get unique courses that have quizzes (through their modules)
  const coursesWithQuizzes = useMemo(() => {
    const uniqueCourseIds = new Set(modulesWithQuizzes.map(module => module.courseId));
    return courses.filter(course => uniqueCourseIds.has(course.id));
  }, [courses, modulesWithQuizzes]);

  // Filter quizzes by search, difficulty, course, and module
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
      const matchesModule = moduleFilter === 'all' || quiz.moduleId === moduleFilter;

      // Check if quiz's module belongs to selected course
      let matchesCourse = true;
      if (courseFilter !== 'all') {
        const quizModule = modules.find(m => m.id === quiz.moduleId);
        matchesCourse = quizModule?.courseId === courseFilter;
      }

      return matchesSearch && matchesDifficulty && matchesModule && matchesCourse;
    });
  }, [quizzes, searchQuery, difficultyFilter, moduleFilter, courseFilter, modules]);

  // Paginate filtered quizzes
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuizzes.slice(startIndex, endIndex);
  }, [filteredQuizzes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, courseFilter, moduleFilter]);

  // Reset module filter when course filter changes
  useEffect(() => {
    if (courseFilter !== 'all') {
      setModuleFilter('all');
    }
  }, [courseFilter]);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
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
        <SearchBar placeholder="Search quizzes..." onSearch={setSearchQuery} className="max-w-md" />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {coursesWithQuizzes.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
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

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
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
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {quizzesLoading && quizzes.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">Loading quizzes...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Passing Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuizzes.map((quiz) => {
                const difficultyMeta = difficultyCopy[quiz.difficulty];
                return (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{quiz.title}</div>
                      <div className="text-xs text-muted-foreground">{quiz.description ?? '—'}</div>
                    </TableCell>
                    <TableCell>{moduleMap[quiz.moduleId] ?? quiz.moduleId}</TableCell>
                    <TableCell>
                      <Badge variant={difficultyMeta.variant}>{difficultyMeta.label}</Badge>
                    </TableCell>
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
              {paginatedQuizzes.length === 0 && !quizzesLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No quizzes found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
