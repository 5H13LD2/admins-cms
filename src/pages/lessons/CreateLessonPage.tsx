import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyModules } from '@/data/dummyData';

export default function CreateLessonPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    moduleId: '',
    duration: '',
    order: '',
    videoUrl: '',
    content: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating lesson payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/lessons');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>


      <div className="flex items-center gap-4 mb-6">
        <Link to="/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Lesson</h1>
          <p className="text-gray-500 mt-1">Draft a focused learning experience</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Functions in Python"
                  required
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select
                  value={formData.moduleId}
                  onValueChange={(value) => handleChange('moduleId', value)}
                >
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyModules.map((module) => (
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
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 20 min"
                  value={formData.duration}
                  onChange={(event) => handleChange('duration', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Lesson Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.order}
                  onChange={(event) => handleChange('order', event.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="content">Lesson Content *</Label>
              <Textarea
                id="content"
                rows={6}
                required
                placeholder="Add lesson transcript, instructions, or code snippets..."
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.moduleId}>
                {isSubmitting ? 'Publishing...' : 'Publish Lesson'}
              </Button>
              <Link to="/lessons">
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

