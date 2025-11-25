import { assessmentPerformanceChartData } from '@/data/dummyData';

export default function PerformanceChart() {
  const maxValue = Math.max(
    ...assessmentPerformanceChartData.map((point) => point.passed + point.failed),
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
        {assessmentPerformanceChartData.map((point) => {
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
        })}
      </div>
    </div>
  );
}





