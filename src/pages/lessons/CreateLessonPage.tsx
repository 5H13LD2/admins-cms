import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { modulesService } from '@/services/modules.service';
import { lessonsService } from '@/services/lessons.service';
import { Module, Course } from '@/types';
import { useToastContext } from '@/context/ToastContext';

export default function CreateLessonPage() {
  const navigate = useNavigate();
  const { courseId: urlCourseId, moduleId: urlModuleId } = useParams();
  const { courses, loading: coursesLoading } = useCourses();
  const { success, error: showError } = useToastContext();

  const [modules, setModules] = useState<Module[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    courseId: urlCourseId || '',
    moduleId: urlModuleId || '',
    lessonId: '',
    explanation: '',
    codeExample: '',
    number: '',
    duration: '',
    order: 1,
    videoUrl: '',
    content: '',
  });

  // Extract module number from moduleId (e.g., "course_module_1" -> "1")
  const extractModuleNumber = (moduleId: string): string => {
    const match = moduleId.match(/module_(\d+)$/);
    return match ? match[1] : '';
  };

  // Generate lesson ID based on module and number (e.g., lesson_1_5 for module 1, lesson number 1.5)
  const generateLessonId = (moduleId: string, number: string) => {
    if (!moduleId || !number) return '';
    const moduleNumber = extractModuleNumber(moduleId);
    if (!moduleNumber) return '';
    // Replace decimal point with underscore (e.g., 1.5 becomes 1_5)
    const formattedNumber = number.replace('.', '_');
    return `lesson_${moduleNumber}_${formattedNumber}`;
  };

  // Auto-generate lessonId when moduleId or number changes
  useEffect(() => {
    if (formData.moduleId && formData.number) {
      const generatedId = generateLessonId(formData.moduleId, formData.number);
      setFormData((prev) => ({ ...prev, lessonId: generatedId }));
    }
  }, [formData.moduleId, formData.number]);

  // Fetch modules when course is selected
  useEffect(() => {
    if (formData.courseId) {
      const fetchModules = async () => {
        setModulesLoading(true);
        try {
          const fetchedModules = await modulesService.getByCourseId(formData.courseId);
          setModules(fetchedModules);
        } catch (err) {
          console.error('Error fetching modules:', err);
        } finally {
          setModulesLoading(false);
        }
      };
      fetchModules();
    } else {
      setModules([]);
    }
  }, [formData.courseId]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await lessonsService.create(formData.courseId, formData.moduleId, {
        lessonId: formData.lessonId,
        title: formData.title,
        content: formData.content,
        explanation: formData.explanation,
        codeExample: formData.codeExample,
        number: formData.number,
        duration: formData.duration,
        order: formData.order,
        videoUrl: formData.videoUrl
      });

      success('Lesson created successfully!');
      const detailsPath = `/lessons/${formData.lessonId}?courseId=${formData.courseId}&moduleId=${formData.moduleId}`;
      navigate(detailsPath);
    } catch (err) {
      console.error('Error creating lesson:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lesson';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (coursesLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Lesson</h1>
          <p className="text-muted-foreground mt-1">Draft a focused learning experience</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => handleChange('courseId', value)}
                  required
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: Course) => (
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
                  onValueChange={(value) => handleChange('moduleId', value)}
                  required
                  disabled={!formData.courseId || modulesLoading}
                >
                  <SelectTrigger id="module">
                    <SelectValue placeholder={modulesLoading ? 'Loading modules...' : 'Select module'} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Variables"
                  required
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Lesson Number *</Label>
                <Input
                  id="number"
                  type="text"
                  required
                  placeholder="e.g., 1 or 1.5"
                  value={formData.number}
                  onChange={(event) => handleChange('number', event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use whole numbers (1, 2) or decimals (1.5, 2.3)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation *</Label>
              <Textarea
                id="explanation"
                rows={4}
                required
                placeholder="Explain the concept covered in this lesson..."
                value={formData.explanation}
                onChange={(event) => handleChange('explanation', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeExample">Code Example *</Label>
              <Textarea
                id="codeExample"
                rows={6}
                required
                placeholder="Provide code examples for this lesson..."
                value={formData.codeExample}
                onChange={(event) => handleChange('codeExample', event.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Additional Content</Label>
              <Textarea
                id="content"
                rows={4}
                placeholder="Add lesson transcript, instructions, or additional notes..."
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 20 min"
                  value={formData.duration}
                  onChange={(event) => handleChange('duration', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order *</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  required
                  placeholder="1"
                  value={formData.order}
                  onChange={(event) => handleChange('order', parseInt(event.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={formData.videoUrl}
                  onChange={(event) => handleChange('videoUrl', event.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.courseId || !formData.moduleId || !formData.title}
              >
                {isSubmitting ? 'Creating...' : 'Create Lesson'}
              </Button>
              <Link to="/lessons">
                <Button type="button" variant="outline" disabled={isSubmitting}>
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

