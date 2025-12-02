import { useEffect, useState } from 'react';
import { useAssessments } from '@/hooks/useAssessments';
import { useUsers } from '@/hooks/useUsers';

interface AssessmentPerformance {
  category: string;
  passed: number;
  failed: number;
}

export default function PerformanceChart() {
  const { assessments } = useAssessments();
  const { users } = useUsers();
  const [performanceData, setPerformanceData] = useState<AssessmentPerformance[]>([]);

  useEffect(() => {
    if (assessments.length > 0 && users.length > 0) {
      // Group assessments by category
      const categoryMap = new Map<string, { passed: number; failed: number }>();

      assessments.forEach(assessment => {
        const category = assessment.category || 'General';

        if (!categoryMap.has(category)) {
          categoryMap.set(category, { passed: 0, failed: 0 });
        }

        // Count passed/failed from user assessment scores
        users.forEach(user => {
          if (user.assessmentScores && user.assessmentScores[assessment.id]) {
            const score = user.assessmentScores[assessment.id];
            const stats = categoryMap.get(category)!;

            if (score.passed) {
              stats.passed++;
            } else {
              stats.failed++;
            }
          }
        });
      });

      // Convert to array and sort by total submissions
      const performanceArray = Array.from(categoryMap.entries())
        .map(([category, stats]) => ({
          category,
          passed: stats.passed,
          failed: stats.failed
        }))
        .filter(item => item.passed + item.failed > 0) // Only show categories with data
        .sort((a, b) => (b.passed + b.failed) - (a.passed + a.failed))
        .slice(0, 5); // Top 5 categories

      setPerformanceData(performanceArray);
    }
  }, [assessments, users]);

  const maxValue = Math.max(
    ...performanceData.map((point) => point.passed + point.failed),
    1 // Minimum 1 to avoid division by zero
  );

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Assessment Performance</p>
          <p className="text-2xl font-semibold text-foreground">Technical assessments</p>
        </div>
        <span className="text-xs text-muted-foreground">Source: technical_assesment</span>
      </div>
      <div className="space-y-4">
        {performanceData.length > 0 ? (
          performanceData.map((point) => {
            const total = point.passed + point.failed;
            const passedWidth = (point.passed / maxValue) * 100;
            const failedWidth = (point.failed / maxValue) * 100;
            return (
              <div key={point.category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{point.category}</span>
                  <span className="text-muted-foreground">{total} submissions</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-emerald-500" style={{ width: `${passedWidth}%` }} />
                  <div className="h-full bg-red-500" style={{ width: `${failedWidth}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{point.passed} passed</span>
                  <span>{point.failed} failed</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No assessment data available</p>
        )}
      </div>
    </div>
  );
}





