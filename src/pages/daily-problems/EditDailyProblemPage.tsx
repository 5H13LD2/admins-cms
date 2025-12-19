import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDailyProblems } from '@/hooks/useDailyProblems';
import { useToastContext } from '@/context/ToastContext';

export default function EditDailyProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblem, updateProblem } = useDailyProblems();
  const { success, error: showError } = useToastContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const hasLoadedRef = useRef(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    type: 'code' as 'code' | 'quiz' | 'algorithm',
    description: '',
    content: '',
    solution: '',
    hints: '',
    points: '10',
  });

  useEffect(() => {
    // Prevent double loading in StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadProblem = async () => {
      if (!id) {
        setLoadError(true);
        showError('Problem ID not found');
        setTimeout(() => navigate('/daily-problems'), 1500);
        return;
      }

      try {
        setIsLoading(true);
        const problem = await getProblem(id);

        if (!problem) {
          setLoadError(true);
          showError('Problem not found');
          setTimeout(() => navigate('/daily-problems'), 1500);
          return;
        }

        setFormData({
          title: problem.title,
          difficulty: problem.difficulty,
          type: problem.type,
          description: problem.description,
          content: problem.content,
          solution: problem.solution || '',
          hints: problem.hints?.join(', ') || '',
          points: problem.points.toString(),
        });
      } catch (error) {
        console.error('Error loading problem:', error);
        setLoadError(true);
        showError('Failed to load problem');
        setTimeout(() => navigate('/daily-problems'), 1500);
      } finally {
        setIsLoading(false);
      }
    };

    loadProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      const hintsArray = formData.hints
        .split(',')
        .map(hint => hint.trim())
        .filter(hint => hint.length > 0);

      await updateProblem(id, {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        type: formData.type,
        content: formData.content,
        solution: formData.solution || undefined,
        hints: hintsArray.length > 0 ? hintsArray : undefined,
        points: parseInt(formData.points) || 10,
      });

      success('Daily problem updated successfully!');
      navigate('/daily-problems');
    } catch (error) {
      console.error('Error updating daily problem:', error);
      showError('Failed to update daily problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || loadError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              {isLoading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading problem...</p>
                </>
              ) : (
                <>
                  <div className="text-destructive text-lg font-semibold">Problem not found</div>
                  <p className="text-muted-foreground text-sm">Redirecting to problems list...</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/daily-problems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Problem</h1>
          <p className="text-muted-foreground mt-1">Update the coding challenge details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Reverse Linked List"
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleChange('difficulty', value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Problem Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="algorithm">Algorithm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="5"
                  placeholder="10"
                  value={formData.points}
                  onChange={(event) => handleChange('points', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                required
                placeholder="Short teaser that appears in the daily feed..."
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt *</Label>
              <Textarea
                id="content"
                rows={5}
                required
                placeholder="Provide full instructions, examples, and input/output expectations..."
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solution (private)</Label>
              <Textarea
                id="solution"
                rows={4}
                placeholder="Optional reference solution..."
                value={formData.solution}
                onChange={(event) => handleChange('solution', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hints">Hints</Label>
              <Input
                id="hints"
                placeholder="Separate hints with commas"
                value={formData.hints}
                onChange={(event) => handleChange('hints', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update Problem'}
              </Button>
              <Link to="/daily-problems">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
