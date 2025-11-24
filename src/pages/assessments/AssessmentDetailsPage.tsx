import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BugPlay, Hammer, Database } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyAssessments, dummyCourses } from '@/data/dummyData';

export default function AssessmentDetailsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const assessment = dummyAssessments.find((item) => item.id === assessmentId);
  const course = assessment ? dummyCourses.find((c) => c.id === assessment.courseId) : undefined;

  if (!assessment) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Assessment not found</CardTitle>
            <CardDescription>The requested assessment is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/assessments">
              <Button>Back to Assessments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const icon = assessment.type === 'code_fix' ? BugPlay : Database;

  return (
    <div>


      <div className="flex items-center gap-4 mb-6">
        <Link to="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>
          <p className="text-gray-500 mt-1">Hands-on technical challenge</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {assessment.difficulty}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Course Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold text-gray-900">{course?.title ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">{assessment.category}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Assessment Type</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              {icon === BugPlay ? <BugPlay className="h-5 w-5" /> : <Database className="h-5 w-5" />}
            </div>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {assessment.type.replace('_', ' ')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Hammer className="h-5 w-5" />
            </div>
            <p className="text-base font-semibold capitalize">{assessment.status}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>{assessment.topic}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{assessment.description}</p>
        </CardContent>
      </Card>

      {assessment.brokenCode && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Broken Code</CardTitle>
            <CardDescription>Prompt learners to identify and fix bugs</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100 overflow-auto">
              {assessment.brokenCode}
            </pre>
          </CardContent>
        </Card>
      )}

      {assessment.correctCode && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reference Solution</CardTitle>
            <CardDescription>For reviewer-only visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100 overflow-auto">
              {assessment.correctCode}
            </pre>
          </CardContent>
        </Card>
      )}

      {assessment.sample_table && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Data</CardTitle>
            <CardDescription>{assessment.sample_table.name}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  {assessment.sample_table.columns.map((column) => (
                    <th key={column} className="border-b px-3 py-2 font-semibold text-gray-600">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assessment.sample_table.rows.map((row, index) => (
                  <tr key={`${assessment.id}-row-${index}`} className="border-b last:border-b-0">
                    {assessment.sample_table?.columns.map((column) => (
                      <td key={`${column}-${index}`} className="px-3 py-2 text-gray-700">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

