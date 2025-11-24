export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  duration: string;
  order: number;
  videoUrl?: string;
  resources?: LessonResource[];
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'video' | 'document';
}

export interface LessonFormData {
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  order: number;
}
