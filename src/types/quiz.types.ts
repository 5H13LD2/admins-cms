export interface Quiz {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  passingScore?: number;
  timeLimit?: number;
  questionCount?: number;
  questions?: Question[];
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  order: number;
  points?: number;
  module_id?: string;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface QuizFormData {
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  passingScore?: number;
  questions: QuestionFormData[];
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  order: number;
}
