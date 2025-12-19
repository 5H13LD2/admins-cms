import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { assessmentsService } from '@/services/assessments.service';
import { AssessmentFormData } from '@/types';
import { useToastContext } from '@/context/ToastContext';

export default function CreateAssessmentPage() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const { courses } = useCourses();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    description: '',
    courseId: '',
    difficulty: 'Medium',
    type: 'code_fix',
    category: '',
    tags: [],
    hints: [],
    order: 1,
    brokenCode: '',
    correctCode: '',
    compilerType: 'python',
    correctOutput: '',
    status: 'active',
    expected_query: '',
    sample_table: {
      name: 'users',
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'John' }]
    },
    expected_result: {
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'John' }]
    }
  });

  // Local state for SQL table editing
  const [tableName, setTableName] = useState('users');
  const [tableColumns, setTableColumns] = useState('id, name');
  const [tableRows, setTableRows] = useState('[{"id": 1, "name": "John"}]');

  // Local state for Additional Tables (for JOINs)
  const [additionalTables, setAdditionalTables] = useState<Array<{
    name: string;
    columns: string;
    rows: string;
  }>>([]);

  // Local state for Expected Result editing
  const [expectedColumns, setExpectedColumns] = useState('id, name');
  const [expectedRows, setExpectedRows] = useState('[{"id": 1, "name": "John"}]');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSqlType = formData.type === 'sql' || formData.type === 'sql_query';

  // Add a new additional table
  const addAdditionalTable = () => {
    setAdditionalTables([
      ...additionalTables,
      { name: 'table_name', columns: 'id, name', rows: '[[1, "value"]]' }
    ]);
  };

  // Remove an additional table
  const removeAdditionalTable = (index: number) => {
    setAdditionalTables(additionalTables.filter((_, i) => i !== index));
  };

  // Update an additional table field
  const updateAdditionalTable = (index: number, field: 'name' | 'columns' | 'rows', value: string) => {
    const updated = [...additionalTables];
    updated[index][field] = value;
    setAdditionalTables(updated);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData };

      // Process SQL specific data
      if (isSqlType) {
        try {
          const parsedRows = JSON.parse(tableRows);
          payload.sample_table = {
            name: tableName,
            columns: tableColumns.split(',').map(c => c.trim()),
            rows: parsedRows
          };

          // Process additional tables (for JOINs)
          if (additionalTables.length > 0) {
            payload.additionalTables = additionalTables.map(table => ({
              name: table.name,
              columns: table.columns.split(',').map(c => c.trim()),
              rows: JSON.parse(table.rows)
            }));
          }

          const parsedExpectedRows = JSON.parse(expectedRows);
          payload.expected_result = {
            columns: expectedColumns.split(',').map(c => c.trim()),
            rows: parsedExpectedRows
          };
        } catch (e) {
          toast.error('Invalid JSON in Table Rows or Expected Result');
          setIsSubmitting(false);
          return;
        }
      } else {
        // Clear SQL fields if not SQL type
        delete payload.sample_table;
        delete payload.additionalTables;
        delete payload.expected_query;
        delete payload.expected_result;
      }

      await assessmentsService.create(payload);
      toast.success('Assessment created successfully');
      navigate('/assessments');
    } catch (error) {
      console.error('Failed to create assessment', error);
      toast.error('Failed to create assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Assessment</h1>
          <p className="text-gray-500 mt-1">Launch a new technical challenge</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Fix the Async Function"
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => handleChange('courseId', value)}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  required
                  placeholder="e.g. Python, SQL"
                  value={formData.category}
                  onChange={(event) => handleChange('category', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleChange('difficulty', value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code_fix">Code Fix</SelectItem>
                    <SelectItem value="sql_query">SQL Query</SelectItem>
                    <SelectItem value="brokenCode">Broken Code</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="python, debugging, async"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(event) => handleChange('tags', event.target.value.split(',').map((t: string) => t.trim()))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hints">Hints (comma separated)</Label>
                <Input
                  id="hints"
                  placeholder="Check indentation, Use SELECT *"
                  value={Array.isArray(formData.hints) ? formData.hints.join(', ') : formData.hints}
                  onChange={(event) => handleChange('hints', event.target.value.split(',').map((t: string) => t.trim()))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(event) => handleChange('order', parseInt(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic (Optional)</Label>
              <Input
                id="topic"
                placeholder="e.g., SELECT Basics, Loops, Functions"
                value={formData.topic || ''}
                onChange={(event) => handleChange('topic', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                placeholder="What will the learner fix or build?"
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
              />
            </div>

            {isSqlType ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="expected_query">Expected SQL Query *</Label>
                  <Textarea
                    id="expected_query"
                    rows={3}
                    className="font-mono"
                    placeholder="SELECT * FROM users WHERE..."
                    value={formData.expected_query || ''}
                    onChange={(event) => handleChange('expected_query', event.target.value)}
                  />
                </div>

                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-semibold">Sample Table (Initial State)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tableName">Table Name</Label>
                      <Input
                        id="tableName"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tableColumns">Columns (comma separated)</Label>
                      <Input
                        id="tableColumns"
                        value={tableColumns}
                        onChange={(e) => setTableColumns(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tableRows">Rows (JSON Array)</Label>
                    <Textarea
                      id="tableRows"
                      rows={4}
                      className="font-mono"
                      placeholder='[{"id": 1, "name": "John"}] or [[1, "John"]]'
                      value={tableRows}
                      onChange={(e) => setTableRows(e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Tables Section (for JOIN queries) */}
                <div className="border p-4 rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Additional Tables (for JOINs)</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAdditionalTable}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Table
                    </Button>
                  </div>

                  {additionalTables.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No additional tables. Click "Add Table" to add tables for JOIN queries.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {additionalTables.map((table, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-3 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Table {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdditionalTable(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`addTable${index}Name`}>Table Name</Label>
                              <Input
                                id={`addTable${index}Name`}
                                value={table.name}
                                onChange={(e) => updateAdditionalTable(index, 'name', e.target.value)}
                                placeholder="e.g., enrollments"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`addTable${index}Columns`}>Columns (comma separated)</Label>
                              <Input
                                id={`addTable${index}Columns`}
                                value={table.columns}
                                onChange={(e) => updateAdditionalTable(index, 'columns', e.target.value)}
                                placeholder="e.g., id, student_id, course_id"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`addTable${index}Rows`}>Rows (JSON Array)</Label>
                            <Textarea
                              id={`addTable${index}Rows`}
                              rows={3}
                              className="font-mono text-sm"
                              placeholder='[[1, 1, 1], [2, 2, 2]] or [{"id": 1, "student_id": 1}]'
                              value={table.rows}
                              onChange={(e) => updateAdditionalTable(index, 'rows', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-semibold">Expected Result (After Query)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="expectedColumns">Columns (comma separated)</Label>
                    <Input
                      id="expectedColumns"
                      value={expectedColumns}
                      onChange={(e) => setExpectedColumns(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedRows">Rows (JSON Array)</Label>
                    <Textarea
                      id="expectedRows"
                      rows={4}
                      className="font-mono"
                      placeholder='[{"id": 1, "name": "John"}] or [[1, "John"]]'
                      value={expectedRows}
                      onChange={(e) => setExpectedRows(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="compilerType">Compiler Type</Label>
                    <Select
                      value={formData.compilerType}
                      onValueChange={(value) => handleChange('compilerType', value)}
                    >
                      <SelectTrigger id="compilerType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokenCode">Broken Code / Prompt</Label>
                  <Textarea
                    id="brokenCode"
                    rows={5}
                    className="font-mono"
                    placeholder="Paste buggy code snippet..."
                    value={formData.brokenCode}
                    onChange={(event) => handleChange('brokenCode', event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correctCode">Reference Solution</Label>
                  <Textarea
                    id="correctCode"
                    rows={5}
                    className="font-mono"
                    placeholder="Optional solution for reviewers..."
                    value={formData.correctCode}
                    onChange={(event) => handleChange('correctCode', event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correctOutput">Correct Output (Optional)</Label>
                  <Textarea
                    id="correctOutput"
                    rows={3}
                    className="font-mono"
                    placeholder="Expected output of the code..."
                    value={formData.correctOutput}
                    onChange={(event) => handleChange('correctOutput', event.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.courseId}>
                {isSubmitting ? 'Saving...' : 'Publish Assessment'}
              </Button>
              <Link to="/assessments">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
