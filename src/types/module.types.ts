export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  image?: string;
  order: number;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface ModuleFormData {
  title: string;
  description: string;
  duration: string;
  image?: string;
  order: number;
}
