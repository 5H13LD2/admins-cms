export interface DailyChallenge {
    compilerType: string;        // "javacompiler" | "pythoncompiler"
    courseId: string;            // "java" | "python"
    createdAt: Date;             // Firebase timestamp converted to JS Date
    description: string;
    difficulty: "easy" | "medium" | "hard";
    expiredAt: Date;             // Firebase timestamp converted to JS Date
    hints: string[];
    isActive: boolean;
    points: number;
    problemStatement: string;
    tags: string[];
    testCases: TestCase[];
    title: string;
  }
  
  export interface TestCase {
    input: string;               // raw string input from Firebase
    expectedOutput: string;
    isHidden: boolean;
  }
  