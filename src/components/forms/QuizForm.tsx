import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type QuizFormData } from '@/types';

interface QuizFormProps {
  initialValues?: Partial<QuizFormData>;
  onSubmit: (values: QuizFormData) => void;
  isSubmitting?: boolean;
}

const defaultValues: QuizFormData = {
  title: '',
  description: '',
  difficulty: 'NORMAL',
  timeLimit: 20,
  passingScore: 70,
};

export default function QuizForm({ initialValues, onSubmit, isSubmitting }: QuizFormProps) {
  const [values, setValues] = useState<QuizFormData>({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof QuizFormData, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz title *</Label>
        <Input
          id="title"
          required
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Help authors understand what this quiz measures."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={values.difficulty}
            onValueChange={(value) => updateField('difficulty', value as QuizFormData['difficulty'])}
          >
            <SelectTrigger>
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
          <Label htmlFor="timeLimit">Time limit (minutes)</Label>
          <Input
            id="timeLimit"
            type="number"
            min={5}
            value={values.timeLimit}
            onChange={(event) => updateField('timeLimit', Number(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passingScore">Passing score (%)</Label>
          <Input
            id="passingScore"
            type="number"
            min={0}
            max={100}
            value={values.passingScore}
            onChange={(event) => updateField('passingScore', Number(event.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Quiz'}
        </Button>
      </div>
    </form>
  );
}





