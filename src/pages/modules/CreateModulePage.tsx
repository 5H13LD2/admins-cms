import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Course } from '@/types';
import { useToastContext } from '@/context/ToastContext';

export default function CreateModulePage() {
  const navigate = useNavigate();
  const { courses, loading: coursesLoading } = useCourses();
  const { success, error: showError } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    moduleId: '',
    courseId: '',
    duration: '',
    lessons: 0,
    order: 1,
    image: '',
  });

  // Generate module ID slug based on course and title
  const generateModuleId = (courseId: string, title: string) => {
    const course = courses.find((c: Course) => c.id === courseId);
    if (!course || !title) return '';

    // Convert course title to slug (e.g., "Java Programming" -> "java")
    const courseSlug = course.title.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');

    // Convert module title to slug
    const titleSlug = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');

    return `${courseSlug}_module_${titleSlug}`;
  };

  // Auto-generate module ID when course or title changes
  useEffect(() => {
    if (formData.courseId && formData.title) {
      const generatedId = generateModuleId(formData.courseId, formData.title);
      setFormData(prev => ({ ...prev, moduleId: generatedId }));
    }
  }, [formData.courseId, formData.title, courses]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateModuleId = (moduleId: string): boolean => {
    // Validate naming convention: coursename_module_something
    const pattern = /^[a-z0-9]+_module_[a-z0-9_]+$/;
    return pattern.test(moduleId);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validate module ID format
    if (!validateModuleId(formData.moduleId)) {
      setError('Module ID must follow the format: coursename_module_name (lowercase, underscores only)');
      return;
    }

    setIsSubmitting(true);
    try {
      await modulesService.create({
        moduleId: formData.moduleId,
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        lessons: formData.lessons,
        order: formData.order,
        image: formData.image
      });

      success('Module created successfully!');
      navigate(`/courses/${formData.courseId}`);
    } catch (err) {
      console.error('Error creating module:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create module';
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
        <Link to="/modules">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Module</h1>
          <p className="text-muted-foreground mt-1">Define the structure of a new learning module</p>
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
          <CardTitle>Module Details</CardTitle>
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
                <Label htmlFor="title">Module Number *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Control Flow & Functions"
                  required
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moduleId">Module ID (URL slug) *</Label>
              <Input
                id="moduleId"
                placeholder="e.g., java_module_control_flow"
                required
                value={formData.moduleId}
                onChange={(event) => handleChange('moduleId', event.target.value)}
                className={!validateModuleId(formData.moduleId) && formData.moduleId ? 'border-destructive' : ''}
              />
              <p className="text-sm text-muted-foreground">
                Format: coursename_module_name (lowercase with underscores). Auto-generated from course and title.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the content learners will cover in this module."
                required
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 hours"
                  value={formData.duration}
                  onChange={(event) => handleChange('duration', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessons">Number of Lessons</Label>
                <Input
                  id="lessons"
                  type="number"
                  min="0"
                  placeholder="e.g., 8"
                  value={formData.lessons}
                  onChange={(event) => handleChange('lessons', parseInt(event.target.value) || 0)}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(event) => handleChange('image', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.courseId || !formData.title}>
                {isSubmitting ? 'Creating...' : 'Create Module'}
              </Button>
              <Link to="/modules">
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

