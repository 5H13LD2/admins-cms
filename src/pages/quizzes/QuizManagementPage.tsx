import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Loader2, ChevronRight } from 'lucide-react';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuizzes, useQuestionActions } from '@/hooks/useQuizzes';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useToast } from '@/hooks/useToast';

const difficultyCopy: Record<string, { label: string; variant: 'default' | 'secondary'; color: string }> = {
  EASY: { label: 'Easy', variant: 'secondary', color: 'text-green-600' },
  NORMAL: { label: 'Normal', variant: 'default', color: 'text-blue-600' },
  HARD: { label: 'Hard', variant: 'default', color: 'text-red-600' },
};

const ITEMS_PER_PAGE = 10;

export default function QuizManagementPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{ courseId: string; questionId: string } | null>(null);

  const {
    questions,
    loading: quizzesLoading,
    hasMore,
    loadMore,
    refresh
  } = useQuizzes({
    courseId: courseFilter !== 'all' ? courseFilter : undefined,
    moduleId: moduleFilter !== 'all' ? moduleFilter : undefined,
    pageSize: ITEMS_PER_PAGE
  });

  const { courses, loading: coursesLoading } = useCourses();
  const { modules, loading: modulesLoading } = useModules();

  // We need courseId for delete, so we'll get it from the question
  const { deleteQuestion, loading: deleteLoading } = useQuestionActions(questionToDelete?.courseId || '');

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

  // Client-side filtering for search and difficulty
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.explanation ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [questions, searchQuery, difficultyFilter]);

  const handleDeleteClick = (courseId: string, questionId: string) => {
    setQuestionToDelete({ courseId, questionId });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      await deleteQuestion(questionToDelete.questionId);
      toast.success('Question deleted successfully');
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      refresh();
    } catch (error) {
      toast.error('Failed to delete question. Please try again.');
    }
  };

  const loading = quizzesLoading || coursesLoading || modulesLoading;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Questions Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and delete quiz questions</p>
        </div>
        <Button onClick={() => navigate('/quizzes/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar
          placeholder="Search questions..."
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
              <SelectItem value="all">All courses</SelectItem>
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
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/${question.courseId}/${question.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(question.courseId || '', question.id)}
                          disabled={!question.courseId}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredQuestions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this quiz question.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
