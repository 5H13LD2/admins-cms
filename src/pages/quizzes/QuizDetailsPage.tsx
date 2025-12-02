import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuestion, useQuestionActions } from '@/hooks/useQuizzes';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

const difficultyColors: Record<
  string,
  { badge: 'default' | 'secondary'; label: string; tone: string }
> = {
  EASY: { badge: 'secondary', label: 'Easy', tone: 'text-green-600' },
  NORMAL: { badge: 'default', label: 'Normal', tone: 'text-blue-600' },
  HARD: { badge: 'default', label: 'Hard', tone: 'text-red-600' },
};

export default function QuizDetailsPage() {
  const { courseId, questionId } = useParams<{ courseId: string; questionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { question, loading } = useQuestion(courseId, questionId);
  const { deleteQuestion, loading: deleteLoading } = useQuestionActions(courseId || '');
  const { courses } = useCourses();
  const { modules } = useModules();

  const course = courses.find(c => c.id === courseId);
  const module = modules.find(m => m.id === question?.module_id);

  const handleDelete = async () => {
    if (!questionId) return;

    try {
      await deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      navigate('/quizzes/manage');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground mb-4">Question not found</p>
        <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    );
  }

  const difficultyMeta = difficultyColors[question.difficulty || 'NORMAL'];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Quiz Question Details</h1>
          <p className="text-muted-foreground mt-1">View and manage quiz question</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/quizzes/${courseId}/${questionId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Question Details */}
      <div className="space-y-6">
        {/* Metadata Card */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Course</p>
              <p className="font-medium">{course?.title || courseId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Module</p>
              <p className="font-medium">{module?.title || question.module_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
              <Badge variant={difficultyMeta.badge} className={difficultyMeta.tone}>
                {difficultyMeta.label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Question</h2>
          <p className="text-foreground text-lg leading-relaxed">{question.question}</p>
        </Card>

        {/* Answer Options Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Answer Options</h2>
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const isCorrect = index === question.correctOptionIndex;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-border bg-muted/50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{option}</p>
                  </div>
                  {isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Explanation Card */}
        {question.explanation && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Explanation</h2>
            <p className="text-muted-foreground leading-relaxed">{question.explanation}</p>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Order</p>
              <p className="font-medium">{question.order || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Points</p>
              <p className="font-medium">{question.points || 1}</p>
            </div>
          </div>
        </Card>
      </div>

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
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
