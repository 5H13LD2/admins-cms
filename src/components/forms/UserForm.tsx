import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student' | 'instructor';
  status: 'online' | 'offline';
  bio: string;
}

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting?: boolean;
}

const defaultValues: UserFormValues = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'student',
  status: 'offline',
  bio: '',
};

export default function UserForm({ initialValues, onSubmit, isSubmitting }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({ ...defaultValues, ...initialValues });

  const updateField = (field: keyof UserFormValues, value: string) => {
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
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            required
            value={values.username}
            onChange={(event) => updateField('username', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={values.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={values.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={values.role} onValueChange={(value) => updateField('role', value as UserFormValues['role'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status}
            onValueChange={(value) => updateField('status', value as UserFormValues['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          value={values.bio}
          onChange={(event) => updateField('bio', event.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save User'}
        </Button>
      </div>
    </form>
  );
}





