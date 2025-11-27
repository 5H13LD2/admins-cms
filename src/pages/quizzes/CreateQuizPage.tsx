import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useQuizzes } from '@/hooks/useQuizzes';
import { QuestionFormData } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { courses } = useCourses();
  const { modules } = useModules();
  const { createQuiz } = useQuizzes();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'NORMAL' as 'EASY' | 'NORMAL' | 'HARD',
    passingScore: '',
    description: '',
  });
  const [questions, setQuestions] = useState<QuestionFormData[]>([
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', order: 1 }
  ]);

  const filteredModules = modules.filter(m => m.courseId === courseId);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionFormData, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', order: questions.length + 1 }
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Update order
    newQuestions.forEach((q, i) => q.order = i + 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!courseId || !moduleId) {
      error('Please select both course and module');
      return;
    }

    if (questions.length === 0) {
      error('Please add at least one question');
      return;
    }

    // Validate all questions have required fields
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        error(`Question ${i + 1} is missing the question text`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        error(`Question ${i + 1} has empty options`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await createQuiz({
        courseId,
        moduleId,
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        passingScore: formData.passingScore ? parseInt(formData.passingScore) : undefined,
        questions
      });

      success('Quiz created successfully');
      navigate('/quizzes');
    } catch (err) {
      console.error('Error creating quiz:', err);
      error('Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Quiz</h1>
          <p className="text-gray-500 mt-1">Validate knowledge after a lesson or module</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={courseId}
                  onValueChange={(value) => {
                    setCourseId(value);
                    setModuleId('');
                  }}
                >
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
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select
                  value={moduleId}
                  onValueChange={setModuleId}
                  disabled={!courseId}
                >
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Java Basics Quiz"
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
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                placeholder="75"
                value={formData.passingScore}
                onChange={(event) => handleChange('passingScore', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Describe what this quiz covers..."
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions</CardTitle>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <Label className="text-lg font-semibold">Question {qIndex + 1}</Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`question-${qIndex}`}>Question Text *</Label>
                  <Textarea
                    id={`question-${qIndex}`}
                    required
                    placeholder="Enter your question here..."
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options *</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-6">{String.fromCharCode(65 + oIndex)}.</span>
                      <Input
                        required
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`correct-${qIndex}`}>Correct Answer *</Label>
                  <Select
                    value={question.correctOptionIndex.toString()}
                    onValueChange={(value) => handleQuestionChange(qIndex, 'correctOptionIndex', parseInt(value))}
                  >
                    <SelectTrigger id={`correct-${qIndex}`}>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, oIndex) => (
                        <SelectItem key={oIndex} value={oIndex.toString()}>
                          {String.fromCharCode(65 + oIndex)}. {option || `Option ${String.fromCharCode(65 + oIndex)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`explanation-${qIndex}`}>Explanation (Optional)</Label>
                  <Textarea
                    id={`explanation-${qIndex}`}
                    placeholder="Explain why this answer is correct..."
                    value={question.explanation}
                    onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || !courseId || !moduleId}>
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </Button>
          <Link to="/quizzes">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

