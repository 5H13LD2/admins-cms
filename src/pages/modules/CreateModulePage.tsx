import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyCourses } from '@/data/dummyData';

export default function CreateModulePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    lessons: '',
    order: '',
    image: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating module payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/modules');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


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

      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => handleChange('courseId', value)}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  min="1"
                  placeholder="e.g., 8"
                  value={formData.lessons}
                  onChange={(event) => handleChange('lessons', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.order}
                  onChange={(event) => handleChange('order', event.target.value)}
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
              <Button type="submit" disabled={isSubmitting || !formData.courseId}>
                {isSubmitting ? 'Saving...' : 'Create Module'}
              </Button>
              <Link to="/modules">
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

