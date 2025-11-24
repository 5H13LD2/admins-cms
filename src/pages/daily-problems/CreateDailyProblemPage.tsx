import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateDailyProblemPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    type: 'code',
    description: '',
    content: '',
    solution: '',
    hints: '',
    points: '10',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating daily problem payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/daily-problems');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>

      <div className="flex items-center gap-4 mb-6">
        <Link to="/daily-problems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Problem</h1>
          <p className="text-gray-500 mt-1">Queue the next coding challenge</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Reverse Linked List"
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
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Problem Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="algorithm">Algorithm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="5"
                  placeholder="10"
                  value={formData.points}
                  onChange={(event) => handleChange('points', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                required
                placeholder="Short teaser that appears in the daily feed..."
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt *</Label>
              <Textarea
                id="content"
                rows={5}
                required
                placeholder="Provide full instructions, examples, and input/output expectations..."
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solution (private)</Label>
              <Textarea
                id="solution"
                rows={4}
                placeholder="Optional reference solution..."
                value={formData.solution}
                onChange={(event) => handleChange('solution', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hints">Hints</Label>
              <Input
                id="hints"
                placeholder="Separate hints with commas"
                value={formData.hints}
                onChange={(event) => handleChange('hints', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Publish Problem'}
              </Button>
              <Link to="/daily-problems">
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

