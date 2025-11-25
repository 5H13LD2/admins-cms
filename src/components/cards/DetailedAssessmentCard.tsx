import { Code2, Database, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type TechnicalAssessment } from '@/types';

interface DetailedAssessmentCardProps {
  assessment: TechnicalAssessment;
}

const typeIconMap: Record<TechnicalAssessment['type'], JSX.Element> = {
  code_fix: <Code2 className="h-5 w-5 text-primary" />,
  sql_query: <Database className="h-5 w-5 text-primary" />,
};

export default function DetailedAssessmentCard({ assessment }: DetailedAssessmentCardProps) {
  return (
    <Card className="border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {typeIconMap[assessment.type]}
            {assessment.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {assessment.type.replace('_', ' ')}
            </Badge>
            <Badge className="capitalize">{assessment.difficulty}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{assessment.description}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span>Course ID: {assessment.courseId}</span>
          <span>Category: {assessment.category}</span>
          {assessment.topic && <span>Topic: {assessment.topic}</span>}
        </div>
        {assessment.tags && assessment.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {assessment.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {assessment.brokenCode && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
              Broken Code
            </p>
            <pre className="overflow-x-auto rounded-lg bg-gray-900/90 p-3 text-xs text-white">
              {assessment.brokenCode}
            </pre>
          </div>
        )}
        {assessment.correctCode && (
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
              <CheckCircle className="h-4 w-4" /> Reference Solution
            </p>
            <pre className="overflow-x-auto rounded-lg bg-emerald-900/40 p-3 text-xs text-emerald-100">
              {assessment.correctCode}
            </pre>
          </div>
        )}
        {assessment.expected_query && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
              Expected Query
            </p>
            <pre className="overflow-x-auto rounded-lg bg-gray-900/90 p-3 text-xs text-white">
              {assessment.expected_query}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}





