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

export default function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    difficulty: 'Medium',
    type: 'code_fix',
    tags: '',
    brokenCode: '',
    correctCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating assessment payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/assessments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>


      <div className="flex items-center gap-4 mb-6">
        <Link to="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Assessment</h1>
          <p className="text-gray-500 mt-1">Launch a new technical challenge</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Fix the Async Function"
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
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code_fix">Code Fix</SelectItem>
                    <SelectItem value="sql_query">SQL Query</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="python, debugging, async"
                  value={formData.tags}
                  onChange={(event) => handleChange('tags', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                placeholder="What will the learner fix or build?"
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brokenCode">Broken Code / Prompt</Label>
              <Textarea
                id="brokenCode"
                rows={5}
                placeholder="Paste buggy code snippet or SQL instructions..."
                value={formData.brokenCode}
                onChange={(event) => handleChange('brokenCode', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correctCode">Reference Solution</Label>
              <Textarea
                id="correctCode"
                rows={5}
                placeholder="Optional solution for reviewers..."
                value={formData.correctCode}
                onChange={(event) => handleChange('correctCode', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.courseId}>
                {isSubmitting ? 'Saving...' : 'Publish Assessment'}
              </Button>
              <Link to="/assessments">
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

