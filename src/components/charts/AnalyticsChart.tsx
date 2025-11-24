import { feedbackAnalyticsData } from '@/data/dummyData';

const palette = ['#6366f1', '#8b5cf6', '#f97316', '#10b981'];

export default function AnalyticsChart() {
  const total = feedbackAnalyticsData.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Feedback Pipeline</p>
          <p className="text-2xl font-semibold text-foreground">Feedback status</p>
        </div>
        <span className="text-xs text-muted-foreground">Source: feedback</span>
      </div>
      <div className="space-y-4">
        {feedbackAnalyticsData.map((point, index) => {
          const percentage = Math.round((point.value / total) * 100);
          return (
            <div key={point.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-6 rounded-full"
                    style={{ backgroundColor: palette[index % palette.length] }}
                  />
                  <span className="text-foreground">{point.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {point.value} ({percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: palette[index % palette.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

