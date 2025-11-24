export interface TechnicalAssessment {
  id: string;
  title: string;
  description: string;
  type: 'code_fix' | 'sql_query';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topic?: string;
  courseId: string;
  brokenCode?: string;
  correctCode?: string;
  sample_table?: SampleTable;
  expected_query?: string;
  tags?: string[];
  status: 'active' | 'inactive';
  author?: string;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface SampleTable {
  name: string;
  columns: string[];
  rows: any[];
}

export interface AssessmentFormData {
  title: string;
  description: string;
  type: 'code_fix' | 'sql_query';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topic?: string;
  courseId: string;
  brokenCode?: string;
  correctCode?: string;
  sample_table?: SampleTable;
  expected_query?: string;
  tags?: string[];
  status: 'active' | 'inactive';
}
