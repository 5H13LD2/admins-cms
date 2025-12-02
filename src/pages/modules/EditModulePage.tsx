import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

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

export default function EditModulePage() {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { courses, loading: coursesLoading } = useCourses();
  const { success, error: showError } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    lessons: 0,
    order: 1,
    image: '',
  });

  // Fetch existing module data
  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId) return;

      try {
        setIsLoading(true);
        const allModules = await modulesService.getAll();
        const module = allModules.find((m) => m.id === moduleId);

        if (module) {
          setFormData({
            title: module.title,
            description: module.description,
            courseId: module.courseId,
            duration: module.duration || '',
            lessons: module.lessons || 0,
            order: module.order || 1,
            image: module.image || '',
          });
        } else {
          setError('Module not found');
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load module';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!moduleId) {
      setError('Module ID is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      await modulesService.update(formData.courseId, moduleId, {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        lessons: formData.lessons,
        order: formData.order,
        image: formData.image
      });

      success('Module updated successfully!');
      navigate(`/modules/${moduleId}`);
    } catch (err) {
      console.error('Error updating module:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update module';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (coursesLoading || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p>{error}</p>
        <Link to="/modules">
          <Button variant="outline">Back to Modules</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/modules/${moduleId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Module</h1>
          <p className="text-muted-foreground mt-1">Update module information</p>
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
                  disabled
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
                <p className="text-sm text-muted-foreground">
                  Course cannot be changed after module creation
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Module Title *</Label>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link to={`/modules/${moduleId}`}>
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
