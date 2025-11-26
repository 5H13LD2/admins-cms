import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useToast } from '@/hooks/useToast';
import { QuestionFormData, Course, Module } from '@/types';
import { coursesService } from '@/services/courses.service';
import { modulesService } from '@/services/modules.service';

interface QuestionForm extends QuestionFormData {
  tempId: string;
}

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createQuiz, createQuestionWithId } = useQuizzes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    moduleId: '',
    difficulty: 'NORMAL' as 'EASY' | 'NORMAL' | 'HARD',
    timeLimit: '',
    passingScore: '',
    description: '',
  });
  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  // Fetch courses from Firebase on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await coursesService.getAll();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load courses',
          variant: 'destructive'
        });
      }
    };
    fetchCourses();
  }, [toast]);

  // Fetch modules when a course is selected
  useEffect(() => {
    const fetchModules = async () => {
      if (!selectedCourseId) {
        setModules([]);
        return;
      }

      try {
        const modulesData = await modulesService.getByCourseId(selectedCourseId);
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast({
          title: 'Error',
          description: 'Failed to load modules',
          variant: 'destructive'
        });
      }
    };
    fetchModules();
  }, [selectedCourseId, toast]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion: QuestionForm = {
      tempId: `temp-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      module_id: formData.moduleId,
      order: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (tempId: string, field: keyof QuestionFormData, value: any) => {
    setQuestions(questions.map(q =>
      q.tempId === tempId ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (tempId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.tempId === tempId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (tempId: string) => {
    const updatedQuestions = questions.filter(q => q.tempId !== tempId);
    // Reorder remaining questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }));
    setQuestions(reorderedQuestions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (questions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one question',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the quiz first
      const quizId = await createQuiz({
        title: formData.title,
        moduleId: formData.moduleId,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
        passingScore: formData.passingScore ? parseInt(formData.passingScore) : undefined,
        description: formData.description || undefined,
        questions: [] // Will be added as subcollection
      });

      // Create each question in the subcollection with custom IDs
      const quizName = formData.moduleId.split('_')[0]; // e.g., "java" from "java_module_1"
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = `${quizName}_q${i + 1}`; // e.g., "java_q1", "java_q2"

        await createQuestionWithId(quizId, questionId, {
          question: question.question,
          options: question.options,
          correctOptionIndex: question.correctOptionIndex,
          explanation: question.explanation,
          module_id: question.module_id,
          order: question.order
        });
      }

      toast({
        title: 'Success',
        description: 'Quiz created successfully'
      });
      navigate('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to create quiz',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Quiz</h1>
          <p className="text-muted-foreground mt-1">Validate knowledge after a lesson or module</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={selectedCourseId}
                  onValueChange={(value) => {
                    setSelectedCourseId(value);
                    setFormData((prev) => ({ ...prev, moduleId: '' }));
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
                  value={formData.moduleId}
                  onValueChange={(value) => {
                    handleChange('moduleId', value);
                    // Update all question module_ids when module changes
                    setQuestions(questions.map(q => ({ ...q, module_id: value })));
                  }}
                  disabled={!selectedCourseId}
                >
                  <SelectTrigger id="module">
                    <SelectValue placeholder={selectedCourseId ? "Select module" : "Select course first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="5"
                  placeholder="20"
                  value={formData.timeLimit}
                  onChange={(event) => handleChange('timeLimit', event.target.value)}
                />
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button type="button" onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              questions.map((question, index) => (
                <Card key={question.tempId} className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.tempId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text *</Label>
                      <Textarea
                        required
                        placeholder="What does JVM stand for?"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.tempId, 'question', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Options *</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex gap-2 items-center">
                          <span className="text-sm font-medium w-8">{String.fromCharCode(65 + optIndex)}.</span>
                          <Input
                            required
                            placeholder={`Option ${optIndex + 1}`}
                            value={option}
                            onChange={(e) => updateQuestionOption(question.tempId, optIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Correct Answer *</Label>
                        <Select
                          value={question.correctOptionIndex.toString()}
                          onValueChange={(value) => updateQuestion(question.tempId, 'correctOptionIndex', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map((_, optIndex) => (
                              <SelectItem key={optIndex} value={optIndex.toString()}>
                                Option {String.fromCharCode(65 + optIndex)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={question.order}
                          onChange={(e) => updateQuestion(question.tempId, 'order', parseInt(e.target.value))}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Explanation *</Label>
                      <Textarea
                        required
                        placeholder="JVM stands for Java Virtual Machine, which runs Java bytecode."
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.tempId, 'explanation', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || !formData.moduleId || questions.length === 0}>
            {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
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

