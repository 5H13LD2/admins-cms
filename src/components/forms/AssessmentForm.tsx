import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type AssessmentFormData, type Course } from '@/types';

interface AssessmentFormProps {
  initialValues?: Partial<AssessmentFormData>;
  onSubmit: (values: AssessmentFormData) => void;
  isSubmitting?: boolean;
  courses?: Course[];
}

const defaultValues: AssessmentFormData = {
  title: '',
  description: '',
  type: 'code_fix',
  difficulty: 'Easy',
  category: '',
  topic: '',
  courseId: '',
  brokenCode: '',
  correctCode: '',
  expected_query: '',
  status: 'active',
  tags: [],
};

export default function AssessmentForm({
  initialValues,
  onSubmit,
  isSubmitting,
  courses = [],
}: AssessmentFormProps) {
  const [values, setValues] = useState<AssessmentFormData>({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof AssessmentFormData, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment title *</Label>
          <Input
            id="title"
            required
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseId">Course *</Label>
          <Select value={values.courseId} onValueChange={(courseId) => updateField('courseId', courseId)}>
            <SelectTrigger id="courseId">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
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
          required
          rows={4}
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={values.type}
            onValueChange={(value) => updateField('type', value as AssessmentFormData['type'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code_fix">Code fix</SelectItem>
              <SelectItem value="sql_query">SQL query</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={values.difficulty}
            onValueChange={(value) =>
              updateField('difficulty', value as AssessmentFormData['difficulty'])
            }
          >
            <SelectTrigger>
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
          <Label>Status</Label>
          <Select
            value={values.status}
            onValueChange={(value) => updateField('status', value as AssessmentFormData['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            required
            value={values.category}
            onChange={(event) => updateField('category', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={values.topic}
            onChange={(event) => updateField('topic', event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={values.tags?.join(', ') ?? ''}
          onChange={(event) => updateField('tags', event.target.value.split(',').map((tag) => tag.trim()))}
          placeholder="python, debugging, async"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brokenCode">Broken code (optional)</Label>
        <Textarea
          id="brokenCode"
          rows={4}
          value={values.brokenCode}
          onChange={(event) => updateField('brokenCode', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="correctCode">Reference solution</Label>
        <Textarea
          id="correctCode"
          rows={4}
          value={values.correctCode}
          onChange={(event) => updateField('correctCode', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedQuery">Expected query</Label>
        <Textarea
          id="expectedQuery"
          rows={3}
          value={values.expected_query}
          onChange={(event) => updateField('expected_query', event.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Assessment'}
        </Button>
      </div>
    </form>
  );
}





