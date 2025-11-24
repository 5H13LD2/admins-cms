export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

export interface QuizFormData {
  title: string;
  description?: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  timeLimit?: number;
  passingScore?: number;
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}
