import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useQuestionActions } from '@/hooks/useQuizzes';
import { useToast } from '@/hooks/useToast';

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { courses } = useCourses();
  const { modules } = useModules();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [order, setOrder] = useState(0);

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  const { addQuestion } = useQuestionActions(courseId);

  const filteredModules = modules.filter(m => m.courseId === courseId);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!courseId) {
      toast.error('Please select a course');
      return;
    }

    if (!moduleId) {
      toast.error('Please select a module');
      return;
    }

    if (!questionText.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      toast.error('All four options must be filled');
      return;
    }

    try {
      setIsSubmitting(true);

      await addQuestion({
        question: questionText,
        options,
        correctOptionIndex,
        explanation,
        module_id: moduleId,
        difficulty,
        order
      });

      toast.success('Quiz question added successfully!');
      navigate('/quizzes/manage');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Quiz Question</h1>
          <p className="text-muted-foreground mt-1">Create a new quiz question for a module</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Course and Module Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course">Course *</Label>
                <Select value={courseId} onValueChange={(value) => {
                  setCourseId(value);
                  setModuleId(''); // Reset module when course changes
                }} required>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="module">Module *</Label>
                <Select value={moduleId} onValueChange={setModuleId} required disabled={!courseId}>
                  <SelectTrigger id="module">
                    <SelectValue placeholder={courseId ? "Select module" : "Select course first"} />
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
            </div>

            {/* Question Text */}
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

            {/* Answer Options */}
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

            {/* Difficulty and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="0"
                />
              </div>
            </div>

            {/* Explanation */}
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

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Question...
                  </>
                ) : (
                  'Add Question'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
