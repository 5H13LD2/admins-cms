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

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    moduleId: '',
    difficulty: 'NORMAL',
    timeLimit: '',
    passingScore: '',
    description: '',
    questionNotes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating quiz payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/quizzes');
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

      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., React Hooks Mastery"
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

            <div className="space-y-2">
              <Label htmlFor="questionNotes">Question Bank Notes</Label>
              <Textarea
                id="questionNotes"
                rows={5}
                placeholder="Outline the questions or paste them from your authoring doc..."
                value={formData.questionNotes}
                onChange={(event) => handleChange('questionNotes', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.moduleId}>
                {isSubmitting ? 'Saving...' : 'Publish Quiz'}
              </Button>
              <Link to="/quizzes">
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

