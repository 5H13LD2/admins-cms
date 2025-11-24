export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date | any;
  updatedAt: Date | any;
  status?: 'active' | 'inactive';
  moduleCount?: number;
  duration?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  image?: string;
  status?: 'active' | 'inactive';
}
