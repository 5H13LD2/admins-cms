import { courseProgressChartData } from '@/data/dummyData';

export default function ProgressChart() {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Course Completion</p>
          <p className="text-2xl font-semibold text-foreground">Learning progress</p>
        </div>
        <span className="text-xs text-muted-foreground">Source: user_progress</span>
      </div>
      <div className="space-y-4">
        {courseProgressChartData.map((point) => (
          <div key={point.courseId}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{point.courseName}</span>
              <span className="text-muted-foreground">{point.completionRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${point.completionRate}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {point.activeLearners} active learners
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

