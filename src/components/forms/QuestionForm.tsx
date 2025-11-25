import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type QuestionFormData } from '@/types';

interface QuestionFormProps {
  initialValues?: Partial<QuestionFormData>;
  onSubmit: (values: QuestionFormData) => void;
  isSubmitting?: boolean;
}

const defaultValues: QuestionFormData = {
  question: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
};

export default function QuestionForm({ initialValues, onSubmit, isSubmitting }: QuestionFormProps) {
  const [values, setValues] = useState<QuestionFormData>({ ...defaultValues, ...initialValues });

  const updateOption = (index: number, value: string) => {
    setValues((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Textarea
          id="question"
          required
          rows={3}
          value={values.question}
          onChange={(event) => setValues((prev) => ({ ...prev, question: event.target.value }))}
          placeholder="What is the output of console.log(typeof null)?"
        />
      </div>

      <div className="space-y-3">
        <Label>Options *</Label>
        {values.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <Input
              required
              value={option}
              onChange={(event) => updateOption(index, event.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <label className="flex items-center gap-1 text-xs text-muted-foreground">
              <input
                type="radio"
                name="correct"
                checked={values.correctOptionIndex === index}
                onChange={() => setValues((prev) => ({ ...prev, correctOptionIndex: index }))}
              />
              Correct
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          rows={3}
          value={values.explanation}
          onChange={(event) => setValues((prev) => ({ ...prev, explanation: event.target.value }))}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Question'}
        </Button>
      </div>
    </form>
  );
}





