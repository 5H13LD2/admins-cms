export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date | any;
  updatedAt: Date | any;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  moduleCount?: number;
  duration?: string;
  enrolledUsers?: string[];
  compilerTypeId?: string;
  CourseId?: string;
  CourseDetail?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  image?: string;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  enrolledUsers?: string[];
  compilerTypeId?: string;
  CourseId?: string;
  CourseDetail?: string;
}
