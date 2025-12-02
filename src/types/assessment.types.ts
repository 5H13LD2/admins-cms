export interface TechnicalAssessment {
  id: string;
  title: string;
  description: string;

  // TYPE OF ASSESSMENT
  type: 'code_fix' | 'sql_query' | 'brokenCode' | 'sql';

  // DIFFICULTY LEVEL
  difficulty: 'Easy' | 'Medium' | 'Hard';

  // CATEGORY → e.g. "Java", "Python", "SQL"
  category: string;

  // TOPIC (optional) → e.g. "Loops", "JOIN", "Functions"
  topic?: string;

  // LINKED COURSE ID
  courseId: string;

  // FOR CODE FIX TYPE
  brokenCode?: string;
  correctCode?: string;
  compilerType?: string;
  correctOutput?: string;

  // FOR SQL QUERY TYPE
  sample_table?: SampleTable;
  expected_query?: string;
  expected_result?: SampleTable;

  // EXTRA METADATA
  tags?: string[];
  hints?: string[];
  order?: number;
  status: 'active' | 'inactive';
  author?: string;

  // SYSTEM FIELDS
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface SampleTable {
  name?: string;          // Table name (optional for expected_result)
  columns: string[];     // Example: ["id", "name", "age"]
  rows: any[] | string;  // Example: [{ id: 1... }] or "[[1, ...]]"
}

export interface AssessmentFormData {
  title: string;
  description: string;

  type: 'code_fix' | 'sql_query' | 'brokenCode' | 'sql';

  difficulty: 'Easy' | 'Medium' | 'Hard';

  category: string;
  topic?: string;
  courseId: string;

  // FOR CODE FIX TYPE
  brokenCode?: string;
  correctCode?: string;
  compilerType?: string;
  correctOutput?: string;

  // FOR SQL QUERY TYPE
  sample_table?: SampleTable;
  expected_query?: string;
  expected_result?: SampleTable;

  tags?: string[];
  hints?: string[];
  order?: number;
  status: 'active' | 'inactive';
}
