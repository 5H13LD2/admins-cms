import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type LessonFormData } from '@/types';

interface LessonFormProps {
  initialValues?: Partial<LessonFormData>;
  onSubmit: (values: LessonFormData) => void;
  isSubmitting?: boolean;
}

const defaultValues: LessonFormData = {
  title: '',
  content: '',
  duration: '',
  order: 1,
  videoUrl: '',
};

export default function LessonForm({ initialValues, onSubmit, isSubmitting }: LessonFormProps) {
  const [values, setValues] = useState<LessonFormData>({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof LessonFormData, value: string | number) => {
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
          <Label htmlFor="title">Lesson title *</Label>
          <Input
            id="title"
            required
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            required
            value={values.duration}
            onChange={(event) => updateField('duration', event.target.value)}
            placeholder="20 min"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          required
          rows={6}
          value={values.content}
          onChange={(event) => updateField('content', event.target.value)}
          placeholder="Enter lesson transcript, resources, or instructions..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order">Order *</Label>
          <Input
            id="order"
            type="number"
            min={1}
            value={values.order}
            onChange={(event) => updateField('order', Number(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            type="url"
            value={values.videoUrl}
            onChange={(event) => updateField('videoUrl', event.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Lesson'}
        </Button>
      </div>
    </form>
  );
}





