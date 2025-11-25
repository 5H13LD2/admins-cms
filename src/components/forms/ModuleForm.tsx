import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type ModuleFormData, type Course } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ModuleFormValues = ModuleFormData & {
  courseId?: string;
  lessons?: number;
};

interface ModuleFormProps {
  courses?: Course[];
  initialValues?: Partial<ModuleFormValues>;
  onSubmit: (values: ModuleFormValues) => void;
  isSubmitting?: boolean;
}

const defaultValues: ModuleFormValues = {
  title: '',
  description: '',
  duration: '',
  image: '',
  order: 1,
  courseId: '',
  lessons: 1,
};

export default function ModuleForm({
  courses = [],
  initialValues,
  onSubmit,
  isSubmitting,
}: ModuleFormProps) {
  const [values, setValues] = useState<ModuleFormValues>({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof ModuleFormValues, value: string | number) => {
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
          <Label htmlFor="title">Module title *</Label>
          <Input
            id="title"
            required
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Control Flow & Functions"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Parent course</Label>
          <Select value={values.courseId} onValueChange={(courseId) => updateField('courseId', courseId)}>
            <SelectTrigger id="course">
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
          placeholder="Describe what learners will complete in this module."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={values.duration}
            onChange={(event) => updateField('duration', event.target.value)}
            placeholder="3 hours"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lessons"># of lessons</Label>
          <Input
            id="lessons"
            type="number"
            min={1}
            value={values.lessons}
            onChange={(event) => updateField('lessons', Number(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display order</Label>
          <Input
            id="order"
            type="number"
            min={1}
            value={values.order}
            onChange={(event) => updateField('order', Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Thumbnail URL</Label>
        <Input
          id="image"
          value={values.image}
          onChange={(event) => updateField('image', event.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Module'}
        </Button>
      </div>
    </form>
  );
}





