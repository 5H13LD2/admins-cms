import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyProblems } from '@/hooks/useDailyProblems';
import { formatDate } from '@/utils/formatters';
import { useToastContext } from '@/context/ToastContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DailyProblemsPage() {
  const { problems, loading, error, deleteProblem } = useDailyProblems();
  const { success, error: showError } = useToastContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (problemId: string) => {
    setProblemToDelete(problemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;

    try {
      await deleteProblem(problemToDelete);
      success('Daily problem deleted successfully!');
    } catch (error) {
      console.error('Error deleting daily problem:', error);
      showError('Failed to delete daily problem. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setProblemToDelete(null);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Coding Problems</h1>
          <p className="text-muted-foreground mt-1">Keep streaks alive with fresh prompts</p>
        </div>
        <Link to="/daily-problems/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Problem
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading daily problems...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading daily problems: {error.message}</p>
        </div>
      )}

      {!loading && !error && problems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No daily problems found. Create one to get started!</p>
        </div>
      )}

      {!loading && !error && problems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <Card key={problem.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{problem.title}</CardTitle>
                    <CardDescription>{problem.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{problem.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(problem.date)}
                  </span>
                  <span>{problem.points} pts</span>
                </div>
                {problem.hints && problem.hints.length > 0 && (
                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    Hints: {problem.hints.join(' • ')}
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t">
                  <Link to={`/daily-problems/edit/${problem.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(problem.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the daily problem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

