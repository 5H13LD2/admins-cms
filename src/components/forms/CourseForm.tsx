import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type CourseFormData } from '@/types';

interface CourseFormProps {
  initialValues?: Partial<CourseFormData & { duration?: string; moduleCount?: number }>;
  onSubmit: (values: CourseFormData & { duration?: string; moduleCount?: number }) => void;
  isSubmitting?: boolean;
}

const defaultValues: CourseFormData & { duration?: string; moduleCount?: number } = {
  title: '',
  description: '',
  image: '',
  status: 'active',
  duration: '',
  moduleCount: 0,
};

export default function CourseForm({ initialValues, onSubmit, isSubmitting }: CourseFormProps) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof typeof defaultValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Course title *</Label>
        <Input
          id="title"
          required
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status}
            onValueChange={(value) => updateField('status', value as string)}
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
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={values.duration ?? ''}
            onChange={(event) => updateField('duration', event.target.value)}
            placeholder="8 weeks"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moduleCount"># Modules</Label>
          <Input
            id="moduleCount"
            type="number"
            min={0}
            value={values.moduleCount}
            onChange={(event) => updateField('moduleCount', Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Cover image URL</Label>
        <Input
          id="image"
          type="url"
          value={values.image}
          onChange={(event) => updateField('image', event.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Course'}
        </Button>
      </div>
    </form>
  );
}





