import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToastContext } from '@/context/ToastContext';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { createCourse } = useCourses();
  const { user } = useAuth();
  const { success, error: showError } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    image: '',
    status: 'active' as 'active' | 'inactive' | 'draft' | 'archived',
    compilerTypeId: '',
    CourseId: '',
    CourseDetail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showError('User must be logged in to create a course');
      return;
    }

    setIsLoading(true);

    try {
      const courseData: Omit<Course, 'id'> = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        image: formData.image,
        status: formData.status,
        moduleCount: 0,
        enrolledUsers: [],
        compilerTypeId: formData.compilerTypeId,
        CourseId: formData.CourseId,
        CourseDetail: formData.CourseDetail,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createCourse(courseData);
      success('Course created successfully!');
      navigate('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      showError(error instanceof Error ? error.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Add a new course to the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Python Programming"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 8 weeks"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter a URL for the course thumbnail image
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="compilerTypeId">Compiler Type ID</Label>
                <Input
                  id="compilerTypeId"
                  placeholder="e.g., python, javascript"
                  value={formData.compilerTypeId}
                  onChange={(e) => handleChange('compilerTypeId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CourseId">Course ID</Label>
                <Input
                  id="CourseId"
                  placeholder="Enter course identifier"
                  value={formData.CourseId}
                  onChange={(e) => handleChange('CourseId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CourseDetail">Course Detail</Label>
                <Input
                  id="CourseDetail"
                  placeholder="Additional course details"
                  value={formData.CourseDetail}
                  onChange={(e) => handleChange('CourseDetail', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
              <Link to="/courses">
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
