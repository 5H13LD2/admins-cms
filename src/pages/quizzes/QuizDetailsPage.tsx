import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Award, HelpCircle, Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { quizzesService } from '@/services/quizzes.service';
import { modulesService } from '@/services/modules.service';
import { Quiz } from '@/types';
import { Module } from '@/types';

const difficultyColors: Record<
  string,
  { badge: 'default' | 'secondary'; label: string; tone: string }
> = {
  EASY: { badge: 'secondary', label: 'Easy', tone: 'text-green-600' },
  NORMAL: { badge: 'default', label: 'Normal', tone: 'text-blue-600' },
  HARD: { badge: 'default', label: 'Hard', tone: 'text-red-600' },
};

export default function QuizDetailsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 10;

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return;

      try {
        setLoading(true);
        // Fetch quiz with questions
        const quizData = await quizzesService.getById(quizId);
        setQuiz(quizData);

        // Fetch module if quiz has moduleId and courseId
        if (quizData?.moduleId && quizData?.courseId) {
          const moduleData = await modulesService.getById(quizData.courseId, quizData.moduleId);
          setModule(moduleData);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleDelete = async () => {
    if (!quizId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${quiz?.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await quizzesService.delete(quizId);
      navigate('/quizzes');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Quiz not found</CardTitle>
            <CardDescription>The requested quiz is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quizzes">
              <Button>Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const difficultyMeta = difficultyColors[quiz.difficulty];

  // Pagination calculations
  const totalQuestions = quiz.questions?.length || 0;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const paginatedQuestions = quiz.questions?.slice(startIndex, endIndex) || [];

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, ..., last
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-3, last-2, last-1, last
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>


      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/quizzes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-500 mt-1">Detailed view with question bank</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/quizzes/${quizId}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Quiz
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Module</CardTitle>
            <CardDescription>Where learners encounter this quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold text-gray-900">{module?.title ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Difficulty</CardTitle>
            <CardDescription>Relative challenge level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`font-semibold ${difficultyMeta?.tone ?? ''}`}>
              {difficultyMeta?.label ?? quiz.difficulty}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Passing Score</CardTitle>
            <CardDescription>Required to unlock completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold text-gray-900">
              {quiz.passingScore ?? '—'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Quiz Summary</CardTitle>
            <CardDescription>{quiz.description ?? 'No description provided'}</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            <span>{quiz.timeLimit ?? 0} mins</span>
          </div>
        </CardHeader>
        <CardContent className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span>{quiz.questions?.length || 0} questions</span>
          </div>
          <Badge variant={difficultyMeta?.badge ?? 'default'}>{difficultyMeta?.label}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>Each question with answer key and rationale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalQuestions === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No questions available for this quiz.</p>
          ) : (
            <>
              {paginatedQuestions.map((question, index) => (
                <div key={question.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                    <span>Question {startIndex + index + 1}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{question.question}</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {question.options.map((option, idx) => (
                      <li
                        key={`${question.id}-option-${idx}`}
                        className={idx === question.correctOptionIndex ? 'font-semibold text-primary' : ''}
                      >
                        {option}
                      </li>
                    ))}
                  </ol>
                  {question.explanation && (
                    <p className="text-sm text-gray-500">
                      Explanation: {question.explanation}
                    </p>
                  )}
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalQuestions)} of {totalQuestions} questions
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        )
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

