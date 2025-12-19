import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Snowfall from '@/components/common/Snowfall';

export default function CreateAchievementPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'course',
    icon: '',
    points: '',
    criteriaType: 'complete_course',
    target: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Creating achievement payload', formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/achievements');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/achievements">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Achievement</h1>
          <p className="text-gray-500 mt-1">Design a new badge or milestone</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Perfect Streak"
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                placeholder="Explain how learners unlock this achievement..."
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon / Emoji</Label>
                <Input
                  id="icon"
                  placeholder="🏆"
                  value={formData.icon}
                  onChange={(event) => handleChange('icon', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.points}
                  onChange={(event) => handleChange('points', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criteriaType">Criteria Type</Label>
                <Select
                  value={formData.criteriaType}
                  onValueChange={(value) => handleChange('criteriaType', value)}
                >
                  <SelectTrigger id="criteriaType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete_course">Complete Course</SelectItem>
                    <SelectItem value="complete_quiz">Complete Quiz</SelectItem>
                    <SelectItem value="pass_assessment">Pass Assessment</SelectItem>
                    <SelectItem value="login_streak">Login Streak</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target (optional)</Label>
              <Input
                id="target"
                placeholder="e.g., 10"
                value={formData.target}
                onChange={(event) => handleChange('target', event.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Publish Achievement'}
              </Button>
              <Link to="/achievements">
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

