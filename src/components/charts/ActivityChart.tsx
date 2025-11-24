import { activityChartData } from '@/data/dummyData';

export default function ActivityChart() {
  const maxValue = Math.max(...activityChartData.map((point) => Math.max(point.logins, point.dailyProblems)));

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Engagement</p>
          <p className="text-2xl font-semibold text-foreground">Logins & daily problems</p>
        </div>
        <span className="text-xs text-muted-foreground">Sources: login_tracking & daily_problem_progress</span>
      </div>
      <div className="flex items-end gap-4">
        {activityChartData.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-2 text-xs text-muted-foreground">
            <div className="flex w-full flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{ height: `${(point.logins / maxValue) * 120}px` }}
                title={`${point.logins} logins`}
              />
              <div
                className="w-full rounded-b-md bg-amber-400/80"
                style={{ height: `${(point.dailyProblems / maxValue) * 120}px` }}
                title={`${point.dailyProblems} problems`}
              />
            </div>
            <span>{point.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-primary/80" /> Logins
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-amber-400/80" /> Daily challenge submissions
        </div>
      </div>
    </div>
  );
}

