import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useQuestion, useQuestionActions } from '@/hooks/useQuizzes';
import { useModules } from '@/hooks/useModules';
import { useToast } from '@/hooks/useToast';

export default function EditQuizPage() {
  const { courseId, questionId } = useParams<{ courseId: string; questionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { question, loading: questionLoading } = useQuestion(courseId, questionId);
  const { updateQuestion: updateQuestionMutation, loading: updateLoading } = useQuestionActions(courseId || '');
  const { modules } = useModules();

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [order, setOrder] = useState(0);

  // Load question data when available
  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setOptions(question.options || ['', '', '', '']);
      setCorrectOptionIndex(question.correctOptionIndex);
      setExplanation(question.explanation || '');
      setModuleId(question.module_id || '');
      setDifficulty(question.difficulty || 'NORMAL');
      setOrder(question.order || 0);
    }
  }, [question]);

  // Filter modules by course
  const filteredModules = modules.filter(module => module.courseId === courseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !questionId) return;

    // Validation
    if (!questionText.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      toast.error('All four options must be filled');
      return;
    }

    if (!moduleId) {
      toast.error('Module is required');
      return;
    }

    try {
      await updateQuestionMutation(questionId, {
        question: questionText,
        options,
        correctOptionIndex,
        explanation,
        module_id: moduleId,
        difficulty,
        order
      });

      toast.success('Question updated successfully');
      navigate('/quizzes/manage');
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question. Please try again.');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (questionLoading) {
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
        <Button onClick={() => navigate('/quizzes/manage')}>Back to Quiz Management</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Quiz Question</h1>
          <p className="text-muted-foreground mt-1">Update question details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="questionText">Question *</Label>
              <Textarea
                id="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here"
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Answer Options *</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctOptionIndex === index}
                      onChange={() => setCorrectOptionIndex(index)}
                      className="h-4 w-4 cursor-pointer"
                    />
                    <Label className="text-sm text-muted-foreground cursor-pointer">
                      Correct
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="module">Module *</Label>
                <Select value={moduleId} onValueChange={setModuleId} required>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)} required>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this is the correct answer"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
