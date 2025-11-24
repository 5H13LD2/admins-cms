import { TechnicalAssessment } from '@/types';

export const dummyAssessments: TechnicalAssessment[] = [
  {
    id: 'assessment-1',
    title: 'Fix the Python Function',
    description: 'Debug and fix the following Python function that calculates the factorial of a number.',
    type: 'code_fix',
    difficulty: 'Easy',
    category: 'Python',
    topic: 'Functions',
    courseId: 'course-1',
    brokenCode: `def factorial(n):
    if n = 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))`,
    correctCode: `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))`,
    tags: ['python', 'functions', 'recursion', 'debugging'],
    status: 'active',
    author: 'Admin',
  },
  {
    id: 'assessment-2',
    title: 'Fix List Comprehension',
    description: 'Fix the list comprehension to correctly filter even numbers.',
    type: 'code_fix',
    difficulty: 'Easy',
    category: 'Python',
    topic: 'List Comprehension',
    courseId: 'course-1',
    brokenCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [x for x in numbers if x % 2 = 0]
print(even_numbers)`,
    correctCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [x for x in numbers if x % 2 == 0]
print(even_numbers)`,
    tags: ['python', 'list-comprehension', 'filtering'],
    status: 'active',
    author: 'Admin',
  },
  {
    id: 'assessment-3',
    title: 'SQL SELECT Query',
    description: 'Write a SQL query to select all employees with a salary greater than 50000.',
    type: 'sql_query',
    difficulty: 'Easy',
    category: 'SQL',
    topic: 'SELECT Statements',
    courseId: 'course-3',
    sample_table: {
      name: 'employees',
      columns: ['id', 'name', 'department', 'salary'],
      rows: [
        { id: 1, name: 'John Doe', department: 'IT', salary: 60000 },
        { id: 2, name: 'Jane Smith', department: 'HR', salary: 45000 },
        { id: 3, name: 'Bob Johnson', department: 'IT', salary: 75000 },
        { id: 4, name: 'Alice Brown', department: 'Marketing', salary: 55000 },
      ],
    },
    expected_query: 'SELECT * FROM employees WHERE salary > 50000;',
    tags: ['sql', 'select', 'where-clause'],
    status: 'active',
    author: 'Admin',
  },
  {
    id: 'assessment-4',
    title: 'SQL JOIN Query',
    description: 'Write a SQL query to join employees with their departments.',
    type: 'sql_query',
    difficulty: 'Medium',
    category: 'SQL',
    topic: 'JOIN Operations',
    courseId: 'course-3',
    sample_table: {
      name: 'employees',
      columns: ['id', 'name', 'dept_id'],
      rows: [
        { id: 1, name: 'John Doe', dept_id: 1 },
        { id: 2, name: 'Jane Smith', dept_id: 2 },
      ],
    },
    expected_query: 'SELECT e.name, d.department_name FROM employees e JOIN departments d ON e.dept_id = d.id;',
    tags: ['sql', 'join', 'relationships'],
    status: 'active',
    author: 'Admin',
  },
  {
    id: 'assessment-5',
    title: 'Fix React Component',
    description: 'Fix the useState hook implementation in this React component.',
    type: 'code_fix',
    difficulty: 'Medium',
    category: 'JavaScript',
    topic: 'React Hooks',
    courseId: 'course-2',
    brokenCode: `import React from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;`,
    correctCode: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;`,
    tags: ['react', 'hooks', 'useState', 'import'],
    status: 'active',
    author: 'Admin',
  },
  {
    id: 'assessment-6',
    title: 'Async/Await Bug Fix',
    description: 'Fix the async/await implementation in this fetch function.',
    type: 'code_fix',
    difficulty: 'Hard',
    category: 'JavaScript',
    topic: 'Async Programming',
    courseId: 'course-2',
    brokenCode: `async function fetchData() {
  const response = fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}`,
    correctCode: `async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}`,
    tags: ['javascript', 'async-await', 'promises', 'fetch'],
    status: 'active',
    author: 'Admin',
  },
];
