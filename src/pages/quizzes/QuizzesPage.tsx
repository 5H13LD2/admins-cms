import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, ChevronRight } from 'lucide-react';

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

  const {
    questions,
    loading: quizzesLoading,
    hasMore,
    loadMore
  } = useQuizzes({
    courseId: courseFilter !== 'all' ? courseFilter : undefined,
    moduleId: moduleFilter !== 'all' ? moduleFilter : undefined,
    pageSize: ITEMS_PER_PAGE
  });
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

  // Client-side filtering for search and difficulty (since Firestore doesn't support complex queries easily)
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.explanation ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [questions, searchQuery, difficultyFilter]);

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
          onSearch={setSearchQuery}
          className="max-w-md"
        />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={courseFilter} onValueChange={(value) => {
            setCourseFilter(value);
            setModuleFilter('all');
          }}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Course</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
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
                <TableHead>Question</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => {
                const difficultyMeta = difficultyCopy[question.difficulty || 'NORMAL'];
                const moduleData = question.module_id ? moduleMap[question.module_id] : null;
                return (
                  <TableRow key={question.id}>
                    <TableCell>
                      <div className="font-medium text-foreground line-clamp-2">{question.question}</div>
                      {question.explanation && (
                        <div className="text-xs text-muted-foreground line-clamp-1">{question.explanation}</div>
                      )}
                    </TableCell>
                    <TableCell>{question.courseId ? courseMap[question.courseId] : '—'}</TableCell>
                    <TableCell>{moduleData?.title || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={difficultyMeta.variant}>{difficultyMeta.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {question.options && question.options[question.correctOptionIndex]
                        ? String.fromCharCode(65 + question.correctOptionIndex)
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/quizzes/${question.courseId}/${question.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredQuestions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No quiz questions found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && filteredQuestions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            {hasMore && ' (more available)'}
          </div>
          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={loadMore}
              disabled={quizzesLoading}
            >
              {quizzesLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Load More
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
